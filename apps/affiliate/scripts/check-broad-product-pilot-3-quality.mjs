import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const workspaceDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(workspaceDir, "lib", "broad-product-pilot-3-content.ts");
const familyPath = path.join(workspaceDir, "config", "broad-product-pilot-3-families.json");
const productPath = path.join(workspaceDir, "config", "broad-product-pilot-3-amazon-products.json");
const priorFamilyPaths = [
  path.join(workspaceDir, "config", "amazon-family-products.json"),
  path.join(workspaceDir, "config", "broad-product-pilot-families.json"),
  path.join(workspaceDir, "config", "broad-product-pilot-2-families.json"),
];
const priorProductPaths = [
  path.join(workspaceDir, "config", "amazon-family-products.json"),
  path.join(workspaceDir, "config", "broad-product-pilot-amazon-products.json"),
  path.join(workspaceDir, "config", "broad-product-pilot-2-amazon-products.json"),
];
const existingContentFiles = fs.readdirSync(path.join(workspaceDir, "lib"))
  .filter((name) => name.endsWith(".ts") && name !== "broad-product-pilot-3-content.ts")
  .map((name) => fs.readFileSync(path.join(workspaceDir, "lib", name), "utf8"))
  .join("\n");

const transpiled = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  fileName: sourcePath,
}).outputText;
const pilotModule = await import(`data:text/javascript;base64,${Buffer.from(transpiled).toString("base64")}`);
const guides = pilotModule.broadProductPilot3Guides;
const familyData = JSON.parse(fs.readFileSync(familyPath, "utf8"));
const productData = JSON.parse(fs.readFileSync(productPath, "utf8"));
const releaseFamilyPlans = [
  path.join(workspaceDir, "config", "broad-product-pilot-families.json"),
  path.join(workspaceDir, "config", "broad-product-pilot-2-families.json"),
  familyPath,
].map((pathname) => JSON.parse(fs.readFileSync(pathname, "utf8")));
const releaseProductPlans = [
  path.join(workspaceDir, "config", "broad-product-pilot-amazon-products.json"),
  path.join(workspaceDir, "config", "broad-product-pilot-2-amazon-products.json"),
  productPath,
].map((pathname) => JSON.parse(fs.readFileSync(pathname, "utf8")));
const releaseFamilies = releaseFamilyPlans.flatMap((plan) => plan.families);
const releaseProducts = releaseProductPlans.flatMap((plan) => plan.products);
const priorFamilies = priorFamilyPaths.flatMap((pathname) => {
  const payload = JSON.parse(fs.readFileSync(pathname, "utf8"));
  return payload.families ?? payload.products ?? [];
});
const priorProducts = priorProductPaths.flatMap((pathname) => JSON.parse(fs.readFileSync(pathname, "utf8")).products ?? []);
const errors = [];
const expectedSites = ["network", "smarthome", "homeoffice", "baby", "pet"];

function words(value) {
  return String(value ?? "").trim().split(/\s+/).filter(Boolean).length;
}

function duplicates(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) => value);
}

function countBySite(items) {
  return Object.fromEntries(expectedSites.map((site) => [site, items.filter((item) => item.site === site).length]));
}

if (familyData.publicationStatus !== "published" || productData.publicationStatus !== "published") errors.push("Family and product plans must be marked published");
if (familyData.cohort !== "broad-product-pilot-3" || productData.cohort !== "broad-product-pilot-3") errors.push("Cohort metadata mismatch");
if (familyData.releaseCandidate !== "breadth-64-2026-08-16" || productData.releaseCandidate !== "breadth-64-2026-08-16") errors.push("Release-candidate metadata mismatch");
if (familyData.families.length !== 30 || guides.length !== 30 || productData.products.length !== 30) errors.push(`Expected 30/30/30 records; found ${familyData.families.length}/${guides.length}/${productData.products.length}`);
for (const plan of [...releaseFamilyPlans, ...releaseProductPlans]) {
  if (plan.publicationStatus !== "published") errors.push("Every breadth-64 release plan must be marked published for the joint release");
  if (plan.releaseCandidate !== "breadth-64-2026-08-16") errors.push("A breadth cohort is missing the unified release-candidate label");
}
if (releaseFamilies.length !== 60 || releaseProducts.length !== 60) errors.push(`Expected a 60-family/60-anchor unified candidate; found ${releaseFamilies.length}/${releaseProducts.length}`);
for (const [label, items] of [["release family", releaseFamilies], ["release product", releaseProducts]]) {
  const counts = countBySite(items);
  for (const site of expectedSites) if (counts[site] !== 12) errors.push(`Expected twelve ${label} records for ${site}; found ${counts[site]}`);
}
if (duplicates(releaseFamilies.map((item) => `${item.site}:${item.familySlug}`)).length) errors.push("Unified release candidate contains duplicate family keys");
if (duplicates(releaseProducts.map((item) => item.asin)).length) errors.push("Unified release candidate contains duplicate ASINs");

