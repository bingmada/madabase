import type { Locale } from "./i18n";

const localFaq = {
  en: { q: "Does this tool upload my input?", a: "No. The tool runs in your browser, so your input stays on your device." },
  zh: { q: "这个工具会上传我的输入吗？", a: "不会。工具在浏览器本地运行，你输入的内容会保留在你的设备上。" },
};

export type LocalizedStep = {
  title: string;
  content: string;
};

export type LocalizedExample = {
  input: string;
  output: string;
};

export type LocalizedFaq = {
  q: string;
  a: string;
};

export type ToolContent = {
  slug: string;
  title: Record<Locale, string>;
  h1: Record<Locale, string>;
  description: Record<Locale, string>;
  seo: {
    en: { title: string; description: string; keywords: string[] };
    zh: { title: string; description: string; keywords: string[] };
  };
  intro: Record<Locale, string>;
  howToUse: Record<Locale, LocalizedStep[]>;
  examples: Record<Locale, LocalizedExample[]>;
  faq: Record<Locale, LocalizedFaq[]>;
  relatedTools: string[];
  category: "developer" | "ai" | "text" | "web" | "creator";
};

// Server-only content loader using fs
export async function loadToolContent(slug: string, locale: Locale): Promise<ToolContent | null> {
  try {
    const fs = await import("node:fs");
    const pathModule = await import("node:path");
    
    const filePath = pathModule.join(process.cwd(), "content", "tools", locale, `${slug}.txt`);
    const content = await fs.promises.readFile(filePath, "utf-8");
    
    const parsed = parseToolContent(content, locale);
    
    return {
      ...parsed,
      faq: {
        en: [...(parsed.faq.en || []), localFaq.en],
        zh: [...(parsed.faq.zh || []), localFaq.zh],
      },
    };
  } catch {
    return getRegistryToolContent(slug);
  }
}

async function getRegistryToolContent(slug: string): Promise<ToolContent | null> {
  const { toolMap } = await import("./tool-registry");
  const tool = toolMap.get(slug);
  if (!tool) return null;
  const relatedTools = tool.relatedTools.filter((relatedSlug) => toolMap.has(relatedSlug));
  const primaryKeyword = tool.keywords[0] ?? tool.h1.en.toLowerCase();

  return {
    slug,
    title: tool.h1,
    h1: tool.h1,
    description: tool.description,
    seo: {
      en: {
        title: `${tool.h1.en} - Free Browser-Based Tool`,
        description: `${tool.description.en} Use this free online tool in your browser with no sign-up required.`,
        keywords: tool.keywords,
      },
      zh: {
        title: `${tool.h1.zh} - 免费浏览器工具`,
        description: `${tool.description.zh} 无需注册，直接在浏览器中使用。`,
        keywords: tool.keywords,
      },
    },
    intro: {
      en: `${tool.description.en} This ${primaryKeyword} is designed for quick browser-based work: enter your inputs, review the result, and adjust the assumptions until the output fits your situation. It is useful for lightweight planning, everyday calculations, cleanup tasks, and repeatable workflows where you want a fast answer without creating an account.`,
      zh: `${tool.description.zh} 这个工具适合在浏览器里快速完成轻量计算、整理或规划：输入必要信息，查看结果，再根据实际情况调整假设。无需注册，适合日常决策、内容处理和重复性工作流。`,
    },
    howToUse: {
      en: [
        { title: "Enter the required values", content: "Add the text, numbers, dates, or options the tool asks for. Use realistic inputs so the result is easier to interpret." },
        { title: "Generate the result", content: "Run the tool and review the output immediately in your browser. Most workflows are designed for quick iteration." },
        { title: "Adjust and reuse", content: "Change one input at a time to compare scenarios, then copy or save the result you want to keep." },
      ],
      zh: [
        { title: "输入必要信息", content: "按工具提示填写文本、数字、日期或选项。输入越贴近真实场景，结果越容易参考。" },
        { title: "生成结果", content: "运行工具并在浏览器中直接查看输出，大多数流程都适合快速反复调整。" },
        { title: "调整并复用", content: "一次修改一个输入，对比不同结果，然后复制或保留最适合当前场景的输出。" },
      ],
    },
    examples: {
      en: [{ input: `Use ${tool.h1.en} with a realistic value or short sample.`, output: `The tool returns a clear ${tool.category} workflow result you can review, adjust, or copy.` }],
      zh: [{ input: `使用${tool.h1.zh}并输入一个真实示例。`, output: `工具会生成清晰的${tool.category}类结果，便于查看、调整或复制。` }],
    },
    faq: {
      en: [localFaq.en],
      zh: [localFaq.zh],
    },
    relatedTools,
    category: tool.category,
  };
}

