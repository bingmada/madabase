"use client";

import { useEffect, useState } from "react";
import { BadgeCheck } from "lucide-react";
import type { AmazonMarketKey, MarketKey, SiteKey } from "@/lib/types";

export type AmazonCreatorsClientListing = {
  asin: string;
  market: AmazonMarketKey;
  marketplace: string;
  detailPageUrl: string;
  title?: string;
  imageUrl?: string;
  fetchedAt: string;
  expiresAt: string;
};

const listingRequests = new Map<string, Promise<AmazonCreatorsClientListing | null>>();

function listingRequest(site: SiteKey, productSlug: string, market: AmazonMarketKey) {
  const key = `${site}:${productSlug}:${market}`;
  const existing = listingRequests.get(key);
  if (existing) return existing;

  const request = fetch(
    `/api/amazon-listing/${encodeURIComponent(site)}/${encodeURIComponent(productSlug)}?market=${encodeURIComponent(market)}`,
    { cache: "no-store", headers: { accept: "application/json" } },
  )
    .then(async (response) => {
      if (!response.ok) return null;
      const data = (await response.json()) as { listing?: AmazonCreatorsClientListing | null };
      return data.listing ?? null;
    })
    .catch(() => null);
  listingRequests.set(key, request);
  return request;
}

export function useAmazonCreatorsListing(
  site: SiteKey,
  productSlug: string,
  market: AmazonMarketKey,
  enabled = true,
) {
  const [listing, setListing] = useState<AmazonCreatorsClientListing | null>(null);

  useEffect(() => {
    let active = true;
    if (!enabled) return () => {
      active = false;
    };

    void listingRequest(site, productSlug, market).then((value) => {
      if (active) setListing(value);
    });
    return () => {
      active = false;
    };
  }, [enabled, market, productSlug, site]);

  return listing;
}

const listingCopy: Record<AmazonMarketKey, { checked: string; match: string; locale: string }> = {
  us: { checked: "Amazon listing refreshed via Creators API", match: "Exact listing to match", locale: "en-US" },
  gb: { checked: "Amazon UK listing refreshed via Creators API", match: "Exact listing to match", locale: "en-GB" },
  ca: { checked: "Amazon Canada listing refreshed via Creators API", match: "Exact listing to match", locale: "en-CA" },
  de: { checked: "Amazon-Angebot über Creators API aktualisiert", match: "Dieses genaue Angebot abgleichen", locale: "de-DE" },
  nl: { checked: "Amazon-aanbod bijgewerkt via Creators API", match: "Vergelijk dit exacte aanbod", locale: "nl-NL" },
};

export function AmazonListingFreshness({
  site,
  productSlug,
  market,
}: {
  site: SiteKey;
  productSlug: string;
  market?: MarketKey;
}) {
  const amazonMarket: AmazonMarketKey = market ?? "us";
  const listing = useAmazonCreatorsListing(site, productSlug, amazonMarket);
  if (!listing) return null;
  const copy = listingCopy[amazonMarket];
  const checkedAt = new Intl.DateTimeFormat(copy.locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(listing.fetchedAt));

  return (
    <div className="mt-4 rounded-md border border-[var(--border)] bg-white p-4 text-sm" aria-live="polite">
      <p className="flex items-center gap-2 font-bold text-[var(--brand-strong)]">
        <BadgeCheck aria-hidden="true" size={17} />
        {copy.checked}
      </p>
      <p className="mt-2 leading-6 text-[var(--muted)]">
        {copy.match}: <strong className="text-[var(--text)]">{listing.title ?? `ASIN ${listing.asin}`}</strong>
      </p>
      <p className="mt-1 text-xs font-semibold text-[var(--muted)]">{checkedAt}</p>
    </div>
  );
}
