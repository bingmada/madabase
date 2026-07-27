import { getAffiliatePrisma, hasDatabaseUrl } from "./db";
import type { AmazonMarketKey, SiteKey } from "./types";

export type FreshAmazonCreatorsListing = {
  asin: string;
  market: AmazonMarketKey;
  marketplace: string;
  detailPageUrl: string;
  title?: string;
  imageUrl?: string;
  fetchedAt: string;
  expiresAt: string;
};

type SnapshotRow = {
  asin: string;
  market: string;
  marketplace: string;
  detailPageUrl: string | null;
  title: string | null;
  imageUrl: string | null;
  fetchedAt: Date;
  expiresAt: Date;
};

const marketplaceHosts: Record<AmazonMarketKey, string> = {
  us: "www.amazon.com",
  gb: "www.amazon.co.uk",
  ca: "www.amazon.ca",
  de: "www.amazon.de",
  nl: "www.amazon.nl",
};

function validVendedUrl(value: string | null, market: AmazonMarketKey): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    const expectedHost = marketplaceHosts[market];
    return (
      url.protocol === "https:"
      && (url.hostname === expectedHost || url.hostname === expectedHost.replace(/^www\./, ""))
      && Boolean(url.searchParams.get("tag"))
    );
  } catch {
    return false;
  }
}

export async function getFreshAmazonCreatorsListing(
  site: SiteKey,
  productSlug: string,
  market: AmazonMarketKey,
): Promise<FreshAmazonCreatorsListing | null> {
  if (!hasDatabaseUrl() || site === "costume") return null;

  try {
    const prisma = getAffiliatePrisma();
    const rows = await prisma.$queryRaw<SnapshotRow[]>`
      SELECT
        "asin", "market", "marketplace", "detailPageUrl",
        "title", "imageUrl", "fetchedAt", "expiresAt"
      FROM "AmazonProductSnapshot"
      WHERE
        "site" = ${site}
        AND "market" = ${market}
        AND "productSlug" = ${productSlug}
        AND "detailPageUrl" IS NOT NULL
        AND "expiresAt" > CURRENT_TIMESTAMP
        AND "fetchedAt" > CURRENT_TIMESTAMP - INTERVAL '1 day'
      LIMIT 1
    `;
    const row = rows[0];
    if (!row || row.market !== market || row.marketplace !== marketplaceHosts[market]) return null;
    const detailPageUrl = row.detailPageUrl;
    if (!validVendedUrl(detailPageUrl, market)) return null;

    return {
      asin: row.asin,
      market,
      marketplace: row.marketplace,
      detailPageUrl,
      ...(row.title ? { title: row.title } : {}),
      ...(row.imageUrl ? { imageUrl: row.imageUrl } : {}),
      fetchedAt: row.fetchedAt.toISOString(),
      expiresAt: row.expiresAt.toISOString(),
    };
  } catch {
    // Missing migration, unavailable database, or an expired/invalid snapshot
    // must never remove the site's already verified Amazon offer.
    return null;
  }
}
