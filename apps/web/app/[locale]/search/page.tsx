import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SearchClient } from "@/components/SearchClient";
import { isLocale, locales } from "@/lib/i18n";
import { buildPageMetadata, withNoIndex } from "@/lib/seo";
import { getSearchIndex } from "@/lib/search-index";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return withNoIndex(buildPageMetadata({
    title: locale === "en" ? "Search Madabase" : "搜索 Madabase",
    description: locale === "en" ? "Search tools, tests, and articles on Madabase." : "搜索 Madabase 的工具、测试和文章。",
    locale,
    path: "/search",
    keywords: ["search", "tools", "tests", "madabase"],
  }));
}

export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const items = await getSearchIndex(locale);

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname="/search" />
      <main className="page-shell">
        <section className="surface-card-strong p-6 sm:p-8 lg:p-10">
          <p className="eyebrow">{locale === "en" ? "Site search" : "站内搜索"}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">{locale === "en" ? "Search tools, tests, and articles." : "搜索工具、测试和文章。"}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">{locale === "en" ? "Find the page you need without browsing every category." : "不用逐个分类翻找，直接找到需要的页面。"}</p>
        </section>
        <div className="mt-10">
          <SearchClient locale={locale} items={items} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
