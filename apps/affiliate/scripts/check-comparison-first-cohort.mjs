import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const workspaceDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryDir = path.resolve(workspaceDir, "../..");
const configPath = path.join(workspaceDir, "config", "comparison-first-cohort-2026-09-04.json");
const sourcePath = path.join(workspaceDir, "lib", "quadruple-expansion-content.ts");
const briefPath = path.join(workspaceDir, "lib", "quadruple-family-editorial.ts");
const communityPath = path.join(workspaceDir, "config", "quadruple-community-evidence.json");
const deepPath = path.join(workspaceDir, "config", "deep-rank-recovery-2026-08-27.json");
const consolidationPath = path.join(workspaceDir, "config", "search-recovery-consolidations-2026-08-23.json");
const controlPath = path.join(workspaceDir, "config", "search-recovery-control.json");
const protectedLedgerPaths = [
  path.join(repositoryDir, "docs", "affiliate-ranking118-search-gate-2026-08-20.csv"),
  path.join(repositoryDir, "docs", "affiliate-soft151-search-gate-2026-08-20.csv"),
];

const cohort = JSON.parse(fs.readFileSync(configPath, "utf8"));
const community = JSON.parse(fs.readFileSync(communityPath, "utf8"));
const deep = JSON.parse(fs.readFileSync(deepPath, "utf8"));
const consolidations = JSON.parse(fs.readFileSync(consolidationPath, "utf8"));
const control = JSON.parse(fs.readFileSync(controlPath, "utf8"));
const errors = [];
const runtimeOrigin = process.env.COMPARISON_FIRST_ORIGIN;
const publicAudit = process.env.COMPARISON_FIRST_PUBLIC_AUDIT === "1";

function transpile(filePath) {
  return ts.transpileModule(fs.readFileSync(filePath, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    fileName: filePath,
  }).outputText;
}

const contentJavascript = transpile(sourcePath)
  .replace(/^import communityEvidenceData[^;]+;\n/m, "")
  .replace(/^import comparisonFirstData[^;]+;\n/m, "")
  .replace(/^import deepRankRecoveryData[^;]+;\n/m, "")
  .replace(/^import \{ findFamilyEditorialBrief \}[^;]+;\n/m, "");
const javascript = `${transpile(briefPath)}\nconst communityEvidenceData = ${JSON.stringify(community)};\nconst comparisonFirstData = ${JSON.stringify(cohort)};\nconst deepRankRecoveryData = ${JSON.stringify(deep)};\n${contentJavascript}`;
const expansion = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);

const hosts = {
  network: "network.madabase.com",
  smarthome: "smarthome.madabase.com",
  homeoffice: "homeoffice.madabase.com",
  baby: "baby.madabase.com",
  pet: "pets.madabase.com",
};
const expectedSiteCounts = { network: 8, smarthome: 8, homeoffice: 8, baby: 5, pet: 7 };
const targets = cohort.targets ?? [];
const targetKeys = new Set();
const targetUrls = new Set();
const guidesByKey = new Map(expansion.quadrupleExpansionGuides.map((guide) => [`${guide.site}:${guide.slug}`, guide]));
const familiesByKey = new Map(expansion.quadrupleExpansionFamilies.map((family) => [`${family.site}:${family.slug}`, family]));
const deepUrls = new Set((deep.targets ?? []).map((target) => target.url));
const protectedUrls = new Set(
  protectedLedgerPaths.flatMap((filePath) => fs.readFileSync(filePath, "utf8").match(/https:\/\/[^,\r\n]+/g) ?? []),
);
protectedUrls.add("https://homeoffice.madabase.com/guides/ergear-vs-flexispot-standing-desk-comparison");
const consolidatedFamilies = new Set(consolidations.families.map((item) => `${item.site}:${item.familySlug}`));

if (cohort.releaseDate !== "2026-09-04") errors.push(`Unexpected release date ${cohort.releaseDate}`);
if (cohort.action !== "query-backed-existing-page-refresh") errors.push(`Unexpected action ${cohort.action}`);
if (!control.freeze?.allowedActions?.includes(cohort.action)) errors.push("Cohort action is not allowed by the active search-recovery control");
if (control.freeze?.blockedActions?.includes(cohort.action)) errors.push("Cohort action is blocked by the active search-recovery control");
if (cohort.scope?.newRoutes !== 0) errors.push("The cohort must not add routes");
if (cohort.scope?.targetCount !== 36 || targets.length !== 36) errors.push(`Expected 36 targets; found ${targets.length}`);
if (cohort.reviewGates?.day7 !== "2026-09-11" || cohort.reviewGates?.day14 !== "2026-09-18" || cohort.reviewGates?.day30 !== "2026-10-04") {
  errors.push("The 7/14/30-day review gates changed");
}

