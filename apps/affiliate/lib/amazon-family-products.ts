import familyProductData from "../config/amazon-family-products.json";
import type { SiteKey } from "./types";

export type AmazonFamilyProduct = {
  site: Extract<SiteKey, "network" | "smarthome" | "homeoffice" | "baby" | "pet">;
  familySlug: string;
  familyName: string;
  category: string;
  asin: string;
  title: string;
  brand: string;
  detailUrl: string;
  verifiedAt: string;
  relevanceScore: number;
};

const amazonFamilyProducts = familyProductData.products as AmazonFamilyProduct[];
const supportedSites = new Set<SiteKey>(["network", "smarthome", "homeoffice", "baby", "pet"]);
const seenFamilies = new Set<string>();
const seenAsins = new Set<string>();

for (const product of amazonFamilyProducts) {
  const familyKey = `${product.site}:${product.familySlug}`;
  if (!supportedSites.has(product.site)) throw new Error(`Unsupported Amazon family-product site: ${product.site}`);
  if (seenFamilies.has(familyKey)) throw new Error(`Duplicate Amazon family product: ${familyKey}`);
  if (!/^[A-Z0-9]{10}$/.test(product.asin)) throw new Error(`Invalid Amazon family-product ASIN: ${product.asin}`);
  if (product.detailUrl !== `https://www.amazon.com/dp/${product.asin}`) throw new Error(`Unexpected Amazon detail URL for ${familyKey}`);
  if (seenAsins.has(product.asin)) throw new Error(`Amazon family-product ASIN is reused: ${product.asin}`);
  if (!product.title.trim() || !product.brand.trim() || !Number.isFinite(product.relevanceScore)) throw new Error(`Incomplete Amazon family product: ${familyKey}`);
  if (Number.isNaN(Date.parse(product.verifiedAt))) throw new Error(`Invalid verification date for ${familyKey}`);
  seenFamilies.add(familyKey);
  seenAsins.add(product.asin);
}

export function findAmazonFamilyProduct(site: SiteKey, familySlug: string) {
  return amazonFamilyProducts.find((product) => product.site === site && product.familySlug === familySlug);
}

export function amazonFamilyProductInventory() {
  return [...amazonFamilyProducts];
}
