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
        source: "/reviews/philips-avent-bottle-sterilizer",
        destination: "/best/best-bottle-sterilizers-and-dryers",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
