import { notFound } from "next/navigation";
import { LocalizedMarketContent } from "@/components/MarketExperience";
import {
  basePathForMarketPage,
  findLocalizedMarketPage,
  localizedAlternatesForBasePath,
  localizedMarketPath,
} from "@/lib/market-content";
import { getMarketByRouteSlug, supportsMarketEditions } from "@/lib/markets";
import { pageMetadata } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";
import { findProduct } from "@/lib/content";

type MarketPageParams = Promise<{ slug: string; kind: string; contentSlug: string }>;

async function resolveMarketPage(params: MarketPageParams) {
  const site = await getCurrentSite();
  const { slug, kind, contentSlug } = await params;
  const market = getMarketByRouteSlug(slug);
  if (!market || !supportsMarketEditions(site.key)) return undefined;
  const localized = findLocalizedMarketPage(site.key, market.key, kind, contentSlug);
  if (!localized) return undefined;
  return { site, market, ...localized };
}

export async function generateMetadata({ params }: { params: MarketPageParams }) {
  const resolved = await resolveMarketPage(params);
  if (!resolved) return {};
  const { site, market, page, variant } = resolved;
  const product = findProduct(site.key, page.primaryProductSlug);
  const path = localizedMarketPath(market, page);
  const metadata = pageMetadata(
    site,
    path,
    variant.title,
    variant.dek,
    product?.amazonImage ?? product?.image ?? site.heroImage,
  );

  return {
    ...metadata,
    alternates: {
      canonical: new URL(path, site.domain).toString(),
      languages: localizedAlternatesForBasePath(site.domain, site.key, basePathForMarketPage(page)),
    },
  };
}

export default async function MarketContentPage({ params }: { params: MarketPageParams }) {
  const resolved = await resolveMarketPage(params);
  if (!resolved) notFound();
  return <LocalizedMarketContent {...resolved} />;
}
