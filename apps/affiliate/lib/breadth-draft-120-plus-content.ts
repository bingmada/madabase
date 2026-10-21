import familyPoolData from "../config/breadth-draft-120-150-research-pool.json";
import indexedZeroRecoveryData from "../config/indexed-zero-recovery-cohort-2026-09-07.json";
import opportunityData from "../config/breadth-draft-120-plus-opportunity-evidence.json";
import babyProductData from "../config/breadth-draft-baby-product-research.json";
import communityEvidenceData from "../config/breadth-draft-120-plus-community-evidence.json";
import homeofficeProductData from "../config/breadth-draft-homeoffice-product-research.json";
import networkProductData from "../config/breadth-draft-network-product-research.json";
import petProductData from "../config/breadth-draft-pet-product-research.json";
import smarthomeProductData from "../config/breadth-draft-smarthome-product-research.json";
import type { Guide, SiteKey } from "./types";
import { applyGuideEditorialRepair, familyDecisionTitles, publicDecisionNote } from "./guide-editorial-repairs";

type BreadthSite = Extract<SiteKey, "network" | "smarthome" | "homeoffice" | "baby" | "pet">;

type FamilyRecord = {
  site: BreadthSite;
  familySlug: string;
  familyName: string;
  category: string;
  alternative: string;
};

type OpportunityRecord = {
  site: BreadthSite;
  familySlug: string;
  scores: {
    productDemand: number;
    serpOpening: number;
    commercialIntent: number;
    clusterFit: number;
    commission: number;
    total: number;
  };
  evidence: string[];
  note: string;
};

type ProductRecord = FamilyRecord & {
  asin: string;
  title: string;
  brand: string;
  detailUrl: string;
  verifiedAt: string;
  relevanceScore: number;
};

type CommunityDiscussion = FamilyRecord & {
  status: "reviewed_thread";
  sourceName: string;
  discussionTitle: string;
  url: string;
  reviewedAt: string;
  relevanceNote: string;
  usePolicy: string;
};

type IndexedZeroRecoveryTarget = {
  site: Extract<BreadthSite, "smarthome" | "homeoffice" | "baby">;
  familySlug: string;
  slug: string;
  url: string;
  title: string;
  primaryOption: string;
  alternativeOption: string;
  searchQuestion: string;
  choosePrimary: string;
  chooseAlternative: string;
  decisionFocus: string;
  comparisonRows: Array<{ label: string; primary: string; alternative: string }>;
  relatedGuideSlugs: string[];
  liveSerp: string;
};

const updatedAt = "August 13, 2026";
const indexedZeroRecoveryUpdatedAt = "September 7, 2026";
const releaseCandidate = "breadth-2026-08-next";
const families = familyPoolData.families as FamilyRecord[];
const opportunities = opportunityData.records as OpportunityRecord[];
const products = [
  ...networkProductData.products,
  ...smarthomeProductData.products,
  ...homeofficeProductData.products,
  ...babyProductData.products,
  ...petProductData.products,
] as ProductRecord[];

const familyByKey = new Map(families.map((item) => [`${item.site}:${item.familySlug}`, item]));
const opportunityByKey = new Map(opportunities.map((item) => [`${item.site}:${item.familySlug}`, item]));
const communityByKey = new Map(
  (communityEvidenceData.discussions as CommunityDiscussion[]).map((item) => [`${item.site}:${item.familySlug}`, item]),
);
const indexedZeroRecoveryByKey = new Map<string, IndexedZeroRecoveryTarget>(
  indexedZeroRecoveryData.targets.map((item) => [
    `${item.site}:${item.familySlug}`,
    item as IndexedZeroRecoveryTarget,
  ]),
);
const titleSuffixBySite: Record<BreadthSite, string> = {
  network: "Compatibility, Installation, and Testing",
  smarthome: "Fit, Local Control, and Safety",
  homeoffice: "Workspace Fit, Workflow, and Ownership Cost",
  baby: "Fit, Cleaning, and Safety Checks",
  pet: "Sizing, Setup, and Safe Use",
};

