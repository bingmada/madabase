import { amazonAsinAffiliateUrl } from "./affiliate-tracking";
import type { Guide, Product, Roundup } from "./types";

const d8Slug = "momcozy-deepclean-d8-bottle-washer";
const kleanPalSlug = "momcozy-kleanpal-pro-baby-bottle-washer";
const comparisonSlug = "momcozy-deepclean-d8-vs-kleanpal-pro";
const checkedAt = "November 27, 2026";
const d8Source = {
  name: "Momcozy DeepClean D8: loading configurations and US voltage FAQ",
  url: "https://momcozy.com/products/momcozy-deepclean-baby-bottle-washer-d8",
  note: "Separate bottle and pump layouts, drain hose and US 120 V FAQ. Capacity and cleaning features are manufacturer claims, not comparative test results.",
};
const supportSource = {
  name: "Momcozy D8/BW05 specification table",
  url: "https://support.momcozy.com/article/54385378995865",
  note: "Identifies BW05/D8 and 120 V / 60 Hz. Timing fields conflict with other manufacturer documents; no complete-cycle duration is asserted here.",
};
const kleanPalSource = {
  name: "Momcozy KleanPal Pro BS03 US instructions",
  url: "https://cdn.shopify.com/s/files/1/0559/2321/2486/files/BS03_A9-20251209.pdf?v=1765418560",
  note: "Four-bottle planning load and separate washing, drying and cooling stages. These instructions do not apply to D8/BW05.",
};
const proWashSource = {
  name: "Baby Brezza ProWash360 original US instructions",
  url: "https://cdn.shopify.com/s/files/1/1465/2384/files/BRZ0261_ProWash360_IM_US_260930.pdf?v=1790788351",
  note: "Printed pages 5–8: hose-to-sink setup and distinct six/eight-bottle rack arrangements. Used for model separation, not an enabled ProWash360 purchase offer.",
};

export const bottleWasherPilotProducts: Product[] = [{
  site: "baby",
  slug: d8Slug,
  releaseCandidate: "us-demand-20261124",
  name: "Momcozy DeepClean D8 Bottle Washer, Sterilizer & Dryer",
  brand: "Momcozy",
  category: "feeding",
  asin: "B0H6Q2G76Z",
  seoTitle: "Momcozy DeepClean D8 Guide: Load Fit, Drain Hose & US Model",
  updatedAt: checkedAt,
  evidenceMode: "official-spec",
  researchNote: "Manufacturer product/US voltage FAQ, BW05 support and selected Amazon US listing rechecked November 27, 2026; regional PDF review November 24, 2026. This is a documentation-based buying guide. The English PDF linked by the BW05 support menu specifies 220–240 V; its dimensions, program timings and regional warranty have not been transferred to the US product. No cleaning, noise, durability or time-saving measurement supports a performance ranking.",
  image: "/images/affiliate/momcozy-d8-load-decision.svg",
  imageAlt: "Editorial D8 decision diagram: choose one bottle or pump-part layout, check every part, and plan a drain route; not a product photograph",
  summary: "Compare Momcozy D8 with a four-bottle washer by complete load, pump-part fit, drain routing and the exact US version before choosing.",
  verdict: "D8 is worth comparing for its alternative bottle and pump layouts. An eight-bottle headline does not promise eight complete bottles plus a pump kit at once. Keep a working washer or dishwasher when the usual disassembled load already fits.",
  whyItMatters: "The useful capacity is the number of complete feeding sets ready for the next feed. A larger bottle count helps only when nipples, rings, valves and pump parts also have a permitted place.",
  bestFor: "Households whose actual feeding load exceeds a four-bottle layout",
  priceBand: "$$$",
  rating: 0,
  scores: [],
  pros: [
    "Manufacturer shows different layouts for eight bottles, four bottles and selected pump sets",
    "Dedicated pump spray attachments provide an alternative to a bottle-only layout",
    "A drain hose removes the dirty-water-tank emptying step",
  ],
  cons: [
    "Requires a suitable drain route; it is not a hose-free washer",
    "Bottle and pump layouts are alternatives, not additive capacity",
    "Complete-cycle timing and exact-version counter clearance need confirmation",
  ],
  specs: {
    ASIN: "B0H6Q2G76Z",
    "Model": "DeepClean D8 / BW05; separate from KleanPal Pro BS03",
    "US power": "120 V / 60 Hz in the selected US listing and manufacturer support; match the appliance label",
    "Loading": "Up to eight bottles in a specified layout; separate four-bottle and example pump-set layouts",
    "Drain": "External hose; manufacturer describes a 0.75 m hose and no waste tank",
    "Complete cycle": "Not established consistently across the reviewed documents; ask for the supplied US program table",
    "Counter fit": "Confirm actual US-version dimensions, lid travel, tank access and drain routing before ordering",
  },
  evidence: [
    "List every bottle and detached part used between washes, then match one complete load to the D8 layout",
    "Check both the pump maker's cleaning limits and the washer's named loading instructions",
    "Plan the permitted drain route and access for filling, opening and maintenance",
    "Confirm D8/BW05, ASIN B0H6Q2G76Z and a US 120 V / 60 Hz label",
  ],
  purchaseCheck: "Select US D8/BW05, ASIN B0H6Q2G76Z. It needs a drain hose. Match every detached feeding part to one permitted layout; the eight-bottle maximum does not include an assumed extra pump kit.",
  compareSlugs: [kleanPalSlug],
  editorialSections: [
    { heading: "Start with the complete load", body: "Place the usual disassembled feeding set on a clean surface and count bottles separately from their nipples, rings, caps and pump parts. Compare that inventory with the maker's chosen D8 layout. If every part has a permitted position with spray paths clear, the larger format may reduce split loads. A bottle count alone cannot establish that saving." },
    { heading: "The eight-bottle and pump layouts do different jobs", body: "The maker shows eight-bottle, four-bottle and example Air1, M9 and M5 pump configurations. It does not follow that any pump kit fits, or that a full pump set can be added to the maximum bottle load. Follow the instructions supplied with the US unit and the feeding-item maker's washing and heat limits." },
    { heading: "Resolve drainage before counter placement", body: "D8 uses an external hose rather than a dirty-water tank. The manufacturer's setup directs the hose to a sink. Check that the permitted route works where the machine will stand, including opening the lid, accessing the water tank and servicing it. A hose draining into another container is still a hose-based setup; do not buy it as a drainless machine." },
    { heading: "Do not turn wash time into feeding turnaround", body: "Washing, any selected steam stage, drying, unloading and cooling are separate parts of the routine. Manufacturer documents currently disagree on some D8 timing fields. Ask for the program table supplied with the exact US version before planning consecutive batches or comparing a complete wash-and-dry time. Keep enough clean feeding parts for the interval." },
    { heading: "When to keep the current setup", body: "Keep KleanPal Pro when the complete four-bottle load fits and another rack arrangement would not solve a recurring problem. Also compare a suitable existing dishwasher or manual routine before paying for another appliance. D8's additional nozzles and branded cleaning claims do not establish better cleaning, quieter operation or longer life in this guide." },
  ],
  sources: [d8Source, supportSource, {
    name: "Amazon US D8 selection",
    url: "https://www.amazon.com/dp/B0H6Q2G76Z",
    note: "November 27, 2026, delivery ZIP 10001: White D8 title, 120 V / 60 Hz bullet and an In Stock buy box; sold by Smartlin, fulfilled by Amazon. Selected condition was not separately established. Recheck condition, configuration and returns. No order placed.",
  }],
  offers: [{
    merchant: "Amazon US",
    url: amazonAsinAffiliateUrl("baby", "B0H6Q2G76Z"),
    label: "Check DeepClean D8 on Amazon",
    priceNote: "D8 B0H6Q2G76Z, US 120 V / 60 Hz. Confirm the selected kit, condition, seller, delivered total and return eligibility.",
  }],
}];

