import { merchant14TaskOptions } from "./merchant14-task-options";
import { findProduct, findRoundup, siteProducts } from "./content";
import { amazonAsinAffiliateUrl, applySiteAffiliateTracking } from "./affiliate-tracking";
import type { Guide, Product, Roundup, SiteKey, Tool } from "./types";
import { findAmazonFamilyProduct } from "./amazon-family-products";
import { merchant20TaskAlternatives } from "./merchant20-alternatives";
import { merchant21Alternatives } from "./merchant21-alternatives";
import { merchant13TaskOptions } from "./merchant13-task-options";
import { additionalCommerceProducts } from "./additional-commerce-products";
import { applyReviewedProductContent } from "./reviewed-product-content";
import { additionalFamilyCommerceView } from "./additional-family-commerce-views";

const okinRollingDeskAlternative: Product = {
  site: "homeoffice",
  slug: "okin-36x24-electric-standing-desk-with-wheels-retailer-alternative",
  asin: "B0FH4RDV1Q",
  amazonTitle: "Okin 36×24 Electric Standing Desk with Wheels",
  updatedAt: "October 31, 2026",
  publicationStatus: "draft",
  sitemapExcluded: true,
  discoveryExcluded: true,
  name: "Okin 36×24 Electric Standing Desk with Wheels",
  brand: "Okin",
  category: "desks",
  image: "",
  summary: "A compact electric sit-stand desk sold in a configuration with lockable casters.",
  verdict: "The October 31, 2026 US listing selected Black, 36 Inch and With Wheels, model OKSM6545W3624BO-CA. Confirm those selections before buying. Retail load figures conflict; no load, rolling stability or height-range test was performed.",
  bestFor: "A compact mobile workstation where lockable casters are a real requirement",
  priceBand: "$$",
  rating: 0,
  scores: [],
  pros: [
    "The selected Amazon configuration includes lockable casters",
    "The 36×24-inch format is aimed at compact workspaces",
  ],
  cons: [
    "It is a different, smaller product than the 48×24-inch ErGear desk",
    "Live price, seller, color, shipping, and returns can change",
  ],
  specs: {
    ASIN: "B0FH4RDV1Q",
    Desktop: "36 × 24 inches in the checked listing title",
    Mobility: "With Wheels configuration; lockable casters listed",
    "Listed height range": "27.56–45.28 inches with 1.97-inch wheels; retailer claim, not measured",
    "Listing model": "OKSM6545W3624BO-CA",
    "Load limit": "Retail fields conflict between 154 and 176 lb; confirm with seller before relying on either",
  },
  evidence: [
    "October 31, 2026: Amazon US 10001 showed an active new offer for Black / 36 Inch / With Wheels, model OKSM6545W3624BO-CA; sold by Bizumoffice US and fulfilled by Amazon",
    "Confirm the 36-inch size, With Wheels configuration, color, seller, delivery, and return terms before checkout",
  ],
  sources: [
    {
      name: "Amazon listing for ASIN B0FH4RDV1Q",
      url: "https://www.amazon.com/dp/B0FH4RDV1Q",
      note: "October 31, 2026: exact selected configuration and seller observed; expanded conditional 30-day return summary reviewed. Conflicting 154/176 lb load fields remain unresolved; no manufacturer manual or physical stability test was established.",
    },
  ],
  offers: [
    {
      merchant: "Amazon US",
      url: amazonAsinAffiliateUrl("homeoffice", "B0FH4RDV1Q"),
      label: "Check Okin 36×24 desk price on Amazon",
      priceNote: "Confirm ASIN B0FH4RDV1Q, 36-inch size, With Wheels configuration, color, seller, live price, delivery, and returns.",
    },
  ],
};

