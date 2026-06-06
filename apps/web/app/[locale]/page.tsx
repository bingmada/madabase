import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toolRegistry } from "@/lib/tools";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
// import { AdSlot } from "@/components/AdSlot";
import { ToolIcon } from "@/components/ToolIcon";

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
  return {
    title: locale === "en" ? "Madabase | Free Developer Tools" : "Madabase | 免费开发者工具",
    description:
      locale === "en"
        ? "Madabase is an SEO-first platform for free online developer tools and future AI services."
        : "Madabase 是一个 SEO 优先的免费在线开发者工具与未来 AI 服务平台。",
    alternates: { canonical: `/${locale}` },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = {
    en: {
      eyebrow: "Developer workbench",
      title: "Madabase",
      description: "A focused collection of browser-first developer tools, AI workflows later.",
      tools: "Tool matrix",
      console: "10 live tools / 2 locales / SSR pages",
    },
    zh: {
      eyebrow: "开发者工作台",
      title: "Madabase",
      description: "一个浏览器优先的开发者工具集合，后续会扩展 AI 工作流。",
      tools: "工具矩阵",
      console: "10 个在线工具 / 2 种语言 / SSR 页面",
    },
  }[locale];

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname="/" />
      <main className="page-shell">
        {/* <AdSlot locale={locale} position="header" /> */}
        <section className="surface-card-strong overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="eyebrow">{copy.eyebrow}</p>
              <h1 className="mt-5 text-5xl font-black tracking-tight text-[var(--text)] sm:text-6xl">{copy.title}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{copy.description}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={`/${locale}/tools`} className="inline-flex h-11 items-center rounded-md bg-[var(--surface-code)] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)]">
                  {locale === "en" ? "Open tools" : "打开工具"}
                </Link>
                <Link href={`/${locale}/ai`} className="inline-flex h-11 items-center rounded-md border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand)]">
                  {locale === "en" ? "View AI roadmap" : "查看 AI 规划"}
                </Link>
              </div>
            </div>
            <div className="workbench-grid border-t border-[var(--border)] bg-[var(--surface-muted)] p-5 lg:border-l lg:border-t-0">
              <div className="rounded-md border border-[var(--border-strong)] bg-[var(--surface-code)] p-4 text-white shadow-[var(--shadow-panel)]">
                <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="code-font text-xs uppercase tracking-[0.18em] text-teal-100">madabase.run</span>
                  <span className="h-2 w-2 rounded-full bg-[var(--success)]" />
                </div>
                <div className="code-font space-y-2 text-sm text-[#dbe4df]">
                  <p><span className="text-amber-300">$</span> load tools.registry</p>
                  <p className="text-teal-200">{copy.console}</p>
                  <p><span className="text-amber-300">$</span> route /{locale}/tools/json-formatter</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-bold text-[var(--text)]">{copy.tools}</h2>
            <p className="code-font hidden text-xs uppercase tracking-[0.16em] text-[var(--text-soft)] sm:block">SSR / i18n / SEO ready</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {toolRegistry.map((tool) => (
              <ToolCard key={tool.slug} locale={locale} slug={tool.slug} title={tool.h1[locale]} description={tool.description[locale]} component={tool.component} />
            ))}
          </div>
          {/* <AdSlot locale={locale} position="content" /> */}
        </section>

        {/* <section className="surface-card mt-16 p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-[var(--text)]">{locale === "en" ? "Platform principles" : "平台原则"}</h2>
          <ul className="mt-5 grid gap-3 text-sm leading-6 text-[var(--text-muted)] sm:grid-cols-2">
            <li className="rounded-md bg-[var(--surface-muted)] px-4 py-3">{locale === "en" ? "No static export; SSR-friendly architecture" : "不使用静态导出，保持 SSR 友好"}</li>
            <li className="rounded-md bg-[var(--surface-muted)] px-4 py-3">{locale === "en" ? "Database-free first release" : "首版不接数据库"}</li>
            <li className="rounded-md bg-[var(--surface-muted)] px-4 py-3">{locale === "en" ? "Path-based localization" : "基于路径的国际化"}</li>
            <li className="rounded-md bg-[var(--surface-muted)] px-4 py-3">{locale === "en" ? "Registry-driven tool pages" : "工具页面由注册表驱动"}</li>
          </ul>
        </section> */}
      </main>
      <Footer />
    </div>
  );
}
