import { CostumeCatalogExplorer } from "@/components/CostumeCatalog";
import { parseCostumeCatalogFilters } from "@/lib/costume-catalog";
import { pageMetadata } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type CatalogSearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata() {
  const site = await getCurrentSite();
  if (site.key !== "costume") return {};
  return pageMetadata(site, "/catalog", "Costume, Prop, Mask, Wig, and Party-Effect Catalog", "Filter the bounded Abracadabra catalog by product type, price, audience, occasion, Premium or Professional status, and current availability.");
}

export default async function CostumeCatalogPage({ searchParams }: { searchParams: CatalogSearchParams }) {
  const site = await getCurrentSite();
  if (site.key !== "costume") notFound();
  const filters = parseCostumeCatalogFilters(await searchParams);

  return (
    <main className="section">
      <div className="shell">
        <p className="eyebrow">Bounded Feed catalog</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-5xl">Filter 1,000 selected products without turning the site into an endless product wall.</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">Browse by type first, then narrow by price, audience, occasion, or professional use. Every result comes from the current CJ Feed working set and remains noindex during launch QA.</p>
        <div className="mt-9">
          <CostumeCatalogExplorer filters={filters} site={site} />
        </div>
      </div>
    </main>
  );
}
