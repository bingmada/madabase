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
    title: locale === "en" ? "Editorial Policy | Madabase" : "编辑政策 | Madabase",
    description: locale === "en" ? "How Madabase researches, writes, updates, and corrects its tools and guides." : "了解 Madabase 如何研究、撰写、更新和纠正工具与指南内容。",
    locale,
    path: "/editorial-policy",
    keywords: ["editorial policy", "content standards", "madabase"],
  });
}

export default async function EditorialPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const isEnglish = locale === "en";
  return (
    <InfoPage
      locale={locale}
      pathname="/editorial-policy"
      eyebrow={isEnglish ? "Editorial policy" : "编辑政策"}
      title={isEnglish ? "Useful first, transparent always." : "先保证有用，再保持透明。"}
      description={isEnglish ? "This policy explains how Madabase decides what to publish and how we keep the information understandable and accountable." : "这份政策说明 Madabase 如何决定发布什么内容，以及我们如何让信息保持清晰、可核查和负责任。"}
      sections={isEnglish ? [
        { heading: "Original purpose", paragraphs: ["Every tool page and article should help a visitor complete a real task, understand a format, or make a better-informed decision. We do not create pages only to repeat a keyword, create a doorway to another page, or fill a template with interchangeable sentences." ] },
        { heading: "Research and sources", paragraphs: ["Technical explanations are checked against the relevant format specification, stable platform documentation, or the behavior of the tool itself. Product guides use manufacturer specifications, retailer information, compatibility details, and clearly labeled editorial judgment. Sources can change, so readers should verify time-sensitive details such as price, availability, software support, and hardware revisions before acting." ] },
        { heading: "Updates and corrections", paragraphs: ["We revise pages when a tool changes, a source becomes outdated, a compatibility detail is corrected, or a reader reports a reproducible problem. Product and time-sensitive pages should show an update note when practical. To report an error, email bingmada003@gmail.com with the URL, the claim in question, and supporting evidence." ] },
        { heading: "Affiliate disclosure", paragraphs: ["Some separate buying-guide sites use affiliate links. If a visitor purchases through one of those links, Madabase may receive a commission without increasing the visitor's price. Affiliate relationships do not guarantee a positive recommendation. We aim to explain who a product suits, who should skip it, and which trade-offs matter." ] },
        { heading: "What we do not promise", paragraphs: ["Madabase content is general information. Tool output, examples, and product notes should be independently checked before use in production systems, safety-sensitive decisions, regulated work, or a purchase with significant consequences." ] },
      ] : [
        { heading: "内容目的", paragraphs: ["每个工具页和文章都应该帮助用户完成真实任务、理解一种数据格式，或做出更充分的判断。我们不会只为了重复关键词、制造跳转入口，或用可以互相替换的句子填充模板而创建页面。"] },
        { heading: "研究与来源", paragraphs: ["技术说明会参考对应的数据格式规范、稳定的平台文档，或工具自身的实际行为。商品指南会参考制造商规格、零售商信息、兼容性资料，并把独立判断与客观信息区分开。价格、库存、软件支持和硬件版本可能变化，用户在行动前应再次核实这些时效性信息。"] },
        { heading: "更新与纠错", paragraphs: ["当工具行为发生变化、来源过期、兼容性信息需要修正，或读者报告了可以复现的问题时，我们会更新页面。对于商品和其他时效性内容，条件允许时会标记更新记录。如果发现错误，请发送邮件到 bingmada003@gmail.com，并附上页面地址、相关内容和证据。"] },
        { heading: "联盟链接披露", paragraphs: ["部分独立选购站点会使用联盟链接。如果用户通过这些链接购买商品，Madabase 可能获得佣金，但不会增加用户的购买价格。联盟关系不等于保证推荐，我们会尽量说明商品适合谁、不适合谁，以及真正需要权衡的地方。"] },
        { heading: "不作出的承诺", paragraphs: ["Madabase 的内容属于一般信息。工具结果、示例和商品说明在用于生产系统、安全敏感决策、受监管工作或重要购买前，都应由用户自行复核。"] },
      ]}
    />
  );
}
