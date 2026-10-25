import type { Prisma } from "../generated/prisma/client";
import type { CostumeCatalogCategory, CostumeCatalogProduct } from "./costume-catalog";
import { costumeGeneralCommerceWhere, costumeProductRequiresEyeCare } from "./costume-commerce-eligibility";
import { costumeReviewedCommerceWhere } from "./costume-variant-review";

type FamilyProduct = Pick<CostumeCatalogProduct, "title" | "productType" | "tags" | "audience" | "categorySlug" | "premium" | "professional">;

const adultLabels = ["adult", "adults"];
const childLabels = ["kids", "kid", "child", "children", "toddler", "infant", "newborn", "baby"];
const periodTerms = ["historical", "theatrical", "victorian", "colonial", "regency", "renaissance", "medieval", "tudor", "edwardian", "baroque", "rococo", "roman", "greek", "egyptian"];
const periodDecades = Array.from({ length: 20 }, (_, index) => String(1800 + index * 10));
const familyCategories: Record<string, CostumeCatalogCategory> = {
  "high-end-costumes": "costumes",
  "mascot-costumes": "costumes",
  "historical-theatrical-costumes": "costumes",
  "adult-costumes": "costumes",
  "child-costumes": "costumes",
  "costume-wigs": "wigs-makeup",
  "masks-and-masquerade": "masks-prosthetics",
  "prosthetics-special-effects": "masks-prosthetics",
  "theatrical-face-body-makeup": "wigs-makeup",
  "props-and-animatronics": "props-animatronics",
};

export function costumeAudienceDecision(product: Pick<FamilyProduct, "title" | "tags" | "audience">) {
  const labels = [...product.audience, ...product.tags].map((value) => value.trim().toLowerCase());
  const adult = labels.some((value) => adultLabels.includes(value)) || /\badults?\b/i.test(product.title);
  const child = labels.some((value) => childLabels.includes(value))
    || /\b(kids?|child(?:ren)?|toddlers?|infants?|newborns?|bab(?:y|ies))\b/i.test(product.title);
  return adult && child ? "conflict" : adult ? "adult" : child ? "kids" : "unknown";
}

