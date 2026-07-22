import type { NextConfig } from "next";
import { resolve } from "node:path";

const cacheHeaders = [
  { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" },
  { key: "CDN-Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
];

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_RELEASE_DIST_DIR ?? ".next",
  output: process.env.NEXT_STANDALONE_RELEASE === "1" ? "standalone" : undefined,
  outputFileTracingRoot: resolve(process.cwd(), "../.."),
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      ...["/", "/research", "/guides/:path*", "/methodology", "/about", "/editorial-policy", "/affiliate-disclosure", "/contact", "/privacy", "/terms", "/robots.txt", "/sitemap.xml", "/llms.txt"].map((source) => ({ source, headers: cacheHeaders })),
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