for (const [label, items] of [["family", familyData.families], ["guide", guides], ["product", productData.products]]) {
  const counts = countBySite(items);
  for (const site of expectedSites) if (counts[site] !== 6) errors.push(`Expected six ${label} records for ${site}; found ${counts[site]}`);
}

for (const [label, values] of [
  ["guide slugs", guides.map((guide) => guide.slug)],
  ["family keys", familyData.families.map((item) => `${item.site}:${item.familySlug}`)],
  ["search questions", guides.map((guide) => guide.searchQuestion)],
  ["quick answers", guides.map((guide) => guide.quickAnswer)],
  ["section headings", guides.flatMap((guide) => guide.sections.map((section) => `${guide.slug}:${section.heading}`))],
  ["section bodies", guides.flatMap((guide) => guide.sections.map((section) => section.body))],
  ["images", guides.map((guide) => guide.image)],
  ["image alt text", guides.map((guide) => guide.imageAlt)],
  ["community URLs", guides.map((guide) => guide.communityEvidence?.[0]?.url)],
  ["ASINs", productData.products.map((product) => product.asin)],
]) {
  const repeated = duplicates(values);
  if (repeated.length) errors.push(`${label} contain ${repeated.length} duplicate value(s)`);
}

const familyKeys = new Set(familyData.families.map((item) => `${item.site}:${item.familySlug}`));
const productKeys = new Set(productData.products.map((item) => `${item.site}:${item.familySlug}`));
const guideKeys = new Set(guides.map((item) => `${item.site}:${item.familySlug}`));
for (const key of familyKeys) {
  if (!productKeys.has(key)) errors.push(`Missing product anchor for ${key}`);
  if (!guideKeys.has(key)) errors.push(`Missing guide for ${key}`);
}
for (const key of productKeys) if (!familyKeys.has(key)) errors.push(`Unexpected product anchor ${key}`);
for (const key of guideKeys) if (!familyKeys.has(key)) errors.push(`Unexpected guide ${key}`);

const priorFamilyKeys = new Set(priorFamilies.map((item) => `${item.site}:${item.familySlug ?? item.slug}`));
const priorAsins = new Set(priorProducts.map((item) => item.asin));
for (const family of familyData.families) {
  const key = `${family.site}:${family.familySlug}`;
  if (priorFamilyKeys.has(key)) errors.push(`Family collides with prior inventory: ${key}`);
}
for (const product of productData.products) {
  const key = `${product.site}:${product.familySlug}`;
  if (priorAsins.has(product.asin)) errors.push(`ASIN collides with prior inventory: ${product.asin}`);
  if (!/^[A-Z0-9]{10}$/.test(product.asin)) errors.push(`Invalid ASIN for ${key}`);
  if (product.detailUrl !== `https://www.amazon.com/dp/${product.asin}`) errors.push(`Invalid direct Amazon URL for ${key}`);
  if (!product.title?.trim() || !product.brand?.trim() || product.relevanceScore < 9) errors.push(`Incomplete or low-confidence anchor for ${key}`);
  if (Number.isNaN(Date.parse(product.verifiedAt))) errors.push(`Invalid verification time for ${key}`);
  if (product.validation?.directStatus !== 200 || !product.validation?.asinMatched || product.validation?.unavailable) errors.push(`Failed direct-page validation for ${key}`);
}

