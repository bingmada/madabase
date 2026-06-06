import type { MetadataRoute } from "next";
import { aiProducts } from "@/lib/ai-products";
import { locales } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/seo";
import { toolRegistry } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const routes = ["", "/tools", "/ai"];

  return locales.flatMap((locale) => [
    ...routes.map((route) => ({ url: `${baseUrl}/${locale}${route}`, lastModified: new Date() })),
    ...toolRegistry.map((tool) => ({ url: `${baseUrl}/${locale}/tools/${tool.slug}`, lastModified: new Date() })),
    ...aiProducts.map((product) => ({ url: `${baseUrl}/${locale}/ai/${product.slug}`, lastModified: new Date() })),
  ]);
}
