import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const affiliateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryDir = path.resolve(affiliateDir, "../..");
const configPath = path.join(affiliateDir, "config", "search-recovery-consolidations-2026-09-08.json");
const initialConfigPath = path.join(affiliateDir, "config", "search-recovery-consolidations-2026-08-23.json");
const gatePath = path.join(affiliateDir, "reports", "expansion757-day30-gate-2026-09-08.json");
const sourceRowsPath = process.env.DAY30_CONSOLIDATION_SOURCE_ROWS_PATH
  ?? path.join(repositoryDir, "docs", "affiliate-expansion757-search-gate-2026-08-28.csv");
const comparisonFirstPath = path.join(affiliateDir, "config", "comparison-first-cohort-2026-09-04.json");
const deepRankRecoveryPath = path.join(affiliateDir, "config", "deep-rank-recovery-2026-08-27.json");
const controlPath = path.join(affiliateDir, "config", "search-recovery-control.json");
const reportPath = path.join(affiliateDir, "reports", "seo-consolidation-ledger-2026-09-08.json");
const localOrigin = process.env.DAY30_CONSOLIDATION_ORIGIN;
const publicAudit = process.env.DAY30_CONSOLIDATION_PUBLIC_AUDIT === "1";
const writeReport = process.argv.includes("--write-report");
const baseOnly = process.argv.includes("--base-only");
const siteArgument = process.argv.find((argument) => argument.startsWith("--site="));
const runtimeSite = siteArgument?.slice("--site=".length);
const siteHosts = {
  network: "network.madabase.com",
  pet: "pets.madabase.com",
};

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
  const attempts = publicAudit ? 5 : 1;
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fetch(target, {
        headers: publicAudit ? { "user-agent": "Madabase day-30 consolidation auditor/1.0" } : {
          host: url.host,
          "x-forwarded-host": url.host,
          "x-forwarded-proto": "https",
          "user-agent": "Madabase day-30 consolidation auditor/1.0",
        },
        redirect,
        signal: AbortSignal.timeout(publicAudit ? 20_000 : 30_000),
      });
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    }
  }
  throw lastError;
}

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const initialConfig = JSON.parse(fs.readFileSync(initialConfigPath, "utf8"));
const gate = JSON.parse(fs.readFileSync(gatePath, "utf8"));
const comparisonFirst = JSON.parse(fs.readFileSync(comparisonFirstPath, "utf8"));
const deepRankRecovery = JSON.parse(fs.readFileSync(deepRankRecoveryPath, "utf8"));
const control = JSON.parse(fs.readFileSync(controlPath, "utf8"));
const rows = fs.existsSync(sourceRowsPath) ? parseCsv(fs.readFileSync(sourceRowsPath, "utf8")) : [];
const recordedLedger = fs.existsSync(reportPath)
  ? JSON.parse(fs.readFileSync(reportPath, "utf8")).ledger ?? []
  : [];
const errors = [];
const ledger = [];
const configuredKeys = new Set();
const configuredTargetUrls = new Set();
const configuredSourceUrls = new Set();
const deferredKeys = new Set((config.deferredFamilies ?? []).map((item) => `${item.site}:${item.familySlug}`));
const expectedKeys = new Set(gate.familyLevel.multiRouteConsolidationReviewCandidates.filter((key) => !deferredKeys.has(key)));
const initialKeys = new Set(initialConfig.families.map((item) => `${item.site}:${item.familySlug}`));
const deepTargetUrls = new Set((deepRankRecovery.targets ?? []).map((item) => item.url));
const comparisonTargetsByFamily = new Map(
  comparisonFirst.targets.map((item) => [`${item.site}:${item.familySlug}`, item]),
);

if (runtimeSite && !(runtimeSite in siteHosts)) errors.push(`Unsupported runtime site ${runtimeSite}`);
if (!rows.length && !localOrigin && !publicAudit) errors.push(`Missing source evidence ${sourceRowsPath}`);

if (config.action !== "existing-page-topic-hierarchy-repair") errors.push(`Unexpected action ${config.action}`);
if (!control.freeze?.allowedActions?.includes(config.action)) errors.push("Action is not permitted by the active recovery control");
if (control.freeze?.blockedActions?.includes(config.action)) errors.push("Action is blocked by the active recovery control");
if (config.scope?.families !== 27 || config.families.length !== 27) errors.push(`Expected 27 immediate families; found ${config.families.length}`);
if (config.scope?.newRoutes !== 0) errors.push("The consolidation must add zero routes");
if (config.reviewGates?.day7 !== "2026-09-15" || config.reviewGates?.day14 !== "2026-09-22" || config.reviewGates?.day30 !== "2026-10-08") {
  errors.push("The 7/14/30-day review gates changed");
}

