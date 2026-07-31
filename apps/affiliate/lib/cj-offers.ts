import type { SiteKey } from "./types";

export type AuthorizedCjOffer = {
  token: string;
  site: SiteKey;
  productSlug: string;
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
];

export function findAuthorizedCjOffer(token: string) {
  return authorizedCjOffers.find((offer) => offer.token === token);
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
