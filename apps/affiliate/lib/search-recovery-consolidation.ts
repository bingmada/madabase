import initialConsolidationData from "../config/search-recovery-consolidations-2026-08-23.json";
import day30ConsolidationData from "../config/search-recovery-consolidations-2026-09-08.json";
import deferredConsolidationData from "../config/deferred-family-consolidations-2026-09-11.json";
import type { Guide, SiteKey } from "./types";

type ConsolidatedFamily = {
  site: SiteKey;
  familySlug: string;
  targetRole: NonNullable<Guide["familyRole"]>;
  targetSlug: string;
  consolidatedAt: string;
  preservePrimaryFields: boolean;
};

const roleOrder: Array<NonNullable<Guide["familyRole"]>> = [
  "buying",
  "comparison",
  "fit",
  "ownership",
  "workflow",
  "safety",
];

const roleLabels: Record<NonNullable<Guide["familyRole"]>, string> = {
  buying: "Buying decision",
  comparison: "Compare the alternatives",
  fit: "Compatibility and fit",
  ownership: "Ownership cost and maintenance",
  workflow: "Setup and daily workflow",
  safety: "Safety and reasons to skip",
};

const initialConsolidatedFamilies: ConsolidatedFamily[] = initialConsolidationData.families.map((family) => ({
  site: family.site as SiteKey,
  familySlug: family.familySlug,
  targetRole: "buying",
  targetSlug: `${family.familySlug}-buying-guide`,
  consolidatedAt: "August 23, 2026",
  preservePrimaryFields: false,
}));

const day30ConsolidatedFamilies: ConsolidatedFamily[] = day30ConsolidationData.families.map((family) => ({
  site: family.site as SiteKey,
  familySlug: family.familySlug,
  targetRole: family.targetRole as NonNullable<Guide["familyRole"]>,
  targetSlug: family.targetSlug,
  consolidatedAt: "September 8, 2026",
  preservePrimaryFields: true,
}));

const deferredConsolidatedFamilies: ConsolidatedFamily[] = deferredConsolidationData.families.map((family) => ({
  site: family.site as SiteKey,
  familySlug: family.familySlug,
  targetRole: family.targetRole as NonNullable<Guide["familyRole"]>,
  targetSlug: family.targetSlug,
  consolidatedAt: "September 11, 2026",
  preservePrimaryFields: true,
}));

export const consolidatedFamilies = [
  ...initialConsolidatedFamilies,
  ...day30ConsolidatedFamilies,
  ...deferredConsolidatedFamilies,
];
const consolidatedFamilyByKey = new Map(
  consolidatedFamilies.map((family) => [`${family.site}:${family.familySlug}`, family]),
);

function uniqueBy<T>(items: T[], keyFor: (item: T) => string) {
  return items.filter(
    (item, index) => items.findIndex((candidate) => keyFor(candidate) === keyFor(item)) === index,
  );
}

function latestConsolidatedUpdate(guides: Guide[], consolidatedAt: string) {
  return [consolidatedAt, ...guides.map((item) => item.updatedAt).filter((value): value is string => Boolean(value))]
    .reduce((latest, candidate) => Date.parse(candidate) > Date.parse(latest) ? candidate : latest);
}

function consolidatedFamilyFor(guide: Guide) {
  if (!guide.familySlug) return undefined;
  return consolidatedFamilyByKey.get(`${guide.site}:${guide.familySlug}`);
}

export function isConsolidatedFamily(site: SiteKey, familySlug?: string) {
  return Boolean(familySlug && consolidatedFamilyByKey.has(`${site}:${familySlug}`));
}

export function isConsolidatedFamilyHub(guide: Guide) {
  const family = consolidatedFamilyFor(guide);
  return Boolean(family && guide.slug === family.targetSlug && guide.familyRole === family.targetRole);
}

export function isConsolidatedSupportGuide(guide: Guide) {
  const family = consolidatedFamilyFor(guide);
  return Boolean(family && guide.familyRole && guide.slug !== family.targetSlug);
}

export function isFamilyDiscoveryHub(guide: Guide) {
  if (!guide.familySlug || !guide.familyRole) return false;
  const family = consolidatedFamilyFor(guide);
  return family ? guide.slug === family.targetSlug : guide.familyRole === "buying";
}

