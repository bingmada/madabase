import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { amazonFamilyTitleMeetsPolicy } from "./amazon-family-semantic-policy.mjs";

const affiliateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sites = ["network", "smarthome", "homeoffice", "baby", "pet"];
const opportunityPath = path.join(affiliateDir, "config", "breadth-draft-120-plus-opportunity-evidence.json");
const opportunity = JSON.parse(fs.readFileSync(opportunityPath, "utf8"));
const eligibleKeys = new Set(opportunity.records.map((item) => `${item.site}:${item.familySlug}`));
const products = [];
const pending = [];
const failures = [];

for (const site of sites) {
  const pathname = path.join(affiliateDir, "config", `breadth-draft-${site}-product-research.json`);
  const payload = JSON.parse(fs.readFileSync(pathname, "utf8"));
  products.push(...(payload.products ?? []));
  pending.push(...(payload.pending ?? []));
  failures.push(...(payload.failures ?? []));
}

const problems = [];
const productKeyCounts = new Map();
const asinCounts = new Map();
for (const product of products) {
  const key = `${product.site}:${product.familySlug}`;
  productKeyCounts.set(key, (productKeyCounts.get(key) ?? 0) + 1);
  asinCounts.set(product.asin, (asinCounts.get(product.asin) ?? 0) + 1);
  if (!eligibleKeys.has(key)) problems.push(`selected_not_in_opportunity_evidence:${key}`);
  if (!/^[A-Z0-9]{10}$/.test(product.asin ?? "")) problems.push(`invalid_asin:${key}:${product.asin}`);
  if (String(product.title ?? "").trim().split(/\s+/).length < 5) problems.push(`insufficient_title:${key}`);
  if (!amazonFamilyTitleMeetsPolicy(product.familySlug, product.title)) problems.push(`semantic_policy_failed:${key}:${product.title}`);
  if (product.validation?.asinMatched !== true || product.validation?.unavailable !== false) problems.push(`direct_validation_failed:${key}`);
}

for (const [key, count] of productKeyCounts) if (count > 1) problems.push(`duplicate_family:${key}:${count}`);
for (const [asin, count] of asinCounts) if (count > 1) problems.push(`duplicate_asin:${asin}:${count}`);

const selectedKeys = new Set(productKeyCounts.keys());
for (const item of [...pending, ...failures]) {
  const key = `${item.site}:${item.familySlug}`;
  if (selectedKeys.has(key)) problems.push(`selected_also_unresolved:${key}`);
}

const libDirectory = path.join(affiliateDir, "lib");
const libAsins = new Set(fs.readdirSync(libDirectory)
  .filter((name) => name.endsWith(".ts"))
  .flatMap((name) => [...fs.readFileSync(path.join(libDirectory, name), "utf8").matchAll(/\b(B[A-Z0-9]{9})\b/g)].map((match) => match[1])));
for (const product of products) if (libAsins.has(product.asin)) problems.push(`existing_content_asin_collision:${product.site}:${product.familySlug}:${product.asin}`);

if (products.length < 120) problems.push(`selected_below_minimum:${products.length}`);
const summary = {
  status: problems.length ? "invalid" : "valid",
  selected: products.length,
  uniqueAsins: asinCounts.size,
  uniqueFamilies: productKeyCounts.size,
  pending: pending.length,
  failed: failures.length,
  bySite: Object.fromEntries(sites.map((site) => [site, products.filter((item) => item.site === site).length])),
  problems,
};

console.log(JSON.stringify(summary, null, 2));
if (problems.length) process.exitCode = 1;
