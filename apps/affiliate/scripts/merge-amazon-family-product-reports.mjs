import fs from "node:fs";
import path from "node:path";

const root = path.resolve(new URL("../../..", import.meta.url).pathname);

function valueFor(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

const reportPath = path.resolve(root, valueFor("--report") ?? "docs/affiliate-amazon-family-products-2026-08-09.json");
const productsPath = path.resolve(root, valueFor("--products") ?? "apps/affiliate/config/amazon-family-browser-products.json");
const outputPath = path.resolve(root, valueFor("--output") ?? reportPath);

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const additions = JSON.parse(fs.readFileSync(productsPath, "utf8"));
if (!Array.isArray(report.products) || !Array.isArray(additions.products)) {
  throw new Error("Both inputs must contain a products array");
}

const familyProducts = new Map();
const asinFamilies = new Map();
for (const product of [...report.products, ...additions.products]) {
  const familyKey = `${product.site}:${product.familySlug}`;
  const existingFamily = familyProducts.get(familyKey);
  if (existingFamily && existingFamily.asin !== product.asin) {
    throw new Error(`Conflicting products for ${familyKey}: ${existingFamily.asin} and ${product.asin}`);
  }
  const existingAsinFamily = asinFamilies.get(product.asin);
  if (existingAsinFamily && existingAsinFamily !== familyKey) {
    throw new Error(`ASIN ${product.asin} is reused by ${existingAsinFamily} and ${familyKey}`);
  }
  familyProducts.set(familyKey, product);
  asinFamilies.set(product.asin, familyKey);
}

const products = [...familyProducts.values()].sort(
  (left, right) => left.site.localeCompare(right.site) || left.familySlug.localeCompare(right.familySlug),
);
const merged = {
  ...report,
  generatedAt: new Date().toISOString(),
  source: [report.source, additions.source].filter(Boolean).join("; "),
  products,
  failures: [],
};

const temporaryPath = `${outputPath}.tmp`;
fs.writeFileSync(temporaryPath, `${JSON.stringify(merged, null, 2)}\n`);
fs.renameSync(temporaryPath, outputPath);
console.log(JSON.stringify({ ok: true, products: products.length, output: path.relative(root, outputPath) }));
