import type { Metadata } from "next";
import Link from "next/link";
import { Brain, Clock, Layers3 } from "lucide-react";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd, buildBreadcrumbSchema } from "@/components/JsonLd";
import { PageViewTracker } from "@/components/PageViewTracker";
import { isLocale, locales } from "@/lib/i18n";
import { buildAbsoluteUrl, buildPageMetadata } from "@/lib/seo";
import { loadTestContent } from "@/lib/test-content";
import { getTestCategories, testRegistry } from "@/lib/test-registry";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return buildPageMetadata({
    title: locale === "en" ? "Free Online Personality Tests" : "免费在线人格测试",
    description:
      locale === "en"
        ? "Take interactive personality, career, relationship, and self-discovery tests on Madabase."
        : "在 Madabase 完成人格、职业、关系与自我探索类互动测试。",
    locale,
    path: "/tests",
    keywords: ["personality tests", "mbti test", "career test", "online tests"],
  });
}

export default async function TestsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const tests = await Promise.all(
    testRegistry.map(async (test) => ({
      test,
      content: await loadTestContent(test.slug, locale),
    }))
  );

  const copy = {
    en: {
      eyebrow: "Test platform",
      title: "Interactive tests for personality, career, and self-discovery.",
      description: "Start with a fast MBTI-style assessment, then unlock deeper reports with credits as the platform grows.",
      allTests: "All tests",
      categories: "Categories",
      questions: "questions",
      minutes: "min",
      start: "Start test",
    },
    zh: {
      eyebrow: "测试平台",
      title: "面向人格、职业与自我探索的互动测试。",
      description: "先从 MBTI 风格测试开始，后续可用积分解锁更深入的完整报告。",
      allTests: "全部测试",
      categories: "分类",
      questions: "题",
      minutes: "分钟",
      start: "开始测试",
    },
  }[locale];

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Madabase", item: buildAbsoluteUrl(`/${locale}`) },
    { name: locale === "en" ? "Tests" : "测试", item: buildAbsoluteUrl(`/${locale}/tests`) },
  ]);

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname="/tests" />
      <main className="page-shell">
        <JsonLd id="tests-index-breadcrumbs" data={breadcrumbSchema} />
        <PageViewTracker locale={locale} />
        <AdSlot locale={locale} position="header" size="banner" />

        <section className="surface-card-strong overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1fr_0.9fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="eyebrow">{copy.eyebrow}</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">{copy.title}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{copy.description}</p>
            </div>
            <div className="border-t border-[var(--border)] bg-[var(--surface-muted)] p-5 lg:border-l lg:border-t-0">
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                {getTestCategories().slice(0, 3).map((category) => (
                  <div key={category} className="rounded-md border border-[var(--border)] bg-white p-4">
                    <p className="code-font text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-soft)]">{copy.categories}</p>
                    <p className="mt-2 text-lg font-bold capitalize text-[var(--text)]">{category}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-[var(--text)]">{copy.allTests}</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tests.map(({ test, content }) => (
              <Link key={test.slug} href={`/${locale}/tests/${test.slug}`} className="group surface-card p-5 transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[var(--shadow-panel)]">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--brand-strong)] transition group-hover:bg-[var(--brand-soft)]">
                    <Brain className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="code-font text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-soft)]">{test.category}</p>
                    <h3 className="mt-1 text-lg font-bold text-[var(--text)]">{content?.title ?? test.title[locale]}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{content?.description ?? test.description[locale]}</p>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-[var(--text-muted)]">
                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-white px-2.5 py-1">
                    <Layers3 className="h-3.5 w-3.5" />
                    {test.questionCount} {copy.questions}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-white px-2.5 py-1">
                    <Clock className="h-3.5 w-3.5" />
                    {test.estimatedMinutes} {copy.minutes}
                  </span>
                </div>
                <p className="mt-5 text-sm font-semibold text-[var(--brand-strong)]">{copy.start}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

