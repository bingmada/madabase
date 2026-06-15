export const locales = ["en", "zh"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  zh: "中文",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocaleAlternates(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return Object.fromEntries(locales.map((locale) => [locale, `/${locale}${normalizedPath}`])) as Record<Locale, string>;
}

export const testCategoryLabels: Record<string, Record<Locale, string>> = {
  personality: { en: "Personality", zh: "人格" },
  career: { en: "Career", zh: "职业" },
  relationship: { en: "Relationship", zh: "关系" },
  intelligence: { en: "Intelligence", zh: "能力" },
  learning: { en: "Learning", zh: "学习" },
};

export const toolCategoryLabels: Record<string, Record<Locale, string>> = {
  developer: { en: "Developer", zh: "开发工具" },
  ai: { en: "AI", zh: "智能工具" },
  text: { en: "Text", zh: "文本工具" },
  web: { en: "Web", zh: "网页工具" },
  creator: { en: "Creator", zh: "创作工具" },
};

export function getCategoryLabel(category: string, locale: Locale, labels: Record<string, Record<Locale, string>>) {
  return labels[category]?.[locale] ?? category;
}
