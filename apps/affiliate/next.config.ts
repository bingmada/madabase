import type { NextConfig } from "next";
import { resolve } from "node:path";

const pageCacheHeaders = [
  {
    key: "Cache-Control",
    value: "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
  },
  {
    key: "CDN-Cache-Control",
    value: "public, max-age=3600, stale-while-revalidate=86400",
  },
];

const cacheablePageSources = [
  "/",
  "/about",
  "/methodology",
  "/editorial-policy",
  "/affiliate-disclosure",
  "/contact",
  "/halloween",
  "/categories/:path*",
  "/best/:path*",
  "/reviews/:path*",
  "/guides/:path*",
  "/tools/:path*",
  "/sitemap.xml",
  "/sitemap-index.xml",
  "/robots.txt",
  "/llms.txt",
];

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_RELEASE_DIST_DIR ?? ".next",
  // Keep the existing `next build` + `next start` path unchanged. The
  // low-resource release command opts into the traced standalone runtime.
  output: process.env.NEXT_STANDALONE_RELEASE === "1" ? "standalone" : undefined,
  outputFileTracingRoot: resolve(process.cwd(), "../.."),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "images-na.ssl-images-amazon.com",
      },
    ],
  },
  async headers() {
    return [
      ...cacheablePageSources.map((source) => ({
        source,
        headers: pageCacheHeaders,
      })),
      {
        source: "/images/affiliate/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/reviews/ergotron-lx-monitor-arm",
        destination: "/best/best-monitor-arms-for-home-office",
        permanent: true,
      },
      {
        source: "/reviews/ergotron-hx",
        destination: "/reviews/ergotron-hx-monitor-arm",
        permanent: true,
      },
      {
        source: "/reviews/philips-avent-bottle-sterilizer",
        destination: "/best/best-bottle-sterilizers-and-dryers",
        permanent: true,
      },
      {
        source: "/reviews/philips-avent-sterilizer",
        destination: "/best/best-bottle-sterilizers-and-dryers",
        permanent: true,
      },
      {
        source: "/reviews/tp-link-deco-be63",
        destination: "/reviews/tp-link-deco-be63-wifi-7-mesh",
        permanent: true,
      },
      {
        source: "/best/deco-be63-vs-be67",
        destination: "/best/tp-link-deco-be67-vs-be63",
        permanent: true,
      },
      {
        source: "/best/best-wifi-7-mesh",
        destination: "/best/best-mesh-wifi-for-apartments-and-homes",
        permanent: true,
      },
      {
        source: "/guides/baby-carrier-for-warm-weather-guide",
        destination: "/guides/baby-carrier-hot-weather-and-caregiver-fit-guide",
        permanent: true,
      },
      {
        source: "/guides/standing-desk-wheels-pros-cons-small-spaces",
        destination: "/guides/standing-desk-casters-stability-guide",
        permanent: true,
      },
      {
        source: "/guides/non-wifi-baby-monitor-guide",
        destination: "/guides/wifi-vs-non-wifi-baby-monitor-guide",
        permanent: true,
      },
      {
        source: "/best/best-bottle-sterilizer-dryer-for-pump-parts",
        destination: "/best/best-bottle-sterilizers-and-dryers",
        permanent: true,
      },
      {
        source: "/best/best-bottle-sterilizer-dryer-for-small-kitchens",
        destination: "/best/best-bottle-sterilizers-and-dryers",
        permanent: true,
      },
      {
        source: "/guides/baby-bottle-sterilizer-dryer-counter-space-checklist",
        destination: "/best/best-bottle-sterilizers-and-dryers",
        permanent: true,
      },
      {
        source: "/guides/bottle-sterilizer-vs-dryer-guide",
        destination: "/guides/bottle-washer-vs-sterilizer-vs-dryer-guide",
        permanent: true,
      },
      {
        source: "/guides/standing-desk-for-small-bedroom-guide",
        destination: "/best/best-standing-desks-for-small-spaces",
        permanent: true,
      },
      {
        source: "/guides/standing-desk-designs-for-small-spaces-guide",
        destination: "/best/best-standing-desks-for-small-spaces",
        permanent: true,
      },
      {
        source: "/guides/ergonomic-chair-under-500-guide",
        destination: "/best/best-ergonomic-chairs-under-500",
        permanent: true,
      },
      {
        source: "/best/best-video-call-lighting-for-home-office",
        destination: "/best/best-home-office-lighting-for-video-calls-in-small-rooms",
        permanent: true,
      },
      {
        source: "/guides/home-office-lighting-for-video-calls-checklist",
        destination: "/best/best-home-office-lighting-for-video-calls-in-small-rooms",
        permanent: true,
      },
      {
        source: "/guides/home-office-lighting-placement-guide",
        destination: "/best/best-home-office-lighting-for-video-calls-in-small-rooms",
        permanent: true,
      },
      {
        source: "/guides/litter-box-air-purifier-placement-guide",
        destination: "/guides/air-purifier-placement-near-litter-box",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
