import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { AffiliateButton, AffiliateButtonGroup } from "@/components/AffiliateButton";
import { AmazonListingFreshness } from "@/components/AmazonCreatorsListing";
import { JsonLd } from "@/components/JsonLd";
import { BaseMarketEditionLinks } from "@/components/MarketExperience";
import { SearchOpportunityBacklinks, SearchOpportunityBlock } from "@/components/SearchOpportunityBlock";
import { StyleGuidePage } from "@/components/StyleExperience";
import { TrackedCommerceLink } from "@/components/TrackedCommerceLink";
import { findGuide, findProduct, findRoundup, siteGuideFamily, siteGuides } from "@/lib/content";
import { effectiveContentUpdatedAt, findSearchOpportunity, searchOpportunityMetaDescription } from "@/lib/search-opportunities";
import { breadcrumbSchema, guideSchema, itemListSchema, pageMetadata } from "@/lib/seo";
import { getCurrentSite } from "@/lib/sites";
import type { Guide, SiteKey } from "@/lib/types";
import { costumeHalloweenIdeas } from "@/lib/costume-halloween-ideas";
import { findAmazonFamilyProduct } from "@/lib/amazon-family-products";
import { amazonAsinAffiliateUrl } from "@/lib/affiliate-tracking";
import { findAuthorizedCjFamilyOffer } from "@/lib/cj-offers";
import { guideCommerceProduct, isCommerceAlternative } from "@/lib/commerce-paths";
import { buyerFacingBody, buyerFacingHeading, buyerFacingSummary } from "@/lib/conversion-copy";
import {
  consolidationTargetSlug,
  isFamilyDiscoveryHub,
  isConsolidatedFamilyHub,
  isConsolidatedSupportGuide,
  mergeConsolidatedFamilyGuide,
} from "@/lib/search-recovery-consolidation";
import {
  isCostumeProductIndexable,
  listCostumeCatalogProducts,
  listIndexableCostumeProducts,
  parseCostumeCatalogFilters,
  type CostumeCatalogCategory,
  type CostumeCatalogFeature,
} from "@/lib/costume-catalog";

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
  style: {
    checklist: [
      "Use stated dimensions and compare them with an accessory already comfortable to wear or carry.",
      "Check closure, strap range, material language, seller, and return path before choosing the motif.",
      "Name the accessory's outfit role: focal point, color repeat, texture, or practical carry.",
    ],
    mistakes: [
      "Judging scale only from close-up product photography.",
      "Treating nickel-free, plated, base metal, and hypoallergenic as interchangeable claims.",
      "Combining several large novelty motifs without a shared palette or quiet clothing base.",
    ],
    decision: "Choose the expressive item that fits a real outfit and physical routine first; the most unusual design is useful only when its scale, comfort, and carry method make it easy to wear.",
  },
  costume: {
    checklist: [
      "Confirm the exact product or variant, included pieces, dimensions, materials, availability, delivery timing, and current return terms.",
      "Plan the full event workflow: fitting, movement, visibility, power, application, removal, transport, cleaning, and storage.",
      "Treat seasonal photography and a familiar license as starting points, not proof of fit, construction, or repeat-use value.",
    ],
    mistakes: [
      "Choosing from the character image without checking measurements and included components.",
      "Buying a large prop or effect before measuring doors, venue paths, power, weather exposure, and storage.",
      "Leaving delivery, exchanges, alterations, makeup practice, or prop testing until the final week.",
    ],
    decision: "Choose the option that can be fitted, used, transported, removed, cleaned, and stored safely for the real event; spend more only when construction or repeat use solves a known need.",
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
  costumes: ["Use the exact product size chart.", "List every included and missing piece.", "Test sitting, walking, stairs, and visibility before the event."],
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

function costumeFamilyCatalogSelection(familySlug: string, category: string) {
  const selections: Record<string, { q?: string; audience?: "adult" | "kids"; feature?: CostumeCatalogFeature }> = {
    "high-end-costumes": { feature: "premium-professional" },
    "mascot-costumes": { q: "mascot" },
    "historical-theatrical-costumes": { q: "theatrical", feature: "professional" },
    "adult-costumes": { audience: "adult" },
    "child-costumes": { audience: "kids" },
    "costume-wigs": { q: "wig" },
    "masks-and-masquerade": { q: "mask" },
    "prosthetics-special-effects": { q: "prosthetic" },
    "theatrical-face-body-makeup": { q: "makeup" },
    "props-and-animatronics": { feature: "premium-professional" },
  };
  const selected = selections[familySlug] ?? {};
  return parseCostumeCatalogFilters({}, {
    q: selected.q ?? "",
    category: category as CostumeCatalogCategory,
    audience: selected.audience,
    feature: selected.feature,
    sort: "featured",
    page: 1,
  });
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
  return pageMetadata(site, `/guides/${metadataSlug}`, metadataGuide.title, searchOpportunityMetaDescription(searchOpportunity, metadataGuide.dek), metadataGuide.image);
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
  const consolidatedFamilyHub = isConsolidatedFamilyHub(guide);
  const searchOpportunity = findSearchOpportunity(site.key, "guide", slug);
  const effectiveUpdatedAt = effectiveContentUpdatedAt(guide.updatedAt, searchOpportunity?.updatedAt);
  const effectiveGuide = effectiveUpdatedAt === guide.updatedAt ? guide : { ...guide, updatedAt: effectiveUpdatedAt };
  const advice = guideAdvice(site.key, guide.category);
  const category = site.categories.find((item) => item.slug === guide.category);
  const relatedProducts = (guide.relatedProducts ?? [])
    .map((productSlug) => findProduct(site.key, productSlug))
    .filter((product): product is NonNullable<ReturnType<typeof findProduct>> => Boolean(product));
  const familyGuides = guide.familySlug
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
  const relatedGuides = [
    ...familyGuides.filter((item) => item.slug !== guide.slug),
    ...explicitRelatedGuides,
    ...reciprocalRelatedGuides,
    ...siteGuides(site.key).filter((item) => item.slug !== guide.slug && item.category === guide.category),
    ...siteGuides(site.key).filter((item) => item.slug !== guide.slug),
  ]
    .filter((item, index, items) => items.findIndex((candidate) => candidate.slug === item.slug) === index)
    .slice(0, guide.familySlug ? 8 : 4);
  const topProduct = relatedProducts[0];
  const relatedRoundups = guide.relatedRoundups
    .map((roundupSlug) => findRoundup(site.key, roundupSlug))
    .filter((roundup): roundup is NonNullable<ReturnType<typeof findRoundup>> => Boolean(roundup));
  const topRoundup = relatedRoundups[0];
  const commerceProduct = guideCommerceProduct(site.key, guide);
  const commerceIsAlternative = isCommerceAlternative(topProduct, commerceProduct);
  const directAnswer = guide.quickAnswer ?? guide.sections[0]?.body ?? advice.decision;
  const amazonFamilyProduct = guide.familySlug ? findAmazonFamilyProduct(site.key, guide.familySlug) : undefined;
  const amazonFamilyIdentity = amazonFamilyProduct ? {
    slug: `family-${amazonFamilyProduct.familySlug}-${amazonFamilyProduct.asin.toLowerCase()}`,
    name: amazonFamilyProduct.title,
    amazonTitle: amazonFamilyProduct.title,
    asin: amazonFamilyProduct.asin,
    specs: { ASIN: amazonFamilyProduct.asin },
  } : undefined;
  const amazonFamilyOffer = amazonFamilyProduct ? {
    merchant: "Amazon US",
    url: amazonAsinAffiliateUrl(site.key, amazonFamilyProduct.asin),
    label: "Check this exact ASIN on Amazon",
    priceNote: `Confirm ASIN ${amazonFamilyProduct.asin}, exact model or variant, seller, availability, shipping, and returns before checkout.`,
  } : undefined;
  const cjFamilyOffer = guide.familySlug ? findAuthorizedCjFamilyOffer(site.key, guide.familySlug) : undefined;
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
  const costumeCatalogProducts = site.key === "costume"
    ? (await listCostumeCatalogProducts(costumeFamilyCatalogSelection(guide.familySlug ?? "", guide.category))).items
      .filter(isCostumeProductIndexable)
      .slice(0, 6)
    : [];
  const costumeCommerceProduct = costumeCatalogProducts.find((product) =>
    product.activeLink && product.authorizedImage && product.availability !== "out of stock",
  ) ?? (site.key === "costume"
    ? (await listIndexableCostumeProducts(100)).find((product) =>
        product.categorySlug === guide.category
        && product.activeLink
        && product.authorizedImage
        && product.availability !== "out of stock",
      )
    : undefined);
  const commercePathPaused = Boolean(
    (topProduct || topRoundup)
    && !commerceProduct
    && !amazonFamilyOffer
    && !cjFamilyAffiliateOffer
    && !costumeCommerceProduct,
  );

  if (site.key === "style") {
    return (
      <>
        <JsonLd
          data={breadcrumbSchema(site, [
            { name: "Home", path: "/" },
            ...(category ? [{ name: category.name, path: `/categories/${category.slug}` }] : []),
            { name: guide.title, path: `/guides/${slug}` },
          ])}
        />
        <JsonLd data={guideSchema(site, effectiveGuide)} />
        <StyleGuidePage
          site={site}
          guide={effectiveGuide}
          relatedProducts={relatedProducts}
          commerceProduct={commerceProduct}
          relatedGuides={relatedGuides}
          relatedRoundups={relatedRoundups}
          advice={advice}
        />
        <div className="style-shell pb-12">
          <SearchOpportunityBacklinks site={site.key} kind="guide" slug={slug} />
          <BaseMarketEditionLinks site={site} basePath={`/guides/${slug}`} />
        </div>
      </>
    );
  }

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
        {topProduct || topRoundup || commerceProduct || amazonFamilyOffer || cjFamilyAffiliateOffer || costumeCommerceProduct ? (
          <section
            className="mt-4 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-4 sm:mt-5 sm:p-5"
            aria-label="First-screen purchase path"
            data-commerce-paused={commercePathPaused ? "true" : undefined}
            data-first-viewport-commerce="true"
          >
            <p className="eyebrow">{commercePathPaused ? "Exact retailer link paused" : "Current retailer option"}</p>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold sm:text-xl">
                  {topProduct?.name ?? amazonFamilyProduct?.title ?? commerceProduct?.name ?? costumeCommerceProduct?.title ?? "Compare the short list"}
                </h2>
                {commerceIsAlternative && commerceProduct && !amazonFamilyOffer && !cjFamilyAffiliateOffer ? (
                  <p className="mt-2 max-w-xl text-sm leading-5 text-[var(--muted)]">
                    Different product: the exact {topProduct?.name} link is paused. This button is for the verified alternative {commerceProduct.name}.
                  </p>
                ) : commercePathPaused ? (
                  <p className="mt-2 max-w-xl text-sm leading-5 text-[var(--muted)]">
                    The named product links are paused while their exact listings are rechecked. No unrelated product is substituted.
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                {amazonFamilyProduct && amazonFamilyIdentity && amazonFamilyOffer ? (
                  <AffiliateButton site={site.key} product={amazonFamilyIdentity} offer={amazonFamilyOffer} position="guide-first-viewport-family-amazon" resolveCreatorsListing={false} firstViewport />
                ) : cjFamilyOffer && cjFamilyIdentity && cjFamilyAffiliateOffer ? (
                  <AffiliateButton site={site.key} product={cjFamilyIdentity} offer={cjFamilyAffiliateOffer} position="guide-first-viewport-family-cj" resolveCreatorsListing={false} firstViewport />
                ) : costumeCommerceProduct?.activeLink ? (
                  <TrackedCommerceLink
                    firstViewport
                    href={`/go/cj/${costumeCommerceProduct.activeLink.clickToken}`}
                    label="Check current price & availability at Abracadabra NYC"
                    merchant="Abracadabra NYC"
                    position="costume-guide-first-viewport"
                    productName={costumeCommerceProduct.title}
                    productSlug={costumeCommerceProduct.slug}
                    site="costume"
                  />
                ) : commerceProduct ? (
                  <AffiliateButtonGroup site={site.key} product={commerceProduct} position={commerceIsAlternative ? "guide-first-viewport-verified-alternative" : "guide-first-viewport-primary"} limit={1} firstViewport />
                ) : null}
                {topProduct ? <Link className="button-secondary" href={`/reviews/${topProduct.slug}`}>Review the product</Link> : null}
                {topRoundup ? <Link className="button-secondary" href={`/best/${topRoundup.slug}`}>Compare picks</Link> : null}
              </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-[var(--muted)]">
              {costumeCommerceProduct
                ? `Open the exact ${costumeCommerceProduct.title} listing to compare the live price, availability, delivery, and returns.`
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
        <p className="mt-5 text-lg leading-8 text-[var(--muted)]">{guide.dek}</p>
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-[var(--muted)]">
          <span>Prepared by the {site.name} editorial desk</span>
          {effectiveUpdatedAt ? <span>Updated {effectiveUpdatedAt}</span> : null}
        </div>
        <section className="mt-8 rounded-md border border-[var(--brand)] bg-[var(--brand-soft)] p-5" aria-labelledby="guide-quick-answer">
          <p className="eyebrow">Quick answer</p>
          <h2 className="mt-2 text-xl font-bold" id="guide-quick-answer">The practical answer</h2>
          <p className="mt-3 leading-7 text-[var(--text)]">{directAnswer}</p>
        </section>
        {consolidatedFamilyHub ? (
          <section className="mt-8 rounded-md border border-[var(--brand)] bg-[var(--brand-soft)] p-5" data-consolidated-family-hub="true" aria-labelledby="consolidated-family-hub-heading">
            <p className="eyebrow">Complete topic guide</p>
            <h2 className="mt-3 text-2xl font-bold" id="consolidated-family-hub-heading">One page for the complete decision</h2>
            <p className="mt-3 leading-7 text-[var(--muted)]">
              Comparison, compatibility, ownership, maintenance, and setup guidance are now consolidated below. This keeps every useful check while removing separate pages that competed for the same family-level decision.
            </p>
          </section>
        ) : familyGuides.length ? (
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
        {guide.searchQuestion ? (
          <section className="mt-8 rounded-md border border-[var(--brand)] bg-[var(--brand-soft)] p-5" aria-labelledby="guide-search-question">
            <p className="eyebrow">Common buying question</p>
            <h2 className="mt-2 text-2xl font-bold" id="guide-search-question">{guide.searchQuestion}</h2>
            {guide.governance ? <p className="mt-3 leading-7 text-[var(--muted)]">{guide.governance.distinctFrom}</p> : null}
          </section>
        ) : null}
        {searchOpportunity ? <SearchOpportunityBlock opportunity={searchOpportunity} /> : null}
        <SearchOpportunityBacklinks site={site.key} kind="guide" slug={slug} />
        <BaseMarketEditionLinks site={site} basePath={`/guides/${slug}`} />
        {commerceProduct ? <AmazonListingFreshness site={site.key} productSlug={commerceProduct.slug} /> : null}
        {guide.image ? (
          <figure className="mt-8">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md bg-[var(--surface-muted)]">
              <Image
                alt={guide.imageAlt ?? guide.title}
                className="object-cover"
                fill
                priority
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
        <article className="prose-lite mt-8">
          {guide.sections.map((section) => (
            <section key={section.heading}>
              <h2>{buyerFacingHeading(section.heading)}</h2>
              <p>{buyerFacingBody(section.body)}</p>
            </section>
          ))}
        </article>
        {amazonFamilyProduct && amazonFamilyIdentity && amazonFamilyOffer ? (
          <section className="mt-10 rounded-md border border-[var(--border)] bg-white p-5" aria-labelledby="amazon-family-listing">
            <p className="eyebrow">Current Amazon option</p>
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
                <dt className="font-bold">Listing checked</dt>
                <dd className="mt-1 text-[var(--muted)]">{new Date(amazonFamilyProduct.verifiedAt).toLocaleDateString("en-US", { timeZone: "UTC" })}</dd>
              </div>
            </dl>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--muted)]">
              Compare the current title, ASIN, variant, seller, stock, shipping, price, and return path before ordering.
            </p>
            <div className="mt-5">
              <AffiliateButton site={site.key} product={amazonFamilyIdentity} offer={amazonFamilyOffer} position="family-guide-amazon-anchor" resolveCreatorsListing={false} />
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
              <AffiliateButton site={site.key} product={cjFamilyIdentity} offer={cjFamilyAffiliateOffer} position="family-guide-cj-alternative" resolveCreatorsListing={false} />
            </div>
          </section>
        ) : null}
        {guide.comparisonTable ? (
          <section className="mt-10">
            <p className="eyebrow">Side-by-side checks</p>
            <h2 className="mt-3 text-2xl font-bold">{guide.comparisonTable.title}</h2>
            <div className="mt-5 overflow-x-auto rounded-md border border-[var(--border)] bg-white">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead className="bg-[var(--surface-muted)] text-xs uppercase text-[var(--muted)]">
                  <tr>
                    <th className="px-4 py-3">Check</th>
                    {guide.comparisonTable.columns.map((column) => (
                      <th className="px-4 py-3" key={column}>{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {guide.comparisonTable.rows.map((row) => (
                    <tr key={row.label}>
                      <th className="px-4 py-4 font-bold">{row.label}</th>
                      {guide.comparisonTable?.columns.map((column, index) => (
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
        ) : null}
        {guide.sources?.length ? (
          <section className="mt-10 rounded-md border border-[var(--border)] bg-white p-5">
            <p className="eyebrow">Primary sources</p>
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
            <p className="eyebrow">How this page was governed</p>
            <h2 className="mt-3 text-2xl font-bold" id="editorial-method">Page-specific editorial method</h2>
            <ol className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
              {guide.editorialMethod.map((item, index) => <li key={item}><span className="mr-2 font-bold text-[var(--text)]">{index + 1}.</span>{item}</li>)}
            </ol>
          </section>
        ) : null}
        {!guide.familySlug ? <section className="mt-10">
          <p className="eyebrow">Buying framework</p>
          <h2 className="mt-3 text-2xl font-bold">What to check before you choose</h2>
          <div className="mt-5 grid gap-6 md:grid-cols-3">
            <div>
              <h3 className="font-bold">Checklist</h3>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--muted)]">
                {advice.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold">Common mistakes</h3>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--muted)]">
                {advice.mistakes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold">Category checks</h3>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-[var(--muted)]">
                {advice.categoryChecks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 rounded-md border border-[var(--border)] bg-[var(--surface-muted)] p-5">
            <h3 className="font-bold">Decision rule</h3>
            <p className="mt-2 leading-7 text-[var(--muted)]">{advice.decision}</p>
          </div>
        </section> : null}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {relatedGuides.map((item) => (
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
        {site.key === "costume" ? (
          <section className="mt-10 rounded-md border border-[#d7b58a] bg-[#fff8ee] p-6" aria-labelledby="costume-family-products">
            <p className="eyebrow">Live Costume catalog</p>
            <h2 className="mt-3 text-2xl font-bold" id="costume-family-products">Verified products for this buying question</h2>
            {costumeCatalogProducts.length ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {costumeCatalogProducts.map((product) => (
                  <Link className="overflow-hidden rounded-md border border-[#e8d2b8] bg-white" href={`/products/${product.slug}`} key={product.slug}>
                    {product.authorizedImage ? (
                      <div className="relative aspect-square bg-[#f4ede3]">
                        {/* This URL is rights-gated in PostgreSQL and may use an authorized merchant CDN outside Next's optimizer allowlist. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          alt={product.authorizedImage.altText ?? product.title}
                          className="absolute inset-0 h-full w-full bg-white object-contain"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          src={product.authorizedImage.url}
                        />
                      </div>
                    ) : null}
                    <div className="p-4">
                      <h3 className="font-bold leading-6">{product.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Active CJ catalog identity, authorized image, verified link, and published editorial record.</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="mt-4 leading-7 text-[var(--muted)]">No product is shown when the live database cannot confirm an active link, authorized image, availability, and published editorial record for this exact family.</p>
            )}
          </section>
        ) : null}
        {site.key === "costume" ? (
          <section className="mt-10 rounded-md border border-[#d7b58a] bg-[#fff8ee] p-6">
            <p className="eyebrow">Put the guide into a complete Halloween story</p>
            <h2 className="mt-3 text-2xl font-bold">Costume and scene recipes</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {costumeHalloweenIdeas.map((idea) => (
                <Link className="rounded-md border border-[#e8d2b8] bg-white p-4" href={`/halloween-ideas/${idea.slug}`} key={idea.slug}>
                  <h3 className="font-bold">{idea.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{idea.dek}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
