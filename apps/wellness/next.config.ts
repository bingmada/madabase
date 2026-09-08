import type { NextConfig } from "next";
import { resolve } from "node:path";

const cacheHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
  },
];

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_RELEASE_DIST_DIR ?? ".next",
  output: process.env.NEXT_STANDALONE_RELEASE === "1" ? "standalone" : undefined,
  outputFileTracingRoot: resolve(process.cwd(), "../.."),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avidlove.com",
        pathname: "/cdn/shop/files/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: cacheHeaders,
      },
      {
        source: "/images/wellness/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
