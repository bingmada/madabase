import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { findGuide, findRoundup } from "@/lib/content";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const guide = findGuide(site.key, slug);
  if (!guide) return {};
  return pageMetadata(site, `/guides/${slug}`, guide.title, guide.dek);
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const guide = findGuide(site.key, slug);
  if (!guide) notFound();

  return (
    <main className="section">
      <JsonLd data={breadcrumbSchema(site, [{ name: "Home", path: "/" }, { name: guide.title, path: `/guides/${slug}` }])} />
      <div className="shell max-w-4xl">
        <p className="eyebrow">{guide.category}</p>
        <h1 className="mt-3 text-4xl font-black leading-tight">{guide.title}</h1>
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{guide.dek}</p>
        <article className="prose-lite mt-8">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </article>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {guide.relatedRoundups.map((slug) => {
            const roundup = findRoundup(site.key, slug);
            return roundup ? (
              <Link className="panel p-5" href={`/best/${roundup.slug}`} key={roundup.slug}>
                <p className="eyebrow">Related comparison</p>
                <h2 className="mt-3 text-xl font-bold">{roundup.title}</h2>
                <p className="mt-3 leading-7 text-[var(--muted)]">{roundup.dek}</p>
              </Link>
            ) : null;
          })}
        </div>
      </div>
    </main>
  );
}
