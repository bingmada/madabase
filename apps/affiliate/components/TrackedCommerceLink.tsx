"use client";

import { ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { trackClarityAffiliateClick } from "./ClarityAnalytics";
import type { SiteKey } from "@/lib/types";

export function TrackedCommerceLink({
  site,
  productSlug,
  productName,
  merchant,
  position,
  href,
  label,
  className = "button-primary",
  firstViewport = false,
}: {
  site: SiteKey;
  productSlug: string;
  productName: string;
  merchant: string;
  position: string;
  href: string;
  label: string;
  className?: string;
  firstViewport?: boolean;
}) {
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
    trackClarityAffiliateClick({ site, productSlug, merchant, position: clickPosition });
  }

  const primaryButton = (
    <a
      className={className}
      data-cta-intent={firstViewport ? "price-availability" : undefined}
      data-affiliate-link-source="authorized-cj-offer"
      data-first-viewport-affiliate={firstViewport ? "true" : undefined}
      data-sticky-commerce-enabled={firstViewport ? "true" : undefined}
      href={href}
      onClick={() => trackClick()}
      ref={firstViewport ? firstViewportLink : undefined}
      rel="nofollow sponsored"
    >
      {label}
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
          aria-label={`Purchase option for ${productName}`}
          className="fixed inset-x-3 z-40 rounded-lg border border-[var(--border)] bg-white/95 p-2.5 shadow-[0_10px_35px_rgba(15,23,42,0.24)] backdrop-blur transition hover:border-[var(--brand)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] lg:inset-x-auto lg:right-6 lg:w-[22rem] lg:max-w-[calc(100vw-3rem)]"
          data-affiliate-link-source="authorized-cj-offer"
          data-cta-intent="price-availability"
          data-sticky-commerce-dock="responsive"
          href={href}
          onClick={() => trackClick(`${position}-sticky-bottom`)}
          rel="nofollow sponsored"
          style={{ bottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-[var(--text)]">{productName}</p>
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