const omotonDualStandAlternative: Product = {
  site: "homeoffice",
  slug: "omoton-black-dual-vertical-stand-retailer-alternative",
  asin: "B078W3QSZY",
  name: "OMOTON Black dual-slot stand",
  brand: "OMOTON",
  category: "ergonomics",
  updatedAt: "October 30, 2026",
  publicationStatus: "draft",
  sitemapExcluded: true,
  discoveryExcluded: true,
  evidenceMode: "official-spec",
  image: "",
  summary: "An adjustable aluminum stand for two closed devices with separately adjustable slots listed for 14–42 mm thickness.",
  verdict: "A separate dual-slot option when both devices fit the listed adjustment range. It does not resolve the Satechi stand's conflicting dimensions.",
  bestFor: "Two measured closed devices between 14 and 42 mm thick",
  priceBand: "$",
  rating: 0,
  scores: [],
  pros: ["Two separately adjustable slots", "Listed aluminum body and silicone contact pads"],
  cons: ["Devices thinner than the listed 14 mm minimum need another solution", "Closed-display behavior and cable clearance depend on the laptop"],
  specs: { ASIN: "B078W3QSZY", Selection: "Black, dual slot, one stand", "Listed device thickness": "14–42 mm (0.55–1.65 in)" },
  evidence: ["Manufacturer LD02 guidance and the exact Black dual-slot listing agree on the 14–42 mm adjustment range", "New OT_Shop offer, Amazon fulfillment and expanded free 30-day refund/replacement observed for US 10001 on October 30, 2026"],
  purchaseCheck: "For two closed devices, each 14–42 mm thick including its case. Confirm the Black two-slot selection, seller and returns; Satechi’s dimensions do not apply.",
  sources: [{ name: "OMOTON LD02 features, fit and adjustment FAQ", url: "https://omoton.com/products/ld02", note: "Dual-slot adjustment and 14–42 mm device thickness; a passive fit reference, not a universal compatibility or performance test." }, { name: "Amazon Black dual-slot B078W3QSZY", url: "https://www.amazon.com/dp/B078W3QSZY", note: "Exact color, dual-slot selection, model identity, New offer and expanded returns observed October 30, 2026. Recheck live terms." }],
  offers: [{ merchant: "Amazon US", url: amazonAsinAffiliateUrl("homeoffice", "B078W3QSZY"), label: "Check OMOTON Black dual-slot on Amazon", priceNote: "Exact B078W3QSZY, Black, two adjustable slots. Recheck selected condition, seller, delivery and returns. Prime discounts require eligibility." }],
};

const nanitCameraFloorStandAlternative: Product = {
  site: "baby",
  slug: "nanit-camera-floor-stand-nb303n-retailer-alternative",
  asin: "B0FTSL4FXJ",
  name: "Nanit camera + floor stand (no display)",
  brand: "Nanit",
  category: "sleep",
  updatedAt: "October 30, 2026",
  publicationStatus: "draft",
  sitemapExcluded: true,
  discoveryExcluded: true,
  evidenceMode: "official-spec",
  image: "",
  summary: "A separately selected Nanit Pro-edition camera and floor-stand package for app-based viewing; it is not the historical Essentials or eight-inch-display bundle.",
  verdict: "Compare this camera-and-floor-stand package when you want app-based viewing and can provide the required power, network and safe stand placement. Check subscription terms separately from the hardware.",
  bestFor: "App-based nursery viewing with an appropriate overhead stand location",
  priceBand: "$$$",
  rating: 0,
  scores: [],
  pros: ["Camera and floor stand are the selected package", "Manufacturer documents core app viewing separately from paid Insights features"],
  cons: ["Needs power, account setup and a suitable network", "Advanced Insights and video-history features may require a renewing plan", "Does not replace adult supervision"],
  specs: { ASIN: "B0FTSL4FXJ", "Retailer part number": "NB303N", Selection: "Camera & Floor Stand; Pro edition", UPC: "810108757115" },
  evidence: ["Exact Camera & Floor Stand selection, NB303N and UPC 810108757115 observed on Amazon October 30, 2026", "Current official squared-base instructions read separately; supplied base, kit and camera regulatory revision are not certified from the listing"],
  purchaseCheck: "Camera + floor stand B0FTSL4FXJ; no eight-inch display or Sound + Light assumed. Confirm selected condition, supplied stand instructions, cord clearance, app/Wi-Fi setup and renewing plan terms.",
  sources: [{ name: "Nanit current camera and mount choices", url: "https://www.nanit.com/products/smart-baby-monitor", note: "Current camera-only versus display and floor-stand versus wall-mount choices; hardware and plan terms are separate." }, { name: "Nanit squared-base floor-stand instructions", url: "https://cdn.shopify.com/s/files/1/1354/7173/files/Floor-Stand-With-Square-Based-User-Guide.pdf?v=1680283334", note: "Official currently linked guide: complete English physical pages 1–26 and setup diagrams 4–23 read. Applies to squared-base Pro stands; confirm supplied version. It does not certify the received kit or safe placement in every nursery." }, { name: "Amazon camera and floor stand B0FTSL4FXJ", url: "https://www.amazon.com/dp/B0FTSL4FXJ", note: "Exact NB303N package, Amazon.com offer and expanded free 90-day refund/replacement observed October 30, 2026 for US 10001. Recheck condition, contents, delivery and returns." }],
  offers: [{ merchant: "Amazon US", url: amazonAsinAffiliateUrl("baby", "B0FTSL4FXJ"), label: "Check Nanit camera + floor stand on Amazon", priceNote: "Confirm B0FTSL4FXJ, Camera & Floor Stand, UPC 810108757115 and the actual received model and complete parts. Current retail details do not establish NB303N. Check condition, supplied stand instructions and current seller terms; display, sound machine and renewing plans are separate." }],
};

