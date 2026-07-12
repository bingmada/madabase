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
import type { AffiliateOffer, Product } from "@/lib/types";

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

function listingVerificationRows(product: Product, displayName: string, offers: AffiliateOffer[]) {
  const asin = product.asin ?? product.specs.ASIN;
  const amazonOffer = offers.find((offer) => offer.merchant.toLowerCase().includes("amazon"));
  const modelOrPack = product.specs.Model ?? product.specs.Pack ?? product.specs["Product type"] ?? displayName;

  return [
    ["Amazon listing anchor", asin ? `ASIN ${asin}` : "Confirm ASIN on the live Amazon listing before purchase"],
    ["Listing title to match", displayName],
    ["Model or bundle", modelOrPack],
    ["Version risk", product.evidence[0] ?? "Confirm exact model, region, hardware revision, and included accessories"],
    ["Price handling", amazonOffer?.priceNote ?? offers[0]?.priceNote ?? "No exact Amazon price is copied; verify live price, coupon, seller, and return window"],
  ];
}

function updateRecord(product: Product, sourceCount: number, offers: AffiliateOffer[]) {
  return [
    ["Content updated", product.updatedAt ?? "Update date pending"],
    ["Official source links", sourceCount ? `${sourceCount} linked source${sourceCount === 1 ? "" : "s"}` : "No official source link stored yet"],
    ["Retail listing check", product.asin ?? product.specs.ASIN ? `Amazon ASIN ${product.asin ?? product.specs.ASIN}` : "ASIN still needs live listing confirmation"],
    ["Price policy", offers.length ? "Exact prices are not copied; merchant page controls final price and availability" : "Buying links are being refreshed"],
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
    .filter((comparison): comparison is Product => Boolean(comparison));
  const relatedRoundups = siteRoundups(site.key)
    .filter((roundup) => roundup.productSlugs.includes(product.slug))
    .slice(0, 6);
  const relatedGuides = siteGuides(site.key)
    .filter((guide) => guide.relatedProducts?.includes(product.slug))
    .slice(0, 6);

  const context = siteContext(site.key);
  const primaryOffers = product.offers.slice(0, 2);
  const sourceCount = product.sources?.length ?? 0;
  const listingRows = listingVerificationRows(product, displayName, primaryOffers);
  const updateRows = updateRecord(product, sourceCount, primaryOffers);
  const officialSpecRows = Object.entries(product.specs)
    .filter(([key, value]) => key !== "Link status" && Boolean(value))
    .slice(0, 8);
  const comparisonRows = [product, ...comparisonProducts].slice(0, 4);
  const decisionBranches = [
    ["Buy if", `Your priority is ${product.bestFor.toLowerCase()} and the exact listing matches the specs below.`],
    ["Skip if", product.cons[0] ?? "The main trade-off touches your most important use case."],
    ["Compare if", product.alternatives?.[0] ?? comparisonProducts[0]?.bestFor ?? "A nearby model fits the room, setup, or budget better."],
    ["Verify first", product.evidence[0] ?? "Confirm model, seller, bundle, and return path before checkout."],
  ];
  const evidenceSnapshot = [
    ["Updated", product.updatedAt ?? "Review schedule pending"],
    [
      "Source basis",
      sourceCount
        ? `${sourceCount} primary source${sourceCount === 1 ? "" : "s"} plus retailer listing checks`
        : "Retailer listing, current seller, and product details should be verified before purchase",
    ],
    ["Version risk", product.evidence[0] ?? "Confirm exact model, bundle, and hardware version before checkout"],
    ["Price or bundle risk", primaryOffers[0]?.priceNote ?? "Buying links are being updated; confirm seller and return window before purchase"],
  ];
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
        <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <article className="min-w-0">
            <div className="grid gap-7 md:grid-cols-[minmax(0,1fr)_minmax(250px,0.78fr)] md:items-start">
              <div>
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
                  <span className="rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm font-semibold text-[var(--muted)]">Price band: {product.priceBand}</span>
                  {primaryOffers.length ? (
                    <a className="button-secondary" href="#buying-options">
                      Check buying options
                    </a>
                  ) : null}
                </div>
                {primaryOffers.length ? (
                  <div className="mt-5 rounded-md border border-[var(--border)] bg-white p-4 md:hidden">
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
              </div>
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-[var(--surface-muted)]">
                  <Image className="object-cover" src={displayImage} alt={displayName} fill priority sizes="(min-width: 768px) 300px, 100vw" />
                </div>
                {displayImage.includes("-realistic.webp") ? (
                  <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
                    Editorial image for visual context; the linked listing may have a different product appearance or configuration.
                  </p>
                ) : null}
              </div>
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
              <div className="not-prose mt-5 rounded-md border border-[var(--border)] bg-white p-5">
                <h2 className="text-xl font-bold">Evidence snapshot</h2>
                <dl className="mt-4 divide-y divide-[var(--border)]">
                  {evidenceSnapshot.map(([label, value]) => (
                    <div className="grid gap-2 py-3 text-sm sm:grid-cols-[150px_1fr]" key={label}>
                      <dt className="font-semibold text-[var(--muted)]">{label}</dt>
                      <dd className="break-words font-semibold text-[var(--text)]">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="not-prose mt-5 grid min-w-0 gap-5 lg:grid-cols-2">
                <section className="min-w-0 rounded-md border border-[var(--border)] bg-white p-5">
                  <h2 className="text-xl font-bold">Amazon listing verification</h2>
                  <dl className="mt-4 divide-y divide-[var(--border)]">
                    {listingRows.map(([label, value]) => (
                      <div className="grid gap-2 py-3 text-sm sm:grid-cols-[140px_1fr]" key={label}>
                        <dt className="font-semibold text-[var(--muted)]">{label}</dt>
                        <dd className="break-words font-semibold text-[var(--text)]">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
                <section className="min-w-0 rounded-md border border-[var(--border)] bg-white p-5">
                  <h2 className="text-xl font-bold">Update record</h2>
                  <dl className="mt-4 divide-y divide-[var(--border)]">
                    {updateRows.map(([label, value]) => (
                      <div className="grid gap-2 py-3 text-sm sm:grid-cols-[140px_1fr]" key={label}>
                        <dt className="font-semibold text-[var(--muted)]">{label}</dt>
                        <dd className="break-words font-semibold text-[var(--text)]">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
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
              <div className="not-prose mt-5 grid min-w-0 gap-5 lg:grid-cols-2">
                <section className="min-w-0 rounded-md border border-[var(--border)] bg-white p-5">
                  <h2 className="text-xl font-bold">Official specs referenced</h2>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[420px] text-left text-sm">
                      <thead className="text-xs uppercase text-[var(--muted)]">
                        <tr>
                          <th className="border-b border-[var(--border)] pb-2 pr-4">Spec</th>
                          <th className="border-b border-[var(--border)] pb-2">Value to verify</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        {officialSpecRows.map(([key, value]) => (
                          <tr key={key}>
                            <th className="py-3 pr-4 font-semibold text-[var(--muted)]">{key}</th>
                            <td className="py-3 font-bold text-[var(--text)]">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {product.sources?.length ? (
                    <div className="mt-4 space-y-2 text-sm leading-6 text-[var(--muted)]">
                      {product.sources.slice(0, 3).map((source) => (
                        <p key={source.url}>
                          <a className="font-bold text-[var(--brand-strong)] hover:underline" href={source.url} rel="noopener noreferrer" target="_blank">
                            {source.name}
                          </a>
                          {source.note ? `: ${source.note}` : ""}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-4 text-sm leading-6 text-[var(--muted)]">Official source link is pending; confirm the manufacturer page before relying on a retail listing.</p>
                  )}
                </section>
                <section className="min-w-0 rounded-md border border-[var(--border)] bg-white p-5">
                  <h2 className="text-xl font-bold">Fit / skip decision tree</h2>
                  <div className="mt-4 grid gap-3">
                    {decisionBranches.map(([label, detail]) => (
                      <div className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-4" key={label}>
                        <h3 className="text-sm font-bold uppercase text-[var(--muted)]">{label}</h3>
                        <p className="mt-2 text-sm font-semibold leading-6 text-[var(--text)]">{detail}</p>
                      </div>
                    ))}
                  </div>
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
                  <div className="not-prose overflow-x-auto rounded-md border border-[var(--border)] bg-white">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="bg-[var(--surface-muted)] text-xs uppercase text-[var(--muted)]">
                        <tr>
                          <th className="px-4 py-3">Product</th>
                          <th className="px-4 py-3">Best for</th>
                          <th className="px-4 py-3">Check first</th>
                          <th className="px-4 py-3">Price band</th>
                          <th className="px-4 py-3">Listing anchor</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border)]">
                        {comparisonRows.map((item) => (
                          <tr key={item.slug}>
                            <th className="px-4 py-4 font-bold">
                              <Link className="hover:text-[var(--brand-strong)] hover:underline" href={`/reviews/${item.slug}`}>
                                {item.amazonTitle ?? item.name}
                              </Link>
                            </th>
                            <td className="px-4 py-4 text-[var(--muted)]">{item.bestFor}</td>
                            <td className="px-4 py-4 text-[var(--muted)]">{item.cons[0]}</td>
                            <td className="px-4 py-4 font-bold">{item.priceBand}</td>
                            <td className="px-4 py-4 text-[var(--muted)]">{item.asin ? `ASIN ${item.asin}` : item.category}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="not-prose mt-4 grid gap-4 sm:grid-cols-2">
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
              <h2>Version and price risk</h2>
              <p>
                Treat the exact listing as part of the product. Confirm the model number, hardware revision, included accessories, seller, coupon state, and return path before checkout.
                {primaryOffers[0]?.priceNote ? ` Current link note: ${primaryOffers[0].priceNote}` : ""}
              </p>
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
          <aside className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:self-start">
            <Disclosure site={site} />
            <div className="panel p-5" id="buying-options">
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
