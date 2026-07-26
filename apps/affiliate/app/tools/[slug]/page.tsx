import Link from "next/link";
import { notFound } from "next/navigation";
import { CalculatorTool } from "@/components/Calculator";
import { JsonLd } from "@/components/JsonLd";
import { findRoundup, findTool } from "@/lib/content";
import { breadcrumbSchema, faqPageSchema, pageMetadata, toolSchema } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const tool = findTool(site.key, slug);
  if (!tool) return {};
  return pageMetadata(site, `/tools/${slug}`, tool.title, tool.dek);
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const tool = findTool(site.key, slug);
  if (!tool) notFound();
  const category = site.categories.find((item) => item.slug === tool.category);

  return (
    <main className="section">
      <JsonLd
        data={breadcrumbSchema(site, [
          { name: "Home", path: "/" },
          ...(category ? [{ name: category.name, path: `/categories/${category.slug}` }] : []),
          { name: tool.title, path: `/tools/${slug}` },
        ])}
      />
      <JsonLd data={toolSchema(site, tool)} />
      {tool.faqs?.length ? <JsonLd data={faqPageSchema(tool.faqs)} /> : null}
      <div className="shell max-w-4xl">
        <div className="flex flex-wrap items-center gap-3">
          <p className="eyebrow">Calculator</p>
          {category ? (
            <Link className="text-xs font-bold uppercase text-[var(--brand-strong)] hover:underline" href={`/categories/${category.slug}`}>
              {category.name}
            </Link>
          ) : null}
        </div>
        <h1 className="mt-3 text-4xl font-black leading-tight">{tool.title}</h1>
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{tool.dek}</p>
        {tool.updatedAt ? <p className="mt-3 text-sm font-semibold text-[var(--muted)]">Updated {tool.updatedAt} · Planning estimate, not a product guarantee</p> : null}
        <div className="mt-8">
          <CalculatorTool tool={tool} />
        </div>
        {tool.sections?.length ? (
          <section className="mt-10 space-y-5" aria-label="How to use this estimate">
            {tool.sections.map((section) => (
              <article className="panel p-6" key={section.heading}>
                <h2 className="text-2xl font-black">{section.heading}</h2>
                <p className="mt-3 leading-8 text-[var(--muted)]">{section.body}</p>
              </article>
            ))}
          </section>
        ) : null}
        {tool.faqs?.length ? (
          <section className="mt-10">
            <h2 className="text-3xl font-black">Planning questions</h2>
            <div className="mt-5 space-y-4">
              {tool.faqs.map((faq) => (
                <details className="panel p-5" key={faq.question}>
                  <summary className="cursor-pointer font-bold">{faq.question}</summary>
                  <p className="mt-3 leading-7 text-[var(--muted)]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {tool.relatedRoundups.map((slug) => {
            const roundup = findRoundup(site.key, slug);
            return roundup ? (
              <Link className="panel p-5" href={`/best/${roundup.slug}`} key={roundup.slug}>
                <p className="eyebrow">Buying guide</p>
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