const setupPlaybookBySite: Record<BreadthSite, string> = {
  network: "Record the full path, port standards, power source, cable or optic type, connector at each end, mounting location, environmental limits and the test that will prove the installed link works. Configure the minimum required features first, save a known-good configuration, label both ends and test the real traffic or load instead of accepting a link light as proof.",
  smarthome: "Confirm physical and electrical fit before creating an account. Complete the manufacturer's local setup, update firmware, document required hubs and subscriptions, test physical fallback, then disconnect the Internet briefly to learn what still works. Keep safety-critical operation available without a cloud routine whenever the product class allows it.",
  homeoffice: "Check the actual workstation and the movement space needed by the item. Follow the exact model's installation and operating instructions, then try the task that prompted the purchase during the return window. Keep a working existing arrangement when the new item does not remove that limitation.",
  baby: "Follow the exact manufacturer's assembly, age, size and care instructions; inspect small parts, fasteners, straps, adhesives and wear before first use and regularly afterward. Use the product only for its stated awake or supervised purpose, keep a non-product safety plan in place and recheck recalls and current guidance as the child develops.",
  pet: "Measure the animal and the real location rather than selecting by breed photo. Introduce the item gradually with the pet supervised, verify every restraint, fastener and wear point, and stop if gait, breathing, stress, eating, drinking or elimination changes. Product convenience never replaces veterinary assessment of a new health or mobility problem.",
};

const evidenceBoundaryBySite: Record<BreadthSite, string> = {
  network: "A compatible title is not a performance certification. Publish no throughput, PoE, reach, environmental or protection claim that is not supported by the exact model documentation and an appropriate installed test.",
  smarthome: "Connectivity is a control layer, not proof of safe autonomous operation. Do not promise unattended use, guaranteed detection, energy savings or continued cloud service; state hub, subscription and offline boundaries plainly.",
  homeoffice: "We have not tested this product or its fit in your workstation. Use the exact model's dimensions and instructions; a feature list is not a measured result.",
  baby: "This page cannot describe any accessory as childproof, sleep-safe, drowning-proof, scald-proof or a substitute for attentive care. Health and safety instructions come from authoritative guidance and the exact manufacturer's current directions, not marketplace copy.",
  pet: "This page cannot make medical, treatment, heat-protection, escape-proof, airline-approval or behavior guarantees. Verify carrier rules, habitat requirements and product instructions for the exact animal and trip, and use professional advice when risk is material.",
};

const categoryPromptBySite: Record<BreadthSite, string> = {
  network: "Which standard, physical link, power path and management boundary must this product fit?",
  smarthome: "What must still work locally when the app, hub or Internet is unavailable?",
  homeoffice: "Which repeated task, measured workspace constraint and ongoing cost justify this equipment?",
  baby: "Which exact developmental stage, supervised use and cleaning routine does this item support?",
  pet: "Which measured animal, environment and supervised routine must this product fit?",
};

function guideTitle(family: FamilyRecord) {
  if (familyDecisionTitles[family.familySlug]) return familyDecisionTitles[family.familySlug];
  const detailed = `${family.familyName} Buying Guide: ${titleSuffixBySite[family.site]}`;
  if (detailed.length <= 72) return detailed;
  const compact = `${family.familyName}: Fit, Trade-offs & Buying Guide`;
  return compact.length <= 72 ? compact : `${family.familyName} Buying Guide`;
}

function sourceName(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Research source";
  }
}

