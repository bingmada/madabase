import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/seo";
import { testRegistry } from "@/lib/test-registry";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  return locales.flatMap((locale) => [
    { url: `${baseUrl}/${locale}`, changeFrequency: "weekly" as const, priority: 1 },
    ...testRegistry.map((test) => ({
      url: `${baseUrl}/${locale}/${test.slug}`,
      changeFrequency: "monthly" as const,
      priority: test.popular ? 0.9 : 0.8,
    })),
  ]);
}