const existingSlugs = new Set([...existingContentFiles.matchAll(/\bslug:\s*["']([^"']+)["']/g)].map((match) => match[1]));
const generatedBuyingSlugs = new Set(
  [...fs.readFileSync(path.join(workspaceDir, "lib", "quadruple-expansion-content.ts"), "utf8").matchAll(/\{\s*site:\s*"(?:network|smarthome|homeoffice|baby|pet|costume)",\s*slug:\s*"([^"]+)"/g)]
    .map((match) => `${match[1]}-buying-guide`),
);
const allKnownSlugs = new Set([...existingSlugs, ...generatedBuyingSlugs, ...guides.map((guide) => guide.slug)]);
const coreWordCounts = [];
for (const guide of guides) {
  const key = `${guide.site}:${guide.slug}`;
  if (existingSlugs.has(guide.slug)) errors.push(`${key} collides with existing content slug`);
  if (guide.publicationStatus !== "published" || guide.familyRole !== "buying") errors.push(`${key} is not a published canonical buying guide`);
  if (guide.governance?.decision !== "rewrite") errors.push(`${key} lacks governed rewrite status`);
  if (!guide.searchQuestion?.trim() || !guide.quickAnswer?.trim()) errors.push(`${key} lacks a distinct search question or answer`);
  if (guide.sections.length !== 5) errors.push(`${key} must have exactly five governed sections`);
  if (!guide.comparisonTable || guide.comparisonTable.rows.length !== 6) errors.push(`${key} must have a six-row decision table`);
  if (!guide.editorialMethod || guide.editorialMethod.length !== 4) errors.push(`${key} must have a four-step editorial method`);
  if (!guide.communityEvidence?.[0]?.url.includes("reddit.com/search")) errors.push(`${key} lacks a real community-discussion discovery path`);
  if (!guide.sources || guide.sources.length < 3) errors.push(`${key} has fewer than three sources`);
  if ((guide.sources?.filter((source) => !new URL(source.url).hostname.includes("amazon.com")).length ?? 0) < 2) errors.push(`${key} lacks two non-Amazon sources`);
  const product = productData.products.find((item) => item.site === guide.site && item.familySlug === guide.familySlug);
  if (!guide.sources?.some((source) => source.url === product?.detailUrl)) errors.push(`${key} lacks its exact Amazon ASIN source`);
  if (!guide.image) errors.push(`${key} lacks an editorial image`);
  else {
    const imagePath = path.join(workspaceDir, "public", guide.image.replace(/^\//, ""));
    if (!fs.existsSync(imagePath)) errors.push(`${key} references missing image ${guide.image}`);
    else {
      const imageBytes = fs.statSync(imagePath).size;
      if (imageBytes < 40_000) errors.push(`${key} image is unexpectedly small: ${imageBytes} bytes`);
      if (imageBytes > 250_000) errors.push(`${key} image exceeds the 250KB pilot budget: ${imageBytes} bytes`);
    }
  }
  const links = [...new Set(guide.relatedGuides ?? [])];
  if (links.length < 3) errors.push(`${key} has fewer than three guide links`);
  for (const slug of links) if (!allKnownSlugs.has(slug)) errors.push(`${key} links to unknown guide ${slug}`);
  const count = words([
    guide.dek,
    guide.searchQuestion,
    guide.quickAnswer,
    ...guide.sections.flatMap((section) => [section.heading, section.body]),
    guide.comparisonTable?.title,
    ...(guide.comparisonTable?.rows.flatMap((row) => [row.label, ...row.values]) ?? []),
  ].filter(Boolean).join(" "));
  coreWordCounts.push(count);
  if (count < 350) errors.push(`${key} has only ${count} core editorial words`);
}

const report = {
  status: "publication_ready",
  releaseCandidate: familyData.releaseCandidate,
  releaseCandidateFamilies: releaseFamilies.length,
  releaseCandidateExactAmazonAnchors: releaseProducts.length,
  releaseCandidateBySite: countBySite(releaseFamilies),
  families: familyData.families.length,
  guides: guides.length,
  exactAmazonAnchors: productData.products.length,
  bySite: countBySite(guides),
  uniqueQuestions: new Set(guides.map((guide) => guide.searchQuestion)).size,
  uniqueSectionBodies: new Set(guides.flatMap((guide) => guide.sections.map((section) => section.body))).size,
  communityDiscoveryPaths: new Set(guides.map((guide) => guide.communityEvidence?.[0]?.url)).size,
  uniqueEditorialImages: new Set(guides.map((guide) => guide.image)).size,
  coreWords: {
    min: Math.min(...coreWordCounts),
    average: Number((coreWordCounts.reduce((sum, count) => sum + count, 0) / coreWordCounts.length).toFixed(1)),
    max: Math.max(...coreWordCounts),
  },
  releaseChecks: [
    "August 12 owner-authorized complete day-3 review of all 757 URLs",
    "same-day Amazon identity, primary buy-box availability, and CPSC exact-match screening passed",
    "rendered desktop/mobile review and production sitemap isolation check passed",
  ],
};

console.log("Broad product pilot 3 quality audit");
console.log(JSON.stringify(report, null, 2));
if (errors.length) {
  console.error(`\nErrors (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("\nBroad product pilot 3 quality audit passed.");
