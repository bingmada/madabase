"use client";

import { ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAmazonCreatorsListing } from "./AmazonCreatorsListing";
import { trackClarityAffiliateClick } from "./ClarityAnalytics";
import type { AffiliateOffer, AmazonMarketKey, MarketKey, Product, SiteKey } from "@/lib/types";

type AffiliateProductIdentity = Pick<Product, "slug" | "name" | "amazonTitle" | "asin" | "specs">;

export function AffiliateButton({
  site,
  product,
  offer,
  market,
  position,
  resolveCreatorsListing = true,
  firstViewport = false,
}: {
  site: SiteKey;
  product: AffiliateProductIdentity;
  offer: AffiliateOffer;
  market?: MarketKey;
  position: string;
  resolveCreatorsListing?: boolean;
  firstViewport?: boolean;
}) {
  const amazonMarket: AmazonMarketKey = market ?? "us";
  const isAmazon = offer.merchant.toLowerCase().includes("amazon");
  const creatorsListingCandidate = useAmazonCreatorsListing(
    site,
    product.slug,
    amazonMarket,
    resolveCreatorsListing && Boolean(product.asin ?? product.specs.ASIN) && isAmazon,
  );
  const expectedAsin = (product.asin ?? product.specs.ASIN)?.trim().toUpperCase();
  const creatorsListing = creatorsListingCandidate
    && (amazonMarket !== "us" || creatorsListingCandidate.asin.trim().toUpperCase() === expectedAsin)
    ? creatorsListingCandidate
    : null;
  const href = creatorsListing?.detailPageUrl ?? offer.url;
  const merchantName = offer.merchant.replace(/\s+via\s+CJ$/i, "");
  const visibleLabel = isAmazon
    ? "Check current price & availability on Amazon"
    : `Check current price & availability at ${merchantName}`;
  const [showStickyDock, setShowStickyDock] = useState(false);
  const firstViewportLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!firstViewport || !firstViewportLink.current) return;

    let firstLinkPassed = false;
    let footerVisible = false;
    const updateDock = () => setShowStickyDock(firstLinkPassed && !footerVisible);
    const firstLinkObserver = new IntersectionObserver(([entry]) => {
      firstLinkPassed = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
      updateDock();
    });
    const footer = document.querySelector("footer");
    const footerObserver = footer
      ? new IntersectionObserver(([entry]) => {
          footerVisible = entry.isIntersecting;
          updateDock();
        })
      : null;

    firstLinkObserver.observe(firstViewportLink.current);
    if (footer && footerObserver) footerObserver.observe(footer);

    return () => {
      firstLinkObserver.disconnect();
      footerObserver?.disconnect();
    };
  }, [firstViewport]);

  function trackClick(clickPosition = position) {
    const eventId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

    trackClarityAffiliateClick({
      site,
      market,
      productSlug: product.slug,
      merchant: offer.merchant,
      position: clickPosition,
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
        position: clickPosition,
        path: window.location.pathname,
      }),
      keepalive: true,
    }).catch(() => undefined);
  }

  const primaryButton = (
    <a
      ref={firstViewport ? firstViewportLink : undefined}
      className="button-primary"
      href={href}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      aria-label={`${visibleLabel} for ${creatorsListing?.title ?? product.amazonTitle ?? product.name}`}
      data-affiliate-link-source={
        creatorsListing ? "amazon-creators-api" : isAmazon ? "verified-amazon-fallback" : "authorized-offer"
      }
      data-first-viewport-affiliate={firstViewport ? "true" : undefined}
      data-cta-intent={firstViewport ? "price-availability" : undefined}
      data-sticky-commerce-enabled={firstViewport ? "true" : undefined}
      onClick={() => trackClick()}
    >
      {visibleLabel}
      <ExternalLink aria-hidden="true" size={16} />
    </a>
  );

  if (!firstViewport) return primaryButton;

  return (
    <>
      <div className="inline-flex max-w-full flex-col items-start gap-1.5">
        {primaryButton}
        <p className="max-w-md text-xs leading-5 text-[var(--muted)]">
          Current price &amp; availability · purchase link
        </p>
      </div>
      {showStickyDock ? (
        <a
          aria-label={`Purchase option for ${creatorsListing?.title ?? product.amazonTitle ?? product.name}`}
          className="fixed inset-x-3 z-40 rounded-lg border border-[var(--border)] bg-white/95 p-2.5 shadow-[0_10px_35px_rgba(15,23,42,0.24)] backdrop-blur transition hover:border-[var(--brand)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] lg:inset-x-auto lg:right-6 lg:w-[22rem] lg:max-w-[calc(100vw-3rem)]"
          data-affiliate-link-source={
            creatorsListing ? "amazon-creators-api" : isAmazon ? "verified-amazon-fallback" : "authorized-offer"
          }
          data-cta-intent="price-availability"
          data-sticky-commerce-dock="responsive"
          href={href}
          onClick={() => trackClick(`${position}-sticky-bottom`)}
          rel="sponsored nofollow noopener noreferrer"
          style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
          target="_blank"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-[var(--text)]">
                {creatorsListing?.title ?? product.amazonTitle ?? product.name}
              </p>
              <p className="mt-0.5 text-[11px] leading-4 text-[var(--muted)]">Current price &amp; availability · purchase link</p>
            </div>
            <span className="button-primary shrink-0 px-3 py-2 text-xs">
              Check price
              <ExternalLink aria-hidden="true" size={14} />
            </span>
          </div>
        </a>
      ) : null}
    </>
  );
}

export function AffiliateButtonGroup({
  site,
  product,
  market,
  position,
  limit = 2,
  firstViewport = false,
}: {
  site: SiteKey;
  product: Product;
  market?: MarketKey;
  position: string;
  limit?: number;
  firstViewport?: boolean;
}) {
  const offers = product.offers.slice(0, limit);
  if (offers.length === 0) return null;

  return (
    <>
      {offers.map((offer) => (
        <AffiliateButton key={offer.merchant} site={site} product={product} offer={offer} market={market} position={position} firstViewport={firstViewport} />
      ))}
    </>
  );
}
