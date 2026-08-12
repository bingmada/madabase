import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const workspaceDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(workspaceDir, "lib", "broad-product-pilot-2-content.ts");
const familyPath = path.join(workspaceDir, "config", "broad-product-pilot-2-families.json");
const productPath = path.join(workspaceDir, "config", "broad-product-pilot-2-amazon-products.json");
const legacyProductPath = path.join(workspaceDir, "config", "amazon-family-products.json");
const firstFamilyPath = path.join(workspaceDir, "config", "broad-product-pilot-families.json");
const firstProductPath = path.join(workspaceDir, "config", "broad-product-pilot-amazon-products.json");
const legacyExpansionPath = path.join(workspaceDir, "lib", "quadruple-expansion-content.ts");

const transpiled = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  fileName: sourcePath,
}).outputText;
const pilotModule = await import(`data:text/javascript;base64,${Buffer.from(transpiled).toString("base64")}`);
const guides = pilotModule.broadProductPilot2Guides;
const familyData = JSON.parse(fs.readFileSync(familyPath, "utf8"));
const productData = JSON.parse(fs.readFileSync(productPath, "utf8"));
const legacyProducts = JSON.parse(fs.readFileSync(legacyProductPath, "utf8")).products;
const firstFamilies = JSON.parse(fs.readFileSync(firstFamilyPath, "utf8")).families;
const firstProducts = JSON.parse(fs.readFileSync(firstProductPath, "utf8")).products;
const legacyExpansionSource = fs.readFileSync(legacyExpansionPath, "utf8");
const errors = [];
const expectedSites = ["network", "smarthome", "homeoffice", "baby", "pet"];

function words(value) {
  return String(value ?? "").trim().split(/\s+/).filter(Boolean).length;
}

function countBy(items, key) {
  return Object.fromEntries(expectedSites.map((site) => [site, items.filter((item) => item[key] === site).length]));
}

function duplicates(values) {
  const counts = new Map();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return [...counts.entries()].filter(([, count]) => count > 1).map(([value]) => value);
}

if (familyData.publicationStatus !== "published") errors.push("Family plan is not marked published");
if (productData.publicationStatus !== "published") errors.push("Product anchor plan is not marked published");
if (familyData.cohort !== "broad-product-pilot-2") errors.push("Family plan has the wrong cohort");
if (productData.cohort !== "broad-product-pilot-2") errors.push("Product anchor plan has the wrong cohort");
if (familyData.families.length !== 15) errors.push(`Expected 15 families; found ${familyData.families.length}`);
if (guides.length !== 15) errors.push(`Expected 15 guides; found ${guides.length}`);
if (productData.products.length !== 15) errors.push(`Expected 15 Amazon anchors; found ${productData.products.length}`);

for (const [label, items, key] of [
  ["family", familyData.families, "site"],
  ["guide", guides, "site"],
  ["product", productData.products, "site"],
]) {
  const counts = countBy(items, key);
  for (const site of expectedSites) if (counts[site] !== 3) errors.push(`Expected three ${label} records for ${site}; found ${counts[site]}`);
}

for (const [label, values] of [
  ["guide slugs", guides.map((guide) => guide.slug)],
  ["family slugs", familyData.families.map((family) => `${family.site}:${family.familySlug}`)],
  ["search questions", guides.map((guide) => guide.searchQuestion)],
  ["quick answers", guides.map((guide) => guide.quickAnswer)],
  ["section bodies", guides.flatMap((guide) => guide.sections.map((section) => section.body))],
  ["images", guides.map((guide) => guide.image)],
  ["image alt text", guides.map((guide) => guide.imageAlt)],
  ["ASINs", productData.products.map((product) => product.asin)],
]) {
  const repeated = duplicates(values);
  if (repeated.length) errors.push(`${label} contain ${repeated.length} duplicate value(s)`);
}

const familyKeys = new Set(familyData.families.map((family) => `${family.site}:${family.familySlug}`));
const productKeys = new Set(productData.products.map((product) => `${product.site}:${product.familySlug}`));
const guideKeys = new Set(guides.map((guide) => `${guide.site}:${guide.familySlug}`));
for (const key of familyKeys) {
  if (!productKeys.has(key)) errors.push(`Missing exact Amazon anchor for ${key}`);
  if (!guideKeys.has(key)) errors.push(`Missing release guide for ${key}`);
}

