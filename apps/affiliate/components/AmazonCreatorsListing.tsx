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

const listingRequests = new Map<string, { promise: Promise<AmazonCreatorsClientListing | null>; expiresAt: number }>();

function listingRequest(site: SiteKey, productSlug: string, market: AmazonMarketKey) {
  const key = `${site}:${productSlug}:${market}`;
  const existing = listingRequests.get(key);
  if (existing && existing.expiresAt > Date.now()) return existing.promise;

  const request = fetch(
    `/api/amazon-listing/${encodeURIComponent(site)}/${encodeURIComponent(productSlug)}?market=${encodeURIComponent(market)}`,
    { cache: "no-store", headers: { accept: "application/json" } },
  )
    .then(async (response) => {
      if (!response.ok) return null;
      const data = (await response.json()) as { listing?: AmazonCreatorsClientListing | null };
      const listing = data.listing;
      return listing && Date.parse(listing.expiresAt) > Date.now() ? listing : null;
    })
    .catch(() => null);
  const entry = { promise: request, expiresAt: Date.now() + 30_000 };
  listingRequests.set(key, entry);
  void request.then((listing) => {
    entry.expiresAt = listing ? Math.min(Date.parse(listing.expiresAt), Date.now() + 300_000) : Date.now() + 30_000;
  });
  return request;
}

export function useAmazonCreatorsListing(
  site: SiteKey,
  productSlug: string,
  market: AmazonMarketKey,
  enabled = true,
) {
  const key = `${site}:${productSlug}:${market}`;
  const [snapshot, setSnapshot] = useState<{ key: string; listing: AmazonCreatorsClientListing | null } | null>(null);

  useEffect(() => {
    let active = true;
    let expiryTimer: ReturnType<typeof setTimeout> | undefined;
    if (!enabled) return () => {
      active = false;
    };

    void listingRequest(site, productSlug, market).then((value) => {
      if (active) {
        setSnapshot({ key, listing: value });
        if (value) expiryTimer = setTimeout(() => {
          if (active) setSnapshot((current) => current?.key === key ? null : current);
        }, Math.max(0, Date.parse(value.expiresAt) - Date.now()));
      }
    });
    return () => {
      active = false;
      if (expiryTimer) clearTimeout(expiryTimer);
    };
  }, [enabled, key, market, productSlug, site]);

  const listing = enabled && snapshot?.key === key ? snapshot.listing : null;
  return listing && Date.parse(listing.expiresAt) > Date.now() ? listing : null;
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
