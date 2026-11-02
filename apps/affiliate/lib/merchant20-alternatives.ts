import { amazonAsinAffiliateUrl } from "./affiliate-tracking";
import type { Product, SiteKey } from "./types";

type TaskAlternative = {
  family: string;
  product: Product;
  keep: string;
};

// Separate retail identities, deliberately absent from review-page discovery.
// These checks qualify a buying comparison, not a received unit or a performance test.
function option(input: {
  site: SiteKey; family: string; asin: string; slug: string; name: string; brand: string;
  summary: string; conditions: string; limits: string; selection: string;
  returns: string; keep: string; sources: NonNullable<Product["sources"]>;
}): TaskAlternative {
  return {
    family: input.family,
    keep: input.keep,
    product: {
      site: input.site, slug: input.slug, asin: input.asin, name: input.name,
      brand: input.brand, category: input.site === "pet" ? "home-care" : "security",
      updatedAt: "October 31, 2026", publicationStatus: "draft",
      sitemapExcluded: true, discoveryExcluded: true, evidenceMode: "official-spec",
      image: "", rating: 0, scores: [], priceBand: "$$",
      summary: input.summary, verdict: input.conditions, bestFor: input.summary,
      pros: [input.selection], cons: [input.limits],
      specs: { ASIN: input.asin, Selection: input.selection, "Return check": input.returns },
      evidence: ["Exact selected new US offer and expanded return terms observed for US 10001 on October 31, 2026; recheck live terms."],
      purchaseCheck: input.conditions,
      sources: [...input.sources, {
        name: `Selected Amazon ${input.asin} offer`, url: `https://www.amazon.com/dp/${input.asin}`,
        note: `${input.selection}. ${input.returns} Observation is dated, not a stock or compatibility guarantee.`,
      }],
      offers: [{ merchant: "Amazon US", url: amazonAsinAffiliateUrl(input.site, input.asin),
        label: `Check ${input.name} on Amazon`,
        priceNote: `${input.selection}. ${input.returns} Recheck selected condition, seller, delivery and current terms.`,
      }],
    },
  };
}

