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
  pageUpdatedAt: offerBlockConfig.pageUpdatedAt,
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
