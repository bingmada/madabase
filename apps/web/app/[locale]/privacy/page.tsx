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
    title: locale === "en" ? "Privacy Policy | Madabase" : "隐私政策 | Madabase",
    description: locale === "en" ? "How Madabase handles tool input, account data, analytics, cookies, advertising, and contact messages." : "了解 Madabase 如何处理工具输入、账户信息、分析数据、Cookie、广告和联系邮件。",
    locale,
    path: "/privacy",
    keywords: ["privacy policy", "cookies", "adsense", "madabase"],
  });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const isEnglish = locale === "en";
  return (
    <InfoPage
      locale={locale}
      pathname="/privacy"
      eyebrow={isEnglish ? "Privacy" : "隐私政策"}
      title={isEnglish ? "A clear explanation of the data around Madabase." : "清楚说明 Madabase 周边的数据处理方式。"}
      description={isEnglish ? "Last updated: July 12, 2026. This policy applies to the Madabase main site and explains the situations in which information may be processed." : "最后更新：2026 年 7 月 12 日。本政策适用于 Madabase 主站，并说明哪些情况下可能会处理相关信息。"}
      sections={isEnglish ? [
        { heading: "Information you provide", paragraphs: ["If you create an account, contact us, or send feedback, we may receive the information you choose to provide, such as an email address, nickname, message, or the page you mention. We use it to provide the requested service, respond to you, protect the site, and improve the product." ] },
        { heading: "Tool input and usage events", paragraphs: ["Many Madabase tools are designed to run in the browser. Input is not intentionally sent to our server merely because you type it into a local tool, but you should still avoid entering secrets or sensitive personal data. Some pages may record basic usage events such as page visits, tool visits, language, or an interaction needed to diagnose reliability. The exact events can change as the site is maintained." ] },
        { heading: "Cookies, advertising, and third parties", paragraphs: ["Madabase may use cookies or similar technologies for account sessions, preferences, measurement, security, and advertising. Google AdSense and its partners may use cookies, web beacons, IP addresses, or similar signals to deliver, measure, and personalize advertising according to applicable settings and consent requirements. Third-party links, including retailer and affiliate links on related buying-guide sites, are governed by the destination site's own policies. You should review those policies before submitting information." ] },
        { heading: "Retention and choices", paragraphs: ["We keep information only for as long as it is reasonably needed for the purpose collected, legal obligations, security, dispute handling, or legitimate operational records. You can contact us to ask about a message or account-related record. Browser settings and available consent controls can also be used to limit cookies or personalized advertising, although some site features may then work differently." ] },
        { heading: "Contact and updates", paragraphs: ["For privacy questions, contact bingmada003@gmail.com. We may update this policy when the site, analytics, advertising, or legal requirements change. The date at the top of this page indicates the latest revision." ] },
      ] : [
        { heading: "你主动提供的信息", paragraphs: ["如果你注册账户、联系我们或提交反馈，我们可能会收到你主动提供的信息，例如邮箱、昵称、留言内容或你提到的页面地址。我们使用这些信息来提供请求的服务、回复问题、保护网站并改进产品。"] },
        { heading: "工具输入与使用事件", paragraphs: ["Madabase 的许多工具设计为在浏览器中运行。仅仅因为你在本地工具中输入内容，并不代表这些内容会被主动发送到我们的服务器；但你仍然不应输入密码、密钥、生产环境 token 或其他敏感数据。部分页面可能记录页面访问、工具访问、语言或用于排查稳定性的基础使用事件，具体事件会随网站维护而调整。"] },
        { heading: "Cookie、广告与第三方", paragraphs: ["Madabase 可能使用 Cookie 或类似技术来处理账户会话、偏好、访问统计、安全和广告。Google AdSense 及其合作伙伴可能根据适用的设置和同意要求，使用 Cookie、网络信标、IP 地址或类似信号来投放、衡量和个性化广告。相关选购站点中的零售商链接和联盟链接属于第三方链接，目标网站有自己的隐私政策，提交信息前应自行查看。"] },
        { heading: "保存期限与选择", paragraphs: ["我们只会在收集目的、法律义务、安全、争议处理或合理的运营记录所需期间内保存信息。你可以通过邮箱询问与留言或账户相关的记录。浏览器设置和页面提供的同意控制也可以用来限制 Cookie 或个性化广告，但部分功能可能因此发生变化。"] },
        { heading: "联系我们与政策更新", paragraphs: ["如有隐私问题，请发送邮件到 bingmada003@gmail.com。当网站、分析工具、广告方式或法律要求发生变化时，我们可能更新本政策，页面顶部的日期表示最近一次修订时间。"] },
      ]}
    />
  );
}
