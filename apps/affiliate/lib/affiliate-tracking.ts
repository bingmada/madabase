import type { AffiliateOffer, AmazonMarketKey, Product, SiteKey } from "./types";
import { findAmazonOfferBlock } from "./amazon-offer-blocks";
import { findAuthorizedCjProductOffer } from "./cj-offers";
import { effectiveContentUpdatedAt } from "./content-updated-at";
import amazonAssociates from "../config/amazon-associates.json";

// These public IDs are registered under the current Associates account. Keep
// attribution independent of stale build/server environment from the old account.
export const amazonTrackingIds: Partial<Record<SiteKey, string>> = amazonAssociates.trackingIds;

export function isCurrentAmazonListingUrl(value: string | null, market: AmazonMarketKey, site: SiteKey): value is string {
  // Only US IDs have been registered for this account. Reject former-account
  // snapshots rather than altering an API-vended URL after hydration.
  const trackingId = market === "us" ? amazonTrackingIds[site] : undefined;
  if (!value || !trackingId) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:"
      && (url.hostname === "www.amazon.com" || url.hostname === "amazon.com")
      && url.searchParams.get("tag") === trackingId;
  } catch {
    return false;
  }
}

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

  const offerBlock = findAmazonOfferBlock(product);
  if (offerBlock) {
    return {
      ...product,
      updatedAt: effectiveContentUpdatedAt(product.updatedAt, offerBlock.pageUpdatedAt),
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
