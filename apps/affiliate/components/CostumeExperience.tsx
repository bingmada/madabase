import { ArrowRight, BadgeDollarSign, CalendarClock, ListChecks, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { SiteConfig } from "@/lib/sites";
import { costumeGuides } from "@/lib/costume-content";
import { getCostumeCatalogStats, listCuratedCostumeProducts, listIndexableCostumeProducts, type CostumeCatalogCategory, type CostumeCatalogFilters } from "@/lib/costume-catalog";
import { costumeHalloweenSlugs } from "@/lib/costume-halloween";
import { CostumeCatalogCard, CostumeCatalogExplorer } from "./CostumeCatalog";
import { Hero, TrustBar } from "./LayoutParts";

async function CostumeCatalogSnapshot() {
  const stats = await getCostumeCatalogStats();
  if (!stats) return null;

  return (
    <section className="border-y border-[var(--border)] bg-[var(--surface-muted)]">
      <div className="shell grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [5, "product types"],
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

export async function CostumeHome({ site }: { site: SiteConfig }) {
  const halloweenProducts = await listCuratedCostumeProducts(costumeHalloweenSlugs);
  const featuredProducts = halloweenProducts.length
    ? halloweenProducts.slice(0, 9)
    : await listIndexableCostumeProducts(9);
  const featuredGuides = [...costumeGuides].sort((left, right) => {
    const priority = ["when-to-order-a-halloween-costume", "costume-sizing-measurements-and-returns", "large-prop-animatronic-space-and-power-checklist"];
    const leftIndex = priority.indexOf(left.slug);
    const rightIndex = priority.indexOf(right.slug);
    return (leftIndex === -1 ? priority.length : leftIndex) - (rightIndex === -1 ? priority.length : rightIndex);
  });

  return (
    <main>
      <Hero site={site} />
      <TrustBar />
      <CostumeCatalogSnapshot />
      <section className="border-b border-[#4a2b56] bg-[#1a1023] text-white">
        <div className="shell flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-[#ffc56d]">Halloween 2026 starts here</p>
            <h2 className="mt-2 text-2xl font-black text-white">Start with sizing, masks, haunted props, lighting, and delivery risk—not a wall of seasonal products.</h2>
          </div>
          <Link className="button-primary shrink-0 !bg-[#df7627] !text-white" href="/halloween">Open the Halloween guide <ArrowRight aria-hidden="true" size={16} /></Link>
        </div>
      </section>
      <section className="section bg-white" id="reviews">
        <div className="shell">
          <div className="max-w-3xl">
            <p className="eyebrow">Halloween-first navigation</p>
            <h2 className="mt-3 text-3xl font-black sm:text-4xl">Choose the Halloween job first, then narrow the product.</h2>
            <p className="mt-4 text-lg leading-8 text-[var(--muted)]">
              Start with a wearable look, creature transformation, haunted-scene prop, or party atmosphere. Then narrow by price, audience, size, venue, power, professional use, or repeat-use value.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="button-primary" href="/halloween">Plan Halloween 2026 <ArrowRight aria-hidden="true" size={16} /></Link>
              <Link className="button-secondary" href="/catalog?occasion=halloween">Browse Halloween products</Link>
            </div>
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
              <p className="eyebrow">Halloween editor&apos;s starting points</p>
              <h2 className="mt-3 text-3xl font-black">A small Halloween edit with a clear job for every product.</h2>
              <p className="mt-4 leading-8 text-[var(--muted)]">Wearable transformations, haunted props, pumpkins, and lights are selected for distinct use cases and exact retailer destinations—not merely because a Feed row says “Halloween.”</p>
            </div>
            <Link className="button-secondary" href="/halloween">View all 12 Halloween picks <ArrowRight aria-hidden="true" size={16} /></Link>
          </div>
          {featuredProducts.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => <CostumeCatalogCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="panel mt-8 p-6">
              <h3 className="text-xl font-bold">Browse by product type while featured selections are updated.</h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">The full catalog and decision guides remain available.</p>
            </div>
          )}
        </div>
      </section>

      <section className="section bg-white" id="guides">
        <div className="shell">
          <div className="max-w-2xl">
              <p className="eyebrow">Halloween planning guides</p>
              <h2 className="mt-3 text-3xl font-black">Resolve timing, fit, power, materials, and storage before October 31.</h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {featuredGuides.map((guide) => (
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
            { icon: ListChecks, title: "Useful checks before checkout", body: "Product pages surface fit, included pieces, materials, setup, care, timing, and return questions that listings can leave unclear." },
            { icon: ShieldCheck, title: "Exact retailer destinations", body: "Purchase buttons are tied to the matching Abracadabra product and use the dedicated CJ attribution path." },
            { icon: BadgeDollarSign, title: "Price is a filter", body: "Premium is a flagship section; affordable costumes, accessories, props, and effects still belong in the same type-led site." },
            { icon: CalendarClock, title: "Halloween-first, not disposable", body: "Halloween leads the site from summer through October while the same useful URLs continue serving cosplay, theater, parties, and professional use after the season." },
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
          <p className="eyebrow">Browse by product type</p>
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
