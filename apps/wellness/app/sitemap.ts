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
  const contentLastModified = new Date("2026-09-08T00:00:00.000Z");
  return [
    ...staticPaths,
    ...wellnessCategories
      .filter((category) => category.availability === "active")
      .map((category) => `/categories/${category.slug}`),
  ].map((path) => ({
    url: `${site.domain}${path}`,
    lastModified: contentLastModified,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
