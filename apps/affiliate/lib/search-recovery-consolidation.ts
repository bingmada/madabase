import consolidationData from "../config/search-recovery-consolidations-2026-08-23.json";
import type { Guide, SiteKey } from "./types";

type ConsolidatedFamily = {
  site: SiteKey;
  familySlug: string;
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

export const consolidatedFamilies = consolidationData.families as ConsolidatedFamily[];
const consolidatedFamilyKeys = new Set(
  consolidatedFamilies.map(({ site, familySlug }) => `${site}:${familySlug}`),
);

function uniqueBy<T>(items: T[], keyFor: (item: T) => string) {
  return items.filter(
    (item, index) => items.findIndex((candidate) => keyFor(candidate) === keyFor(item)) === index,
  );
}

function latestConsolidatedUpdate(guides: Guide[]) {
  return ["August 23, 2026", ...guides.map((item) => item.updatedAt).filter((value): value is string => Boolean(value))]
    .reduce((latest, candidate) => Date.parse(candidate) > Date.parse(latest) ? candidate : latest);
}

export function isConsolidatedFamily(site: SiteKey, familySlug?: string) {
  return Boolean(familySlug && consolidatedFamilyKeys.has(`${site}:${familySlug}`));
}

export function isConsolidatedFamilyHub(guide: Guide) {
  return guide.familyRole === "buying" && isConsolidatedFamily(guide.site, guide.familySlug);
}

export function isConsolidatedSupportGuide(guide: Guide) {
  return Boolean(
    guide.familyRole
      && guide.familyRole !== "buying"
      && isConsolidatedFamily(guide.site, guide.familySlug),
  );
}

export function consolidationTargetSlug(guide: Guide) {
  if (!isConsolidatedSupportGuide(guide) || !guide.familySlug) return undefined;
  return `${guide.familySlug}-buying-guide`;
}

export function mergeConsolidatedFamilyGuide(guide: Guide, familyGuides: Guide[]) {
  if (!isConsolidatedFamilyHub(guide)) return guide;

  const orderedFamilyGuides = familyGuides
    .filter((item) => item.site === guide.site && item.familySlug === guide.familySlug && item.familyRole)
    .sort((left, right) => roleOrder.indexOf(left.familyRole!) - roleOrder.indexOf(right.familyRole!));
  const supportGuides = orderedFamilyGuides.filter((item) => item.familyRole !== "buying");
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
    dek: `${guide.dek} This consolidated guide also covers alternatives, compatibility and fit, ownership cost, maintenance, and setup workflow in one decision path.`,
    quickAnswer: `${guide.quickAnswer ?? guide.sections[0]?.body ?? guide.dek} Continue through the checks below before choosing: the former comparison, fit, ownership, and workflow material is now preserved on this page.`,
    updatedAt: latestConsolidatedUpdate(orderedFamilyGuides),
    editorialMethod: uniqueBy(
      orderedFamilyGuides.flatMap((item) => item.editorialMethod ?? []),
      (item) => item,
    ),
    communityEvidence: uniqueBy(
      orderedFamilyGuides.flatMap((item) => item.communityEvidence ?? []),
      (item) => item.url,
    ),
    governance: {
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
