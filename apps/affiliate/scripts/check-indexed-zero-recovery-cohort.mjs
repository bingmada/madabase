import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const workspaceDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configPath = path.join(workspaceDir, "config", "indexed-zero-recovery-cohort-2026-09-07.json");
const sourcePath = path.join(workspaceDir, "lib", "breadth-draft-120-plus-content.ts");
const softLedgerPath = path.join(workspaceDir, "reports", "soft151-search-gate-2026-09-07.csv");
const familyPath = path.join(workspaceDir, "config", "breadth-draft-120-150-research-pool.json");
const opportunityPath = path.join(workspaceDir, "config", "breadth-draft-120-plus-opportunity-evidence.json");
const communityPath = path.join(workspaceDir, "config", "breadth-draft-120-plus-community-evidence.json");
const productPaths = {
  babyProductData: path.join(workspaceDir, "config", "breadth-draft-baby-product-research.json"),
  homeofficeProductData: path.join(workspaceDir, "config", "breadth-draft-homeoffice-product-research.json"),
  networkProductData: path.join(workspaceDir, "config", "breadth-draft-network-product-research.json"),
  petProductData: path.join(workspaceDir, "config", "breadth-draft-pet-product-research.json"),
  smarthomeProductData: path.join(workspaceDir, "config", "breadth-draft-smarthome-product-research.json"),
};
const comparisonFirstPath = path.join(workspaceDir, "config", "comparison-first-cohort-2026-09-04.json");
const deepPath = path.join(workspaceDir, "config", "deep-rank-recovery-2026-08-27.json");
const controlPath = path.join(workspaceDir, "config", "search-recovery-control.json");

const cohort = JSON.parse(fs.readFileSync(configPath, "utf8"));
const familyPoolData = JSON.parse(fs.readFileSync(familyPath, "utf8"));
const opportunityData = JSON.parse(fs.readFileSync(opportunityPath, "utf8"));
const communityEvidenceData = JSON.parse(fs.readFileSync(communityPath, "utf8"));
const comparisonFirst = JSON.parse(fs.readFileSync(comparisonFirstPath, "utf8"));
const deep = JSON.parse(fs.readFileSync(deepPath, "utf8"));
const control = JSON.parse(fs.readFileSync(controlPath, "utf8"));
const productData = Object.fromEntries(
  Object.entries(productPaths).map(([name, filePath]) => [name, JSON.parse(fs.readFileSync(filePath, "utf8"))]),
);
const errors = [];
const runtimeOrigin = process.env.INDEXED_ZERO_RECOVERY_ORIGIN;
const publicAudit = process.env.INDEXED_ZERO_RECOVERY_PUBLIC_AUDIT === "1";

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = [];
    let value = "";
    let quoted = false;
    for (let index = 0; index < line.length; index += 1) {
      const character = line[index];
      if (character === '"') {
        if (quoted && line[index + 1] === '"') {
          value += '"';
          index += 1;
        } else {
          quoted = !quoted;
        }
      } else if (character === "," && !quoted) {
        values.push(value);
        value = "";
      } else {
        value += character;
      }
    }
    values.push(value);
    return Object.fromEntries(headers.map((header, index) => [header, values[index]]));
  });
}

function transpile(filePath) {
  return ts.transpileModule(fs.readFileSync(filePath, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    fileName: filePath,
  }).outputText;
}

const contentJavascript = transpile(sourcePath).replace(/^import .+;\n/gm, "");
const injected = [
  ["familyPoolData", familyPoolData],
  ["indexedZeroRecoveryData", cohort],
  ["opportunityData", opportunityData],
  ["communityEvidenceData", communityEvidenceData],
  ...Object.entries(productData),
].map(([name, value]) => `const ${name} = ${JSON.stringify(value)};`).join("\n");
const expansion = await import(`data:text/javascript;base64,${Buffer.from(`${injected}\n${contentJavascript}`).toString("base64")}`);

const softRows = parseCsv(fs.readFileSync(softLedgerPath, "utf8"));
const exactEligibleUrls = new Set(
  softRows
    .filter((row) => Number(row.currentImpressions) === 0)
    .filter((row) => Number(row.previousImpressions) === 0)
    .filter((row) => row.inspectionStatus === "indexed")
    .map((row) => row.url),
);
const targetUrls = new Set();
const targetKeys = new Set();
const targets = cohort.targets ?? [];
const expectedSiteCounts = { smarthome: 21, homeoffice: 6, baby: 13 };
const hosts = {
  smarthome: "smarthome.madabase.com",
  homeoffice: "homeoffice.madabase.com",
  baby: "baby.madabase.com",
};
const familyKeys = new Set(familyPoolData.families.map((item) => `${item.site}:${item.familySlug}`));
const generatedByKey = new Map(expansion.breadthDraft120PlusGuides.map((guide) => [`${guide.site}:${guide.familySlug}`, guide]));
const comparisonFirstUrls = new Set((comparisonFirst.targets ?? []).map((target) => target.url));
const deepUrls = new Set((deep.targets ?? []).map((target) => target.url));

