import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const affiliateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(affiliateDir, "config", "deferred-family-consolidations-2026-09-11.json");
const ledgerPath = path.join(affiliateDir, "reports", "seo-consolidation-ledger-2026-09-11.json");
const deepPath = path.join(affiliateDir, "config", "deep-rank-recovery-2026-08-27.json");
const comparisonPath = path.join(affiliateDir, "config", "comparison-first-cohort-2026-09-04.json");
const controlPath = path.join(affiliateDir, "config", "search-recovery-control.json");
const localOrigin = process.env.DEFERRED_CONSOLIDATION_ORIGIN;
const publicAudit = process.env.DEFERRED_CONSOLIDATION_PUBLIC_AUDIT === "1";

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const ledger = JSON.parse(fs.readFileSync(ledgerPath, "utf8")).ledger ?? [];
const deep = JSON.parse(fs.readFileSync(deepPath, "utf8"));
const comparison = JSON.parse(fs.readFileSync(comparisonPath, "utf8"));
const control = JSON.parse(fs.readFileSync(controlPath, "utf8"));
const errors = [];
const expectedFamilies = new Map([
  ["network:sfp-plus-network-switches", "sfp-plus-network-switches-vs-alternatives"],
  ["network:poe-splitters", "poe-splitters-vs-alternatives"],
]);
const comparisonKeys = new Set(comparison.targets.map((item) => `${item.site}:${item.familySlug}`));
const deepTargets = deep.targets.filter((item) =>
  [...expectedFamilies.keys()].some((key) => {
    const [site, familySlug] = key.split(":");
    return item.site === site && item.slug.startsWith(`${familySlug}-`);
  }),
);

if (config.action !== "existing-page-topic-hierarchy-repair") errors.push(`Unexpected action ${config.action}`);
if (!control.freeze?.allowedActions?.includes(config.action)) errors.push("Action is not allowed by the recovery control");
if (control.freeze?.blockedActions?.includes(config.action)) errors.push("Action is blocked by the recovery control");
if (config.scope?.families !== 2 || config.families?.length !== 2) errors.push("Expected exactly two deferred families");
if (config.scope?.measuredUrls !== 8 || config.scope?.retainedCanonicals !== 2 || config.scope?.permanentRedirects !== 6) {
  errors.push("Expected the exact 8-to-2 consolidation with six permanent redirects");
}
if (config.scope?.newRoutes !== 0) errors.push("The consolidation must add zero routes");
if (config.measurement?.currentImpressions !== 0 || config.measurement?.previousImpressions !== 1) {
  errors.push("The exact September 11 measurement baseline changed");
}
if (config.reviewGates?.day7 !== "2026-09-18" || config.reviewGates?.day14 !== "2026-09-25" || config.reviewGates?.day30 !== "2026-10-11") {
  errors.push("The 7/14/30-day review gates changed");
}
if (deepTargets.length !== 3) errors.push(`Expected three Deep43 routes across the deferred families; found ${deepTargets.length}`);

const targetUrls = new Set();
const sourceUrls = new Set();
for (const family of config.families ?? []) {
  const key = `${family.site}:${family.familySlug}`;
  const expectedTarget = expectedFamilies.get(key);
  if (!expectedTarget) errors.push(`Unexpected family ${key}`);
  if (family.targetRole !== "comparison" || family.targetSlug !== expectedTarget) errors.push(`${key} target changed`);
  if (family.sourceSlugs?.length !== 3 || new Set(family.sourceSlugs).size !== 3) errors.push(`${key} must have three unique sources`);
  if (family.sourceSlugs?.includes(family.targetSlug)) errors.push(`${key} target is also listed as a source`);
  if (comparisonKeys.has(key)) errors.push(`${key} overlaps the protected comparison-first cohort`);
  if (!family.selectionEvidence) errors.push(`${key} lacks selection evidence`);

  const tracked = ledger.find((item) => item.site === family.site && item.familySlug === family.familySlug);
  const targetUrl = `https://network.madabase.com/guides/${family.targetSlug}`;
  if (!tracked) errors.push(`${key} is missing from the ledger`);
  else {
    if (tracked.targetUrl !== targetUrl) errors.push(`${key} tracked target changed`);
    const expectedSources = family.sourceSlugs.map((slug) => `https://network.madabase.com/guides/${slug}`).sort();
    if (JSON.stringify([...tracked.sourceUrls].sort()) !== JSON.stringify(expectedSources)) errors.push(`${key} tracked sources changed`);
  }
  if (targetUrls.has(targetUrl)) errors.push(`Duplicate target ${targetUrl}`);
  targetUrls.add(targetUrl);
  for (const slug of family.sourceSlugs ?? []) {
    const sourceUrl = `https://network.madabase.com/guides/${slug}`;
    if (sourceUrls.has(sourceUrl)) errors.push(`Duplicate source ${sourceUrl}`);
    sourceUrls.add(sourceUrl);
  }
}

