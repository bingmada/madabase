import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd, buildArticleSchema, buildBreadcrumbSchema } from "@/components/JsonLd";
import { isLocale, locales } from "@/lib/i18n";
import { mbtiSeoPageMap, mbtiSeoPages } from "@/lib/mbti-seo";
import { buildAbsoluteUrl, buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    mbtiSeoPages.map((page) => ({
      locale,
      topic: page.topic,
      seoSlug: page.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; topic: string; seoSlug: string }>;
}): Promise<Metadata> {
  const { locale, topic, seoSlug } = await params;
  if (!isLocale(locale)) return {};
  const page = mbtiSeoPageMap.get(`${topic}/${seoSlug}`);
  if (!page) return {};

  return buildPageMetadata({
    title: page.title[locale],
    description: page.description[locale],
    locale,
    path: `/tests/mbti/seo/${topic}/${seoSlug}`,
    keywords: [page.type, page.secondaryType, page.title[locale], "MBTI", "personality"].filter(Boolean) as string[],
    type: "article",
  });
}

export default async function MbtiSeoPage({
  params,
}: {
  params: Promise<{ locale: string; topic: string; seoSlug: string }>;
}) {
  const { locale, topic, seoSlug } = await params;
  if (!isLocale(locale)) notFound();
  const page = mbtiSeoPageMap.get(`${topic}/${seoSlug}`);
  if (!page) notFound();

  const canonicalUrl = buildAbsoluteUrl(`/${locale}/tests/mbti/seo/${topic}/${seoSlug}`);
  const articleSchema = buildArticleSchema({
    headline: page.title[locale],
    description: page.description[locale],
    url: canonicalUrl,
    datePublished: "2026-06-15",
    locale,
  });
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Madabase", item: buildAbsoluteUrl(`/${locale}`) },
    { name: locale === "en" ? "Tests" : "测试", item: buildAbsoluteUrl(`/${locale}/tests`) },
    { name: "MBTI", item: buildAbsoluteUrl(`/${locale}/tests/mbti`) },
    { name: page.title[locale], item: canonicalUrl },
  ]);

  const copy = {
    en: {
      eyebrow: "MBTI guide",
      takeTest: "Take the MBTI test",
      related: "Related MBTI pages",
      disclaimer: "This guide is for self-reflection and SEO discovery. It is not a clinical, hiring, or relationship diagnosis.",
    },
    zh: {
      eyebrow: "MBTI 指南",
      takeTest: "开始 MBTI 测试",
      related: "相关 MBTI 页面",
      disclaimer: "本页用于自我观察和内容参考，不作为临床、招聘或亲密关系诊断。",
    },
  }[locale];

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname={`/tests/mbti/seo/${topic}/${seoSlug}`} />
      <main className="page-shell">
        <JsonLd id={`mbti-seo-article-${topic}-${seoSlug}`} data={articleSchema} />
        <JsonLd id={`mbti-seo-breadcrumbs-${topic}-${seoSlug}`} data={breadcrumbSchema} />

        <article className="surface-card-strong overflow-hidden">
          <header className="border-b border-[var(--border)] p-5 sm:p-7">
            <Breadcrumb
              items={[
                { label: "Madabase", href: `/${locale}` },
                { label: locale === "en" ? "Tests" : "测试", href: `/${locale}/tests` },
                { label: "MBTI", href: `/${locale}/tests/mbti` },
                { label: page.title[locale] },
              ]}
            />
            <p className="eyebrow mt-5">{copy.eyebrow}</p>
            <h1 className="mt-3 max-w-4xl text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">
              {page.h1[locale]}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-muted)] sm:text-lg">
              {page.description[locale]}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={`/${locale}/tests/mbti/start`} className="inline-flex h-11 items-center rounded-md bg-[var(--surface-code)] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)]">
                {copy.takeTest}
              </Link>
              <Link href={`/${locale}/tests/mbti/result/${page.type.toLowerCase()}`} className="inline-flex h-11 items-center rounded-md border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand)]">
                {page.type}
              </Link>
            </div>
          </header>

          <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
            <div className="p-5 sm:p-7">
              <div className="grid gap-5">
                {page.sections.map((section) => (
                  <section key={section.title.en} className="rounded-md border border-[var(--border)] bg-white p-5">
                    <h2 className="text-2xl font-bold text-[var(--text)]">{section.title[locale]}</h2>
                    <p className="mt-3 leading-7 text-[var(--text-muted)]">{section.body[locale]}</p>
                    <ul className="mt-4 grid gap-2">
                      {section.bullets.map((bullet) => (
                        <li key={bullet.en} className="rounded-md bg-[var(--surface-muted)] px-3 py-2 text-sm leading-6 text-[var(--text)]">
                          {bullet[locale]}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>
            </div>

            <aside className="border-t border-[var(--border)] bg-[var(--surface-muted)] p-5 sm:p-7 lg:border-l lg:border-t-0">
              <section>
                <h2 className="text-lg font-bold text-[var(--text)]">{copy.related}</h2>
                <div className="mt-4 grid gap-3">
                  {page.related.map((item) => (
                    <Link key={`${item.topic}-${item.slug}`} href={`/${locale}/tests/mbti/seo/${item.topic}/${item.slug}`} className="rounded-md border border-[var(--border)] bg-white p-3 text-sm font-semibold leading-6 text-[var(--text)] transition hover:border-[var(--brand)]">
                      {item.label[locale]}
                    </Link>
                  ))}
                </div>
              </section>
              <p className="mt-6 rounded-md border border-[var(--border)] bg-white p-3 text-xs leading-5 text-[var(--text-muted)]">
                {copy.disclaimer}
              </p>
            </aside>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
