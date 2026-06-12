import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd, buildBreadcrumbSchema } from "@/components/JsonLd";
import { PageViewTracker } from "@/components/PageViewTracker";
import { ToolIcon } from "@/components/ToolIcon";
import { Breadcrumb } from "@/components/Breadcrumb";
import { isLocale, locales } from "@/lib/i18n";
import { buildAbsoluteUrl, buildPageMetadata } from "@/lib/seo";
import { getToolsByCategory, getCategories, type ToolCategory } from "@/lib/tool-registry";

const categoryMeta: Record<ToolCategory, { en: { title: string; description: string; keywords: string[] }; zh: { title: string; description: string; keywords: string[] } }> = {
  developer: {
    en: { title: "Developer Tools", description: "Free browser-based developer tools for JSON, JWT, SQL, regex, timestamps, and more. No sign-up required.", keywords: ["developer tools", "json tools", "jwt decoder", "sql formatter", "regex tester", "timestamp converter"] },
    zh: { title: "开发者工具", description: "免费的浏览器端开发者工具，覆盖 JSON、JWT、SQL、正则、时间戳等。无需注册。", keywords: ["开发者工具", "json 工具", "jwt 解码器", "sql 格式化", "正则测试", "时间戳转换"] },
  },
  web: {
    en: { title: "Web Tools", description: "Encoding, HTML, CSS, URLs, QR codes, and web workflow tools. All running locally in your browser.", keywords: ["web tools", "html formatter", "css formatter", "url encoder", "qr code generator"] },
    zh: { title: "Web 工具", description: "编码、HTML、CSS、URL、二维码等 Web 工作流工具。全部在浏览器本地运行。", keywords: ["web 工具", "html 格式化", "css 格式化", "url 编码", "二维码生成"] },
  },
  text: {
    en: { title: "Text Tools", description: "Word counters, character counters, case converters, text cleaners, and slug generators for content workflows.", keywords: ["text tools", "word counter", "character counter", "case converter", "text cleaner", "slug generator"] },
    zh: { title: "文本工具", description: "字数统计、字符计数、大小写转换、文本清理和 slug 生成工具。", keywords: ["文本工具", "字数统计", "字符计数", "大小写转换", "文本清理", "slug 生成"] },
  },
  creator: {
    en: { title: "Creator Tools", description: "Markdown preview, content formatting, and creative writing tools for creators and bloggers.", keywords: ["creator tools", "markdown preview", "content tools", "writing tools"] },
    zh: { title: "创作工具", description: "Markdown 预览、内容格式化和创作者、写作者工具。", keywords: ["创作工具", "markdown 预览", "内容工具", "写作工具"] },
  },
  ai: {
    en: { title: "AI Tools", description: "AI-powered tools and workflows coming soon.", keywords: ["ai tools", "artificial intelligence", "machine learning"] },
    zh: { title: "AI 工具", description: "AI 驱动的工具和工作流即将推出。", keywords: ["ai 工具", "人工智能", "机器学习"] },
  },
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getCategories().map((category) => ({ locale, category }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string }> }): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isLocale(locale)) return {};
  if (!getCategories().includes(category as ToolCategory)) return {};

  const meta = categoryMeta[category as ToolCategory];
  return buildPageMetadata({
    title: meta[locale].title,
    description: meta[locale].description,
    locale,
    path: `/tools/category/${category}`,
    keywords: meta[locale].keywords,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale, category } = await params;
  if (!isLocale(locale)) notFound();
  if (!getCategories().includes(category as ToolCategory)) notFound();

  const tools = getToolsByCategory(category as ToolCategory);
  const meta = categoryMeta[category as ToolCategory];

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Madabase", item: buildAbsoluteUrl(`/${locale}`) },
    { name: locale === "en" ? "Tools" : "工具", item: buildAbsoluteUrl(`/${locale}/tools`) },
    { name: meta[locale].title, item: buildAbsoluteUrl(`/${locale}/tools/category/${category}`) },
  ]);

  const copy = {
    en: {
      allTools: "All Tools",
      toolsInCategory: `tools in this category`,
    },
    zh: {
      allTools: "全部工具",
      toolsInCategory: `个此类别的工具`,
    },
  }[locale];

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname={`/tools/category/${category}`} />
      <main className="page-shell">
        <JsonLd id={`category-${category}-breadcrumbs`} data={breadcrumbSchema} />
        <PageViewTracker locale={locale} />
        <AdSlot locale={locale} position="header" size="banner" />

        <section className="surface-card-strong overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-10">
            <Breadcrumb
              items={[
                { label: "Madabase", href: `/${locale}` },
                { label: locale === "en" ? "Tools" : "工具", href: `/${locale}/tools` },
                { label: meta[locale].title },
              ]}
            />
            <h1 className="mt-6 text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">{meta[locale].title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{meta[locale].description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href={`/${locale}/tools`} className="text-sm font-semibold text-[var(--brand-strong)]">
                {copy.allTools}
              </Link>
              <span className="text-sm text-[var(--text-soft)]">
                {tools.length} {copy.toolsInCategory}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link key={tool.slug} href={`/${locale}/tools/${tool.slug}`} className="group surface-card p-5 transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[var(--shadow-panel)]">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-[var(--border)] bg-[var(--surface-muted)] text-[var(--brand-strong)] transition group-hover:bg-[var(--brand-soft)]">
                  <ToolIcon component={tool.component} />
                </span>
                <div>
                  <p className="code-font text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-soft)]">{tool.category}</p>
                  <h2 className="mt-1 text-lg font-bold text-[var(--text)]">{tool.h1[locale]}</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{tool.description[locale]}</p>
                </div>
              </div>
            </Link>
          ))}
        </section>
        <AdSlot locale={locale} position="content" size="native" />
      </main>
      <Footer />
    </div>
  );
}