if (deferredKeys.size !== 2) errors.push(`Expected two Deep43-deferred families; found ${deferredKeys.size}`);
for (const deferred of config.deferredFamilies ?? []) {
  const key = `${deferred.site}:${deferred.familySlug}`;
  if (!gate.familyLevel.multiRouteConsolidationReviewCandidates.includes(key)) errors.push(`${key} is not in the Day-30 candidate set`);
  if (deferred.nextGate !== "2026-09-10") errors.push(`${key} must remain deferred to the September 10 Deep43 gate`);
  const familyRows = rows.filter((row) => row.site === deferred.site && row.family === deferred.familySlug);
  const hasDeepTarget = familyRows.length
    ? familyRows.some((row) => deepTargetUrls.has(row.url))
    : deepRankRecovery.targets.some((target) => target.site === deferred.site && target.slug.startsWith(`${deferred.familySlug}-`));
  if (!hasDeepTarget) errors.push(`${key} has no active Deep43 target and must not be deferred`);
}

for (const family of config.families) {
  const key = `${family.site}:${family.familySlug}`;
  if (configuredKeys.has(key)) errors.push(`Duplicate family ${key}`);
  configuredKeys.add(key);
  if (!expectedKeys.has(key)) errors.push(`${key} is not in the exact Day-30 candidate set`);
  if (initialKeys.has(key)) errors.push(`${key} overlaps the August 23 consolidation`);
  if (!family.historicalLeader || !family.selectionEvidence) errors.push(`${key} lacks selection evidence`);

  const expectedRoles = family.site === "network" ? 4 : 5;
  const protectedTarget = comparisonTargetsByFamily.get(key);
  if (protectedTarget && protectedTarget.slug !== family.targetSlug) {
    errors.push(`${key} would redirect the protected comparison target ${protectedTarget.slug}`);
  }

  if (!rows.length) {
    const recorded = recordedLedger.find((item) => item.site === family.site && item.familySlug === family.familySlug);
    const expectedTargetUrl = `https://${siteHosts[family.site]}/guides/${family.targetSlug}`;
    if (!recorded) {
      errors.push(`${key} is missing from the tracked consolidation ledger`);
      continue;
    }
    if (recorded.targetUrl !== expectedTargetUrl) errors.push(`${key} tracked target changed from ${expectedTargetUrl}`);
    if (recorded.sourceUrls.length !== expectedRoles - 1) errors.push(`${key} tracked source count is not ${expectedRoles - 1}`);
    if (configuredTargetUrls.has(recorded.targetUrl)) errors.push(`Duplicate target URL ${recorded.targetUrl}`);
    configuredTargetUrls.add(recorded.targetUrl);
    for (const sourceUrl of recorded.sourceUrls) {
      if (configuredSourceUrls.has(sourceUrl)) errors.push(`Duplicate source URL ${sourceUrl}`);
      configuredSourceUrls.add(sourceUrl);
    }
    ledger.push(recorded);
    continue;
  }

  const familyRows = rows.filter((row) => row.site === family.site && row.family === family.familySlug);
  if (familyRows.length !== expectedRoles) {
    errors.push(`${key} has ${familyRows.length} source rows; expected ${expectedRoles}`);
    continue;
  }
  const target = familyRows.find((row) => row.role === family.targetRole);
  if (!target) {
    errors.push(`${key} has no ${family.targetRole} target`);
    continue;
  }
  if (new URL(target.url).pathname !== `/guides/${family.targetSlug}`) {
    errors.push(`${key} target slug ${family.targetSlug} does not match ${target.url}`);
  }
  const sourceUrls = familyRows.filter((row) => row.role !== family.targetRole).map((row) => row.url);
  if (configuredTargetUrls.has(target.url)) errors.push(`Duplicate target URL ${target.url}`);
  configuredTargetUrls.add(target.url);
  for (const sourceUrl of sourceUrls) {
    if (configuredSourceUrls.has(sourceUrl)) errors.push(`Duplicate source URL ${sourceUrl}`);
    configuredSourceUrls.add(sourceUrl);
  }
  ledger.push({
    site: family.site,
    familySlug: family.familySlug,
    targetRole: family.targetRole,
    measurementWindow: config.measurementWindow,
    currentClicks: 0,
    currentImpressions: 0,
    previousClicks: 0,
    previousImpressions: 0,
    targetUrl: target.url,
    sourceUrls,
    protectedComparisonTarget: Boolean(protectedTarget),
    selectionEvidence: family.selectionEvidence,
  });
}

for (const expectedKey of expectedKeys) {
  if (!configuredKeys.has(expectedKey)) errors.push(`Missing exact Day-30 candidate ${expectedKey}`);
}

const targetRoleCounts = config.families.reduce((counts, family) => ({
  ...counts,
  [family.targetRole]: (counts[family.targetRole] ?? 0) + 1,
}), {});
const measuredUrls = ledger.reduce((sum, item) => sum + item.sourceUrls.length + 1, 0);
const permanentRedirects = ledger.reduce((sum, item) => sum + item.sourceUrls.length, 0);
if (targetRoleCounts.comparison !== 17 || targetRoleCounts.fit !== 5 || targetRoleCounts.workflow !== 5) {
  errors.push(`Unexpected target role counts ${JSON.stringify(targetRoleCounts)}`);
}
if (measuredUrls !== 118) errors.push(`Expected 118 measured URLs; found ${measuredUrls}`);
if (permanentRedirects !== 91) errors.push(`Expected 91 permanent redirects; found ${permanentRedirects}`);
if (configuredTargetUrls.size !== 27) errors.push(`Expected 27 unique target URLs; found ${configuredTargetUrls.size}`);

