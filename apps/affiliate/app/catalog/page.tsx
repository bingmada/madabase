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
  return {
    ...pageMetadata(site, "/catalog", "Costume, Prop, Mask, Wig, and Party-Effect Catalog", "Browse Abracadabra costumes, props, masks, wigs, makeup, and party effects by product type, price, audience, occasion, and professional use."),
    robots: { index: false, follow: true },
  };
}

export default async function CostumeCatalogPage({ searchParams }: { searchParams: CatalogSearchParams }) {
  const site = await getCurrentSite();
  if (site.key !== "costume") notFound();
  const filters = parseCostumeCatalogFilters(await searchParams);

  return (
    <main className="section">
      <div className="shell">
        <p className="eyebrow">Product catalog</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight sm:text-5xl">Find the right costume, prop, mask, wig, or party effect for the event.</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted)]">Browse by product type, then narrow by price, audience, occasion, or professional use. Product pages keep current price and availability visible alongside the fit, setup, and care questions worth checking.</p>
        <div className="mt-9">
          <CostumeCatalogExplorer filters={filters} site={site} />
        </div>
      </div>
    </main>
  );
}
