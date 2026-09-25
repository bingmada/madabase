import offerBlockConfig from "../config/amazon-offer-blocks.json";
import type { Product, SiteKey } from "./types";

export type AmazonOfferBlock = {
  site: SiteKey;
  slug: string;
  asin: string;
  status: "identity-drift" | "unavailable";
  checkedAt: string;
  observedListing: string;
  reason: string;
  pageUpdatedAt: string;
};

const amazonOfferBlocks = offerBlockConfig.blocks.map((block) => ({
  ...block,
  pageUpdatedAt: block.pageUpdatedAt ?? offerBlockConfig.pageUpdatedAt,
})) as AmazonOfferBlock[];

function productAsin(product: Product) {
  return (product.asin ?? product.specs.ASIN)?.trim().toUpperCase();
}

export function findAmazonOfferBlock(product: Product) {
  const asin = productAsin(product);
  if (!asin) return undefined;

  return amazonOfferBlocks.find(
    (block) =>
      block.site === product.site &&
      block.slug === product.slug &&
      block.asin === asin,
  );
}

export function findAmazonFamilyOfferBlock(site: SiteKey, familySlug: string, asin: string) {
  return amazonOfferBlocks.find((block) =>
    block.site === site && block.slug === `family-${familySlug}` && block.asin === asin,
  );
}

export function isBlockedAmazonSource(site: SiteKey, url: string) {
  try {
    const parsed = new URL(url);
    if (!/(^|\.)amazon\.[a-z.]+$/.test(parsed.hostname)) return false;
    return amazonOfferBlocks.some((block) => block.site === site && parsed.pathname.toUpperCase().includes(block.asin));
  } catch {
    return false;
  }
}
