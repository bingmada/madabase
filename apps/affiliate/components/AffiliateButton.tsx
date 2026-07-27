"use client";

import { ExternalLink } from "lucide-react";
import { trackClarityAffiliateClick } from "./ClarityAnalytics";
import type { AffiliateOffer, MarketKey, Product, SiteKey } from "@/lib/types";

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
      href={offer.url}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      aria-label={`${offer.label} for ${product.amazonTitle ?? product.name}`}
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
