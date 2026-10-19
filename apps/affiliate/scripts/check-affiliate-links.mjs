import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { loadAffiliateTypescript } from "./lib/load-affiliate-typescript.mjs";

const { publishedCommerceInventory } = loadAffiliateTypescript("../../lib/commerce-inventory.ts");

const root = path.resolve(new URL("../../..", import.meta.url).pathname);
const offerBlockPath = path.join(root, "apps/affiliate/config/amazon-offer-blocks.json");
const partnerTag = process.env.AMAZON_AFFILIATE_TAG ?? "bingmada-20";
const siteTrackingIds = {
  network: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_NETWORK ?? "madanetwork-20",
  smarthome: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_SMARTHOME ?? "madasmart-20",
  homeoffice: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_HOMEOFFICE ?? "madaoffice-20",
  baby: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_BABY ?? "madababy-20",
  pet: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_PET ?? "madapets-20",
  style: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_STYLE ?? "madastyle-20",
};
const inventoryOnly = process.argv.includes("--inventory");
const siteArgument = process.argv.find((argument) =>
  argument.startsWith("--site="),
);
const siteFilter = siteArgument?.slice("--site=".length);
const jsonArgument = process.argv.find((argument) =>
  argument.startsWith("--json="),
);
const jsonOutput = jsonArgument
  ? path.resolve(process.cwd(), jsonArgument.slice("--json=".length))
  : null;

function readOfferBlocks() {
  const parsed = JSON.parse(fs.readFileSync(offerBlockPath, "utf8"));
  if (
    !parsed ||
    !Array.isArray(parsed.blocks) ||
    parsed.blocks.some(
      (block) =>
        typeof block.site !== "string" ||
        typeof block.slug !== "string" ||
        !/^[A-Z0-9]{10}$/.test(block.asin ?? "") ||
        !["identity-drift", "unavailable"].includes(block.status),
    )
  ) {
    throw new Error("amazon-offer-blocks.json contains an invalid block");
  }
  return parsed.blocks;
}

const offerBlocks = readOfferBlocks();

function buildInventory() {
  const records = new Map();
  for (const product of publishedCommerceInventory()) {
    for (const offer of product.offers) {
      if (!/^https?:\/\//.test(offer.url)) continue;
      const url = new URL(offer.url);
      if (!isAmazonHost(url.hostname) && url.hostname !== "amzn.to") continue;
      const expectedAsin = product.asin ?? asinFromUrl(offer.url);
      if (!expectedAsin) throw new Error(`Amazon offer lacks an exact ASIN: ${product.site}:${product.slug}`);
      const key = `${product.site}:${expectedAsin}`;
      const context = { slug: product.slug, kind: product.kind };
      const existing = records.get(key);
      if (existing) {
        existing.contexts.push(context);
      } else {
        records.set(key, {
          url: offer.url, file: "runtime:publishedCommerceInventory",
          slug: product.catalogSlug, site: product.site, expectedAsin,
          contexts: [context],
        });
      }
    }
  }
  return [...records.values()].sort((a, b) => `${a.site}:${a.expectedAsin}`.localeCompare(`${b.site}:${b.expectedAsin}`));
}

function asinFromUrl(value) {
  const url = new URL(value);
  const pathMatch = url.pathname.match(
    /\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:[/?]|$)/i,
  );
  return (
    (
      pathMatch?.[1] ??
      url.searchParams.get("creativeASIN") ??
      ""
    ).toUpperCase() || null
  );
}

function isAmazonHost(hostname) {
  return hostname === "amazon.com" || hostname.endsWith(".amazon.com");
}

function expectedTag(record) {
  return siteTrackingIds[record.site] ?? partnerTag;
}

function runtimeAffiliateUrl(record) {
  const source = new URL(record.url);
  const tag = expectedTag(record);

  if (isAmazonHost(source.hostname)) {
    source.searchParams.set("tag", tag);
    return source.toString();
  }

  if (source.hostname === "amzn.to" && record.expectedAsin) {
    const direct = new URL(`/dp/${record.expectedAsin}`, "https://www.amazon.com");
    direct.searchParams.set("tag", tag);
    direct.searchParams.set("linkCode", "ll2");
    direct.searchParams.set("language", "en_US");
    direct.searchParams.set("ref_", "as_li_ss_tl");
    return direct.toString();
  }

  return record.url;
}

async function request(url, method) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await fetch(url, {
        method,
        redirect: "manual",
        signal: AbortSignal.timeout(15_000),
        headers: {
          "user-agent":
            "Mozilla/5.0 (compatible; MadaBaseAffiliateLinkChecker/1.0)",
          accept: "text/html,application/xhtml+xml",
        },
      });
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 250));
      }
    }
  }

  throw lastError;
}

