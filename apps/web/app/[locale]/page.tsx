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
import { PersonalizedToolsPanel } from "@/components/PersonalizedToolsPanel";
import { getCurrentUser } from "@/lib/auth/services/sessionService";
import { getLatestBlogPosts } from "@/lib/blog";
import { buildAbsoluteUrl, buildPageMetadata, getTestSiteUrl } from "@/lib/seo";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { getPopularTools, getToolsByCategory, toolRegistry } from "@/lib/tool-registry";

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
    title: locale === "en" ? "Madabase - Online Developer Tools" : "Madabase - 在线开发者工具",
    description:
      locale === "en"
        ? "Madabase is a browser-first library of online developer tools for JSON, JWT, Base64, URLs, timestamps, Markdown, SQL, regex, and practical workflows."
        : "Madabase 是一个浏览器优先的在线开发者工具库，覆盖 JSON、JWT、Base64、URL、时间戳、Markdown、SQL、正则和实用工作流。",
    locale,
    path: "/",
    keywords: ["developer tools", "online formatter", "json formatter", "online tools", "madabase"],
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const popularTools = getPopularTools();
  const latestPosts = await getLatestBlogPosts(locale, 4);
  const user = await getCurrentUser();
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
  const buyingGuides = [
    {
      href: "https://network.madabase.com",
      title: locale === "en" ? "Home network picks" : "家庭网络选购",
      description: locale === "en" ? "Mesh Wi-Fi, routers, Ethernet, and backup power notes." : "Mesh Wi-Fi、路由器、网线网络和备用电源选购笔记。",
    },
    {
      href: "https://homeoffice.madabase.com",
      title: locale === "en" ? "Home office picks" : "居家办公选购",
      description: locale === "en" ? "Desks, chairs, monitor arms, lighting, and setup trade-offs." : "桌子、椅子、显示器支架、灯光和办公配置取舍。",
    },
    {
      href: "https://baby.madabase.com",
      title: locale === "en" ? "Baby gear picks" : "母婴用品选购",
      description: locale === "en" ? "Monitors, strollers, carriers, feeding, and nursery routines." : "监控器、推车、背带、喂养和睡眠用品选购。",
    },
    {
      href: "https://pets.madabase.com",
      title: locale === "en" ? "Pet gear picks" : "宠物用品选购",
      description: locale === "en" ? "Feeders, cameras, beds, litter, pet hair, and air quality." : "喂食器、摄像头、窝垫、猫砂、毛发和空气质量用品。",
    },
    {
      href: "https://smarthome.madabase.com",
      title: locale === "en" ? "Smart-home picks" : "智能家居选购",
      description: locale === "en" ? "Locks, doorbells, thermostats, Matter, Thread, and setup checks." : "门锁、门铃、温控器、Matter、Thread 和安装检查。",
    },
    {
      href: "https://style.madabase.com",
      title: locale === "en" ? "Style accessory picks" : "穿搭配饰选购",
      description: locale === "en" ? "Statement jewelry, bags, hair accessories, scarves, and socks." : "个性耳饰、包、发饰、丝巾和袜子搭配选购。",
    },
  ];

  const copy = {
    en: {
      eyebrow: "Online developer tools",
      title: "Madabase",
      description: "A growing library of browser-first developer tools, practical calculators, and reference pages for everyday workflows.",
      primaryCta: "Explore Tools",
      secondaryCta: "Take Tests",
      popular: "Popular Tools",
      categories: "Categories",
      latestBlog: "Latest Blog",
      loginTitle: "Log in to make the tools yours",
      loginDescription: "Save favorite tools, see recently used tools, and continue common workflows faster next time.",
      loginCta: "Log in",
    },
    zh: {
      eyebrow: "在线开发者工具",
      title: "Madabase",
      description: "一个持续增长的浏览器端开发者工具、常用计算器与实用内容平台。",
      primaryCta: "探索工具",
      secondaryCta: "开始测试",
      popular: "热门工具",
      categories: "分类",
      latestBlog: "最新博客",
      loginTitle: "登录后使用更顺手",
      loginDescription: "登录后可以收藏常用工具、查看最近使用记录，下次继续处理会更快。",
      loginCta: "去登录",
    },
  }[locale];

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Madabase", item: buildAbsoluteUrl(`/${locale}`) },
  ]);
  const testSiteUrl = getTestSiteUrl();

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname="/" />
      <main className="page-shell">
        <JsonLd id="home-breadcrumbs" data={breadcrumbSchema} />
        <PageViewTracker locale={locale} />
        <AdSlot locale={locale} position="header" size="banner" />
        <section className="surface-card-strong p-6 sm:p-8 lg:p-10">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="mt-5 text-5xl font-black tracking-tight text-[var(--text)] sm:text-6xl">{copy.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">{copy.description}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/${locale}/tools`} className="inline-flex h-11 items-center rounded-md bg-[var(--surface-code)] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)]">
              {copy.primaryCta}
            </Link>
            <Link href={`${testSiteUrl}/${locale}`} className="inline-flex h-11 items-center rounded-md border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand)]">
              {copy.secondaryCta}
            </Link>
          </div>
          {!user ? (
            <div className="mt-6 max-w-3xl rounded-md border border-[var(--border)] bg-white p-4">
              <p className="text-sm font-semibold text-[var(--text)]">{copy.loginTitle}</p>
              <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{copy.loginDescription}</p>
              <Link href={`/${locale}/login`} className="mt-3 inline-flex h-10 items-center rounded-md bg-[var(--surface-code)] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)]">
                {copy.loginCta}
              </Link>
            </div>
          ) : null}
          <PopularToolsClient locale={locale} />
        </section>

        <PersonalizedToolsPanel locale={locale} />
        <section className="mt-14" id="popular-tools">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-[var(--text)]">{copy.popular}</h2>
            <p className="code-font hidden text-xs uppercase tracking-[0.16em] text-[var(--text-soft)] sm:block">browser tools / examples / references</p>
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
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-[var(--text)]">{category.title}</h3>
                  <Link href={`/${locale}/tools/category/${category.key}`} className="text-xs font-semibold text-[var(--brand-strong)]">
                    {locale === "en" ? "View all" : "查看全部"}
                  </Link>
                </div>
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

        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-[var(--text)]">{locale === "en" ? "Practical buying guides" : "实用选购指南"}</h2>
            <p className="code-font hidden text-xs uppercase tracking-[0.16em] text-[var(--text-soft)] sm:block">research notes / comparisons / checklists</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {buyingGuides.map((guide) => (
              <a key={guide.href} href={guide.href} className="rounded-md border border-[var(--border)] bg-white p-4 transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]">
                <h3 className="text-base font-semibold text-[var(--text)]">{guide.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{guide.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-14">
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
        </section>
      </main>
      <Footer />
    </div>
  );
}
