import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { requireUser } from "@/lib/auth/services/sessionService";
import { isLocale, locales } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildPageMetadata({
    title: locale === "en" ? "Settings" : "设置",
    description: locale === "en" ? "Manage locale, account preferences, and future sync settings." : "管理语言、账户偏好和未来同步设置。",
    locale,
    path: "/settings",
    keywords: ["madabase settings"],
  });
}

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const user = await requireUser(locale);

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname="/settings" />
      <main className="content-shell py-10">
        <section className="surface-card-strong p-6 sm:p-8">
          <p className="eyebrow">{locale === "en" ? "Preferences" : "偏好设置"}</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--text)]">{locale === "en" ? "Settings" : "设置"}</h1>
          <div className="mt-6 space-y-4">
            <div className="rounded-md border border-[var(--border)] bg-white p-4">
              <p className="text-sm font-semibold text-[var(--text)]">{locale === "en" ? "Current locale" : "当前语言"}</p>
              <p className="mt-2 text-sm text-[var(--text-muted)]">{user.locale}</p>
            </div>
            <div className="rounded-md border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] p-4 text-sm text-[var(--text-muted)]">
              {locale === "en"
                ? "Profile sync, history settings, notification preferences, and premium controls will live here next."
                : "后续会在这里加入资料同步、历史记录设置、通知偏好与高级能力控制。"}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