const ergearFixedDeskAlternative: Product = {
  "site": "homeoffice",
  "slug": "ergear-egesd5b-black-fixed-foot-desk-retailer-alternative",
  "asin": "B0B41YH9B6",
  "name": "ErGear EGESD5B Black desk (fixed feet)",
  "brand": "ErGear",
  "category": "desks",
  "updatedAt": "October 31, 2026",
  "publicationStatus": "draft",
  "sitemapExcluded": true,
  "discoveryExcluded": true,
  "evidenceMode": "official-spec",
  "image": "",
  "summary": "A separately identified Black EGESD5B split-top electric desk with fixed leveling feet, sold in the nominal 48 × 24-inch selection. It does not provide the original desk’s wheels.",
  "verdict": "Compare this option for a stationary compact workstation when the actual top and height range fit. It is not a replacement for a desk that must roll. Confirm the supplied controller because the current listing advertises four presets while its attached manual shows three stored heights.",
  "bestFor": "A compact stationary sit-stand setup that does not need casters",
  "priceBand": "$",
  "rating": 0,
  "scores": [],
  "pros": [
    "Matching EGESD5B model appears in the selected listing and attached manual",
    "Fixed leveling feet and a split desktop are shown in the assembly drawings"
  ],
  "cons": [
    "No wheels promised; it does not meet a must-roll requirement",
    "Three stored heights in the attached Rev06 manual differ from the four-preset listing claim",
    "No comparative stability, noise, reliability or assembly-speed test by Madabase"
  ],
  "specs": {
    "ASIN": "B0B41YH9B6",
    "Retailer model": "EGESD5B; Black; nominal 48 X 24 Inches selection",
    "Listed actual top": "47.2 × 23.6 inches; measure rather than assuming the nominal dimensions",
    "Documented height range": "28.3–46.5 inches (72–118 cm), approximately matching listing 28.35–46.46",
    "Documented maximum load": "176 lb / 80 kg; not an independently tested monitor-clamp rating",
    "Base": "Fixed leveling feet; no caster compatibility inferred",
    "Power input": "Manual 100–240 V; confirm supplied adapter, cord and local plug",
    "Controller boundary": "Manual S/1/2/3 controller; current title says four memory presets"
  },
  "evidence": [
    "Current ASIN model and part EGESD5B match the attached ErGear Rev06 manual model list",
    "Selected regular119.99 Bestqi Ergonomic/Amazon fulfillment and expandedfree 30-day returns observedUS10001 October 31;Prime104.99 eligibility and condition are separate",
    "All16 physical manual pages read visually; no received-unit or performance certification"
  ],
  "purchaseCheck": "Fixed feet, not wheels. Check EGESD5B Black, actual top/height and supplied controller: the listing says four presets but its manual shows three stored heights. Recheck condition, seller and returns.",
  "sources": [
    {
      "name": "ErGear EGESD5B Rev06 assembly and controller manual",
      "url": "https://m.media-amazon.com/images/I/C1l2n7xoGPL.pdf",
      "note": "ErGear Rev06 includes EGESD5B. Assembly drawings show fixed feet and a split top; three stored heights differ from the current four-preset listing claim. Match the supplied controller."
    },
    {
      "name": "Amazon ErGear EGESD5B Black B0B41YH9B6",
      "url": "https://www.amazon.com/dp/B0B41YH9B6",
      "note": "Black nominal 48×24 selection, EGESD5B model, regular-price offer and expanded returns observed October 31, 2026 for US 10001. Recheck actual dimensions, supplied controller and condition."
    }
  ],
  "offers": [
    {
      "merchant": "Amazon US",
      "url": "https://www.amazon.com/dp/B0B41YH9B6?tag=madaoffice-20",
      "label": "Check ErGear EGESD5B fixed-foot desk on Amazon",
      "priceNote": "Different fixed-foot product B0B41YH9B6; no wheels. Confirm EGESD5B Black, actual dimensions, controller, condition, seller and live returns."
    }
  ]
};

