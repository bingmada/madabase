import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import nextEnv from "@next/env";
import { Pool } from "pg";
import { buildInventory, siteTrackingIds } from "./check-affiliate-links.mjs";

const root = path.resolve(new URL("../../..", import.meta.url).pathname);
nextEnv.loadEnvConfig(path.join(root, "apps/affiliate"));
const defaultAsinMapPath = path.join(root, "apps/affiliate/config/amazon-market-asins.json");
const asinMapPath = path.resolve(root, process.env.AMAZON_CREATORS_ASIN_MAP_PATH ?? defaultAsinMapPath);
const credentialId = process.env.AMAZON_CREATORS_CREDENTIAL_ID;
const credentialSecret = process.env.AMAZON_CREATORS_CREDENTIAL_SECRET;
const credentialVersion = process.env.AMAZON_CREATORS_CREDENTIAL_VERSION ?? "3.1";
const databaseUrl = process.env.DATABASE_URL;
const inventoryOnly = process.argv.includes("--inventory");
const dryRun = process.argv.includes("--dry-run");
const probeOnly = process.argv.includes("--probe");
const marketArgument = process.argv.find((argument) => argument.startsWith("--market="));
const requestedMarket = marketArgument?.slice("--market=".length) ?? "us";
const supportedSites = new Set(["network", "smarthome", "homeoffice", "baby", "pet", "style"]);

const marketConfigs = {
  us: { marketplace: "www.amazon.com", language: "en_US" },
  gb: { marketplace: "www.amazon.co.uk", language: "en_GB" },
  ca: { marketplace: "www.amazon.ca", language: "en_CA" },
  de: { marketplace: "www.amazon.de", language: "de_DE" },
  nl: { marketplace: "www.amazon.nl", language: "nl_NL" },
};

const tokenEndpoints = {
  "3.1": "https://api.amazon.com/auth/o2/token",
  "3.2": "https://api.amazon.co.uk/auth/o2/token",
  "3.3": "https://api.amazon.co.jp/auth/o2/token",
};

if (requestedMarket !== "all" && !marketConfigs[requestedMarket]) {
  throw new Error(`Unsupported --market value: ${requestedMarket}`);
}
if (!tokenEndpoints[credentialVersion]) {
  throw new Error("AMAZON_CREATORS_CREDENTIAL_VERSION must be 3.1, 3.2, or 3.3");
}

function readAsinMap() {
  if (!fs.existsSync(asinMapPath)) {
    throw new Error(`Amazon market ASIN map does not exist: ${asinMapPath}`);
  }
  const parsed = JSON.parse(fs.readFileSync(asinMapPath, "utf8"));
  if (!parsed || typeof parsed !== "object" || !parsed.products || typeof parsed.products !== "object") {
    throw new Error("Amazon market ASIN map must contain a products object");
  }
  return parsed.products;
}

function productInventory() {
  const records = new Map();
  for (const item of buildInventory()) {
    if (!item.site || !item.slug || !item.expectedAsin || !supportedSites.has(item.site)) continue;
    const key = `${item.site}:${item.slug}`;
    if (!records.has(key)) {
      records.set(key, {
        site: item.site,
        slug: item.slug,
        usAsin: item.expectedAsin,
      });
    }
  }
  return [...records.values()].sort((a, b) => `${a.site}:${a.slug}`.localeCompare(`${b.site}:${b.slug}`));
}

function asinFor(record, market, marketAsins) {
  if (market === "us") return record.usAsin;
  const value = marketAsins[`${record.site}:${record.slug}`]?.[market];
  return typeof value === "string" && /^[A-Z0-9]{10}$/.test(value) ? value : undefined;
}

function envSegment(value) {
  return value.replace(/[^a-z0-9]+/gi, "_").toUpperCase();
}

