import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    ];
  },
};

export default nextConfig;
