import Image from "next/image";
import type { CSSProperties } from "react";
import { DecisionReference } from "@/components/DecisionReference";
import { FitWorksheet } from "@/components/FitWorksheet";
import { ListingIdentityNote } from "@/components/ListingIdentityNote";
import { fitWorksheetForGuide } from "@/lib/fit-worksheet";
import { UpgradePartsReference } from "@/components/UpgradePartsReference";
import { miniPcProfiles } from "@/lib/compatibility-data";
import { entryTopic } from "@/lib/discovery-topics";
import { UpgradePurchaseOption } from "@/components/UpgradePurchaseOption";
import { CompatibilityPlanner, type PlannerTopic } from "@/components/CompatibilityPlanner";
import { compatibilityTopicForGuide } from "@/lib/compatibility-topics";
import { compatibilityPurchaseOptions } from "@/lib/compatibility-purchase-options";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { AffiliateButton, AffiliateButtonGroup } from "@/components/AffiliateButton";
import { AmazonListingFreshness } from "@/components/AmazonCreatorsListing";
import { JsonLd } from "@/components/JsonLd";
import { BaseMarketEditionLinks } from "@/components/MarketExperience";
import { SearchOpportunityBacklinks, SearchOpportunityBlock } from "@/components/SearchOpportunityBlock";
import { TrackedCommerceLink } from "@/components/TrackedCommerceLink";
import { findGuide, findProduct, findRoundup, findTool, siteGuideFamily, siteGuides } from "@/lib/content";
import { effectiveContentUpdatedAt, findSearchOpportunity, reviewedSearchDescription, searchOpportunityMetaDescription } from "@/lib/search-opportunities";
import { focusedSearchAnswer } from "@/lib/focused-content-recovery";
import { breadcrumbSchema, guideSchema, itemListSchema, pageMetadata } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";
import type { Guide, SiteKey } from "@/lib/types";
import { amazonFamilyProductIdentity, findAmazonFamilyProduct } from "@/lib/amazon-family-products";
import { decoBuyingChoices } from "@/lib/commerce-refresh";
import { amazonAsinAffiliateUrl } from "@/lib/affiliate-tracking";
import { findAuthorizedCjFamilyOffer } from "@/lib/cj-offers";
import { guideCommerceProduct, isCommerceAlternative } from "@/lib/commerce-paths";
import { guideDecisionPurchaseOption } from "@/lib/guide-decision-purchase";
import { buyerFacingBody, buyerFacingHeading, buyerFacingSummary } from "@/lib/conversion-copy";
import {
  consolidationTargetSlug,
  isFamilyDiscoveryHub,
  isConsolidatedSupportGuide,
  mergeConsolidatedFamilyGuide,
} from "@/lib/search-recovery-consolidation";

type AdviceBlock = {
  checklist: string[];
  mistakes: string[];
  decision: string;
};

const familyRoleOrder: Array<NonNullable<Guide["familyRole"]>> = [
  "buying",
  "comparison",
  "fit",
  "ownership",
  "workflow",
  "safety",
];

const familyRoleLabels: Record<NonNullable<Guide["familyRole"]>, string> = {
  buying: "Primary buying guide",
  comparison: "Compare alternatives",
  fit: "Compatibility and fit",
  ownership: "Ownership and maintenance",
  workflow: "Setup and daily workflow",
  safety: "Safety and reasons to skip",
};

const siteAdvice: Record<SiteKey, AdviceBlock> = {
  pet: {
    checklist: [
      "Confirm the product fits the pet's size, food type, room layout, and cleaning routine.",
      "Check replacement parts, filters, bags, refills, or app features before comparing price.",
      "Check recurring noise, durability, chewing-risk, and setup-friction patterns.",
    ],
    mistakes: [
      "Buying the largest or smartest option before checking daily cleaning effort.",
      "Treating odor, hydration, feeding, or monitoring gear as a substitute for the routine itself.",
      "Ignoring where the pet actually eats, sleeps, waits, or makes messes during the day.",
    ],
    decision: "Choose the simpler product when the problem is routine consistency; choose the more specialized product only when it removes a repeated chore you already know you have.",
  },
  homeoffice: {
    checklist: [
      "Measure the desk, chair clearance, monitor distance, wall outlet path, and device count first.",
      "Check return policy for body-fit products such as chairs, desks, arms, and lighting.",
      "Confirm compatibility with your laptop, monitor weight, desk edge, cable path, and room lighting.",
    ],
    mistakes: [
      "Buying an ergonomic-looking product without checking the adjustment range.",
      "Solving visual clutter before solving posture, power, and daily connection friction.",
      "Assuming one accessory can fix a desk layout that lacks depth or cable slack.",
    ],
    decision: "Spend more when the product affects daily posture or every workday setup; spend less when the item is only organizing a stable setup you already like.",
  },
  baby: {
    checklist: [
      "Read the exact age, weight, position, cleaning, and safety-use limits for the model.",
      "Check whether the product solves a daily routine problem or only looks useful on a registry.",
      "Confirm the current bundle, accessories, replacement parts, and return path before buying.",
    ],
    mistakes: [
      "Buying for every possible scenario instead of the next few months of real care.",
      "Letting app features, analytics, or premium bundles distract from safe-use guidance.",
      "Choosing a large appliance or stroller before checking storage and cleaning friction.",
    ],
    decision: "Prefer the product that is easier to use consistently within manufacturer guidance; skip upgrades that add cleaning, charging, storage, or app work without solving a current routine problem.",
  },
  network: {
    checklist: [
      "Map the modem or ONT location, office desk, TV area, and any rooms that need wired stability.",
      "Check WAN/LAN port speeds, wired backhaul options, and whether your internet plan actually needs Wi-Fi 7.",
      "Count fixed devices separately from phones, tablets, and smart-home gear before buying a bigger system.",
    ],
    mistakes: [
      "Buying the fastest advertised Wi-Fi number while leaving the router in a bad location.",
      "Ignoring Ethernet paths that could make mesh nodes, TVs, consoles, or office desks more stable.",
      "Choosing a premium router before checking client device support, subscription features, and return path.",
    ],
    decision: "Spend more when coverage, wired backhaul, multi-gig ports, or device count solves a known bottleneck; spend less when placement or one Ethernet run fixes the problem first.",
  },
  smarthome: {
    checklist: [
      "Confirm the exact lock, doorbell, thermostat, controller, and ecosystem versions before buying.",
      "Check what remains available locally when Wi-Fi, cloud service, or a subscription is unavailable.",
      "Map wiring, door dimensions, radio coverage, storage, and household access before installation.",
    ],
    mistakes: [
      "Treating Matter, Thread, Zigbee, Wi-Fi, and Bluetooth as interchangeable labels.",
      "Buying an ecosystem feature before confirming the required hub, controller, or border router.",
      "Ignoring subscription boundaries, batteries, replacement access, and emergency fallback controls.",
    ],
    decision: "Choose the device with the clearest compatibility and local fallback path; add premium ecosystem features only when they remove a recurring household problem.",
  },
};

