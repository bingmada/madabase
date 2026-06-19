import type { Metadata } from "next";
import Link from "next/link";
import { Brain, Clock, Layers3 } from "lucide-react";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd, buildBreadcrumbSchema } from "@/components/JsonLd";
import { PageViewTracker } from "@/components/PageViewTracker";
import { getCategoryLabel, isLocale, locales, testCategoryLabels } from "@/lib/i18n";
import { buildAbsoluteUrl, buildPageMetadata } from "@/lib/seo";
import { loadTestContent } from "@/lib/test-content";
import { testRegistry } from "@/lib/test-registry";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return buildPageMetadata({
    title: locale === "en" ? "Online Personality Tests" : "在线人格测试",
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
      description: "Explore personality, career, relationship, and resilience tests. Get a quick result first, then use credits to unlock deeper full reports when you want more detail.",
      allTests: "All tests",
      questions: "questions",
      minutes: "min",
      start: "Start test",
    },
    zh: {
      eyebrow: "测试平台",
      title: "面向人格、职业与自我探索的互动测试。",
      description: "这里包含人格、职业、关系、压力与复原力等多类测试。你可以先获得快速结果，想了解更深入的分析时，再使用积分解锁完整报告。",
      allTests: "全部测试",
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

        <section className="surface-card-strong p-6 sm:p-8 lg:p-10">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">{copy.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">{copy.description}</p>
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
                    <p className="text-[11px] font-semibold text-[var(--text-soft)]">{getCategoryLabel(test.category, locale, testCategoryLabels)}</p>
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
