import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const workspaceDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryDir = path.resolve(workspaceDir, "../..");
const configPath = path.join(workspaceDir, "config", "deep-rank-recovery-2026-08-27.json");
const sourcePath = path.join(workspaceDir, "lib", "quadruple-expansion-content.ts");
const briefPath = path.join(workspaceDir, "lib", "quadruple-family-editorial.ts");
const communityPath = path.join(workspaceDir, "config", "quadruple-community-evidence.json");
const rankingPath = path.join(repositoryDir, "docs", "affiliate-ranking118-search-gate-2026-08-20.csv");
const softPath = path.join(repositoryDir, "docs", "affiliate-soft151-search-gate-2026-08-20.csv");
const consolidationPath = path.join(workspaceDir, "config", "search-recovery-consolidations-2026-08-23.json");

const recovery = JSON.parse(fs.readFileSync(configPath, "utf8"));
const community = JSON.parse(fs.readFileSync(communityPath, "utf8"));
const consolidations = JSON.parse(fs.readFileSync(consolidationPath, "utf8"));
const errors = [];
const runtimeOrigin = process.env.DEEP_RANK_RECOVERY_ORIGIN;
const publicAudit = process.env.DEEP_RANK_RECOVERY_PUBLIC_AUDIT === "1";

function transpile(filePath) {
  return ts.transpileModule(fs.readFileSync(filePath, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    fileName: filePath,
  }).outputText;
}

const contentJavascript = transpile(sourcePath)
  .replace(/^import communityEvidenceData[^;]+;\n/m, "")
  .replace(/^import deepRankRecoveryData[^;]+;\n/m, "")
  .replace(/^import \{ findFamilyEditorialBrief \}[^;]+;\n/m, "");
const javascript = `${transpile(briefPath)}\nconst communityEvidenceData = ${JSON.stringify(community)};\nconst deepRankRecoveryData = ${JSON.stringify(recovery)};\n${contentJavascript}`;
const expansion = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);

const hosts = {
  network: "network.madabase.com",
  smarthome: "smarthome.madabase.com",
  homeoffice: "homeoffice.madabase.com",
  baby: "baby.madabase.com",
  pet: "pets.madabase.com",
  costume: "costumes.madabase.com",
};
const validSites = new Set(Object.keys(hosts));
const targets = recovery.targets ?? [];
const targetKeys = new Set();

if (recovery.releaseDate !== "2026-08-27") errors.push(`Unexpected release date ${recovery.releaseDate}`);
if (recovery.measurementWindow?.start !== "2026-08-18" || recovery.measurementWindow?.end !== "2026-08-24") {
  errors.push("Recovery cohort must remain tied to the complete August 18-24 measurement window");
}
if (targets.length !== 43) errors.push(`Expected 43 deep-rank targets; found ${targets.length}`);
if (recovery.selection?.minimumImpressions !== 2 || recovery.selection?.minimumAveragePositionExclusive !== 40 || recovery.selection?.clicks !== 0) {
  errors.push("Selection thresholds changed from the evidence-backed 2+ impressions, zero-click, position-greater-than-40 gate");
}

for (const target of targets) {
  const key = `${target.site}:${target.slug}`;
  if (targetKeys.has(key)) errors.push(`Duplicate target ${key}`);
  targetKeys.add(key);
  if (!validSites.has(target.site)) errors.push(`Invalid site for ${key}`);
  if (target.impressions < 2) errors.push(`${key} has fewer than two complete-window impressions`);
  if (target.position <= 40) errors.push(`${key} is not a deep-ranking page`);
  const expectedUrl = `https://${hosts[target.site]}/guides/${target.slug}`;
  if (target.url !== expectedUrl) errors.push(`${key} URL mismatch: ${target.url}`);
}

const protectedUrls = new Set(
  [rankingPath, softPath]
    .flatMap((filePath) => fs.readFileSync(filePath, "utf8").match(/https:\/\/[^,\r\n]+/g) ?? []),
);
for (const target of targets) {
  if (protectedUrls.has(target.url)) errors.push(`${target.url} overlaps Ranking118 or Soft151`);
}

const consolidatedFamilies = new Set(consolidations.families.map((item) => `${item.site}:${item.familySlug}`));
for (const target of targets) {
  for (const familyKey of consolidatedFamilies) {
    const [site, familySlug] = familyKey.split(":");
    if (target.site === site && target.slug.startsWith(`${familySlug}-`)) {
      errors.push(`${target.site}:${target.slug} overlaps a consolidated family`);
    }
  }
}

const guidesByKey = new Map(expansion.quadrupleExpansionGuides.map((guide) => [`${guide.site}:${guide.slug}`, guide]));
const refreshedGuides = expansion.quadrupleExpansionGuides.filter((guide) => guide.updatedAt === "August 27, 2026");
if (refreshedGuides.length !== 43) errors.push(`Expected exactly 43 refreshed generated guides; found ${refreshedGuides.length}`);