const omniBreezeBloomsAlternative: Product = {
  "site": "baby",
  "brand": "Ergobaby",
  "category": "travel",
  "updatedAt": "October 31, 2026",
  "publicationStatus": "draft",
  "sitemapExcluded": true,
  "discoveryExcluded": true,
  "evidenceMode": "official-spec",
  "image": "",
  "rating": 0,
  "scores": [],
  "priceBand": "$$",
  "evidence": [],
  "slug": "ergobaby-omni-breeze-onyx-blooms-retailer-alternative",
  "asin": "B0BQCPHV9J",
  "name": "Ergobaby Omni Breeze — Onyx Blooms",
  "summary": "A separately selected Omni Breeze mesh carrier in Onyx Blooms. It is not the unavailable Onyx Black ASIN, Classic, Dream or Deluxe.",
  "verdict": "Compare this independently named Breeze variant only when its own child, position and caregiver fit checks suit the task. No individual comfort or cooling result is established.",
  "bestFor": "Comparing a structured carrier with its own position-specific fit conditions",
  "pros": [
    "Breeze family instructions distinguish inward, outward, hip and back positions",
    "Current exact variant and manufacturer model visible in the selected listing"
  ],
  "cons": [
    "Retail description also spells Oynx Blue; match the Onyx Blooms selection and BCZ360PONYXBLM model",
    "Not a detachable rigid hip seat or a guarantee of newborn or caregiver fit"
  ],
  "specs": {
    "ASIN": "B0BQCPHV9J",
    "Selection": "Omni Breeze, Onyx Blooms; BCZ360PONYXBLM",
    "UPC": "191653007062",
    "Inward starting checks": "At least 7 lb AND 20 in, plus instructed seat/head support and actual fit",
    "Later positions": "Separate size, development, setup and no-outward-sleep conditions"
  },
  "purchaseCheck": "Different option: Onyx Blooms B0BQCPHV9J, model BCZ360PONYXBLM. Meet both 7 lb / 20 in inward minimums and all fit checks; later modes need their own readiness. Match supplied instructions, condition, seller and returns.",
  "sources": [
    {
      "name": "Ergobaby Omni Breeze and Omni Dream original instructions",
      "url": "https://m.media-amazon.com/images/I/C1hZwZsKKuL.pdf",
      "note": "Manufacturer-authored joint manual IM-OMNIBRZ+DRM_ROW_210315_V1: complete English and all diagrams on two physical spreads previously read. Linked from the original Onyx Black listing; model-family guidance, not proof of the supplied regional instructions for every Onyx Blooms unit."
    },
    {
      "name": "Amazon Omni Breeze Onyx Blooms B0BQCPHV9J",
      "url": "https://www.amazon.com/dp/B0BQCPHV9J",
      "note": "October 31, 2026, US ZIP 10001: selected Onyx Blooms, BCZ360PONYXBLM, UPC191653007062, Amazon.com offer and expanded 90-day returns observed. Description also spells Oynx Blue; match selection/model rather than treating it as original Onyx Black. Selected New not explicitly displayed."
    }
  ],
  "offers": [
    {
      "merchant": "Amazon US",
      "url": "https://www.amazon.com/dp/B0BQCPHV9J?tag=madababy-20",
      "label": "Compare Omni Breeze Onyx Blooms on Amazon",
      "priceNote": "Confirm Onyx Blooms BCZ360PONYXBLM, not original Onyx Black. Recheck condition, supplied instructions, current seller/delivery and returns; no tested fit or cooling claim."
    }
  ]
};

