import type { Locale } from "./i18n";

const localFaq = {
  en: { q: "Does this tool upload my input?", a: "No. This tool runs in your browser for the first release, so your input stays local." },
  zh: { q: "这个工具会上传我的输入吗？", a: "不会。第一版工具在浏览器本地运行，你输入的内容会保留在本地。" },
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
    return null;
  }
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
      currentList.push(trimmedLine);
    } else if (currentSection === "keywords") {
      currentList.push(trimmedLine);
    } else if (currentSection === "category") {
      result[currentLocale].category = trimmedLine;
    } else if (currentSection && ["title", "h1", "description", "seoTitle", "seoDescription", "intro"].includes(currentSection)) {
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
