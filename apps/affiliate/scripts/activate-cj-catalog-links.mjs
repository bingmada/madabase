import { Pool } from "pg";

const apply = process.argv.includes("--apply");
const networkDirect = process.argv.includes("--network-direct");
const databaseUrl = process.env.DATABASE_URL;
const expectedPid = process.env.CJ_COSTUME_PID;
const concurrency = Math.min(Math.max(Number(process.env.CJ_LINK_VERIFY_CONCURRENCY ?? 8), 1), 16);
const timeoutMs = Math.min(Math.max(Number(process.env.CJ_LINK_VERIFY_TIMEOUT_MS ?? 10_000), 3_000), 60_000);
const expectedCatalogCount = Math.max(Number(process.env.CJ_EXPECTED_CATALOG_COUNT ?? 1_000), 1);
const minActivationRatio = Math.min(Math.max(Number(process.env.CJ_MIN_ACTIVATION_RATIO ?? 0.9), 0.5), 1);
const allowedTrackingHosts = ["anrdoezrs.net", "dpbolvw.net", "jdoqocy.com", "kqzyfj.com", "qksrv.net", "tkqlhce.com"];
const merchantHosts = new Set(["abracadabranyc.com", "www.abracadabranyc.com"]);

if (!databaseUrl || !expectedPid) {
  console.error("DATABASE_URL and CJ_COSTUME_PID are required");
  process.exit(1);
}
if (apply && !networkDirect) {
  console.error("--apply requires --network-direct so every activated product destination is checked first");
  process.exit(1);
}

function normalizedUrl(value) {
  const url = new URL(value);
  url.hash = "";
  url.searchParams.sort();
  return url.toString();
}

function validateStructure(product) {
  try {
    if (!product.linkId) return "missing affiliate link";
    if (Number(product.linkCount) !== 1) return `expected one affiliate link, found ${product.linkCount}`;
    if (!product.permissionRef || Number(product.authorizedImageCount) < 1) return "missing authorized CJ Feed image";
    if (product.availability === "out of stock" || product.softRetiredAt) return "product is unavailable or retired";

    const tracking = new URL(product.trackingUrl);
    const identity = tracking.pathname.match(/\/click-(\d+)-(\d+)(?:\/|$)/);
    const destination = new URL(product.destinationUrl);
    const linkDestination = new URL(product.linkDestinationUrl);
    const embedded = tracking.searchParams.get("url");
    const hostAllowed = allowedTrackingHosts.some((host) => tracking.hostname === host || tracking.hostname.endsWith(`.${host}`));

    if (tracking.protocol !== "https:" || !hostAllowed || !identity) return "invalid CJ tracking URL";
    if (identity[1] !== expectedPid || product.pid !== expectedPid) return "dedicated Costume PID mismatch";
    if (identity[2] !== product.aid) return "CJ AID mismatch";
    if (!embedded || destination.protocol !== "https:" || !merchantHosts.has(destination.hostname)) return "invalid Abracadabra destination";
    if (normalizedUrl(embedded) !== normalizedUrl(product.destinationUrl)) return "embedded CJ destination mismatch";
    if (normalizedUrl(linkDestination) !== normalizedUrl(product.destinationUrl)) return "stored link destination mismatch";
    return null;
  } catch (error) {
    return error instanceof Error ? error.message : "unparseable link";
  }
}

function sameProductDestination(expectedValue, actualValue) {
  const expected = new URL(expectedValue);
  const actual = new URL(actualValue);
  if (!merchantHosts.has(actual.hostname) || actual.pathname !== expected.pathname) return false;
  const expectedVariant = expected.searchParams.get("variant");
  return !expectedVariant || actual.searchParams.get("variant") === expectedVariant;
}

async function fetchDestination(product) {
  let lastFailure = "network request failed";
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      let response = await fetch(product.destinationUrl, {
        method: "HEAD",
        redirect: "follow",
        signal: controller.signal,
        headers: { "user-agent": "Madabase-CJ-Link-Validator/1.0" },
      });
      if (response.status === 405) {
        response = await fetch(product.destinationUrl, {
          method: "GET",
          redirect: "follow",
          signal: controller.signal,
          headers: { "user-agent": "Madabase-CJ-Link-Validator/1.0", range: "bytes=0-0" },
        });
      }
      const sameDestination = sameProductDestination(product.destinationUrl, response.url);
      if (response.ok && sameDestination) return { ok: true, rateLimited: false };
      if (response.status === 429 && sameDestination) return { ok: true, rateLimited: true };
      lastFailure = `HTTP ${response.status} or product destination drift (${response.url})`;
      if (response.status !== 429 && response.status < 500) break;
    } catch (error) {
      lastFailure = error instanceof Error ? error.message : lastFailure;
    } finally {
      clearTimeout(timer);
    }
    await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
  }
  return { ok: false, reason: lastFailure };
}

