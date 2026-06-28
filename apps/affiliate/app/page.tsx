import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Hero, ProductCard, RoundupCard, TrustBar } from "@/components/LayoutParts";
import { siteGuides, siteProducts, siteRoundups, siteTools } from "@/lib/content";
import { itemListSchema, organizationSchema, pageMetadata, websiteSchema } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";
import type { SiteKey } from "@/lib/types";

const homeCopy: Record<SiteKey, { eyebrow: string; heading: string; body: string }> = {
  pet: {
    eyebrow: "Pet buying guides",
    heading: "Choose calmer daily-care gear for feeding, watching, cleaning, and comfort.",
    body: "Compare automatic feeders, pet cameras, odor-control tools, beds, hair removers, and air purifiers by the problem they solve in a real home.",
  },
  homeoffice: {
    eyebrow: "Work-from-home buying guides",
    heading: "Build a cleaner desk, better calls, and a setup that stays comfortable through the workday.",
    body: "Compare compact standing desks, ergonomic chairs, monitor arms, lighting, and cable-management upgrades by the problem they solve in a real home office.",
  },
  baby: {
    eyebrow: "Baby gear buying guides",
    heading: "Compare baby gear with stated safety limits and everyday routines in view.",
    body: "Compare monitors, travel strollers, sterilizers, carriers, sound machines, and feeding helpers by stated age, weight, position, and use limits, plus cleaning effort, storage, and everyday friction.",
  },
  network: {
    eyebrow: "Home network buying guides",
    heading: "Build a faster, calmer network for Wi-Fi, wired rooms, travel, and backup power.",
    body: "Compare mesh Wi-Fi, Wi-Fi 7 routers, switches, Ethernet cables, USB-C network adapters, and router UPS options by layout, device count, wired backhaul, and setup friction.",
  },
};

export async function generateMetadata() {
  const site = await getCurrentSite();
  return pageMetadata(site, "/", site.name, site.description);
}

export default async function HomePage() {
  const site = await getCurrentSite();
  const roundups = siteRoundups(site.key);
  const products = siteProducts(site.key);
  const linkedProducts = products.filter((product) => product.offers.length > 0);
  const guides = siteGuides(site.key);
  const tools = siteTools(site.key);
  const copy = homeCopy[site.key];
  const discoveryItems = [
    ...roundups.map((roundup) => ({ name: roundup.title, path: `/best/${roundup.slug}` })),
    ...linkedProducts.slice(0, 8).map((product) => ({ name: product.amazonTitle ?? product.name, path: `/reviews/${product.slug}` })),
    ...guides.map((guide) => ({ name: guide.title, path: `/guides/${guide.slug}` })),
    ...tools.map((tool) => ({ name: tool.title, path: `/tools/${tool.slug}` })),
  ];

  return (
    <main>
      <JsonLd data={organizationSchema(site)} />
      <JsonLd data={websiteSchema(site)} />
      <JsonLd data={itemListSchema(site, `${site.name} buying guides and tools`, discoveryItems)} />
      <Hero site={site} />
      <TrustBar />
      <section className="section bg-white" id="reviews">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-black">{copy.heading}</h2>
            <p className="mt-4 leading-8 text-[var(--muted)]">
              {copy.body}
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {roundups.map((roundup) => (
              <RoundupCard key={roundup.slug} roundup={roundup} />
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="shell">
          <div className="grid gap-5 lg:grid-cols-3">
            {linkedProducts.map((product, index) => (
              <ProductCard key={product.slug} site={site} product={product} position={`home-product-${index + 1}`} />
            ))}
          </div>
        </div>
      </section>
      <section className="section bg-white" id="guides">
        <div className="shell grid gap-5 md:grid-cols-3">
          <span className="sr-only" id="tools" aria-hidden="true" />
          {guides.map((guide) => (
            <Link className="panel p-5" href={`/guides/${guide.slug}`} key={guide.slug}>
              <p className="eyebrow">{guide.category}</p>
              <h3 className="mt-3 text-xl font-bold">{guide.title}</h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">{guide.dek}</p>
            </Link>
          ))}
          {tools.map((tool) => (
            <Link className="panel p-5" href={`/tools/${tool.slug}`} key={tool.slug}>
              <p className="eyebrow">Tool</p>
              <h3 className="mt-3 text-xl font-bold">{tool.title}</h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">{tool.dek}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
