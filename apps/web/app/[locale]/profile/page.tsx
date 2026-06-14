import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { requireUser } from "@/lib/auth/services/sessionService";
import { getRecentToolUsage } from "@/lib/tool-usage";
import { isLocale, locales } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";
import { testMap } from "@/lib/test-registry";
import { toolMap } from "@/lib/tool-registry";
import { getExistingCreditBalance, getTestUnlockHistory } from "@/lib/user-dashboard";

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
  const creditBalance = await getExistingCreditBalance(user.id);
  const testHistory = await getTestUnlockHistory(user.id, 12);

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
            <div className="rounded-md border border-[var(--border)] bg-white p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--text-soft)]">{locale === "en" ? "Credits" : "积分"}</p>
              <p className="mt-2 text-2xl font-black text-[var(--brand-strong)]">{creditBalance}</p>
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
          <h2 className="text-xl font-bold text-[var(--text)]">{locale === "en" ? "Test History" : "测试历史"}</h2>
          <div className="mt-4 space-y-3">
            {testHistory.length > 0 ? testHistory.map((item) => {
              const test = testMap.get(item.testSlug);
              const resultHref = `/${locale}/tests/${item.testSlug}/result/${item.resultType.toLowerCase()}?attempt=${encodeURIComponent(item.attemptId)}`;
              return (
                <Link href={resultHref} key={item.id} className="block rounded-md border border-[var(--border)] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[var(--shadow-soft)]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[var(--text)]">{test?.title[locale] ?? item.testSlug}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-xs font-bold text-[var(--brand-strong)]">{item.resultType}</span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.unlocked ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {item.unlocked ? (locale === "en" ? "Unlocked" : "已解锁") : (locale === "en" ? "Pending" : "待解锁")}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-[var(--text-soft)]">{item.createdAt.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US")}</p>
                </Link>
              );
            }) : (
              <div className="rounded-md border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] p-4 text-sm text-[var(--text-muted)]">
                {locale === "en" ? "No unlocked test reports yet." : "还没有已解锁的测试报告。"}
              </div>
            )}
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
