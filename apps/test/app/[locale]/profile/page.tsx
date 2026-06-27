import type { Metadata } from "next";
import Link from "next/link";
import { FileText, History, Wallet } from "lucide-react";
import { notFound } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { requireUser } from "@/lib/auth/services/sessionService";
import { isLocale, locales } from "@/lib/i18n";
import { buildPageMetadata, withNoIndex } from "@/lib/seo";
import { testMap } from "@/lib/test-registry";
import { getExistingCreditBalance, getTestUnlockHistory } from "@/lib/user-dashboard";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return withNoIndex(buildPageMetadata({
    title: locale === "en" ? "My test reports" : "我的测试报告",
    description: locale === "en" ? "Review your Madabase test reports and credits." : "查看你的 Madabase 测试报告与积分。",
    locale,
    path: "/profile",
    keywords: ["test reports", "madabase tests"],
  }));
}

function formatDate(date: Date, locale: "en" | "zh") {
  return date.toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US");
}

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const user = await requireUser(locale);
  const creditBalance = await getExistingCreditBalance(user.id);
  const testHistory = await getTestUnlockHistory(user.id, 24);
  const unlockedReports = testHistory.filter((item) => item.unlocked);

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname="/profile" />
      <main className="content-shell py-10">
        <section className="surface-card-strong p-6 sm:p-8">
          <p className="eyebrow">{locale === "en" ? "Test account" : "测试账户"}</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-[var(--text)]">{locale === "en" ? "Your test reports" : "你的测试报告"}</h1>
              <p className="mt-3 text-sm text-[var(--text-muted)]">{user.email}</p>
            </div>
            <Link href={`/${locale}/settings`} className="rounded-md border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--text)]">
              {locale === "en" ? "Settings" : "设置"}
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-[var(--border)] bg-white p-4">
              <Wallet className="h-5 w-5 text-[var(--brand-strong)]" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{locale === "en" ? "Credits" : "积分"}</p>
              <p className="mt-1 text-3xl font-black text-[var(--brand-strong)]">{creditBalance}</p>
            </div>
            <div className="rounded-md border border-[var(--border)] bg-white p-4">
              <FileText className="h-5 w-5 text-[var(--brand-strong)]" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-soft)]">{locale === "en" ? "Unlocked reports" : "已解锁报告"}</p>
              <p className="mt-1 text-3xl font-black text-[var(--brand-strong)]">{unlockedReports.length}</p>
            </div>
          </div>
        </section>

        <section className="mt-6 surface-card p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-[var(--brand-strong)]" />
              <h2 className="text-xl font-bold text-[var(--text)]">{locale === "en" ? "Test history" : "测试记录"}</h2>
            </div>
            <Link href={`/${locale}`} className="text-sm font-semibold text-[var(--brand-strong)]">{locale === "en" ? "Take another test" : "继续测试"}</Link>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {testHistory.length > 0 ? testHistory.map((item) => {
              const test = testMap.get(item.testSlug);
              const resultHref = `/${locale}/${item.testSlug}/result/${item.resultType.toLowerCase()}?attempt=${encodeURIComponent(item.attemptId)}`;
              return (
                <Link href={resultHref} key={item.id} className="block rounded-md border border-[var(--border)] bg-white p-4 transition hover:border-[var(--brand)]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[var(--text)]">{test?.title[locale] ?? item.testSlug}</p>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${item.unlocked ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                      {item.unlocked ? (locale === "en" ? "Unlocked" : "已解锁") : (locale === "en" ? "Pending" : "待解锁")}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[var(--text-soft)]">{item.resultType} · {formatDate(item.createdAt, locale)}</p>
                </Link>
              );
            }) : (
              <p className="rounded-md border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] p-4 text-sm text-[var(--text-muted)]">
                {locale === "en" ? "No test records yet." : "还没有测试记录。"}
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
