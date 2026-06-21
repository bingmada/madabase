import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { Hero, ProductCard, RoundupCard, TrustBar } from "@/components/LayoutParts";
import { siteGuides, siteProducts, siteRoundups, siteTools } from "@/lib/content";
import { organizationSchema, pageMetadata } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";

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

  return (
    <main>
      <JsonLd data={organizationSchema(site)} />
      <Hero site={site} />
      <TrustBar />
      <section className="section bg-white" id="reviews">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow">Work-from-home buying guides</p>
            <h2 className="mt-3 text-3xl font-black">Build a cleaner desk, better calls, and a setup your body can tolerate.</h2>
            <p className="mt-4 leading-8 text-[var(--muted)]">
              Compare compact standing desks, ergonomic chairs, monitor arms, lighting, and cable-management upgrades by the problem they solve in a real home office.
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
          {guides.map((guide) => (
            <Link className="panel p-5" href={`/guides/${guide.slug}`} key={guide.slug}>
              <p className="eyebrow">{guide.category}</p>
              <h3 className="mt-3 text-xl font-bold">{guide.title}</h3>
              <p className="mt-3 leading-7 text-[var(--muted)]">{guide.dek}</p>
            </Link>
          ))}
          {tools.map((tool) => (
            <Link className="panel p-5" href={`/tools/${tool.slug}`} key={tool.slug} id="tools">
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
