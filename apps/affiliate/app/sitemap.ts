import type { MetadataRoute } from "next";
import { siteGuides, siteProducts, siteRoundups, siteTools } from "@/lib/content";
import { contentDate } from "@/lib/seo";
import { marketSitemapEntries } from "@/lib/market-content";
import { effectiveContentUpdatedAt, searchOpportunityUpdatedAt } from "@/lib/search-opportunities";
import { staticPageSlugs } from "@/lib/static-pages";
import { getCurrentSite } from "@/lib/sites";
import { listIndexableCostumeProducts } from "@/lib/costume-catalog";
import { costumeHalloweenIdeaSlugs } from "@/lib/costume-halloween-ideas";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getCurrentSite();
  if (site.previewNoIndex) return [];
  const products = siteProducts(site.key).filter((item) => !item.sitemapExcluded);
  const roundups = siteRoundups(site.key).filter((item) => !item.sitemapExcluded);
  const guides = siteGuides(site.key).filter((item) => !item.sitemapExcluded);
  const tools = siteTools(site.key).filter((item) => !item.sitemapExcluded);
  const costumeProducts = site.key === "costume" ? await listIndexableCostumeProducts(100) : [];
  const urls: Array<{
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
    lastModified?: Date;
  }> = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    ...(site.key === "costume"
      ? [
          { path: "/halloween", changeFrequency: "weekly" as const, priority: 0.95, lastModified: new Date("2026-08-03T00:00:00Z") },
          { path: "/best/halloween-animatronics-small-yards-and-porches", changeFrequency: "weekly" as const, priority: 0.92, lastModified: new Date("2026-08-03T00:00:00Z") },
          { path: "/halloween-ideas", changeFrequency: "weekly" as const, priority: 0.93, lastModified: new Date("2026-08-06T00:00:00Z") },
          ...costumeHalloweenIdeaSlugs.map((slug) => ({
            path: `/halloween-ideas/${slug}`,
            changeFrequency: "monthly" as const,
            priority: 0.9,
            lastModified: new Date("2026-08-06T00:00:00Z"),
          })),
          { path: "/premium", changeFrequency: "weekly" as const, priority: 0.82 },
        ]
      : []),
    ...staticPageSlugs.map((slug) => ({ path: `/${slug}`, changeFrequency: "monthly" as const, priority: 0.45 })),
    ...site.categories.map((category) => ({
      path: `/categories/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.75,
      ...(guides.some((guide) => guide.category === category.slug && guide.familySlug)
        ? { lastModified: new Date("2026-08-16T00:00:00Z") }
        : {}),
    })),
    ...roundups.map((item) => {
      const updated = contentDate(effectiveContentUpdatedAt(item.updatedAt, searchOpportunityUpdatedAt(site.key, "roundup", item.slug)));

      return {
        path: `/best/${item.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.9,
        ...(updated ? { lastModified: updated.date } : {}),
      };
    }),
    ...products.map((item) => {
      const updated = contentDate(effectiveContentUpdatedAt(item.updatedAt, searchOpportunityUpdatedAt(site.key, "product", item.slug)));

      return {
        path: `/reviews/${item.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.82,
        ...(updated ? { lastModified: updated.date } : {}),
      };
    }),
    ...costumeProducts.map((item) => ({
      path: `/products/${item.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.84,
      lastModified: item.lastSeenAt,
    })),
    ...guides.map((item) => {
      const updated = contentDate(effectiveContentUpdatedAt(item.updatedAt, searchOpportunityUpdatedAt(site.key, "guide", item.slug)));

      return {
        path: `/guides/${item.slug}`,
        changeFrequency: "monthly" as const,
        priority: 0.72,
        ...(updated ? { lastModified: updated.date } : {}),
      };
    }),
    ...tools.map((item) => ({ path: `/tools/${item.slug}`, changeFrequency: "monthly" as const, priority: 0.68 })),
    ...marketSitemapEntries(site.key).map((item) => {
      const updated = contentDate(item.updatedAt);
      return {
        path: item.path,
        changeFrequency: item.changeFrequency,
        priority: item.priority,
        ...(updated ? { lastModified: updated.date } : {}),
      };
    }),
  ];

  return urls.map((entry) => ({
    url: new URL(entry.path || "/", site.domain).toString(),
    changeFrequency: entry.changeFrequency,
    priority: entry.priority,
    ...(entry.lastModified ? { lastModified: entry.lastModified } : {}),
  }));
}