function partnerTagFor(market, site) {
  if (market === "us") return siteTrackingIds[site];
  const marketName = envSegment(market);
  const siteName = envSegment(site);
  return (
    process.env[`AMAZON_CREATORS_PARTNER_TAG_${marketName}_${siteName}`]
    ?? process.env[`AMAZON_CREATORS_PARTNER_TAG_${marketName}`]
  );
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

class CreatorsApiError extends Error {
  constructor(message, { status, type, reason, retryAfterSeconds } = {}) {
    super(message);
    this.name = "CreatorsApiError";
    this.status = status;
    this.type = type;
    this.reason = reason;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

async function responseJson(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text.slice(0, 500) };
  }
}

function apiErrorCode(data) {
  const direct = [
    data.reason,
    data.code,
    data.error?.code,
    data.errors?.[0]?.code,
    data.errors?.[0]?.reason,
    data.details?.[0]?.code,
    data.details?.[0]?.reason,
  ].find((value) => typeof value === "string" && value);
  if (direct) return direct;
  if (typeof data.type === "string") return data.type.split(/[/:#]/).filter(Boolean).at(-1);
  return undefined;
}

let tokenCache;

async function accessToken(forceRefresh = false) {
  if (!forceRefresh && tokenCache && tokenCache.refreshAt > Date.now()) return tokenCache.value;

  const response = await fetch(tokenEndpoints[credentialVersion], {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: credentialId,
      client_secret: credentialSecret,
      scope: "creatorsapi::default",
    }),
    signal: AbortSignal.timeout(20_000),
  });
  const data = await responseJson(response);
  if (!response.ok || typeof data.access_token !== "string") {
    throw new CreatorsApiError(data.error_description ?? data.message ?? "Unable to fetch Creators API access token", {
      status: response.status,
      type: data.error,
      retryAfterSeconds: Number(response.headers.get("retry-after") ?? 0) || undefined,
    });
  }

  const expiresIn = Number(data.expires_in ?? 3600);
  tokenCache = {
    value: data.access_token,
    refreshAt: Date.now() + Math.max(60, expiresIn - 60) * 1000,
  };
  return tokenCache.value;
}

let lastCatalogRequestAt = 0;

async function paceCatalogRequest() {
  const remaining = 1050 - (Date.now() - lastCatalogRequestAt);
  if (remaining > 0) await sleep(remaining);
  lastCatalogRequestAt = Date.now();
}

async function getItems({ market, partnerTag, itemIds }) {
  const config = marketConfigs[market];
  let forceTokenRefresh = false;

  for (let attempt = 1; attempt <= 4; attempt += 1) {
    await paceCatalogRequest();
    const token = await accessToken(forceTokenRefresh);
    forceTokenRefresh = false;
    const response = await fetch("https://creatorsapi.amazon/catalog/v1/getItems", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        "x-marketplace": config.marketplace,
      },
      body: JSON.stringify({
        itemIds,
        itemIdType: "ASIN",
        languagesOfPreference: [config.language],
        marketplace: config.marketplace,
        partnerTag,
        resources: [
          "images.primary.large",
          "images.primary.medium",
          "itemInfo.title",
          "itemInfo.features",
          "parentASIN",
        ],
      }),
      signal: AbortSignal.timeout(25_000),
    });
    const data = await responseJson(response);
    if (response.ok) return data;
    const reason = apiErrorCode(data);

    const error = new CreatorsApiError(data.message ?? `Creators API request failed with HTTP ${response.status}`, {
      status: response.status,
      type: data.type,
      reason,
      retryAfterSeconds: Number(data.retryAfterSeconds ?? response.headers.get("retry-after") ?? 0) || undefined,
    });

    if (response.status === 401 && reason === "TokenExpired" && attempt < 4) {
      tokenCache = undefined;
      forceTokenRefresh = true;
      continue;
    }
    if ((response.status === 429 || response.status >= 500) && attempt < 4) {
      const waitSeconds = Math.min(300, error.retryAfterSeconds ?? 2 ** attempt);
      await sleep(waitSeconds * 1000);
      continue;
    }
    throw error;
  }

  throw new CreatorsApiError("Creators API retry limit exhausted");
}

function responseItems(data) {
  return data.itemResults?.items ?? data.itemsResult?.items ?? [];
}

