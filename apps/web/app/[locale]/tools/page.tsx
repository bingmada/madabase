import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd, buildBreadcrumbSchema, buildItemListSchema } from "@/components/JsonLd";
import { PageViewTracker } from "@/components/PageViewTracker";
import { ToolIcon } from "@/components/ToolIcon";
import { getCategoryLabel, isLocale, locales, toolCategoryLabels } from "@/lib/i18n";
import { buildAbsoluteUrl, buildPageMetadata } from "@/lib/seo";
import { discoverableToolRegistry } from "@/lib/tool-registry";
import { loadToolContent } from "@/lib/tool-content";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildPageMetadata({
    title: locale === "en" ? "Online Developer Tools" : "在线开发者工具",
    description:
      locale === "en"
        ? "Browse online browser-based developer tools for JSON, JWT, Base64, URLs, timestamps, Markdown, SQL, regex, and more."
        : "浏览在线的浏览器端开发者工具，覆盖 JSON、JWT、Base64、URL、时间戳、Markdown、SQL、正则等。",
    locale,
    path: "/tools",
    keywords: ["developer tools", "online tools", "online formatter", "json tools", "developer tools online"],
  });
}

export default async function ToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const copy = {
    en: {
      eyebrow: "Tool directory",
      title: "Online tools for daily work and quick calculations.",
      description: "Format data, clean text, calculate common numbers, and try lightweight shareable tools directly in your browser.",
      layers: [
        {
          title: "Popular utilities",
          description: "Fast formatting, parsing, encoding, and text tools.",
        },
        {
          title: "Calculators",
          description: "BMI, calories, sleep, savings, and retirement estimates.",
        },
        {
          title: "Lifestyle tools",
          description: "Zodiac compatibility and lightweight reference tools.",
        },
      ],
      allTools: "All tools",
    },
    zh: {
      eyebrow: "工具目录",
      title: "在线工具，覆盖日常处理和常用计算。",
      description: "在浏览器中完成数据格式化、文本清理、常用计算和轻量趣味工具。",
      layers: [
        {
          title: "常用工具",
          description: "格式化、解析、编码、转换和文本处理工具。",
        },
        {
          title: "大众计算器",
          description: "BMI、卡路里、睡眠、理财目标和退休估算。",
        },
        {
          title: "生活参考工具",
          description: "星座配对和轻量生活参考工具。",
        },
      ],
      allTools: "全部工具",
    },
  }[locale];

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Madabase", item: buildAbsoluteUrl(`/${locale}`) },
    { name: locale === "en" ? "Tools" : "工具", item: buildAbsoluteUrl(`/${locale}/tools`) },
  ]);
  const itemListSchema = buildItemListSchema({
    name: copy.title,
    description: copy.description,
    url: buildAbsoluteUrl(`/${locale}/tools`),
    locale,
    items: discoverableToolRegistry.map((tool) => ({
      name: tool.h1[locale],
      description: tool.description[locale],
      url: buildAbsoluteUrl(`/${locale}/tools/${tool.slug}`),
    })),
  });

  // Load tool content for display titles
  const toolsWithContent = await Promise.all(
    discoverableToolRegistry.map(async (tool) => {
      const content = await loadToolContent(tool.slug, locale);
      return { tool, content };
    })
  );
  const toolsBySlug = new Map(toolsWithContent.map((item) => [item.tool.slug, item]));
  const calculatorSlugs = ["bmi-calculator", "calorie-calculator", "sleep-calculator", "financial-goal-calculator", "retirement-calculator"];
  const shareableSlugs = ["zodiac-compatibility", "birthday-five-elements"];
  const featuredCoreSlugs = [
    "json-formatter",
    "json-validator",
    "json-to-typescript",
    "jwt-decoder",
    "base64",
    "timestamp",
    "regex-tester",
    "qr-code-generator",
    "password-generator",
    "url-parser",
    "word-counter",
    "text-cleaner",
  ];
  const toolLayers: Array<{
    title: string;
    description: string;
    tools: Array<NonNullable<(typeof toolsWithContent)[number]> | undefined>;
  }> = [
    { ...copy.layers[0], tools: featuredCoreSlugs.map((slug) => toolsBySlug.get(slug)).filter(Boolean) },
    { ...copy.layers[1], tools: calculatorSlugs.map((slug) => toolsBySlug.get(slug)).filter(Boolean) },
    { ...copy.layers[2], tools: shareableSlugs.map((slug) => toolsBySlug.get(slug)).filter(Boolean) },
  ];

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname="/tools" />
      <main className="page-shell">
        <JsonLd id="tools-index-breadcrumbs" data={breadcrumbSchema} />
        <JsonLd id="tools-index-list" data={itemListSchema} />
        <PageViewTracker locale={locale} />
        <AdSlot locale={locale} position="header" size="banner" />
        <section className="surface-card-strong p-6 sm:p-8 lg:p-10">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">{copy.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--text-muted)]">{copy.description}</p>
        </section>

        <section className="mt-10 space-y-10">
          {toolLayers.map((layer) => (
            <section key={layer.title}>
              <div className="mb-5 max-w-3xl">
                <h2 className="text-2xl font-bold text-[var(--text)]">{layer.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{layer.description}</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {layer.tools.map((item) => item ? (
                  <Link key={item.tool.slug} href={`/${locale}/tools/${item.tool.slug}`} className="group surface-card p-5 transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[var(--shadow-panel)]">
                    <div className="flex items-start gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--brand-strong)] transition group-hover:bg-[var(--brand-soft)]">
                        <ToolIcon component={item.tool.component} />
                      </span>
                      <div>
                        <p className="text-[11px] font-semibold text-[var(--text-soft)]">{getCategoryLabel(item.tool.category, locale, toolCategoryLabels)}</p>
                        <h3 className="mt-1 text-lg font-bold text-[var(--text)]">{item.content?.h1[locale] || item.tool.slug}</h3>
                        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{item.content?.description[locale] || ""}</p>
                      </div>
                    </div>
                  </Link>
                ) : null)}
              </div>
            </section>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-[var(--text)]">{copy.allTools}</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {toolsWithContent.map(({ tool, content }) => (
              <Link key={tool.slug} href={`/${locale}/tools/${tool.slug}`} className="group surface-card p-5 transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[var(--shadow-panel)]">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--brand-strong)] transition group-hover:bg-[var(--brand-soft)]">
                    <ToolIcon component={tool.component} />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold text-[var(--text-soft)]">{getCategoryLabel(tool.category, locale, toolCategoryLabels)}</p>
                    <h3 className="mt-1 text-lg font-bold text-[var(--text)]">{content?.h1[locale] || tool.slug}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{content?.description[locale] || ""}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <AdSlot locale={locale} position="content" size="native" />
      </main>
      <Footer />
    </div>
  );
}
