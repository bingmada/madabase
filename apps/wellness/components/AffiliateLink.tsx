"use client";

import type { ReactNode } from "react";
import { trackAffiliateClick } from "./ClarityAnalytics";
import { pausedOffer } from "@/lib/offer-status";

export function AffiliateLink({
  href,
  merchant,
  productSlug,
  position,
  className,
  children,
}: {
  href: string;
  merchant: string;
  productSlug: string;
  position: string;
  className: string;
  children: ReactNode;
}) {
  const paused = pausedOffer(productSlug);
  if (paused) {
    return <p className="evidence-note" data-commerce-paused="true">{paused.reason}</p>;
  }
  return (
    <a
      className={className}
      data-affiliate-link-source="authorized-cj-offer"
      href={href}
      onClick={() => trackAffiliateClick({ productSlug, merchant, position })}
      rel="sponsored nofollow noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}
