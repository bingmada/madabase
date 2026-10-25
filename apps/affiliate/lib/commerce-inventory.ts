import { siteProducts } from "./content";
import { amazonFamilyProductIdentity, amazonFamilyProductInventory, findAmazonFamilyProduct } from "./amazon-family-products";
import { amazonAsinAffiliateUrl } from "./affiliate-tracking";
import type { AffiliateOffer, SiteKey } from "./types";
import { activeComponentOffers, componentAffiliateOffer, activeUpgradeOffers, upgradeAffiliateOffer } from "./upgrade-offers";
import { explicitCommerceAlternatives } from "./commerce-paths";
import { authorizedCjOffers } from "./cj-offers";

const commerceSites: SiteKey[] = ["network", "smarthome", "homeoffice", "baby", "pet", "style"];

// Read the same published, offer-filtered objects used by the rendered pages.
// Family slugs must include the exact ASIN; accepting a prefix alone loses identity.
export function publishedCommerceInventory() {
  return [
    ...authorizedCjOffers.filter((offer) => offer.publicationStatus !== "draft"
      && !siteProducts(offer.site).some((product) => product.slug === offer.productSlug)).map((offer) => ({
      site: offer.site, slug: offer.productSlug, catalogSlug: offer.familySlug ?? offer.productSlug,
      asin: undefined,
      offers: [{merchant:`${offer.merchantName} via CJ`,url:`/go/cj/${offer.token}`,label:`Check ${offer.productName ?? offer.productSlug}`,priceNote:offer.variantLabel ?? "Confirm the exact variant and current merchant terms."}],
      kind: "cj-family" as const,
    })),
    ...explicitCommerceAlternatives().map((product) => ({
      site: product.site, slug: product.slug, catalogSlug: product.slug,
      asin: product.asin, offers: product.offers, kind: "explicit-alternative" as const,
    })),
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