function parseToolContent(content: string, requestedLocale: Locale) {
  const lines = content.split("\n");
  const result: Record<string, Record<string, unknown>> = {
    en: {},
    zh: {},
  };

  const hasLocaleDelimiter = lines.some((line) => line.trim() === "///");
  let currentLocale: "en" | "zh" = hasLocaleDelimiter ? "en" : requestedLocale;
  let currentSection: string | null = null;
  let currentList: string[] = [];
  let sectionData: Record<string, string> = {};
  let exampleSide: "input" | "output" = "input";

  const flushSectionData = () => {
    if (currentSection === "howToUse" && (sectionData.title || sectionData.content)) {
      currentList.push(JSON.stringify(sectionData));
    } else if (currentSection === "examples" && (sectionData.input || sectionData.output)) {
      currentList.push(JSON.stringify(sectionData));
    } else if (currentSection === "faq" && (sectionData.q || sectionData.a)) {
      currentList.push(JSON.stringify(sectionData));
    }
    sectionData = {};
  };

  const flushList = (locale: "en" | "zh") => {
    if (currentList.length === 0) return;
    if (currentSection === "howToUse") result[locale].howToUse = currentList;
    else if (currentSection === "examples") result[locale].examples = currentList;
    else if (currentSection === "faq") result[locale].faq = currentList;
    else if (currentSection === "relatedTools") result[locale].relatedTools = currentList;
    else if (currentSection === "keywords") result[locale].keywords = currentList;
    currentList = [];
  };

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (trimmedLine === "[TITLE]") { currentSection = "title"; continue; }
    if (trimmedLine === "[H1]") { currentSection = "h1"; continue; }
    if (trimmedLine === "[DESCRIPTION]") { currentSection = "description"; continue; }
    if (trimmedLine === "[SEO_TITLE]") { currentSection = "seoTitle"; continue; }
    if (trimmedLine === "[SEO_DESCRIPTION]") { currentSection = "seoDescription"; continue; }
    if (trimmedLine === "[INTRO]") { currentSection = "intro"; continue; }
    if (trimmedLine === "[HOW_TO_USE]") {
      flushSectionData();
      flushList(currentLocale);
      currentSection = "howToUse";
      continue;
    }
    if (trimmedLine === "[EXAMPLES]") {
      flushSectionData();
      flushList(currentLocale);
      exampleSide = "input";
      currentSection = "examples";
      continue;
    }
    if (trimmedLine === "[FAQ]") {
      flushSectionData();
      flushList(currentLocale);
      currentSection = "faq";
      continue;
    }
    if (trimmedLine === "[RELATED_TOOLS]") {
      flushSectionData();
      flushList(currentLocale);
      currentSection = "relatedTools";
      continue;
    }
    if (trimmedLine === "[KEYWORDS]") {
      flushSectionData();
      flushList(currentLocale);
      currentSection = "keywords";
      continue;
    }
    if (trimmedLine === "[CATEGORY]") {
      flushSectionData();
      flushList(currentLocale);
      currentSection = "category";
      continue;
    }

    if (trimmedLine === "---") {
      flushSectionData();
      exampleSide = "input";
      continue;
    }
    if (trimmedLine === "===") {
      if (currentSection === "examples") {
        exampleSide = "output";
      } else {
        flushSectionData();
      }
      continue;
    }
    if (trimmedLine === "///") {
      const previousLocale = currentLocale;
      flushSectionData();
      flushList(previousLocale);
      currentLocale = currentLocale === "en" ? "zh" : "en";
      continue;
    }

    if (currentSection === "howToUse") {
      if (!sectionData.title) sectionData.title = trimmedLine;
      else sectionData.content = trimmedLine;
    } else if (currentSection === "examples") {
      sectionData[exampleSide] = sectionData[exampleSide] ? `${sectionData[exampleSide]}\n${trimmedLine}` : trimmedLine;
    } else if (currentSection === "faq") {
      const isQuestion = /[?？]$/.test(trimmedLine);
      if (isQuestion) {
        flushSectionData();
        sectionData.q = trimmedLine;
      } else if (sectionData.q) {
        sectionData.a = sectionData.a ? `${sectionData.a}\n${trimmedLine}` : trimmedLine;
      }
    } else if (currentSection === "relatedTools") {
      if (trimmedLine) currentList.push(trimmedLine);
    } else if (currentSection === "keywords") {
      if (trimmedLine) currentList.push(trimmedLine);
    } else if (currentSection === "category") {
      if (trimmedLine) result[currentLocale].category = trimmedLine;
    } else if (currentSection === "intro") {
      if (trimmedLine) {
        const existing = result[currentLocale].intro as string | undefined;
        result[currentLocale].intro = existing ? `${existing}\n\n${trimmedLine}` : trimmedLine;
      }
    } else if (currentSection && ["title", "h1", "description", "seoTitle", "seoDescription"].includes(currentSection)) {
      if (!result[currentLocale][currentSection]) result[currentLocale][currentSection] = trimmedLine;
    }
  }

  flushSectionData();
  flushList(currentLocale);

  return {
    slug: "",
    title: { en: result.en.title as string || "", zh: result.zh.title as string || "" },
    h1: { en: result.en.h1 as string || "", zh: result.zh.h1 as string || "" },
    description: { en: result.en.description as string || "", zh: result.zh.description as string || "" },
    seo: {
      en: {
        title: result.en.seoTitle as string || "",
        description: result.en.seoDescription as string || "",
        keywords: (result.en.keywords as string[]) || [],
      },
      zh: {
        title: result.zh.seoTitle as string || "",
        description: result.zh.seoDescription as string || "",
        keywords: (result.zh.keywords as string[]) || [],
      },
    },
    intro: { en: result.en.intro as string || "", zh: result.zh.intro as string || "" },
    howToUse: {
      en: (result.en.howToUse as string[] || []).map((s) => JSON.parse(s)),
      zh: (result.zh.howToUse as string[] || []).map((s) => JSON.parse(s)),
    },
    examples: {
      en: (result.en.examples as string[] || []).map((s) => JSON.parse(s)),
      zh: (result.zh.examples as string[] || []).map((s) => JSON.parse(s)),
    },
    faq: {
      en: (result.en.faq as string[] || []).map((s) => JSON.parse(s)),
      zh: (result.zh.faq as string[] || []).map((s) => JSON.parse(s)),
    },
    relatedTools: ((result.en.relatedTools as string[]) || (result.zh.relatedTools as string[])) || [],
    category: ((result.en.category as ToolContent["category"]) || (result.zh.category as ToolContent["category"])) || "developer",
  };
}
