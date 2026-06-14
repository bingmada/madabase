import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Brain, Clock, Layers3 } from "lucide-react";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd, buildBreadcrumbSchema } from "@/components/JsonLd";
import { ToolIcon } from "@/components/ToolIcon";
import { TestReferralCapture } from "@/components/tests/TestReferralCapture";
import { isLocale, locales } from "@/lib/i18n";
import { buildAbsoluteUrl, buildPageMetadata } from "@/lib/seo";
import { loadTestContent } from "@/lib/test-content";
import { testMap, testRegistry } from "@/lib/test-registry";
import { toolMap } from "@/lib/tool-registry";

export function generateStaticParams() {
  return locales.flatMap((locale) => testRegistry.map((test) => ({ locale, slug: test.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const test = testMap.get(slug);
  if (!test) return {};

  return buildPageMetadata({
    title: test.seo[locale].title,
    description: test.seo[locale].description,
    locale,
    path: `/tests/${slug}`,
    keywords: test.seo[locale].keywords,
  });
}

export default async function TestDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { locale, slug } = await params;
  const { ref } = await searchParams;
  if (!isLocale(locale)) notFound();
  const test = testMap.get(slug);
  if (!test) notFound();
  const content = await loadTestContent(slug, locale);
  if (!content) notFound();

  const canonicalUrl = buildAbsoluteUrl(`/${locale}/tests/${slug}`);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Madabase", item: buildAbsoluteUrl(`/${locale}`) },
    { name: locale === "en" ? "Tests" : "测试", item: buildAbsoluteUrl(`/${locale}/tests`) },
    { name: content.title, item: canonicalUrl },
  ]);
  const quizSchema = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    name: content.title,
    description: content.description,
    url: canonicalUrl,
    inLanguage: locale,
    numberOfQuestions: content.questions.length,
  };

  const copy = {
    en: {
      instructions: "Instructions",
      questions: "questions",
      minutes: "min",
      start: "Start test",
      relatedTools: "Related tools",
      fullReport: "Full report costs",
      credits: "credits",
    },
    zh: {
      instructions: "说明",
      questions: "题",
      minutes: "分钟",
      start: "开始测试",
      relatedTools: "相关工具",
      fullReport: "完整报告消耗",
      credits: "积分",
    },
  }[locale];

  const relatedTools = test.relatedTools.map((toolSlug) => toolMap.get(toolSlug)).filter((tool): tool is NonNullable<ReturnType<typeof toolMap.get>> => Boolean(tool));
  const startHref = `/${locale}/tests/${slug}/start${ref ? `?ref=${encodeURIComponent(ref)}` : ""}`;

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname={`/tests/${slug}`} />
      <main className="page-shell">
        <TestReferralCapture code={ref} testSlug={slug} />
        <JsonLd id={`test-breadcrumbs-${slug}`} data={breadcrumbSchema} />
        <JsonLd id={`test-quiz-${slug}`} data={quizSchema} />

        <article className="surface-card-strong overflow-hidden">
          <header className="border-b border-[var(--border)] p-5 sm:p-7">
            <Breadcrumb
              items={[
                { label: "Madabase", href: `/${locale}` },
                { label: locale === "en" ? "Tests" : "测试", href: `/${locale}/tests` },
                { label: content.title },
              ]}
            />
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-[var(--brand-soft)] text-[var(--brand-strong)]">
                <Brain className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="eyebrow">{test.category}</p>
                <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--text)] sm:text-4xl">{content.title}</h1>
                <p className="mt-3 text-base leading-7 text-[var(--text-muted)] sm:text-lg">{content.description}</p>
              </div>
            </div>
          </header>

          <section className="grid gap-0 border-b border-[var(--border)] bg-[var(--surface-muted)] sm:grid-cols-3">
            <div className="border-b border-[var(--border)] p-5 sm:border-b-0 sm:border-r">
              <Layers3 className="h-5 w-5 text-[var(--brand-strong)]" />
              <p className="mt-2 text-lg font-bold text-[var(--text)]">{test.questionCount} {copy.questions}</p>
            </div>
            <div className="border-b border-[var(--border)] p-5 sm:border-b-0 sm:border-r">
              <Clock className="h-5 w-5 text-[var(--brand-strong)]" />
              <p className="mt-2 text-lg font-bold text-[var(--text)]">{test.estimatedMinutes} {copy.minutes}</p>
            </div>
            <div className="p-5">
              <Brain className="h-5 w-5 text-[var(--brand-strong)]" />
              <p className="mt-2 text-lg font-bold text-[var(--text)]">{copy.fullReport} {test.unlockCost} {copy.credits}</p>
            </div>
          </section>

          <section className="p-5 sm:p-7">
            <h2 className="text-2xl font-bold text-[var(--text)]">{copy.instructions}</h2>
            <div className="mt-5 grid gap-3">
              {content.instructions.map((instruction, index) => (
                <div key={instruction} className="flex gap-3 rounded-md border border-[var(--border)] bg-white p-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-[var(--surface-code)] text-sm font-bold text-white">{index + 1}</span>
                  <p className="text-sm leading-6 text-[var(--text-muted)]">{instruction}</p>
                </div>
              ))}
            </div>
            <Link href={startHref} className="mt-6 inline-flex h-11 items-center gap-2 rounded-md bg-[var(--surface-code)] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)]">
              {copy.start}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>

          {relatedTools.length > 0 ? (
            <section className="border-t border-[var(--border)] p-5 sm:p-7">
              <h2 className="text-2xl font-bold text-[var(--text)]">{copy.relatedTools}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedTools.map((tool) => (
                  <Link key={tool.slug} href={`/${locale}/tools/${tool.slug}`} className="group rounded-md border border-[var(--border)] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[var(--shadow-soft)]">
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--brand-strong)] transition group-hover:bg-[var(--brand-soft)]">
                        <ToolIcon component={tool.component} />
                      </span>
                      <h3 className="text-base font-semibold text-[var(--text)]">{tool.h1[locale]}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </article>
      </main>
      <Footer />
    </div>
  );
}
