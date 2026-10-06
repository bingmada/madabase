import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const affiliateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(fs.readFileSync(path.join(affiliateDir, "config/portfolio-search-recovery-2026-10-06.json"), "utf8"));
const octoberLedger = JSON.parse(fs.readFileSync(path.join(affiliateDir, "reports/seo-recovery-2026-10-06/changed-urls.json"), "utf8"));
const contentSource = fs.readFileSync(path.join(affiliateDir, "lib/portfolio-search-recovery-content.ts"), "utf8");
const evidenceSource = [
  contentSource,
  fs.readFileSync(path.join(affiliateDir, "lib/network-content.ts"), "utf8"),
  fs.readFileSync(path.join(affiliateDir, "lib/adjacent-expansion-content.ts"), "utf8"),
].join("\n");
const consolidationSource = fs.readFileSync(path.join(affiliateDir, "lib/search-recovery-consolidation.ts"), "utf8");
const assemblySource = fs.readFileSync(path.join(affiliateDir, "lib/content.ts"), "utf8");
const errors = [];

const expectedSites = ["network", "smarthome", "homeoffice", "baby", "pet", "style", "costume"];
const actionSites = config.siteActions.map((item) => item.site);
if (config.action !== "all-affiliate-site-existing-page-search-recovery") errors.push(`Unexpected action ${config.action}`);
if (JSON.stringify(config.scope?.sites) !== JSON.stringify(expectedSites)) errors.push("Portfolio scope must enumerate all seven active affiliate sites in operating order");
if (new Set(actionSites).size !== 7 || expectedSites.some((site) => !actionSites.includes(site))) errors.push("Exactly one explicit site action is required for every affiliate site");
if (config.scope?.changedCanonicals !== 17) errors.push(`Expected 17 changed canonicals; found ${config.scope?.changedCanonicals}`);
if (config.scope?.basePermanentRedirects !== 55) errors.push(`Expected 55 base redirects; found ${config.scope?.basePermanentRedirects}`);
if (config.scope?.newRoutes !== 0) errors.push("Portfolio recovery must add zero routes");
if (config.requestIndexing !== false) errors.push("Bulk Request Indexing must remain disabled");
if (config.reviewGates?.day7 !== "2026-10-13" || config.reviewGates?.day14 !== "2026-10-20" || config.reviewGates?.day30 !== "2026-11-05") {
  errors.push("Portfolio review gates changed");
}

for (const action of config.siteActions) {
  if (!action.state || !action.action || !action.evidence) errors.push(`${action.site} lacks a complete state, action, or evidence record`);
  if (!action.canonicalPath && !Array.isArray(action.canonicalPaths)) errors.push(`${action.site} lacks a canonical path ledger`);
}

const canonicals = octoberLedger.families.map((family) => family.target);
if (new Set(canonicals).size !== 17) errors.push(`Derived ${new Set(canonicals).size} unique canonicals; expected 17`);

const redirects = octoberLedger.families.flatMap((family) => family.sources);
if (new Set(redirects).size !== 55) errors.push(`Derived ${new Set(redirects).size} unique redirects; expected 55`);

for (const key of [
  "network:deco-be63-vs-be67-vs-be85-buying-guide",
  "smarthome:matter-thread-wifi-zigbee-device-checklist",
  "style:loungefly-faux-leather-rain-and-care-guide",
  "costume:costume-rental-vs-buying-guide",
  "pet:levoit-vital-200s-p-air-purifier",
]) {
  if (!contentSource.includes(`"${key}"`)) errors.push(`Missing all-site content patch for ${key}`);
}
for (const sourceDomain of ["tp-link.com", "csa-iot.org", "threadgroup.org", "levoit.com", "popularmechanics.com", "loungefly.com", "funko.com", "abracadabranyc.com"]) {
  if (!evidenceSource.includes(sourceDomain)) errors.push(`Missing required evidence domain ${sourceDomain}`);
}
for (const [source, target] of [
  ["smarthome:matter-vs-thread-vs-zigbee", "matter-thread-wifi-zigbee-device-checklist"],
  ["smarthome:matter-over-thread-hub-checklist", "matter-thread-wifi-zigbee-device-checklist"],
]) {
  if (!consolidationSource.includes(source) || !consolidationSource.includes(target)) errors.push(`Missing standalone consolidation ${source} -> ${target}`);
}
if (!assemblySource.includes("applyPortfolioSearchRecoveryGuide") || !assemblySource.includes("applyPortfolioSearchRecoveryProduct")) {
  errors.push("Portfolio recovery content is not connected to guide and product assembly");
}

