import type { AffiliateOffer, Product, SiteKey } from "./types";
import type { CompatibilityResult } from "./compatibility-engine";

// Kept separate from the server catalog so the planner ships only the few
// exact identities supplied by its page, never the full editorial inventory.
export type CompatibilityPurchaseOption = {
  site: SiteKey;
  product: Pick<Product, "slug" | "name" | "amazonTitle" | "asin" | "specs">;
  offer: AffiliateOffer;
  check: string;
};

export function qualifiedPurchaseOption(result: CompatibilityResult, options: readonly CompatibilityPurchaseOption[]) {
  if (result.noBuy || !["supported", "conditional"].includes(result.status) || !result.productSlug) return undefined;
  return options.find((option) => option.product.slug === result.productSlug);
}