if (cohort.releaseDate !== "2026-09-07") errors.push(`Unexpected release date ${cohort.releaseDate}`);
if (cohort.action !== "existing-page-topic-hierarchy-repair") errors.push(`Unexpected action ${cohort.action}`);
if (!control.freeze?.allowedActions?.includes(cohort.action)) errors.push("Cohort action is not allowed by search-recovery control");
if (control.freeze?.blockedActions?.includes(cohort.action)) errors.push("Cohort action is blocked by search-recovery control");
if (cohort.scope?.newRoutes !== 0) errors.push("Cohort must not add routes");
if (cohort.scope?.targetCount !== 40 || targets.length !== 40) errors.push(`Expected 40 targets; found ${targets.length}`);
if (exactEligibleUrls.size !== 40) errors.push(`Exact indexed/double-zero source set changed: ${exactEligibleUrls.size}`);

for (const [site, expected] of Object.entries(expectedSiteCounts)) {
  const actual = targets.filter((target) => target.site === site).length;
  if (actual !== expected) errors.push(`${site} expected ${expected}; found ${actual}`);
}

for (const target of targets) {
  const key = `${target.site}:${target.familySlug}`;
  if (targetKeys.has(key)) errors.push(`Duplicate target key ${key}`);
  if (targetUrls.has(target.url)) errors.push(`Duplicate target URL ${target.url}`);
  targetKeys.add(key);
  targetUrls.add(target.url);

  const expectedSlug = `${target.familySlug}-buying-guide`;
  const expectedUrl = `https://${hosts[target.site]}/guides/${expectedSlug}`;
  if (target.slug !== expectedSlug) errors.push(`${key} changed its existing slug`);
  if (target.url !== expectedUrl) errors.push(`${key} URL mismatch`);
  if (!exactEligibleUrls.has(target.url)) errors.push(`${key} is not in the exact indexed/double-zero source set`);
  if (!familyKeys.has(key)) errors.push(`${key} is not an existing breadth family`);
  if (comparisonFirstUrls.has(target.url)) errors.push(`${key} overlaps the September 4 cohort`);
  if (deepUrls.has(target.url)) errors.push(`${key} overlaps Deep43`);
  if (!/\bvs\b/i.test(target.title)) errors.push(`${key} title is not comparison-led`);
  if (!target.searchQuestion?.endsWith("?")) errors.push(`${key} needs an explicit search question`);
  if ((target.choosePrimary?.length ?? 0) < 100) errors.push(`${key} primary decision is too thin`);
  if ((target.chooseAlternative?.length ?? 0) < 90) errors.push(`${key} alternative decision is too thin`);
  if ((target.decisionFocus?.length ?? 0) < 180) errors.push(`${key} decision section is too thin`);
  if ((target.comparisonRows?.length ?? 0) !== 4) errors.push(`${key} needs exactly four decision rows`);
  if ((target.relatedGuideSlugs?.length ?? 0) < 3) errors.push(`${key} needs three related guides`);
  if (!target.liveSerp?.includes("2026-09-07")) errors.push(`${key} lost dated live-SERP evidence`);

  const guide = generatedByKey.get(key);
  if (!guide) {
    errors.push(`Missing generated guide ${key}`);
    continue;
  }
  if (guide.slug !== target.slug) errors.push(`${key} generated route changed`);
  if (guide.title !== target.title) errors.push(`${key} title override failed`);
  if (guide.searchQuestion !== target.searchQuestion) errors.push(`${key} search-question override failed`);
  if (guide.quickAnswer !== `${target.choosePrimary} ${target.chooseAlternative}`) errors.push(`${key} direct-answer override failed`);
  if (guide.updatedAt !== "September 7, 2026") errors.push(`${key} did not receive the bounded refresh date`);
  if (guide.sections?.[0]?.body !== target.decisionFocus) errors.push(`${key} decision section is not first`);
  if (guide.comparisonTable?.columns?.[0] !== target.primaryOption || guide.comparisonTable?.columns?.[1] !== target.alternativeOption) {
    errors.push(`${key} comparison columns do not match the decision fork`);
  }
  if (guide.comparisonTable?.rows?.length !== 4) errors.push(`${key} comparison rows changed`);
  for (const related of target.relatedGuideSlugs) {
    if (!guide.relatedGuides?.includes(related)) errors.push(`${key} lost related guide ${related}`);
  }
}