const categoryAdvice: Record<string, string[]> = {
  feeding: ["Capacity matters only after you count real daily parts or meals.", "Cleaning access is a buying feature, not a minor detail.", "Recurring parts and refills can change the total cost more than the sale price."],
  "home-care": ["Separate source control from air or surface cleanup.", "Noise and placement matter because these products live in shared rooms.", "Replacement filters, bags, and refills should be checked before purchase."],
  comfort: ["Fit, washable materials, and long-term durability matter more than product photos.", "Measure the actual sleeping or resting area before choosing size.", "Skip soft upgrades that create more cleaning work than comfort."],
  desks: ["Depth and cable path usually matter more than desktop width.", "Standing setups need safe slack through the full height range.", "Measure the room path, chair pullout, and outlet location before buying."],
  ergonomics: ["Adjustment range is more important than an ergonomic label.", "Body-fit products need a realistic return path.", "Monitor and keyboard height should be solved separately."],
  meetings: ["Light placement usually improves calls before a new camera does.", "Avoid gear that requires awkward controls during meeting days.", "Check glare, background brightness, and audio before buying more accessories."],
  sleep: ["Safe-use guidance comes before convenience features.", "Night controls should be simple when caregivers are tired.", "Treat analytics and smart alerts as optional, not required."],
  travel: ["Folded size, carry weight, and storage routine matter together.", "Check age and weight limits before comparing style.", "The right travel product should also survive ordinary errands."],
  wifi: ["Coverage claims assume ideal rooms; walls, floors, and router placement change the result.", "Multi-gig ports matter only when the modem, router, switch, and client path can use them.", "Mesh is easier, but wired backhaul is usually the cleaner long-term upgrade."],
  wired: ["A cheap switch is fine for simple rooms, but port speed and management features matter for NAS or office setups.", "Cable category should match run length and future speed needs.", "Adapters and hubs should be checked against laptop charging, display, and Ethernet needs together."],
  backup: ["UPS sizing starts with modem, ONT, router, and mesh node power draw.", "Runtime claims depend on load, battery age, and outlet layout.", "Keep network backup simple enough that it still works during a real outage."],
  access: ["Measure the door and existing deadbolt before comparing unlock methods.", "Keep at least one dependable local fallback entry method.", "Confirm which hub or controller unlocks remote and cross-platform features."],
  cameras: ["Compare storage and alert features before comparing headline resolution.", "Battery placement is easier, but wired power can reduce charging work.", "Check what the subscription changes after any trial ends."],
  climate: ["Use the manufacturer's compatibility checker before removing the old thermostat.", "A C-wire or power adapter can matter more than app preference.", "Room sensors help only when placement and HVAC behavior match the problem."],
  automation: ["Matter is an application standard; Thread and Zigbee are network technologies.", "A Matter controller and a Thread border router are different roles.", "Prefer physical and local fallback controls for essential routines."],
  jewelry: ["Length, width, closure, and exact material claims matter together.", "Compare listed dimensions with an owned pair.", "Let one face-and-neckline item be the focal point."],
  bags: ["Exterior dimensions overstate usable capacity.", "Check the zipper opening, strap range, and real carry list.", "Confirm the seller and inspect construction during the return window."],
  hair: ["Match clip size to hair volume, not only the motif.", "Check teeth, spring tension, and decorative snag points.", "A large claw should hold the intended twist without scalp pressure."],
  scarves: ["Dimensions decide whether a scarf works at the neck, hair, bag, or waist.", "Read fiber claims literally: satin describes a weave, not necessarily silk.", "Check care instructions and color transfer before tying against light clothing."],
  socks: ["Check the stated size range and fiber blend.", "A graphic can distort when stretched across the foot or calf.", "Choose cuff pressure and shoe thickness before choosing the joke."],
  styling: ["Assign one focal zone.", "Repeat one color or shape once.", "Use a full-body photo to check balance."],
  "props-animatronics": ["Measure the shipping and setup route.", "Confirm power, sound, motion, weather, and supervision limits.", "Plan transport and off-season storage."],
  "masks-prosthetics": ["Check head or face measurements and visibility.", "Identify every skin-contact material.", "Follow exact application and removal instructions."],
  "wigs-makeup": ["Check cap fit, fiber, and heat limits.", "Use only compatible skin and hair products.", "Plan touch-ups, removal, cleaning, and shape-preserving storage."],
  "accessories-party-effects": ["Confirm dimensions, quantity, power, and consumables.", "Match indoor or outdoor limits to the venue.", "Budget setup, cleanup, and storage time."],
};

