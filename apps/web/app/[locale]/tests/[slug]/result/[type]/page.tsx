import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { Lock, Sparkles, Unlock } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd, buildArticleSchema, buildBreadcrumbSchema } from "@/components/JsonLd";
import { ResultSharePoster } from "@/components/tests/ResultSharePoster";
import { TestReferralCapture } from "@/components/tests/TestReferralCapture";
import { TestShareCard } from "@/components/tests/TestShareCard";
import { getCurrentUser } from "@/lib/auth/services/sessionService";
import { isLocale, locales } from "@/lib/i18n";
import { buildAbsoluteUrl, buildPageMetadata } from "@/lib/seo";
import { getResultContent, loadTestContent } from "@/lib/test-content";
import { getOrCreateTestShareLink, parseReferralCookieValue, referralRewardAmount, testReferralCookieName } from "@/lib/test-referrals";
import { getUserCreditBalance, hasUnlockedTestResult, recordTestAttempt, unlockTestResult } from "@/lib/test-unlocks";
import { testMap, testRegistry } from "@/lib/test-registry";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    testRegistry.flatMap((test) => test.resultTypes.map((type) => ({ locale, slug: test.slug, type: type.toLowerCase() })))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string; type: string }> }): Promise<Metadata> {
  const { locale, slug, type } = await params;
  if (!isLocale(locale)) return {};
  const test = testMap.get(slug);
  if (!test || !test.resultTypes.includes(type.toUpperCase())) return {};
  const content = await loadTestContent(slug, locale);
  const result = content ? getResultContent(content, type) : null;
  if (!result) return {};

  return buildPageMetadata({
    title: locale === "en" ? `${type.toUpperCase()} Personality Type Test Result` : `${type.toUpperCase()} 人格类型测试结果`,
    description: result.summary,
    locale,
    path: `/tests/${slug}/result/${type.toLowerCase()}`,
    keywords: [type.toUpperCase(), "personality type", "mbti result", ...test.seo[locale].keywords],
    type: "article",
  });
}

