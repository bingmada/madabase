import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const planPath = path.join(appRoot, "config", "next-product-expansion-100-readiness.json");
const seedsPath = path.join(appRoot, "config", "next-product-expansion-100-candidate-seeds.json");
const oldPoolPath = path.join(appRoot, "config", "breadth-draft-120-150-research-pool.json");
const plan = JSON.parse(fs.readFileSync(planPath, "utf8"));
const seeds = JSON.parse(fs.readFileSync(seedsPath, "utf8"));
const oldPool = JSON.parse(fs.readFileSync(oldPoolPath, "utf8"));
const errors = [];

if (plan.cohort !== "product-expansion-100-next") errors.push("Unexpected cohort id");
if (plan.status !== "research-planning") errors.push("Cohort must remain in research-planning until product gates pass");
if (plan.targetSelectedPages !== 100) errors.push("Selected-page target must be 100");
if (plan.researchPoolTarget < 125) errors.push("Research pool is too small for the previous qualification yield");

const selectedTotal = Object.values(plan.targetDistribution ?? {}).reduce((sum, value) => sum + value, 0);
const poolTotal = Object.values(plan.researchPoolDistribution ?? {}).reduce((sum, value) => sum + value, 0);
if (selectedTotal !== plan.targetSelectedPages) errors.push(`Selected distribution totals ${selectedTotal}, expected ${plan.targetSelectedPages}`);
if (poolTotal !== plan.researchPoolTarget) errors.push(`Research distribution totals ${poolTotal}, expected ${plan.researchPoolTarget}`);

const publication = plan.publicationPolicy ?? {};
if (publication.sitemapExcluded !== true) errors.push("Initial cohort must stay out of sitemap");
if (publication.discoveryExcluded !== true) errors.push("Initial cohort must stay out of home/category discovery");
if (publication.indexNowSubmitted !== false) errors.push("IndexNow must remain disabled during soft launch");
if (publication.searchConsoleSubmitted !== false) errors.push("Search Console submission must remain disabled during soft launch");

if (!Array.isArray(plan.requiredGates) || plan.requiredGates.length < 10) errors.push("Product release gates are incomplete");
if (!Array.isArray(plan.releaseBlockers) || plan.releaseBlockers.length < 1) errors.push("Current blockers must be recorded");

if (seeds.cohort !== plan.cohort || seeds.status !== "seed-research-only") errors.push("Candidate seed cohort is missing or has escaped research-only state");
const seedRows = Object.entries(seeds.sites ?? {}).flatMap(([site, families]) =>
  families.map(([familySlug, familyName]) => ({ site, familySlug, familyName })),
);
if (seedRows.length !== plan.researchPoolTarget) errors.push(`Candidate seed count is ${seedRows.length}, expected ${plan.researchPoolTarget}`);
for (const [site, families] of Object.entries(seeds.sites ?? {})) {
  if (families.length !== plan.researchPoolDistribution?.[site]) errors.push(`${site} seed count is ${families.length}, expected ${plan.researchPoolDistribution?.[site]}`);
}
const seedKeys = seedRows.map((row) => `${row.site}:${row.familySlug}`);
if (new Set(seedKeys).size !== seedKeys.length) errors.push("Candidate seed keys are not unique");
if (Object.values(seeds.defaultSeedState ?? {}).some(Boolean)) errors.push("Every candidate gate must remain false at seed stage");

const oldFamilyKeys = new Set((oldPool.families ?? []).map((row) => `${row.site}:${row.familySlug}`));
for (const key of seedKeys) if (oldFamilyKeys.has(key)) errors.push(`Candidate seed repeats the prior breadth pool: ${key}`);

const contentSlugs = new Set();
for (const name of fs.readdirSync(path.join(appRoot, "lib"))) {
  if (!name.endsWith(".ts") && !name.endsWith(".tsx")) continue;
  const source = fs.readFileSync(path.join(appRoot, "lib", name), "utf8");
  for (const match of source.matchAll(/\bslug:\s*["']([^"']+)["']/g)) contentSlugs.add(match[1]);
}
for (const row of seedRows) if (contentSlugs.has(row.familySlug) || contentSlugs.has(`${row.familySlug}-buying-guide`)) {
  errors.push(`Candidate seed has an exact current-content collision: ${row.site}:${row.familySlug}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({
  cohort: plan.cohort,
  status: plan.status,
  targetSelectedPages: plan.targetSelectedPages,
  researchPoolTarget: plan.researchPoolTarget,
  candidateSeeds: seedRows.length,
  targetDistribution: plan.targetDistribution,
  sitemapExcluded: publication.sitemapExcluded,
  discoveryExcluded: publication.discoveryExcluded,
  indexSubmissionDisabled: !publication.indexNowSubmitted && !publication.searchConsoleSubmitted,
  requiredGates: plan.requiredGates.length
}, null, 2));
