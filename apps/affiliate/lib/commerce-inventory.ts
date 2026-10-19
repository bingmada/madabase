import { siteProducts } from "./content";
import { amazonFamilyProductIdentity, amazonFamilyProductInventory, findAmazonFamilyProduct } from "./amazon-family-products";
import { amazonAsinAffiliateUrl } from "./affiliate-tracking";
import type { AffiliateOffer, SiteKey } from "./types";
import { activeComponentOffers, componentAffiliateOffer, activeUpgradeOffers, upgradeAffiliateOffer } from "./upgrade-offers";

const commerceSites: SiteKey[] = ["network", "smarthome", "homeoffice", "baby", "pet", "style"];

// Read the same published, offer-filtered objects used by the rendered pages.
// Family slugs must include the exact ASIN; accepting a prefix alone loses identity.
export function publishedCommerceInventory() {
  return [
    ...activeComponentOffers().map((item) => ({site:item.site,slug:item.slug,catalogSlug:"compatibility/mini-pcs",asin:item.asin,offers:[componentAffiliateOffer(item)],kind:"guide-offer" as const})),
    ...activeUpgradeOffers().map((item) => ({site:item.site, slug:item.slug, catalogSlug:item.guide, asin:item.asin, offers:[upgradeAffiliateOffer(item)], kind:"guide-offer" as const})),
    ...commerceSites.flatMap((site) => siteProducts(site).filter((product) => product.publicationStatus !== "draft").map((product) => ({
      site, slug: product.slug, catalogSlug: product.slug,
      asin: product.asin ?? product.specs.ASIN,
      offers: product.offers,
      kind: "product" as const,
    }))),
    ...amazonFamilyProductInventory().filter((product) => product.publicationStatus !== "draft").map((product) => ({
      site: product.site,
      slug: amazonFamilyProductIdentity(product).slug,
      catalogSlug: `family-${product.familySlug}`,
      asin: product.asin,
      offers: findAmazonFamilyProduct(product.site, product.familySlug)?.offerBlock ? [] : [{
        merchant: "Amazon US", url: amazonAsinAffiliateUrl(product.site, product.asin),
        label: "Check this exact ASIN on Amazon", priceNote: "Confirm the exact variant before checkout.",
      }] as AffiliateOffer[],
      kind: "family" as const,
    })),
  ];
}

export function isPublishedCommerceClick(site: string, slug: string, merchant: string) {
  return publishedCommerceInventory().some((product) =>
    product.site === site && product.slug === slug
    && product.offers.some((offer) => offer.merchant === merchant),
  );
}
