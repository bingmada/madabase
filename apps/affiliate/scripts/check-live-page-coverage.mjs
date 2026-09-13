import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const affiliateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(affiliateDir, "config", "live-page-coverage-2026-09-13.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const errors = [];
const groups = config.newlyClassified ?? {};
const liveAudit = process.env.LIVE_PAGE_COVERAGE_PUBLIC_AUDIT === "1";

function rows(group) {
  return group?.urls ?? [];
}

for (const [name, group] of Object.entries(groups)) {
  if (rows(group).length !== group.count) {
    errors.push(`${name} expected ${group.count} URLs; found ${rows(group).length}`);
  }
}

const classified = Object.entries(groups).flatMap(([group, value]) =>
  rows(value).map((row) => ({ group, ...row })),
);
const byUrl = new Map();
for (const row of classified) {
  let parsed;
  try {
    parsed = new URL(row.url);
  } catch {
    errors.push(`Invalid URL in ${row.group}: ${row.url}`);
    continue;
  }
  if (byUrl.has(row.url)) errors.push(`URL is classified twice: ${row.url}`);
  byUrl.set(row.url, row.group);
  if (!config.scope.includedHosts.includes(parsed.hostname)) errors.push(`Host is outside active scope: ${row.url}`);
  if (config.scope.excludedHosts.includes(parsed.hostname)) errors.push(`Excluded host entered coverage: ${row.url}`);
}

if (classified.length !== config.accounting.newlyClassifiedTotal) {
  errors.push(`Expected ${config.accounting.newlyClassifiedTotal} newly classified URLs; found ${classified.length}`);
}
if (config.scope.contentAlreadyCoveredByPriorLedgers + classified.length !== config.scope.liveContentUrls) {
  errors.push("Prior-ledger plus newly-classified content count does not equal the live content total");
}
if (config.scope.liveContentUrls + config.scope.structuralPolicyAndMarketUrls !== config.scope.liveSitemapUrls) {
  errors.push("Content plus structural count does not equal the live Sitemap total");
}

for (const row of rows(groups.protected)) {
  if (!(row.metrics?.currentImpressions > 0 && row.metrics?.currentPosition > 0 && row.metrics?.currentPosition <= 20)) {
    errors.push(`Protected page lacks current top-20 evidence: ${row.url}`);
  }
}
for (const row of rows(groups.recoveryWatch)) {
  if (!((row.metrics?.currentImpressions ?? 0) > 0 || (row.metrics?.previousImpressions ?? 0) > 0)) {
    errors.push(`Recovery-watch page lacks current or previous exposure: ${row.url}`);
  }
}
const costumeProducts = rows(groups.costumeSeasonalCatalog).filter((row) => row.kind === "product").length;
const costumeEditorial = rows(groups.costumeSeasonalCatalog).filter((row) => row.kind !== "product").length;
if (costumeProducts !== groups.costumeSeasonalCatalog.productPages) errors.push(`Expected ${groups.costumeSeasonalCatalog.productPages} Costume products; found ${costumeProducts}`);
if (costumeEditorial !== groups.costumeSeasonalCatalog.editorialPages) errors.push(`Expected ${groups.costumeSeasonalCatalog.editorialPages} Costume editorial pages; found ${costumeEditorial}`);

let publicSitemapUrls = 0;
if (liveAudit) {
  const sitemapUrls = new Set();
  for (const host of config.scope.includedHosts) {
    const response = await fetch(`https://${host}/sitemap.xml`, {
      headers: { "user-agent": "Madabase live page coverage checker/1.0" },
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) {
      errors.push(`${host} sitemap returned ${response.status}`);
      continue;
    }
    const xml = await response.text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replace(/\/$/, ""));
    const expectedCount = config.sitemapCounts[host];
    if (urls.length !== expectedCount) errors.push(`${host} sitemap expected ${expectedCount}; found ${urls.length}`);
    urls.forEach((url) => sitemapUrls.add(url));
  }
  publicSitemapUrls = sitemapUrls.size;
  if (sitemapUrls.size !== config.scope.liveSitemapUrls) {
    errors.push(`Expected ${config.scope.liveSitemapUrls} live Sitemap URLs; found ${sitemapUrls.size}`);
  }
  for (const row of classified) {
    if (!sitemapUrls.has(row.url)) errors.push(`Classified URL is no longer in a live Sitemap: ${row.url}`);
  }
}

const report = {
  ok: errors.length === 0,
  mode: liveAudit ? "public" : "ledger-only",
  classifiedUrls: classified.length,
  uniqueUrls: byUrl.size,
  protected: rows(groups.protected).length,
  recoveryWatch: rows(groups.recoveryWatch).length,
  doubleZeroReview: rows(groups.doubleZeroInspectionAndIntentReview).length,
  costume: rows(groups.costumeSeasonalCatalog).length,
  publicSitemapUrls,
};

console.log("Live page coverage audit");
console.log(JSON.stringify(report, null, 2));
if (errors.length) {
  console.error(`\nErrors (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("\nLive page coverage audit passed.");