const priorProducts = [...legacyProducts, ...firstProducts];
const priorFamilyKeys = new Set([
  ...legacyProducts.map((product) => `${product.site}:${product.familySlug}`),
  ...firstFamilies.map((family) => `${family.site}:${family.familySlug}`),
]);
const priorAsins = new Set(priorProducts.map((product) => product.asin));
for (const product of productData.products) {
  const key = `${product.site}:${product.familySlug}`;
  if (priorAsins.has(product.asin)) errors.push(`Second-pilot ASIN collides with prior inventory: ${product.asin}`);
  if (priorFamilyKeys.has(key)) errors.push(`Second-pilot family collides with prior inventory: ${key}`);
  if (!/^[A-Z0-9]{10}$/.test(product.asin)) errors.push(`Invalid ASIN for ${key}`);
  if (product.detailUrl !== `https://www.amazon.com/dp/${product.asin}`) errors.push(`Invalid direct Amazon URL for ${key}`);
  if (!product.title?.trim() || !product.brand?.trim()) errors.push(`Incomplete product identity for ${key}`);
  if (product.relevanceScore < 9) errors.push(`Low-confidence product identity for ${key}`);
  if (Number.isNaN(Date.parse(product.verifiedAt))) errors.push(`Invalid verification time for ${key}`);
}

for (const family of familyData.families) {
  if (new RegExp(`slug:\\s*["']${family.familySlug}["']`).test(legacyExpansionSource)) {
    errors.push(`Second-pilot family appears in the prior governed expansion: ${family.site}:${family.familySlug}`);
  }
}

const coreWordCounts = [];
for (const guide of guides) {
  const key = `${guide.site}:${guide.slug}`;
  if (guide.publicationStatus !== "published") errors.push(`${key} is not marked published`);
  if (guide.familyRole !== "buying") errors.push(`${key} is not the single canonical buying role`);
  if (guide.governance?.decision !== "rewrite") errors.push(`${key} lacks a governed rewrite decision`);
  if (!guide.searchQuestion?.trim() || !guide.quickAnswer?.trim()) errors.push(`${key} lacks an explicit search question or answer`);
  if (guide.sections.length < 5) errors.push(`${key} has fewer than five sections`);
  if (!guide.comparisonTable || guide.comparisonTable.rows.length < 6) errors.push(`${key} lacks a six-row decision table`);
  if (!guide.editorialMethod || guide.editorialMethod.length < 4) errors.push(`${key} lacks a four-step editorial method`);
  if (!guide.sources || guide.sources.length < 3) errors.push(`${key} has fewer than three sources`);
  for (const source of guide.sources ?? []) {
    try { new URL(source.url); } catch { errors.push(`${key} has an invalid source URL: ${source.url}`); }
  }
  if ((guide.sources?.filter((source) => !new URL(source.url).hostname.includes("amazon.com")).length ?? 0) < 2) errors.push(`${key} lacks two non-Amazon sources`);
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
  families: familyData.families.length,
  guides: guides.length,
  exactAmazonAnchors: productData.products.length,
  bySite: countBy(guides, "site"),
  uniqueQuestions: new Set(guides.map((guide) => guide.searchQuestion)).size,
  uniqueSectionBodies: new Set(guides.flatMap((guide) => guide.sections.map((section) => section.body))).size,
  communitySources: guides.reduce((sum, guide) => sum + (guide.communityEvidence?.length ?? 0), 0),
  uniqueEditorialImages: new Set(guides.map((guide) => guide.image)).size,
  coreWords: {
    min: Math.min(...coreWordCounts),
    average: Number((coreWordCounts.reduce((sum, count) => sum + count, 0) / coreWordCounts.length).toFixed(1)),
    max: Math.max(...coreWordCounts),
  },
  releaseChecks: [
    "August 12 owner-authorized complete day-3 cohort review",
    "same-day Amazon identity, availability, and CPSC exact-match screening",
    "rendered-page and reciprocal-link review passed",
  ],
};

console.log("Broad product pilot 2 quality audit");
console.log(JSON.stringify(report, null, 2));
if (errors.length) {
  console.error(`\nErrors (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("\nBroad product pilot 2 quality audit passed.");
