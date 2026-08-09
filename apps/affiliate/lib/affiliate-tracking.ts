import type { AffiliateOffer, Product, SiteKey } from "./types";
import { findAmazonOfferBlock } from "./amazon-offer-blocks";
import { findAuthorizedCjProductOffer } from "./cj-offers";

export const amazonTrackingIds: Partial<Record<SiteKey, string>> = {
  network: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_NETWORK ?? "madanetwork-20",
  smarthome: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_SMARTHOME ?? "madasmart-20",
  homeoffice: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_HOMEOFFICE ?? "madaoffice-20",
  baby: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_BABY ?? "madababy-20",
  pet: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_PET ?? "madapets-20",
  style: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_STYLE ?? "madastyle-20",
};

export function amazonAsinAffiliateUrl(site: SiteKey, asin: string) {
  const normalizedAsin = asin.trim().toUpperCase();
  if (!/^[A-Z0-9]{10}$/.test(normalizedAsin)) throw new Error(`Invalid Amazon ASIN: ${asin}`);
  const direct = new URL(`/dp/${normalizedAsin}`, "https://www.amazon.com");
  const trackingId = amazonTrackingIds[site];
  if (trackingId) direct.searchParams.set("tag", trackingId);
  direct.searchParams.set("linkCode", "ll2");
  direct.searchParams.set("language", "en_US");
  direct.searchParams.set("ref_", "as_li_ss_tl");
  return direct.toString();
}

function amazonAsin(product: Product) {
  const asin = (product.asin ?? product.specs.ASIN)?.trim().toUpperCase();
  return /^[A-Z0-9]{10}$/.test(asin ?? "") ? asin : undefined;
}

function isAmazonOffer(offer: AffiliateOffer) {
  if (!offer.merchant.toLowerCase().includes("amazon")) return false;

  try {
    const hostname = new URL(offer.url).hostname;
    return hostname === "amzn.to" || hostname === "amazon.com" || hostname.endsWith(".amazon.com");
  } catch {
    return false;
  }
}

function isAuthorizedOffer(product: Product, offer: AffiliateOffer) {
  return isAmazonOffer(offer) || Boolean(findAuthorizedCjProductOffer(product.site, product.slug, offer.url));
}

function referencesBlockedAsin(url: string | undefined, asin: string) {
  return Boolean(url?.toUpperCase().includes(asin));
}

function trackedAmazonUrl(site: SiteKey, product: Product, offer: AffiliateOffer) {
  const trackingId = amazonTrackingIds[site];
  if (!trackingId) return offer.url;

  try {
    const existing = new URL(offer.url);
    if (existing.hostname === "amazon.com" || existing.hostname.endsWith(".amazon.com")) {
      existing.searchParams.set("tag", trackingId);
      return existing.toString();
    }
  } catch {
    // Short or placeholder URLs can still be resolved from a verified ASIN.
  }

  const asin = amazonAsin(product);
  if (!asin) return offer.url;
  return amazonAsinAffiliateUrl(site, asin);
}

export function applySiteAffiliateTracking(product: Product): Product {
  if (product.site === "costume") {
    return { ...product, offers: [] };
  }

  const offerBlock = findAmazonOfferBlock(product);
  if (offerBlock) {
    return {
      ...product,
      updatedAt: offerBlock.pageUpdatedAt,
      amazonDetailUrl: referencesBlockedAsin(product.amazonDetailUrl, offerBlock.asin)
        ? undefined
        : product.amazonDetailUrl,
      sources: product.sources?.filter(
        (source) => !referencesBlockedAsin(source.url, offerBlock.asin),
      ),
      offers: [],
    };
  }

  return {
    ...product,
    offers: product.offers
      .filter((offer) => isAuthorizedOffer(product, offer))
      .map((offer) =>
        isAmazonOffer(offer)
          ? { ...offer, url: trackedAmazonUrl(product.site, product, offer) }
          : offer,
      ),
  };
}