function amazonDetailUrl(value, config, partnerTag) {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value);
    const marketplaceHost = config.marketplace.replace(/^www\./, "");
    if (url.protocol !== "https:") return undefined;
    if (url.hostname !== config.marketplace && url.hostname !== marketplaceHost) return undefined;
    if (url.searchParams.get("tag") !== partnerTag) return undefined;
    return value;
  } catch {
    return undefined;
  }
}

function imageUrl(item) {
  return (
    item.images?.primary?.large?.url
    ?? item.images?.primary?.medium?.url
    ?? item.images?.primary?.small?.url
  );
}

function featureValues(item) {
  const values = item.itemInfo?.features?.displayValues;
  return Array.isArray(values) ? values.filter((value) => typeof value === "string").slice(0, 8) : [];
}

let databasePool;

function pool() {
  if (!databasePool) databasePool = new Pool({ connectionString: databaseUrl, max: 2 });
  return databasePool;
}

async function saveSnapshot({ record, market, asin, item, partnerTag }) {
  const config = marketConfigs[market];
  const detailPageUrl = amazonDetailUrl(item.detailPageURL ?? item.detailPageUrl, config, partnerTag);
  if (!detailPageUrl) {
    throw new Error(`Creators API returned an invalid or unattributed detail URL for ${record.site}:${record.slug}`);
  }
  const fetchedAt = new Date();
  // The official TTL is one day for DetailPageURL, Images, and ItemInfo.
  // Use 23 hours to leave a conservative refresh margin.
  const expiresAt = new Date(fetchedAt.getTime() + 23 * 60 * 60 * 1000);
  const features = featureValues(item);

  if (!dryRun && !probeOnly) {
    await pool().query(
      `INSERT INTO "AmazonProductSnapshot" (
        "id", "site", "market", "productSlug", "asin", "marketplace",
        "detailPageUrl", "title", "imageUrl", "features", "parentAsin",
        "fetchedAt", "expiresAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8, $9, $10::jsonb, $11,
        $12, $13, CURRENT_TIMESTAMP
      )
      ON CONFLICT ("site", "market", "productSlug") DO UPDATE SET
        "asin" = EXCLUDED."asin",
        "marketplace" = EXCLUDED."marketplace",
        "detailPageUrl" = EXCLUDED."detailPageUrl",
        "title" = EXCLUDED."title",
        "imageUrl" = EXCLUDED."imageUrl",
        "features" = EXCLUDED."features",
        "parentAsin" = EXCLUDED."parentAsin",
        "fetchedAt" = EXCLUDED."fetchedAt",
        "expiresAt" = EXCLUDED."expiresAt",
        "lastErrorCode" = NULL,
        "lastErrorAt" = NULL,
        "updatedAt" = CURRENT_TIMESTAMP`,
      [
        crypto.randomUUID(),
        record.site,
        market,
        record.slug,
        asin,
        config.marketplace,
        detailPageUrl,
        item.itemInfo?.title?.displayValue ?? null,
        imageUrl(item) ?? null,
        JSON.stringify(features),
        item.parentASIN ?? item.parentAsin ?? null,
        fetchedAt,
        expiresAt,
      ],
    );
  }
}

async function noteSnapshotError(record, market, code) {
  if (dryRun || probeOnly || !databaseUrl) return;
  await pool().query(
    `UPDATE "AmazonProductSnapshot"
      SET "lastErrorCode" = $1, "lastErrorAt" = CURRENT_TIMESTAMP, "updatedAt" = CURRENT_TIMESTAMP
      WHERE "site" = $2 AND "market" = $3 AND "productSlug" = $4`,
    [String(code).slice(0, 80), record.site, market, record.slug],
  );
}

function credentialsMissing() {
  return [
    ["AMAZON_CREATORS_CREDENTIAL_ID", credentialId],
    ["AMAZON_CREATORS_CREDENTIAL_SECRET", credentialSecret],
  ].filter(([, value]) => !value);
}

