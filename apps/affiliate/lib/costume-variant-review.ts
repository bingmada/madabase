import type { Prisma } from "../generated/prisma/client";
import reviewed from "./reviewed-costume-variants.json";

export type CostumeVariantReview = (typeof reviewed.rows)[number];
export type CostumeVariantState = {
  identity: "matched" | "conflict";
  review: CostumeVariantReview;
  hold: string | null;
};
type VariantIdentity = {
  id: string;
  externalId: string;
  variantId: string | null;
  title: string;
  destinationUrl: string;
  raw: unknown;
};
const byId = new Map(reviewed.rows.map((row) => [row.id, row]));

// A parent URL or another size/transaction must never inherit this review.
export function costumeDestinationsMatch(left: string, right: string) {
  try {
    const a = new URL(left);
    const b = new URL(right);
    const allowed = (url: URL) => url.protocol === "https:"
      && ["abracadabranyc.com", "www.abracadabranyc.com"].includes(url.hostname);
    return allowed(a) && allowed(b)
      && a.pathname.replace(/\/$/, "") === b.pathname.replace(/\/$/, "")
      && Boolean(a.searchParams.get("variant"))
      && a.searchParams.getAll("variant").length === 1
      && b.searchParams.getAll("variant").length === 1
      && a.searchParams.get("variant") === b.searchParams.get("variant");
  } catch {
    return false;
  }
}

export function costumeVariantState(product: VariantIdentity): CostumeVariantState | null {
  const review = byId.get(product.id);
  if (!review) return null;
  const raw = product.raw && typeof product.raw === "object" && !Array.isArray(product.raw)
    ? product.raw as Record<string, unknown> : {};
  const matches = product.externalId === review.externalId
    && product.variantId === review.variantId
    && product.title === review.title
    && String(raw.item_group_id ?? "") === review.groupId
    && String(raw.mpn ?? "").trim() === String(review.sku ?? "").trim()
    && costumeDestinationsMatch(product.destinationUrl, review.destinationUrl);
  if (!matches) return { identity: "conflict", review, hold: "The listing no longer matches the reviewed product and selected option. Its retailer link is paused until the identity is checked again." };
  return {
    identity: "matched",
    review,
    // Known stock failures and conflicts stay held until new evidence is
    // reviewed. Expiring an observation must not reactivate an old link.
    hold: !review.available
      ? "The exact selected option was unavailable at the last retailer check. Another size or rental/purchase option is not a verified substitute."
      : review.hold,
  };
}

export function costumeReviewedCommerceWhere(): Prisma.MerchantProductWhereInput {
  return { id: { notIn: reviewed.rows.filter((row) => !row.available || row.hold).map((row) => row.id) } };
}

export function costumeReviewedRentalWhere(): Prisma.MerchantProductWhereInput {
  // The legacy flag describes parent marketing, not the selected variant.
  return { id: { in: reviewed.rows.filter((row) => row.transaction === "rent").map((row) => row.id) } };
}

export function costumeReviewedPriceWhere(minimum: number, maximum: number): Prisma.MerchantProductWhereInput {
  return { OR: [
    { id: { in: reviewed.rows.filter((row) => Number(row.price) >= minimum && Number(row.price) < maximum).map((row) => row.id) } },
    { id: { notIn: reviewed.rows.map((row) => row.id) }, price: { ...(Number.isFinite(minimum) ? { gte: minimum } : {}), ...(Number.isFinite(maximum) ? { lt: maximum } : {}) } },
  ] };
}

export function costumeTransactionLabel(state: CostumeVariantState | null | undefined) {
  if (!state || state.identity !== "matched") return null;
  return state.review.transaction === "rent" ? "Selected rental"
    : state.review.transaction === "buy" ? "Selected purchase" : null;
}

export function costumeObservationDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}
