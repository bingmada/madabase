import data from "../config/additional-family-commerce-views.json";
import { amazonFamilyProductIdentity, amazonFamilyProductInventory, findAmazonFamilyProduct } from "./amazon-family-products";
import { applySiteAffiliateTracking } from "./affiliate-tracking";
import { applyReviewedProductContent } from "./reviewed-product-content";
import type { Product, SiteKey } from "./types";

// Enrich an already registered family identity; do not register a second SKU.
const views = data as unknown as Product[];
const seen = new Set<string>();
for (const view of views) {
  const family = amazonFamilyProductInventory().find((item) => item.site === view.site && item.asin === view.asin);
  const key = `${view.site}:${view.slug}`;
  if (!family || amazonFamilyProductIdentity(family).slug !== view.slug || seen.has(key)) {
    throw new Error(`Unmatched family commerce view: ${key}`);
  }
  seen.add(key);
  for (const offer of view.offers) {
    const url = new URL(offer.url);
    if (offer.merchant !== "Amazon US" || url.hostname !== "www.amazon.com" || url.pathname !== `/dp/${view.asin}`) {
      throw new Error(`Family commerce view offer mismatch: ${key}`);
    }
  }
}

export function additionalFamilyCommerceView(site: SiteKey, slug: string) {
  const view = views.find((item) => item.site === site && item.slug === slug);
  if (!view) return undefined;
  const family = amazonFamilyProductInventory().find((item) => item.site === site && item.asin === view.asin);
  const current = family && findAmazonFamilyProduct(site, family.familySlug);
  if (!current) return undefined;
  const product = applySiteAffiliateTracking(applyReviewedProductContent(view));
  return current.offerBlock ? { ...product, offers: [] } : product;
}
