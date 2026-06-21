import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Disclosure, MethodologyList, ProductCard } from "@/components/LayoutParts";
import { findRoundup, products } from "@/lib/content";
import { absoluteUrl, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";

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
  const picks = roundup.productSlugs.map((productSlug) => products.find((product) => product.site === site.key && product.slug === productSlug)).filter(Boolean);

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
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="space-y-5">
            <Disclosure site={site} />
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
