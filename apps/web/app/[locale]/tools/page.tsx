import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ToolIcon } from "@/components/ToolIcon";
import { isLocale, locales } from "@/lib/i18n";
import { toolRegistry } from "@/lib/tools";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: locale === "en" ? "Free Online Developer Tools | Madabase" : "免费在线开发者工具 | Madabase",
    description:
      locale === "en"
        ? "Browse free browser-based developer tools for JSON, JWT, Base64, URLs, timestamps, Markdown, and HTML."
        : "浏览免费的浏览器端开发者工具，覆盖 JSON、JWT、Base64、URL、时间戳、Markdown 和 HTML。",
    alternates: { canonical: `/${locale}/tools` },
  };
}

export default async function ToolsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const copy = {
    en: {
      eyebrow: "Tool directory",
      title: "A clean bench for everyday developer work.",
      description: "Format, validate, encode, decode, generate, and preview common developer inputs directly in your browser.",
    },
    zh: {
      eyebrow: "工具目录",
      title: "面向日常开发工作的清爽工作台。",
      description: "在浏览器中直接完成格式化、校验、编码、解码、生成和预览等常见开发任务。",
    },
  }[locale];

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname="/tools" />
      <main className="page-shell">
        <AdSlot locale={locale} position="header" />
        <section className="surface-card-strong overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="eyebrow">{copy.eyebrow}</p>
              <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">{copy.title}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{copy.description}</p>
            </div>
            <div className="workbench-grid border-t border-[var(--border)] bg-[var(--surface-muted)] p-5 lg:border-l lg:border-t-0">
              <div className="grid grid-cols-5 gap-2">
                {toolRegistry.slice(0, 10).map((tool) => (
                  <div key={tool.slug} className="grid aspect-square place-items-center rounded-md border border-[var(--border)] bg-white text-[var(--brand-strong)] shadow-sm">
                    <ToolIcon component={tool.component} className="h-5 w-5" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {toolRegistry.map((tool) => (
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
        <AdSlot locale={locale} position="content" />
      </main>
      <Footer />
    </div>
  );
}
