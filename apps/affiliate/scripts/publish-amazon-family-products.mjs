import fs from "node:fs";
import path from "node:path";
import { amazonFamilyTitleMeetsPolicy } from "./amazon-family-semantic-policy.mjs";

const root = path.resolve(new URL("../../..", import.meta.url).pathname);
const defaultInputPath = path.join(root, "docs/affiliate-amazon-family-products-2026-08-09.json");
const defaultOutputPath = path.join(root, "apps/affiliate/config/amazon-family-products.json");
const expectedCounts = { network: 27, smarthome: 30, homeoffice: 33, baby: 24, pet: 30 };
const contentDirectory = path.join(root, "apps/affiliate/lib");

function valueFor(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

const inputPath = path.resolve(root, valueFor("--report") ?? defaultInputPath);
const outputPath = path.resolve(root, valueFor("--output") ?? defaultOutputPath);
const report = JSON.parse(fs.readFileSync(inputPath, "utf8"));
if (!Array.isArray(report.products)) throw new Error("Amazon family discovery report must contain a products array");
if (report.failures?.length) throw new Error(`Discovery report still contains ${report.failures.length} failure(s)`);

const seenFamilies = new Set();
const seenAsins = new Set();
const existingAsins = new Set(
  fs.readdirSync(contentDirectory)
    .filter((name) => name.endsWith(".ts") && name !== "amazon-family-products.ts")
    .flatMap((name) => [...fs.readFileSync(path.join(contentDirectory, name), "utf8").matchAll(/\b(B[A-Z0-9]{9})\b/g)].map((match) => match[1])),
);
const products = report.products.map((product) => {
  const expectedCount = expectedCounts[product.site];
  if (!expectedCount) throw new Error(`Unsupported product site: ${product.site}`);
  const familyKey = `${product.site}:${product.familySlug}`;
  if (seenFamilies.has(familyKey)) throw new Error(`Duplicate product family: ${familyKey}`);
  if (!/^[A-Z0-9]{10}$/.test(product.asin ?? "")) throw new Error(`Invalid ASIN for ${familyKey}`);
  if (seenAsins.has(product.asin)) throw new Error(`ASIN ${product.asin} is reused by multiple expansion families`);
  if (existingAsins.has(product.asin)) throw new Error(`ASIN ${product.asin} already belongs to an existing editorial product`);
  if (product.detailUrl !== `https://www.amazon.com/dp/${product.asin}`) throw new Error(`Unexpected detail URL for ${familyKey}`);
  if (!product.title?.trim() || !product.brand?.trim()) throw new Error(`Missing listing identity for ${familyKey}`);
  if (!amazonFamilyTitleMeetsPolicy(product.familySlug, product.title)) throw new Error(`Listing title fails semantic policy for ${familyKey}`);
  if (Number.isNaN(Date.parse(product.verifiedAt))) throw new Error(`Invalid verification date for ${familyKey}`);
  if (!Number.isFinite(product.relevanceScore) || product.relevanceScore < 5) throw new Error(`Low relevance score for ${familyKey}`);
  if (product.validation?.directStatus !== 200 || product.validation?.asinMatched !== true || product.validation?.unavailable !== false) {
    throw new Error(`Direct listing validation failed for ${familyKey}`);
  }
  seenFamilies.add(familyKey);
  seenAsins.add(product.asin);
  return {
    site: product.site,
    familySlug: product.familySlug,
    familyName: product.familyName,
    category: product.category,
    asin: product.asin,
    title: product.title.trim(),
    brand: product.brand.trim(),
    detailUrl: product.detailUrl,
    verifiedAt: product.verifiedAt,
    relevanceScore: product.relevanceScore,
  };
});

for (const [site, expected] of Object.entries(expectedCounts)) {
  const actual = products.filter((product) => product.site === site).length;
  if (actual !== expected) throw new Error(`Expected ${expected} ${site} Amazon family products; found ${actual}`);
}
if (products.length !== Object.values(expectedCounts).reduce((sum, value) => sum + value, 0)) {
  throw new Error(`Expected 144 Amazon family products; found ${products.length}`);
}

const output = {
  generatedAt: report.generatedAt,
  source: report.source,
  verificationPolicy: report.verificationPolicy,
  products: products.sort((left, right) => left.site.localeCompare(right.site) || left.familySlug.localeCompare(right.familySlug)),
};
const temporaryPath = `${outputPath}.tmp`;
fs.writeFileSync(temporaryPath, `${JSON.stringify(output, null, 2)}\n`);
fs.renameSync(temporaryPath, outputPath);
console.log(JSON.stringify({ ok: true, products: products.length, sites: expectedCounts, output: path.relative(root, outputPath) }));
