import Link from "next/link";
import { notFound } from "next/navigation";
import { CalculatorTool } from "@/components/Calculator";
import { JsonLd } from "@/components/JsonLd";
import { findRoundup, findTool } from "@/lib/content";
import { breadcrumbSchema, pageMetadata, toolSchema } from "@/lib/seo";
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

  return (
    <main className="section">
      <JsonLd data={breadcrumbSchema(site, [{ name: "Home", path: "/" }, { name: tool.title, path: `/tools/${slug}` }])} />
      <JsonLd data={toolSchema(site, tool)} />
      <div className="shell max-w-4xl">
        <p className="eyebrow">Calculator</p>
        <h1 className="mt-3 text-4xl font-black leading-tight">{tool.title}</h1>
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{tool.dek}</p>
        <div className="mt-8">
          <CalculatorTool tool={tool} />
        </div>
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
