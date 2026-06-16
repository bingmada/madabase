import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { isLocale, locales } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

const contactEmail = "bingmada003@gmail.com";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildPageMetadata({
    title: locale === "en" ? "Contact Madabase" : "联系 Madabase",
    description: locale === "en" ? "Contact Madabase by email." : "通过邮箱联系 Madabase。",
    locale,
    path: "/contact",
    keywords: ["contact", "madabase"],
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname="/contact" />
      <main className="page-shell">
        <section className="surface-card-strong p-6 sm:p-8 lg:p-10">
          <p className="eyebrow">{locale === "en" ? "Contact" : "联系我们"}</p>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">
            {locale === "en" ? "Contact Madabase" : "联系 Madabase"}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--text-muted)]">
            {locale === "en" ? "For feedback, collaboration, or site questions, send an email directly." : "如果有反馈、合作或网站相关问题，可以直接通过邮箱联系。"}
          </p>
          <a href={`mailto:${contactEmail}`} className="mt-7 inline-flex h-11 items-center gap-2 rounded-md bg-[var(--surface-code)] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)]">
            <Mail className="h-4 w-4" />
            {contactEmail}
          </a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
