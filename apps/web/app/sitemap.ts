import type { MetadataRoute } from "next";
import { aiProducts } from "@/lib/ai-products";
import { getAllBlogPosts } from "@/lib/blog";
import { locales } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/seo";
import { toolRegistry, getCategories } from "@/lib/tool-registry";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const routes = ["", "/tools", "/ai", "/blog"];
  const categories = getCategories();

  const blogEntries = await Promise.all(
    locales.map(async (locale) => {
      const posts = await getAllBlogPosts(locale);
      return posts.map((post) => ({ url: `${baseUrl}/${locale}/blog/${post.slug}`, lastModified: new Date(post.date) }));
    }),
  );

  return locales.flatMap((locale) => [
    ...routes.map((route) => ({ url: `${baseUrl}/${locale}${route}`, lastModified: new Date() })),
    ...categories.map((category) => ({ url: `${baseUrl}/${locale}/tools/category/${category}`, lastModified: new Date() })),
    ...toolRegistry.map((tool) => ({ url: `${baseUrl}/${locale}/tools/${tool.slug}`, lastModified: new Date() })),
    ...aiProducts.map((product) => ({ url: `${baseUrl}/${locale}/ai/${product.slug}`, lastModified: new Date() })),
    ...blogEntries[locales.indexOf(locale)],
  ]);
}
