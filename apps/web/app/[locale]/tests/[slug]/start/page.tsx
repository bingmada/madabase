import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TestReferralCapture } from "@/components/tests/TestReferralCapture";
import { TestRunner } from "@/components/tests/TestRunner";
import { isLocale, locales } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { loadTestContent } from "@/lib/test-content";
import { testMap, testRegistry } from "@/lib/test-registry";

export function generateStaticParams() {
  return locales.flatMap((locale) => testRegistry.map((test) => ({ locale, slug: test.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const test = testMap.get(slug);
  if (!test) return {};

  return buildPageMetadata({
    title: locale === "en" ? `Start ${test.title.en}` : `开始${test.title.zh}`,
    description: test.description[locale],
    locale,
    path: `/tests/${slug}/start`,
    keywords: test.seo[locale].keywords,
  });
}

export default async function TestStartPage({
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

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname={`/tests/${slug}`} />
      <main className="page-shell">
        <TestReferralCapture code={ref} testSlug={slug} />
        <TestRunner locale={locale} slug={slug} questions={content.questions} />
      </main>
      <Footer />
    </div>
  );
}
