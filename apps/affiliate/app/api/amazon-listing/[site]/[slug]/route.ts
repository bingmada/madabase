import { NextResponse } from "next/server";
import { getFreshAmazonCreatorsListing } from "@/lib/amazon-creators";
import { findProduct } from "@/lib/content";
import type { AmazonMarketKey, SiteKey } from "@/lib/types";

const amazonSites = new Set<SiteKey>(["network", "smarthome", "homeoffice", "baby", "pet", "style"]);
const amazonMarkets = new Set<AmazonMarketKey>(["us", "gb", "ca", "de", "nl"]);
const responseHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, nofollow",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ site: string; slug: string }> },
) {
  const { site: siteValue, slug } = await params;
  const marketValue = new URL(request.url).searchParams.get("market") ?? "us";
  if (!amazonSites.has(siteValue as SiteKey) || !amazonMarkets.has(marketValue as AmazonMarketKey)) {
    return NextResponse.json({ listing: null }, { status: 400, headers: responseHeaders });
  }

  const site = siteValue as SiteKey;
  const market = marketValue as AmazonMarketKey;
  const product = findProduct(site, slug);
  if (!product || !(product.asin ?? product.specs.ASIN)) {
    return NextResponse.json({ listing: null }, { status: 404, headers: responseHeaders });
  }

  const listing = await getFreshAmazonCreatorsListing(site, slug, market);
  return NextResponse.json({ listing }, { headers: responseHeaders });
}
