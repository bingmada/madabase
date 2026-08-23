import { notFound, permanentRedirect } from "next/navigation";
import { LocalizedMarketContent } from "@/components/MarketExperience";
import {
  basePathForMarketPage,
  findLocalizedMarketPage,
  isIndexableLocalizedMarketPage,
  localizedAlternatesForBasePath,
  localizedMarketPath,
} from "@/lib/market-content";
import { getMarketByRouteSlug, supportsMarketEditions } from "@/lib/markets";
import { pageMetadata } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";
import { findGuide, findProduct } from "@/lib/content";
import { consolidationTargetSlug } from "@/lib/search-recovery-consolidation";

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
  const product = page.primaryProductSlug
    ? findProduct(site.key, page.primaryProductSlug)
    : undefined;
  const path = localizedMarketPath(market, page);
  const metadata = pageMetadata(
    site,
    path,
    variant.title,
    variant.dek,
    page.image ?? product?.amazonImage ?? product?.image ?? site.heroImage,
  );
  const indexable = isIndexableLocalizedMarketPage(page);
  const languages = localizedAlternatesForBasePath(
    site.domain,
    site.key,
    basePathForMarketPage(page),
  );

  return {
    ...metadata,
    ...(!indexable
      ? {
          robots: {
            index: false,
            follow: true,
            googleBot: { index: false, follow: true },
          },
        }
      : {}),
    alternates: {
      canonical: new URL(path, site.domain).toString(),
      ...(languages ? { languages } : {}),
    },
  };
}

export default async function MarketContentPage({ params }: { params: MarketPageParams }) {
  const routeParams = await params;
  if (routeParams.kind === "guides") {
    const site = await getCurrentSite();
    const guide = findGuide(site.key, routeParams.contentSlug);
    const target = guide ? consolidationTargetSlug(guide) : undefined;
    if (target) permanentRedirect(`/${routeParams.slug}/guides/${target}`);
  }
  const resolved = await resolveMarketPage(params);
  if (!resolved) notFound();
  return <LocalizedMarketContent {...resolved} />;
}