for (const [site, expectedCount] of Object.entries(expectedSiteCounts)) {
  const actualCount = targets.filter((target) => target.site === site).length;
  if (actualCount !== expectedCount) errors.push(`${site} expected ${expectedCount} targets; found ${actualCount}`);
}

for (const target of targets) {
  const key = `${target.site}:${target.slug}`;
  const familyKey = `${target.site}:${target.familySlug}`;
  if (targetKeys.has(key)) errors.push(`Duplicate target ${key}`);
  if (targetUrls.has(target.url)) errors.push(`Duplicate target URL ${target.url}`);
  targetKeys.add(key);
  targetUrls.add(target.url);

  if (!hosts[target.site]) errors.push(`Invalid target site ${target.site}`);
  const expectedUrl = `https://${hosts[target.site]}/guides/${target.slug}`;
  if (target.url !== expectedUrl) errors.push(`${key} URL mismatch: ${target.url}`);
  if (!familiesByKey.has(familyKey)) errors.push(`Missing existing family ${familyKey}`);
  if (deepUrls.has(target.url)) errors.push(`${key} overlaps Deep43`);
  if (protectedUrls.has(target.url)) errors.push(`${key} overlaps a protected ranking or test URL`);
  if (!/\bvs\.?\b/i.test(target.title)) errors.push(`${key} title is not comparison-first`);
  if (!target.searchQuestion?.endsWith("?")) errors.push(`${key} needs an explicit search question`);
  if ((target.dek?.length ?? 0) < 100) errors.push(`${key} dek is too thin`);
  if ((target.quickAnswer?.length ?? 0) < 180) errors.push(`${key} quick answer is too thin`);
  if ((target.decisionSection?.body?.length ?? 0) < 220) errors.push(`${key} decision section is too thin`);
  if ((target.comparisonRows?.length ?? 0) < 4) errors.push(`${key} needs at least four comparison rows`);
  if (!target.evidence?.gsc28d || !target.evidence?.liveSerp) errors.push(`${key} lost its selection evidence`);
  if ((target.relatedGuideSlugs?.length ?? 0) < 3) errors.push(`${key} needs at least three related guide links`);
  if (target.relatedGuideSlugs?.includes(target.slug)) errors.push(`${key} links to itself`);
  for (const relatedSlug of target.relatedGuideSlugs ?? []) {
    if (!guidesByKey.has(`${target.site}:${relatedSlug}`)) errors.push(`${key} links to missing guide ${relatedSlug}`);
  }

  const consolidated = consolidatedFamilies.has(familyKey);
  if (consolidated && target.slug !== `${target.familySlug}-buying-guide`) {
    errors.push(`${key} must refresh the consolidated buying hub, not a redirected support URL`);
  }
  if (!consolidated && target.slug !== `${target.familySlug}-vs-alternatives`) {
    errors.push(`${key} must use the existing comparison URL`);
  }

  const guide = guidesByKey.get(key);
  if (!guide) {
    errors.push(`Missing generated guide ${key}`);
    continue;
  }
  if (guide.title !== target.title) errors.push(`${key} title override failed`);
  if (guide.dek !== target.dek) errors.push(`${key} dek override failed`);
  if (guide.searchQuestion !== target.searchQuestion) errors.push(`${key} search-question override failed`);
  if (guide.quickAnswer !== target.quickAnswer) errors.push(`${key} quick-answer override failed`);
  if (guide.updatedAt !== "September 4, 2026") errors.push(`${key} did not receive the bounded refresh date`);
  if (guide.sections?.[0]?.heading !== target.decisionSection.heading) errors.push(`${key} decision section is not first`);
  if (guide.comparisonTable?.columns?.[0] !== target.primaryOption || guide.comparisonTable?.columns?.[1] !== target.alternativeOption) {
    errors.push(`${key} comparison columns do not match the query fork`);
  }
  if (guide.comparisonTable?.rows?.length !== target.comparisonRows.length + 2) errors.push(`${key} comparison-row count changed`);
  if (guide.governance?.decision !== "rewrite") errors.push(`${key} lost rewrite governance`);
}

