import type { PublicationStatus, SiteKey } from "./types";

export type AuthorizedCjOffer = {
  token: string;
  site: SiteKey;
  productSlug: string;
  productName?: string;
  familySlug?: string;
  variantLabel?: string;
  catalogSku?: string;
  catalogUpdatedAt?: string;
  publicationStatus?: PublicationStatus;
  releaseCandidate?: string;
  merchantSlug: string;
  merchantName: string;
  advertiserCid: string;
  pid: string;
  aid: string;
  networkLinkId: string;
  trackingUrl: string;
  destinationUrl: string;
  allowedDestinationHosts: string[];
  verifiedAt: string;
};

export const authorizedCjOffers: AuthorizedCjOffer[] = [
  {
    token: "bc-babycare-hexa-effortless",
    site: "baby",
    productSlug: "bc-babycare-hexa-effortless-carrier",
    merchantSlug: "bc-babycare",
    merchantName: "Bc Babycare",
    advertiserCid: "7582444",
    pid: "101832977",
    aid: "17183962",
    networkLinkId: "17183962",
    trackingUrl: "https://www.jdoqocy.com/click-101832977-17183962-1780367452000",
    destinationUrl:
      "https://www.bcbabycare.com/products/hexa-effortless-carrier?variant=47628859179254",
    allowedDestinationHosts: ["bcbabycare.com", "www.bcbabycare.com"],
    verifiedAt: "2026-07-31",
  },
  {
    token: "bc-babycare-portable-fan",
    site: "baby",
    productSlug: "bc-babycare-portable-fan",
    productName: "Bc Babycare Portable Fan",
    familySlug: "stroller-fans",
    variantLabel: "Clean White · variant 49900838387958",
    catalogSku: "shopify_US_8040194441462_49900838387958",
    catalogUpdatedAt: "2026-06-13",
    publicationStatus: "published",
    releaseCandidate: "breadth-64-2026-08-16",
    merchantSlug: "bc-babycare",
    merchantName: "Bc Babycare",
    advertiserCid: "7582444",
    pid: "101832977",
    aid: "17184215",
    networkLinkId: "17184215",
    trackingUrl:
      "https://www.jdoqocy.com/click-101832977-17184215?url=https%3A%2F%2Fwww.bcbabycare.com%2Fproducts%2Fportable-fan%3Fvariant%3D49900838387958%26utm_source%3Dgoogle%26utm_medium%3Dorganic%26utm_campaign%3DGoogle%2520Shopping%2520Feed%26utm_content%3DPortable%2520Fan&cjsku=shopify_US_8040194441462_49900838387958",
    destinationUrl:
      "https://www.bcbabycare.com/products/portable-fan?variant=49900838387958",
    allowedDestinationHosts: ["bcbabycare.com", "www.bcbabycare.com"],
    verifiedAt: "2026-08-12",
  },
  {
    token: "bc-babycare-airy-silicone-bib",
    site: "baby",
    productSlug: "bc-babycare-airy-silicone-bib",
    productName: "Bc Babycare Airy Silicone Bib (2-pack)",
    familySlug: "roll-up-feeding-bibs",
    variantLabel: "Soft Pink + Soft Green · variant 48169661497590",
    catalogSku: "shopify_US_9013205106934_48169661497590",
    catalogUpdatedAt: "2026-08-01",
    publicationStatus: "published",
    releaseCandidate: "breadth-64-2026-08-16",
    merchantSlug: "bc-babycare",
    merchantName: "Bc Babycare",
    advertiserCid: "7582444",
    pid: "101832977",
    aid: "17184215",
    networkLinkId: "17184215",
    trackingUrl:
      "https://www.jdoqocy.com/click-101832977-17184215?url=https%3A%2F%2Fwww.bcbabycare.com%2Fproducts%2Fairy-silicone-bib%3Fvariant%3D48169661497590%26utm_source%3Dgoogle%26utm_medium%3Dorganic%26utm_campaign%3DGoogle%2520Shopping%2520Feed%26utm_content%3DAiry%2520Silicone%2520Bib&cjsku=shopify_US_9013205106934_48169661497590",
    destinationUrl:
      "https://www.bcbabycare.com/products/airy-silicone-bib?variant=48169661497590",
    allowedDestinationHosts: ["bcbabycare.com", "www.bcbabycare.com"],
    verifiedAt: "2026-08-12",
  },
  {
    token: "bc-babycare-clarvion-bundle",
    site: "baby",
    productSlug: "bc-babycare-clarvion-bottle-washer",
    productName: "Bc Babycare Clarvion Baby Bottle Washer",
    familySlug: "automatic-bottle-washers",
    variantLabel: "Light Beige · washer + 240 detergent tablets · variant 50562047410422",
    catalogSku: "shopify_US_9323144675574_50562047410422",
    catalogUpdatedAt: "2026-06-13",
    publicationStatus: "published",
    releaseCandidate: "breadth-64-2026-08-16",
    merchantSlug: "bc-babycare",
    merchantName: "Bc Babycare",
    advertiserCid: "7582444",
    pid: "101832977",
    aid: "17184215",
    networkLinkId: "17184215",
    trackingUrl:
      "https://www.anrdoezrs.net/click-101832977-17184215?url=https%3A%2F%2Fwww.bcbabycare.com%2Fproducts%2Fclarvion-baby-bottle-washer%3Fvariant%3D50562047410422%26utm_source%3Dgoogle%26utm_medium%3Dorganic%26utm_campaign%3DGoogle%2520Shopping%2520Feed%26utm_content%3DClarvion%2520Baby%2520Bottle%2520Washer&cjsku=shopify_US_9323144675574_50562047410422",
    destinationUrl:
      "https://www.bcbabycare.com/products/clarvion-baby-bottle-washer?variant=50562047410422",
    allowedDestinationHosts: ["bcbabycare.com", "www.bcbabycare.com"],
    verifiedAt: "2026-08-12",
  },
  {
    token: "bc-babycare-baby-food-maker-blue-extra",
    site: "baby",
    productSlug: "bc-babycare-baby-food-maker",
    productName: "Bc Babycare Baby Food Maker",
    familySlug: "baby-food-makers",
    variantLabel: "Soft Blue · extra replacement part · variant 51018982392054",
    catalogSku: "shopify_US_9030769934582_51018982392054",
    catalogUpdatedAt: "2026-08-08",
    publicationStatus: "published",
    releaseCandidate: "breadth-64-2026-08-16",
    merchantSlug: "bc-babycare",
    merchantName: "Bc Babycare",
    advertiserCid: "7582444",
    pid: "101832977",
    aid: "17184215",
    networkLinkId: "17184215",
    trackingUrl:
      "https://www.kqzyfj.com/click-101832977-17184215?url=https%3A%2F%2Fwww.bcbabycare.com%2Fproducts%2Fbaby-food-maker%3Fvariant%3D51018982392054%26utm_source%3Dgoogle%26utm_medium%3Dorganic%26utm_campaign%3DGoogle%2520Shopping%2520Feed%26utm_content%3DBaby%2520Food%2520Maker&cjsku=shopify_US_9030769934582_51018982392054",
    destinationUrl:
      "https://www.bcbabycare.com/products/baby-food-maker?variant=51018982392054",
    allowedDestinationHosts: ["bcbabycare.com", "www.bcbabycare.com"],
    verifiedAt: "2026-08-12",
  },
  {
    token: "bc-babycare-potty-chair-green",
    site: "baby",
    productSlug: "bc-babycare-3-in-1-potty-chair",
    productName: "Bc Babycare 3-in-1 Potty Chair",
    variantLabel: "Soft Green · Standard Set · variant 47121956372726",
    catalogSku: "shopify_US_8805182996726_47121956372726",
    catalogUpdatedAt: "2026-06-27",
    publicationStatus: "published",
    releaseCandidate: "breadth-64-2026-08-16",
    merchantSlug: "bc-babycare",
    merchantName: "Bc Babycare",
    advertiserCid: "7582444",
    pid: "101832977",
    aid: "17184215",
    networkLinkId: "17184215",
    trackingUrl:
      "https://www.dpbolvw.net/click-101832977-17184215?url=https%3A%2F%2Fwww.bcbabycare.com%2Fproducts%2Fpotty-chair%3Fvariant%3D47121956372726%26utm_source%3Dgoogle%26utm_medium%3Dorganic%26utm_campaign%3DGoogle%2520Shopping%2520Feed%26utm_content%3DPotty%2520Chair&cjsku=shopify_US_8805182996726_47121956372726",
    destinationUrl:
      "https://www.bcbabycare.com/products/3-in-1-potty-chair?variant=47121956372726",
    allowedDestinationHosts: ["bcbabycare.com", "www.bcbabycare.com"],
    verifiedAt: "2026-08-12",
  },
  {
    token: "bc-babycare-dino-barron-14-2",
    site: "baby",
    productSlug: "bc-babycare-dino-barron-playpen",
    productName: "Bc Babycare Dino Barron Baby Playpen",
    variantLabel: "14+2 panels · Light Olive · variant 49891071099126",
    catalogSku: "shopify_US_8847523512566_49891071099126",
    catalogUpdatedAt: "2026-07-12",
    publicationStatus: "draft",
    releaseCandidate: "cj-safety-hold-2026-08-11",
    merchantSlug: "bc-babycare",
    merchantName: "Bc Babycare",
    advertiserCid: "7582444",
    pid: "101832977",
    aid: "17184215",
    networkLinkId: "17184215",
    trackingUrl:
      "https://www.anrdoezrs.net/click-101832977-17184215?url=https%3A%2F%2Fwww.bcbabycare.com%2Fproducts%2Fdino-barron-playpen%3Fvariant%3D49891071099126%26utm_source%3Dgoogle%26utm_medium%3Dorganic%26utm_campaign%3DGoogle%2520Shopping%2520Feed%26utm_content%3DDino%2520Barron%2520Playpen&cjsku=shopify_US_8847523512566_49891071099126",
    destinationUrl:
      "https://www.bcbabycare.com/products/dino-barron-playpen?variant=49891071099126",
    allowedDestinationHosts: ["bcbabycare.com", "www.bcbabycare.com"],
    verifiedAt: "2026-08-11",
  },
];

function isCjOfferVisible(offer: AuthorizedCjOffer) {
  return process.env.AFFILIATE_INCLUDE_DRAFTS === "1" || offer.publicationStatus !== "draft";
}

export function findAuthorizedCjOffer(token: string) {
  return authorizedCjOffers.find((offer) => offer.token === token && isCjOfferVisible(offer));
}

export function findAuthorizedCjFamilyOffer(site: SiteKey, familySlug: string) {
  return authorizedCjOffers.find((offer) =>
    offer.site === site && offer.familySlug === familySlug && isCjOfferVisible(offer),
  );
}

export function findAuthorizedCjProductOffer(site: SiteKey, productSlug: string, value: string) {
  let url: URL;
  try {
    url = new URL(value, "https://affiliate-route.invalid");
  } catch {
    return undefined;
  }

  const match = url.pathname.match(/^\/go\/cj\/([A-Za-z0-9_-]{12,96})\/?$/);
  if (!match) return undefined;

  const offer = findAuthorizedCjOffer(match[1]);
  return offer?.site === site && offer.productSlug === productSlug ? offer : undefined;
}
