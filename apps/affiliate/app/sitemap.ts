import type { MetadataRoute } from "next";
import { guides, products, roundups, tools } from "@/lib/content";
import { getCurrentSite } from "@/lib/sites";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getCurrentSite();
  const now = new Date();
  const urls = [
    "",
    ...site.categories.map((category) => `/categories/${category.slug}`),
    ...roundups.filter((item) => item.site === site.key).map((item) => `/best/${item.slug}`),
    ...products.filter((item) => item.site === site.key).map((item) => `/reviews/${item.slug}`),
    ...guides.filter((item) => item.site === site.key).map((item) => `/guides/${item.slug}`),
    ...tools.filter((item) => item.site === site.key).map((item) => `/tools/${item.slug}`),
  ];

  return urls.map((path) => ({
    url: new URL(path || "/", site.domain).toString(),
    lastModified: now,
  }));
}