const babybjornSmartPottyAlternative: Product = {
  "site": "baby",
  "brand": "BabyBjörn",
  "category": "daily",
  "updatedAt": "October 31, 2026",
  "publicationStatus": "draft",
  "sitemapExcluded": true,
  "discoveryExcluded": true,
  "evidenceMode": "official-spec",
  "image": "",
  "rating": 0,
  "scores": [],
  "priceBand": "$",
  "evidence": [],
  "slug": "babybjorn-smart-potty-gray-white-retailer-alternative",
  "asin": "B07WW54J8Y",
  "name": "BabyBjörn Smart Potty — Gray/White single",
  "summary": "A simple floor potty with a removable inner bowl, independently selected as a Gray/White single unit. It is not a toilet reducer or step stool.",
  "verdict": "Compare this option for a child ready to use a low floor potty with adult help. It does not replace the other modes of a three-in-one system.",
  "bestFor": "A straightforward floor-potty routine in a measured clear space",
  "pros": [
    "Removable inner bowl for emptying and cleaning",
    "A single floor-potty format rather than three conversion modes"
  ],
  "cons": [
    "Does not attach to an adult toilet or serve as a step stool",
    "Readiness and stable use on the actual floor still need checking"
  ],
  "specs": {
    "ASIN": "B07WW54J8Y",
    "Selection": "Gray/White, one potty (not a six-pack); 051225US",
    "Manufacturer dimensions": "10×13×6.5in; a reference, not our measurement",
    "Purpose": "Floor potty with removable inner bowl"
  },
  "purchaseCheck": "Floor potty only: Gray/White single B07WW54J8Y, 051225US. Check child readiness, clear stable floor, adult help and supplied care instructions. No reducer, step-stool, six-month or 55 lb approval inherited. Recheck condition and returns.",
  "sources": [
    {
      "name": "BabyBjörn Smart Potty Gray/White features and care",
      "url": "https://www.babybjorn.com/products/bathroom/smart-potty/gray-white/",
      "note": "Complete relevant features, inner bowl, readiness, materials/care and dimension sections read October 31. Simple floor-potty design; separate toilet trainer and step stool are different products."
    },
    {
      "name": "BabyBjörn Smart Potty FAQ",
      "url": "https://www.babybjorn.com/customer-service/faq/",
      "note": "Smart Potty subsection and general bathroom-plastics cleaning guidance read; individual readiness and removable-bowl cleaning, not a six-month approval or certified load test."
    },
    {
      "name": "Amazon Smart Potty Gray/White B07WW54J8Y",
      "url": "https://www.amazon.com/dp/B07WW54J8Y",
      "note": "October 31, 2026, US ZIP 10001: Gray/White, single-pack 051225US, Amazon.com offer at $26.99 and expanded 90-day returns. Free standard delivery requires an Amazon-shipped order over $35; selected New not explicitly shown."
    }
  ],
  "offers": [
    {
      "merchant": "Amazon US",
      "url": "https://www.amazon.com/dp/B07WW54J8Y?tag=madababy-20",
      "label": "Compare BabyBjörn Smart Potty on Amazon",
      "priceNote": "Single Gray/White 051225US, not six-pack or Potty Chair. Recheck condition, seller and the selected 90-day terms; free non-Prime delivery requires an Amazon-shipped order over $35."
    }
  ]
};

// These are intentionally excluded from editorial discovery, but their offers
// are rendered as explicitly labelled alternatives on selected pages.
export function explicitCommerceAlternatives() {
  return [okinRollingDeskAlternative, omotonDualStandAlternative, nanitCameraFloorStandAlternative, ergearFixedDeskAlternative, omniBreezeBloomsAlternative, babybjornSmartPottyAlternative, ...merchant20TaskAlternatives.map(({ product }) => product), ...merchant21Alternatives.map(({ product }) => product), ...merchant13TaskOptions.map(({ product }) => product), ...merchant14TaskOptions.map(({ product }) => product), ...additionalCommerceProducts]
    .map((product) => applySiteAffiliateTracking(applyReviewedProductContent(product)));
}

export function findCommerceProduct(site: SiteKey, slug: string) {
  return findProduct(site, slug)
    ?? explicitCommerceAlternatives().find((product) => product.site === site && product.slug === slug)
    ?? additionalFamilyCommerceView(site, slug);
}

function explicitGuideAlternative(site: SiteKey, guide: Guide) {
  if (site === "baby" && ["ergobaby-omni-breeze-positions-by-age","ergobaby-omni-breeze-newborn-fit-checklist","ergobaby-omni-breeze-cleaning-guide","babybjorn-harmony-newborn-fit-checklist","baby-carrier-hot-weather-and-caregiver-fit-guide","newborn-carrier-vs-all-stage-carrier-guide","ergobaby-omni-breeze-forward-facing-age-guide","ergobaby-omni-breeze-vs-babybjorn-harmony-by-age"].includes(guide.slug)) return omniBreezeBloomsAlternative;
  if (site === "homeoffice" && guide.slug === "standing-desk-casters-stability-guide") {
    return okinRollingDeskAlternative;
  }
}