function relatedDraftGuides(family: FamilyRecord) {
  const sameCategory = products
    .map((product) => familyByKey.get(`${product.site}:${product.familySlug}`))
    .filter((item): item is FamilyRecord => Boolean(item))
    .filter((item) => item.site === family.site && item.category === family.category && item.familySlug !== family.familySlug);
  const sameSite = products
    .map((product) => familyByKey.get(`${product.site}:${product.familySlug}`))
    .filter((item): item is FamilyRecord => Boolean(item))
    .filter((item) => item.site === family.site && item.familySlug !== family.familySlug && !sameCategory.some((match) => match.familySlug === item.familySlug));
  return [...sameCategory, ...sameSite].slice(0, 4).map((item) => `${item.familySlug}-buying-guide`);
}

function buildGuide(product: ProductRecord): Guide {
  const key = `${product.site}:${product.familySlug}`;
  const family = familyByKey.get(key);
  const opportunity = opportunityByKey.get(key);
  const communityDiscussion = communityByKey.get(key);
  const indexedZeroRecovery = indexedZeroRecoveryByKey.get(key);
  if (!family || !opportunity) throw new Error(`Missing breadth editorial evidence for ${key}`);

  const alternative = family.alternative.replace(/^a\s+/i, "");
  const exactBrand = product.brand === "Brand shown on the Amazon listing" ? "the listed brand" : product.brand;
  const relatedGuides = relatedDraftGuides(family);
  const effectiveRelatedGuides = [
    ...new Set([...(indexedZeroRecovery?.relatedGuideSlugs ?? []), ...relatedGuides]),
  ];
  const recoveryDek = indexedZeroRecovery
    ? `Compare ${indexedZeroRecovery.primaryOption} with ${indexedZeroRecovery.alternativeOption} by ${indexedZeroRecovery.comparisonRows
        .map((row) => row.label.toLowerCase())
        .join(", ")}.`
    : undefined;
  const recoveryDecisionSection = indexedZeroRecovery
    ? {
        heading: `Make the ${indexedZeroRecovery.primaryOption} versus ${indexedZeroRecovery.alternativeOption} decision first`,
        body: indexedZeroRecovery.decisionFocus,
      }
    : undefined;

  return {
    site: family.site,
    slug: `${family.familySlug}-buying-guide`,
    familySlug: family.familySlug,
    familyRole: "buying",
    title: indexedZeroRecovery?.title ?? guideTitle(family),
    dek: recoveryDek ?? publicDecisionNote(opportunity.note),
    category: family.category,
    publicationStatus: "published",
    releaseCandidate,
    sitemapExcluded: false,
    updatedAt: indexedZeroRecovery ? indexedZeroRecoveryUpdatedAt : updatedAt,
    image: `/images/affiliate/breadth-${family.site}-${family.familySlug}.webp`,
    imageAlt: `Editorial buying worksheet for ${family.familyName.toLowerCase()} showing fit, compatibility, ownership checks, and the simpler alternative`,
    searchQuestion: indexedZeroRecovery?.searchQuestion ?? `How do I choose ${family.familyName.toLowerCase()}, and when is ${family.alternative} the better solution?`,
    quickAnswer: indexedZeroRecovery
      ? `${indexedZeroRecovery.choosePrimary} ${indexedZeroRecovery.chooseAlternative}`
      : `${publicDecisionNote(opportunity.note)} Compare these requirements with ${family.alternative} before choosing the exact model.`,
    governance: {
      decision: "rewrite",
      independentDemand: indexedZeroRecovery?.searchQuestion ?? opportunity.note,
      distinctFrom: indexedZeroRecovery
        ? `This existing canonical owns the decision between ${indexedZeroRecovery.primaryOption.toLowerCase()} and ${indexedZeroRecovery.alternativeOption.toLowerCase()}; adjacent pages support rather than duplicate that fork.`
        : `This page answers the ${family.familyName.toLowerCase()} decision specifically and keeps ${family.alternative} as the control option. It does not reuse a neighboring product family's buying question or treat the selected ASIN as a universal recommendation.`,
      benchmark: `Release only after the exact ASIN, title, availability, included parts, compatibility claims, two independent evidence links, dedicated image, four internal links and site-specific safety boundary pass the cohort checker. Opportunity score: ${opportunity.scores.total}/100.`,
    },
    comparisonTable: indexedZeroRecovery ? {
      title: `${indexedZeroRecovery.primaryOption} vs. ${indexedZeroRecovery.alternativeOption}: decision table`,
      columns: [indexedZeroRecovery.primaryOption, indexedZeroRecovery.alternativeOption],
      rows: indexedZeroRecovery.comparisonRows.map((row) => ({
        label: row.label,
        values: [row.primary, row.alternative],
      })),
    } : {
      title: `${family.familyName} pre-purchase record`,
      columns: ["Record before ordering", "Why it changes this decision"],
      rows: [
        { label: "Use case", values: [categoryPromptBySite[family.site], publicDecisionNote(opportunity.note)] },
        { label: "Linked model", values: [`${exactBrand}: ${product.title} (ASIN ${product.asin})`, "Match the actual model, dimensions, included parts and instructions; a product-family name alone does not establish fit."] },
        { label: "Simpler option", values: [family.alternative, `Keep ${alternative} when it already handles the task and the new product adds no useful capability.`] },
        { label: "Listing check date", values: [product.verifiedAt.slice(0, 10), "This historical identity check is not a current stock, price or compatibility guarantee."] },
      ],
    },
    editorialMethod: [
      "The sources below describe decision criteria and use limits. We have not physically tested the linked item or measured its performance.",
      `The retail identity was recorded on ${product.verifiedAt.slice(0, 10)}. That date is separate from article revisions and does not certify current price, stock or seller.`,
      "Community examples are anecdotal context, not specifications, test results or proof of a universal fit.",
    ],
    communityEvidence: communityDiscussion ? [{
      sourceName: communityDiscussion.sourceName,
      title: communityDiscussion.discussionTitle,
      url: communityDiscussion.url,
      note: `${communityDiscussion.relevanceNote} ${communityDiscussion.usePolicy}`,
    }] : [],
    sections: [
      ...(recoveryDecisionSection ? [recoveryDecisionSection] : []),
      {
        heading: `What changes the ${family.familyName.toLowerCase()} decision`,
        body: publicDecisionNote(opportunity.note),
      },
      {
        heading: `Which ${exactBrand} model is linked`,
        body: `The linked item is “${product.title},” ASIN ${product.asin}. Its recorded listing-identity check is dated ${product.verifiedAt.slice(0, 10)}. Confirm the selected model, included parts and current instructions before ordering; this dated record does not establish today's stock, price or seller.`,
      },
      {
        heading: `When ${alternative} is enough`,
        body: `Keep ${family.alternative} when it already solves the task described above. Compare the actual space, installation, maintenance and recurring costs before adding another product. A replacement is useful only when it removes a specific limitation of the current arrangement.`,
      },
      {
        heading: "Set up a real acceptance test",
        body: setupPlaybookBySite[family.site],
      },
      {
        heading: "Evidence and use limits",
        body: evidenceBoundaryBySite[family.site],
      },
    ],
    sources: [
      ...opportunity.evidence.map((url, index) => ({
        name: `${sourceName(url)} decision source ${index + 1}`,
        url,
        note: index === 0 ? "Primary or authoritative evidence used to define the product family's buying dimensions and boundaries." : "Independent supporting evidence used to challenge fit, workflow, ownership or safety assumptions.",
      })),
      {
        name: `Amazon ASIN ${product.asin}`,
        url: product.detailUrl,
        note: "Exact US checkout identity used for this guide. Recheck variation, seller, included parts, live availability, return terms and any recall notice before ordering.",
      },
    ],
    relatedGuides: effectiveRelatedGuides,
    relatedRoundups: [],
  };
}

export const breadthDraft120PlusGuides: Guide[] = products.map((product) => applyGuideEditorialRepair(buildGuide(product)));
