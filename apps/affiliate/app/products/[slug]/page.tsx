import { CheckCircle2, CircleDollarSign, Link2Off, PackageCheck } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { CostumeCatalogCard, CostumePurchaseState } from "@/components/CostumeCatalog";
import { costumeGuides, findCostumeProduct } from "@/lib/costume-content";
import {
  findCostumeCatalogAlias,
  formatCostumePrice,
  getCostumeCatalogProduct,
  relatedCostumeCatalogProducts,
  type CostumeCatalogProduct,
} from "@/lib/costume-catalog";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  if (site.key !== "costume") return {};
  const catalogProduct = await getCostumeCatalogProduct(slug) ?? await findCostumeCatalogAlias(slug);
  if (catalogProduct) {
    return pageMetadata(
      site,
      `/products/${catalogProduct.slug}`,
      `${catalogProduct.title}: Price, Availability, and Buying Checks`,
      catalogProduct.editorial?.summary ?? cleanFeedText(catalogProduct.description, 155) ?? `Check current Feed identity, price, availability, audience, and launch status for ${catalogProduct.title}.`,
    );
  }
  const product = findCostumeProduct(slug);
  if (!product) return {};

  return pageMetadata(site, `/products/${slug}`, `${product.name}: Fit and Buying Preview`, product.summary);
}

