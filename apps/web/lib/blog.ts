import { promises as fs } from "node:fs";
import path from "node:path";
import type { Locale } from "./i18n";
import type { BlogFrontmatter } from "./markdown";
import { markdownToHtml, parseFrontmatter } from "./markdown";

export type BlogPost = BlogFrontmatter & {
  locale: Locale;
  content: string;
  html: string;
};

const blogRoot = path.join(process.cwd(), "content", "blog");

async function readMarkdownFile(filePath: string) {
  return fs.readFile(filePath, "utf8");
}

export async function getBlogSlugs(locale: Locale) {
  const directory = path.join(blogRoot, locale);
  const files = await fs.readdir(directory);
  return files.filter((file) => file.endsWith(".md")).map((file) => file.replace(/\.md$/, ""));
}

export async function getBlogPost(locale: Locale, slug: string): Promise<BlogPost | null> {
  const filePath = path.join(blogRoot, locale, `${slug}.md`);

  try {
    const file = await readMarkdownFile(filePath);
    const parsed = parseFrontmatter<BlogFrontmatter>(file);

    return {
      ...parsed.frontmatter,
      locale,
      content: parsed.content,
      html: markdownToHtml(parsed.content),
    };
  } catch {
    return null;
  }
}

export async function getAllBlogPosts(locale: Locale) {
  const slugs = await getBlogSlugs(locale);
  const posts = await Promise.all(slugs.map((slug) => getBlogPost(locale, slug)));

  return posts
    .filter((post): post is BlogPost => Boolean(post))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}
