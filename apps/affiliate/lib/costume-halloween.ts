import halloweenProductData from "@/config/costume-halloween-products.json";
import type { CostumeCatalogCategory } from "./costume-catalog";

export type CostumeHalloweenPick = {
  slug: string;
  expectedTitle: string;
  collection: string;
  targetCategory: CostumeCatalogCategory;
  summary: string;
  buyerJob: string;
  bestFor: string;
  skipIf: string;
  confirmBeforeOrdering: string[];
};

const halloweenCategories = new Set<CostumeCatalogCategory>([
  "costumes",
  "props-animatronics",
  "masks-prosthetics",
  "wigs-makeup",
  "accessories-party-effects",
]);

if (!halloweenProductData.every((product) => halloweenCategories.has(product.targetCategory as CostumeCatalogCategory))) {
  throw new Error("Costume Halloween product data contains an unsupported category");
}

export const costumeHalloweenPicks: CostumeHalloweenPick[] = halloweenProductData.map((product) => ({
  ...product,
  targetCategory: product.targetCategory as CostumeCatalogCategory,
}));

export const costumeHalloweenSlugs = costumeHalloweenPicks.map((product) => product.slug);

export function costumeHalloweenPick(slug: string) {
  return costumeHalloweenPicks.find((product) => product.slug === slug);
}
