import data from "../config/reviewed-product-content.json";
import type { Product } from "./types";

type ProductRepair = Partial<Pick<Product, "name" | "amazonTitle" | "summary" | "verdict" | "bestFor" | "rating" | "scores" | "pros" | "cons" | "specs" | "evidence" | "sources" | "purchaseCheck" | "purchaseAlternatives" | "updatedAt" | "researchNote" | "editorialSections">>;
const repairs = data as Record<string, ProductRepair>;

export function applyReviewedProductContent(product: Product): Product {
  const repair = repairs[`${product.site}:${product.slug}`];
  return repair ? { ...product, ...repair } : product;
}