async function follow(url) {
  const redirects = [];
  let current = url;

  if (isAmazonHost(new URL(current).hostname)) {
    return {
      status: null,
      finalUrl: current,
      redirects,
      resolution: "direct_amazon_url",
    };
  }

  for (let hop = 0; hop < 8; hop += 1) {
    let response = await request(current, "HEAD");
    if (response.status === 405 || response.status === 501) {
      response = await request(current, "GET");
    }

    const location = response.headers.get("location");
    if (response.status >= 300 && response.status < 400 && location) {
      const next = new URL(location, current).toString();
      redirects.push({ status: response.status, from: current, to: next });
      if (isAmazonHost(new URL(next).hostname)) {
        return {
          status: response.status,
          finalUrl: next,
          redirects,
          resolution: "amazon_redirect",
        };
      }
      current = next;
      continue;
    }

    return {
      status: response.status,
      finalUrl: current,
      redirects,
      resolution: "terminal_response",
    };
  }

  throw new Error("too_many_redirects");
}

async function check(record) {
  try {
    const runtimeUrl = runtimeAffiliateUrl(record);
    const response = await follow(runtimeUrl);
    const final = new URL(response.finalUrl);
    const actualAsin = asinFromUrl(response.finalUrl);
    const actualTag = final.searchParams.get("tag");
    const requiredTag = expectedTag(record);
    const problems = [];

    if (
      response.status !== null &&
      (response.status < 200 || response.status >= 400)
    )
      problems.push(`http_${response.status}`);
    if (!isAmazonHost(final.hostname))
      problems.push(`unexpected_host:${final.hostname}`);
    if (actualTag !== requiredTag)
      problems.push(`missing_or_wrong_tag:${actualTag ?? "none"}`);
    if (record.expectedAsin && actualAsin !== record.expectedAsin) {
      problems.push(`asin_mismatch:${actualAsin ?? "none"}`);
    }

    return {
      ...record,
      runtimeUrl,
      expectedTag: requiredTag,
      validationScope: "url-structure-and-attribution",
      liveProductIdentity: "not_checked",
      liveAvailability: "not_checked",
      ok: problems.length === 0,
      status: response.status,
      finalUrl: response.finalUrl,
      actualAsin,
      actualTag,
      redirectCount: response.redirects.length,
      resolution: response.resolution,
      problems,
    };
  } catch (error) {
    return {
      ...record,
      ok: false,
      problems: [error instanceof Error ? error.message : "unknown_error"],
    };
  }
}

async function main() {
  const inventory = buildInventory().filter(
    (item) => !siteFilter || item.site === siteFilter,
  );
  const configuredBlocks = offerBlocks.filter(
    (block) => !siteFilter || block.site === siteFilter,
  );

  console.log(
    `Suppressed ${configuredBlocks.length} known drifted or unavailable Amazon offers.`,
  );

  if (inventoryOnly) {
    console.log(`Found ${inventory.length} Amazon affiliate URLs.`);
    for (const item of inventory) {
      console.log(
        `${item.site ?? "unscoped"}\t${item.slug ?? "unscoped"}\t${item.expectedAsin ?? "-"}\t${item.url}`,
      );
    }
    return;
  }

  const results = [];
  const concurrency = 4;

  for (let index = 0; index < inventory.length; index += concurrency) {
    const batch = inventory.slice(index, index + concurrency);
    results.push(...(await Promise.all(batch.map(check))));
  }

  const failed = results.filter((result) => !result.ok);
  const report = {
    checkedAt: new Date().toISOString(),
    sourcePartnerTag: partnerTag,
    siteTrackingIds,
    total: results.length,
    passed: results.length - failed.length,
    failed: failed.length,
    validationScope: "url-structure-and-attribution",
    liveProductChecks: { verified: 0, notChecked: results.length },
    note: "This automated check simulates runtime site-tag rewriting, validates short-link resolution, Amazon destination, the expected site tracking ID, and known ASINs. Live product availability and Associates exclusion status still require a signed-in Amazon/SiteStripe check.",
    results,
  };

  for (const result of results) {
    const marker = result.ok ? "FORMAT_PASS" : "FORMAT_FAIL";
    console.log(
      `${marker}\t${result.site ?? "unscoped"}\t${result.slug ?? "unscoped"}\t${result.actualAsin ?? "-"}\t${result.problems.join(",") || result.status}`,
    );
  }
  console.log(
    `URL structure/tag checks: ${report.passed}/${report.total} passed, ${report.failed} failed. Live product identity and availability: 0 verified, ${report.total} not checked.`,
  );

  if (jsonOutput) {
    fs.mkdirSync(path.dirname(jsonOutput), { recursive: true });
    fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
    console.log(`Wrote ${jsonOutput}`);
  }

  if (failed.length) process.exitCode = 1;
}

export { buildInventory, siteTrackingIds };

if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1] ?? "")) {
  await main();
}
