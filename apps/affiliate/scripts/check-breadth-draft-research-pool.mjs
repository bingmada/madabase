import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const affiliateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const poolPath = path.join(affiliateDir, "config", "breadth-draft-120-150-research-pool.json");
const exclusionPath = path.join(affiliateDir, "config", "breadth-draft-120-150-exclusions.json");
const collisionDecisionPath = path.join(affiliateDir, "config", "breadth-draft-120-plus-collision-decisions.json");
const pool = JSON.parse(fs.readFileSync(poolPath, "utf8"));
const exclusionPlan = JSON.parse(fs.readFileSync(exclusionPath, "utf8"));
const collisionPlan = JSON.parse(fs.readFileSync(collisionDecisionPath, "utf8"));
const expectedSites = new Set(["network", "smarthome", "homeoffice", "baby", "pet"]);
const ignoredConfigFiles = new Set([path.basename(poolPath), path.basename(exclusionPath), path.basename(collisionDecisionPath)]);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(fullPath);
    return [fullPath];
  });
}

function duplicates(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) => value);
}

const stopwords = new Set([
  "a", "an", "and", "are", "best", "buy", "buying", "for", "guide", "home", "how", "in", "is",
  "of", "or", "should", "smart", "the", "to", "what", "which", "with", "without", "your",
]);

function tokens(value) {
  return new Set(String(value ?? "")
    .toLowerCase()
    .replace(/wi[ -]?fi/g, "wifi")
    .replace(/ethernet/g, "network")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((token) => token && !stopwords.has(token)));
}

function similarity(left, right) {
  const a = tokens(left);
  const b = tokens(right);
  if (!a.size || !b.size) return 0;
  const intersection = [...a].filter((token) => b.has(token)).length;
  return intersection / Math.min(a.size, b.size);
}

const configDir = path.join(affiliateDir, "config");
const configFiles = walk(configDir).filter((file) => file.endsWith(".json") && !ignoredConfigFiles.has(path.basename(file)));
const existingFamilies = [];
for (const file of configFiles) {
  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    continue;
  }
  if (payload.publicationStatus === "research" || payload.cohort === pool.cohort) continue;
  const families = Array.isArray(payload.families) ? payload.families : [];
  const products = Array.isArray(payload.products) ? payload.products : [];
  for (const record of [...families, ...products]) {
    if (!record.familySlug) continue;
    existingFamilies.push({
      site: record.site,
      familySlug: record.familySlug,
      familyName: record.familyName,
      source: path.relative(affiliateDir, file),
    });
  }
}

const sourceFiles = [path.join(affiliateDir, "lib"), path.join(affiliateDir, "app")]
  .flatMap((dir) => walk(dir))
  .filter((file) => /\.(?:ts|tsx|js|jsx)$/.test(file));
const sourceRecords = [];
for (const file of sourceFiles) {
  const text = fs.readFileSync(file, "utf8");
  for (const field of ["slug", "familySlug", "title", "searchQuestion"]) {
    const pattern = new RegExp(`${field}\\s*:\\s*[\"'\\\`]([^\"'\\\`]+)[\"'\\\`]`, "g");
    for (const match of text.matchAll(pattern)) {
      sourceRecords.push({ field, value: match[1], source: path.relative(affiliateDir, file) });
    }
  }
}

const exactFamilyKeys = new Set(existingFamilies.map((item) => `${item.site}:${item.familySlug}`));
const exactSlugs = new Set(sourceRecords.filter((item) => item.field === "slug" || item.field === "familySlug").map((item) => item.value));
const problems = [];
const warnings = [];
const exclusionKeys = new Set(exclusionPlan.exclusions.map((item) => `${item.site}:${item.familySlug}`));
const selectedProductFiles = configFiles.filter((file) => /breadth-draft-(?:network|smarthome|homeoffice|baby|pet)-product-research\.json$/.test(file));
const selectedKeys = new Set(selectedProductFiles.flatMap((file) => {
  const payload = JSON.parse(fs.readFileSync(file, "utf8"));
  return (payload.products ?? []).map((item) => `${item.site}:${item.familySlug}`);
}));
const collisionDecisionByKey = new Map(collisionPlan.decisions.map((item) => [item.key, item]));

if (pool.publicationStatus !== "research") problems.push("Research pool must remain isolated with publicationStatus=research");
if (!Array.isArray(pool.families) || pool.families.length < 150) problems.push("Research pool needs at least 150 candidates before qualification gates");

