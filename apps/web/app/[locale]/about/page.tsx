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
    title: locale === "en" ? "About Madabase" : "关于 Madabase",
    description: locale === "en" ? "Learn who maintains Madabase, what it provides, and how the site approaches useful web tools." : "了解 Madabase 的维护方式、提供的内容，以及我们如何制作实用的 Web 工具。",
    locale,
    path: "/about",
    keywords: ["about madabase", "developer tools", "online tools"],
  });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const isEnglish = locale === "en";
  return (
    <InfoPage
      locale={locale}
      pathname="/about"
      eyebrow={isEnglish ? "About" : "关于我们"}
      title={isEnglish ? "Useful tools for the moment you need them." : "在你需要的时候，提供真正有用的工具。"}
      description={isEnglish ? "Madabase is a small, independent web project for browser-based developer tools, practical explanations, and carefully maintained reference content." : "Madabase 是一个独立维护的 Web 项目，提供浏览器开发工具、实用说明和持续维护的参考内容。"}
      sections={isEnglish ? [
        { heading: "What Madabase provides", paragraphs: ["The main site brings together focused browser tools for common tasks such as formatting JSON, decoding Base64, inspecting JWT claims, testing regular expressions, parsing URLs, and converting timestamps. Each tool is paired with a short explanation so that visitors can understand what the output means instead of treating the page as a black box."], bullets: ["Browser-first workflows for quick checks and small transformations", "Plain-language references for formats and debugging tasks", "Localized English and Chinese versions for the main tools"] },
        { heading: "How the tools are maintained", paragraphs: ["We review tool behavior, examples, labels, and links as the application changes. Where a tool can process input in the browser, the interface is designed to make that clear. Visitors should still avoid pasting passwords, private keys, production tokens, or other sensitive information into any web tool unless they have verified the handling requirements for their situation.", "The project is maintained as a practical reference rather than as a substitute for a production validator, security review, or official documentation." ] },
        { heading: "Related buying guides", paragraphs: ["Madabase also publishes separate buying-guide sites for selected home, network, smart-home, office, baby, pet, and style categories. Those sites have their own editorial scope and may contain affiliate links. A purchase may generate a commission for the site at no additional cost to the visitor; this does not change the technical purpose of the main Madabase tools." ] },
        { heading: "Contact", paragraphs: ["Questions, corrections, accessibility feedback, and partnership enquiries can be sent to bingmada003@gmail.com. We welcome concrete reports that include the page URL and the issue you found." ] },
      ] : [
        { heading: "Madabase 提供什么", paragraphs: ["主站聚合了多种浏览器开发工具，适合处理格式化 JSON、解码 Base64、查看 JWT claims、测试正则、解析 URL 和转换时间戳等常见任务。每个工具都配有简短说明，帮助你理解输出结果，而不是只把页面当作一个黑盒转换器。"], bullets: ["适合快速检查和小型转换的浏览器工作流", "解释数据格式和调试任务的通俗参考", "主要工具提供中文和英文版本"] },
        { heading: "工具如何维护", paragraphs: ["我们会随着应用变化检查工具行为、示例、界面文字和链接。对于可以在浏览器中处理输入的工具，页面会尽量明确说明这一点。即便如此，也不建议把密码、私钥、生产环境 token 或其他敏感信息粘贴到任何在线工具中，除非你已经确认了适合自己场景的数据处理要求。", "Madabase 是实用参考项目，不能替代生产环境校验器、安全审查或官方文档。"] },
        { heading: "相关选购指南", paragraphs: ["Madabase 还维护家庭网络、智能家居、居家办公、母婴、宠物和穿搭配饰等独立选购站点。这些站点有各自的编辑范围，可能包含联盟链接。用户通过链接购买商品时，网站可能获得佣金，但不会因此改变主站工具的技术用途。"] },
        { heading: "联系我们", paragraphs: ["如果你发现错误、遇到无障碍问题、希望反馈页面体验或讨论合作，可以发送邮件到 bingmada003@gmail.com。建议邮件中附上具体页面地址和问题描述。"] },
      ]}
    />
  );
}
