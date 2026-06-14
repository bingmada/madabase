import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/FavoriteButton";
import { getCurrentUser } from "@/lib/auth/services/sessionService";
import { getFavoriteState } from "@/lib/favorites";
import { getRelatedTools, toolMap, toolRegistry } from "@/lib/tool-registry";
import { isLocale, locales } from "@/lib/i18n";
import { buildAbsoluteUrl, buildToolMetadata } from "@/lib/seo";
import { ToolLayout } from "@/components/ToolLayout";
import { ToolIcon } from "@/components/ToolIcon";
import { ToolRenderer } from "@/components/tools/ToolRenderer";
import { ToolUsageTracker } from "@/components/ToolUsageTracker";
import { JsonLd, buildBreadcrumbSchema, buildSoftwareApplicationSchema } from "@/components/JsonLd";
import { Breadcrumb } from "@/components/Breadcrumb";
import { loadToolContent } from "@/lib/tool-content";
import { getPopularTests } from "@/lib/test-registry";

export function generateStaticParams() {
  return locales.flatMap((locale) => toolRegistry.map((tool) => ({ locale, slug: tool.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const registryEntry = toolMap.get(slug);
  if (!registryEntry) return {};

  // Try to load content from file, fallback to basic metadata
  const content = await loadToolContent(slug, locale);
  if (!content) return {};

  return buildToolMetadata({
    title: content.seo[locale].title,
    description: content.seo[locale].description,
    keywords: content.seo[locale].keywords,
    locale,
    path: `/tools/${slug}`,
  });
}

export default async function ToolPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const registryEntry = toolMap.get(slug);
  if (!registryEntry) notFound();

  // Load content from file system
  const content = await loadToolContent(slug, locale);
  if (!content) notFound();

  const currentUser = await getCurrentUser();
  const isFavorited = currentUser ? await getFavoriteState(currentUser.id, slug) : false;
  const relatedTools = getRelatedTools(slug);
  const relatedTests = getPopularTests();
  const canonicalUrl = buildAbsoluteUrl(`/${locale}/tools/${slug}`);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Madabase", item: buildAbsoluteUrl(`/${locale}`) },
    { name: locale === "en" ? "Tools" : "工具", item: buildAbsoluteUrl(`/${locale}/tools`) },
    { name: content.h1[locale], item: canonicalUrl },
  ]);

  const softwareSchema = buildSoftwareApplicationSchema({
    name: content.h1[locale],
    description: content.seo[locale].description,
    url: canonicalUrl,
    category: content.category,
    locale,
  });

  const faq = content.faq[locale];

  return (
    <ToolLayout locale={locale} pathname={`/tools/${slug}`} tool={slug}>
      <JsonLd id={`tool-breadcrumbs-${slug}`} data={breadcrumbSchema} />
      <JsonLd id={`tool-schema-${slug}`} data={softwareSchema} />
      <article className="surface-card-strong overflow-hidden">
        <header className="border-b border-[var(--border)] p-5 sm:p-7">
          <Breadcrumb
            items={[
              { label: "Madabase", href: `/${locale}` },
              { label: locale === "en" ? "Tools" : "工具", href: `/${locale}/tools` },
              { label: content.h1[locale] },
            ]}
          />
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-[var(--brand-soft)] text-[var(--brand-strong)]">
              <ToolIcon component={registryEntry.component} className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="eyebrow">{content.category}</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl">{content.h1[locale]}</h1>
              <p className="mt-3 text-base leading-7 text-[var(--text-muted)] sm:text-lg">{content.description[locale]}</p>
              <FavoriteButton
                locale={locale}
                toolSlug={slug}
                initialFavorited={isFavorited}
                requireLoginHref={`/${locale}/login?next=${encodeURIComponent(`/${locale}/tools/${slug}`)}`}
              />
            </div>
          </div>
        </header>

        <section className="bg-[var(--surface-muted)] p-3 sm:p-5">
          <ToolUsageTracker toolSlug={slug} />
          <ToolRenderer component={registryEntry.component} toolSlug={slug} />
        </section>

        <section className="border-t border-[var(--border)] p-5 sm:p-7">
          <h2 className="text-2xl font-bold text-[var(--text)]">{locale === "en" ? "Introduction" : "介绍"}</h2>
          <p className="mt-3 leading-7 text-[var(--text-muted)]">{content.intro[locale]}</p>
        </section>

        <section className="border-t border-[var(--border)] p-5 sm:p-7">
          <h2 className="text-2xl font-bold text-[var(--text)]">{locale === "en" ? "How To Use" : "如何使用"}</h2>
          <div className="mt-5 grid gap-4">
            {content.howToUse[locale].map((step, index) => (
              <div key={step.title} className="rounded-md border border-[var(--border)] bg-white p-5">
                <p className="code-font text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-soft)]">{locale === "en" ? `Step ${index + 1}` : `步骤 ${index + 1}`}</p>
                <h3 className="mt-2 text-lg font-semibold text-[var(--text)]">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{step.content}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-[var(--border)] p-5 sm:p-7">
          <h2 className="text-2xl font-bold text-[var(--text)]">{locale === "en" ? "Examples" : "示例"}</h2>
          <div className="mt-5 grid gap-4">
            {content.examples[locale].map((example, index) => (
              <div key={`${slug}-${index}`} className="rounded-md border border-[var(--border)] bg-white p-5">
                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <p className="code-font text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-soft)]">{locale === "en" ? "Input" : "输入"}</p>
                    <pre className="code-font mt-2 overflow-x-auto rounded-md bg-[var(--surface-muted)] p-3 text-sm text-[var(--text)]">{example.input}</pre>
                  </div>
                  <div>
                    <p className="code-font text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-soft)]">{locale === "en" ? "Output" : "输出"}</p>
                    <pre className="code-font mt-2 overflow-x-auto rounded-md bg-[var(--surface-muted)] p-3 text-sm text-[var(--text)]">{example.output}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {faq.length > 0 ? (
          <section className="border-t border-[var(--border)] p-5 sm:p-7" id="faq">
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

        {relatedTools.length > 0 ? (
          <section className="border-t border-[var(--border)] p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-[var(--text)]">{locale === "en" ? "You may also like" : "你可能也会喜欢"}</h2>
              <Link href={`/${locale}/tools`} className="text-sm font-semibold text-[var(--brand-strong)]">{locale === "en" ? "Explore all tools" : "查看全部工具"}</Link>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTools.map((relatedTool) => (
                <Link key={relatedTool.slug} href={`/${locale}/tools/${relatedTool.slug}`} className="group rounded-md border border-[var(--border)] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[var(--shadow-soft)]">
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--brand-strong)] transition group-hover:bg-[var(--brand-soft)]">
                      <ToolIcon component={relatedTool.component} />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-[var(--text)]">{relatedTool.slug}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {relatedTests.length > 0 ? (
          <section className="border-t border-[var(--border)] p-5 sm:p-7">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-[var(--text)]">{locale === "en" ? "Related tests" : "相关测试"}</h2>
              <Link href={`/${locale}/tests`} className="text-sm font-semibold text-[var(--brand-strong)]">{locale === "en" ? "Explore all tests" : "查看全部测试"}</Link>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTests.map((test) => (
                <Link key={test.slug} href={`/${locale}/tests/${test.slug}`} className="group rounded-md border border-[var(--border)] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[var(--shadow-soft)]">
                  <p className="code-font text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-soft)]">{test.category}</p>
                  <h3 className="mt-2 text-base font-semibold text-[var(--text)]">{test.title[locale]}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{test.description[locale]}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </ToolLayout>
  );
}
