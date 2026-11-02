import data from "../config/additional-guide-purchase-options.json";
import type { SiteKey } from "./types";

export type AdditionalGuidePurchaseOption = {
  site: SiteKey;
  kind: "guide";
  slug: string;
  productSlug: string;
  asin: string;
  keep: string;
  qualifier?: string;
  stop?: string;
};

const options = data as AdditionalGuidePurchaseOption[];
const seen = new Set<string>();
for (const option of options) {
  const key = `${option.site}:${option.slug}`;
  if (option.kind !== "guide" || !option.slug || !option.productSlug
    || !/^[A-Z0-9]{10}$/.test(option.asin) || !option.keep?.trim() || seen.has(key)) {
    throw new Error(`Invalid explicit guide purchase option: ${key}`);
  }
  seen.add(key);
}

export function additionalGuidePurchaseOption(site: SiteKey, slug: string) {
  return options.find((option) => option.site === site && option.slug === slug);
}