export default async function TestResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string; type: string }>;
  searchParams: Promise<{ attempt?: string; ref?: string }>;
}) {
  const { locale, slug, type } = await params;
  const { attempt, ref } = await searchParams;
  if (!isLocale(locale)) notFound();
  const test = testMap.get(slug);
  if (!test) notFound();
  const normalizedType = type.toUpperCase();
  if (!test.resultTypes.includes(normalizedType)) notFound();
  const content = await loadTestContent(slug, locale);
  if (!content) notFound();
  const result = getResultContent(content, normalizedType);
  if (!result) notFound();

  const user = await getCurrentUser();
  if (user && attempt) {
    await recordTestAttempt(user.id, slug, normalizedType, attempt);
  }
  const unlocked = user ? await hasUnlockedTestResult(user.id, slug, normalizedType, attempt) : false;
  const balance = user ? await getUserCreditBalance(user.id) : 0;
  const canonicalUrl = buildAbsoluteUrl(`/${locale}/tests/${slug}/result/${type.toLowerCase()}`);
  const unlockCost = test.unlockCost;
  const shareLink = user ? await getOrCreateTestShareLink(user.id, slug) : null;
  const shareUrl = shareLink ? buildAbsoluteUrl(`/${locale}/tests/${slug}?ref=${shareLink.code}`) : null;
  const posterTestUrl = shareUrl ?? buildAbsoluteUrl(`/${locale}/tests/${slug}`);
  const currentResultParams = new URLSearchParams();
  if (attempt) currentResultParams.set("attempt", attempt);
  if (ref) currentResultParams.set("ref", ref);
  const currentResultQuery = currentResultParams.toString();
  const currentResultPath = `/${locale}/tests/${slug}/result/${type.toLowerCase()}${currentResultQuery ? `?${currentResultQuery}` : ""}`;
  const loginHref = `/${locale}/login?next=${encodeURIComponent(currentResultPath)}`;

  async function unlockAction() {
    "use server";
    const currentUser = await getCurrentUser();
    if (!currentUser) redirect(loginHref);
    const cookieStore = await cookies();
    const referral = parseReferralCookieValue(cookieStore.get(testReferralCookieName)?.value);
    const referralCode = ref ?? (referral?.testSlug === slug ? referral.code : null);
    await unlockTestResult({
      userId: currentUser.id,
      testSlug: slug,
      resultType: normalizedType,
      attemptId: attempt,
      cost: unlockCost,
      referralCode,
    });
    redirect(currentResultPath);
  }

  const copy = {
    en: {
      result: "Your type is",
      free: "Free summary",
      full: "Full report",
      traits: "Core traits",
      strengths: "Strengths",
      weaknesses: "Watch-outs",
      careers: "Career fit",
      relationships: "Relationships",
      growth: "Growth plan",
      unlock: "Unlock full report",
      login: "Log in to unlock",
      balance: "Credit balance",
      cost: "Cost",
      retake: "Retake test",
      locked: "Unlock career analysis, relationship patterns, strengths, weaknesses, and a practical growth plan.",
      insufficient: "You do not have enough credits to unlock this report yet.",
      missingAttempt: "This is a public result link. Retake the test to create a fresh report that can be unlocked.",
      credits: "credits",
    },
    zh: {
      result: "你的类型是",
      free: "免费摘要",
      full: "完整报告",
      traits: "核心特质",
      strengths: "优势",
      weaknesses: "注意点",
      careers: "职业适配",
      relationships: "关系模式",
      growth: "成长计划",
      unlock: "解锁完整报告",
      login: "登录后解锁",
      balance: "当前积分",
      cost: "消耗",
      retake: "重新测试",
      locked: "解锁职业分析、关系模式、优势、注意点与可执行成长计划。",
      insufficient: "你当前积分不足，暂时不能解锁这份报告。",
      missingAttempt: "这是公开结果链接。请重新完成一次测评，生成新的报告后再解锁。",
      credits: "积分",
    },
  }[locale];
  const reportLabels = content.reportLabels ?? {
    strengths: copy.strengths,
    weaknesses: copy.weaknesses,
    careers: copy.careers,
    relationships: copy.relationships,
    growth: copy.growth,
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Madabase", item: buildAbsoluteUrl(`/${locale}`) },
    { name: locale === "en" ? "Tests" : "测试", item: buildAbsoluteUrl(`/${locale}/tests`) },
    { name: content.title, item: buildAbsoluteUrl(`/${locale}/tests/${slug}`) },
    { name: normalizedType, item: canonicalUrl },
  ]);
  const articleSchema = buildArticleSchema({
    headline: `${normalizedType} - ${result.title}`,
    description: result.summary,
    url: canonicalUrl,
    datePublished: "2026-06-13",
    locale,
  });

  return (
    <div className="min-h-screen bg-transparent">
      <Header locale={locale} pathname={`/tests/${slug}`} />
      <main className="page-shell">
        <TestReferralCapture code={ref} testSlug={slug} />
        <JsonLd id={`test-result-breadcrumbs-${slug}-${type}`} data={breadcrumbSchema} />
        <JsonLd id={`test-result-article-${slug}-${type}`} data={articleSchema} />

        <article className="surface-card-strong overflow-hidden">
          <header className="border-b border-[var(--border)] p-5 sm:p-7">
            <p className="eyebrow">{content.title}</p>
            <h1 className="mt-3 text-4xl font-black tracking-tight text-[var(--text)] sm:text-5xl">
              {copy.result} <span className="text-[var(--brand-strong)]">{normalizedType}</span>
            </h1>
            <p className="mt-3 text-xl font-semibold text-[var(--text)]">{result.title}</p>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[var(--text-muted)] sm:text-lg">{result.summary}</p>
            <Link href={`/${locale}/tests/${slug}/start`} className="mt-6 inline-flex h-11 items-center rounded-md border border-[var(--border)] bg-white px-4 text-sm font-semibold text-[var(--text)] transition hover:border-[var(--brand)]">
              {copy.retake}
            </Link>
            <ResultSharePoster locale={locale} testTitle={content.title} resultType={normalizedType} result={result} testUrl={posterTestUrl} />
          </header>

          <section className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="border-b border-[var(--border)] bg-[var(--surface-muted)] p-5 sm:p-7 lg:border-b-0 lg:border-r">
              <h2 className="text-2xl font-bold text-[var(--text)]">{copy.free}</h2>
              <div className="mt-5 flex flex-wrap gap-2">
                {result.traits.map((trait) => (
                  <span key={trait} className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-sm font-semibold text-[var(--text)]">
                    {trait}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-sm leading-6 text-[var(--text-muted)]">{result.summary}</p>
            </div>

            <div className="p-5 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-2xl font-bold text-[var(--text)]">{copy.full}</h2>
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-3 py-1 text-sm font-semibold text-[var(--text-muted)]">
                  {unlocked ? <Unlock className="h-4 w-4 text-emerald-600" /> : <Lock className="h-4 w-4 text-amber-600" />}
                  {copy.balance}: {balance}
                </span>
              </div>

              {unlocked ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <DetailedReport locale={locale} resultType={normalizedType} title={result.title} summary={result.summary} traits={result.traits} strengths={result.strengths} weaknesses={result.weaknesses} growthPlan={result.growthPlan} />
                  </div>
                  <ReportBlock title={reportLabels.strengths} items={result.strengths} />
                  <ReportBlock title={reportLabels.weaknesses} items={result.weaknesses} />
                  <ReportBlock title={reportLabels.careers} items={result.careers} />
                  <ReportBlock title={reportLabels.relationships} items={result.relationships} />
                  <div className="sm:col-span-2">
                    <ReportBlock title={reportLabels.growth} items={result.growthPlan} />
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-5">
                  <Sparkles className="h-6 w-6 text-[var(--brand-strong)]" />
                  <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">{copy.locked}</p>
                  <p className="mt-3 code-font text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-soft)]">
                    {copy.cost}: {unlockCost} {copy.credits}
                  </p>
                  {!attempt ? (
                    <p className="mt-4 text-sm font-semibold text-amber-700">{copy.missingAttempt}</p>
                  ) : user && balance >= unlockCost ? (
                    <form action={unlockAction}>
                      <button type="submit" className="mt-5 inline-flex h-11 items-center rounded-md bg-[var(--surface-code)] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)]">
                        {copy.unlock}
                      </button>
                    </form>
                  ) : user ? (
                    <>
                      <p className="mt-4 text-sm font-semibold text-amber-700">{copy.insufficient}</p>
                      {shareUrl ? <TestShareCard locale={locale} shareUrl={shareUrl} rewardAmount={referralRewardAmount} /> : null}
                    </>
                  ) : (
                    <Link href={loginHref} className="mt-5 inline-flex h-11 items-center rounded-md bg-[var(--surface-code)] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-strong)]">
                      {copy.login}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}

function DetailedReport({
  locale,
  resultType,
  title,
  summary,
  traits,
  strengths,
  weaknesses,
  growthPlan,
}: {
  locale: string;
  resultType: string;
  title: string;
  summary: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  growthPlan: string[];
}) {
  return (
    <section className="rounded-md border border-[var(--border)] bg-white p-5">
      <h3 className="text-xl font-bold text-[var(--text)]">{locale === "en" ? "Detailed interpretation" : "详细解读"}</h3>
      <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--text-muted)]">
        <p>
          {locale === "en"
            ? `${resultType} - ${title} is best understood as a pattern of preferences, not a fixed label. ${summary} In daily life, this usually shows up through ${traits.join(", ")}.`
            : `${resultType} - ${title} 更适合被理解为一组偏好模式，而不是固定标签。${summary} 在日常生活中，这通常会表现为「${traits.join("、")}」。`}
        </p>
        <p>
          {locale === "en"
            ? `Your strongest assets are often visible when you can use ${strengths.slice(0, 2).join(" and ")}. These strengths become more valuable when you place them in the right environment and make them explicit to people around you.`
            : `你的优势往往会在能够发挥「${strengths.slice(0, 2).join("」和「")}」时更明显。把这些优势放在合适环境里，并主动让身边的人理解你的工作方式，会让它们更有价值。`}
        </p>
        <p>
          {locale === "en"
            ? `The main risk is not that these traits are bad, but that they can become overused. Watch for patterns such as ${weaknesses.slice(0, 2).join(" and ")}.`
            : `需要注意的不是这些特质本身不好，而是它们在压力下可能被过度使用。你可以特别留意「${weaknesses.slice(0, 2).join("」和「")}」这类信号。`}
        </p>
        <p>
          {locale === "en"
            ? `A practical next step is to choose one small behavior from your growth plan: ${growthPlan[0] ?? "start with one visible adjustment this week"}.`
            : `接下来最实际的做法，是先从成长建议里选择一个小动作：${growthPlan[0] ?? "本周先做一个可见的小调整"}。`}
        </p>
      </div>
    </section>
  );
}

function ReportBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-md border border-[var(--border)] bg-white p-4">
      <h3 className="text-lg font-bold text-[var(--text)]">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="text-sm leading-6 text-[var(--text-muted)]">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
