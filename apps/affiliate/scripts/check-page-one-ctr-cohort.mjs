import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const affiliateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(affiliateDir, "config", "page-one-ctr-cohort-2026-09-11.json");
const controlPath = path.join(affiliateDir, "config", "search-recovery-control.json");
const localOrigin = process.env.PAGE_ONE_CTR_ORIGIN;
const publicAudit = process.env.PAGE_ONE_CTR_PUBLIC_AUDIT === "1";
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const control = JSON.parse(fs.readFileSync(controlPath, "utf8"));
const sourceFiles = [
  path.join(affiliateDir, "lib", "content.ts"),
  path.join(affiliateDir, "lib", "gsc-priority-expansion-content.ts"),
  path.join(affiliateDir, "lib", "search-opportunities.ts"),
];
const source = sourceFiles.map((filePath) => fs.readFileSync(filePath, "utf8")).join("\n");
const errors = [];
const hosts = {
  homeoffice: "homeoffice.madabase.com",
  baby: "baby.madabase.com",
};

if (config.action !== "query-backed-existing-page-refresh") errors.push(`Unexpected action ${config.action}`);
if (!control.freeze?.allowedActions?.includes(config.action)) errors.push("Action is not allowed by the recovery control");
if (control.freeze?.blockedActions?.includes(config.action)) errors.push("Action is blocked by the recovery control");
if (config.releaseDate !== "2026-09-11") errors.push("Unexpected release date");
if (config.scope?.targetCount !== 4 || config.targets?.length !== 4) errors.push("Expected exactly four CTR targets");
if (config.scope?.newRoutes !== 0) errors.push("CTR cohort must add zero routes");
if (config.reviewGates?.day7 !== "2026-09-18" || config.reviewGates?.day14 !== "2026-09-25" || config.reviewGates?.day30 !== "2026-10-11") {
  errors.push("The 7/14/30-day review gates changed");
}

const expectedKeys = new Set([
  "homeoffice:product:branch-ergonomic-chair",
  "homeoffice:product:hon-ignition-2-0-chair",
  "baby:guide:ergobaby-omni-breeze-forward-facing-age-guide",
  "baby:product:grownsy-bottle-sterilizer-dryer",
]);
const seen = new Set();
for (const target of config.targets ?? []) {
  const key = `${target.site}:${target.kind}:${target.slug}`;
  if (!expectedKeys.has(key)) errors.push(`Unexpected target ${key}`);
  if (seen.has(key)) errors.push(`Duplicate target ${key}`);
  seen.add(key);
  const routeKind = target.kind === "product" ? "reviews" : "guides";
  const expectedUrl = `https://${hosts[target.site]}/${routeKind}/${target.slug}`;
  if (target.url !== expectedUrl) errors.push(`${key} URL mismatch`);
  if (target.clicks !== 0 || target.impressions < 50 || target.position < 4 || target.position > 10) errors.push(`${key} no longer satisfies the page-one zero-click gate`);
  if (!target.visibleQueries?.length || !target.intent || !target.title) errors.push(`${key} lacks query, intent, or title evidence`);
  if (!source.includes(target.title)) errors.push(`${key} title is not present in source`);
  if (!source.includes(target.slug)) errors.push(`${key} is not present in source`);
}
if (seen.size !== expectedKeys.size) errors.push("CTR target set is incomplete");
if (seen.has("homeoffice:roundup:ergear-48x24-vs-flexispot-e7-mini") || source.includes('seoTitle: "ErGear 48×24 vs FlexiSpot E7 Mini Review: Which Is Better?"\n    updatedAt: "September 11, 2026"')) {
  errors.push("The protected ErGear title experiment was modified");
}

function escapedHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("'", "&#39;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

async function fetchRoute(target, pathname) {
  const url = publicAudit ? `https://${hosts[target.site]}${pathname}` : `${localOrigin}${pathname}`;
  return fetch(url, {
    headers: publicAudit ? { "user-agent": "Madabase page-one CTR auditor/1.0" } : {
      host: hosts[target.site],
      "x-forwarded-host": hosts[target.site],
      "x-forwarded-proto": "https",
      "user-agent": "Madabase page-one CTR auditor/1.0",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(30_000),
  });
}

let runtimeChecked = 0;
let sitemapChecked = 0;
if (localOrigin || publicAudit) {
  const sitemapBySite = new Map();
  for (const target of config.targets ?? []) {
    const routeKind = target.kind === "product" ? "reviews" : "guides";
    const pathname = `/${routeKind}/${target.slug}`;
    const response = await fetchRoute(target, pathname);
    const html = await response.text();
    if (response.status !== 200) errors.push(`${target.url} returned ${response.status}`);
    if (!html.includes(`<link rel="canonical" href="${target.url}"`)) errors.push(`${target.url} canonical mismatch`);
    if (!html.includes(`<title>${escapedHtml(target.title)}</title>`)) errors.push(`${target.url} title mismatch`);
    if (!html.includes(escapedHtml(target.title))) errors.push(`${target.url} H1/title copy is missing`);
    if (!html.includes("September 11, 2026")) errors.push(`${target.url} visible update date is missing`);
    if (target.kind === "product" && !html.includes('data-first-viewport-commerce="true"')) errors.push(`${target.url} lost first-screen commerce`);
    if (/name="robots" content="[^"]*noindex/i.test(html)) errors.push(`${target.url} unexpectedly renders noindex`);
    runtimeChecked += 1;

    if (!sitemapBySite.has(target.site)) {
      const sitemapResponse = await fetchRoute(target, "/sitemap.xml");
      sitemapBySite.set(target.site, { status: sitemapResponse.status, body: await sitemapResponse.text() });
    }
    const sitemap = sitemapBySite.get(target.site);
    if (sitemap.status !== 200) errors.push(`${target.site} sitemap returned ${sitemap.status}`);
    const entry = new RegExp(`<loc>${target.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</loc>\\s*<lastmod>2026-09-11(?:T00:00:00\\.000Z)?</lastmod>`);
    if (!entry.test(sitemap.body)) errors.push(`${target.url} sitemap lastmod is not 2026-09-11`);
    sitemapChecked += 1;
  }
}

const report = {
  ok: errors.length === 0,
  targets: config.targets?.length ?? 0,
  impressions: (config.targets ?? []).reduce((sum, target) => sum + target.impressions, 0),
  protectedExclusions: config.protectedExclusions?.length ?? 0,
  runtimeChecked,
  sitemapChecked,
  mode: publicAudit ? "public" : localOrigin ? "local-runtime" : "source-only",
  reviewGates: config.reviewGates,
};

console.log("Page-one CTR cohort audit");
console.log(JSON.stringify(report, null, 2));
if (errors.length) {
  console.error(`\nErrors (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("\nPage-one CTR cohort audit passed.");
