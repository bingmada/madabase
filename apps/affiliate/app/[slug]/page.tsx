import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { MarketHome } from "@/components/MarketExperience";
import {
  hasIndexableLocalizedMarketPages,
  localizedMarketHomeAlternates,
  marketHomeCopy,
} from "@/lib/market-content";
import { getMarketByRouteSlug, marketPath, marketRouteSlugs, supportsMarketEditions } from "@/lib/markets";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { findStaticPage, staticPageSlugs } from "@/lib/static-pages";
import { getCurrentSite } from "@/lib/sites";

export async function generateStaticParams() {
  return [...staticPageSlugs, ...marketRouteSlugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const market = getMarketByRouteSlug(slug);
  const marketCopy = market ? marketHomeCopy[market.key][site.key] : undefined;
  if (market && marketCopy && supportsMarketEditions(site.key)) {
    const path = marketPath(market);
    const metadata = pageMetadata(site, path, marketCopy.title, marketCopy.dek);
    const indexable = hasIndexableLocalizedMarketPages(site.key);
    const languages = localizedMarketHomeAlternates(site.domain, site.key);
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
  const page = findStaticPage(site, slug);
  if (!page) return {};
  return pageMetadata(site, `/${slug}`, page.title, page.dek);
}

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const market = getMarketByRouteSlug(slug);
  if (market && supportsMarketEditions(site.key) && marketHomeCopy[market.key][site.key]) {
    return <MarketHome site={site} market={market} />;
  }
  const page = findStaticPage(site, slug);
  if (!page) notFound();

  return (
    <main className="section">
      <JsonLd data={breadcrumbSchema(site, [{ name: "Home", path: "/" }, { name: page.title, path: `/${slug}` }])} />
      <div className="shell max-w-4xl">
        <p className="eyebrow">{site.name}</p>
        <h1 className="mt-3 text-4xl font-black leading-tight">{page.title}</h1>
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{page.dek}</p>
        <article className="prose-lite mt-8">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