async function mapWithConcurrency(items, concurrency, worker) {
  let cursor = 0;
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const item = items[cursor];
      cursor += 1;
      await worker(item);
    }
  });
  await Promise.all(runners);
}

const originArgument = process.argv.find((argument) => argument.startsWith("--origin="));
const runtimeOrigin = originArgument?.slice("--origin=".length);
let runtime = null;

if (runtimeOrigin && errors.length === 0) {
  const baseOrigin = new URL(runtimeOrigin);
  const markets = ["en-gb", "en-ca", "de-de", "nl-nl"];
  const counts = { baseRedirects: 0, localizedRedirects: 0, baseCanonicals: 0, localizedCanonicals: 0, sitemaps: 0 };

  async function request(pathname, host, redirect = "manual") {
    return fetch(new URL(pathname, baseOrigin), {
      headers: { "x-forwarded-host": host, "x-forwarded-proto": "https" },
      redirect,
    });
  }

  await mapWithConcurrency(redirects, 12, async (sourceUrl) => {
    const source = new URL(sourceUrl);
    const targetUrl = new URL(octoberLedger.families.find((family) => family.sources.includes(sourceUrl))?.target);
    for (const market of [null, ...markets]) {
      const prefix = market ? `/${market}` : "";
      const response = await request(`${prefix}${source.pathname}`, source.hostname);
      if (response.status !== 308) errors.push(`${source.hostname}${prefix}${source.pathname} returned ${response.status}; expected 308`);
      const expected = `${prefix}${targetUrl.pathname}`;
      if (response.headers.get("location") !== expected) errors.push(`${source.hostname}${prefix}${source.pathname} redirects to ${response.headers.get("location")}; expected ${expected}`);
      if (market) counts.localizedRedirects += 1;
      else counts.baseRedirects += 1;
    }
  });

  await mapWithConcurrency(canonicals, 10, async (canonicalUrl) => {
    const canonical = new URL(canonicalUrl);
    const localizable = !canonical.hostname.startsWith("costumes.");
    for (const market of [null, ...(localizable ? markets : [])]) {
      const prefix = market ? `/${market}` : "";
      const response = await request(`${prefix}${canonical.pathname}`, canonical.hostname);
      const html = await response.text();
      if (response.status !== 200) errors.push(`${canonical.hostname}${prefix}${canonical.pathname} returned ${response.status}; expected 200`);
      const expectedCanonical = `https://${canonical.hostname}${prefix}${canonical.pathname}`;
      if (!html.includes(`rel="canonical" href="${expectedCanonical}"`)) errors.push(`${canonical.hostname}${prefix}${canonical.pathname} lacks canonical ${expectedCanonical}`);
      if (!market && /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html)) errors.push(`${canonical.hostname}${canonical.pathname} is noindex`);
      if (market) counts.localizedCanonicals += 1;
      else counts.baseCanonicals += 1;
    }
  });

  const byHost = new Map();
  for (const canonicalUrl of canonicals) {
    const canonical = new URL(canonicalUrl);
    const urls = byHost.get(canonical.hostname) ?? [];
    urls.push(canonical.href);
    byHost.set(canonical.hostname, urls);
  }
  for (const [host, urls] of byHost) {
    const response = await request("/sitemap.xml", host);
    const sitemap = await response.text();
    if (response.status !== 200) errors.push(`${host} sitemap returned ${response.status}`);
    for (const url of urls) {
      if (sitemap.split(url).length - 1 !== 1) errors.push(`${host} sitemap must contain ${url} exactly once`);
    }
    for (const redirectUrl of redirects.filter((url) => new URL(url).hostname === host)) {
      if (sitemap.includes(redirectUrl)) errors.push(`${host} sitemap still contains redirect source ${redirectUrl}`);
    }
    counts.sitemaps += 1;
  }
  runtime = counts;
}

console.log("All-site affiliate search recovery audit");
console.log(JSON.stringify({
  sites: new Set(actionSites).size,
  changedCanonicals: new Set(canonicals).size,
  basePermanentRedirects: new Set(redirects).size,
  newRoutes: config.scope?.newRoutes,
  reviewGates: config.reviewGates,
  runtime,
  errors,
}, null, 2));

if (errors.length) process.exitCode = 1;
