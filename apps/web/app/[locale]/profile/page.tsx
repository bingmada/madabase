import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { requireUser } from "@/lib/auth/services/sessionService";
import { getRecentToolUsage } from "@/lib/tool-usage";
import { isLocale, locales } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { toolMap } from "@/lib/tools";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildPageMetadata({
    title: locale === "en" ? "Profile" : "个人中心",
    description: locale === "en" ? "Manage your Madabase account profile." : "管理你的 Madabase 账户资料。",
    locale,
    path: "/profile",
    keywords: ["madabase profile"],
  });
}

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const user = await requireUser(locale);
  const recentUsage = await getRecentToolUsage(user.id, 8);

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname="/profile" />
      <main className="content-shell py-10">
        <section className="surface-card-strong p-6 sm:p-8">
          <p className="eyebrow">{locale === "en" ? "Account" : "账户"}</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--text)]">{locale === "en" ? "Profile" : "个人中心"}</h1>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-[var(--border)] bg-white p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">Email</p>
              <p className="mt-2 text-sm font-medium text-[var(--text)]">{user.email}</p>
            </div>
            <div className="rounded-md border border-[var(--border)] bg-white p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">Locale</p>
              <p className="mt-2 text-sm font-medium text-[var(--text)]">{user.locale}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/${locale}/favorites`} className="rounded-md border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand)]">
              {locale === "en" ? "My Favorites" : "我的收藏"}
            </Link>
            <Link href={`/${locale}/settings`} className="rounded-md border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand)]">
              {locale === "en" ? "Settings" : "设置"}
            </Link>
          </div>
        </section>

        <section className="mt-6 surface-card p-6">
          <h2 className="text-xl font-bold text-[var(--text)]">{locale === "en" ? "Recently Used" : "最近使用"}</h2>
          <div className="mt-4 space-y-3">
            {recentUsage.length > 0 ? recentUsage.map((item) => {
              const tool = toolMap.get(item.toolSlug);
              return (
                <Link href={`/${locale}/tools/${item.toolSlug}`} key={item.id} className="block rounded-md border border-[var(--border)] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[var(--shadow-soft)]">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[var(--text)]">{tool?.h1[locale] ?? item.toolSlug}</p>
                    <span className="text-xs text-[var(--text-soft)]">{item.count}x</span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--text-soft)]">{item.toolSlug}</p>
                </Link>
              );
            }) : (
              <div className="rounded-md border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] p-4 text-sm text-[var(--text-muted)]">
                {locale === "en" ? "No recent tool usage yet." : "还没有最近使用记录。"}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
