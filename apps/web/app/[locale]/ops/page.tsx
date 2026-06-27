import type { Metadata } from "next";
import Link from "next/link";
import { Activity, BarChart3, LockKeyhole, Share2, Users } from "lucide-react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { requireUser } from "@/lib/auth/services/sessionService";
import { isLocale, locales } from "@/lib/i18n";
import { canAccessOps } from "@/lib/ops-access";
import { getOpsDashboardStats } from "@/lib/ops-dashboard";
import { buildPageMetadata, getTestSiteUrl, withNoIndex } from "@/lib/seo";
import { testMap } from "@/lib/test-registry";
import { toolMap } from "@/lib/tool-registry";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return withNoIndex(buildPageMetadata({
    title: locale === "en" ? "Operations Dashboard" : "运营数据面板",
    description: locale === "en" ? "Internal usage, test, unlock, and referral metrics for Madabase." : "Madabase 内部工具使用、测评、解锁与推荐数据。",
    locale,
    path: "/ops",
    keywords: ["madabase ops", "tool analytics"],
  }));
}

export default async function OpsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const user = await requireUser(locale);
  if (!canAccessOps(user.email)) notFound();
  const stats = await getOpsDashboardStats();
  const testSiteUrl = getTestSiteUrl();
  const copy = {
    en: {
      eyebrow: "Internal",
      title: "Operations dashboard",
      description: "A compact readout for deciding which tools, tests, and conversion loops deserve the next sprint.",
      topTools: "Top tools",
      topTests: "Top tests",
      unlocks: "Report unlocks",
      recent: "Recent test attempts",
      users: "Users",
      toolRuns: "Tool runs",
      testAttempts: "Test attempts",
      reports: "Unlocked reports",
      referrals: "Referral rewards",
      empty: "No data yet.",
    },
    zh: {
      eyebrow: "内部",
      title: "运营数据面板",
      description: "用一个紧凑面板判断哪些工具、测评和转化链路值得进入下一轮迭代。",
      topTools: "热门工具",
      topTests: "热门测评",
      unlocks: "报告解锁",
      recent: "最近测评记录",
      users: "用户数",
      toolRuns: "工具运行",
      testAttempts: "测评完成",
      reports: "报告解锁",
      referrals: "推荐奖励",
      empty: "暂无数据。",
    },
  }[locale];

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname="/ops" />
      <main className="content-shell py-10">
        <section className="surface-card-strong p-6 sm:p-8">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-[var(--text)]">{copy.title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">{copy.description}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Metric icon={<Users className="h-4 w-4" />} label={copy.users} value={stats.totals.users} />
            <Metric icon={<Activity className="h-4 w-4" />} label={copy.toolRuns} value={stats.totals.toolExecutions} />
            <Metric icon={<BarChart3 className="h-4 w-4" />} label={copy.testAttempts} value={stats.totals.testAttempts} />
            <Metric icon={<LockKeyhole className="h-4 w-4" />} label={copy.reports} value={stats.totals.unlockedReports} />
            <Metric icon={<Share2 className="h-4 w-4" />} label={copy.referrals} value={stats.totals.referralRewards} />
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Panel title={copy.topTools} empty={copy.empty} hasData={stats.topTools.length > 0}>
            {stats.topTools.map((item) => {
              const tool = toolMap.get(item.toolSlug);
              return (
                <Link key={item.toolSlug} href={`/${locale}/tools/${item.toolSlug}`} className="block rounded-md border border-[var(--border)] bg-white p-4 transition hover:border-[var(--brand)]">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[var(--text)]">{tool?.h1[locale] ?? item.toolSlug}</p>
                    <span className="code-font text-xs font-bold text-[var(--brand-strong)]">{item.executions}x</span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--text-soft)]">{item.users} users · {item.lastUsedAt.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US")}</p>
                </Link>
              );
            })}
          </Panel>

          <Panel title={copy.topTests} empty={copy.empty} hasData={stats.topTests.length > 0}>
            {stats.topTests.map((item) => {
              const test = testMap.get(item.testSlug);
              return (
                <Link key={item.testSlug} href={`${testSiteUrl}/${locale}/${item.testSlug}`} className="block rounded-md border border-[var(--border)] bg-white p-4 transition hover:border-[var(--brand)]">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[var(--text)]">{test?.title[locale] ?? item.testSlug}</p>
                    <span className="code-font text-xs font-bold text-[var(--brand-strong)]">{item.attempts}</span>
                  </div>
                  <p className="mt-1 text-xs text-[var(--text-soft)]">{item.testSlug}</p>
                </Link>
              );
            })}
          </Panel>

          <Panel title={copy.unlocks} empty={copy.empty} hasData={stats.topUnlocks.length > 0}>
            {stats.topUnlocks.map((item) => (
              <div key={`${item.testSlug}-${item.resultType}`} className="rounded-md border border-[var(--border)] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--text)]">{item.testSlug}</p>
                  <span className="rounded-full bg-[var(--brand-soft)] px-2.5 py-1 text-xs font-bold text-[var(--brand-strong)]">{item.resultType}</span>
                </div>
                <p className="mt-1 text-xs text-[var(--text-soft)]">{item.unlocks} unlocks</p>
              </div>
            ))}
          </Panel>

          <Panel title={copy.recent} empty={copy.empty} hasData={stats.recentAttempts.length > 0}>
            {stats.recentAttempts.map((item) => (
              <div key={item.id} className="rounded-md border border-[var(--border)] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[var(--text)]">{item.testSlug}</p>
                  <span className="text-xs text-[var(--text-soft)]">{item.createdAt.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US")}</span>
                </div>
                <p className="mt-1 text-xs text-[var(--text-soft)]">{item.resultType}</p>
              </div>
            ))}
          </Panel>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-md border border-[var(--border)] bg-white p-4">
      <div className="flex items-center gap-2 text-[var(--text-soft)]">{icon}<span className="text-xs font-bold uppercase tracking-[0.14em]">{label}</span></div>
      <p className="mt-3 text-2xl font-black text-[var(--text)]">{value.toLocaleString()}</p>
    </div>
  );
}

function Panel({ title, empty, hasData, children }: { title: string; empty: string; hasData: boolean; children: React.ReactNode }) {
  return (
    <section className="surface-card p-5">
      <h2 className="text-xl font-bold text-[var(--text)]">{title}</h2>
      <div className="mt-4 space-y-3">
        {hasData ? children : <div className="rounded-md border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] p-4 text-sm text-[var(--text-muted)]">{empty}</div>}
      </div>
    </section>
  );
}