if (ledger.length !== 2) errors.push(`Expected two ledger rows; found ${ledger.length}`);

async function fetchRoute(pathname, redirect = "follow") {
  const target = publicAudit ? `https://network.madabase.com${pathname}` : `${localOrigin}${pathname}`;
  return fetch(target, {
    headers: publicAudit ? { "user-agent": "Madabase deferred consolidation auditor/1.0" } : {
      host: "network.madabase.com",
      "x-forwarded-host": "network.madabase.com",
      "x-forwarded-proto": "https",
      "user-agent": "Madabase deferred consolidation auditor/1.0",
    },
    redirect,
    signal: AbortSignal.timeout(30_000),
  });
}

let runtimeTargets = 0;
let runtimeRedirects = 0;
let sitemapChecked = 0;
if (localOrigin || publicAudit) {
  const sitemap = await fetchRoute("/sitemap.xml");
  const sitemapBody = await sitemap.text();
  if (sitemap.status !== 200) errors.push(`Sitemap returned ${sitemap.status}`);

  for (const family of config.families ?? []) {
    const targetPath = `/guides/${family.targetSlug}`;
    const targetUrl = `https://network.madabase.com${targetPath}`;
    const response = await fetchRoute(targetPath);
    const html = await response.text();
    if (response.status !== 200) errors.push(`${targetPath} returned ${response.status}`);
    if (!html.includes(`<link rel="canonical" href="${targetUrl}"`)) errors.push(`${targetPath} canonical mismatch`);
    if (!html.includes('data-consolidated-family-hub="true"')) errors.push(`${targetPath} is not marked as a consolidated hub`);
    if (!html.includes("September 11, 2026")) errors.push(`${targetPath} release date is missing`);
    const targetEntry = new RegExp(`<loc>${targetUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</loc>\\s*<lastmod>2026-09-11(?:T00:00:00\\.000Z)?</lastmod>`);
    if (!targetEntry.test(sitemapBody)) errors.push(`${targetPath} sitemap entry is missing or stale`);
    runtimeTargets += 1;
    sitemapChecked += 1;

    for (const sourceSlug of family.sourceSlugs ?? []) {
      const sourcePath = `/guides/${sourceSlug}`;
      const redirectResponse = await fetchRoute(sourcePath, "manual");
      if (![307, 308].includes(redirectResponse.status)) errors.push(`${sourcePath} returned ${redirectResponse.status} instead of a permanent redirect`);
      const location = redirectResponse.headers.get("location") ?? "";
      if (!location.endsWith(targetPath)) errors.push(`${sourcePath} redirects to ${location || "nowhere"}`);
      if (sitemapBody.includes(`<loc>https://network.madabase.com${sourcePath}</loc>`)) errors.push(`${sourcePath} remains in the sitemap`);
      runtimeRedirects += 1;
      sitemapChecked += 1;
    }
  }
}

const report = {
  ok: errors.length === 0,
  families: config.families?.length ?? 0,
  measuredUrls: config.scope?.measuredUrls,
  retainedCanonicals: config.scope?.retainedCanonicals,
  permanentRedirects: config.scope?.permanentRedirects,
  deep43RoutesAccountedFor: deepTargets.length,
  runtimeTargets,
  runtimeRedirects,
  sitemapChecked,
  mode: publicAudit ? "public" : localOrigin ? "local-runtime" : "source-only",
  reviewGates: config.reviewGates,
};

console.log("Deferred family consolidation audit");
console.log(JSON.stringify(report, null, 2));
if (errors.length) {
  console.error(`\nErrors (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("\nDeferred family consolidation audit passed.");
