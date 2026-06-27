import { getAllBlogPosts } from "./blog";
import type { Locale } from "./i18n";
import { testRegistry } from "./test-registry";
import { toolRegistry } from "./tool-registry";

export type SearchItem = {
  type: "tool" | "test" | "blog";
  title: string;
  description: string;
  href: string;
  keywords: string;
};

export async function getSearchIndex(locale: Locale): Promise<SearchItem[]> {
  const posts = await getAllBlogPosts(locale);
  return [
    ...toolRegistry.map((tool) => ({
      type: "tool" as const,
      title: tool.h1[locale],
      description: tool.description[locale],
      href: `/${locale}/tools/${tool.slug}`,
      keywords: [tool.slug, ...tool.keywords, tool.category].join(" "),
    })),
    ...testRegistry.map((test) => ({
      type: "test" as const,
      title: test.title[locale],
      description: test.description[locale],
      href: `/${locale}/${test.slug}`,
      keywords: [test.slug, test.category, ...test.resultTypes].join(" "),
    })),
    ...posts.map((post) => ({
      type: "blog" as const,
      title: post.title,
      description: post.description,
      href: `/${locale}/blog/${post.slug}`,
      keywords: [post.slug, post.date].join(" "),
    })),
  ];
}