function guideAdvice(siteKey: SiteKey, category: string) {
  return {
    ...siteAdvice[siteKey],
    categoryChecks: categoryAdvice[category] ?? ["Check the exact model, room fit, cleaning routine, and return policy before buying.", "Compare total ownership cost, not only the first checkout price.", "Choose the option that solves the recurring problem with the least added friction."],
  };
}

function GuideDecisionTable({ table }: { table: Guide["comparisonTable"] }) {
  if (!table) return null;
  return (
          <section className="mt-8" id="guide-comparison">
            <p className="eyebrow">Side-by-side checks</p>
            <h2 className="mt-3 text-2xl font-bold">{table.title}</h2>
            <p className="mt-3 text-xs text-[var(--muted)] sm:hidden">Swipe across the table to compare all options.</p>
            <div aria-label={table.title} className="guide-decision-scroll mt-5 overflow-x-auto rounded-md border border-[var(--border)] bg-white" role="region" tabIndex={0}>
              <table className="guide-decision-table w-full min-w-[680px] text-left text-sm" style={{ "--guide-value-columns": table.columns.length } as CSSProperties}>
                <colgroup>
                  <col className="guide-decision-label-column" />
                  {table.columns.map((column) => <col className="guide-decision-value-column" key={column} />)}
                </colgroup>
                <thead className="bg-[var(--surface-muted)] text-xs uppercase text-[var(--muted)]">
                  <tr>
                    <th className="px-4 py-3" scope="col">Check</th>
                    {table.columns.map((column) => (
                      <th className="px-4 py-3" key={column} scope="col">{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {table.rows.map((row) => (
                    <tr key={row.label}>
                      <th className="px-4 py-4 font-bold" scope="row">{row.label}</th>
                      {table?.columns.map((column, index) => (
                        <td className="px-4 py-4 leading-6 text-[var(--muted)]" key={`${row.label}-${column}`}>
                          {row.values[index] ?? "Confirm before purchase"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const rawGuide = findGuide(site.key, slug);
  if (!rawGuide) return {};
  const redirectTarget = consolidationTargetSlug(rawGuide);
  const metadataSlug = redirectTarget ?? slug;
  const metadataGuide = redirectTarget
    ? findGuide(site.key, redirectTarget) ?? rawGuide
    : mergeConsolidatedFamilyGuide(
        rawGuide,
        rawGuide.familySlug ? siteGuideFamily(site.key, rawGuide.familySlug) : [rawGuide],
      );
  const searchOpportunity = findSearchOpportunity(site.key, "guide", metadataSlug);
  return pageMetadata(site, `/guides/${metadataSlug}`, metadataGuide.title, reviewedSearchDescription(site.key, "guide", metadataSlug) ?? searchOpportunityMetaDescription(searchOpportunity, metadataGuide.dek), metadataGuide.image);
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const site = await getCurrentSite();
  const { slug } = await params;
  const rawGuide = findGuide(site.key, slug);
  if (!rawGuide) notFound();
  const redirectTarget = consolidationTargetSlug(rawGuide);
  if (redirectTarget) permanentRedirect(`/guides/${redirectTarget}`);
  const guide = mergeConsolidatedFamilyGuide(
    rawGuide,
    rawGuide.familySlug ? siteGuideFamily(site.key, rawGuide.familySlug) : [rawGuide],
  );
  const tailoredGuide = Boolean(guide.decisionLayout || focusedSearchAnswer(site.key, "guide", slug));
  const searchOpportunity = findSearchOpportunity(site.key, "guide", slug);
  const effectiveUpdatedAt = effectiveContentUpdatedAt(guide.updatedAt, searchOpportunity?.updatedAt);
  const effectiveGuide = effectiveUpdatedAt === guide.updatedAt ? guide : { ...guide, updatedAt: effectiveUpdatedAt };
  const advice = guideAdvice(site.key, guide.category);
  const category = site.categories.find((item) => item.slug === guide.category);
  const relatedProducts = (guide.relatedProducts ?? [])
    .map((productSlug) => findProduct(site.key, productSlug))
    .filter((product): product is NonNullable<ReturnType<typeof findProduct>> => Boolean(product));
  const familyGuides = !tailoredGuide && guide.familySlug
    ? siteGuides(site.key)
      .filter((item) => item.familySlug === guide.familySlug && item.familyRole)
      .sort((left, right) => familyRoleOrder.indexOf(left.familyRole!) - familyRoleOrder.indexOf(right.familyRole!))
    : [];
  const primaryFamilyGuide = familyGuides.find(isFamilyDiscoveryHub);
  const explicitRelatedGuides = (guide.relatedGuides ?? [])
    .filter((guideSlug) => guideSlug !== guide.slug)
    .map((guideSlug) => findGuide(site.key, guideSlug))
    .filter((item): item is NonNullable<ReturnType<typeof findGuide>> => Boolean(item))
    .filter((item) => !isConsolidatedSupportGuide(item));
  const reciprocalRelatedGuides = siteGuides(site.key)
    .filter((item) => item.slug !== guide.slug && item.relatedGuides?.includes(guide.slug));
  const relatedGuides = (guide.relatedGuidePolicy === "explicit" ? explicitRelatedGuides : [
    ...familyGuides.filter((item) => item.slug !== guide.slug),
    ...explicitRelatedGuides,
    ...reciprocalRelatedGuides,
    ...(guide.decisionLayout ? [] : siteGuides(site.key).filter((item) => item.slug !== guide.slug && item.category === guide.category)),
  ])
    .filter((item, index, items) => items.findIndex((candidate) => candidate.slug === item.slug) === index)
    .slice(0, guide.familySlug ? 8 : 4);
  const topProduct = relatedProducts[0];
  const relatedRoundups = guide.relatedRoundups
    .map((roundupSlug) => findRoundup(site.key, roundupSlug))
    .filter((roundup): roundup is NonNullable<ReturnType<typeof findRoundup>> => Boolean(roundup));
  const topRoundup = relatedRoundups[0];
  const commerceProduct = guideCommerceProduct(site.key, guide);
  const requiresTopologyChoice = site.key === "network" && guide.slug === "xfinity-gateway-bridge-mode-vs-own-router-guide";
  const commerceIsAlternative = isCommerceAlternative(topProduct, commerceProduct);
  const dedicatedAnswer = guide.quickAnswer?.trim();
  const directAnswer = dedicatedAnswer || guide.sections[0]?.body || advice.decision;
  const answerHeading = dedicatedAnswer ? guide.searchQuestion ?? "The practical answer" : guide.sections[0]?.heading ?? "The practical answer";
  const plannerTopic = compatibilityTopicForGuide(site.key, guide.slug);
  const discoveryTopic = entryTopic({site:site.key,title:guide.title,familySlug:guide.familySlug,href:`/guides/${guide.slug}`});
  const worksheetKind = fitWorksheetForGuide(site.key, guide.slug);
  const amazonFamilyProduct = guide.familySlug ? findAmazonFamilyProduct(site.key, guide.familySlug) : undefined;
  const amazonFamilyIdentity = amazonFamilyProduct ? amazonFamilyProductIdentity(amazonFamilyProduct) : undefined;
  const amazonFamilyBlock = amazonFamilyProduct?.offerBlock;
  const amazonFamilyOffer = amazonFamilyProduct && !amazonFamilyBlock ? {
    merchant: "Amazon US",
    url: amazonAsinAffiliateUrl(site.key, amazonFamilyProduct.asin),
    label: "Check this exact ASIN on Amazon",
    priceNote: `Confirm ASIN ${amazonFamilyProduct.asin}, exact model or variant, seller, availability, shipping, and returns before checkout.`,
  } : undefined;
  const directDecisionOption = !amazonFamilyProduct ? guideDecisionPurchaseOption(guide, relatedProducts) : undefined;
  const familyDecisionMatches = Boolean(guide.decisionPurchase && amazonFamilyProduct && guide.decisionPurchase.asin === amazonFamilyProduct.asin && !amazonFamilyBlock);
  const decisionPurchaseIdentity = familyDecisionMatches ? amazonFamilyIdentity : directDecisionOption?.product;
  const decisionPurchaseOffer = familyDecisionMatches ? amazonFamilyOffer : directDecisionOption?.offer;
  const buyingChoices = site.key === "network" && guide.slug === "deco-be63-vs-be67-vs-be85-buying-guide"
    ? decoBuyingChoices.map((choice) => ({ ...choice, product: findProduct(site.key, choice.slug) })) : [];
  // An unresolved model-specific operating or safety question does not qualify
  // another model simply because it has an authorized merchant link.
  const cjFamilyOffer = guide.familySlug && amazonFamilyBlock?.status !== "documentation-unverified"
    ? findAuthorizedCjFamilyOffer(site.key, guide.familySlug)
    : undefined;
  const cjFamilyProduct = cjFamilyOffer ? findProduct(site.key, cjFamilyOffer.productSlug) : undefined;
  const cjFamilyIdentity = cjFamilyOffer ? {
    slug: cjFamilyOffer.productSlug,
    name: cjFamilyOffer.productName ?? cjFamilyOffer.productSlug,
    specs: {
      Variant: cjFamilyOffer.variantLabel ?? "Confirm the exact variant before checkout",
      "CJ catalog SKU": cjFamilyOffer.catalogSku ?? "Confirm on the merchant page",
    },
  } : undefined;
  const cjFamilyAffiliateOffer = cjFamilyOffer ? {
    merchant: `${cjFamilyOffer.merchantName} via CJ`,
    url: `/go/cj/${cjFamilyOffer.token}`,
    label: `Check the exact variant at ${cjFamilyOffer.merchantName}`,
    priceNote: `Confirm ${cjFamilyOffer.variantLabel ?? "the exact variant"}, included pieces, live price, stock, shipping destination, and the direct-brand return terms before checkout.`,
  } : undefined;
  const commercePathPaused = Boolean(
    amazonFamilyBlock || (topProduct || topRoundup)
    && !commerceProduct
    && !amazonFamilyOffer
    && !cjFamilyAffiliateOffer,
  );

  return (
    <main className="section">
      <JsonLd
        data={breadcrumbSchema(site, [
          { name: "Home", path: "/" },
          ...(category ? [{ name: category.name, path: `/categories/${category.slug}` }] : []),
          { name: guide.title, path: `/guides/${slug}` },
        ])}
      />
      <JsonLd data={guideSchema(site, effectiveGuide)} />
      {familyGuides.length > 1 ? (
        <JsonLd
          data={itemListSchema(
            site,
            `${primaryFamilyGuide?.title ?? guide.title} decision guide series`,
            familyGuides.map((item) => ({ name: item.title, path: `/guides/${item.slug}` })),
          )}
        />
      ) : null}
      <div className="shell max-w-4xl">
        {category ? (
          <Link className="eyebrow hover:underline" href={`/categories/${category.slug}`}>
            {category.name}
          </Link>
        ) : (
          <p className="eyebrow">{guide.category}</p>
        )}
        <h1 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{guide.title}</h1>
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{guide.dek}</p>
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-[var(--muted)]">
          <Link className="underline underline-offset-4" href="/about">Prepared by the {site.name} editorial desk</Link>
          {effectiveUpdatedAt ? <span>Updated {effectiveUpdatedAt}</span> : null}
        </div>
        <section className="mt-8 rounded-md border border-[var(--brand)] bg-[var(--brand-soft)] p-5" aria-labelledby="guide-quick-answer" id={!dedicatedAnswer ? "guide-section-1" : undefined}>
          <p className="eyebrow">Quick answer</p>
          <h2 className="mt-2 text-xl font-bold" id="guide-quick-answer">{answerHeading}</h2>
          <p className="mt-3 leading-7 text-[var(--text)]">{directAnswer}</p>
        </section>
        <details className="guide-toc mt-6"><summary>On this page</summary><nav aria-label="Guide contents"><ul><li><a href="#guide-quick-answer">Quick answer</a></li>{guide.comparisonTable ? <li><a href="#guide-comparison">Decision table</a></li> : null}{worksheetKind ? <li><a href="#fit-worksheet">Measurement worksheet</a></li> : null}{plannerTopic ? <li><a href="#compatibility-checker">Check my setup</a></li> : null}{plannerTopic === "mini-pcs" ? <li><a href="#parts-reference">Parts, quantities and exact-FRU steps</a></li> : null}{guide.sections.map((section, index) => <li key={`${index}-${section.heading}`}><a href={`#guide-section-${index + 1}`}>{buyerFacingHeading(section.heading)}</a></li>)}</ul></nav></details>
        {plannerTopic ? <>
          <CompatibilityPlanner topic={plannerTopic as PlannerTopic} initialModel={miniPcProfiles.find((model) => model.guide === guide.slug)?.id} purchaseOptions={compatibilityPurchaseOptions(site.key, plannerTopic)} />
          <UpgradePartsReference modelId={miniPcProfiles.find((model) => model.guide === guide.slug)?.id ?? ""} />
          <UpgradePurchaseOption guide={guide.slug} />
          <div id="guide-reference-content" />
        </> : null}
        {buyingChoices.length ? (
          <section className="mt-6 grid gap-3 sm:grid-cols-3" aria-label="Choose the exact Deco model and pack">
            {buyingChoices.map((choice) => (
              <div className="min-w-0 rounded-md border border-[var(--border)] bg-white p-4" key={choice.slug}>
                <h2 className="text-lg font-bold">{choice.label}</h2>
                <p className="my-3 text-sm leading-6 text-[var(--muted)]">{choice.fit}</p>
                {choice.product?.offers.length ? <AffiliateButtonGroup site={site.key} product={choice.product} position="guide-deco-model-pack-choice" limit={1} /> : <p className="text-sm font-bold">Exact purchase link paused</p>}
                <Link className="mt-3 block text-sm font-bold underline" href={`/reviews/${choice.slug}`}>Read the model details</Link>
              </div>
            ))}
          </section>
        ) : null}
        <GuideDecisionTable table={guide.comparisonTable} />
        {guide.decisionPurchase && !plannerTopic && guide.purchaseFlow !== "task-links" && decisionPurchaseIdentity && decisionPurchaseOffer ? (
          <aside className="mt-4 rounded-md border border-[var(--border)] bg-white p-5" aria-label={`Next step for ${guide.decisionPurchase.model}`} data-guide-decision-purchase="true">
            <h2 className="text-lg font-bold">When {guide.decisionPurchase.model} fits</h2>
            <p className="mt-2 text-sm leading-6">{guide.decisionPurchase.qualifies}</p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{guide.decisionPurchase.stop}</p>
            <div className="mt-3"><AffiliateButton site={site.key} product={decisionPurchaseIdentity} offer={decisionPurchaseOffer} modelLabel={guide.decisionPurchase.model} position="guide-decision-exact-model" resolveCreatorsListing={false} /></div>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{guide.decisionPurchase.keep}</p>
          </aside>
        ) : null}
        {requiresTopologyChoice ? <section className="mt-5 rounded-md border border-[var(--border)] bg-white p-5" aria-label="Next step for your Xfinity topology"><h2 className="text-xl font-bold">Choose the route that matches your plan</h2><ul className="mt-3 list-disc space-y-3 pl-5 text-sm leading-6"><li>Gateway or existing router already meets the job: keep it; no purchase is required.</li><li>Keep the gateway as a modem and add routing or Wi-Fi: <Link className="font-bold underline" href="/guides/deco-be63-vs-be67-vs-be85-buying-guide">compare router and mesh ports, backhaul and pack size</Link>.</li><li>Replace the modem only after service approval: <Link className="font-bold underline" href="/best/best-cable-modems-for-xfinity-spectrum-cox">review the exact modem candidates and provider conditions</Link>. A comparison entry does not approve it for your address or voice plan.</li><li>Gateway model, service requirements or network role unclear: resolve those first with Xfinity and the device documentation.</li></ul></section> : null}
        <DecisionReference site={site.key} slug={guide.slug} />
        {site.key === "network" && guide.slug === "pass-through-ethernet-crimping-tools-buying-guide" && amazonFamilyIdentity && amazonFamilyOffer ? <div className="mt-4 rounded-md border border-[var(--border)] p-4" aria-label="Exact crimper retailer option"><p className="mb-3 text-sm leading-6">Need the tool after matching your connector and cable? This option is the VDV226-110 crimper. Confirm included pieces; the connector examples above are separate parts.</p><AffiliateButton site={site.key} product={amazonFamilyIdentity} offer={{...amazonFamilyOffer,label:"Check Klein VDV226-110 on Amazon"}} position="guide-connector-matrix-exact-tool" resolveCreatorsListing={false} /></div> : null}
        <div id="guide-commerce-start" className="h-px" aria-hidden="true" />
        {worksheetKind ? <FitWorksheet kind={worksheetKind} /> : null}
        <article className="prose-lite mt-8">
          {guide.sections.map((section, index) => !dedicatedAnswer && index === 0 ? null : (
            <section id={`guide-section-${index + 1}`} key={section.heading}>
              <h2>{buyerFacingHeading(section.heading)}</h2>
              <p>{buyerFacingBody(section.body)}</p>
            </section>
          ))}
        </article>
        {!plannerTopic && !requiresTopologyChoice && guide.purchaseFlow !== "task-links" && (amazonFamilyBlock || (!amazonFamilyProduct && !cjFamilyAffiliateOffer && (topProduct || topRoundup || commerceProduct))) ? (
          <section
            className="mt-4 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-4 sm:mt-5 sm:p-5"
            aria-label="Retailer options after the guide"
            data-commerce-paused={commercePathPaused ? "true" : undefined}
            data-guide-retailer-option="true"
          >
            <p className="eyebrow">{commercePathPaused ? "Exact retailer link paused" : "Retailer option"}</p>
            <div className="mt-2 grid gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-bold sm:text-xl">
                  {amazonFamilyProduct?.title ?? topProduct?.name ?? commerceProduct?.name ?? "Compare the short list"}
                </h2>
                {amazonFamilyBlock ? (
                  <p className="mt-2 max-w-xl text-sm leading-5 text-[var(--muted)]">
                    Listing checked {amazonFamilyBlock.checkedAt}: {amazonFamilyBlock.reason}
                  </p>
                ) : commerceIsAlternative && commerceProduct && !amazonFamilyOffer && !cjFamilyAffiliateOffer ? (
                  <p className="mt-2 max-w-xl text-sm leading-5 text-[var(--muted)]">
                    Different product: the exact {topProduct?.name} link is paused. This button is for the verified alternative {commerceProduct.name}.
                  </p>
                ) : commercePathPaused ? (
                  <p className="mt-2 max-w-xl text-sm leading-5 text-[var(--muted)]">
                    The named product links are paused while their exact listings are rechecked. No unrelated product is substituted.
                  </p>
                ) : null}
              </div>
              <div className="flex min-w-0 flex-wrap gap-2">
                {amazonFamilyBlock ? null : amazonFamilyProduct && amazonFamilyIdentity && amazonFamilyOffer ? (
                  <AffiliateButton site={site.key} product={amazonFamilyIdentity} offer={amazonFamilyOffer} position="guide-retailer-family-amazon" resolveCreatorsListing={false} sticky stickyStartId="guide-commerce-start" />
                ) : cjFamilyOffer && cjFamilyIdentity && cjFamilyAffiliateOffer ? (
                  <AffiliateButton site={site.key} product={cjFamilyIdentity} offer={cjFamilyAffiliateOffer} position="guide-retailer-family-cj" resolveCreatorsListing={false} sticky stickyStartId="guide-commerce-start" />
                ) : commerceProduct ? (
                  <AffiliateButtonGroup site={site.key} product={commerceProduct} position={commerceIsAlternative ? "guide-retailer-verified-alternative" : "guide-retailer-primary"} limit={1} sticky stickyStartId="guide-commerce-start" />
                ) : null}
                {topProduct ? <Link className="button-secondary" href={`/reviews/${topProduct.slug}`}>Review the product</Link> : null}
                {topRoundup ? <Link className="button-secondary" href={`/best/${topRoundup.slug}`}>Compare picks</Link> : null}
              </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
              {amazonFamilyBlock
                ? "The exact purchase link is paused. Review this guide’s fit checks and alternatives before considering another product."
                : amazonFamilyProduct
                  ? "Open the exact family listing to compare the live price, availability, delivery, seller, and returns."
                  : commerceProduct
                    ? `Open the named ${commerceProduct.name} listing to compare the live price, availability, delivery, seller, and returns.`
                    : commercePathPaused
                      ? "Use the product review and comparison while the exact retailer paths are being verified."
                      : "Use the comparison page to narrow the choices before buying."}
            </p>
          </section>
        ) : null}
        {site.key === "homeoffice" || site.key === "network" ? <aside className="discovery-card mt-8"><h2>Continue with this decision</h2><p><Link href={discoveryTopic === "other" ? "/search" : `/search?topic=${discoveryTopic}`}>Browse the model references and comparisons</Link></p>{plannerTopic ? <p><Link href={`/compatibility/${plannerTopic}`}>Check compatibility, missing parts and sources</Link></p> : null}</aside> : null}
        {amazonFamilyProduct && amazonFamilyIdentity && amazonFamilyOffer ? (
          <section className="mt-10 rounded-md border border-[var(--border)] bg-white p-5" aria-labelledby="amazon-family-listing">
            <p className="eyebrow">Amazon listing reference</p>
            <h2 className="mt-3 text-2xl font-bold" id="amazon-family-listing">Check this exact product</h2>
            <p className="mt-4 text-lg font-bold leading-7">{amazonFamilyProduct.title}</p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="font-bold">ASIN</dt>
                <dd className="mt-1 text-[var(--muted)]">{amazonFamilyProduct.asin}</dd>
              </div>
              <div>
                <dt className="font-bold">Brand</dt>
                <dd className="mt-1 text-[var(--muted)]">{amazonFamilyProduct.brand}</dd>
              </div>
              <div>
                <dt className="font-bold">Identity last checked</dt>
                <dd className="mt-1 text-[var(--muted)]">{new Date(amazonFamilyProduct.verifiedAt).toLocaleDateString("en-US", { timeZone: "UTC" })}</dd>
              </div>
            </dl>
            <ListingIdentityNote checkedAt={amazonFamilyProduct.verifiedAt} />
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              Compare the current title, ASIN, variant, seller, stock, shipping, price, and return path before ordering.
            </p>
            <div className="mt-5">
              <AffiliateButton site={site.key} product={amazonFamilyIdentity} offer={amazonFamilyOffer} position="family-guide-amazon-anchor" resolveCreatorsListing={false} sticky stickyStartId="guide-commerce-start" />
            </div>
          </section>
        ) : null}
        {cjFamilyOffer && cjFamilyIdentity && cjFamilyAffiliateOffer ? (
          <section className="mt-10 rounded-md border border-[var(--accent)] bg-[var(--accent-soft)] p-5" aria-labelledby="cj-family-listing">
            <p className="eyebrow">Authorized direct-brand alternative</p>
            <h2 className="mt-3 text-2xl font-bold" id="cj-family-listing">Compare one exact Bc Babycare variant</h2>
            <p className="mt-4 text-lg font-bold leading-7">{cjFamilyIdentity.name}</p>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
              <div>
                <dt className="font-bold">Exact variant</dt>
                <dd className="mt-1 text-[var(--muted)]">{cjFamilyOffer.variantLabel}</dd>
              </div>
              <div>
                <dt className="font-bold">CJ catalog SKU</dt>
                <dd className="mt-1 break-all text-[var(--muted)]">{cjFamilyOffer.catalogSku}</dd>
              </div>
              <div>
                <dt className="font-bold">Catalog checked</dt>
                <dd className="mt-1 text-[var(--muted)]">{new Date(cjFamilyOffer.verifiedAt).toLocaleDateString("en-US", { timeZone: "UTC" })}</dd>
              </div>
            </dl>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              This exact direct-brand option lets you compare the current bundle, price, stock, shipping threshold, return eligibility, and support path with the Amazon listing above. We may earn a CJ commission from an eligible Bc Babycare purchase; the reader pays no added fee.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {cjFamilyProduct ? <Link className="button-secondary" href={`/reviews/${cjFamilyProduct.slug}`}>Review the exact product</Link> : null}
              <AffiliateButton site={site.key} product={cjFamilyIdentity} offer={cjFamilyAffiliateOffer} position="family-guide-cj-alternative" resolveCreatorsListing={false} sticky={!amazonFamilyOffer} stickyStartId="guide-commerce-start" />
            </div>
          </section>
        ) : null}
        {guide.sources?.length ? (
          <section className="mt-10 rounded-md border border-[var(--border)] bg-white p-5">
            <p className="eyebrow">Sources and evidence</p>
            <h2 className="mt-3 text-2xl font-bold">References used for this guide</h2>
            <ul className="mt-4 space-y-4">
              {guide.sources.map((source) => (
                <li key={source.url}>
                  <a className="font-bold text-[var(--brand-strong)] underline-offset-4 hover:underline" href={source.url} rel="noopener noreferrer" target="_blank">
                    {source.name}
                  </a>
                  {source.note ? <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{source.note}</p> : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {guide.communityEvidence?.length ? (
          <section className="mt-10 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-5" aria-labelledby="community-evidence">
            <p className="eyebrow">Public owner context</p>
            <h2 className="mt-3 text-2xl font-bold" id="community-evidence">Questions to answer before buying</h2>
            <p className="mt-3 max-w-3xl leading-7 text-[var(--muted)]">
              Community discussions help surface installation, fit, maintenance, and failure questions. They are anecdotal context, not product specifications or a substitute for current instructions.
            </p>
            <ul className="mt-5 space-y-4">
              {guide.communityEvidence.map((item) => (
                <li className="rounded-md border border-[var(--border)] bg-white p-4" key={item.url}>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--muted)]">{item.sourceName}</p>
                  <a className="mt-2 block font-bold text-[var(--brand-strong)] underline-offset-4 hover:underline" href={item.url} rel="noopener noreferrer" target="_blank">
                    {item.title}
                  </a>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.note}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {guide.editorialMethod?.length ? (
          <section className="mt-10 rounded-md border border-[var(--border)] bg-white p-5" aria-labelledby="editorial-method">
            <p className="eyebrow">Research notes</p>
            <h2 className="mt-3 text-2xl font-bold" id="editorial-method">How we evaluated these choices</h2>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
              {guide.editorialMethod.map((item, index) => <li key={item}><span className="mr-2 font-bold text-[var(--text)]">{index + 1}.</span>{item}</li>)}
            </ol>
          </section>
        ) : null}
        {familyGuides.length > 1 ? (
          <nav className="mt-8 rounded-md border border-[var(--border)] bg-white p-5" data-family-topic-cluster="true" aria-labelledby="family-topic-cluster-heading">
            <p className="eyebrow">Decision guide series</p>
            <h2 className="mt-3 text-2xl font-bold" id="family-topic-cluster-heading">
              {guide.familyRole === "buying" ? "Use the complete topic path" : "Start from the primary buying guide"}
            </h2>
            {primaryFamilyGuide && primaryFamilyGuide.slug !== guide.slug ? (
              <p className="mt-3 leading-7 text-[var(--muted)]">
                This is a focused supporting page. Begin with{" "}
                <Link className="font-bold text-[var(--accent)] underline-offset-4 hover:underline" href={`/guides/${primaryFamilyGuide.slug}`}>
                  {primaryFamilyGuide.title}
                </Link>{" "}
                for the complete decision, then return here for this specific check.
              </p>
            ) : (
              <p className="mt-3 leading-7 text-[var(--muted)]">
                Use the supporting pages only for the part of the decision you still need to verify. The primary guide remains the hub for the overall choice.
              </p>
            )}
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {familyGuides.map((item) => (
                <li className={item.slug === guide.slug ? "rounded-md bg-[var(--surface-muted)] p-3" : "rounded-md border border-[var(--border)] p-3"} key={item.slug}>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--muted)]">
                    {familyRoleLabels[item.familyRole!]}
                  </p>
                  {item.slug === guide.slug ? (
                    <p className="mt-2 text-sm font-bold leading-6" aria-current="page">{item.title}</p>
                  ) : (
                    <Link className="mt-2 block text-sm font-bold leading-6 text-[var(--accent)] underline-offset-4 hover:underline" href={`/guides/${item.slug}`}>
                      {item.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        <SearchOpportunityBacklinks site={site.key} kind="guide" slug={slug} />
        {commerceProduct ? <AmazonListingFreshness site={site.key} productSlug={commerceProduct.slug} /> : null}
        {guide.image && !guide.familySlug && !guide.decisionLayout ? (
          <figure className="mt-8">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-[var(--surface-muted)]">
              <Image
                alt={guide.imageAlt ?? guide.title}
                className="object-cover"
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 896px, 100vw"
                src={guide.image}
              />
            </div>
            {guide.familySlug ? (
              <figcaption className="mt-2 text-xs leading-5 text-[var(--muted)]">
                Original editorial image for category, fit, and use context; verify the exact linked product appearance and configuration on the retailer page.
              </figcaption>
            ) : guide.image.includes("-realistic.webp") ? (
              <figcaption className="mt-2 text-xs leading-5 text-[var(--muted)]">
                Editorial image for visual context; device appearance and configuration can vary by model and region.
              </figcaption>
            ) : null}
          </figure>
        ) : null}
        {searchOpportunity ? <SearchOpportunityBlock opportunity={searchOpportunity} linksOnly /> : null}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {(guide.relatedTools ?? []).map((toolSlug) => {
            const tool = findTool(site.key, toolSlug);
            return tool ? <Link className="panel p-5" href={`/tools/${tool.slug}`} key={tool.slug}>
              <p className="eyebrow">Calculate your setup</p>
              <h2 className="mt-3 text-xl font-bold">{tool.title}</h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">{tool.dek}</p>
            </Link> : null;
          })}
          {relatedGuides.filter((item) => plannerTopic !== "mini-pcs" || miniPcProfiles.some((model) => model.guide === item.slug)).map((item) => (
            <Link className="panel p-5" href={`/guides/${item.slug}`} key={item.slug}>
              <p className="eyebrow">Related guide</p>
              <h2 className="mt-3 text-xl font-bold">{item.title}</h2>
              <p className="mt-3 leading-7 text-[var(--muted)]">{item.dek}</p>
            </Link>
          ))}
          {(guide.relatedProducts ?? []).map((slug) => {
            const product = findProduct(site.key, slug);
            return product ? (
              <Link className="panel p-5" href={`/reviews/${product.slug}`} key={product.slug}>
                <p className="eyebrow">Related product guide</p>
                <h2 className="mt-3 text-xl font-bold">{product.name}</h2>
                <p className="mt-3 leading-7 text-[var(--muted)]">{buyerFacingSummary(product.summary)}</p>
              </Link>
            ) : null;
          })}
          {guide.relatedRoundups.map((slug) => {
            const roundup = findRoundup(site.key, slug);
            return roundup ? (
              <Link className="panel p-5" href={`/best/${roundup.slug}`} key={roundup.slug}>
                <p className="eyebrow">Related comparison</p>
                <h2 className="mt-3 text-xl font-bold">{roundup.title}</h2>
                <p className="mt-3 leading-7 text-[var(--muted)]">{buyerFacingSummary(roundup.dek)}</p>
              </Link>
            ) : null;
          })}
        </div>
        {null}
        <BaseMarketEditionLinks site={site} basePath={`/guides/${slug}`} />
        {null}
      </div>
    </main>
  );
}
