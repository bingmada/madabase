import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, Bookmark, FileText, History, Sparkles, Wallet } from "lucide-react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { requireUser } from "@/lib/auth/services/sessionService";
import { getRecentToolUsage } from "@/lib/tool-usage";
import { isLocale, locales } from "@/lib/i18n";
import { canAccessOps } from "@/lib/ops-access";
import { buildPageMetadata, getTestSiteUrl, withNoIndex } from "@/lib/seo";
import { testMap } from "@/lib/test-registry";
import { toolMap } from "@/lib/tool-registry";
import { getExistingCreditBalance, getProfileDashboard, getTestUnlockHistory } from "@/lib/user-dashboard";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return withNoIndex(buildPageMetadata({
    title: locale === "en" ? "Profile" : "个人中心",
    description: locale === "en" ? "Manage your Madabase account profile." : "管理你的 Madabase 账户资料。",
    locale,
    path: "/profile",
    keywords: ["madabase profile"],
  }));
}

function formatDate(date: Date, locale: "en" | "zh") {
  return date.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US");
}

function StatCard({ title, value, detail, icon }: { title: string; value: string | number; detail: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-md border border-[var(--border)] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{title}</p>
          <p className="mt-2 text-3xl font-black text-[var(--brand-strong)]">{value}</p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[var(--brand-soft)] text-[var(--brand-strong)]">{icon}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{detail}</p>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] p-4 text-sm text-[var(--text-muted)]">
      {children}
    </div>
  );
}

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const user = await requireUser(locale);
  const recentUsage = await getRecentToolUsage(user.id, 8);
  const creditBalance = await getExistingCreditBalance(user.id);
  const testHistory = await getTestUnlockHistory(user.id, 12);
  const dashboard = await getProfileDashboard(user.id);
  const showOpsDashboard = canAccessOps(user.email);
  const unlockedReports = testHistory.filter((item) => item.unlocked);
  const testSiteUrl = getTestSiteUrl();
  const suggestedTools = recentUsage.length > 0
    ? recentUsage.flatMap((item) => toolMap.get(item.toolSlug)?.relatedTools ?? []).filter((slug, index, list) => list.indexOf(slug) === index).slice(0, 4)
    : ["json-formatter", "text-cleaner", "qr-code-generator", "word-counter"];

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname="/profile" />
      <main className="content-shell py-10">
        <section className="surface-card-strong p-6 sm:p-8">
          <p className="eyebrow">{locale === "en" ? "Workspace" : "工作台"}</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[var(--text)]">{locale === "en" ? "Your Madabase dashboard" : "你的 Madabase 工作台"}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                {locale === "en" ? "Continue tools, review reports, track credits, and return to saved workflows from one place." : "集中查看常用工具、测试报告、积分动态和下一步推荐。"}
              </p>
            </div>
            <div className="rounded-md border border-[var(--border)] bg-white px-4 py-3 text-sm">
              <p className="font-semibold text-[var(--text)]">{user.email}</p>
              <p className="mt-1 text-xs text-[var(--text-soft)]">{locale === "en" ? "Language" : "语言"}: {user.locale}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title={locale === "en" ? "Credits" : "积分"} value={creditBalance} detail={locale === "en" ? "Use credits to unlock deeper test reports." : "可用于解锁更深入的测试报告。"} icon={<Wallet className="h-5 w-5" />} />
            <StatCard title={locale === "en" ? "Reports" : "已解锁报告"} value={dashboard.unlockedReportCount} detail={locale === "en" ? "Full reports currently available in your account." : "当前账户可直接查看的完整报告。"} icon={<FileText className="h-5 w-5" />} />
            <StatCard title={locale === "en" ? "Tool runs" : "工具使用"} value={dashboard.totalToolRuns} detail={locale === "en" ? "Total recorded runs across online tools." : "已记录的在线工具使用次数。"} icon={<BarChart3 className="h-5 w-5" />} />
            <StatCard title={locale === "en" ? "Favorites" : "收藏"} value={dashboard.favoriteCount} detail={locale === "en" ? "Saved tools for quick access." : "已保存的常用工具入口。"} icon={<Bookmark className="h-5 w-5" />} />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/${locale}/favorites`} className="rounded-md border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand)]">
              {locale === "en" ? "My Favorites" : "我的收藏"}
            </Link>
            <Link href={`/${locale}/settings`} className="rounded-md border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand)]">
              {locale === "en" ? "Settings" : "设置"}
            </Link>
            {showOpsDashboard ? (
              <Link href={`/${locale}/ops`} className="rounded-md border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand)]">
                {locale === "en" ? "Ops Dashboard" : "运营面板"}
              </Link>
            ) : null}
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="surface-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-[var(--text)]">{locale === "en" ? "My Reports" : "我的报告"}</h2>
              <Link href={`${testSiteUrl}/${locale}`} className="text-sm font-semibold text-[var(--brand-strong)]">{locale === "en" ? "Take another test" : "继续测试"}</Link>
            </div>
            <div className="mt-4 space-y-3">
              {unlockedReports.length > 0 ? unlockedReports.map((item) => {
                const test = testMap.get(item.testSlug);
                const resultHref = `${testSiteUrl}/${locale}/${item.testSlug}/result/${item.resultType.toLowerCase()}?attempt=${encodeURIComponent(item.attemptId)}`;
                return (
                  <Link href={resultHref} key={item.id} className="block rounded-md border border-[var(--border)] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-[var(--shadow-soft)]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text)]">{test?.title[locale] ?? item.testSlug}</p>
                        <p className="mt-1 text-xs text-[var(--text-soft)]">{locale === "en" ? "Unlocked" : "解锁时间"}: {formatDate(item.unlockedAt ?? item.createdAt, locale)}</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">{item.resultType}</span>
                    </div>
                  </Link>
                );
              }) : (
                <EmptyState>{locale === "en" ? "No unlocked full reports yet. Complete a test and unlock a report with credits when you want deeper detail." : "还没有已解锁的完整报告。完成测试后，可使用积分解锁更深入的分析。"}</EmptyState>
              )}
            </div>
          </section>

          <section className="surface-card p-6">
            <h2 className="text-xl font-bold text-[var(--text)]">{locale === "en" ? "Credit Activity" : "积分动态"}</h2>
            <div className="mt-4 space-y-3">
              {dashboard.recentCreditTransactions.length > 0 ? dashboard.recentCreditTransactions.map((item) => (
                <div key={item.id} className="rounded-md border border-[var(--border)] bg-white p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[var(--text)]">{item.description ?? item.type}</p>
                    <span className={`text-sm font-black ${item.amount >= 0 ? "text-emerald-700" : "text-amber-700"}`}>{item.amount >= 0 ? "+" : ""}{item.amount}</span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--text-soft)]">{formatDate(item.createdAt, locale)}</p>
                </div>
              )) : (
                <EmptyState>{locale === "en" ? "No credit activity yet." : "还没有积分变动记录。"}</EmptyState>
              )}
            </div>
          </section>
        </div>

        <section className="mt-6 surface-card p-6">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-[var(--brand-strong)]" />
            <h2 className="text-xl font-bold text-[var(--text)]">{locale === "en" ? "Test Records" : "测试记录"}</h2>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {testHistory.length > 0 ? testHistory.map((item) => {
              const test = testMap.get(item.testSlug);
              const resultHref = `${testSiteUrl}/${locale}/${item.testSlug}/result/${item.resultType.toLowerCase()}?attempt=${encodeURIComponent(item.attemptId)}`;
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
                  <p className="mt-1 text-xs text-[var(--text-soft)]">{formatDate(item.createdAt, locale)}</p>
                </Link>
              );
            }) : (
              <EmptyState>{locale === "en" ? "No test records yet." : "还没有测试记录。"}</EmptyState>
            )}
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="surface-card p-6">
            <h2 className="text-xl font-bold text-[var(--text)]">{locale === "en" ? "Recently Used Tools" : "最近使用工具"}</h2>
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
                <EmptyState>{locale === "en" ? "No recent tool usage yet." : "还没有最近使用记录。"}</EmptyState>
              )}
            </div>
          </section>

          <section className="surface-card p-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[var(--brand-strong)]" />
              <h2 className="text-xl font-bold text-[var(--text)]">{locale === "en" ? "Suggested Next Steps" : "推荐下一步"}</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              {locale === "en" ? "These are lightweight recommendations based on saved and recently used tools, not merged workflows." : "这里先做轻量推荐，不合并原工具页面；用户仍然可以自由进入单个工具。"}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {suggestedTools.map((slug) => {
                const tool = toolMap.get(slug);
                if (!tool) return null;
                return (
                  <Link key={slug} href={`/${locale}/tools/${slug}`} className="rounded-md border border-[var(--border)] bg-white p-4 transition hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]">
                    <p className="text-sm font-semibold text-[var(--text)]">{tool.h1[locale]}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--text-soft)]">{tool.description[locale]}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
