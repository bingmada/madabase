import type { Prisma } from "../generated/prisma/client";
import { getAffiliatePrisma, hasDatabaseUrl } from "./db";
import { compareCostumePrices, costumeProductWhere } from "./costume-catalog-query";
import { collectCostumeFamilyProducts, costumeFamilyProductMatches, costumeGuideProductWhere, costumeRelatedFamily, costumeRelatedProductMatches } from "./costume-family-selection";
import { costumeGeneralCommerceWhere, costumeProductRequiresEyeCare } from "./costume-commerce-eligibility";
import { costumeVariantState, costumeReviewedCommerceWhere, type CostumeVariantState } from "./costume-variant-review";
import { collectAllCostumeProducts } from "./costume-indexable-pagination";

export const costumeCatalogCategories = [
  "costumes",
  "props-animatronics",
  "masks-prosthetics",
  "wigs-makeup",
  "accessories-party-effects",
] as const;

export type CostumeCatalogCategory = (typeof costumeCatalogCategories)[number];
export type CostumeCatalogSort = "featured" | "price-asc" | "price-desc" | "name";
export type CostumeCatalogFeature = "premium" | "professional" | "premium-professional" | "rental";
export type CostumeCatalogOccasion = "halloween" | "year-round";

export type CostumeCatalogFilters = {
  q: string;
  category?: CostumeCatalogCategory;
  price?: "under-50" | "50-199" | "200-999" | "1000-plus";
  audience?: "adult" | "kids" | "male" | "female" | "unisex";
  occasion?: CostumeCatalogOccasion;
  feature?: CostumeCatalogFeature;
  sort: CostumeCatalogSort;
  page: number;
};

export type CostumeCatalogProduct = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  brand: string | null;
  productType: string | null;
  categorySlug: CostumeCatalogCategory;
  tags: string[];
  audience: string[];
  price: string | null;
  currency: string;
  availability: string;
  premium: boolean;
  professional: boolean;
  halloween: boolean;
  rental: boolean;
  destinationUrl: string;
  variantState: CostumeVariantState | null;
  lastSeenAt: Date;
  authorizedImage: { url: string; altText: string | null; permissionRef: string } | null;
  activeLink: { clickToken: string; verifiedAt: Date } | null;
  editorial: {
    status: string;
    indexable: boolean;
    buyerJob: string | null;
    summary: string | null;
    guidance: Prisma.JsonValue | null;
  } | null;
};

