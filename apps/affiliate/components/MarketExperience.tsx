import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Globe2, MapPin, ShieldCheck } from "lucide-react";
import { AffiliateButton, AffiliateButtonGroup } from "./AffiliateButton";
import { AmazonListingFreshness } from "./AmazonCreatorsListing";
import { JsonLd } from "./JsonLd";
import {
  basePathForMarketPage,
  indexableLocalizedMarketPagesForSite,
  localizedMarketPages,
  localizedMarketPagesForSite,
  localizedMarketPath,
  localizedMarketPathForBasePath,
  marketHomeCopy,
  type LocalizedMarketPage,
  type LocalizedMarketVariant,
} from "@/lib/market-content";
import { marketKeys, marketPath, markets, type MarketProfile } from "@/lib/markets";
import { absoluteUrl } from "@/lib/seo";
import type { SiteConfig } from "@/lib/sites";
import { findProduct } from "@/lib/content";
import { amazonAsinAffiliateUrl } from "@/lib/affiliate-tracking";

function marketEditionLinks(currentMarket: MarketProfile, basePath = "/") {
  return marketKeys.map((key) => {
    const market = markets[key];
    return {
      market,
      path: marketPath(market, basePath),
      current: market.key === currentMarket.key,
    };
  });
}

function marketRouteLabel(
  market: MarketProfile,
  route: LocalizedMarketPage["route"],
) {
  const labels = {
    gb: {
      reviews: "Product reviews",
      best: "Comparisons and best picks",
      guides: "Buying guides",
      tools: "Tools and planners",
      categories: "Categories",
    },
    ca: {
      reviews: "Product reviews",
      best: "Comparisons and best picks",
      guides: "Buying guides",
      tools: "Tools and planners",
      categories: "Categories",
    },
    de: {
      reviews: "Produktseiten",
      best: "Vergleiche und Bestenlisten",
      guides: "Kaufratgeber",
      tools: "Tools und Planer",
      categories: "Kategorien",
    },
    nl: {
      reviews: "Productpagina's",
      best: "Vergelijkingen en beste keuzes",
      guides: "Koopgidsen",
      tools: "Tools en planners",
      categories: "Categorieën",
    },
  } as const;
  return labels[market.key][route];
}

