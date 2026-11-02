import data from "../config/additional-commerce-products.json";
import type { Product } from "./types";
import { applySiteAffiliateTracking } from "./affiliate-tracking";

// Explicitly named alternatives used only by the pages that select them.
// JSON infers optional undefined keys for differently shaped specification maps.
const products = data as unknown as Product[];
const identities = new Set<string>();
const asins = new Set<string>();
for (const product of products) {
  const key = `${product.site}:${product.slug}`;
  const asinKey = `${product.site}:${product.asin}`;
  if (identities.has(key) || asins.has(asinKey) || !/^[A-Z0-9]{10}$/.test(product.asin ?? "")) {
    throw new Error(`Invalid additional product identity: ${key}`);
  }
  identities.add(key);
  asins.add(asinKey);
  if (!["network", "smarthome", "homeoffice", "baby", "pet"].includes(product.site)
    || !product.name?.trim() || !product.summary?.trim() || !product.purchaseCheck?.trim()
    || !product.specs || !Object.values(product.specs).every((value) => typeof value === "string")
    || !Array.isArray(product.offers) || !Array.isArray(product.sources)) {
    throw new Error(`Incomplete additional product: ${key}`);
  }
  if (product.publicationStatus !== "draft" || !product.discoveryExcluded || !product.sitemapExcluded) {
    throw new Error(`Additional product requires explicit page selection: ${key}`);
  }
  for (const offer of product.offers) {
    const url = new URL(offer.url);
    if (offer.merchant !== "Amazon US" || url.hostname !== "www.amazon.com" || url.pathname !== `/dp/${product.asin}`) {
      throw new Error(`Additional product offer mismatch: ${key}`);
    }
  }
}

export const additionalCommerceProducts = products.map(applySiteAffiliateTracking);
