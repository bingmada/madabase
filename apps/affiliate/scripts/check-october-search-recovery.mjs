import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const affiliateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryDir = path.resolve(affiliateDir, "../..");
const config = JSON.parse(fs.readFileSync(path.join(affiliateDir, "config/search-recovery-consolidations-2026-10-06.json"), "utf8"));
const control = JSON.parse(fs.readFileSync(path.join(affiliateDir, "config/search-recovery-control.json"), "utf8"));
const reportLedger = JSON.parse(fs.readFileSync(path.join(affiliateDir, "reports/seo-recovery-2026-10-06/changed-urls.json"), "utf8"));
const consolidationSource = fs.readFileSync(path.join(affiliateDir, "lib/search-recovery-consolidation.ts"), "utf8");
const recoveryContentSource = fs.readFileSync(path.join(affiliateDir, "lib/october-search-recovery-content.ts"), "utf8");
const contentSource = fs.readFileSync(path.join(affiliateDir, "lib/content.ts"), "utf8");

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

const sourceRows = parseCsv(fs.readFileSync(path.join(repositoryDir, "docs/affiliate-expansion757-search-gate-2026-08-28.csv"), "utf8"));
const septemberRows = parseCsv(fs.readFileSync(path.join(affiliateDir, "reports/seo-drop-2026-10-01/gsc-28d/Pages.csv"), "utf8"));
const twoDayRows = parseCsv(fs.readFileSync(path.join(affiliateDir, "reports/seo-drop-2026-10-01/gsc-two-day-comparison/Pages.csv"), "utf8"));
const septemberByUrl = new Map(septemberRows.map((row) => [row["Top pages"], row]));
const twoDayByUrl = new Map(twoDayRows.map((row) => [row["Top pages"], row]));
const errors = [];
const ledger = [];
const originArgument = process.argv.find((argument) => argument.startsWith("--origin="));
const runtimeOrigin = originArgument?.slice("--origin=".length);

if (config.action !== "existing-page-topic-hierarchy-repair") errors.push(`Unexpected action ${config.action}`);
if (config.scope?.families !== 12 || config.families.length !== 12) errors.push(`Expected 12 families; found ${config.families.length}`);
if (config.scope?.measuredUrls !== 64) errors.push(`Expected 64 measured URLs; found ${config.scope?.measuredUrls}`);
if (config.scope?.retainedCanonicals !== 12) errors.push(`Expected 12 retained canonicals; found ${config.scope?.retainedCanonicals}`);
if (config.scope?.permanentRedirects !== 53) errors.push(`Expected 53 redirects; found ${config.scope?.permanentRedirects}`);
if (config.scope?.newRoutes !== 0) errors.push("Recovery release must add zero routes");
if (config.reviewGates?.day7 !== "2026-10-13" || config.reviewGates?.day14 !== "2026-10-20" || config.reviewGates?.day30 !== "2026-11-05") {
  errors.push("The October 7/14/30 review gates changed");
}
if (!control.freeze?.active) errors.push("New indexable publication freeze is not active");
if (!control.freeze?.allowedActions?.includes(config.action)) errors.push("Recovery action is not allowed by search-recovery-control.json");

const familyKeys = new Set();
const targetUrls = new Set();
const sourceUrls = new Set();
for (const family of config.families) {
  const key = `${family.site}:${family.familySlug}`;
  if (familyKeys.has(key)) errors.push(`Duplicate family ${key}`);
  familyKeys.add(key);
  if (!family.selectionEvidence) errors.push(`${key} lacks selection evidence`);
  const rows = sourceRows.filter((row) => row.site === family.site && row.family === family.familySlug);
  const expectedRoles = family.site === "baby" ? 6 : 5;
  if (rows.length !== expectedRoles) {
    errors.push(`${key} has ${rows.length} measured rows; expected ${expectedRoles}`);
    continue;
  }

  const measured = rows.map((row) => {
    const september = septemberByUrl.get(row.url) ?? {};
    const twoDay = twoDayByUrl.get(row.url) ?? {};
    return {
      ...row,
      augustImpressions: Number(row.impressions || 0),
      september28Impressions: Number(september.Impressions || 0),
      september28Clicks: Number(september.Clicks || 0),
      sep22To23Impressions: Number(twoDay["9/22/26 - 9/23/26 Impressions"] || 0),
      sep29To30Impressions: Number(twoDay["9/29/26 - 9/30/26 Impressions"] || 0),
    };
  });
  const sums = measured.reduce((totals, row) => ({
    augustImpressions: totals.augustImpressions + row.augustImpressions,
    september28Impressions: totals.september28Impressions + row.september28Impressions,
    september28Clicks: totals.september28Clicks + row.september28Clicks,
    sep22To23Impressions: totals.sep22To23Impressions + row.sep22To23Impressions,
    sep29To30Impressions: totals.sep29To30Impressions + row.sep29To30Impressions,
  }), { augustImpressions: 0, september28Impressions: 0, september28Clicks: 0, sep22To23Impressions: 0, sep29To30Impressions: 0 });
  for (const [metric, actual] of Object.entries(sums)) {
    if (family.metrics?.[metric] !== actual) errors.push(`${key} ${metric} is ${actual}; config records ${family.metrics?.[metric]}`);
  }

  const externalTarget = family.targetKind === "existing-guide";
  const targetRow = externalTarget ? undefined : measured.find((row) => row.role === family.targetRole);
  if (!externalTarget && !targetRow) errors.push(`${key} has no ${family.targetRole} target`);
  const targetUrl = externalTarget
    ? `https://baby.madabase.com/guides/${family.targetSlug}`
    : targetRow?.url;
  if (!targetUrl) continue;
  if (targetUrls.has(targetUrl)) errors.push(`Duplicate target ${targetUrl}`);
  targetUrls.add(targetUrl);
  const familySourceUrls = measured
    .filter((row) => externalTarget || row.role !== family.targetRole)
    .map((row) => row.url);
  for (const sourceUrl of familySourceUrls) {
    if (sourceUrls.has(sourceUrl)) errors.push(`Duplicate source ${sourceUrl}`);
    sourceUrls.add(sourceUrl);
  }
  ledger.push({ key, targetUrl, sourceUrls: familySourceUrls, metrics: sums, externalTarget });
}

