import type { Locale } from "./i18n";

export type AiProduct = {
  slug: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  features: Record<Locale, string[]>;
};

export const aiProducts: AiProduct[] = [
  {
    slug: "prompt-optimizer",
    title: { en: "Prompt Optimizer", zh: "Prompt 优化器" },
    description: {
      en: "Turn rough instructions into structured prompts for coding, writing, and analysis workflows.",
      zh: "把粗略需求转成适合编程、写作和分析工作流的结构化 Prompt。",
    },
    features: {
      en: ["Prompt rewriting", "Output structure suggestions", "Free daily usage limit", "Pro unlimited usage planned"],
      zh: ["Prompt 改写", "输出结构建议", "免费每日次数限制", "规划 Pro 无限使用"],
    },
  },
  {
    slug: "resume-builder",
    title: { en: "AI Resume Builder", zh: "AI 简历生成器" },
    description: {
      en: "Generate resume and cover letter drafts from role, skills, and experience inputs.",
      zh: "根据职位、技能和工作经历生成简历与求职信草稿。",
    },
    features: {
      en: ["Resume draft generation", "Cover letter generation", "PDF export planned", "Payment flow reserved"],
      zh: ["简历草稿生成", "求职信生成", "规划 PDF 导出", "预留支付流程"],
    },
  },
  {
    slug: "writer",
    title: { en: "AI Writer", zh: "AI 写作工具" },
    description: {
      en: "Draft blogs, emails, and product descriptions from a short brief.",
      zh: "根据简短说明生成博客、邮件和产品描述草稿。",
    },
    features: {
      en: ["Blog drafts", "Email drafts", "Product descriptions", "API integration planned"],
      zh: ["博客草稿", "邮件草稿", "产品描述", "规划 API 接入"],
    },
  },
];

export const aiProductMap = new Map(aiProducts.map((product) => [product.slug, product]));