async function main() {
  const records = productInventory();
  const marketAsins = readAsinMap();
  const markets = requestedMarket === "all" ? Object.keys(marketConfigs) : [requestedMarket];

  if (inventoryOnly) {
    console.log(`Amazon Creators inventory: ${records.length} exact US ASIN-backed products.`);
    for (const market of markets) {
      const mapped = records.filter((record) => asinFor(record, market, marketAsins)).length;
      const configuredSites = [...new Set(records.map((record) => record.site))]
        .filter((site) => Boolean(partnerTagFor(market, site)));
      console.log(`${market}: ${mapped} ASIN mappings; ${configuredSites.length} site partner-tag configurations.`);
    }
    return;
  }

  const missing = credentialsMissing();
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.map(([key]) => key).join(", ")}`);
  }
  if (!dryRun && !probeOnly && !databaseUrl) {
    throw new Error("DATABASE_URL is required unless --dry-run or --probe is used");
  }

  const candidates = markets.flatMap((market) =>
    records.flatMap((record) => {
      const asin = asinFor(record, market, marketAsins);
      const partnerTag = partnerTagFor(market, record.site);
      return asin && partnerTag ? [{ market, record, asin, partnerTag }] : [];
    }),
  );

  if (!candidates.length) {
    throw new Error("No products have both an exact ASIN mapping and valid configured Partner Tag for the requested market");
  }

  if (probeOnly) {
    const candidate = candidates[0];
    const data = await getItems({
      market: candidate.market,
      partnerTag: candidate.partnerTag,
      itemIds: [candidate.asin],
    });
    const item = responseItems(data).find((entry) => entry.asin === candidate.asin);
    if (!item) throw new Error("Creators API probe returned no matching item");
    await saveSnapshot({ ...candidate, item });
    console.log(`Creators API probe passed for ${candidate.market}; account and Partner Tag are eligible.`);
    return;
  }

  const summary = { requested: candidates.length, refreshed: 0, failed: 0, skipped: 0 };
  for (const market of markets) {
    for (const site of supportedSites) {
      const group = candidates.filter((candidate) => candidate.market === market && candidate.record.site === site);
      for (let index = 0; index < group.length; index += 10) {
        const batch = group.slice(index, index + 10);
        if (!batch.length) continue;
        let data;
        try {
          data = await getItems({
            market,
            partnerTag: batch[0].partnerTag,
            itemIds: batch.map((candidate) => candidate.asin),
          });
        } catch (error) {
          if (error instanceof CreatorsApiError && error.reason === "AssociateNotEligible") throw error;
          summary.failed += batch.length;
          for (const candidate of batch) {
            await noteSnapshotError(candidate.record, market, error.reason ?? error.type ?? "RequestFailed");
          }
          console.error(`Batch failed for ${market}/${site}: ${error.reason ?? error.message}`);
          continue;
        }

        const items = responseItems(data);
        for (const candidate of batch) {
          const item = items.find((entry) => entry.asin === candidate.asin);
          if (!item) {
            summary.failed += 1;
            const itemError = data.errors?.find((entry) => entry.resourceId === candidate.asin);
            await noteSnapshotError(candidate.record, market, itemError?.code ?? "ItemNotAccessible");
            continue;
          }
          try {
            await saveSnapshot({ ...candidate, item });
            summary.refreshed += 1;
          } catch (error) {
            summary.failed += 1;
            await noteSnapshotError(candidate.record, market, "InvalidVendedLink");
            console.error(`${market}/${candidate.record.site}/${candidate.record.slug}: ${error.message}`);
          }
        }
      }
    }
  }

  console.log(
    `Amazon Creators sync complete: ${summary.refreshed} refreshed, ${summary.failed} failed, ${summary.requested} requested${dryRun ? " (dry run)" : ""}.`,
  );
  if (summary.failed) process.exitCode = 1;
}

try {
  await main();
} catch (error) {
  const reason = error instanceof CreatorsApiError ? error.reason : undefined;
  if (reason === "AssociateNotEligible") {
    console.error("Amazon Creators API account is not yet eligible: 10 qualifying sales in the trailing 30 days are required.");
    process.exitCode = 2;
  } else {
    console.error(`Amazon Creators sync failed: ${reason ?? error.message}`);
    process.exitCode = 1;
  }
} finally {
  if (databasePool) await databasePool.end();
}