for (const target of targets) {
  const key = `${target.site}:${target.slug}`;
  const guide = guidesByKey.get(key);
  if (!guide) {
    errors.push(`Missing generated guide ${key}`);
    continue;
  }
  if (guide.updatedAt !== "August 27, 2026") errors.push(`${key} did not receive the bounded refresh date`);
  if (guide.sections.length !== 6) errors.push(`${key} should have exactly one added decision section`);
  if (!guide.quickAnswer?.toLowerCase().includes(guide.title.split(":")[0].split(" vs.")[0].split(" Buying Guide")[0].toLowerCase().split(" ")[0])) {
    errors.push(`${key} quick answer is not page-specific`);
  }
  if (!guide.searchQuestion?.endsWith("?")) errors.push(`${key} lost its explicit search question`);
  if (guide.relatedGuides?.length < 3) errors.push(`${key} lost sibling intent links`);
  if (guide.governance?.decision !== "rewrite") errors.push(`${key} lost its governance record`);
}

for (const guide of expansion.quadrupleExpansionGuides) {
  const key = `${guide.site}:${guide.slug}`;
  if (!targetKeys.has(key) && guide.updatedAt === "August 27, 2026") errors.push(`Protected non-target guide changed: ${key}`);
}

const quickAnswers = refreshedGuides.map((guide) => guide.quickAnswer);
const recoverySections = refreshedGuides.map((guide) => guide.sections[0]?.body);
if (new Set(quickAnswers).size !== 43) errors.push("Refreshed quick answers are not unique");
if (new Set(recoverySections).size !== 43) errors.push("Added decision sections are not unique");

async function fetchRuntime(pathname, host) {
  if (publicAudit) {
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const response = await fetch(`https://${host}${pathname}`, {
          headers: { "user-agent": "Madabase deep-rank recovery auditor/1.0" },
          redirect: "follow",
          signal: AbortSignal.timeout(30_000),
        });
        return { status: response.status, body: await response.text() };
      } catch (error) {
        lastError = error;
        if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 500));
      }
    }
    throw lastError;
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
    const guide = guidesByKey.get(key);
    const response = await fetchRuntime(`/guides/${target.slug}`, hosts[target.site]);
    if (response.status !== 200) errors.push(`${key} runtime returned ${response.status}`);
    if (!response.body.includes(`<link rel="canonical" href="${target.url}"`)) errors.push(`${key} runtime canonical changed`);
    if (!response.body.includes(guide.title)) errors.push(`${key} runtime title or H1 is missing`);
    if (!response.body.includes(guide.sections[0].heading)) errors.push(`${key} runtime decision section is missing`);
    if (!response.body.includes("August 27, 2026")) errors.push(`${key} runtime refresh date is missing`);
    if (/name="robots" content="[^"]*noindex/i.test(response.body)) errors.push(`${key} unexpectedly renders noindex`);
    runtimeChecked += 1;
  }

  for (const site of new Set(targets.map((target) => target.site))) {
    const sitemap = await fetchRuntime("/sitemap.xml", hosts[site]);
    if (sitemap.status !== 200) errors.push(`${site} sitemap returned ${sitemap.status}`);
    for (const target of targets.filter((item) => item.site === site)) {
      const escapedUrl = target.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const entry = new RegExp(`<loc>${escapedUrl}</loc>\\s*<lastmod>2026-08-27(?:T00:00:00\\.000Z)?</lastmod>`);
      if (!entry.test(sitemap.body)) errors.push(`${target.site}:${target.slug} sitemap lastmod is not 2026-08-27`);
      sitemapChecked += 1;
    }
  }
}

const report = {
  ok: errors.length === 0,
  targets: targets.length,
  sites: Object.fromEntries([...validSites].map((site) => [site, targets.filter((target) => target.site === site).length])),
  impressions: targets.reduce((sum, target) => sum + target.impressions, 0),
  positionRange: {
    best: Math.min(...targets.map((target) => target.position)),
    worst: Math.max(...targets.map((target) => target.position)),
  },
  refreshedGeneratedGuides: refreshedGuides.length,
  protectedCohortOverlap: targets.filter((target) => protectedUrls.has(target.url)).length,
  consolidationOverlap: errors.filter((error) => error.includes("consolidated family")).length,
  uniqueQuickAnswers: new Set(quickAnswers).size,
  uniqueDecisionSections: new Set(recoverySections).size,
  mode: publicAudit ? "public" : runtimeOrigin ? "local-runtime" : "source-only",
  runtimeChecked,
  sitemapChecked,
};

console.log("Deep-rank recovery audit");
console.log(JSON.stringify(report, null, 2));
if (errors.length) {
  console.error(`\nErrors (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("\nDeep-rank recovery audit passed.");
