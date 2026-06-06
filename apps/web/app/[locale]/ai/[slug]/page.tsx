import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Bot } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { aiProductMap, aiProducts } from "@/lib/ai-products";
import { isLocale, locales } from "@/lib/i18n";

type PageParams = {
  locale: string;
  slug: string;
};

export function generateStaticParams() {
  return locales.flatMap((locale) => aiProducts.map((product) => ({ locale, slug: product.slug })));
}

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const product = aiProductMap.get(slug);
  if (!product) return {};
  return {
    title: `${product.title[locale]} | Madabase AI`,
    description: product.description[locale],
    alternates: { canonical: `/${locale}/ai/${product.slug}` },
  };
}

export default async function AiPlaceholderPage({ params }: { params: Promise<PageParams> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const product = aiProductMap.get(slug);
  if (!product) notFound();

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname={`/ai/${product.slug}`} />
      <main className="content-shell">
        <div className="surface-card-strong overflow-hidden">
          <header className="border-b border-[var(--border)] p-6 sm:p-8">
            <span className="grid h-12 w-12 place-items-center rounded-md border border-[var(--border)] bg-[var(--accent-soft)] text-[var(--accent)]">
              <Bot className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="eyebrow mt-5">AI Product</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text)]">{product.title[locale]}</h1>
            <p className="mt-4 text-lg leading-8 text-[var(--text-muted)]">{product.description[locale]}</p>
          </header>
          <section className="workbench-grid bg-[var(--surface-muted)] p-5 sm:p-7">
            <div className="rounded-md border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-soft)]">
              <h2 className="text-xl font-bold text-[var(--text)]">{locale === "en" ? "Planned scope" : "规划范围"}</h2>
              <ul className="mt-4 grid gap-3 text-sm leading-6 text-[var(--text-muted)] sm:grid-cols-2">
              {product.features[locale].map((feature) => (
                <li key={feature} className="rounded-md border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 font-medium">{feature}</li>
              ))}
              </ul>
              <p className="mt-5 text-sm leading-6 text-[var(--text-muted)]">
              {locale === "en"
                ? "This page is reserved for future AI workflow products and will later connect to APIs, billing, and account state."
                : "该页面预留给未来的 AI 工作流产品，后续会连接 API、计费和用户状态。"}
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
