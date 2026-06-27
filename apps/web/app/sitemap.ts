import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/blog";
import { locales } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/seo";
import { toolRegistry, getCategories } from "@/lib/tool-registry";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const categories = getCategories();
  const now = new Date();
  const staticRoutes = [
    { path: "", priority: 1, changeFrequency: "weekly" as const },
    { path: "/tools", priority: 0.95, changeFrequency: "weekly" as const },
    { path: "/blog", priority: 0.75, changeFrequency: "weekly" as const },
    { path: "/contact", priority: 0.25, changeFrequency: "yearly" as const },
  ];

  const blogEntries = await Promise.all(
    locales.map(async (locale) => {
      const posts = await getAllBlogPosts(locale);
      return posts.map((post) => ({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly" as const,
        priority: 0.65,
      }));
    }),
  );

  return locales.flatMap((locale) => [
    ...staticRoutes.map((route) => ({ url: `${baseUrl}/${locale}${route.path}`, lastModified: now, changeFrequency: route.changeFrequency, priority: route.priority })),
    ...categories.map((category) => ({ url: `${baseUrl}/${locale}/tools/category/${category}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 })),
    ...toolRegistry.map((tool) => ({ url: `${baseUrl}/${locale}/tools/${tool.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: tool.popular ? 0.9 : 0.8 })),
    ...blogEntries[locales.indexOf(locale)],
  ]);
}