async function mapConcurrent(items, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;
  let completed = 0;
  const startedAt = Date.now();
  async function run() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(items[index]);
      completed += 1;
      if (completed % 50 === 0 || completed === items.length) {
        console.log(JSON.stringify({ progress: completed, total: items.length, elapsedSeconds: Math.round((Date.now() - startedAt) / 1_000) }));
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return results;
}

const pool = new Pool({ connectionString: databaseUrl, max: 2 });
const client = await pool.connect();
try {
  const result = await client.query(
    `SELECT product."id" AS "productId", product."slug", product."title", product."availability",
       product."softRetiredAt", product."destinationUrl", image."permissionRef",
       COALESCE(image."authorizedImageCount", 0)::int AS "authorizedImageCount",
       link."id" AS "linkId", link."pid", link."aid", link."trackingUrl",
       link."destinationUrl" AS "linkDestinationUrl", COALESCE(link."linkCount", 0)::int AS "linkCount"
     FROM "MerchantProduct" product
     JOIN "Merchant" merchant ON merchant."id" = product."merchantId"
     LEFT JOIN LATERAL (
       SELECT MIN(image."permissionRef") AS "permissionRef", COUNT(*)::int AS "authorizedImageCount"
       FROM "MerchantProductImage" image
       WHERE image."productId" = product."id" AND image."usageStatus" = 'authorized' AND image."permissionRef" IS NOT NULL
     ) image ON true
     LEFT JOIN LATERAL (
       SELECT MIN(link."id") AS "id", MIN(link."pid") AS "pid", MIN(link."aid") AS "aid",
         MIN(link."trackingUrl") AS "trackingUrl", MIN(link."destinationUrl") AS "destinationUrl", COUNT(*)::int AS "linkCount"
       FROM "AffiliateLink" link
       WHERE link."merchantProductId" = product."id" AND link."site" = 'costume' AND link."network" = 'cj'
     ) link ON true
     WHERE merchant."slug" = 'abracadabra-nyc' AND merchant."advertiserCid" = '7889430'
       AND product."softRetiredAt" IS NULL
     ORDER BY product."slug" ASC`,
  );

  const structuralFailures = [];
  const structurallyValid = [];
  for (const product of result.rows) {
    const reason = validateStructure(product);
    if (reason) structuralFailures.push({ slug: product.slug, reason });
    else structurallyValid.push(product);
  }

  const networkFailures = [];
  let networkRateLimited = 0;
  if (networkDirect) {
    const checks = await mapConcurrent(structurallyValid, fetchDestination);
    checks.forEach((check, index) => {
      if (check.rateLimited) networkRateLimited += 1;
      if (!check.ok) networkFailures.push({ slug: structurallyValid[index].slug, reason: check.reason });
    });
  }
  const failedSlugs = new Set([...structuralFailures, ...networkFailures].map((item) => item.slug));
  const eligible = structurallyValid.filter((product) => !failedSlugs.has(product.slug));

  const summary = {
    ok: result.rows.length === expectedCatalogCount && structuralFailures.length === 0 && (!networkDirect || networkFailures.length === 0),
    mode: apply ? "apply" : "preview",
    networkDirect,
    totalProducts: result.rows.length,
    expectedCatalogCount,
    structurallyValid: structurallyValid.length,
    destinationChecked: networkDirect ? structurallyValid.length : 0,
    destinationRateLimited: networkRateLimited,
    eligible: eligible.length,
    structuralFailures: structuralFailures.length,
    networkFailures: networkFailures.length,
  };
  console.log(JSON.stringify(summary));
  [...structuralFailures, ...networkFailures].slice(0, 100).forEach((failure) => console.log(`${failure.slug} | ${failure.reason}`));
  if (!apply) {
    process.exitCode = summary.ok ? 0 : 2;
  } else {
    if (result.rows.length !== expectedCatalogCount) {
      throw new Error(`Expected ${expectedCatalogCount} catalog products before activation, found ${result.rows.length}`);
    }
    const eligibleLinkIds = eligible.map((product) => product.linkId);
    if (eligibleLinkIds.length / expectedCatalogCount < minActivationRatio) {
      throw new Error(`Only ${eligibleLinkIds.length}/${expectedCatalogCount} products passed; activation safety threshold is ${minActivationRatio}`);
    }
    await client.query("BEGIN");
    await client.query(
      `UPDATE "AffiliateLink" SET "active" = false, "verifiedAt" = NULL, "lastCheckedAt" = NOW(), "updatedAt" = NOW()
       WHERE "site" = 'costume' AND "network" = 'cj' AND "pid" = $1`,
      [expectedPid],
    );
    if (eligibleLinkIds.length) {
      await client.query(
        `UPDATE "AffiliateLink" SET "active" = true, "verifiedAt" = NOW(), "lastCheckedAt" = NOW(), "updatedAt" = NOW()
         WHERE "site" = 'costume' AND "network" = 'cj' AND "pid" = $1 AND "id" = ANY($2::text[])`,
        [expectedPid, eligibleLinkIds],
      );
    }
    await client.query("COMMIT");
    console.log(JSON.stringify({ ok: true, activated: eligibleLinkIds.length, isolated: result.rows.length - eligibleLinkIds.length }));
  }
} catch (error) {
  try { await client.query("ROLLBACK"); } catch {}
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
