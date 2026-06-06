import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { toolMap, toolRegistry } from "@/lib/tools";
import { isLocale, locales } from "@/lib/i18n";
import { buildLocaleCanonical, buildToolMetadata } from "@/lib/seo";
import { ToolLayout } from "@/components/ToolLayout";
import { ToolIcon } from "@/components/ToolIcon";
import { ToolRenderer } from "@/components/tools/ToolRenderer";

export function generateStaticParams() {
  return locales.flatMap((locale) => toolRegistry.map((tool) => ({ locale, slug: tool.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const tool = toolMap.get(slug);
  if (!tool) return {};

  return buildToolMetadata({
    title: `${tool.title[locale]} | Madabase`,
    description: tool.description[locale],
    keywords: tool.keywords,
    canonical: buildLocaleCanonical(locale, `/tools/${tool.slug}`),
  });
}

export default async function ToolPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const tool = toolMap.get(slug);
  if (!tool) notFound();

  const faq = tool.faq[locale];

  return (
    <ToolLayout locale={locale} pathname={`/tools/${tool.slug}`}>
      <article className="surface-card-strong overflow-hidden">
        <header className="border-b border-[var(--border)] p-5 sm:p-7">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-[var(--brand-soft)] text-[var(--brand-strong)]">
              <ToolIcon component={tool.component} className="h-6 w-6" />
            </span>
            <div className="min-w-0">
              <p className="eyebrow">{tool.category}</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl">{tool.h1[locale]}</h1>
              <p className="mt-3 text-base leading-7 text-[var(--text-muted)] sm:text-lg">{tool.description[locale]}</p>
            </div>
          </div>
        </header>

        <section className="bg-[var(--surface-muted)] p-3 sm:p-5">
          <ToolRenderer component={tool.component} />
        </section>

        <section className="space-y-6 p-5 sm:p-7">
          {tool.body[locale].map((section) => (
            <div key={section.heading}>
              <h2 className="text-2xl font-bold text-[var(--text)]">{section.heading}</h2>
              <p className="mt-3 leading-7 text-[var(--text-muted)]">{section.text}</p>
            </div>
          ))}
        </section>

        {faq.length > 0 ? (
          <section className="border-t border-[var(--border)] p-5 sm:p-7">
            <h2 className="text-2xl font-bold text-[var(--text)]">FAQ</h2>
            <div className="mt-5 space-y-4">
              {faq.map((item) => (
                <details key={item.q} className="rounded-md border border-[var(--border)] bg-white p-5">
                  <summary className="cursor-pointer font-semibold text-[var(--text)]">{item.q}</summary>
                  <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </ToolLayout>
  );
}
