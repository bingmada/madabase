import { getAllBlogPosts } from "./blog";
import type { Locale } from "./i18n";
import { discoverableToolRegistry } from "./tool-registry";

export type SearchItem = {
  type: "tool" | "blog";
  title: string;
  description: string;
  href: string;
  keywords: string;
};

export async function getSearchIndex(locale: Locale): Promise<SearchItem[]> {
  const posts = await getAllBlogPosts(locale);
  return [
    ...discoverableToolRegistry.map((tool) => ({
      type: "tool" as const,
      title: tool.h1[locale],
      description: tool.description[locale],
      href: `/${locale}/tools/${tool.slug}`,
      keywords: [tool.slug, ...tool.keywords, tool.category].join(" "),
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
