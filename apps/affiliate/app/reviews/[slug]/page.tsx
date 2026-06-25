import Image from "next/image";
import { notFound } from "next/navigation";
import { AffiliateButton } from "@/components/AffiliateButton";
import { JsonLd } from "@/components/JsonLd";
import { Disclosure } from "@/components/LayoutParts";
import { findProduct } from "@/lib/content";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";

function siteContext(siteKey: string) {
  if (siteKey === "pet") return "pet-care routine";
  if (siteKey === "baby") return "baby-care routine";
  return "home-office setup";
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const product = findProduct(site.key, slug);
  if (!product) return {};
  return pageMetadata(site, `/reviews/${slug}`, `${product.amazonTitle ?? product.name} Buying Notes`, product.summary, product.amazonImage ?? product.image);
}

export default async function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const product = findProduct(site.key, slug);
  if (!product) notFound();
  const displayName = product.amazonTitle ?? product.name;
  const displayImage = product.amazonImage ?? product.image;
  const productFacts = [
    ["Exact product", displayName],
    ["Brand", product.brand],
    ["Best use case", product.bestFor],
    ["Category", product.category],
    ["ASIN", product.asin ?? product.specs.ASIN ?? "Confirm on the current Amazon listing"],
    ["Price band", product.priceBand],
  ];
  const compatibilityChecks = product.evidence.slice(0, 5);

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: displayName,
    brand: { "@type": "Brand", name: product.brand },
    sku: product.asin,
    image: displayImage,
    description: product.summary,
  };

  const context = siteContext(site.key);

  return (
    <main className="section">
      <JsonLd data={breadcrumbSchema(site, [{ name: "Home", path: "/" }, { name: product.name, path: `/reviews/${slug}` }])} />
      <JsonLd data={productSchema} />
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <article>
            <p className="eyebrow">{product.brand}</p>
            <h1 className="mt-3 text-4xl font-black leading-tight">{displayName} Buying Notes</h1>
            <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{product.summary}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-md bg-[var(--accent-soft)] px-3 py-2 font-bold text-[var(--accent)]">
                Fit score: {product.rating} / 5
              </span>
              <span className="rounded-md bg-[var(--brand-soft)] px-3 py-2 font-semibold text-[var(--brand-strong)]">{product.bestFor}</span>
            </div>
            <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-md">
              <Image className="object-cover" src={displayImage} alt={displayName} fill priority sizes="(min-width: 1024px) 720px, 100vw" />
            </div>
            <div className="prose-lite mt-8">
              <div className="not-prose rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-5">
                <h2 className="text-xl font-bold">Quick verdict</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-[var(--muted)]">Best fit</p>
                    <p className="mt-1 font-semibold">{product.bestFor}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-[var(--muted)]">Main upside</p>
                    <p className="mt-1 font-semibold">{product.pros[0]}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-[var(--muted)]">Check first</p>
                    <p className="mt-1 font-semibold">{product.cons[0]}</p>
                  </div>
                </div>
              </div>
              <div className="not-prose mt-5 grid gap-5 lg:grid-cols-2">
                <section className="rounded-md border border-[var(--border)] bg-white p-5">
                  <h2 className="text-xl font-bold">Product facts</h2>
                  <dl className="mt-4 divide-y divide-[var(--border)]">
                    {productFacts.map(([label, value]) => (
                      <div className="grid grid-cols-[130px_1fr] gap-3 py-3 text-sm" key={label}>
                        <dt className="font-semibold text-[var(--muted)]">{label}</dt>
                        <dd className="font-bold text-[var(--text)]">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
                <section className="rounded-md border border-[var(--border)] bg-white p-5">
                  <h2 className="text-xl font-bold">Compatibility checks</h2>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
                    {compatibilityChecks.map((item) => (
                      <li className="flex gap-2" key={item}>
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
              <h2>Our take</h2>
              <p>
                {product.verdict ??
                  `This pick works best when the product's strengths match your ${context}. The notes below separate the main upside from the trade-offs so it is easier to compare with nearby alternatives.`}
              </p>
              {product.whyItMatters ? (
                <>
                  <h2>Why it matters</h2>
                  <p>{product.whyItMatters}</p>
                </>
              ) : null}
              <h2>Where it wins</h2>
              <ul>
                {(product.amazonFeatures?.length ? product.amazonFeatures.slice(0, 3) : product.pros).map((pro) => (
                  <li key={pro}>{pro}</li>
                ))}
              </ul>
              <h2>Trade-offs</h2>
              <ul>
                {product.cons.map((con) => (
                  <li key={con}>{con}</li>
                ))}
              </ul>
              <h2>What to verify</h2>
              <ul>
                {product.evidence.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <h2>Who should buy it</h2>
              <p>
                Consider {displayName} if your priority is {product.bestFor.toLowerCase()} and you want a product that fits your {context} without adding unnecessary complexity.
              </p>
              <h2>Who should skip it</h2>
              <p>
                Skip it if the trade-offs above touch your main use case. The better buy is usually the product whose size, setup, accessories, and return path match your situation.
              </p>
              {product.alternatives?.length ? (
                <>
                  <h2>Also compare</h2>
                  <ul>
                    {product.alternatives.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </>
              ) : null}
              <h2>Before you buy</h2>
              <ul>
                <li>Check the exact Amazon listing, seller, return window, and current dimensions before ordering.</li>
                <li>Compare the product specs against your room, device, pet, baby, size, or compatibility needs.</li>
                <li>Use Amazon customer reviews to spot recurring quality-control issues after you confirm the exact version and accessories.</li>
                <li>These notes focus on setup fit, listed specs, compatibility, and trade-offs so you can make a cleaner buying decision.</li>
                <li>Our Amazon links may earn commission from qualifying purchases, at no extra cost to you.</li>
              </ul>
            </div>
          </article>
          <aside className="space-y-5">
            <Disclosure site={site} />
            <div className="panel p-5">
              <h2 className="text-xl font-bold">Scorecard</h2>
              <div className="mt-4 space-y-4">
                {product.scores.map((score) => (
                  <div key={score.label}>
                    <div className="flex justify-between text-sm font-semibold">
                      <span>{score.label}</span>
                      <span>{score.value}/10</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-[var(--surface-muted)]">
                      <div className="h-2 rounded-full bg-[var(--brand)]" style={{ width: `${score.value * 10}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="panel p-5">
              <h2 className="text-xl font-bold">Specs</h2>
              <dl className="mt-4 divide-y divide-[var(--border)]">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div className="flex justify-between gap-4 py-3 text-sm" key={key}>
                    <dt className="font-semibold text-[var(--muted)]">{key}</dt>
                    <dd className="text-right font-bold">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="panel p-5">
              <h2 className="text-xl font-bold">Buying options</h2>
              <div className="mt-4 space-y-3">
                {product.offers.length === 0 ? <p className="text-sm leading-6 text-[var(--muted)]">Buying links are being updated.</p> : null}
                {product.offers.map((offer) => (
                  <div className="rounded-md border border-[var(--border)] p-3" key={offer.merchant}>
                    <p className="font-bold">{offer.merchant}</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">{offer.priceNote}</p>
                    <div className="mt-3">
                      <AffiliateButton site={site.key} product={product} offer={offer} position="review-sidebar" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
