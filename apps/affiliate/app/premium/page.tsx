import { BadgeDollarSign, Hammer, Ruler, RotateCcw } from "lucide-react";
import { CostumeCatalogExplorer } from "@/components/CostumeCatalog";
import { parseCostumeCatalogFilters } from "@/lib/costume-catalog";
import { pageMetadata } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const site = await getCurrentSite();
  if (site.key !== "costume") return {};
  return pageMetadata(site, "/premium", "Premium & Professional Costumes and Props", "High-consideration costumes and props compared by construction, fit, repeat use, care, transport, and total ownership cost.");
}

export const dynamic = "force-dynamic";

export default async function PremiumCostumePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const site = await getCurrentSite();
  if (site.key !== "costume") notFound();
  const filters = parseCostumeCatalogFilters(await searchParams, { feature: "premium-professional" });

  return (
    <main>
      <section className="costume-premium-panel">
        <div className="shell py-16 sm:py-24">
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#f4d79b]">Flagship edit</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black leading-tight text-white sm:text-6xl">Premium price needs professional-grade buying questions.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/75">The section begins around $1,000 for flagship merchandising, but also includes lower-priced professional garments, props, and prosthetics when construction, repeat use, transport, or application makes the decision unusually demanding.</p>
        </div>
      </section>
      <section className="section bg-white">
        <div className="shell grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Ruler, title: "Fit and alteration", body: "Use exact measurements, movement needs, underlayers, tailoring room, and the alteration deadline." },
            { icon: Hammer, title: "Construction", body: "Look for material, lining, closures, seams, finish, replaceable parts, and repair paths—not price as a quality proxy." },
            { icon: RotateCcw, title: "Repeat use", body: "Count performance nights, events, shoots, rentals, and future character variations before estimating value." },
            { icon: BadgeDollarSign, title: "Total ownership", body: "Include shipping, tailoring, care, storage, cases, power, consumables, repairs, and return risk." },
          ].map((item) => (
            <div className="panel p-5" key={item.title}>
              <item.icon aria-hidden="true" className="text-[var(--brand)]" size={22} />
              <h2 className="mt-4 text-xl font-bold">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <p className="eyebrow">Premium & Professional selection</p>
          <h2 className="mt-3 text-3xl font-black">High-consideration products</h2>
          <p className="mt-4 max-w-3xl leading-8 text-[var(--muted)]">Compare higher-priced and professional-use options by construction, sizing, repeat use, transport, care, and total ownership cost. Confirm current availability and the exact variant before checkout.</p>
          <div className="mt-8">
            <CostumeCatalogExplorer basePath="/premium" filters={filters} lockedFeature="premium-professional" site={site} />
          </div>
        </div>
      </section>
    </main>
  );
}
