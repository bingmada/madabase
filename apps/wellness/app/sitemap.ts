import type { MetadataRoute } from "next";
import { site, wellnessCategories } from "./site-data";

const staticPaths = [
  "",
  "/about",
  "/methodology",
  "/editorial-policy",
  "/affiliate-disclosure",
  "/privacy",
  "/contact",
  "/categories",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...staticPaths,
    ...wellnessCategories.map((category) => `/categories/${category.slug}`),
  ].map((path) => ({
    url: `${site.domain}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
