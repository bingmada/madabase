import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateButton } from "@/components/AffiliateButton";
import { JsonLd } from "@/components/JsonLd";
import { Disclosure, MethodologyList, ProductCard } from "@/components/LayoutParts";
import { findProduct, findRoundup } from "@/lib/content";
import { absoluteUrl, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";

function quickAnswer(roundupTitle: string, intent: string, picks: Array<ReturnType<typeof findProduct>>) {
  const firstPick = picks.find(Boolean);
  if (!firstPick) return intent;

  return `${roundupTitle}: start with ${firstPick.name} if your main need is ${firstPick.bestFor.toLowerCase()}. Compare the trade-offs before buying, especially ${firstPick.cons[0].toLowerCase()}.`;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const roundup = findRoundup(site.key, slug);
  if (!roundup) return {};
  return pageMetadata(site, `/best/${slug}`, roundup.title, roundup.dek);
}

export default async function RoundupPage({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const roundup = findRoundup(site.key, slug);
  if (!roundup) notFound();
  const picks = roundup.productSlugs.map((productSlug) => findProduct(site.key, productSlug)).filter(Boolean);
  const answer = quickAnswer(roundup.title, roundup.intent, picks);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: roundup.title,
    itemListElement: picks.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(site, `/reviews/${product!.slug}`),
      name: product!.name,
    })),
  };

  return (
    <main className="section">
      <JsonLd data={breadcrumbSchema(site, [{ name: "Home", path: "/" }, { name: roundup.title, path: `/best/${slug}` }])} />
      <JsonLd data={itemListSchema} />
      <div className="shell">
        <div className="max-w-3xl">
          <p className="eyebrow">{roundup.category}</p>
          <h1 className="mt-3 text-4xl font-black leading-tight">{roundup.title}</h1>
          <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{roundup.dek}</p>
          {roundup.intro ? <p className="mt-4 max-w-3xl leading-8 text-[var(--muted)]">{roundup.intro}</p> : null}
          <div className="mt-6 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-5">
            <p className="text-xs font-bold uppercase text-[var(--muted)]">Quick answer</p>
            <p className="mt-2 text-lg font-bold leading-8 text-[var(--text)]">{answer}</p>
          </div>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Disclosure site={site} />
            {picks.length ? (
              <section className="panel overflow-hidden">
                <div className="border-b border-[var(--border)] p-5">
                  <h2 className="text-xl font-bold">Quick comparison</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Start here if you already know the job you need the product to solve.</p>
                </div>
                <div className="divide-y divide-[var(--border)]">
                  {picks.map((product, index) =>
                    product ? (
                      <div className="grid gap-4 p-5 md:grid-cols-[44px_1.1fr_1fr_1fr_0.8fr_auto]" key={product.slug}>
                        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--brand-soft)] text-sm font-black text-[var(--brand-strong)]">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase text-[var(--muted)]">{product.brand}</p>
                          <h3 className="mt-1 font-bold">{product.amazonTitle ?? product.name}</h3>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase text-[var(--muted)]">Best for</p>
                          <p className="mt-1 text-sm leading-6">{product.bestFor}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase text-[var(--muted)]">Check first</p>
                          <p className="mt-1 text-sm leading-6">{product.cons[0]}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase text-[var(--muted)]">Facts</p>
                          <p className="mt-1 text-sm leading-6">
                            {product.asin ? `ASIN ${product.asin}` : product.priceBand} · {product.category}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-start gap-2 md:justify-end">
                          <Link className="button-secondary" href={`/reviews/${product.slug}`}>
                            Notes
                          </Link>
                          {product.offers[0] ? <AffiliateButton site={site.key} product={product} offer={product.offers[0]} position={`roundup-table-${index + 1}`} /> : null}
                        </div>
                      </div>
                    ) : null,
                  )}
                </div>
              </section>
            ) : null}
            {roundup.decisionGuide?.length ? (
              <section className="panel p-5">
                <h2 className="text-xl font-bold">Quick picks by situation</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {roundup.decisionGuide.map((item) => (
                    <div className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-4" key={item.label}>
                      <h3 className="text-sm font-bold text-[var(--text)]">{item.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
            {picks.map((product, index) => product && <ProductCard key={product.slug} site={site} product={product} position={`roundup-${index + 1}`} />)}
            <section className="panel p-5">
              <h2 className="text-xl font-bold">FAQ</h2>
              <div className="mt-4 divide-y divide-[var(--border)]">
                {roundup.faqs.map((faq) => (
                  <div className="py-4" key={faq.question}>
                    <h3 className="font-bold">{faq.question}</h3>
                    <p className="mt-2 leading-7 text-[var(--muted)]">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
          <aside className="space-y-5">
            <MethodologyList items={roundup.methodology} />
            <div className="panel p-5">
              <h2 className="text-xl font-bold">Who this helps</h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">{roundup.intent}</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
