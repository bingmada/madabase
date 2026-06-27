import type { MetadataRoute } from "next";
import { guides, products, roundups, tools } from "@/lib/content";
import { staticPageSlugs } from "@/lib/static-pages";
import { getCurrentSite } from "@/lib/sites";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getCurrentSite();
  const urls: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }> = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    ...staticPageSlugs.map((slug) => ({ path: `/${slug}`, changeFrequency: "monthly" as const, priority: 0.45 })),
    ...site.categories.map((category) => ({ path: `/categories/${category.slug}`, changeFrequency: "weekly" as const, priority: 0.75 })),
    ...roundups.filter((item) => item.site === site.key).map((item) => ({ path: `/best/${item.slug}`, changeFrequency: "weekly" as const, priority: 0.9 })),
    ...products.filter((item) => item.site === site.key).map((item) => ({ path: `/reviews/${item.slug}`, changeFrequency: "weekly" as const, priority: 0.82 })),
    ...guides.filter((item) => item.site === site.key).map((item) => ({ path: `/guides/${item.slug}`, changeFrequency: "monthly" as const, priority: 0.72 })),
    ...tools.filter((item) => item.site === site.key).map((item) => ({ path: `/tools/${item.slug}`, changeFrequency: "monthly" as const, priority: 0.68 })),
  ];

  return urls.map((entry) => ({
    url: new URL(entry.path || "/", site.domain).toString(),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
  }));
}
