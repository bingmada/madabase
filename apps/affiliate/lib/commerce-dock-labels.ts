import data from "../config/commerce-dock-labels.json";
import type { Product, SiteKey } from "./types";

const seen = new Set<string>();
for (const row of data) {
  const key = `${row.site}:${row.productSlug}:${row.asin}`;
  if (seen.has(key) || !/^[A-Z0-9]{10}$/.test(row.asin)
    || !row.name.trim() || !row.label.trim() || row.label.length > 24) {
    throw new Error(`Invalid commerce dock label: ${key}`);
  }
  seen.add(key);
}

export function commerceDockModelLabel(
  site: SiteKey,
  product: Pick<Product, "slug" | "name" | "asin" | "specs">,
) {
  const asin = (product.asin ?? product.specs.ASIN)?.trim().toUpperCase();
  return data.find((row) => row.site === site && row.productSlug === product.slug
    && row.asin === asin && row.name === product.name)?.label;
}