export function costumeFamilyProductMatches(product: FamilyProduct, family: string, category: CostumeCatalogCategory) {
  if (costumeProductRequiresEyeCare(product)) return false;
  if (familyCategories[family] !== category || product.categorySlug !== category) return false;
  const title = product.title.split(/\s[-–—]\s|[;()]/)
    .filter((part) => !/\b(not included|sold separately)\b/i.test(part))
    .join(" ");
  if (!title.trim()) return false;
  // A garment set that includes a mask is not a standalone mask. Keep normal
  // phrases such as "costume mask" and "dress-up mask" eligible.
  const maskRoleTitle = title.split(/\s+for\s+/i)[0]
    .replace(/\b(?:costume|dress[ -]?up)\s+(?=masks?\b)/gi, "");
  const garmentType = /\bcostumes?\b/i.test(product.productType ?? "")
    && !/\b(masks?|accessories|prosthetics?)\b/i.test(product.productType ?? "");
  switch (family) {
    case "high-end-costumes": return product.premium || product.professional;
    case "mascot-costumes": return /\bmascots?\b/i.test(title);
    case "historical-theatrical-costumes":
      return !/\bmascots?\b/i.test(title)
        && (new RegExp(`\\b(${periodTerms.join("|")})\\b`, "i").test(title)
          || /\b(?:18|19)\d0['’]?s\b/i.test(title));
    case "adult-costumes": return costumeAudienceDecision(product) === "adult";
    case "child-costumes": return costumeAudienceDecision(product) === "kids";
    case "costume-wigs":
      return /\b(wigs?|hairpieces?)\b/i.test(title)
        && !/\bwig (caps?|nets?|grips?|stands?|brush(?:es)?|shampoo|conditioner|detangler)\b|\b(adhesive|remover)\b/i.test(title);
    case "masks-and-masquerade":
      return /\bmasks?\b/i.test(title)
        && !garmentType
        && !/\b(costumes?|suits?|robes?|jumpsuits?|onesies?|dresses?|outfits?)\b/i.test(maskRoleTitle)
        && !/\bmask (straps?|stands?|bags?|cases?|cleaner)\b|\b(adhesive|remover)\b/i.test(title);
    case "prosthetics-special-effects":
      return /\b(prosthetics?|appliances?|horns?|ears?|noses?|fangs?)\b/i.test(title)
        && !/\b(adhesive|remover|cleaner|case|stand)\b/i.test(title);
    case "theatrical-face-body-makeup":
      return /\b(make[ -]?up|face paint|body paint|lipstick|eyeshadow|mascara|foundation|(?:stage|fake(?:\s+(?:aged|dark|fresh|clotted))*)\s+blood)\b/i.test(title)
        && !/\b(contact lens(?:es)?|remover|cleanser|cleaner|brush(?:es)?|sponges?|applicators?|adhesive|spirit gum|liquid latex)\b/i.test(title);
    case "props-and-animatronics": return category === "props-animatronics";
    default: return false;
  }
}

export function costumeRelatedFamily(product: FamilyProduct): string | null {
  if (costumeProductRequiresEyeCare(product) || costumeAudienceDecision(product) === "conflict") return null;
  const category = product.categorySlug;
  const families = category === "wigs-makeup" ? ["costume-wigs", "theatrical-face-body-makeup"]
    : category === "masks-prosthetics" ? ["prosthetics-special-effects", "masks-and-masquerade"]
    : category === "props-animatronics" ? ["props-and-animatronics"]
    : category === "costumes" ? (costumeAudienceDecision(product) === "kids"
      ? ["child-costumes"]
      : ["mascot-costumes", "historical-theatrical-costumes", "adult-costumes"])
    : [];
  return families.find((family) => costumeFamilyProductMatches(product, family, category)) ?? null;
}

export function costumeRelatedProductMatches(source: FamilyProduct, candidate: FamilyProduct) {
  const family = costumeRelatedFamily(source);
  if (!family || !costumeFamilyProductMatches(candidate, family, source.categorySlug)) return false;
  // Unknown source age is not permission to infer adult or children's fit from
  // gender or the neighbouring listing. Mixed-age sets remain unresolved.
  return costumeAudienceDecision(source) === costumeAudienceDecision(candidate);
}

const titles = (terms: string[]): Prisma.MerchantProductWhereInput => ({
  OR: terms.map((term) => ({ title: { contains: term, mode: "insensitive" } })),
});

// This is a candidate query; the strict positive role/age check also runs on
// every returned record. Description marketing never supplies a garment role.
function familyCandidateWhere(family: string): Prisma.MerchantProductWhereInput | null {
  switch (family) {
    case "high-end-costumes": return { OR: [{ premium: true }, { professional: true }] };
    case "mascot-costumes": return titles(["mascot"]);
    case "historical-theatrical-costumes": return titles([...periodTerms, ...periodDecades]);
    // Raw feed age fields may be absent or use different capitalization. Scan
    // only the published cohort and retain the strict age/conflict check above.
    case "adult-costumes":
    case "child-costumes": return {};
    case "costume-wigs": return titles(["wig", "hairpiece"]);
    case "masks-and-masquerade": return titles(["mask"]);
    case "prosthetics-special-effects": return titles(["prosthetic", "appliance", "horn", "ear", "nose", "fang"]);
    case "theatrical-face-body-makeup": return titles(["makeup", "make-up", "make up", "face paint", "body paint", "lipstick", "eyeshadow", "mascara", "foundation", "blood"]);
    case "props-and-animatronics": return {};
    default: return null;
  }
}

export function costumeGuideProductWhere(family: string, category: CostumeCatalogCategory): Prisma.MerchantProductWhereInput | null {
  const role = familyCandidateWhere(family);
  if (!role || familyCategories[family] !== category) return null;
  return {
    merchant: { slug: "abracadabra-nyc", advertiserCid: "7889430" },
    categorySlug: category,
    softRetiredAt: null,
    availability: { not: "out of stock" },
    images: { some: { usageStatus: "authorized", permissionRef: { not: null } } },
    affiliateLinks: { some: { site: "costume", active: true, verifiedAt: { not: null } } },
    editorial: { is: { status: "published", indexable: true } },
    AND: [role, costumeGeneralCommerceWhere(), costumeReviewedCommerceWhere()],
  };
}

export async function collectCostumeFamilyProducts<T>(
  loadPage: (skip: number, take: number) => Promise<T[]>,
  matches: (product: T) => boolean,
  take = 6,
) {
  const wanted = Math.min(Math.max(Math.trunc(take), 1), 6);
  const selected: T[] = [];
  const pageSize = 24;
  for (let skip = 0; selected.length < wanted; skip += pageSize) {
    const page = await loadPage(skip, pageSize);
    selected.push(...page.filter(matches).slice(0, wanted - selected.length));
    if (page.length < pageSize) break;
  }
  return selected;
}
