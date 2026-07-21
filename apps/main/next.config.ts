import type { NextConfig } from "next";

const cacheHeaders = [
  { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" },
  { key: "CDN-Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
];

const nextConfig: NextConfig = {
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
