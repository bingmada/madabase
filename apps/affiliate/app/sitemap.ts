import type { MetadataRoute } from "next";
import { siteGuides, siteProducts, siteRoundups, siteTools } from "@/lib/content";
import { contentDate } from "@/lib/seo";
import { staticPageSlugs } from "@/lib/static-pages";
import { getCurrentSite } from "@/lib/sites";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getCurrentSite();
  const products = siteProducts(site.key);
  const roundups = siteRoundups(site.key);
  const guides = siteGuides(site.key);
  const tools = siteTools(site.key);
  const urls: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
    lastModified?: Date;
  }> = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    ...staticPageSlugs.map((slug) => ({ path: `/${slug}`, changeFrequency: "monthly" as const, priority: 0.45 })),
    ...site.categories.map((category) => ({ path: `/categories/${category.slug}`, changeFrequency: "weekly" as const, priority: 0.75 })),
    ...roundups.map((item) => ({ path: `/best/${item.slug}`, changeFrequency: "weekly" as const, priority: 0.9 })),
    ...products.map((item) => {
      const updated = contentDate(item.updatedAt);

      return {
        path: `/reviews/${item.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.82,
        ...(updated ? { lastModified: updated.date } : {}),
      };
    }),
    ...guides.map((item) => {
      const updated = contentDate(item.updatedAt);

      return {
        path: `/guides/${item.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.72,
        ...(updated ? { lastModified: updated.date } : {}),
      };
    }),
    ...tools.map((item) => ({ path: `/tools/${item.slug}`, changeFrequency: "monthly" as const, priority: 0.68 })),
  ];

  return urls.map((entry) => ({
    url: new URL(entry.path || "/", site.domain).toString(),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
    ...(entry.lastModified ? { lastModified: entry.lastModified } : {}),
  }));
}
