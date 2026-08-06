import { ArrowRight, CheckCircle2, Clock3, Layers3, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CostumeCatalogCard } from "@/components/CostumeCatalog";
import { JsonLd } from "@/components/JsonLd";
import { Disclosure } from "@/components/LayoutParts";
import { listCuratedCostumeProducts } from "@/lib/costume-catalog";
import {
  costumeHalloweenIdeas,
  costumeHalloweenIdeaSlugs,
  findCostumeHalloweenIdea,
  type HalloweenIdea,
} from "@/lib/costume-halloween-ideas";
import { findGuide } from "@/lib/content";
import { absoluteUrl, breadcrumbSchema, itemListSchema, pageMetadata } from "@/lib/seo";
import { getCurrentSite, type SiteConfig } from "@/lib/sites";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return costumeHalloweenIdeaSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const idea = findCostumeHalloweenIdea(slug);
  if (site.key !== "costume" || !idea) return {};

  return pageMetadata(
    site,
    `/halloween-ideas/${slug}`,
    idea.seoTitle,
    idea.dek,
    "/images/affiliate/hero-halloween-costume-studio-v1.webp",
  );
}

function ideaArticleSchema(site: SiteConfig, idea: HalloweenIdea) {
  const url = absoluteUrl(site, `/halloween-ideas/${idea.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: idea.seoTitle,
    description: idea.dek,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: "Halloween ideas",
    dateModified: "2026-07-29T00:00:00.000Z",
    image: absoluteUrl(site, "/images/affiliate/hero-halloween-costume-studio-v1.webp"),
    author: {
      "@type": "Organization",
      name: `${site.name} editorial desk`,
      url: absoluteUrl(site, "/about"),
    },
    publisher: {
      "@type": "Organization",
      name: site.name,
      url: site.domain,
    },
  };
}

function ideaFaqSchema(idea: HalloweenIdea) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: idea.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export default async function HalloweenIdeaPage({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const idea = findCostumeHalloweenIdea(slug);
  if (site.key !== "costume" || !idea) notFound();

  const productSlugs = [...new Set(idea.layers.flatMap((layer) => layer.productSlugs))];
  const products = await listCuratedCostumeProducts(productSlugs);
  const productBySlug = new Map(products.map((product) => [product.slug, product]));
  const relatedGuides = idea.relatedGuides
    .map((guideSlug) => findGuide("costume", guideSlug))
    .filter((guide): guide is NonNullable<typeof guide> => Boolean(guide));

  return (
    <main>
      <JsonLd data={breadcrumbSchema(site, [
        { name: "Home", path: "/" },
        { name: "Halloween ideas", path: "/halloween-ideas" },
        { name: idea.title, path: `/halloween-ideas/${idea.slug}` },
      ])} />
      <JsonLd data={ideaArticleSchema(site, idea)} />
      <JsonLd data={ideaFaqSchema(idea)} />
      {products.length ? <JsonLd data={itemListSchema(
        site,
        `${idea.title} product layers`,
        products.map((product) => ({ name: product.title, path: `/products/${product.slug}` })),
      )} /> : null}

      <section className="section bg-[#170f20] text-white">
        <div className="shell">
          <Link className="text-xs font-black uppercase tracking-[0.14em] text-[#ffc56d] hover:underline" href="/halloween-ideas">Halloween editorial kits</Link>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-white sm:text-6xl">{idea.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/82">{idea.dek}</p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-white/65">
            <span>Prepared by the {site.name} editorial desk</span>
            <span>Updated {idea.updatedAt}</span>
            <span>{products.length ? `${products.length} exact products currently connected` : "Product connections refresh with current retailer data"}</span>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
          <article>
            <p className="eyebrow">The opening scene</p>
            <h2 className="mt-3 text-3xl font-black">Start with a story that makes every object necessary.</h2>
            <p className="mt-5 text-lg leading-9 text-[var(--muted)]">{idea.openingScene}</p>
          </article>
          <aside className="rounded-md border border-[#d7b58a] bg-[#fff8ee] p-6">
            <Layers3 aria-hidden="true" className="text-[#a14f1c]" size={24} />
            <h2 className="mt-4 text-xl font-bold">Design rule</h2>
            <p className="mt-3 leading-7 text-[var(--muted)]">{idea.designRule}</p>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <p className="eyebrow">Build the kit in layers</p>
          <h2 className="mt-3 max-w-3xl text-3xl font-black sm:text-4xl">Give every purchase one clear job.</h2>
          <p className="mt-4 max-w-3xl leading-8 text-[var(--muted)]">
            These are independent editorial combinations, not retailer-created bundles. Start with one complete layer and add another only when it improves the story and fits the real venue.
          </p>
          <div className="mt-9 space-y-10">
            {idea.layers.map((layer, layerIndex) => {
              const layerProducts = layer.productSlugs
                .map((productSlug) => productBySlug.get(productSlug))
                .filter((product): product is NonNullable<typeof product> => Boolean(product));

              return (
                <article className="border-t border-[var(--border)] pt-8" key={layer.label}>
                  <div className="grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
                    <div>
                      <p className="eyebrow">Layer {layerIndex + 1}</p>
                      <h3 className="mt-3 text-2xl font-black">{layer.label}</h3>
                      <p className="mt-3 leading-7 text-[var(--muted)]">{layer.objective}</p>
                      <h4 className="mt-5 font-bold">Add from home</h4>
                      <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{layer.addFromHome}</p>
                      <div className="mt-5 rounded-md border border-[#e3c3b5] bg-[#fff7f3] p-4">
                        <p className="flex items-center gap-2 text-sm font-bold text-[#7a3115]"><ShieldAlert aria-hidden="true" size={17} /> Check before using</p>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{layer.caution}</p>
                      </div>
                    </div>
                    {layerProducts.length ? (
                      <div className={`grid gap-5 ${layerProducts.length > 1 ? "md:grid-cols-2" : "max-w-md"}`}>
                        {layerProducts.map((product) => <CostumeCatalogCard key={product.id} product={product} retailerCta />)}
                      </div>
                    ) : (
                      <div className="panel p-6">
                        <h4 className="text-xl font-bold">Use the planning layer while current retailer data reconnects.</h4>
                        <p className="mt-3 leading-7 text-[var(--muted)]">The story, route, and safety checks remain useful even when a seasonal item changes.</p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell">
          <p className="eyebrow">Choose the smallest complete version</p>
          <h2 className="mt-3 text-3xl font-black">Three ways to build the same story</h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {idea.paths.map((path) => (
              <article className="panel p-5" key={path.label}>
                <p className="eyebrow">{path.label}</p>
                <h3 className="mt-3 text-lg font-bold">Best for: {path.bestFor}</h3>
                <p className="mt-3 leading-7 text-[var(--muted)]">{path.plan}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <Clock3 aria-hidden="true" className="text-[var(--brand)]" size={24} />
            <h2 className="mt-4 text-3xl font-black">Build order</h2>
            <ol className="mt-6 space-y-5">
              {idea.buildOrder.map((step, index) => (
                <li className="flex gap-4" key={step.label}>
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--brand-soft)] font-black text-[var(--brand-strong)]">{index + 1}</span>
                  <div>
                    <h3 className="font-bold">{step.label}</h3>
                    <p className="mt-1 leading-7 text-[var(--muted)]">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <CheckCircle2 aria-hidden="true" className="text-[var(--brand)]" size={24} />
            <h2 className="mt-4 text-3xl font-black">Event-night checklist</h2>
            <ul className="mt-6 space-y-4">
              {idea.checklist.map((item) => (
                <li className="flex gap-3 leading-7 text-[var(--muted)]" key={item}>
                  <CheckCircle2 aria-hidden="true" className="mt-1 shrink-0 text-[var(--brand)]" size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="shell max-w-4xl">
          <p className="eyebrow">Questions this recipe should answer</p>
          <h2 className="mt-3 text-3xl font-black">Frequently asked questions</h2>
          <div className="mt-7 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {idea.faqs.map((faq) => (
              <article className="py-6" key={faq.question}>
                <h3 className="text-xl font-bold">{faq.question}</h3>
                <p className="mt-3 leading-8 text-[var(--muted)]">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="grid gap-5 md:grid-cols-3">
            {relatedGuides.map((guide) => (
              <Link className="panel p-5" href={`/guides/${guide.slug}`} key={guide.slug}>
                <p className="eyebrow">Related planning guide</p>
                <h2 className="mt-3 text-lg font-bold">{guide.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{guide.dek}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-strong)]">Open guide <ArrowRight aria-hidden="true" size={16} /></span>
              </Link>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {costumeHalloweenIdeas
              .filter((otherIdea) => otherIdea.slug !== idea.slug)
              .map((otherIdea) => (
                <Link className="rounded-md border border-[var(--border)] bg-white p-5" href={`/halloween-ideas/${otherIdea.slug}`} key={otherIdea.slug}>
                  <p className="eyebrow">Another distinct Halloween recipe</p>
                  <h2 className="mt-3 text-lg font-bold">{otherIdea.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{otherIdea.dek}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-strong)]">Compare the scene plan <ArrowRight aria-hidden="true" size={16} /></span>
                </Link>
              ))}
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_.72fr]">
            <div className="panel p-6">
              <h2 className="text-2xl font-bold">Keep exploring the Halloween plan</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link className="button-primary" href="/halloween-ideas">See all editorial kits</Link>
                <Link className="button-secondary" href="/halloween">Open Halloween 2026</Link>
                <Link className="button-secondary" href="/catalog?occasion=halloween">Filter products</Link>
              </div>
            </div>
            <Disclosure site={site} />
          </div>
        </div>
      </section>
    </main>
  );
}
