import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const affiliateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspaceDir = path.resolve(affiliateDir, "../..");
const configPath = path.join(affiliateDir, "config", "search-recovery-consolidations-2026-08-23.json");
const gatePath = path.join(workspaceDir, "docs", "affiliate-expansion757-search-gate-2026-08-23.csv");
const reportPath = path.join(affiliateDir, "reports", "seo-consolidation-ledger-2026-08-23.json");
const localOrigin = process.env.SEARCH_CONSOLIDATION_ORIGIN;
const publicAudit = process.env.SEARCH_CONSOLIDATION_PUBLIC_AUDIT === "1";
const writeReport = process.argv.includes("--write-report");

function parseCsv(value) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (quoted) {
      if (character === '"' && value[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [headers, ...values] = rows.filter((item) => item.some(Boolean));
  return values.map((item) => Object.fromEntries(headers.map((header, index) => [header, item[index] ?? ""])));
}

function normalizeUrl(value) {
  return value.replace(/\/$/, "");
}

async function fetchRoute(publicUrl, redirect = "follow") {
  const url = new URL(publicUrl);
  const target = publicAudit ? publicUrl : `${localOrigin}${url.pathname}`;
  return fetch(target, {
    headers: publicAudit ? { "user-agent": "Madabase consolidation auditor/1.0" } : {
      host: url.host,
      "x-forwarded-host": url.host,
      "x-forwarded-proto": "https",
      "user-agent": "Madabase consolidation auditor/1.0",
    },
    redirect,
    signal: AbortSignal.timeout(30_000),
  });
}

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const rows = parseCsv(fs.readFileSync(gatePath, "utf8"));
const errors = [];
const ledger = [];

for (const family of config.families) {
  const familyRows = rows.filter((row) => row.site === family.site && row.family === family.familySlug);
  const expectedRoles = family.site === "network" || family.site === "costume" ? 4 : 5;
  if (familyRows.length !== expectedRoles) {
    errors.push(`${family.site}:${family.familySlug} has ${familyRows.length} gate rows; expected ${expectedRoles}`);
    continue;
  }
  for (const row of familyRows) {
    if (Number(row.clicks) !== 0 || Number(row.impressions) !== 0) {
      errors.push(`${row.url} is not a complete-window zero row (${row.clicks} clicks, ${row.impressions} impressions)`);
    }
  }
  const target = familyRows.find((row) => row.role === "buying");
  if (!target) {
    errors.push(`${family.site}:${family.familySlug} has no buying target`);
    continue;
  }
  ledger.push({
    site: family.site,
    familySlug: family.familySlug,
    measurementWindow: config.measurementWindow,
    clicks: 0,
    impressions: 0,
    targetUrl: target.url,
    sourceUrls: familyRows.filter((row) => row.role !== "buying").map((row) => row.url),
    preservedUrls: familyRows.map((row) => row.url),
  });
}

const sourceUrls = ledger.flatMap((item) => item.sourceUrls);
const preservedUrls = ledger.flatMap((item) => item.preservedUrls);
if (config.families.length !== 25) errors.push(`Expected 25 families; found ${config.families.length}`);
if (new Set(config.families.map((item) => `${item.site}:${item.familySlug}`)).size !== 25) errors.push("Consolidation config contains duplicate families");
if (preservedUrls.length !== 113) errors.push(`Expected 113 measured URLs; found ${preservedUrls.length}`);
if (sourceUrls.length !== 88) errors.push(`Expected 88 redirect sources; found ${sourceUrls.length}`);
if (new Set(preservedUrls).size !== 113) errors.push("Consolidation ledger contains duplicate URLs");

const report = {
  version: 1,
  authorizedAt: config.authorizedAt,
  measurementWindow: config.measurementWindow,
  sourceLedger: config.sourceLedger,
  decision: config.decision,
  families: ledger.length,
  measuredUrls: preservedUrls.length,
  retainedCanonicalHubs: ledger.length,
  permanentRedirects: sourceUrls.length,
  clicks: 0,
  impressions: 0,
  ledger,
};

if (writeReport && !errors.length) {
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

if ((localOrigin || publicAudit) && !errors.length) {
  const sitemapByHost = new Map();
  for (const host of new Set(ledger.map((item) => new URL(item.targetUrl).host))) {
    const response = await fetchRoute(`https://${host}/sitemap.xml`);
    const text = await response.text();
    if (response.status !== 200) errors.push(`https://${host}/sitemap.xml returned HTTP ${response.status}`);
    sitemapByHost.set(host, new Set([...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => normalizeUrl(match[1]))));
  }

  for (const family of ledger) {
    const targetResponse = await fetchRoute(family.targetUrl);
    const html = await targetResponse.text();
    const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1]
      ?? html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1];
    if (targetResponse.status !== 200) errors.push(`${family.targetUrl} returned HTTP ${targetResponse.status}`);
    if (normalizeUrl(canonical ?? "") !== normalizeUrl(family.targetUrl)) errors.push(`${family.targetUrl} has canonical ${canonical ?? "missing"}`);
    if (!html.includes('data-consolidated-family-hub="true"')) errors.push(`${family.targetUrl} has no consolidated-hub marker`);
    if ((html.match(/Compare the alternatives:/g) ?? []).length < 4) errors.push(`${family.targetUrl} did not preserve comparison sections`);
    if (!sitemapByHost.get(new URL(family.targetUrl).host)?.has(normalizeUrl(family.targetUrl))) errors.push(`${family.targetUrl} is missing from sitemap`);

    for (const sourceUrl of family.sourceUrls) {
      const response = await fetchRoute(sourceUrl, "manual");
      const location = response.headers.get("location");
      const expectedPath = new URL(family.targetUrl).pathname;
      if (response.status !== 308) errors.push(`${sourceUrl} returned HTTP ${response.status}; expected 308`);
      if (!location || new URL(location, sourceUrl).pathname !== expectedPath) errors.push(`${sourceUrl} redirects to ${location ?? "missing"}; expected ${expectedPath}`);
      if (sitemapByHost.get(new URL(sourceUrl).host)?.has(normalizeUrl(sourceUrl))) errors.push(`${sourceUrl} remains in sitemap`);

      const marketUrl = new URL(`/en-gb${new URL(sourceUrl).pathname}`, sourceUrl).toString();
      const marketResponse = await fetchRoute(marketUrl, "manual");
      const marketLocation = marketResponse.headers.get("location");
      if (marketResponse.status !== 308) errors.push(`${marketUrl} returned HTTP ${marketResponse.status}; expected 308`);
      if (!marketLocation || new URL(marketLocation, marketUrl).pathname !== `/en-gb${expectedPath}`) errors.push(`${marketUrl} redirects to ${marketLocation ?? "missing"}`);
    }
  }
}

console.log("Search recovery consolidation audit");
console.log(JSON.stringify({ ...report, ledger: undefined, runtime: Boolean(localOrigin || publicAudit), errors }, null, 2));
if (errors.length) process.exit(1);
console.log(`\nPassed: ${ledger.length} families, ${preservedUrls.length} measured URLs, ${sourceUrls.length} permanent redirects.`);