if (familyKeys.size !== 12) errors.push(`Expected 12 unique families; found ${familyKeys.size}`);
if (targetUrls.size !== 12) errors.push(`Expected 12 unique targets; found ${targetUrls.size}`);
if (sourceUrls.size !== 53) errors.push(`Expected 53 unique redirect sources; found ${sourceUrls.size}`);
const measuredUrlCount = ledger.reduce((total, item) => total + item.sourceUrls.length + (item.externalTarget ? 0 : 1), 0);
if (measuredUrlCount !== 64) errors.push(`Expected 64 measured family URLs; found ${measuredUrlCount}`);

const reportTargets = new Set(reportLedger.families.flatMap((family) => [family.target]));
const reportSources = new Set(reportLedger.families.flatMap((family) => family.sources));
if (reportLedger.families.length !== 17 || reportTargets.size !== 17) errors.push("All-site changed-URL report must enumerate 17 unique targets");
if (reportSources.size !== 55) errors.push(`All-site changed-URL report enumerates ${reportSources.size} redirect sources; expected 55`);
for (const targetUrl of targetUrls) {
  if (!reportTargets.has(targetUrl)) errors.push(`Changed-URL report is missing target ${targetUrl}`);
}
for (const sourceUrl of sourceUrls) {
  if (!reportSources.has(sourceUrl)) errors.push(`Changed-URL report is missing source ${sourceUrl}`);
}
if (reportLedger.requestIndexing !== false || reportLedger.indexNow !== false) errors.push("Changed-URL report must keep bulk search submission disabled");

const clickTarget = ledger.find((item) => item.key === "homeoffice:dual-screen-portable-monitors");
if (clickTarget?.metrics.september28Clicks !== 4 || !clickTarget.targetUrl.endsWith("dual-screen-portable-monitors-vs-alternatives")) {
  errors.push("The four-click dual-screen comparison target is not protected");
}
const bottleTarget = ledger.find((item) => item.key === "baby:automatic-bottle-washers");
if (!bottleTarget?.externalTarget || !bottleTarget.targetUrl.endsWith("bottle-washer-vs-sterilizer-vs-dryer-guide")) {
  errors.push("Automatic bottle washers must consolidate into the established non-template guide");
}

