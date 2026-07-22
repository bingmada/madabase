import type { NextConfig } from "next";
import { resolve } from "node:path";

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_RELEASE_DIST_DIR ?? ".next",
  output: process.env.NEXT_STANDALONE_RELEASE === "1" ? "standalone" : undefined,
  outputFileTracingRoot: resolve(process.cwd(), "../.."),
};

export default nextConfig;