export function consolidationTargetSlug(guide: Guide) {
  const family = consolidatedFamilyFor(guide);
  if (!family || !isConsolidatedSupportGuide(guide)) return undefined;
  return family.targetSlug;
}

export function mergeConsolidatedFamilyGuide(guide: Guide, familyGuides: Guide[]) {
  const family = consolidatedFamilyFor(guide);
  if (!family || !isConsolidatedFamilyHub(guide)) return guide;

  const orderedFamilyGuides = familyGuides
    .filter((item) => item.site === guide.site && item.familySlug === guide.familySlug && item.familyRole)
    .sort((left, right) => roleOrder.indexOf(left.familyRole!) - roleOrder.indexOf(right.familyRole!));
  const supportGuides = orderedFamilyGuides.filter((item) => item.slug !== family.targetSlug);
  const mergedSections = [
    ...guide.sections,
    ...supportGuides.flatMap((support) => {
      const roleLabel = roleLabels[support.familyRole!];
      return [
        ...(support.quickAnswer
          ? [{ heading: `${roleLabel}: the short answer`, body: support.quickAnswer }]
          : []),
        ...(support.comparisonTable
          ? [{
              heading: `${roleLabel}: ${support.comparisonTable.title}`,
              body: support.comparisonTable.rows.map((row) =>
                `${row.label}: ${support.comparisonTable!.columns.map((column, index) => `${column} — ${row.values[index] ?? "check the current product documentation"}`).join("; ")}`,
              ).join(" "),
            }]
          : []),
        ...support.sections.map((section) => ({
          heading: `${roleLabel}: ${section.heading}`,
          body: section.body,
        })),
      ];
    }),
  ];
  const retainedGuideSlugs = (item: Guide) => (item.relatedGuides ?? [])
    .filter((slug) => !supportGuides.some((support) => support.slug === slug));

  return {
    ...guide,
    dek: family.preservePrimaryFields
      ? guide.dek
      : `${guide.dek} This consolidated guide also covers alternatives, compatibility and fit, ownership cost, maintenance, and setup workflow in one decision path.`,
    quickAnswer: family.preservePrimaryFields
      ? guide.quickAnswer
      : `${guide.quickAnswer ?? guide.sections[0]?.body ?? guide.dek} Continue through the checks below before choosing: the former comparison, fit, ownership, and workflow material is now preserved on this page.`,
    updatedAt: latestConsolidatedUpdate(orderedFamilyGuides, family.consolidatedAt),
    editorialMethod: uniqueBy(
      orderedFamilyGuides.flatMap((item) => item.editorialMethod ?? []),
      (item) => item,
    ),
    communityEvidence: uniqueBy(
      orderedFamilyGuides.flatMap((item) => item.communityEvidence ?? []),
      (item) => item.url,
    ),
    governance: family.preservePrimaryFields
      ? guide.governance
      : {
          decision: "merge" as const,
          independentDemand: guide.searchQuestion ?? guide.governance?.independentDemand ?? guide.title,
          distinctFrom: "Comparison, compatibility, ownership, and workflow checks now support this single family-level buying decision instead of competing as separate zero-impression URLs.",
          benchmark: "One complete canonical topic hub with preserved useful sections, a permanent redirect from each retired support URL, and no redirected URL in discovery or sitemap surfaces.",
        },
    sources: uniqueBy(
      orderedFamilyGuides.flatMap((item) => item.sources ?? []),
      (item) => item.url,
    ),
    sections: uniqueBy(mergedSections, (item) => `${item.heading}\n${item.body}`),
    relatedRoundups: uniqueBy(
      orderedFamilyGuides.flatMap((item) => item.relatedRoundups),
      (item) => item,
    ),
    relatedProducts: uniqueBy(
      orderedFamilyGuides.flatMap((item) => item.relatedProducts ?? []),
      (item) => item,
    ),
    relatedGuides: uniqueBy(
      orderedFamilyGuides.flatMap(retainedGuideSlugs),
      (item) => item,
    ),
  } satisfies Guide;
}
