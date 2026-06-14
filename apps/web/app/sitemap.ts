import type { MetadataRoute } from "next";
import { aiProducts } from "@/lib/ai-products";
import { getAllBlogPosts } from "@/lib/blog";
import { locales } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/seo";
import { testRegistry } from "@/lib/test-registry";
import { toolRegistry, getCategories } from "@/lib/tool-registry";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const routes = ["", "/tools", "/tests", "/ai", "/blog"];
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
    ...testRegistry.map((test) => ({ url: `${baseUrl}/${locale}/tests/${test.slug}`, lastModified: new Date() })),
    ...testRegistry.flatMap((test) => test.resultTypes.map((type) => ({ url: `${baseUrl}/${locale}/tests/${test.slug}/result/${type.toLowerCase()}`, lastModified: new Date() }))),
    ...aiProducts.map((product) => ({ url: `${baseUrl}/${locale}/ai/${product.slug}`, lastModified: new Date() })),
    ...blogEntries[locales.indexOf(locale)],
  ]);
}
