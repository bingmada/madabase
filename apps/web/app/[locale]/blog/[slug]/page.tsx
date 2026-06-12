import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd, buildArticleSchema, buildBreadcrumbSchema } from "@/components/JsonLd";
import { PageViewTracker } from "@/components/PageViewTracker";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getAllBlogPosts, getBlogPost } from "@/lib/blog";
import { isLocale, locales } from "@/lib/i18n";
import { buildAbsoluteUrl, buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  const params = locales.map(async (locale) => {
    const posts = await getAllBlogPosts(locale);
    return posts.map((post) => ({ locale, slug: post.slug }));
  });

  return Promise.all(params).then((items) => items.flat());
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const post = await getBlogPost(locale, slug);
  if (!post) return {};

  return buildPageMetadata({
    title: post.title,
    description: post.description,
    locale,
    path: `/blog/${post.slug}`,
    keywords: [post.slug, "developer blog", "online tools", "free online tools"],
    type: "article",
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const post = await getBlogPost(locale, slug);
  if (!post) notFound();

  const canonicalUrl = buildAbsoluteUrl(`/${locale}/blog/${post.slug}`);
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Madabase", item: buildAbsoluteUrl(`/${locale}`) },
    { name: locale === "en" ? "Blog" : "博客", item: buildAbsoluteUrl(`/${locale}/blog`) },
    { name: post.title, item: canonicalUrl },
  ]);
  const articleSchema = buildArticleSchema({
    headline: post.title,
    description: post.description,
    url: canonicalUrl,
    datePublished: post.date,
    locale,
  });

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname={`/blog/${post.slug}`} />
      <main className="content-shell">
        <JsonLd id={`blog-breadcrumbs-${post.slug}`} data={breadcrumbSchema} />
        <JsonLd id={`blog-article-${post.slug}`} data={articleSchema} />
        <PageViewTracker locale={locale} />
        <AdSlot locale={locale} position="header" size="banner" />
        <article className="surface-card-strong overflow-hidden">
          <header className="border-b border-[var(--border)] p-6 sm:p-8">
            <Breadcrumb
              items={[
                { label: "Madabase", href: `/${locale}` },
                { label: locale === "en" ? "Blog" : "博客", href: `/${locale}/blog` },
                { label: post.title },
              ]}
            />
            <p className="code-font text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">{post.date}</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text)]">{post.title}</h1>
            <p className="mt-4 text-lg leading-8 text-[var(--text-muted)]">{post.description}</p>
          </header>
          <section className="article-content p-6 sm:p-8">
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
          </section>
          <footer className="border-t border-[var(--border)] p-6 sm:p-8">
            <Link href={`/${locale}/blog`} className="text-sm font-semibold text-[var(--brand-strong)]">
              {locale === "en" ? "Back to blog" : "返回博客列表"}
            </Link>
          </footer>
        </article>
        <AdSlot locale={locale} position="inline" size="native" />
      </main>
      <Footer />
    </div>
  );
}
