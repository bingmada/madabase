import type { Product } from "./types";

export type AmazonProductOverride = Pick<Product, "amazonTitle" | "amazonImage" | "amazonDetailUrl" | "amazonFeatures">;

export const amazonProductOverrides: Record<string, AmazonProductOverride> = {};
