import { findProduct, findRoundup, siteProducts, siteRoundups } from "./content";
import type { Guide, Product, Roundup, SiteKey, Tool } from "./types";

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
 * Candidate order is intentional: exact relation, named comparison, named
 * roundup, then an explicitly same-category fallback.
 */
export function guideCommerceProduct(site: SiteKey, guide: Guide) {
  return firstPurchasable([
    ...(guide.relatedProducts ?? []).map((slug) => findProduct(site, slug)),
    ...productsFromRoundups(site, guide.relatedRoundups),
    ...categoryProducts(site, guide.category),
  ]);
}

export function reviewCommerceProduct(site: SiteKey, product: Product) {
  const containingRoundups = siteProductsFromContainingRoundups(site, product.slug);
  return firstPurchasable([
    product,
    ...(product.compareSlugs ?? []).map((slug) => findProduct(site, slug)),
    ...containingRoundups,
    ...categoryProducts(site, product.category),
  ]);
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
  return firstPurchasable([
    ...roundup.productSlugs.map((slug) => findProduct(site, slug)),
    ...categoryProducts(site, roundup.category),
  ]);
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
