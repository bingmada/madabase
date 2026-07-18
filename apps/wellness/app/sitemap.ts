import type { MetadataRoute } from "next";
import { guides, site, wellnessCategories } from "./site-data";

const staticPaths = [
  "",
  "/about",
  "/methodology",
  "/editorial-policy",
  "/affiliate-disclosure",
  "/privacy",
  "/contact",
  "/categories",
  "/best/premium-wellness-catalog",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...staticPaths,
    ...guides.map((guide) => guide.slug),
    ...wellnessCategories.map((category) => `/categories/${category.slug}`),
  ].map((path) => ({
    url: `${site.domain}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
