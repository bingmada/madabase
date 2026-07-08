import type { MetadataRoute } from "next";
import { getCurrentSite, siteKeys, sites } from "@/lib/sites";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getCurrentSite();
  const sitemapUrls = [
    new URL("/sitemap.xml", site.domain).toString(),
    new URL("/sitemap-index.xml", site.domain).toString(),
    ...siteKeys
      .map((key) => new URL("/sitemap.xml", sites[key].domain).toString())
      .filter((url) => url !== new URL("/sitemap.xml", site.domain).toString()),
  ];

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: sitemapUrls,
  };
}
