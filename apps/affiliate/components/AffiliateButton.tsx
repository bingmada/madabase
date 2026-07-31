"use client";

import { ExternalLink } from "lucide-react";
import { useAmazonCreatorsListing } from "./AmazonCreatorsListing";
import { trackClarityAffiliateClick } from "./ClarityAnalytics";
import type { AffiliateOffer, AmazonMarketKey, MarketKey, Product, SiteKey } from "@/lib/types";

export function AffiliateButton({
  site,
  product,
  offer,
  market,
  position,
}: {
  site: SiteKey;
  product: Product;
  offer: AffiliateOffer;
  market?: MarketKey;
  position: string;
}) {
  const amazonMarket: AmazonMarketKey = market ?? "us";
  const isAmazon = offer.merchant.toLowerCase().includes("amazon");
  const creatorsListing = useAmazonCreatorsListing(
    site,
    product.slug,
    amazonMarket,
    Boolean(product.asin ?? product.specs.ASIN) && isAmazon,
  );
  const href = creatorsListing?.detailPageUrl ?? offer.url;

  function trackClick() {
    const eventId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    trackClarityAffiliateClick({
      site,
      market,
      productSlug: product.slug,
      merchant: offer.merchant,
      position,
    });

    void fetch("/api/affiliate-clicks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        eventId,
        site,
        market: market ?? "us",
        productSlug: product.slug,
        merchant: offer.merchant,
        position,
        path: window.location.pathname,
      }),
      keepalive: true,
    }).catch(() => undefined);
  }

  return (
    <a
      className="button-primary"
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      aria-label={`${offer.label} for ${creatorsListing?.title ?? product.amazonTitle ?? product.name}`}
      data-affiliate-link-source={
        creatorsListing ? "amazon-creators-api" : isAmazon ? "verified-amazon-fallback" : "authorized-offer"
      }
      onClick={trackClick}
    >
      {offer.label}
      <ExternalLink aria-hidden="true" size={16} />
    </a>
  );
}

export function AffiliateButtonGroup({
  site,
  product,
  market,
  position,
  limit = 2,
}: {
  site: SiteKey;
  product: Product;
  market?: MarketKey;
  position: string;
  limit?: number;
}) {
  const offers = product.offers.slice(0, limit);
  if (offers.length === 0) return null;

  return (
    <>
      {offers.map((offer) => (
        <AffiliateButton key={offer.merchant} site={site} product={product} offer={offer} market={market} position={position} />
      ))}
    </>
  );
}