export const merchant20TaskAlternatives: TaskAlternative[] = [
  option({
    site: "pet", family: "soft-sided-pet-carriers", asin: "B000FLETX8",
    slug: "sherpa-original-deluxe-55231-black-medium-alternative",
    name: "Sherpa Original Deluxe — Black Medium 55231", brand: "Sherpa",
    selection: "Black, Medium, model 55231; one soft carrier",
    summary: "A measured soft carrier option for a pet that fits the Medium limits comfortably.",
    conditions: "The maker lists a 16 lb maximum, pet length up to 16 in and height up to 9.5 in; all limits and comfortable movement matter. Its external envelope is 17 × 11 × 10.5 in. Confirm the actual pet and route requirements before ordering.",
    limits: "An airline's acceptance is separate from the size label. This is not a crash-tested vehicle restraint. Washable liner instructions do not make the whole shell machine washable.",
    returns: "Free 30-day refund/replacement observed; recheck eligibility.",
    keep: "Keep a suitable existing carrier. If the pet or travel rules do not fit, choose another size or format rather than squeezing into Medium.",
    sources: [{ name: "Sherpa Original Deluxe Medium specifications", url: "https://sherpapet.com/products/sherpa-original-deluxe-travel-bag-pet-carrier?Color=Black&Size=Medium", note: "Expanded Medium specifications give separate pet weight, length, height and outside dimensions; these are not an individual fit or airline approval." }],
  }),
  option({
    site: "pet", family: "vehicle-pet-restraints", asin: "B08JQQF9YX",
    slug: "sleepypod-clickit-sport-csx-black-medium-alternative",
    name: "Sleepypod Clickit Sport — Jet Black M", brand: "Sleepypod",
    selection: "Jet Black, M, retailer model CSX-BLK-M; Clickit Sport",
    summary: "A belt-routed harness to compare instead of an elastic seat-belt extension.",
    conditions: "Measure the dog against the current maker sizing guide and check the vehicle's rear belt route before purchase. The instructions route the belt through both back loops; do not add the COOYOO extension. Ask the seller to confirm the supplied CSX instructions and contents: the current maker page uses Sport Plus naming.",
    limits: "The CPS directory names the Clickit Sport family; it does not certify this individual offer, received unit or fit. Sport Plus accessories and revision details are not assumed for this ASIN.",
    returns: "30-day refund/replacement observed; return shipping may apply, with no free-return eligibility shown.",
    keep: "Keep an appropriate restraint that already fits its instructions. If dog size, belt geometry or supplied revision is unresolved, settle that before buying.",
    sources: [
      { name: "Sleepypod current Sport product and sizing", url: "https://sleepypod.com/products/sport-bundle", note: "Current maker page uses Sport Plus naming; verify the selected CSX-BLK-M offer instead of transferring its bundle contents." },
      { name: "Clickit Sport printed belt-routing instructions", url: "https://cdn.shopify.com/s/files/1/0583/1485/0340/files/Sleepypod_Clickit_Sport_Instructions_2024_1.pdf?v=1783003719", note: "Both physical pages and diagrams read: fit, adjustment, both belt loops, avoid locking the belt and crash replacement. Match supplied revision." },
      { name: "Center for Pet Safety certified product directory", url: "https://centerforpetsafety.org/cps-certified/page/2/", note: "Names Clickit Sport; not a certification of this physical sample, seller or individual dog/vehicle fit." },
    ],
  }),
  option({
    site: "pet", family: "wet-food-automatic-feeders", asin: "B0GRHQGDCB",
    slug: "petlibro-polar-plaf109-black-2026-alternative",
    name: "PETLIBRO Polar PLAF109 — Black, 2026 version", brand: "PETLIBRO",
    selection: "Black, Feeder, 2026 New Version, one PLAF109",
    summary: "An actively cooled three-meal wet-food option, distinct from the Bsemax ice-pack timer.",
    conditions: "Use a dry, level indoor location at the manual's 12–30°C ambient range, with unobstructed vents, suitable power and 2.4 GHz Wi-Fi. The pet must be able to reach the bowl reliably. Confirm the supplied 2026 instructions and parts; the maker-linked PLAF109 manual does not label every revision.",
    limits: "A 72-hour scheduling limit is not proof that every food remains safe for 72 hours. Follow the food's storage rules, plan regular cleaning and a backup meal; no universal dishwasher permission or medical benefit is established.",
    returns: "Non-returnable due to food safety reasons. Damaged/defective arrival may qualify for a refund or replacement with evidence through Your Orders; recheck terms.",
    keep: "Keep supervised meals or a suitable existing routine if feeding, temperature or access conditions are uncertain. Cooling does not replace daily oversight.",
    sources: [
      { name: "PETLIBRO PLAF109 operating support", url: "https://petlibro.com/pages/how-the-polar-wet-food-feeder-works-plaf109", note: "Current model support links the PLAF109 original. Earlier used-only V1 stock is not this new 2026 offer." },
      { name: "PETLIBRO PLAF109 original manual", url: "https://cdn.shopify.com/s/files/1/0252/5197/1119/files/PETLIBRO_Products_Polar_Wet_Food_Feeder_PLAF109_USER_MANUAL.pdf?v=1713510846", note: "Selected original contents, setup, schedule, care and safety spreads read. Ambient, access, power and food limits apply; no universal 72-hour food-safety result inferred." },
    ],
  }),
  option({
    site: "pet", family: "smart-bird-feeders", asin: "B0B56BFH7P",
    slug: "birdfy-feeder1-solar-retailer-alternative",
    name: "NETVUE by Birdfy Feeder 1 — Solar", brand: "Birdfy",
    selection: "Feeder 1 Solar B0B56BFH7P; confirm the selected camera and included panel",
    summary: "An app-based wild-bird viewing feeder with a separately identified Solar offer.",
    conditions: "Compare it when you have Wi-Fi coverage and a permitted, reachable mounting location for feeding and cleaning. The maker's Feeder 1 instructions include initial cable charging and app setup; a solar panel does not promise uninterrupted power.",
    limits: "Advanced AI identification requires a subscription in the checked listing. Confirm current app, storage and renewal terms. Listing revisions disagree on resolution, so no resolution or battery-duration guarantee is made here.",
    returns: "Free 30-day refund/replacement observed; recheck eligibility.",
    keep: "A plain feeder or existing camera can meet bird-watching needs without another connected device. Do not buy solely for assumed free AI or unlimited solar operation.",
    sources: [{ name: "Birdfy Feeder 1 series original instructions", url: "https://cdn.shopify.com/s/files/1/0782/9346/7416/files/Birdfy_Feeder_User_Manual_EN_ES_FR.pdf?v=1750645796", note: "Current maker manual library identifies Feeder 1. Selected contents, charging and app pages read; no full 44-page manual or physical mounting test claimed." }],
  }),
  option({
    site: "smarthome", family: "indoor-air-quality-monitors", asin: "B07YY7BH2W",
    slug: "aranet4-home-co2-retailer-alternative",
    name: "Aranet4 HOME", brand: "Aranet",
    selection: "Aranet4 HOME B07YY7BH2W; not Aranet4 PRO or a multi-pollutant alarm",
    summary: "A focused NDIR CO₂ monitor for comparing occupied-room ventilation patterns.",
    conditions: "Choose this when CO₂ trends are the question. The maker also documents temperature, humidity and pressure, with Bluetooth app access; use an appropriate indoor location and the model's calibration guidance.",
    limits: "It does not measure particulate pollution or replace a carbon-monoxide alarm. A CO₂ reading alone cannot declare a room healthy, diagnose symptoms or validate the AQItech's many claimed channels.",
    returns: "Free 30-day refund/replacement observed; recheck eligibility.",
    keep: "Keep an adequate existing monitor. If the concern is smoke, carbon monoxide or another pollutant, choose the appropriate dedicated measurement or alarm instead.",
    sources: [
      { name: "Aranet4 HOME manufacturer specifications", url: "https://aranet.com/en/home/products/aranet4-home", note: "NDIR CO₂, temperature, relative humidity and pressure; Bluetooth, not a PM or CO safety alarm." },
      { name: "Aranet4 HOME original user manual", url: "https://aranet.com/downloads/aranet4-home-user-manual", note: "Indoor operating, placement and calibration conditions read; no independent measurement-accuracy test by Madabase." },
    ],
  }),
  option({
    site: "smarthome", family: "indoor-security-cameras", asin: "B09Y8TLP25",
    slug: "tapo-c210-single-camera-retailer-alternative",
    name: "Tapo C210 — single indoor camera", brand: "Tapo",
    selection: "C210 B09Y8TLP25, one camera; not the C210P2 two-pack",
    summary: "One indoor pan-and-tilt camera to compare before buying a four-camera bundle.",
    conditions: "Check a nearby power outlet, 2.4 GHz Wi-Fi coverage and a suitable private viewing location. The maker separates core viewing and local microSD recording from optional paid Tapo Care cloud features. A card is a separate purchase; match storage support to the supplied hardware version.",
    limits: "This is not a four-pack, 5 GHz or cellular camera. It does not guarantee coverage or replace supervision. Agree on household privacy and recording needs before adding a camera.",
    returns: "Free 30-day refund/replacement observed; recheck eligibility.",
    keep: "Keep a working camera that meets the task. If you only need a door-open event, a contact sensor can avoid indoor video recording.",
    sources: [{ name: "Tapo US C210 specifications and storage options", url: "https://us.store.tapo.com/products/tp-link-tapo-2k-pan-tilt-security-camera-night-vision-white-tapo-c210", note: "Manufacturer specifications distinguish 2.4 GHz, external power, local recording and optional cloud service. No room-coverage or privacy-performance test claimed." }],
  }),
  option({
    site: "smarthome", family: "diy-smart-alarm-kits", asin: "B07ZDTXJ93",
    slug: "ring-alarm-five-piece-second-gen-alternative",
    name: "Ring Alarm — 5-piece, 2nd Gen", brand: "Ring",
    selection: "Ring Alarm, 5-piece, 2nd Gen, Device Only B07ZDTXJ93; not Alarm Pro",
    summary: "A smaller documented alarm starter kit when its sensor coverage fits the actual openings.",
    conditions: "The listed kit has one base station, keypad, contact sensor, motion detector and range extender. Count the doors and rooms you need to cover; a five-piece starter is not equivalent to the unavailable 24-piece PGST kit. Check installation permission, network and power requirements.",
    limits: "Keypad control and paid app remote control are different decisions. Cellular backup and professional monitoring need compatible paid service, availability and any required permits; none is assumed included. This is not a smoke or CO detector.",
    returns: "Free 30-day refund/replacement observed; recheck eligibility.",
    keep: "Keep an adequate existing alarm. Compare the full sensor and service cost before changing systems; more pieces alone do not prove better coverage.",
    sources: [{ name: "Ring Alarm five-piece kit and service conditions", url: "https://ring.com/products/security-system-alarm-5", note: "Current official kit contents and paid remote-control, backup and monitoring conditions read. Fees, plan names and local availability must be checked at purchase." }],
  }),
];

export function merchant20AlternativeForGuide(site: SiteKey, slug: string) {
  return merchant20TaskAlternatives.find(({ family, product }) => product.site === site
    && ["buying-guide", "vs-alternatives", "compatibility-and-fit-guide"].some((role) => slug === `${family}-${role}`));
}
