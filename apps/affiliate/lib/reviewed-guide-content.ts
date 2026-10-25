import data from "../config/reviewed-guide-content.json";
import type { Guide, SiteKey } from "./types";

type PageRepair = Pick<Guide,"dek"|"quickAnswer"|"sections"|"comparisonTable"|"searchQuestion"> & Partial<Pick<Guide,"title"|"updatedAt"|"editorialMethod"|"decisionLayout"|"decisionPurchase"|"communityEvidence"|"curatedFamilyHub"|"relatedGuides"|"relatedProducts"|"relatedRoundups"|"image"|"imageAlt">>;
const families = data as Record<string,{sources:NonNullable<Guide["sources"]>;pages:Record<string,PageRepair>}>;
const pages = new Map(Object.entries(families).flatMap(([key, family]) =>
  Object.entries(family.pages).map(([slug, page]) => [`${key.split(":")[0]}:${slug}`, {...page, sources:family.sources}] as const),
));
export function reviewedGuideContent(site: SiteKey, slug: string) {
  return pages.get(`${site}:${slug}`);
}
export function applyReviewedGuideContent(guide: Guide): Guide {
  const page = reviewedGuideContent(guide.site, guide.slug);
  return page ? {...guide,...page,updatedAt:page.updatedAt ?? "October 22, 2026",
    editorialMethod:page.editorialMethod ?? ["Exact manufacturer and operating-system documentation; no hands-on measurement.","Page-specific decision table and suggested checks; unperformed checks are not presented as test results.","Retailer identity and current availability are checked separately from product documentation."]} : guide;
}
