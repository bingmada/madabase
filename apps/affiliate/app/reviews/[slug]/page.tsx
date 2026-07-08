import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateButton, AffiliateButtonGroup } from "@/components/AffiliateButton";
import { JsonLd } from "@/components/JsonLd";
import { Disclosure } from "@/components/LayoutParts";
import { StyleProductPage } from "@/components/StyleExperience";
import { findProduct, siteGuides, siteProducts, siteRoundups } from "@/lib/content";
import { breadcrumbSchema, pageMetadata, productNotesSchema } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";

function siteContext(siteKey: string) {
  if (siteKey === "pet") return "pet-care routine";
  if (siteKey === "baby") return "baby-care routine";
  if (siteKey === "network") return "home-network setup";
  if (siteKey === "smarthome") return "smart-home setup";
  return "home-office setup";
}

function beforeYouBuyChecks(siteKey: string) {
  if (siteKey === "pet") {
    return [
      "Confirm size, food or filter compatibility, cleaning steps, and recurring replacement costs.",
      "Check the exact retailer listing, seller, return window, and current model before ordering.",
      "Treat feeding, monitoring, odor, and air-quality products as support for daily care—not substitutes for it.",
    ];
  }
  if (siteKey === "baby") {
    return [
      "Read the current manufacturer instructions and confirm every age, weight, position, and safe-use limit.",
      "Check the exact retailer listing, seller, included accessories, return window, and current model before ordering.",
      "Make sure the product fits the family's real cleaning, storage, charging, and travel routine.",
    ];
  }
  if (siteKey === "network") {
    return [
      "Confirm the exact hardware version, pack quantity, port speeds, regional model, and current firmware support.",
      "Check the retailer listing, seller, return window, and whether subscriptions change any advertised feature.",
      "Map placement, Ethernet backhaul, client support, and the actual internet bottleneck before upgrading.",
    ];
  }
  if (siteKey === "smarthome") {
    return [
      "Confirm the exact model, region, wiring or door fit, required hub, and supported ecosystem before ordering.",
      "Check the retailer listing, seller, bundle contents, return window, and subscription boundaries.",
      "Keep a dependable local fallback for entry, climate, cameras, and essential automations.",
    ];
  }
  return [
    "Measure the room, desk edge, chair path, monitor position, cable travel, and outlet location before ordering.",
    "Confirm the exact retailer listing, seller, configuration, dimensions, return window, and warranty path.",
    "For body- or equipment-fit products, keep the packaging until the complete workstation has been tested.",
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const product = findProduct(site.key, slug);
  if (!product) return {};
  return pageMetadata(site, `/reviews/${slug}`, product.seoTitle ?? `${product.amazonTitle ?? product.name} Buying Notes`, product.summary, product.amazonImage ?? product.image);
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
  const category = site.categories.find((item) => item.slug === product.category);
  const comparisonProducts = (product.compareSlugs ?? [])
    .map((comparisonSlug) => findProduct(site.key, comparisonSlug))
    .filter(Boolean);
  const relatedRoundups = siteRoundups(site.key)
    .filter((roundup) => roundup.productSlugs.includes(product.slug))
    .slice(0, 6);
  const relatedGuides = siteGuides(site.key)
    .filter((guide) => guide.relatedProducts?.includes(product.slug))
    .slice(0, 6);

  const context = siteContext(site.key);
  const primaryOffers = product.offers.slice(0, 2);
  const hasSpecificSkipSection = product.editorialSections?.some((section) => section.heading.toLowerCase().includes("who should skip"));
  const purchaseChecks = beforeYouBuyChecks(site.key);
  if (site.key === "style") {
    const related = siteProducts(site.key)
      .filter((item) => item.category === product.category && item.slug !== product.slug)
      .reverse()
      .slice(0, 6);
    return (
      <>
        <JsonLd
          data={breadcrumbSchema(site, [
            { name: "Home", path: "/" },
            ...(category ? [{ name: category.name, path: `/categories/${category.slug}` }] : []),
            { name: product.name, path: `/reviews/${slug}` },
          ])}
        />
        <JsonLd data={productNotesSchema(site, product)} />
        <StyleProductPage site={site} product={product} related={related} />
      </>
    );
  }

  return (
    <main className="section">
      <JsonLd
        data={breadcrumbSchema(site, [
          { name: "Home", path: "/" },
          ...(category ? [{ name: category.name, path: `/categories/${category.slug}` }] : []),
          { name: product.name, path: `/reviews/${slug}` },
        ])}
      />
      <JsonLd data={productNotesSchema(site, product)} />
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <article>
            <div className="flex flex-wrap items-center gap-3">
              <p className="eyebrow">{product.brand}</p>
              {category ? (
                <Link className="text-xs font-bold uppercase text-[var(--brand-strong)] hover:underline" href={`/categories/${category.slug}`}>
                  {category.name}
                </Link>
              ) : null}
            </div>
            <h1 className="mt-3 text-4xl font-black leading-tight">{product.seoTitle ?? `${displayName} Buying Notes`}</h1>
            <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{product.summary}</p>
            {product.updatedAt ? (
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-[var(--muted)]">
                <span>Prepared by the {site.name} editorial desk</span>
                <span>Updated {product.updatedAt}</span>
              </div>
            ) : null}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-md bg-[var(--brand-soft)] px-3 py-2 font-semibold text-[var(--brand-strong)]">{product.bestFor}</span>
            </div>
            {primaryOffers.length ? (
              <div className="mt-5 rounded-md border border-[var(--border)] bg-white p-4 lg:hidden">
                <p className="text-xs font-bold uppercase text-[var(--muted)]">Check the exact configuration</p>
                <div className="mt-2 space-y-2 text-sm leading-6 text-[var(--muted)]">
                  {primaryOffers.map((offer) => (
                    <p key={offer.merchant}>
                      <span className="font-semibold text-[var(--text)]">{offer.merchant}:</span> {offer.priceNote}
                    </p>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <AffiliateButtonGroup site={site.key} product={product} position="review-mobile-intro" />
                </div>
              </div>
            ) : null}
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
              {product.editorialSections?.map((section) => (
                <section key={section.heading}>
                  <h2>{section.heading}</h2>
                  <p>{section.body}</p>
                </section>
              ))}
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
              {!hasSpecificSkipSection ? (
                <>
                  <h2>Who should skip it</h2>
                  <p>
                    Skip it if the trade-offs above touch your main use case. The better buy is usually the product whose size, setup, accessories, and return path match your situation.
                  </p>
                </>
              ) : null}
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
              {comparisonProducts.length ? (
                <>
                  <h2>Compare nearby options</h2>
                  <div className="not-prose grid gap-4 sm:grid-cols-2">
                    {comparisonProducts.map((comparison) =>
                      comparison ? (
                        <Link className="rounded-md border border-[var(--border)] bg-white p-5" href={`/reviews/${comparison.slug}`} key={comparison.slug}>
                          <p className="text-xs font-bold uppercase text-[var(--muted)]">{comparison.brand}</p>
                          <h3 className="mt-2 font-bold">{comparison.name}</h3>
                          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{comparison.bestFor}</p>
                        </Link>
                      ) : null,
                    )}
                  </div>
                </>
              ) : null}
              {relatedGuides.length ? (
                <>
                  <h2>Related setup guides</h2>
                  <div className="not-prose grid gap-4 sm:grid-cols-2">
                    {relatedGuides.map((guide) => (
                      <Link className="rounded-md border border-[var(--border)] bg-white p-5" href={`/guides/${guide.slug}`} key={guide.slug}>
                        <p className="text-xs font-bold uppercase text-[var(--muted)]">{guide.category}</p>
                        <h3 className="mt-2 font-bold">{guide.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{guide.dek}</p>
                      </Link>
                    ))}
                  </div>
                </>
              ) : null}
              {relatedRoundups.length ? (
                <>
                  <h2>Comparisons featuring this product</h2>
                  <div className="not-prose grid gap-4 sm:grid-cols-2">
                    {relatedRoundups.map((roundup) => (
                      <Link className="rounded-md border border-[var(--border)] bg-white p-5" href={`/best/${roundup.slug}`} key={roundup.slug}>
                        <p className="text-xs font-bold uppercase text-[var(--muted)]">Comparison</p>
                        <h3 className="mt-2 font-bold">{roundup.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{roundup.dek}</p>
                      </Link>
                    ))}
                  </div>
                </>
              ) : null}
              <h2>Before you buy</h2>
              <ul>
                {purchaseChecks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
                <li>Use recent owner feedback to look for recurring quality-control issues after confirming the exact model.</li>
                <li>Our Amazon links may earn commission from qualifying purchases, at no extra cost to you.</li>
              </ul>
              {product.sources?.length ? (
                <>
                  <h2>Primary sources</h2>
                  <ul>
                    {product.sources.map((source) => (
                      <li key={source.url}>
                        <a href={source.url} rel="noopener noreferrer" target="_blank">{source.name}</a>
                        {source.note ? ` — ${source.note}` : ""}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </article>
          <aside className="space-y-5">
            <Disclosure site={site} />
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
            <div className="panel p-5">
              <h2 className="text-xl font-bold">Decision factors</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Use these factors to compare the product with nearby alternatives.</p>
              <ul className="mt-4 space-y-3 text-sm font-semibold">
                {product.scores.map((score) => (
                  <li className="rounded-md bg-[var(--surface-muted)] px-3 py-2" key={score.label}>{score.label}</li>
                ))}
              </ul>
            </div>
            <div className="panel p-5">
              <h2 className="text-xl font-bold">Specs</h2>
              <dl className="mt-4 divide-y divide-[var(--border)]">
                {Object.entries(product.specs)
                  .filter(([key]) => key !== "Link status")
                  .map(([key, value]) => (
                  <div className="flex justify-between gap-4 py-3 text-sm" key={key}>
                    <dt className="font-semibold text-[var(--muted)]">{key}</dt>
                    <dd className="text-right font-bold">{value}</dd>
                  </div>
                  ))}
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
