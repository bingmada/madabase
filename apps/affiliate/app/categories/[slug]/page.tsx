import Link from "next/link";
import { notFound } from "next/navigation";
import { RoundupCard } from "@/components/LayoutParts";
import { siteGuides, siteRoundups, siteTools } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const category = site.categories.find((item) => item.slug === slug);
  if (!category) return {};
  return pageMetadata(site, `/categories/${slug}`, `${category.name} Buying Guides`, category.description);
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const category = site.categories.find((item) => item.slug === slug);
  if (!category) notFound();
  const roundups = siteRoundups(site.key).filter((item) => item.category === slug);
  const guides = siteGuides(site.key).filter((item) => item.category === slug);
  const tools = siteTools(site.key).filter((item) => item.category === slug);

  return (
    <main className="section">
      <div className="shell">
        <p className="eyebrow">Category</p>
        <h1 className="mt-3 text-4xl font-black">{category.name}</h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--muted)]">{category.description}</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {roundups.map((roundup) => (
            <RoundupCard roundup={roundup} key={roundup.slug} />
          ))}
          {guides.map((guide) => (
            <Link className="panel p-5" href={`/guides/${guide.slug}`} key={guide.slug}>
              <p className="eyebrow">Guide</p>
              <h2 className="mt-3 text-xl font-bold">{guide.title}</h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">{guide.dek}</p>
            </Link>
          ))}
          {tools.map((tool) => (
            <Link className="panel p-5" href={`/tools/${tool.slug}`} key={tool.slug}>
              <p className="eyebrow">Tool</p>
              <h2 className="mt-3 text-xl font-bold">{tool.title}</h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">{tool.dek}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
