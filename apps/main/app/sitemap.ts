import type { MetadataRoute } from "next";
import { guides } from "@/lib/content";
import { siteUrl } from "@/lib/seo";

const staticPages = [
  { path: "", priority: 1, frequency: "weekly" as const },
  { path: "/research", priority: 0.9, frequency: "weekly" as const },
  { path: "/guides", priority: 0.9, frequency: "weekly" as const },
  { path: "/methodology", priority: 0.7, frequency: "monthly" as const },
  { path: "/about", priority: 0.6, frequency: "monthly" as const },
  { path: "/editorial-policy", priority: 0.5, frequency: "monthly" as const },
  { path: "/affiliate-disclosure", priority: 0.4, frequency: "monthly" as const },
  { path: "/contact", priority: 0.3, frequency: "yearly" as const },
  { path: "/privacy", priority: 0.2, frequency: "yearly" as const },
  { path: "/terms", priority: 0.2, frequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPages.map((page) => ({ url: `${siteUrl}${page.path}`, changeFrequency: page.frequency, priority: page.priority, lastModified: new Date("2026-07-21") })),
    ...guides.map((guide) => ({ url: `${siteUrl}/guides/${guide.slug}`, changeFrequency: "monthly" as const, priority: 0.8, lastModified: new Date("2026-07-21") })),
  ];
}
