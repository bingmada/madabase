import { ArrowRight, BadgeDollarSign, CalendarClock, Database, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { SiteConfig } from "@/lib/sites";
import { costumeGuides, costumeProductCandidates, type CostumeProductCandidate } from "@/lib/costume-content";
import { getCostumeCatalogStats, type CostumeCatalogCategory, type CostumeCatalogFilters } from "@/lib/costume-catalog";
import { CostumeCatalogExplorer } from "./CostumeCatalog";
import { Hero, TrustBar } from "./LayoutParts";

export function CostumePreviewNotice() {
  return (
    <aside className="border-b border-[#e1c68d] bg-[#fff4d8]" aria-label="Preview status">
      <div className="shell flex flex-col gap-2 py-4 text-sm leading-6 text-[#5f4514] sm:flex-row sm:items-center sm:justify-between">
        <p>
          <strong>Editorial preview:</strong> this site is noindex. The bounded CJ catalog, inventory filters, and CJ Feed product images are connected; purchase buttons stay disabled until exact page review and link activation pass.
        </p>
        <Link className="shrink-0 font-bold underline underline-offset-4" href="/methodology">See the launch gates</Link>
      </div>
    </aside>
  );
}

export function CostumeProductCard({ product }: { product: CostumeProductCandidate }) {
  return (
    <article className="panel flex h-full flex-col overflow-hidden">
      <div className="costume-card-art grid min-h-40 content-between p-5" aria-hidden="true">
        <div className="flex flex-wrap gap-2">
          {product.premium ? <span className="costume-chip">Premium</span> : null}
          {product.professional ? <span className="costume-chip">Professional</span> : null}
        </div>
        <span className="text-xs font-black uppercase tracking-[0.16em] text-white/80">{product.typeLabel}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow">Launch candidate</p>
        <h3 className="mt-2 text-xl font-bold leading-7">{product.name}</h3>
        <p className="mt-3 flex-1 leading-7 text-[var(--muted)]">{product.summary}</p>
        {product.observedPrice ? <p className="mt-3 text-sm font-semibold text-[var(--brand-strong)]">Previously observed: {product.observedPrice}; feed verification pending</p> : null}
        <Link className="button-secondary mt-5 self-start" href={`/products/${product.slug}`}>
          View decision preview
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </article>
  );
}

async function CostumeCatalogSnapshot() {
  const stats = await getCostumeCatalogStats();
  if (!stats) return null;

  return (
    <section className="border-y border-[var(--border)] bg-[var(--surface-muted)]">
      <div className="shell grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-5">
        {[
          [stats.total, "bounded Feed products"],
          [stats.available, "currently browseable"],
          [stats.premium, "$1,000+ Premium"],
          [stats.professional, "Professional"],
          [stats.halloween, "Halloween-relevant"],
        ].map(([value, label]) => (
          <div className="rounded-md bg-white p-4" key={label}>
            <p className="text-2xl font-black text-[var(--brand-strong)]">{Number(value).toLocaleString("en-US")}</p>
            <p className="mt-1 text-sm font-semibold text-[var(--muted)]">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CostumeHome({ site }: { site: SiteConfig }) {
  const launchPageCount = 1 + site.categories.length + 1 + costumeProductCandidates.length + costumeGuides.length;

  return (
    <main>
      <Hero site={site} />
      <TrustBar />
      <CostumeCatalogSnapshot />
      <section className="section bg-white" id="reviews">
        <div className="shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Year-round costume decisions</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Shop by the kind of decision, not by an endless product wall.</h2>
            <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
              Product type is the primary path. The live preview can now filter the bounded CJ Feed catalog by price, audience, occasion, rental, professional use, and seasonal relevance.
            </p>
            <Link className="button-primary mt-6" href="/catalog">Browse the filtered catalog <ArrowRight aria-hidden="true" size={16} /></Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {site.categories.map((category) => (
              <Link className="panel p-5 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]" href={`/categories/${category.slug}`} key={category.slug}>
                <p className="eyebrow">Browse by type</p>
                <h3 className="mt-3 text-xl font-bold">{category.name}</h3>
                <p className="mt-3 leading-7 text-[var(--muted)]">{category.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-strong)]">Open category <ArrowRight aria-hidden="true" size={16} /></span>
              </Link>
            ))}
            <Link className="costume-premium-panel p-5" href="/premium">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-[#f4d79b]">Flagship section</p>
              <h3 className="mt-3 text-2xl font-black text-white">Premium & Professional</h3>
              <p className="mt-3 leading-7 text-white/75">Start with construction, fit, repeat use, transport, care, and total ownership—not price alone.</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">Explore the high-consideration edit <ArrowRight aria-hidden="true" size={16} /></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">Curated product decisions</p>
              <h2 className="mt-3 text-3xl font-black">Ten candidates, no unverified purchase links.</h2>
              <p className="mt-4 leading-8 text-[var(--muted)]">These previews define the questions each eventual product page must answer. The CJ feed will replace provisional identity, price, stock, and link data.</p>
            </div>
            <p className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-bold">{launchPageCount} editorial launch URLs</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {costumeProductCandidates.map((product) => <CostumeProductCard key={product.slug} product={product} />)}
          </div>
        </div>
      </section>

      <section className="section bg-white" id="guides">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow">Decision guides</p>
            <h2 className="mt-3 text-3xl font-black">Resolve fit, timing, materials, and storage before checkout.</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {costumeGuides.map((guide) => (
              <Link className="panel p-5" href={`/guides/${guide.slug}`} key={guide.slug}>
                <p className="eyebrow">{guide.category.replaceAll("-", " ")}</p>
                <h3 className="mt-3 text-xl font-bold">{guide.title}</h3>
                <p className="mt-3 leading-7 text-[var(--muted)]">{guide.dek}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Database, title: "Full catalog, controlled exposure", body: "Eligible feed products can live in the database while raw and duplicate records remain noindex and outside sitemaps." },
            { icon: ShieldCheck, title: "Attribution before CTA", body: "Every purchase path needs the Costume PID, Abracadabra link identity, a local click record, and a verified CJ redirect." },
            { icon: BadgeDollarSign, title: "Price is a filter", body: "Premium is a flagship section; affordable costumes, accessories, props, and effects still belong in the same type-led site." },
            { icon: CalendarClock, title: "Seasonal, not disposable", body: "Halloween changes merchandising and presentation while the core URLs continue serving cosplay, theater, parties, and professional use." },
          ].map((item) => (
            <div className="panel p-5" key={item.title}>
              <item.icon aria-hidden="true" className="text-[var(--brand)]" size={22} />
              <h3 className="mt-4 font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export function CostumeCategoryPage({
  site,
  slug,
  filters,
}: {
  site: SiteConfig;
  slug: CostumeCatalogCategory;
  filters: CostumeCatalogFilters;
}) {
  const category = site.categories.find((item) => item.slug === slug);
  const guides = costumeGuides.filter((guide) => guide.category === slug);

  if (!category) return null;

  return (
    <main>
      <section className="section">
        <div className="shell">
          <p className="eyebrow">Type-led category preview</p>
          <h1 className="mt-3 text-4xl font-black">{category.name}</h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted)]">{category.description}</p>
          <div className="mt-8">
            <CostumeCatalogExplorer basePath={`/categories/${slug}`} filters={filters} lockedCategory={slug} site={site} />
          </div>
          {guides.length ? (
            <section className="mt-12">
              <p className="eyebrow">Supporting guides</p>
              <h2 className="mt-3 text-3xl font-black">Plan the full use case</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {guides.map((guide) => (
                  <Link className="panel p-5" href={`/guides/${guide.slug}`} key={guide.slug}>
                    <h3 className="text-xl font-bold">{guide.title}</h3>
                    <p className="mt-3 leading-7 text-[var(--muted)]">{guide.dek}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