export type CostumeCatalogResult = {
  available: boolean;
  items: CostumeCatalogProduct[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const pageSize = 24;
const allowedAudiences = new Set(["adult", "kids", "male", "female", "unisex"]);
const allowedPrices = new Set(["under-50", "50-199", "200-999", "1000-plus"]);
const allowedOccasions = new Set(["halloween", "year-round"]);
const allowedFeatures = new Set(["premium", "professional", "premium-professional", "rental"]);
const allowedSorts = new Set(["featured", "price-asc", "price-desc", "name"]);

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function oneOf<T extends string>(value: string | undefined, allowed: Set<string>): T | undefined {
  return value && allowed.has(value) ? (value as T) : undefined;
}

export function parseCostumeCatalogFilters(
  input: Record<string, string | string[] | undefined>,
  overrides: Partial<CostumeCatalogFilters> = {},
): CostumeCatalogFilters {
  const rawPage = Number(first(input.page));
  const rawQuery = (first(input.q) ?? "").replace(/\s+/g, " ").trim().slice(0, 80);
  const rawCategory = first(input.category);
  const category = costumeCatalogCategories.includes(rawCategory as CostumeCatalogCategory)
    ? (rawCategory as CostumeCatalogCategory)
    : undefined;

  return {
    q: rawQuery,
    category,
    price: oneOf(first(input.price), allowedPrices),
    audience: oneOf(first(input.audience), allowedAudiences),
    occasion: oneOf(first(input.occasion), allowedOccasions),
    feature: oneOf(first(input.feature), allowedFeatures),
    sort: oneOf<CostumeCatalogSort>(first(input.sort), allowedSorts) ?? "featured",
    page: Number.isInteger(rawPage) && rawPage > 0 ? Math.min(rawPage, 100) : 1,
    ...overrides,
  };
}

function productOrder(sort: CostumeCatalogSort): Prisma.MerchantProductOrderByWithRelationInput[] {
  if (sort === "price-asc") return [{ price: { sort: "asc", nulls: "last" } }, { title: "asc" }];
  if (sort === "price-desc") return [{ price: { sort: "desc", nulls: "last" } }, { title: "asc" }];
  if (sort === "name") return [{ title: "asc" }];
  return [{ premium: "desc" }, { professional: "desc" }, { halloween: "desc" }, { lastSeenAt: "desc" }, { title: "asc" }];
}

const productInclude = {
  images: {
    where: { usageStatus: "authorized", permissionRef: { not: null } },
    orderBy: { position: "asc" as const },
    take: 1,
    select: { url: true, altText: true, permissionRef: true },
  },
  affiliateLinks: {
    where: { site: "costume", active: true, verifiedAt: { not: null } },
    orderBy: { verifiedAt: "desc" as const },
    take: 1,
    select: { clickToken: true, verifiedAt: true },
  },
  editorial: {
    select: { status: true, indexable: true, buyerJob: true, summary: true, guidance: true },
  },
} satisfies Prisma.MerchantProductInclude;

type ProductWithLaunchState = Prisma.MerchantProductGetPayload<{ include: typeof productInclude }>;

function catalogProduct(product: ProductWithLaunchState): CostumeCatalogProduct {
  const image = product.images[0];
  const link = product.affiliateLinks[0];
  const variantState = costumeVariantState(product);

  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    description: product.description,
    brand: product.brand,
    productType: product.productType,
    categorySlug: product.categorySlug as CostumeCatalogCategory,
    tags: product.tags,
    audience: product.audience,
    price: variantState?.identity === "matched" ? variantState.review.price : product.price?.toString() ?? null,
    currency: variantState?.identity === "matched" ? variantState.review.currency : product.currency,
    availability: variantState?.identity === "matched" && !variantState.review.available ? "out of stock" : product.availability,
    premium: product.premium,
    professional: product.professional,
    halloween: product.halloween,
    rental: variantState?.identity === "matched" && variantState.review.transaction === "rent",
    destinationUrl: product.destinationUrl,
    variantState,
    lastSeenAt: product.lastSeenAt,
    authorizedImage: image?.permissionRef ? { ...image, permissionRef: image.permissionRef } : null,
    activeLink: link?.verifiedAt && !costumeProductRequiresEyeCare(product) && !variantState?.hold ? { clickToken: link.clickToken, verifiedAt: link.verifiedAt } : null,
    editorial: product.editorial,
  };
}

export async function listCostumeCatalogProducts(filters: CostumeCatalogFilters): Promise<CostumeCatalogResult> {
  if (!hasDatabaseUrl()) return { available: false, items: [], total: 0, page: 1, pageSize, totalPages: 0 };

  try {
    const prisma = getAffiliatePrisma();
    const where = costumeProductWhere(filters);
    if (filters.sort === "price-asc" || filters.sort === "price-desc") {
      // Sort the displayed dated prices before pagination. SQL feed prices may
      // predate a reviewed observation and cannot order these cards correctly.
      const all = await collectAllCostumeProducts(async (afterId, take) => {
        const rows = await prisma.merchantProduct.findMany({ where: { ...where, ...(afterId ? { id: { gt: afterId } } : {}) }, include: productInclude, orderBy: [{ id: "asc" }], take });
        return rows.map(catalogProduct);
      }, (product) => !product.variantState?.hold);
      all.sort((a, b) => compareCostumePrices(a, b, filters.sort === "price-desc"));
      const totalPages = Math.max(1, Math.ceil(all.length / pageSize));
      const page = Math.min(filters.page, totalPages);
      return { available: true, items: all.slice((page - 1) * pageSize, page * pageSize), total: all.length, page, pageSize, totalPages };
    }
    const total = await prisma.merchantProduct.count({ where });
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const page = Math.min(filters.page, totalPages);
    const products = await prisma.merchantProduct.findMany({
      where,
      include: productInclude,
      orderBy: productOrder(filters.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { available: true, items: products.map(catalogProduct), total, page, pageSize, totalPages };
  } catch {
    console.error("Costume catalog query failed.");
    return { available: false, items: [], total: 0, page: 1, pageSize, totalPages: 0 };
  }
}

export async function getCostumeCatalogProduct(slug: string) {
  if (!hasDatabaseUrl()) return null;
  try {
    const prisma = getAffiliatePrisma();
    const product = await prisma.merchantProduct.findFirst({
      where: {
        slug,
        merchant: { slug: "abracadabra-nyc", advertiserCid: "7889430" },
        softRetiredAt: null,
      },
      include: productInclude,
    });

    return product ? catalogProduct(product) : null;
  } catch {
    console.error("Costume product query failed.");
    return null;
  }
}

export async function findCostumeCatalogAlias(slugPrefix: string) {
  if (!hasDatabaseUrl() || !/^[a-z0-9-]{4,100}$/.test(slugPrefix)) return null;
  try {
    const prisma = getAffiliatePrisma();
    const matches = await prisma.merchantProduct.findMany({
      where: {
        slug: { startsWith: `${slugPrefix}-` },
        merchant: { slug: "abracadabra-nyc", advertiserCid: "7889430" },
        softRetiredAt: null,
      },
      include: productInclude,
      orderBy: [{ availability: "asc" }, { lastSeenAt: "desc" }],
      take: 2,
    });

    return matches.length === 1 ? catalogProduct(matches[0]) : null;
  } catch {
    console.error("Costume product alias query failed.");
    return null;
  }
}

export async function relatedCostumeCatalogProducts(product: CostumeCatalogProduct, take = 3) {
  const family = costumeRelatedFamily(product);
  const where = family ? costumeGuideProductWhere(family, product.categorySlug) : null;
  if (!where || !hasDatabaseUrl()) return [];
  try {
    const prisma = getAffiliatePrisma();
    return await collectCostumeFamilyProducts(async (skip, pageTake) => {
      const products = await prisma.merchantProduct.findMany({
        where: { ...where, id: { not: product.id } },
        include: productInclude,
        orderBy: [...productOrder("featured"), { id: "asc" }],
        skip,
        take: pageTake,
      });
      return products.map(catalogProduct);
    }, (candidate) => candidate.id !== product.id && isCostumeProductIndexable(candidate)
      && costumeRelatedProductMatches(product, candidate), Math.min(Math.max(take, 1), 3));
  } catch {
    console.error("Related Costume product query failed.");
    return [];
  }
}

export function isCostumeProductIndexable(product: CostumeCatalogProduct) {
  return Boolean(
    !costumeProductRequiresEyeCare(product)
      && !product.variantState?.hold
      && product.editorial?.status === "published"
      && product.editorial.indexable
      && product.authorizedImage
      && product.activeLink
      && product.availability !== "out of stock",
  );
}

export async function listCostumeGuideProducts(family: string, category: CostumeCatalogCategory) {
  const where = costumeGuideProductWhere(family, category);
  if (!where || !hasDatabaseUrl()) return [];
  try {
    const prisma = getAffiliatePrisma();
    return await collectCostumeFamilyProducts(async (skip, take) => {
      const products = await prisma.merchantProduct.findMany({
        where,
        include: productInclude,
        orderBy: [...productOrder("featured"), { id: "asc" }],
        skip,
        take,
      });
      return products.map(catalogProduct);
    }, (product) => isCostumeProductIndexable(product) && costumeFamilyProductMatches(product, family, category));
  } catch {
    console.error("Costume guide product query failed.");
    return [];
  }
}

function indexableCostumeWhere(category?: CostumeCatalogCategory): Prisma.MerchantProductWhereInput {
  return {
    merchant: { slug: "abracadabra-nyc", advertiserCid: "7889430" },
    softRetiredAt: null,
    ...(category ? { categorySlug: category } : {}),
    availability: { not: "out of stock" },
    images: { some: { usageStatus: "authorized", permissionRef: { not: null } } },
    affiliateLinks: { some: { site: "costume", active: true, verifiedAt: { not: null } } },
    editorial: { is: { status: "published", indexable: true } },
    AND: [costumeGeneralCommerceWhere(), costumeReviewedCommerceWhere()],
  };
}

export async function listAllIndexableCostumeProducts() {
  if (!hasDatabaseUrl()) return [];
  const prisma = getAffiliatePrisma();
  const where = indexableCostumeWhere();
  return collectAllCostumeProducts(async (afterId, take) => {
    const products = await prisma.merchantProduct.findMany({
      where: { ...where, ...(afterId ? { id: { gt: afterId } } : {}) },
      include: productInclude,
      orderBy: [{ id: "asc" }],
      take,
    });
    return products.map(catalogProduct);
  }, isCostumeProductIndexable);
}

export async function listIndexableCostumeProducts(take = 30, category?: CostumeCatalogCategory) {
  if (!hasDatabaseUrl()) return [];
  try {
    const prisma = getAffiliatePrisma();
    const products = await prisma.merchantProduct.findMany({
      where: indexableCostumeWhere(category),
      include: productInclude,
      orderBy: [{ editorial: { publishedAt: "desc" } }, ...productOrder("featured")],
      take: Math.min(Math.max(take, 1), 100),
    });

    return products.map(catalogProduct).filter(isCostumeProductIndexable);
  } catch {
    console.error("Indexable Costume product query failed.");
    return [];
  }
}

export async function listCuratedCostumeProducts(slugs: string[]) {
  if (!hasDatabaseUrl() || !slugs.length) return [];
  const uniqueSlugs = [...new Set(slugs)].slice(0, 50);

  try {
    const prisma = getAffiliatePrisma();
    const products = await prisma.merchantProduct.findMany({
      where: {
        slug: { in: uniqueSlugs },
        merchant: { slug: "abracadabra-nyc", advertiserCid: "7889430" },
        softRetiredAt: null,
        availability: { not: "out of stock" },
        images: { some: { usageStatus: "authorized", permissionRef: { not: null } } },
        affiliateLinks: { some: { site: "costume", active: true, verifiedAt: { not: null } } },
        AND: [costumeGeneralCommerceWhere(), costumeReviewedCommerceWhere()],
      },
      include: productInclude,
    });
    const bySlug = new Map(products.map((product) => [product.slug, catalogProduct(product)]));

    return uniqueSlugs.flatMap((slug) => {
      const product = bySlug.get(slug);
      return product?.authorizedImage && product.activeLink && !costumeProductRequiresEyeCare(product) ? [product] : [];
    });
  } catch {
    console.error("Curated Costume product query failed.");
    return [];
  }
}

export async function getCostumeCatalogStats() {
  if (!hasDatabaseUrl()) return null;
  try {
    const prisma = getAffiliatePrisma();
    const base: Prisma.MerchantProductWhereInput = {
      merchant: { slug: "abracadabra-nyc", advertiserCid: "7889430" },
      softRetiredAt: null,
      AND: [costumeGeneralCommerceWhere(), costumeReviewedCommerceWhere()],
    };
    const [total, available, premium, professional, halloween, authorizedImages, activeLinks] = await Promise.all([
      prisma.merchantProduct.count({ where: base }),
      prisma.merchantProduct.count({ where: { ...base, availability: { not: "out of stock" } } }),
      prisma.merchantProduct.count({ where: { ...base, premium: true } }),
      prisma.merchantProduct.count({ where: { ...base, professional: true } }),
      prisma.merchantProduct.count({ where: { ...base, halloween: true } }),
      prisma.merchantProductImage.count({ where: { product: base, usageStatus: "authorized", permissionRef: { not: null } } }),
      prisma.affiliateLink.count({ where: { site: "costume", active: true, verifiedAt: { not: null }, merchantProduct: base } }),
    ]);

    return { total, available, premium, professional, halloween, authorizedImages, activeLinks };
  } catch {
    console.error("Costume catalog stats query failed.");
    return null;
  }
}

export function formatCostumePrice(product: Pick<CostumeCatalogProduct, "price" | "currency">) {
  if (!product.price) return "Price unavailable";
  const amount = Number(product.price);
  if (!Number.isFinite(amount)) return `${product.price} ${product.currency}`;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}
