import { CalendarClock, CheckCircle2, CircleDollarSign, PackageCheck } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { CostumeCatalogCard, CostumePurchaseState } from "@/components/CostumeCatalog";
import { costumeGuides } from "@/lib/costume-content";
import {
  findCostumeCatalogAlias,
  formatCostumePrice,
  getCostumeCatalogProduct,
  isCostumeProductIndexable,
  relatedCostumeCatalogProducts,
  type CostumeCatalogProduct,
} from "@/lib/costume-catalog";
import { costumeHalloweenPick } from "@/lib/costume-halloween";
import { absoluteUrl, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";

export const dynamic = "force-dynamic";

function cleanFeedText(value: string | null, limit = 700) {
  if (!value) return null;
  const clean = value.replace(/<[^>]*>/g, " ").replace(/&nbsp;|&#160;/g, " ").replace(/\s+/g, " ").trim();
  return clean.length > limit ? `${clean.slice(0, limit).trimEnd()}…` : clean;
}

function catalogBuyerJob(product: CostumeCatalogProduct) {
  if (product.editorial?.buyerJob) return product.editorial.buyerJob;
  if (product.categorySlug === "costumes") return "Confirm the exact variant, included pieces, measurements, movement, event timing, and return path before choosing a size.";
  if (product.categorySlug === "props-animatronics") return "Confirm dimensions, weight, material, venue rules, power, setup, transport, and storage before treating the prop as event-ready.";
  if (product.categorySlug === "masks-prosthetics") return "Confirm fit, visibility, ventilation, skin-contact materials, application, removal, and realistic wear time.";
  if (product.categorySlug === "wigs-makeup") return "Confirm fit, fiber or material, heat limits, compatible products, touch-ups, removal, cleaning, and storage.";
  return "Confirm quantity, dimensions, power or consumables, setup time, cleanup, delivery, and repeat-use value for the intended event.";
}

function catalogGuidance(product: CostumeCatalogProduct) {
  const value = product.editorial?.guidance;
  if (!value || Array.isArray(value) || typeof value !== "object") return null;
  const bestFor = typeof value.bestFor === "string" ? value.bestFor : null;
  const skipIf = typeof value.skipIf === "string" ? value.skipIf : null;
  const confirmBeforeOrdering = Array.isArray(value.confirmBeforeOrdering)
    ? value.confirmBeforeOrdering.filter((item): item is string => typeof item === "string")
    : [];
  return bestFor || skipIf || confirmBeforeOrdering.length ? { bestFor, skipIf, confirmBeforeOrdering } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  if (site.key !== "costume") return {};
  const catalogProduct = await getCostumeCatalogProduct(slug) ?? await findCostumeCatalogAlias(slug);
  if (catalogProduct) {
    const halloweenPick = costumeHalloweenPick(catalogProduct.slug);
    const metadata = pageMetadata(
      site,
      `/products/${catalogProduct.slug}`,
      halloweenPick
        ? `${catalogProduct.title}: Halloween Fit and Setup Checks`
        : `${catalogProduct.title}: Price, Availability, and Buying Checks`,
      catalogProduct.editorial?.summary ?? cleanFeedText(catalogProduct.description, 155) ?? `Check current price, availability, audience, fit, and buying considerations for ${catalogProduct.title}.`,
    );
    return {
      ...metadata,
      robots: isCostumeProductIndexable(catalogProduct)
        ? { index: true, follow: true }
        : { index: false, follow: true },
    };
  }
  return {};
}

export default async function CostumeProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  if (site.key !== "costume") notFound();
  const catalogProduct = await getCostumeCatalogProduct(slug);
  if (!catalogProduct) {
    const alias = await findCostumeCatalogAlias(slug);
    if (alias) redirect(`/products/${alias.slug}`);
    notFound();
  }
  if (catalogProduct) {
    const halloweenPick = costumeHalloweenPick(catalogProduct.slug);
    const category = site.categories.find((item) => item.slug === catalogProduct.categorySlug);
    const relatedGuides = costumeGuides.filter((guide) => guide.category === catalogProduct.categorySlug).slice(0, 3);
    const relatedProducts = await relatedCostumeCatalogProducts(catalogProduct);
    const feedDescription = cleanFeedText(catalogProduct.description);
    const buyerJob = catalogBuyerJob(catalogProduct);
    const guidance = catalogGuidance(catalogProduct);
    const indexable = isCostumeProductIndexable(catalogProduct);
    const currentChecks = [
      "Exact product, variant, and included pieces",
      "Current price, stock, shipping, and return terms",
      "Measurements, included pieces, materials, or dimensions",
      "Event fit, setup, movement, care, transport, and storage",
    ];

    return (
      <main className="section">
        <JsonLd data={breadcrumbSchema(site, [
          { name: "Home", path: "/" },
          ...(halloweenPick
            ? [{ name: "Halloween 2026", path: "/halloween" }]
            : [{ name: "Catalog", path: "/catalog" }]),
          ...(category ? [{ name: category.name, path: `/categories/${category.slug}` }] : []),
          { name: catalogProduct.title, path: `/products/${catalogProduct.slug}` },
        ])} />
        {indexable && catalogProduct.price && catalogProduct.authorizedImage ? (
          <JsonLd data={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: catalogProduct.title,
            description: catalogProduct.editorial?.summary ?? feedDescription ?? buyerJob,
            image: [catalogProduct.authorizedImage.url],
            category: category?.name ?? catalogProduct.categorySlug,
            ...(catalogProduct.brand ? { brand: { "@type": "Brand", name: catalogProduct.brand } } : {}),
            offers: {
              "@type": "Offer",
              url: absoluteUrl(site, `/products/${catalogProduct.slug}`),
              price: catalogProduct.price,
              priceCurrency: catalogProduct.currency,
              availability: catalogProduct.availability === "in stock" ? "https://schema.org/InStock" : "https://schema.org/LimitedAvailability",
              itemCondition: "https://schema.org/NewCondition",
              seller: { "@type": "Organization", name: "Abracadabra NYC" },
            },
          }} />
        ) : null}
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,.65fr)]">
            <article>
              <div className="flex flex-wrap gap-2">
                {halloweenPick ? <span className="costume-chip !bg-[#a14f1c]">Halloween edit · {halloweenPick.collection}</span> : null}
                {catalogProduct.premium ? <span className="costume-chip !bg-[var(--brand-strong)]">$1,000+ Premium</span> : null}
                {catalogProduct.professional ? <span className="costume-chip !bg-[var(--brand-strong)]">Professional</span> : null}
                {catalogProduct.halloween ? <span className="costume-chip !bg-[var(--brand-strong)]">Halloween</span> : null}
                {catalogProduct.rental ? <span className="costume-chip !bg-[var(--brand-strong)]">Rental</span> : null}
              </div>
              <p className="eyebrow mt-5">{catalogProduct.brand || catalogProduct.productType || "Abracadabra NYC"}</p>
              <h1 className="mt-3 text-4xl font-black leading-tight">{catalogProduct.title}</h1>
              <div className="mt-4 lg:hidden" aria-label="First-screen mobile purchase path" data-first-viewport-commerce="true">
                <CostumePurchaseState product={catalogProduct} firstViewport />
              </div>
              <p className="mt-5 text-xl font-black text-[var(--brand-strong)]">{formatCostumePrice(catalogProduct)}</p>
              {catalogProduct.authorizedImage ? (
                <figure className="mt-8 overflow-hidden rounded-md border border-[var(--border)] bg-white p-4">
                  {/* The URL is rights-gated in PostgreSQL and can come from different authorized CJ/Abracadabra CDNs. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={catalogProduct.authorizedImage.altText || catalogProduct.title}
                    className="mx-auto max-h-[560px] w-full object-contain"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    src={catalogProduct.authorizedImage.url}
                  />
                </figure>
              ) : (
                <section className="costume-card-art mt-8 min-h-64 rounded-md p-6 text-white" aria-label="Product image unavailable">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-white/70">Image unavailable</p>
                  <p className="mt-24 max-w-xl text-2xl font-black">Use the product name and current details below to compare this option.</p>
                </section>
              )}
              <section className="mt-9">
                <p className="eyebrow">The buyer&apos;s job</p>
                <h2 className="mt-3 text-2xl font-bold">What to verify for this exact product</h2>
                <p className="mt-4 text-lg leading-8 text-[var(--muted)]">{buyerJob}</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {currentChecks.map((check) => (
                    <div className="panel flex gap-3 p-4" key={check}>
                      <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--brand)]" size={19} />
                      <span className="font-semibold leading-6">{check}</span>
                    </div>
                  ))}
                </div>
              </section>
              {guidance ? (
                <section className="mt-9 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-5">
                  <p className="eyebrow">Editorial buying notes</p>
                  <h2 className="mt-3 text-2xl font-bold">Where this option may fit—and what can rule it out</h2>
                  {guidance.bestFor ? <p className="mt-4 leading-8 text-[var(--muted)]"><strong className="text-[var(--text)]">Best suited to:</strong> {guidance.bestFor}.</p> : null}
                  {guidance.confirmBeforeOrdering.length ? (
                    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                      {guidance.confirmBeforeOrdering.map((check) => <li className="rounded-md bg-white p-4 text-sm font-semibold leading-6" key={check}>{check}</li>)}
                    </ul>
                  ) : null}
                  {guidance.skipIf ? <p className="mt-5 text-sm leading-7 text-[var(--muted)]"><strong className="text-[var(--text)]">Skip it when:</strong> {guidance.skipIf.replace(/^Skip this option if\s+/i, "")}</p> : null}
                </section>
              ) : null}
              {feedDescription ? (
                <section className="mt-9">
                  <p className="eyebrow">Product information</p>
                  <h2 className="mt-3 text-2xl font-bold">Details supplied by Abracadabra NYC</h2>
                  <p className="mt-4 leading-8 text-[var(--muted)]">{feedDescription}</p>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Merchant-supplied details can change. Open the exact retailer page to compare the live price, availability, delivery, variant, and return terms.</p>
                </section>
              ) : null}
              <section className="mt-9 rounded-md border border-[var(--border)] bg-white p-5">
                <h2 className="text-2xl font-bold">Current product details</h2>
                <dl className="mt-4 divide-y divide-[var(--border)] text-sm">
                  <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Merchant</dt><dd className="font-bold">Abracadabra NYC via CJ</dd></div>
                  <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Product type</dt><dd className="font-bold">{category?.name || catalogProduct.categorySlug.replaceAll("-", " ")}</dd></div>
                  <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Price</dt><dd className="font-bold">{formatCostumePrice(catalogProduct)}</dd></div>
                  <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Availability</dt><dd className="font-bold capitalize">{catalogProduct.availability}</dd></div>
                  <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Audience</dt><dd className="font-bold">{catalogProduct.audience.length ? catalogProduct.audience.join(" · ") : "Not specified by the retailer"}</dd></div>
                  <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Information checked</dt><dd className="font-bold">{catalogProduct.lastSeenAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</dd></div>
                  <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Research basis</dt><dd className="font-bold">Authorized merchant-feed specifications with editorial buying checks</dd></div>
                </dl>
              </section>
            </article>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <div className="hidden lg:block" aria-label="First-screen desktop purchase path" data-first-viewport-commerce="true">
                <CostumePurchaseState product={catalogProduct} firstViewport />
              </div>
              <div className="panel p-5">
                <PackageCheck aria-hidden="true" className="text-[var(--brand)]" size={22} />
                <h2 className="mt-4 text-xl font-bold">Before you order</h2>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--muted)]">
                  <li>Confirm the exact size, variant, and included pieces.</li>
                  <li>Recheck price, stock, shipping, and return terms.</li>
                  <li>Measure the wearer, venue, route, or storage space as needed.</li>
                  <li>Plan fitting, setup, movement, removal, cleanup, and care.</li>
                </ul>
              </div>
              {catalogProduct.premium || catalogProduct.professional ? (
                <Link className="costume-premium-panel block p-5" href="/premium">
                  <CircleDollarSign aria-hidden="true" className="text-[#f4d79b]" size={22} />
                  <h2 className="mt-4 text-xl font-bold text-white">Premium & Professional edit</h2>
                  <p className="mt-2 text-sm leading-6 text-white/75">Compare repeat use, construction, alteration, transport, care, and storage before paying more.</p>
                </Link>
              ) : null}
              {halloweenPick ? (
                <Link className="panel block p-5" href="/halloween">
                  <CalendarClock aria-hidden="true" className="text-[#a14f1c]" size={22} />
                  <h2 className="mt-4 text-xl font-bold">Halloween 2026 edit</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Return to the selected costumes, masks, haunted props, decorations, and ordering timeline.</p>
                </Link>
              ) : null}
            </aside>
          </div>

          {relatedProducts.length ? (
            <section className="mt-12 border-t border-[var(--border)] pt-10">
              <p className="eyebrow">Related products</p>
              <h2 className="mt-3 text-3xl font-black">Compare nearby options</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {relatedProducts.map((product) => <CostumeCatalogCard key={product.id} product={product} />)}
              </div>
            </section>
          ) : null}

          {relatedGuides.length ? (
            <section className="mt-12 border-t border-[var(--border)] pt-10">
              <p className="eyebrow">Related guides</p>
              <h2 className="mt-3 text-3xl font-black">Resolve the surrounding decisions</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {relatedGuides.map((guide) => (
                  <Link className="panel p-5" href={`/guides/${guide.slug}`} key={guide.slug}>
                    <h3 className="text-xl font-bold">{guide.title}</h3>
                    <p className="mt-3 leading-7 text-[var(--muted)]">{guide.dek}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
    );
  }
}