const refreshedGuides = expansion.quadrupleExpansionGuides.filter((guide) => guide.updatedAt === "September 4, 2026");
if (refreshedGuides.length !== 36) errors.push(`Expected exactly 36 refreshed generated guides; found ${refreshedGuides.length}`);
for (const guide of refreshedGuides) {
  if (!targetKeys.has(`${guide.site}:${guide.slug}`)) errors.push(`Non-target guide received the cohort date: ${guide.site}:${guide.slug}`);
}

const uniqueTitles = new Set(targets.map((target) => target.title));
const uniqueAnswers = new Set(targets.map((target) => target.quickAnswer));
const uniqueDecisionSections = new Set(targets.map((target) => target.decisionSection.body));
if (uniqueTitles.size !== 36) errors.push("Target titles are not unique");
if (uniqueAnswers.size !== 36) errors.push("Target quick answers are not unique");
if (uniqueDecisionSections.size !== 36) errors.push("Target decision sections are not unique");

async function fetchRuntime(pathname, host) {
  if (publicAudit) {
    const response = await fetch(`https://${host}${pathname}`, {
      headers: { "user-agent": "Madabase comparison-first auditor/1.0" },
      redirect: "follow",
      signal: AbortSignal.timeout(30_000),
    });
    return { status: response.status, body: await response.text() };
  }

  const origin = new URL(runtimeOrigin);
  return new Promise((resolve, reject) => {
    const request = http.request({
      hostname: origin.hostname,
      port: origin.port,
      path: pathname,
      method: "GET",
      headers: { Host: host },
    }, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => { body += chunk; });
      response.on("end", () => resolve({ status: response.statusCode, body }));
    });
    request.on("error", reject);
    request.end();
  });
}

let runtimeChecked = 0;
let sitemapChecked = 0;
if (runtimeOrigin || publicAudit) {
  for (const target of targets) {
    const key = `${target.site}:${target.slug}`;
    const response = await fetchRuntime(`/guides/${target.slug}`, hosts[target.site]);
    if (response.status !== 200) errors.push(`${key} runtime returned ${response.status}`);
    if (!response.body.includes(`<link rel="canonical" href="${target.url}"`)) errors.push(`${key} runtime canonical changed`);
    if (!response.body.includes(target.title)) errors.push(`${key} runtime title or H1 is missing`);
    if (!response.body.includes(target.decisionSection.heading)) errors.push(`${key} runtime decision section is missing`);
    if (!response.body.includes("September 4, 2026")) errors.push(`${key} runtime refresh date is missing`);
    if (/name="robots" content="[^"]*noindex/i.test(response.body)) errors.push(`${key} unexpectedly renders noindex`);
    runtimeChecked += 1;
  }

  for (const site of Object.keys(expectedSiteCounts)) {
    const sitemap = await fetchRuntime("/sitemap.xml", hosts[site]);
    if (sitemap.status !== 200) errors.push(`${site} sitemap returned ${sitemap.status}`);
    for (const target of targets.filter((item) => item.site === site)) {
      const escapedUrl = target.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const entry = new RegExp(`<loc>${escapedUrl}</loc>\\s*<lastmod>2026-09-04(?:T00:00:00\\.000Z)?</lastmod>`);
      if (!entry.test(sitemap.body)) errors.push(`${target.site}:${target.slug} sitemap lastmod is not 2026-09-04`);
      sitemapChecked += 1;
    }
  }
}

const report = {
  ok: errors.length === 0,
  targets: targets.length,
  newRoutes: cohort.scope?.newRoutes,
  sites: Object.fromEntries(Object.keys(expectedSiteCounts).map((site) => [site, targets.filter((target) => target.site === site).length])),
  refreshedGeneratedGuides: refreshedGuides.length,
  consolidatedCanonicalHubs: targets.filter((target) => consolidatedFamilies.has(`${target.site}:${target.familySlug}`)).length,
  deep43Overlap: targets.filter((target) => deepUrls.has(target.url)).length,
  protectedLedgerOverlap: targets.filter((target) => protectedUrls.has(target.url)).length,
  uniqueTitles: uniqueTitles.size,
  uniqueQuickAnswers: uniqueAnswers.size,
  uniqueDecisionSections: uniqueDecisionSections.size,
  mode: publicAudit ? "public" : runtimeOrigin ? "local-runtime" : "source-only",
  runtimeChecked,
  sitemapChecked,
  reviewGates: cohort.reviewGates,
};

console.log("Comparison-first cohort audit");
console.log(JSON.stringify(report, null, 2));
if (errors.length) {
  console.error(`\nErrors (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("\nComparison-first cohort audit passed.");
