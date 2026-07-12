import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InfoPage } from "@/components/InfoPage";
import { isLocale, locales } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildPageMetadata({
    title: locale === "en" ? "Terms of Use | Madabase" : "使用条款 | Madabase",
    description: locale === "en" ? "The terms that apply when you use Madabase tools, articles, accounts, and related links." : "使用 Madabase 工具、文章、账户和相关链接时适用的条款。",
    locale,
    path: "/terms",
    keywords: ["terms of use", "madabase", "online tools"],
  });
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const isEnglish = locale === "en";
  return (
    <InfoPage
      locale={locale}
      pathname="/terms"
      eyebrow={isEnglish ? "Terms of use" : "使用条款"}
      title={isEnglish ? "Please use the tools with sensible care." : "请以合理、谨慎的方式使用这些工具。"}
      description={isEnglish ? "Last updated: July 12, 2026. These terms describe the basic rules for using Madabase." : "最后更新：2026 年 7 月 12 日。本条款说明使用 Madabase 时需要遵守的基本规则。"}
      sections={isEnglish ? [
        { heading: "Using the site", paragraphs: ["You may use Madabase for lawful personal, educational, and professional work. You are responsible for the data you enter, the decisions you make from an output, and checking important results before relying on them. Do not use the site to interfere with the service, bypass access controls, distribute malware, infringe rights, or submit information you do not have permission to handle." ] },
        { heading: "Tools and content", paragraphs: ["The tools, examples, articles, and explanations are provided for general information and convenience. They may contain mistakes, become outdated, or behave differently from a production system. Outputs are not legal, medical, financial, security, or other professional advice, and they are not a warranty that a result is complete or fit for a particular purpose." ] },
        { heading: "Accounts and availability", paragraphs: ["Some features may require an account. Keep account details secure and tell us if you believe an account has been misused. We may change, suspend, or discontinue a feature, and we may limit access when needed for maintenance, security, abuse prevention, or legal reasons." ] },
        { heading: "Third-party links and affiliate relationships", paragraphs: ["Madabase may link to external services, documentation, retailers, or related buying-guide sites. Those destinations have their own terms and privacy policies. Some buying-guide links may be affiliate links; a qualifying purchase can result in a commission at no additional cost to you, but Madabase is not the seller and does not control the retailer's price, stock, shipping, or support." ] },
        { heading: "Questions", paragraphs: ["If you have a question about these terms or need to report a problem, contact bingmada003@gmail.com. We may update these terms as the site develops; continued use after an update means the revised terms apply from the stated revision date." ] },
      ] : [
        { heading: "网站使用", paragraphs: ["你可以将 Madabase 用于合法的个人、学习和工作用途。你需要对输入的数据、根据结果做出的决定，以及重要结果的复核负责。不得利用网站干扰服务、绕过访问控制、传播恶意软件、侵犯他人权利，或提交你无权处理的信息。"] },
        { heading: "工具与内容", paragraphs: ["工具、示例、文章和说明仅为一般信息与便利而提供，可能存在错误、过期，或与生产系统的表现不同。输出结果不构成法律、医疗、金融、安全或其他专业建议，也不保证结果完整或适合某个特定目的。"] },
        { heading: "账户与可用性", paragraphs: ["部分功能可能需要账户。请妥善保管账户信息，如怀疑账户被滥用，请及时联系我们。为了维护、安全、防止滥用或遵守法律，我们可能调整、暂停或停止某项功能，并在必要时限制访问。"] },
        { heading: "第三方链接与联盟关系", paragraphs: ["Madabase 可能链接到外部服务、文档、零售商或相关选购站点。这些目标网站有自己的条款和隐私政策。部分选购链接可能是联盟链接，符合条件的购买可能让 Madabase 获得佣金，但不会增加你的购买成本；Madabase 不是商品卖家，也不控制零售商的价格、库存、配送或售后。"] },
        { heading: "问题反馈", paragraphs: ["如果你对本条款有疑问或需要报告问题，请发送邮件到 bingmada003@gmail.com。随着网站发展，我们可能更新条款；从修订日期开始继续使用网站，即表示修订后的条款适用。"] },
      ]}
    />
  );
}