function explicitReviewAlternative(site: SiteKey, product: Product) {
  if (site === "homeoffice" && product.slug === "ergear-48x24-electric-standing-desk") {
    return okinRollingDeskAlternative;
  }
}

function explicitRoundupAlternative(site: SiteKey, roundup: Roundup) {
  if (
    site === "homeoffice"
    && ["ergear-48x24-vs-flexispot-e7-mini", "best-standing-desks-for-small-spaces"].includes(roundup.slug)
  ) {
    return okinRollingDeskAlternative;
  }
}

function uniqueProducts(products: Array<Product | undefined>) {
  return products.filter(
    (product, index, items): product is Product =>
      Boolean(product)
      && items.findIndex((candidate) => candidate?.slug === product?.slug) === index,
  );
}

function productsFromRoundups(site: SiteKey, roundupSlugs: string[]) {
  return roundupSlugs.flatMap((roundupSlug) => {
    const roundup = findRoundup(site, roundupSlug);
    return roundup?.productSlugs.map((productSlug) => findProduct(site, productSlug)) ?? [];
  });
}

function firstPurchasable(products: Array<Product | undefined>) {
  return uniqueProducts(products).find((product) => product.offers.length > 0);
}

function categoryProducts(site: SiteKey, category: string) {
  return siteProducts(site).filter((product) => product.category === category);
}

export function categoryCommerceProduct(site: SiteKey, category: string) {
  return firstPurchasable(categoryProducts(site, category));
}

/**
 * Resolve the nearest verified revenue path without changing editorial identity.
 * Directly related products are an identity boundary: when a guide names them,
 * do not replace an unavailable offer with a product pulled from a broader
 * roundup. Related reading alone does not establish an exact buying need.
 */
export function guideCommerceProduct(site: SiteKey, guide: Guide) {
  if (guide.purchaseFlow === "task-links") return;
  if (guide.familySlug && findAmazonFamilyProduct(site, guide.familySlug)?.offerBlock?.status === "documentation-unverified") return undefined;
  const directlyRelatedProducts = (guide.relatedProducts ?? []).map((slug) => findProduct(site, slug));
  const directlyRelatedProduct = firstPurchasable(directlyRelatedProducts);
  if (directlyRelatedProduct) return directlyRelatedProduct;
  if (directlyRelatedProducts.some(Boolean)) return explicitGuideAlternative(site, guide);

  return explicitGuideAlternative(site, guide);
}

export function reviewCommerceProduct(site: SiteKey, product: Product) {
  if (product.purchaseAlternatives !== undefined) {
    return firstPurchasable([
      product,
      ...product.purchaseAlternatives.map((slug) => findCommerceProduct(site, slug)),
    ]);
  }
  return firstPurchasable([product]) ?? explicitReviewAlternative(site, product);
}

export function roundupCommerceProduct(site: SiteKey, roundup: Roundup) {
  if (roundup.purchaseFlow === "task-links") return;
  const comparisonProducts = roundup.productSlugs.map((slug) => findProduct(site, slug));
  if (roundup.purchaseAlternatives !== undefined) {
    return firstPurchasable([
      ...comparisonProducts,
      ...roundup.purchaseAlternatives.map((slug) => findCommerceProduct(site, slug)),
    ]);
  }
  return firstPurchasable(comparisonProducts)
    ?? explicitRoundupAlternative(site, roundup);
}

export function toolCommerceProduct(site: SiteKey, tool: Tool) {
  // Diaper quantities cannot establish fit for a sterilizer or other feeding appliance.
  if (tool.kind === "diapers") return undefined;
  if (site === "homeoffice" && tool.kind === "desk") {
    return firstPurchasable(productsFromRoundups(site, tool.relatedRoundups))
      ?? okinRollingDeskAlternative;
  }
  return firstPurchasable([
    ...productsFromRoundups(site, tool.relatedRoundups),
    ...categoryProducts(site, tool.category),
  ]);
}

export function isCommerceAlternative(editorialProduct: Product | undefined, commerceProduct: Product | undefined) {
  return Boolean(editorialProduct && commerceProduct && editorialProduct.slug !== commerceProduct.slug);
}
