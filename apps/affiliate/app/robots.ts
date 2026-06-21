import type { MetadataRoute } from "next";
import { getSiteByKey } from "@/lib/sites";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteByKey(process.env.NEXT_PUBLIC_AFFILIATE_SITE);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: new URL("/sitemap.xml", site.domain).toString(),
  };
}
