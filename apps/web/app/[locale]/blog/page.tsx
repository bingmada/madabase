import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageViewTracker } from "@/components/PageViewTracker";
import { AdSlot } from "@/components/AdSlot";
import { getAllBlogPosts } from "@/lib/blog";
import { isLocale, locales } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return buildPageMetadata({
    title: locale === "en" ? "Madabase Blog" : "Madabase 博客",
    description:
      locale === "en"
        ? "Read practical guides about JSON, JWT, Base64, Markdown, regex, timestamps, and developer productivity."
        : "阅读关于 JSON、JWT、Base64、Markdown、正则、时间戳和开发者生产力的实用文章。",
    locale,
    path: "/blog",
    keywords: ["developer blog", "json guide", "jwt explained", "regex tutorial"],
  });
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const posts = await getAllBlogPosts(locale);

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname="/blog" />
      <main className="page-shell">
        <PageViewTracker locale={locale} />
        <AdSlot locale={locale} position="header" size="banner" />
        <section className="surface-card-strong p-6 sm:p-8 lg:p-10">
          <p className="eyebrow">{locale === "en" ? "Blog" : "博客"}</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">
            {locale === "en" ? "Practical guides for tools, formats, and web workflows." : "围绕工具、格式与 Web 工作流的实用内容。"}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">
            {locale === "en"
              ? "Madabase combines free browser tools with SEO-friendly articles that explain the concepts behind everyday developer tasks."
              : "Madabase 将免费浏览器工具与 SEO 内容结合起来，让每个页面同时具备实用性与解释能力。"}
          </p>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-2">
          {posts.map((post) => (
            <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="group surface-card p-5 transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[var(--shadow-panel)]">
              <p className="code-font text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">{post.date}</p>
              <h2 className="mt-3 text-2xl font-bold text-[var(--text)]">{post.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{post.description}</p>
              <p className="mt-5 text-sm font-semibold text-[var(--brand-strong)]">{locale === "en" ? "Read article" : "阅读全文"}</p>
            </Link>
          ))}
        </section>

        <AdSlot locale={locale} position="content" size="native" />
      </main>
      <Footer />
    </div>
  );
}