for (const key of duplicates(pool.families.map((item) => `${item.site}:${item.familySlug}`))) {
  problems.push(`Duplicate candidate key: ${key}`);
}
for (const key of duplicates(exclusionPlan.exclusions.map((item) => `${item.site}:${item.familySlug}`))) {
  problems.push(`Duplicate exclusion key: ${key}`);
}
for (const exclusion of exclusionPlan.exclusions) {
  const key = `${exclusion.site}:${exclusion.familySlug}`;
  if (!pool.families.some((item) => `${item.site}:${item.familySlug}` === key)) problems.push(`Exclusion is not in research pool: ${key}`);
  if (!exclusion.reason || exclusion.reason.length < 40) problems.push(`Exclusion needs a specific reason: ${key}`);
}

for (const item of pool.families) {
  const key = `${item.site}:${item.familySlug}`;
  if (!expectedSites.has(item.site)) problems.push(`Unknown site: ${key}`);
  if (!item.familyName || !item.category || !item.alternative) problems.push(`Incomplete candidate: ${key}`);
  if (exactFamilyKeys.has(key)) problems.push(`Existing family collision: ${key}`);
  if (exactSlugs.has(item.familySlug) || exactSlugs.has(`${item.familySlug}-buying-guide`)) {
    problems.push(`Existing page slug collision: ${key}`);
  }

  const candidateLabel = `${item.familyName} ${item.familySlug}`;
  const candidateTokens = tokens(candidateLabel);
  const matches = [];
  for (const existing of existingFamilies) {
    if (existing.site && existing.site !== item.site) continue;
    const score = similarity(candidateLabel, `${existing.familyName ?? ""} ${existing.familySlug}`);
    if (score >= 0.66 && existing.familySlug !== item.familySlug) matches.push({ score, value: existing.familyName ?? existing.familySlug, source: existing.source });
  }
  for (const sourceRecord of sourceRecords) {
    const sourceTokens = tokens(sourceRecord.value);
    const sharedTokens = [...candidateTokens].filter((token) => sourceTokens.has(token)).length;
    if (sourceTokens.size < 2 || sharedTokens < 2) continue;
    const score = similarity(candidateLabel, sourceRecord.value);
    if (score >= 0.5 && sourceRecord.value !== item.familySlug && sourceRecord.value !== `${item.familySlug}-buying-guide`) {
      matches.push({ score, value: sourceRecord.value, source: sourceRecord.source });
    }
  }
  const best = matches.sort((a, b) => b.score - a.score)[0];
  if (best) warnings.push({
    key,
    similarity: Number(best.score.toFixed(2)),
    possibleCollision: best.value,
    source: best.source,
  });
}

const selectedWarnings = warnings.filter((item) => selectedKeys.has(item.key));
for (const warning of selectedWarnings) {
  const decision = collisionDecisionByKey.get(warning.key);
  if (!decision) problems.push(`Selected similarity warning lacks a decision: ${warning.key}`);
  else if (decision.decision !== "distinct") problems.push(`Selected collision is not marked distinct: ${warning.key}`);
  else if (decision.possibleCollision !== warning.possibleCollision) problems.push(`Collision reference changed and needs re-review: ${warning.key}`);
  else if (!decision.boundary || decision.boundary.length < 120) problems.push(`Collision boundary is too weak: ${warning.key}`);
}
for (const decision of collisionPlan.decisions) {
  if (!selectedWarnings.some((item) => item.key === decision.key)) problems.push(`Stale or untriggered collision decision: ${decision.key}`);
}

const report = {
  status: problems.length ? "failed" : "research_pool_valid",
  candidates: pool.families.length,
  excluded: exclusionKeys.size,
  qualifiedMinimum: 120,
  ownerRelaxedUpperBound: pool.families.length - exclusionKeys.size,
  eligibleBeforeProductAndDemandGates: pool.families.length - exclusionKeys.size,
  bySite: Object.fromEntries([...expectedSites].map((site) => [site, pool.families.filter((item) => item.site === site).length])),
  eligibleBySite: Object.fromEntries([...expectedSites].map((site) => [site, pool.families.filter((item) => item.site === site && !exclusionKeys.has(`${item.site}:${item.familySlug}`)).length])),
  existingFamilyRecords: existingFamilies.length,
  indexedSourceRecords: sourceRecords.length,
  hardProblems: problems,
  similarityWarnings: warnings,
  selectedSimilarityWarnings: selectedWarnings.map((item) => ({ ...item, decision: collisionDecisionByKey.get(item.key)?.decision })),
};

console.log(JSON.stringify(report, null, 2));
if (problems.length) process.exitCode = 1;