export function MarketEditionNav({
  site,
  currentMarket,
  basePath = "/",
}: {
  site: SiteConfig;
  currentMarket: MarketProfile;
  basePath?: string;
}) {
  return (
    <nav className="mt-8 border-t border-[var(--border)] pt-6" aria-label={`${site.name}: ${currentMarket.labels.otherEditions}`}>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">{currentMarket.labels.otherEditions}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {marketEditionLinks(currentMarket, basePath).map(({ market, path, current }) => (
          <Link
            aria-current={current ? "page" : undefined}
            className={current ? "button-primary" : "button-secondary"}
            href={path}
            hrefLang={market.hrefLang}
            key={market.key}
          >
            {current ? `${market.localName} · ${currentMarket.labels.currentEdition}` : market.localName}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function MarketHome({ site, market }: { site: SiteConfig; market: MarketProfile }) {
  const copy = marketHomeCopy[market.key][site.key];
  if (!copy) return null;
  const pages = localizedMarketPagesForSite(site.key, market.key);
  const indexablePages = indexableLocalizedMarketPagesForSite(site.key, market.key);
  const indexablePageKeys = new Set(
    indexablePages.map(({ page }) => `${page.route}:${page.slug}`),
  );
  const featured = [
    ...indexablePages,
    ...pages.filter(
      ({ page }) => !indexablePageKeys.has(`${page.route}:${page.slug}`),
    ),
  ].slice(0, 6);
  const directory = (["reviews", "best", "guides", "tools", "categories"] as const)
    .map((route) => ({
      route,
      pages: pages.filter((item) => item.page.route === route),
    }))
    .filter((group) => group.pages.length);
  const url = absoluteUrl(site, marketPath(market));

  return (
    <main lang={market.languageTag}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: copy.title,
          description: copy.dek,
          url,
          inLanguage: market.languageTag,
          contentLocation: { "@type": "Country", name: market.countryName },
          isPartOf: { "@type": "WebSite", name: site.name, url: site.domain },
          hasPart: indexablePages.map(({ page, variant }) => ({
            "@type": "Article",
            name: variant.title,
            url: absoluteUrl(site, localizedMarketPath(market, page)),
          })),
        }}
      />
      <section className="border-b border-[var(--border)] bg-[var(--brand-soft)]">
        <div className="shell py-14 sm:py-20">
          <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-[var(--brand-strong)]">
            <Globe2 aria-hidden="true" size={18} />
            <span>{copy.eyebrow}</span>
            <span aria-hidden="true">·</span>
            <span>{market.currency}</span>
          </div>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl">{copy.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">{copy.dek}</p>
          <p className="mt-5 max-w-3xl leading-8 text-[var(--text)]">{copy.intro}</p>
        </div>
      </section>
      <section className="section">
        <div className="shell grid gap-7 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <p className="eyebrow">{market.labels.featuredDecision}</p>
            <div className="mt-5 grid gap-5">
              {featured.map(({ page, variant }) => (
                <Link
                  className="panel block p-6 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
                  href={localizedMarketPath(market, page)}
                  hrefLang={market.hrefLang}
                  key={`${page.route}:${page.slug}`}
                >
                  <p className="text-xs font-bold uppercase text-[var(--muted)]">{site.name}</p>
                  <h2 className="mt-2 text-2xl font-bold">{variant.title}</h2>
                  <p className="mt-3 leading-7 text-[var(--muted)]">{variant.dek}</p>
                  <span className="mt-5 inline-flex items-center gap-2 font-bold text-[var(--brand-strong)]">
                    {market.labels.quickAnswer}
                    <ArrowRight aria-hidden="true" size={17} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <aside className="panel h-fit p-6">
            <div className="flex items-center gap-2">
              <MapPin aria-hidden="true" className="text-[var(--brand)]" size={20} />
              <h2 className="text-xl font-bold">{market.labels.categories}</h2>
            </div>
            <ul className="mt-5 space-y-4">
              {copy.focus.map((item) => (
                <li className="flex gap-3 text-sm font-semibold leading-6 text-[var(--muted)]" key={item}>
                  <CheckCircle2 aria-hidden="true" className="mt-1 shrink-0 text-[var(--brand)]" size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm leading-6 text-[var(--muted)]">
              <ShieldCheck aria-hidden="true" className="mb-2 text-[var(--brand)]" size={20} />
              {market.labels.oneLink}
            </div>
          </aside>
        </div>
        <div className="shell mt-12">
          <div className="grid gap-6 md:grid-cols-2">
            {directory.map((group) => (
              <section className="panel p-6" key={group.route}>
                <h2 className="text-2xl font-bold">
                  {marketRouteLabel(market, group.route)}
                </h2>
                <ul className="mt-5 space-y-3">
                  {group.pages.map(({ page, variant }) => (
                    <li key={`${page.route}:${page.slug}`}>
                      <Link
                        className="font-bold leading-6 text-[var(--brand-strong)] hover:underline"
                        href={localizedMarketPath(market, page)}
                        hrefLang={market.hrefLang}
                      >
                        {variant.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-white">
        <div className="shell">
          <MarketEditionNav site={site} currentMarket={market} />
        </div>
      </section>
    </main>
  );
}

export function BaseMarketEditionLinks({ site, basePath }: { site: SiteConfig; basePath: string }) {
  const page = localizedMarketPages.find(
    (item) => item.site === site.key && basePathForMarketPage(item) === basePath,
  );
  if (!page) return null;

  return (
    <nav className="not-prose mt-7 rounded-md border border-[var(--border)] bg-white p-5" aria-label={`${site.name}: country editions`}>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">Country editions</p>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
        Open the buying checks for your local model, power, bundle, seller, delivery, warranty and returns.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {marketKeys.map((key) => {
          const market = markets[key];
          return (
            <Link className="button-secondary" href={localizedMarketPath(market, page)} hrefLang={market.hrefLang} key={market.key}>
              {market.localName}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function marketFactRows(
  market: MarketProfile,
  displayName: string,
  asin: string | undefined,
  evidenceMode: string | undefined,
) {
  if (market.key === "de") {
    return [
      ["Produkt", displayName],
      ["ASIN", asin ?? "Im passenden Amazon-Angebot prüfen"],
      ["Länderausgabe", market.localName],
      ["Vergleichswährung", market.currency],
      ["Amazon-Weiterleitung", "Earn Globally / OneLink über den geprüften US-Associates-Link"],
      ["Belegmodus", evidenceMode ?? "Offizielle Spezifikation"],
    ];
  }
  if (market.key === "nl") {
    return [
      ["Product", displayName],
      ["ASIN", asin ?? "Controleer in het passende Amazon-aanbod"],
      ["Landedities", market.localName],
      ["Vergelijkingsvaluta", market.currency],
      ["Amazon-doorsturen", "Earn Globally / OneLink via de gecontroleerde Amerikaanse Associates-link"],
      ["Onderzoeksmodus", evidenceMode ?? "Officiële specificaties"],
    ];
  }
  return [
    ["Product", displayName],
    ["ASIN", asin ?? "Verify on the matching Amazon offer"],
    ["Country edition", market.localName],
    ["Currency to compare", market.currency],
    ["Amazon routing", "Earn Globally / OneLink from the verified US Associates link"],
    ["Evidence mode", evidenceMode ?? "Official specification"],
  ];
}

function dateModified(value: string) {
  const parsed = new Date(`${value} 00:00:00 UTC`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}

export function LocalizedMarketContent({
  site,
  market,
  page,
  variant,
}: {
  site: SiteConfig;
  market: MarketProfile;
  page: LocalizedMarketPage;
  variant: LocalizedMarketVariant;
}) {
  const product = page.primaryProductSlug
    ? findProduct(site.key, page.primaryProductSlug)
    : undefined;
  const commerceProduct = page.commerceProductSlug
    ? findProduct(site.key, page.commerceProductSlug)
    : product;
  const commerceIsAlternative = Boolean(product && commerceProduct && product.slug !== commerceProduct.slug);
  const displayName = product?.amazonTitle ?? product?.name ?? page.sourceTitle ?? page.slug;
  const displayImage =
    page.image ?? product?.amazonImage ?? product?.image ?? site.heroImage;
  const marketProduct = commerceProduct
    ? {
        ...commerceProduct,
        offers: commerceProduct.offers.map((offer) => ({
          ...offer,
          label: market.labels.cta,
          priceNote: market.labels.oneLink,
        })),
      }
    : undefined;
  const commerceFamilyIdentity = page.commerceFamilyAsin && page.commerceFamilyTitle
    ? {
        slug: `family-${page.slug}-${page.commerceFamilyAsin.toLowerCase()}`,
        name: page.commerceFamilyTitle,
        amazonTitle: page.commerceFamilyTitle,
        asin: page.commerceFamilyAsin,
        specs: { ASIN: page.commerceFamilyAsin },
      }
    : undefined;
  const commerceFamilyOffer = page.commerceFamilyAsin
    ? {
        merchant: "Amazon US",
        url: amazonAsinAffiliateUrl(site.key, page.commerceFamilyAsin),
        label: market.labels.cta,
        priceNote: market.labels.oneLink,
      }
    : undefined;
  const basePath = basePathForMarketPage(page);
  const localizedPath = localizedMarketPath(market, page);
  const pageUrl = absoluteUrl(site, localizedPath);
  const sourceLinks = page.sourceLinks ?? product?.sources ?? [];
  const facts = marketFactRows(
    market,
    displayName,
    product?.asin ?? product?.specs.ASIN,
    product?.evidenceMode,
  );

  return (
    <main className="section" lang={market.languageTag}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: variant.title,
          description: variant.dek,
          url: pageUrl,
          mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
          inLanguage: market.languageTag,
          contentLocation: { "@type": "Country", name: market.countryName },
          dateModified: dateModified(page.updatedAt),
          image: absoluteUrl(site, displayImage),
          about: product
            ? {
                "@type": "Thing",
                name: displayName,
                url: absoluteUrl(site, `/reviews/${product.slug}`),
              }
            : {
                "@type": page.route === "tools" ? "SoftwareApplication" : "Thing",
                name: displayName,
              },
          citation: sourceLinks.map((source) => source.url),
          author: {
            "@type": "Organization",
            name: `${site.name} editorial desk`,
            url: absoluteUrl(site, "/about"),
          },
          publisher: { "@type": "Organization", name: site.name, url: site.domain },
        }}
      />
      <div className="shell max-w-5xl">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-[var(--brand-strong)]" aria-label="Breadcrumb">
          <Link href={marketPath(market)} hrefLang={market.hrefLang}>{market.labels.marketHome}</Link>
          <span aria-hidden="true">/</span>
          <span>{market.labels.edition}</span>
        </nav>
        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="min-w-0">
            <p className="eyebrow">{market.labels.edition} · {site.name}</p>
            <h1 className="mt-3 text-4xl font-black leading-tight">{variant.title}</h1>
            {(marketProduct && marketProduct.offers.length) || (commerceFamilyIdentity && commerceFamilyOffer) ? (
              <section className="mt-4 rounded-md border border-[var(--border)] bg-white p-4 sm:mt-5" aria-label="First-screen retailer option" data-first-viewport-commerce="true">
                <p className="eyebrow">{commerceIsAlternative ? "Different product · verified alternative" : market.labels.quickAnswer}</p>
                <p className="mt-2 text-sm font-semibold leading-5 text-[var(--muted)]">
                  {commerceFamilyIdentity?.amazonTitle ?? (commerceIsAlternative ? `This button is for ${commerceProduct?.amazonTitle ?? commerceProduct?.name}, not the original item.` : commerceProduct?.amazonTitle ?? commerceProduct?.name)}
                </p>
                <div className="mt-3">
                  {commerceFamilyIdentity && commerceFamilyOffer ? (
                    <AffiliateButton site={site.key} product={commerceFamilyIdentity} offer={commerceFamilyOffer} market={market.key} position={`market-${market.key}-first-viewport-family`} resolveCreatorsListing={false} firstViewport />
                  ) : marketProduct ? (
                    <AffiliateButtonGroup site={site.key} product={marketProduct} market={market.key} position={`market-${market.key}-first-viewport`} limit={1} firstViewport />
                  ) : null}
                </div>
              </section>
            ) : null}
            <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{variant.dek}</p>
            <p className="mt-4 text-sm font-semibold text-[var(--muted)]">{market.labels.updated} {page.updatedAt}</p>
            <section className="mt-8 rounded-md border border-[var(--brand)] bg-[var(--brand-soft)] p-6">
              <p className="eyebrow">{market.labels.quickAnswer}</p>
              <p className="mt-3 text-lg font-bold leading-8">{variant.quickAnswer}</p>
              {commerceProduct ? (
                <AmazonListingFreshness
                  site={site.key}
                  productSlug={commerceProduct.slug}
                  market={market.key}
                />
              ) : null}
            </section>
            <div className="prose-lite mt-9">
              {variant.sections.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                </section>
              ))}
            </div>
            <section className="panel mt-9 p-6">
              <h2 className="text-2xl font-bold">{market.labels.buyerChecks}</h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">{market.labels.buyerChecksIntro}</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {variant.checkoutChecks.map((check) => (
                  <li className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm font-semibold leading-6" key={check}>
                    {check}
                  </li>
                ))}
              </ul>
            </section>
            <section className="panel mt-9 p-6">
              <h2 className="text-2xl font-bold">{market.labels.evidence}</h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">{market.labels.evidenceIntro}</p>
              <dl className="mt-5 divide-y divide-[var(--border)]">
                {facts.map(([label, value]) => (
                  <div className="grid gap-2 py-3 text-sm sm:grid-cols-[160px_1fr]" key={label}>
                    <dt className="font-semibold text-[var(--muted)]">{label}</dt>
                    <dd className="break-words font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
              {sourceLinks.length ? (
                <ul className="mt-5 space-y-3">
                  {sourceLinks.slice(0, 6).map((source) => (
                    <li key={source.url}>
                      <a className="font-bold text-[var(--brand-strong)] hover:underline" href={source.url} rel="noopener noreferrer" target="_blank">
                        {source.name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
            <section className="panel mt-9 p-6">
              <h2 className="text-2xl font-bold">{market.labels.related}</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {page.relatedPaths.map((related) => {
                  const relatedMarketPath = localizedMarketPathForBasePath(
                    market,
                    site.key,
                    related.path,
                  );
                  return (
                    <Link
                      className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-4 font-bold hover:text-[var(--brand-strong)]"
                      href={relatedMarketPath ?? related.path}
                      hrefLang={relatedMarketPath ? market.hrefLang : "en-US"}
                      key={related.path}
                    >
                      {related.label}
                    </Link>
                  );
                })}
                <Link className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-4 font-bold hover:text-[var(--brand-strong)]" href={basePath} hrefLang="en-US">
                  {market.labels.originalEdition}
                </Link>
              </div>
            </section>
            <MarketEditionNav site={site} currentMarket={market} basePath={basePath} />
          </article>
          <aside className="h-fit lg:sticky lg:top-24">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-[var(--surface-muted)]">
              <Image className="object-cover" src={displayImage} alt={displayName} fill priority sizes="(min-width: 1024px) 340px, 100vw" />
            </div>
            <div className="panel mt-5 p-5 text-sm leading-6 text-[var(--muted)]">
              <strong className="text-[var(--text)]">{market.amazonStore}:</strong> {market.labels.oneLink}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
