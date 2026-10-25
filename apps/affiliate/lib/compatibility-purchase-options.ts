import { findProduct } from "./content";
import { dockProfiles } from "./compatibility-data";
import type { CompatibilityPurchaseOption } from "./compatibility-purchase";
import type { SiteKey } from "./types";

export function compatibilityPurchaseOptions(site: SiteKey, topic: string): CompatibilityPurchaseOption[] {
  if (site !== "homeoffice") return [];
  const slugs = topic === "docks" ? dockProfiles.map((profile) => profile.productSlug)
    : topic === "monitor-arms" ? ["ergotron-hx-monitor-arm"] : [];
  return slugs.flatMap((slug) => {
    const product = findProduct(site, slug);
    const offer = product?.offers[0];
    if (!product || product.publicationStatus === "draft" || !offer) return [];
    const { name, amazonTitle, asin, specs } = product;
    return [{ site, product: { slug, name, amazonTitle, asin, specs }, offer,
      check: offer.priceNote || "Confirm the exact model, included parts, seller, delivery and returns at the retailer." }];
  });
}
