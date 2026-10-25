import type { Prisma } from "../generated/prisma/client";
import type { CostumeCatalogFilters } from "./costume-catalog";
import { costumeGeneralCommerceWhere } from "./costume-commerce-eligibility";
import { costumeReviewedCommerceWhere, costumeReviewedPriceWhere, costumeReviewedRentalWhere } from "./costume-variant-review";

function priceWhere(price: CostumeCatalogFilters["price"]): Prisma.MerchantProductWhereInput {
  if (price === "under-50") return costumeReviewedPriceWhere(0, 50);
  if (price === "50-199") return costumeReviewedPriceWhere(50, 200);
  if (price === "200-999") return costumeReviewedPriceWhere(200, 1000);
  if (price === "1000-plus") return costumeReviewedPriceWhere(1000, Infinity);
  return {};
}

export function compareCostumePrices(a: { id: string; title: string; price: string | null }, b: { id: string; title: string; price: string | null }, descending: boolean) {
  const left = a.price !== null && Number.isFinite(Number(a.price)) ? Number(a.price) : null;
  const right = b.price !== null && Number.isFinite(Number(b.price)) ? Number(b.price) : null;
  if (left === null || right === null) return left === right ? a.id.localeCompare(b.id) : left === null ? 1 : -1;
  return (descending ? right - left : left - right) || a.title.localeCompare(b.title) || a.id.localeCompare(b.id);
}

export function costumeProductWhere(filters: CostumeCatalogFilters): Prisma.MerchantProductWhereInput {
  const feature = filters.feature === "premium-professional"
    ? { OR: [{ premium: true }, { professional: true }] }
    : filters.feature === "rental" ? costumeReviewedRentalWhere()
    : filters.feature ? { [filters.feature]: true } : {};
  const search = filters.q ? {
    OR: ["title", "brand", "productType", "description"].map((field) => ({
      [field]: { contains: filters.q, mode: "insensitive" as const },
    })),
  } : {};

  return {
    merchant: { slug: "abracadabra-nyc", advertiserCid: "7889430" },
    softRetiredAt: null,
    availability: { not: "out of stock" },
    ...(filters.category ? { categorySlug: filters.category } : {}),
    ...(filters.audience ? { audience: { has: filters.audience } } : {}),
    ...(filters.occasion === "halloween" ? { halloween: true } : {}),
    ...(filters.occasion === "year-round" ? { halloween: false } : {}),
    // Both clauses can contain OR; a search must not overwrite the collection.
    AND: [feature, search, priceWhere(filters.price), costumeGeneralCommerceWhere(), costumeReviewedCommerceWhere()],
  };
}