if (!consolidationSource.includes('search-recovery-consolidations-2026-10-06.json')) errors.push("Consolidation runtime does not load the October config");
if (!consolidationSource.includes('family.mergeMode === "compact"')) errors.push("Compact merge mode is missing");
if (!contentSource.includes("applyPortfolioSearchRecoveryGuide") || !contentSource.includes("applyOctoberSearchRecovery")) {
  errors.push("October content recovery is not applied before the all-site portfolio recovery layer");
}
for (const key of [
  "homeoffice:dual-screen-portable-monitors-vs-alternatives",
  "homeoffice:business-usb-c-monitors-vs-alternatives",
  "homeoffice:dual-monitor-kvm-switches-vs-alternatives",
  "homeoffice:office-paper-shredders-vs-alternatives",
  "homeoffice:low-profile-keyboards-vs-alternatives",
  "homeoffice:desktop-label-printers-buying-guide",
  "homeoffice:desktop-laminators-buying-guide",
  "homeoffice:wireless-number-pads-buying-guide",
  "baby:infant-bath-tubs-safety-and-skip-guide",
  "baby:nursery-glider-chairs-safety-and-skip-guide",
  "baby:double-strollers-compatibility-and-fit-guide",
  "baby:bottle-washer-vs-sterilizer-vs-dryer-guide",
]) {
  if (!recoveryContentSource.includes(`"${key}"`)) errors.push(`Missing evidence-led recovery content for ${key}`);
}
for (const primarySource of ["support.apple.com", "dell.com/support", "assets.aten.com", "fellowes.com", "osha.gov", "brother-usa.com", "support.microsoft.com", "keychron.com", "cpsc.gov", "healthychildren.org", "thule.com", "cdc.gov"]) {
  if (!recoveryContentSource.includes(primarySource)) errors.push(`Missing primary source domain ${primarySource}`);
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

async function validateRuntime(origin) {
  const baseOrigin = new URL(origin);
  const checks = [];
  const markets = ["en-gb", "en-ca", "de-de", "nl-nl"];
  const targetBySite = new Map();

  for (const item of ledger) {
    const target = new URL(item.targetUrl);
    const site = item.key.split(":")[0];
    const targets = targetBySite.get(site) ?? [];
    targets.push(target);
    targetBySite.set(site, targets);

    checks.push(...item.sourceUrls.map((sourceUrl) => ({
      kind: "base-redirect",
      source: new URL(sourceUrl),
      target,
    })));
    checks.push({ kind: "base-target", target });
    for (const market of markets) {
      checks.push(...item.sourceUrls.map((sourceUrl) => ({
        kind: "market-redirect",
        market,
        source: new URL(sourceUrl),
        target,
      })));
      checks.push({ kind: "market-target", market, target });
    }
  }

  const counts = {
    baseRedirects: 0,
    baseTargets: 0,
    localizedRedirects: 0,
    localizedTargets: 0,
    sitemaps: 0,
  };

  async function request(pathname, host, redirect = "manual") {
    const url = new URL(pathname, baseOrigin);
    return fetch(url, {
      headers: {
        "x-forwarded-host": host,
        "x-forwarded-proto": "https",
      },
      redirect,
    });
  }

  await mapWithConcurrency(checks, 12, async (check) => {
    const host = check.target.hostname;
    const targetPath = check.target.pathname;
    if (check.kind === "base-redirect" || check.kind === "market-redirect") {
      const prefix = check.kind === "market-redirect" ? `/${check.market}` : "";
      const response = await request(`${prefix}${check.source.pathname}`, host);
      const expectedLocation = `${prefix}${targetPath}`;
      if (response.status !== 308) {
        errors.push(`${check.kind} ${host}${prefix}${check.source.pathname} returned ${response.status}; expected 308`);
      }
      const location = response.headers.get("location");
      if (location !== expectedLocation) {
        errors.push(`${check.kind} ${host}${prefix}${check.source.pathname} points to ${location}; expected ${expectedLocation}`);
      }
      if (check.kind === "base-redirect") counts.baseRedirects += 1;
      else counts.localizedRedirects += 1;
      return;
    }

    const prefix = check.kind === "market-target" ? `/${check.market}` : "";
    const response = await request(`${prefix}${targetPath}`, host);
    const html = await response.text();
    if (response.status !== 200) {
      errors.push(`${check.kind} ${host}${prefix}${targetPath} returned ${response.status}; expected 200`);
    }
    const expectedCanonical = `https://${host}${prefix}${targetPath}`;
    if (!html.includes(`rel="canonical" href="${expectedCanonical}"`)) {
      errors.push(`${check.kind} ${host}${prefix}${targetPath} lacks canonical ${expectedCanonical}`);
    }
    if (check.kind === "base-target" && /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html)) {
      errors.push(`${check.kind} ${host}${targetPath} is noindex`);
    }
    if (check.kind === "base-target") counts.baseTargets += 1;
    else counts.localizedTargets += 1;
  });

  for (const [site, targets] of targetBySite) {
    const host = site === "homeoffice" ? "homeoffice.madabase.com" : "baby.madabase.com";
    const response = await request("/sitemap.xml", host);
    const sitemap = await response.text();
    if (response.status !== 200) errors.push(`${site} sitemap returned ${response.status}`);
    for (const target of targets) {
      const count = sitemap.split(target.href).length - 1;
      if (count !== 1) errors.push(`${site} sitemap contains ${target.href} ${count} times; expected once`);
    }
    for (const item of ledger.filter((entry) => entry.key.startsWith(`${site}:`))) {
      for (const sourceUrl of item.sourceUrls) {
        if (sitemap.includes(sourceUrl)) errors.push(`${site} sitemap still contains redirect source ${sourceUrl}`);
      }
    }
    counts.sitemaps += 1;
  }

  return counts;
}

let runtime = null;
if (runtimeOrigin && errors.length === 0) {
  runtime = await validateRuntime(runtimeOrigin);
}

console.log("October search recovery audit");
console.log(JSON.stringify({
  families: familyKeys.size,
  measuredFamilyUrls: measuredUrlCount,
  retainedCanonicals: targetUrls.size,
  permanentRedirects: sourceUrls.size,
  evidenceLedCanonicals: 12,
  newRoutes: 0,
  reviewGates: config.reviewGates,
  runtime,
  errors,
}, null, 2));
if (errors.length) process.exit(1);
console.log(`\nPassed: evidence, intent selection, freeze, target protection, exact URL accounting${runtime ? ", redirects, canonicals, and sitemaps" : ""}.`);
