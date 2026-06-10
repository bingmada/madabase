import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PageViewTracker } from "@/components/PageViewTracker";
import { ToolIcon } from "@/components/ToolIcon";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd, buildBreadcrumbSchema } from "@/components/JsonLd";
import { PopularToolsClient } from "@/components/PopularToolsClient";
import { isPremium, premiumFeatures } from "@/lib/features";
import { getLatestBlogPosts } from "@/lib/blog";
import { buildAbsoluteUrl, buildPageMetadata } from "@/lib/seo";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { getPopularTools, getToolsByCategory, toolRegistry } from "@/lib/tools";

function ToolCard({
  locale,
  slug,
  title,
  description,
  component,
}: {
  locale: Locale;
  slug: string;
  title: string;
  description: string;
  component: (typeof toolRegistry)[number]["component"];
}) {
  return (
    <Link href={`/${locale}/tools/${slug}`} className="group surface-card p-4 transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[var(--shadow-panel)]">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--brand-strong)] transition group-hover:bg-[var(--brand-soft)]">
          <ToolIcon component={component} />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-[var(--text)]">{title}</h3>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-[var(--text-muted)]">{description}</p>
        </div>
      </div>
    </Link>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildPageMetadata({
    title: locale === "en" ? "Madabase - AI & Developer Tools" : "Madabase - AI 与开发者工具",
    description:
      locale === "en"
        ? "Madabase is an SEO-first platform for free online developer tools, productivity resources, and future AI workflows."
        : "Madabase 是一个 SEO 优先的免费在线开发者工具、生产力内容与未来 AI 工作流平台。",
    locale,
    path: "/",
    keywords: ["developer tools", "ai tools", "online formatter", "madabase", "free online tools"],
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const popularTools = getPopularTools();
  const latestPosts = await getLatestBlogPosts(locale, 4);
  const categoryCards = [
    {
      key: "developer",
      title: locale === "en" ? "Developer Tools" : "开发者工具",
      description: locale === "en" ? "JSON, JWT, SQL, regex, cron, hash, and more." : "JSON、JWT、SQL、正则、cron、hash 等工具。",
      tools: getToolsByCategory("developer").slice(0, 4),
    },
    {
      key: "web",
      title: locale === "en" ? "Web Tools" : "Web 工具",
      description: locale === "en" ? "Encoding, HTML, CSS, URLs, and QR workflows." : "编码、HTML、CSS、URL 与二维码工具。",
      tools: getToolsByCategory("web").slice(0, 4),
    },
    {
      key: "creator",
      title: locale === "en" ? "Creator & Text" : "创作与文本",
      description: locale === "en" ? "Markdown, counters, slugs, and content cleanup tools." : "Markdown、计数、slug 与内容清理工具。",
      tools: [...getToolsByCategory("creator"), ...getToolsByCategory("text")].slice(0, 4),
    },
  ];

  const copy = {
    en: {
      eyebrow: "AI & Developer Tools",
      title: "Madabase",
      description: "A growing library of free browser-first tools, SEO-friendly landing pages, and practical content designed to earn search traffic.",
      primaryCta: "Explore Tools",
      secondaryCta: "Popular Tools",
      popular: "Popular Tools",
      categories: "Categories",
      latestBlog: "Latest Blog",
      premiumPreview: "Premium Preview",
      premiumDescription: "Feature flags are now in place for future upgrades like ad-free usage, larger files, and export workflows.",
      featureOn: "Enabled",
      featureOff: "Coming soon",
    },
    zh: {
      eyebrow: "AI 与开发者工具",
      title: "Madabase",
      description: "一个持续增长的免费浏览器工具与 SEO 内容平台，专注获取搜索流量并承接未来 AI 产品。",
      primaryCta: "探索工具",
      secondaryCta: "热门工具",
      popular: "热门工具",
      categories: "分类",
      latestBlog: "最新博客",
      premiumPreview: "高级功能预览",
      premiumDescription: "已为未来升级版能力预留 feature flags，包括去广告、大文件处理与导出流程。",
      featureOn: "已启用",
      featureOff: "即将推出",
    },
  }[locale];

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Madabase", item: buildAbsoluteUrl(`/${locale}`) },
  ]);

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname="/" />
      <main className="page-shell">
        <JsonLd id="home-breadcrumbs" data={breadcrumbSchema} />
        <PageViewTracker locale={locale} />
        <AdSlot locale={locale} position="header" size="banner" />
        <section className="surface-card-strong overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="eyebrow">{copy.eyebrow}</p>
              <h1 className="mt-5 text-5xl font-black tracking-tight text-[var(--text)] sm:text-6xl">{copy.title}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{copy.description}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={`/${locale}/tools`} className="inline-flex h-11 items-center rounded-md bg-[var(--surface-code)] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)]">
                  {copy.primaryCta}
                </Link>
                <a href="#popular-tools" className="inline-flex h-11 items-center rounded-md border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand)]">
                  {copy.secondaryCta}
                </a>
              </div>
              <PopularToolsClient locale={locale} />
            </div>
            <div className="workbench-grid border-t border-[var(--border)] bg-[var(--surface-muted)] p-5 lg:border-l lg:border-t-0">
              <div className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-code)] p-4 text-white shadow-[var(--shadow-panel)]">
                <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="code-font text-xs uppercase tracking-[0.18em] text-teal-100">madabase.run</span>
                  <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
                </div>
                <div className="code-font space-y-2 text-sm text-[#dbe4df]">
                  <p><span className="text-amber-300">$</span> tools.count {toolRegistry.length}</p>
                  <p><span className="text-amber-300">$</span> locales {locales.length}</p>
                  <p><span className="text-amber-300">$</span> route /{locale}/tools/json-formatter</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14" id="popular-tools">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-[var(--text)]">{copy.popular}</h2>
            <p className="code-font hidden text-xs uppercase tracking-[0.16em] text-[var(--text-soft)] sm:block">search intent / evergreen / tools-first</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popularTools.map((tool) => (
              <ToolCard key={tool.slug} locale={locale} slug={tool.slug} title={tool.h1[locale]} description={tool.description[locale]} component={tool.component} />
            ))}
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-[var(--text)]">{copy.categories}</h2>
            <Link href={`/${locale}/blog`} className="text-sm font-semibold text-[var(--brand-strong)]">{locale === "en" ? "Read the blog" : "查看博客"}</Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {categoryCards.map((category) => (
              <section key={category.key} className="surface-card p-5">
                <h3 className="text-lg font-bold text-[var(--text)]">{category.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{category.description}</p>
                <div className="mt-4 space-y-3">
                  {category.tools.map((tool) => (
                    <Link key={tool.slug} href={`/${locale}/tools/${tool.slug}`} className="block rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]">
                      {tool.h1[locale]}
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
          <AdSlot locale={locale} position="content" size="native" />
        </section>

        <section className="mt-14 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="surface-card p-5">
            <div className="mb-5 flex items-end justify-between gap-4">
              <h2 className="text-2xl font-bold text-[var(--text)]">{copy.latestBlog}</h2>
              <Link href={`/${locale}/blog`} className="text-sm font-semibold text-[var(--brand-strong)]">{locale === "en" ? "Browse all" : "查看全部"}</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {latestPosts.map((post) => (
                <Link key={post.slug} href={`/${locale}/blog/${post.slug}`} className="rounded-md border border-[var(--border)] bg-white p-4 transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]">
                  <p className="code-font text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">{post.date}</p>
                  <h3 className="mt-2 text-lg font-semibold text-[var(--text)]">{post.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{post.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="surface-card p-5">
            <h2 className="text-2xl font-bold text-[var(--text)]">{copy.premiumPreview}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{copy.premiumDescription}</p>
            <div className="mt-5 space-y-3">
              {Object.keys(premiumFeatures).map((feature) => (
                <div key={feature} className="flex items-center justify-between rounded-md border border-[var(--border)] bg-white px-4 py-3">
                  <span className="code-font text-sm text-[var(--text)]">{feature}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isPremium(feature as keyof typeof premiumFeatures) ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {isPremium(feature as keyof typeof premiumFeatures) ? copy.featureOn : copy.featureOff}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
