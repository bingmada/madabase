"use client";

import { ExternalLink } from "lucide-react";
import type { AffiliateOffer, Product, SiteKey } from "@/lib/types";

export function AffiliateButton({
  site,
  product,
  offer,
  position,
}: {
  site: SiteKey;
  product: Product;
  offer: AffiliateOffer;
  position: string;
}) {
  function trackClick() {
    const eventId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    void fetch("/api/affiliate-clicks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        eventId,
        site,
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
      onClick={trackClick}
    >
      {offer.label}
      <ExternalLink aria-hidden="true" size={16} />
    </a>
  );
}