export const bottleWasherPilotRoundups: Roundup[] = [{
  site: "baby",
  slug: comparisonSlug,
  releaseCandidate: "us-demand-20261124",
  decisionFirst: true,
  title: "Momcozy DeepClean D8 vs. KleanPal Pro",
  seoTitle: "Momcozy D8 vs. KleanPal Pro: Complete Loads & Drain Setup",
  updatedAt: checkedAt,
  category: "feeding",
  intent: "Choose between D8/BW05 and KleanPal Pro/BS03 by actual load and installation fit",
  dek: "Choose by the whole disassembled feeding set, drain route and exact US version. The larger advertised bottle count is not a measured cleaning or speed advantage.",
  quickAnswer: "Compare D8 if the KleanPal Pro four-bottle layout forces repeated split loads and a D8 loading configuration fits all the parts. Keep KleanPal Pro if it already handles the usual batch. Both use a drain hose; neither solves a requirement for a hose-free washer. Confirm exact US instructions before comparing complete program times.",
  intro: "Start with the bottles and pump parts that accumulate between normal washes. Decide which permitted rack arrangement fits that batch, then check placement and the complete routine. This comparison uses manufacturer documentation rather than a scored appliance test.",
  purchaseFlow: "task-links",
  productSlugs: [d8Slug, kleanPalSlug],
  purchaseCheck: "D8/BW05 is B0H6Q2G76Z; KleanPal Pro/BS03 is B0CWLHKQNT. Do not transfer a regional manual, rack layout or included accessories between them. Recheck the exact seller and kit before checkout.",
  comparisonTable: {
    title: "Choose the load before the headline capacity",
    columns: ["DeepClean D8 / BW05", "KleanPal Pro / BS03"],
    rows: [
      { label: "Bottle planning load", values: ["Maker shows an eight-bottle layout and separate smaller or pump layouts", "US instructions describe a four-bottle planning load"] },
      { label: "Pump parts", values: ["Dedicated pump spray attachments; use the illustrated configuration for the exact set", "Use the BS03 pump layout; do not borrow the D8 arrangement"] },
      { label: "Drain requirement", values: ["External hose; sink route required by the maker's setup", "External drain route in the BS03 instructions"] },
      { label: "Full turnaround", values: ["D8 timing documents differ; confirm the supplied US program table", "Include stages after the wash setting and the instructed cooling interval"] },
      { label: "Upgrade case", values: ["A permitted load solves a repeated split-batch problem", "Keep it when the usual complete batch already fits"] },
    ],
  },
  decisionGuide: [
    { label: "A working four-bottle setup", detail: "Keep it if all the usual detached parts fit, come out clean and dry, and the routine is manageable. A newer model name does not establish an upgrade need." },
    { label: "Repeated split loads", detail: "Compare the D8 diagrams with the actual bottles and pump parts. Count complete feeding sets rather than empty bottles alone; include unloading and maintenance in the decision." },
    { label: "No suitable sink route", detail: "Neither Momcozy option meets a hose-free requirement. The separate tank-based Baby Brezza Bottle Washer Pro is covered in our washer-versus-sterilizer guide. The newer ProWash360 also uses a hose, so do not choose by brand alone." },
  ],
  sections: [
    { heading: "Check one complete batch, not two capacity headlines", body: "Write down the parts needed before the next wash: bottle bodies, nipples, rings, valves, flanges and collection cups. Assign every item a permitted rack position. A larger maximum bottle count is useful only when it changes how often the household needs to run or hand-finish a batch." },
    { heading: "Keep US models and instructions matched", body: "D8/BW05 and KleanPal Pro/BS03 are separate machines. D8's US product FAQ specifies 120 V; the English PDF reached from its support menu instead describes 220–240 V. Use the instructions supplied for the selected US version and confirm the appliance label. Do not use a different regional PDF to settle installation clearance or timing." },
    { heading: "A nozzle count does not rank cleaning performance", body: "D8's rotary jets and dedicated small-part features are manufacturer-described differences. They do not establish a measured advantage in milk-residue removal, noise, drying or durability here. The useful next check is whether the permitted loading pattern supports the parts you use without blocking spray or airflow." },
    { heading: "A hose-free requirement is a different selection", body: "The existing Bottle Washer Pro uses separate clean- and waste-water tanks. ProWash360 is a different model with a drain hose, confirmed in its US setup instructions. Read the washer-versus-sterilizer guide for that tank-based option and the existing-dishwasher alternative before buying either Momcozy model." },
  ],
  methodology: [
    "Documentation-based comparison of exact model identities, loading arrangements and drainage requirements; no scored cleaning, noise or durability test.",
    "D8 US voltage is supported by its product FAQ, support table and selected US retailer listing. Conflicting dimensions and complete-cycle timings are not used to rank the appliances.",
    "A complete-load check is a proposed household selection step, not a capacity test performed by Madabase.",
  ],
  sources: [d8Source, supportSource, kleanPalSource, {
    name: "Baby Brezza Bottle Washer Pro",
    url: "https://babybrezza.com/products/bottle-washer-pro",
    note: "Separate clean- and waste-water tanks; not the newer hose-draining ProWash360.",
  }, proWashSource],
  faqs: [
    { question: "Is DeepClean D8 the same machine as KleanPal Pro?", answer: "No. D8 is BW05; KleanPal Pro is BS03. Use the exact model's regional instructions, rack layouts and accessories." },
    { question: "Can D8 wash eight bottles and a pump kit together?", answer: "The maker shows alternative bottle and pump configurations. The eight-bottle headline does not establish that an additional full pump kit fits at the same time. Match all parts to one permitted layout." },
    { question: "Which Momcozy washer works without a drain hose?", answer: "Neither of these options meets that requirement. Check the separate tank-based Bottle Washer Pro in our existing washer guide; ProWash360 is a different hose-draining model." },
    { question: "Should I replace a working KleanPal Pro?", answer: "Keep it when the actual complete batch fits and the routine works. Compare D8 only for a documented load or workflow problem; this comparison does not establish better cleaning or a measured time saving." },
  ],
}];

/** Add the new choice to the existing task owner rather than a second generic guide. */
export function addBottleWasherPilotLinks(guide: Guide): Guide {
  if (guide.site !== "baby" || guide.slug !== "bottle-washer-vs-sterilizer-vs-dryer-guide") return guide;
  return {
    ...guide,
    updatedAt: checkedAt,
    relatedProducts: [...new Set([...(guide.relatedProducts ?? []), d8Slug, kleanPalSlug])],
    relatedRoundups: [...new Set([...guide.relatedRoundups, comparisonSlug])],
    sections: [...guide.sections, {
      heading: "Choose tanks or a hose before comparing bottle counts",
      body: "The tank-based Baby Brezza Bottle Washer Pro and newer ProWash360 are different machines: ProWash360 uses a hose to the sink. Momcozy D8/BW05 also uses a hose and has separate bottle and pump layouts. Compare D8 with KleanPal Pro/BS03 only when the larger permitted load solves a repeated split-batch problem. The model comparison and D8 guide below cover those choices; keep a suitable existing routine when another appliance adds no useful capacity.",
    }],
    sources: [...(guide.sources ?? []), d8Source, proWashSource],
  };
}