export default async function CostumeProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  if (site.key !== "costume") notFound();
  const catalogProduct = await getCostumeCatalogProduct(slug);
  if (!catalogProduct) {
    const alias = await findCostumeCatalogAlias(slug);
    if (alias) redirect(`/products/${alias.slug}`);
  }
  if (catalogProduct) {
    const category = site.categories.find((item) => item.slug === catalogProduct.categorySlug);
    const relatedGuides = costumeGuides.filter((guide) => guide.category === catalogProduct.categorySlug).slice(0, 3);
    const relatedProducts = await relatedCostumeCatalogProducts(catalogProduct);
    const feedDescription = cleanFeedText(catalogProduct.description);
    const buyerJob = catalogBuyerJob(catalogProduct);
    const currentChecks = [
      "Exact Feed product and variant identity",
      "Current price, stock, shipping, and return terms",
      "Measurements, included pieces, materials, or dimensions",
      "Written image permission and verified CJ attribution",
    ];

    return (
      <main className="section">
        <JsonLd data={breadcrumbSchema(site, [
          { name: "Home", path: "/" },
          { name: "Catalog", path: "/catalog" },
          ...(category ? [{ name: category.name, path: `/categories/${category.slug}` }] : []),
          { name: catalogProduct.title, path: `/products/${catalogProduct.slug}` },
        ])} />
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,.65fr)]">
            <article>
              <div className="flex flex-wrap gap-2">
                {catalogProduct.premium ? <span className="costume-chip !bg-[var(--brand-strong)]">$1,000+ Premium</span> : null}
                {catalogProduct.professional ? <span className="costume-chip !bg-[var(--brand-strong)]">Professional</span> : null}
                {catalogProduct.halloween ? <span className="costume-chip !bg-[var(--brand-strong)]">Halloween</span> : null}
                {catalogProduct.rental ? <span className="costume-chip !bg-[var(--brand-strong)]">Rental</span> : null}
              </div>
              <p className="eyebrow mt-5">{catalogProduct.brand || catalogProduct.productType || "Abracadabra NYC Feed product"}</p>
              <h1 className="mt-3 text-4xl font-black leading-tight">{catalogProduct.title}</h1>
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
                <section className="costume-card-art mt-8 min-h-64 rounded-md p-6 text-white" aria-label="Editorial placeholder; merchant image permission pending">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-white/70">Rights-gated placeholder</p>
                  <p className="mt-24 max-w-xl text-2xl font-black">The Feed image stays off this page until Abracadabra or CJ grants written public-use permission and the record stores that permission reference.</p>
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
              {feedDescription ? (
                <section className="mt-9">
                  <p className="eyebrow">Merchant Feed description</p>
                  <h2 className="mt-3 text-2xl font-bold">Source details to verify</h2>
                  <p className="mt-4 leading-8 text-[var(--muted)]">{feedDescription}</p>
                  <p className="mt-3 text-sm leading-6 text-[var(--muted)]">This is merchant-supplied Feed information, not a hands-on claim or independent endorsement.</p>
                </section>
              ) : null}
              <section className="mt-9 rounded-md border border-[var(--border)] bg-white p-5">
                <h2 className="text-2xl font-bold">Current Feed and launch status</h2>
                <dl className="mt-4 divide-y divide-[var(--border)] text-sm">
                  <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Merchant</dt><dd className="font-bold">Abracadabra NYC via CJ</dd></div>
                  <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Product type</dt><dd className="font-bold">{category?.name || catalogProduct.categorySlug.replaceAll("-", " ")}</dd></div>
                  <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Price</dt><dd className="font-bold">{formatCostumePrice(catalogProduct)}</dd></div>
                  <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Availability</dt><dd className="font-bold capitalize">{catalogProduct.availability}</dd></div>
                  <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Audience</dt><dd className="font-bold">{catalogProduct.audience.length ? catalogProduct.audience.join(" · ") : "Not specified in Feed"}</dd></div>
                  <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Feed checked</dt><dd className="font-bold">{catalogProduct.lastSeenAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</dd></div>
                  <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Evidence mode</dt><dd className="font-bold">Feed-backed research synthesis; no hands-on claim</dd></div>
                </dl>
              </section>
            </article>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <CostumePurchaseState product={catalogProduct} />
              <div className="panel p-5">
                <PackageCheck aria-hidden="true" className="text-[var(--brand)]" size={22} />
                <h2 className="mt-4 text-xl font-bold">Catalog launch gates</h2>
                <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--muted)]">
                  <li>Exact Feed product and variant identity</li>
                  <li>Current price and availability</li>
                  <li>Authorized image-use status</li>
                  <li>Distinct buyer guidance and internal links</li>
                  <li>Verified CJ redirect and local click record</li>
                </ul>
              </div>
              {catalogProduct.premium || catalogProduct.professional ? (
                <Link className="costume-premium-panel block p-5" href="/premium">
                  <CircleDollarSign aria-hidden="true" className="text-[#f4d79b]" size={22} />
                  <h2 className="mt-4 text-xl font-bold text-white">Premium & Professional edit</h2>
                  <p className="mt-2 text-sm leading-6 text-white/75">Compare repeat use, construction, alteration, transport, care, and storage before paying more.</p>
                </Link>
              ) : null}
            </aside>
          </div>

          {relatedProducts.length ? (
            <section className="mt-12 border-t border-[var(--border)] pt-10">
              <p className="eyebrow">Related Feed products</p>
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
  const product = findCostumeProduct(slug);
  if (!product) notFound();
  const category = site.categories.find((item) => item.slug === product.category);
  const relatedGuides = costumeGuides.filter((guide) => guide.category === product.category).slice(0, 3);

  return (
    <main className="section">
      <JsonLd data={breadcrumbSchema(site, [
        { name: "Home", path: "/" },
        ...(category ? [{ name: category.name, path: `/categories/${category.slug}` }] : []),
        { name: product.name, path: `/products/${product.slug}` },
      ])} />
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(300px,.65fr)]">
          <article>
            <p className="eyebrow">{product.typeLabel} · launch candidate</p>
            <h1 className="mt-3 text-4xl font-black leading-tight">{product.name}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">{product.summary}</p>
            <section className="costume-card-art mt-8 min-h-64 rounded-md p-6 text-white" aria-label="Editorial placeholder; merchant image permission pending">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-white/70">Editorial placeholder</p>
              <p className="mt-24 max-w-xl text-2xl font-black">Official product imagery stays off this preview until CJ feed terms or written authorization cover public use.</p>
            </section>
            <section className="mt-9">
              <p className="eyebrow">The buyer&apos;s job</p>
              <h2 className="mt-3 text-2xl font-bold">What this page must help decide</h2>
              <p className="mt-4 text-lg leading-8 text-[var(--muted)]">{product.buyerJob}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {product.checks.map((check) => (
                  <div className="panel flex gap-3 p-4" key={check}>
                    <CheckCircle2 aria-hidden="true" className="mt-0.5 shrink-0 text-[var(--brand)]" size={19} />
                    <span className="font-semibold leading-6">{check}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className="mt-9 rounded-md border border-[var(--border)] bg-white p-5">
              <h2 className="text-2xl font-bold">Identity and evidence status</h2>
              <dl className="mt-4 divide-y divide-[var(--border)] text-sm">
                <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Merchant</dt><dd className="font-bold">Abracadabra NYC</dd></div>
                <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Source status</dt><dd className="font-bold">{product.sourceIdentity}</dd></div>
                <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Price status</dt><dd className="font-bold">{product.observedPrice ? `${product.observedPrice} previously observed; current feed price pending` : "Current feed price pending"}</dd></div>
                <div className="grid gap-2 py-3 sm:grid-cols-[180px_1fr]"><dt className="font-semibold text-[var(--muted)]">Evidence mode</dt><dd className="font-bold">Editorial decision preview; no hands-on claim</dd></div>
              </dl>
            </section>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="panel p-5">
              <Link2Off aria-hidden="true" className="text-[var(--brand)]" size={22} />
              <h2 className="mt-4 text-xl font-bold">Purchase link intentionally disabled</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Costume PID 101838067 and one sample CJ path are verified. This page gets a live button only after its own feed identity, exact variant, destination, and dormant link record pass together.</p>
            </div>
            <div className="panel p-5">
              <PackageCheck aria-hidden="true" className="text-[var(--brand)]" size={22} />
              <h2 className="mt-4 text-xl font-bold">Catalog launch gates</h2>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--muted)]">
                <li>Exact feed product and variant identity</li>
                <li>Current price and availability</li>
                <li>Authorized image-use status</li>
                <li>Distinct buyer guidance and internal links</li>
                <li>Verified CJ redirect and local click record</li>
              </ul>
            </div>
            {product.premium || product.professional ? (
              <Link className="costume-premium-panel block p-5" href="/premium">
                <CircleDollarSign aria-hidden="true" className="text-[#f4d79b]" size={22} />
                <h2 className="mt-4 text-xl font-bold text-white">Premium & Professional edit</h2>
                <p className="mt-2 text-sm leading-6 text-white/75">Compare repeat use, construction, alteration, transport, care, and storage before paying more.</p>
              </Link>
            ) : null}
          </aside>
        </div>

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