for (const url of exactEligibleUrls) {
  if (!targetUrls.has(url)) errors.push(`Eligible indexed/double-zero page omitted: ${url}`);
}

const refreshed = expansion.breadthDraft120PlusGuides.filter((guide) => guide.updatedAt === "September 7, 2026");
if (refreshed.length !== 40) errors.push(`Expected exactly 40 refreshed breadth guides; found ${refreshed.length}`);
for (const guide of refreshed) {
  if (!targetKeys.has(`${guide.site}:${guide.familySlug}`)) errors.push(`Non-target guide received refresh date: ${guide.site}:${guide.slug}`);
}

for (const [label, values] of [
  ["titles", targets.map((target) => target.title)],
  ["questions", targets.map((target) => target.searchQuestion)],
  ["answers", targets.map((target) => `${target.choosePrimary} ${target.chooseAlternative}`)],
  ["decision sections", targets.map((target) => target.decisionFocus)],
]) {
  if (new Set(values).size !== 40) errors.push(`Target ${label} are not unique`);
}

async function fetchRuntime(pathname, host) {
  if (publicAudit) {
    let lastError;
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const response = await fetch(`https://${host}${pathname}`, {
          headers: { "user-agent": "Madabase indexed-zero recovery auditor/1.0" },
          redirect: "follow",
          signal: AbortSignal.timeout(60_000),
        });
        return { status: response.status, body: await response.text() };
      } catch (error) {
        lastError = error;
      }
    }
    throw new Error(`${host}${pathname} failed twice: ${lastError?.message ?? "unknown error"}`);
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
  async function auditTarget(target) {
    const response = await fetchRuntime(`/guides/${target.slug}`, hosts[target.site]);
    if (response.status !== 200) errors.push(`${target.site}:${target.slug} runtime returned ${response.status}`);
    if (!response.body.includes(`<link rel="canonical" href="${target.url}"`)) errors.push(`${target.site}:${target.slug} canonical changed`);
    if (!response.body.includes(target.title)) errors.push(`${target.site}:${target.slug} title or H1 is missing`);
    if (!response.body.includes("September 7, 2026")) errors.push(`${target.site}:${target.slug} refresh date is missing`);
    if (/name="robots" content="[^"]*noindex/i.test(response.body)) errors.push(`${target.site}:${target.slug} unexpectedly renders noindex`);
    runtimeChecked += 1;
  }

  if (publicAudit) {
    let nextTarget = 0;
    async function worker() {
      while (nextTarget < targets.length) {
        const target = targets[nextTarget];
        nextTarget += 1;
        await auditTarget(target);
      }
    }
    await Promise.all(Array.from({ length: 3 }, () => worker()));
  } else {
    for (const target of targets) await auditTarget(target);
  }

  for (const site of Object.keys(expectedSiteCounts)) {
    const sitemap = await fetchRuntime("/sitemap.xml", hosts[site]);
    if (sitemap.status !== 200) errors.push(`${site} sitemap returned ${sitemap.status}`);
    for (const target of targets.filter((item) => item.site === site)) {
      const escapedUrl = target.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const entry = new RegExp(`<loc>${escapedUrl}</loc>\\s*<lastmod>2026-09-07(?:T00:00:00\\.000Z)?</lastmod>`);
      if (!entry.test(sitemap.body)) errors.push(`${target.site}:${target.slug} sitemap lastmod is not 2026-09-07`);
      sitemapChecked += 1;
    }
  }
}

const report = {
  ok: errors.length === 0,
  targets: targets.length,
  exactEligibleUrls: exactEligibleUrls.size,
  newRoutes: cohort.scope?.newRoutes,
  sites: Object.fromEntries(Object.keys(expectedSiteCounts).map((site) => [site, targets.filter((target) => target.site === site).length])),
  refreshedGeneratedGuides: refreshed.length,
  comparisonFirstOverlap: targets.filter((target) => comparisonFirstUrls.has(target.url)).length,
  deep43Overlap: targets.filter((target) => deepUrls.has(target.url)).length,
  uniqueTitles: new Set(targets.map((target) => target.title)).size,
  uniqueQuestions: new Set(targets.map((target) => target.searchQuestion)).size,
  mode: publicAudit ? "public" : runtimeOrigin ? "local-runtime" : "source-only",
  runtimeChecked,
  sitemapChecked,
  reviewGates: cohort.reviewGates,
};

console.log("Indexed zero-impression recovery cohort audit");
console.log(JSON.stringify(report, null, 2));
if (errors.length) {
  console.error(`\nErrors (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("\nIndexed zero-impression recovery cohort audit passed.");
