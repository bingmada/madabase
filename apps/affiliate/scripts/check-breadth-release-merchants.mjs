import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { amazonFamilyTitleMeetsPolicy } from "./amazon-family-semantic-policy.mjs";

const affiliateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const productFiles = [
  "broad-product-pilot-amazon-products.json",
  "broad-product-pilot-2-amazon-products.json",
  "broad-product-pilot-3-amazon-products.json",
];
const allProducts = productFiles.flatMap((name) => JSON.parse(fs.readFileSync(path.join(affiliateDir, "config", name), "utf8")).products);
const asinArgumentIndex = process.argv.indexOf("--asin");
const asinFilter = asinArgumentIndex === -1 ? null : process.argv[asinArgumentIndex + 1]?.toUpperCase();
const products = asinFilter ? allProducts.filter((product) => product.asin === asinFilter) : allProducts;
const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36";

function plainText(value = "") {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function detailTitle(html) {
  return plainText(
    html.match(/id="productTitle"[^>]*>([\s\S]*?)<\//i)?.[1]
      ?? html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i)?.[1]
      ?? html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
      ?? "",
  ).replace(/\s*:\s*Amazon\.com.*$/i, "").trim();
}

function primaryAvailability(html) {
  const buyBox = html.match(/id="availabilityInsideBuyBox_feature_div"[\s\S]*?(?=<div[^>]+id="(?:quantityLimit|alternativeProduct|globalStore|quantityRelocate))/i)?.[0];
  const availability = html.match(/<div id="availability"[\s\S]*?<\/div>/i)?.[0];
  return plainText(buyBox ?? availability ?? "");
}

async function fetchWithRetries(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "accept-language": "en-US,en;q=0.9", "cache-control": "no-cache", "user-agent": userAgent },
        redirect: "follow",
        signal: AbortSignal.timeout(30_000),
      });
      const text = await response.text();
      if (response.ok) return { response, text };
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, attempt * 1500));
  }
  throw lastError;
}

async function exactRecallMatches(product, directTitle) {
  const endpoint = new URL("https://www.saferproducts.gov/RestWebServices/Recall");
  endpoint.searchParams.set("format", "json");
  endpoint.searchParams.set("ProductName", product.asin);
  const { response, text } = await fetchWithRetries(endpoint.toString(), 2);
  if (!response.ok) return [];
  const records = JSON.parse(text);
  if (!Array.isArray(records)) return [];
  const modelTokens = [...new Set(`${product.title} ${directTitle}`.match(/\b[A-Z]{1,8}[- ]?\d[A-Z0-9-]{2,}\b/gi) ?? [])]
    .map((token) => token.replace(/[ -]/g, "").toLowerCase());
  return records.filter((record) => {
    const value = JSON.stringify(record).replace(/[ -]/g, "").toLowerCase();
    return value.includes(product.asin.toLowerCase()) || modelTokens.some((token) => value.includes(token));
  });
}

if ((!asinFilter && products.length !== 60) || (asinFilter && products.length !== 1)) {
  throw new Error(`Expected ${asinFilter ? 1 : 60} exact Amazon candidates; found ${products.length}`);
}

const results = [];
let nextIndex = 0;
async function worker() {
  while (nextIndex < products.length) {
    const product = products[nextIndex++];
    const errors = [];
    try {
      const { response, text } = await fetchWithRetries(product.detailUrl);
      const title = detailTitle(text);
      const availability = primaryAvailability(text);
      const blocked = /enter the characters you see below|automated access|captcha/i.test(text);
      const asinMatched = text.toUpperCase().includes(product.asin);
      const unavailable = /currently unavailable|we don['’]t know when or if this item will be back in stock|temporarily out of stock/i.test(availability);
      const semanticMatch = amazonFamilyTitleMeetsPolicy(product.familySlug, title);
      const recalls = await exactRecallMatches(product, title);

      if (response.status !== 200) errors.push(`HTTP ${response.status}`);
      if (blocked) errors.push("Amazon anti-automation page returned");
      if (!asinMatched) errors.push("exact ASIN not present");
      if (!title) errors.push("listing title missing");
      if (!semanticMatch) errors.push(`listing title no longer matches ${product.familySlug}`);
      if (unavailable) errors.push(`primary buy box says ${availability}`);
      if (recalls.length) errors.push(`${recalls.length} exact CPSC recall match(es) require manual review`);

      results.push({ site: product.site, familySlug: product.familySlug, asin: product.asin, title, availability: availability || "no unavailable signal", exactCpscMatches: recalls.length, errors });
    } catch (error) {
      results.push({ site: product.site, familySlug: product.familySlug, asin: product.asin, errors: [error instanceof Error ? error.message : String(error)] });
    }
  }
}

await Promise.all(Array.from({ length: 3 }, () => worker()));
const failures = results.filter((result) => result.errors.length);
const report = {
  checkedAt: new Date().toISOString(),
  officialRecallSource: "CPSC Recalls API exact ASIN/model screening; zero matches are not a guarantee that no recall exists",
  products: results.length,
  passed: results.length - failures.length,
  failed: failures.length,
  bySite: Object.fromEntries(["network", "smarthome", "homeoffice", "baby", "pet"].map((site) => [site, results.filter((result) => result.site === site).length])),
  failures,
};

console.log("Breadth release merchant audit");
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
console.log("\nBreadth release merchant audit passed.");
