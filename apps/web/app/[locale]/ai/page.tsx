import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bot, FileText, PenLine } from "lucide-react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { aiProducts } from "@/lib/ai-products";
import { isLocale, locales } from "@/lib/i18n";

const aiIcons = [Bot, FileText, PenLine];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: locale === "en" ? "Madabase AI Tools" : "Madabase AI 工具",
    description:
      locale === "en"
        ? "Future Madabase AI products for prompt optimization, resumes, and writing workflows."
        : "Madabase 未来 AI 产品，覆盖 Prompt 优化、简历生成和写作工作流。",
    alternates: { canonical: `/${locale}/ai` },
  };
}

export default async function AiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const copy = {
    en: {
      eyebrow: "AI roadmap",
      title: "Future AI workflows, staged with care.",
      description: "The first launch focuses on free tools. These pages keep the future AI product structure visible without adding premature backend complexity.",
    },
    zh: {
      eyebrow: "AI 路线图",
      title: "为未来 AI 工作流预留清晰结构。",
      description: "首版聚焦免费工具。这些页面先保留未来 AI 产品结构，不提前引入复杂后端。",
    },
  }[locale];

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname="/ai" />
      <main className="page-shell">
        <section className="surface-card-strong overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1fr_0.8fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="eyebrow">{copy.eyebrow}</p>
              <h1 className="mt-4 max-w-2xl text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">{copy.title}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">{copy.description}</p>
            </div>
            <div className="workbench-grid border-t border-[var(--border)] bg-[var(--surface-muted)] p-5 lg:border-l lg:border-t-0">
              <div className="rounded-md border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-soft)]">
                <p className="code-font text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-soft)]">planned modules</p>
                <div className="mt-4 space-y-3">
                  {aiProducts.map((product, index) => {
                    const Icon = aiIcons[index] ?? Bot;
                    return (
                      <div key={product.slug} className="flex items-center gap-3 rounded-md bg-[var(--surface-muted)] px-3 py-2">
                        <Icon className="h-4 w-4 text-[var(--brand-strong)]" aria-hidden="true" />
                        <span className="text-sm font-semibold text-[var(--text)]">{product.title[locale]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 grid gap-5 md:grid-cols-3">
          {aiProducts.map((product, index) => {
            const Icon = aiIcons[index] ?? Bot;
            return (
            <Link key={product.slug} href={`/${locale}/ai/${product.slug}`} className="group surface-card p-5 transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[var(--shadow-panel)]">
              <span className="grid h-11 w-11 place-items-center rounded-md border border-[var(--border)] bg-[var(--accent-soft)] text-[var(--accent)] transition group-hover:bg-[var(--brand-soft)] group-hover:text-[var(--brand-strong)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-bold text-[var(--text)]">{product.title[locale]}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{product.description[locale]}</p>
            </Link>
            );
          })}
        </section>
      </main>
      <Footer />
    </div>
  );
}