const report = {
  version: 1,
  authorizedAt: config.authorizedAt,
  measurementWindow: config.measurementWindow,
  sourceGate: config.sourceGate,
  decision: config.decision,
  families: ledger.length,
  measuredUrls,
  retainedCanonicalHubs: configuredTargetUrls.size,
  permanentRedirects,
  targetRoleCounts,
  protectedComparisonTargets: ledger.filter((item) => item.protectedComparisonTarget).length,
  deferredDeep43Families: [...deferredKeys],
  newRoutes: 0,
  ledger,
};

if (writeReport && !errors.length) {
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
}

if ((localOrigin || publicAudit) && !errors.length) {
  const runtimeLedger = runtimeSite ? ledger.filter((item) => item.site === runtimeSite) : ledger;
  const sitemapByHost = new Map();
  for (const host of new Set(runtimeLedger.map((item) => new URL(item.targetUrl).host))) {
    const response = await fetchRoute(`https://${host}/sitemap.xml`);
    const text = await response.text();
    if (response.status !== 200) errors.push(`https://${host}/sitemap.xml returned HTTP ${response.status}`);
    sitemapByHost.set(host, {
      urls: new Set([...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => normalizeUrl(match[1]))),
      text,
    });
  }

  for (const family of runtimeLedger) {
    const targetResponse = await fetchRoute(family.targetUrl);
    const html = await targetResponse.text();
    const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i)?.[1]
      ?? html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1];
    const sitemap = sitemapByHost.get(new URL(family.targetUrl).host);
    if (targetResponse.status !== 200) errors.push(`${family.targetUrl} returned HTTP ${targetResponse.status}`);
    if (normalizeUrl(canonical ?? "") !== normalizeUrl(family.targetUrl)) errors.push(`${family.targetUrl} has canonical ${canonical ?? "missing"}`);
    if (!html.includes('data-consolidated-family-hub="true"')) errors.push(`${family.targetUrl} has no consolidated-hub marker`);
    if (!html.includes("September 8, 2026")) errors.push(`${family.targetUrl} has no September 8 update marker`);
    if (!sitemap?.urls.has(normalizeUrl(family.targetUrl))) errors.push(`${family.targetUrl} is missing from sitemap`);
    const escapedTargetUrl = family.targetUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (!new RegExp(`<url>\\s*<loc>${escapedTargetUrl}/?</loc>\\s*<lastmod>2026-09-08`, "i").test(sitemap?.text ?? "")) {
      errors.push(`${family.targetUrl} has no September 8 sitemap lastmod`);
    }

    for (const sourceUrl of family.sourceUrls) {
      const response = await fetchRoute(sourceUrl, "manual");
      const location = response.headers.get("location");
      const expectedPath = new URL(family.targetUrl).pathname;
      if (response.status !== 308) errors.push(`${sourceUrl} returned HTTP ${response.status}; expected 308`);
      if (!location || new URL(location, sourceUrl).pathname !== expectedPath) errors.push(`${sourceUrl} redirects to ${location ?? "missing"}; expected ${expectedPath}`);
      if (sitemap?.urls.has(normalizeUrl(sourceUrl))) errors.push(`${sourceUrl} remains in sitemap`);

      for (const market of ["en-gb", "en-ca", "en-au", "de-de"]) {
        const localizedSource = new URL(`/${market}${new URL(sourceUrl).pathname}`, sourceUrl).toString();
        if (sitemap?.urls.has(normalizeUrl(localizedSource))) errors.push(`${localizedSource} remains in sitemap`);
      }

      if (!baseOnly) {
        const marketUrl = new URL(`/en-gb${new URL(sourceUrl).pathname}`, sourceUrl).toString();
        const marketResponse = await fetchRoute(marketUrl, "manual");
        const marketLocation = marketResponse.headers.get("location");
        if (marketResponse.status !== 308) errors.push(`${marketUrl} returned HTTP ${marketResponse.status}; expected 308`);
        if (!marketLocation || new URL(marketLocation, marketUrl).pathname !== `/en-gb${expectedPath}`) {
          errors.push(`${marketUrl} redirects to ${marketLocation ?? "missing"}; expected /en-gb${expectedPath}`);
        }
      }
    }
  }
}

console.log("Day-30 family consolidation audit");
console.log(JSON.stringify({
  ...report,
  ledger: undefined,
  runtime: Boolean(localOrigin || publicAudit),
  runtimeSite: runtimeSite ?? "all",
  baseOnly,
  errors,
}, null, 2));
if (errors.length) process.exit(1);
console.log(`\nPassed: ${ledger.length} families, ${measuredUrls} measured URLs, ${permanentRedirects} permanent redirects.`);
