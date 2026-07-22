import type { MetadataRoute } from "next";
import { getCurrentSite } from "@/lib/sites";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getCurrentSite();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    ...(site.previewNoIndex ? {} : { sitemap: new URL("/sitemap.xml", site.domain).toString() }),
  };
}
