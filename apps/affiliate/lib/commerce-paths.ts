import { findProduct, findRoundup, siteProducts, siteRoundups } from "./content";
import { amazonAsinAffiliateUrl } from "./affiliate-tracking";
import type { Guide, Product, Roundup, SiteKey, Tool } from "./types";

const okinRollingDeskAlternative: Product = {
  site: "homeoffice",
  slug: "okin-36x24-electric-standing-desk-with-wheels-retailer-alternative",
  asin: "B0FH4RDV1Q",
  amazonTitle: "Okin 36×24 Electric Standing Desk with Wheels",
  updatedAt: "September 8, 2026",
  publicationStatus: "draft",
  sitemapExcluded: true,
  discoveryExcluded: true,
  name: "Okin 36×24 Electric Standing Desk with Wheels",
  brand: "Okin",
  category: "desks",
  image: "",
  summary: "A compact electric sit-stand desk sold in a configuration with lockable casters.",
  verdict: "Treat this as a current retailer alternative, not as a replacement for the editorial verdict on another desk.",
  bestFor: "A compact mobile workstation where lockable casters are a real requirement",
  priceBand: "$$",
  rating: 0,
  scores: [],
  pros: [
    "The selected Amazon configuration includes lockable casters",
    "The 36×24-inch format is aimed at compact workspaces",
  ],
  cons: [
    "It is a different, smaller product than the 48×24-inch ErGear desk",
    "Live price, seller, color, shipping, and returns can change",
  ],
  specs: {
    ASIN: "B0FH4RDV1Q",
    Desktop: "36 × 24 inches in the checked listing title",
    Mobility: "With Wheels configuration; lockable casters listed",
    "Listed height range": "27.56–45.28 inches with 1.97-inch wheels",
  },
  evidence: [
    "Amazon showed ASIN B0FH4RDV1Q in stock with the With Wheels configuration selected on September 8, 2026",
    "Confirm the 36-inch size, With Wheels configuration, color, seller, delivery, and return terms before checkout",
  ],
  sources: [
    {
      name: "Amazon listing for ASIN B0FH4RDV1Q",
      url: "https://www.amazon.com/dp/B0FH4RDV1Q",
      note: "Retailer listing used only to verify the current product identity, selected wheel configuration, availability, and buying terms.",
    },
  ],
  offers: [
    {
      merchant: "Amazon US",
      url: amazonAsinAffiliateUrl("homeoffice", "B0FH4RDV1Q"),
      label: "Check Okin 36×24 desk price on Amazon",
      priceNote: "Confirm ASIN B0FH4RDV1Q, 36-inch size, With Wheels configuration, color, seller, live price, delivery, and returns.",
    },
  ],
};

function explicitGuideAlternative(site: SiteKey, guide: Guide) {
  if (site === "homeoffice" && guide.slug === "standing-desk-casters-stability-guide") {
    return okinRollingDeskAlternative;
  }
}

function explicitReviewAlternative(site: SiteKey, product: Product) {
  if (site === "homeoffice" && product.slug === "ergear-48x24-electric-standing-desk") {
    return okinRollingDeskAlternative;
  }
}

function explicitRoundupAlternative(site: SiteKey, roundup: Roundup) {
  if (
    site === "homeoffice"
    && ["ergear-48x24-vs-flexispot-e7-mini", "best-standing-desks-for-small-spaces"].includes(roundup.slug)
  ) {
    return okinRollingDeskAlternative;
  }
}

function uniqueProducts(products: Array<Product | undefined>) {
  return products.filter(
    (product, index, items): product is Product =>
      Boolean(product)
      && items.findIndex((candidate) => candidate?.slug === product?.slug) === index,
  );
}

function productsFromRoundups(site: SiteKey, roundupSlugs: string[]) {
  return roundupSlugs.flatMap((roundupSlug) => {
    const roundup = findRoundup(site, roundupSlug);
    return roundup?.productSlugs.map((productSlug) => findProduct(site, productSlug)) ?? [];
  });
}

function firstPurchasable(products: Array<Product | undefined>) {
  return uniqueProducts(products).find((product) => product.offers.length > 0);
}

function categoryProducts(site: SiteKey, category: string) {
  return siteProducts(site).filter((product) => product.category === category);
}

export function categoryCommerceProduct(site: SiteKey, category: string) {
  return firstPurchasable([
    ...categoryProducts(site, category),
    ...siteProducts(site),
  ]);
}

/**
 * Resolve the nearest verified revenue path without changing editorial identity.
 * Directly related products are an identity boundary: when a guide names them,
 * do not replace an unavailable offer with a product pulled from a broader
 * roundup. A roundup can still supply the commerce path for guides that do not
 * name a product directly.
 */
export function guideCommerceProduct(site: SiteKey, guide: Guide) {
  const directlyRelatedProducts = (guide.relatedProducts ?? []).map((slug) => findProduct(site, slug));
  const directlyRelatedProduct = firstPurchasable(directlyRelatedProducts);
  if (directlyRelatedProduct) return directlyRelatedProduct;
  if (directlyRelatedProducts.some(Boolean)) return explicitGuideAlternative(site, guide);

  return firstPurchasable(productsFromRoundups(site, guide.relatedRoundups))
    ?? explicitGuideAlternative(site, guide);
}

export function reviewCommerceProduct(site: SiteKey, product: Product) {
  const containingRoundups = siteProductsFromContainingRoundups(site, product.slug);
  return firstPurchasable([
    product,
    ...(product.compareSlugs ?? []).map((slug) => findProduct(site, slug)),
    ...containingRoundups,
  ]) ?? explicitReviewAlternative(site, product);
}

function siteProductsFromContainingRoundups(site: SiteKey, productSlug: string) {
  // A product can be listed in several editorial comparisons. Keep their
  // declared order because it carries more intent than a global site fallback.
  const roundupSlugs = siteRoundups(site)
    .filter((roundup) => roundup.productSlugs.includes(productSlug))
    .map((roundup) => roundup.slug);
  return productsFromRoundups(site, roundupSlugs);
}

export function roundupCommerceProduct(site: SiteKey, roundup: Roundup) {
  return firstPurchasable(roundup.productSlugs.map((slug) => findProduct(site, slug)))
    ?? explicitRoundupAlternative(site, roundup);
}

export function toolCommerceProduct(site: SiteKey, tool: Tool) {
  return firstPurchasable([
    ...productsFromRoundups(site, tool.relatedRoundups),
    ...categoryProducts(site, tool.category),
  ]);
}

export function isCommerceAlternative(editorialProduct: Product | undefined, commerceProduct: Product | undefined) {
  return Boolean(editorialProduct && commerceProduct && editorialProduct.slug !== commerceProduct.slug);
}
