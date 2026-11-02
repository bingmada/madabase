import type { Product } from "./types";

const updatedAt = "August 21, 2026";
const releaseCandidate = "product-expansion-100-pilot-01";
const amazonUrl = (asin: string) =>
  `https://www.amazon.com/dp/${asin}?tag=bingmada-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl`;

const softLaunch = {
  updatedAt,
  releaseCandidate,
  sitemapExcluded: true,
  discoveryExcluded: true,
} as const;

export const productExpansionPilot20260821Products: Product[] = [
  {
"purchaseCheck": "Confirm the received hardware revision before buying: the current V2 maker table lists 1/2.5/10 Gbps, not 5 Gbps or 100 Mbps. The retail package table names a different supply rating, so V2 power details are not assigned to unknown stock. Count the uplink within five ports. Keep adequate 2.5 GbE, or compare managed/SFP+ hardware for those separate needs.",

    ...softLaunch,
    updatedAt: "November 1, 2026",
    site: "network",
    slug: "trendnet-teg-s750-10gbe-switch",
    asin: "B09M7KSZB2",
    seoTitle: "TRENDnet TEG-S750 Guide: 5-Port 10GbE Without a Fan",
    evidenceMode: "official-spec",
    researchNote:
      "November 1 selected US10001 identity/offer state and the named manufacturer product, specification or support sections reviewed. This is documented purchase research, not a physical speed, installation, security, alert, comfort or reliability test. Applicable manual scope and remaining revision/service conditions are explicit; no whole-manual claim is implied.",
    name: "TRENDnet TEG-S750 5-Port 10G Switch",
    brand: "TRENDnet",
    category: "wired",
    image: "/images/affiliate/network-trendnet-teg-s750-10gbe-switch-realistic.webp",
    imageAlt: "Editorial home network shelf with a compact fanless five-port multi-gig Ethernet switch",
    summary:
      "A revision-aware five-port RJ45 switch guide for a documented1/2.5/10 GbE NAS or workstation path, with fanless design, port budgeting and exact-stock checks.",
    verdict:
      "Compare TEG-S750 when a documented 1/2.5/10 GbE endpoint path and five total ports fit the job. Keep adequate 2.5 GbE hardware, or choose separately documented managed or SFP+ equipment when those functions or media are needed. The retail hardware revision remains a purchase check.",
    whyItMatters:
      "Five physical ports become four usable device ports after one is assigned upstream. The purchase only pays off when the NAS, workstation, router, cabling, and repeated transfers form an end-to-end multi-gig path.",
    bestFor: "A quiet five-port RJ45 10GbE island around a NAS and workstation",
    priceBand: "$$$",
    rating: 0,
    scores: [],
    pros: [
  "Current V2 table lists five RJ45 ports for 1/2.5/10 Gbps",
  "Fanless metal chassis avoids switch-fan noise beside a desk",
  "100 Gbps switching capacity fits simultaneous full-duplex 10G links"
],
    cons: [
  "No VLAN, link aggregation, port mirroring, or managed controls",
  "Five ports leave limited expansion after the router or uplink is connected",
  "Match the received revision’s supply, ventilation and operating conditions; no thermal advantage over another medium was tested."
],
    specs: {
  "ASIN": "B09M7KSZB2",
  "Model": "TEG-S750; received hardware revision not established by this offer",
  "Ports": "Current V2 table: five 1/2.5/10 Gbps RJ45 ports; 5 Gbps and 100 Mbps not established",
  "Cooling": "Fanless metal enclosure",
  "Switching capacity": "Reviewed current V2 only: 100 Gbps",
  "Forwarding rate": "Reviewed current V2 only: 74.4Mpps listed in the Version V2 datasheet",
  "Jumbo frame": "Reviewed current V2 only: 12KB",
  "Power": "Match the supplied label: retail table says 12 V / 1.5 A, current V2 maker table 12 V / 3 A; no cross-revision substitution",
  "Dimensions": "Reviewed current V2 only: About 7 × 5.7 × 1.3 inches"
},
    evidence: [
      "Confirm ASIN B09M7KSZB2, TEG-S750, seller, and Version V2 hardware",
      "Count four downstream device ports after assigning one port to the router or aggregation uplink",
      "Verify 10GbE NICs and cable length at both ends; a 1GbE endpoint remains a 1GbE path",
      "Allow ventilation around the fanless metal case instead of stacking it under warm equipment",
      "Choose managed switching if VLANs, LAG, monitoring, or access controls are requirements",
    ],
    editorialSections: [
  {
    "heading": "Start with the fifth cable, not the first",
    "body": "The port count is the real constraint. One connection usually leads to the router or another switch, leaving four for a NAS, workstation, access point, and one spare. Draw that complete port budget before paying for five 10G-capable jacks."
  },
  {
    "heading": "Fanless does not mean heatless",
    "body": "The metal chassis is the cooling surface. Keep air around it and avoid a sealed cabinet or a stack of warm power supplies. Stable negotiated speed matters more than hiding the switch in the smallest possible space."
  },
  {
    "heading": "Unmanaged is a feature only when simplicity is the goal",
    "body": "TEG-S750 is plug-and-play because it omits VLAN, LAG, port-level monitoring, and other managed controls. That is useful for a flat trusted LAN, but it is the wrong trade when segmentation or troubleshooting visibility is part of the plan."
  },
  {
    "heading": "Who should skip it",
    "body": "Skip it when gigabit clears the workload, every endpoint stops at 2.5 GbE, more than four downstream ports are needed, or SFP+ DAC and fiber are already the preferred 10G medium."
  },
  {
    "heading": "Keep the hardware version separate from the ASIN",
    "body": "The current V2 manufacturer table lists 1, 2.5 and 10 Gbps. It does not establish5 Gbps or 100 Mbps for this purchase. The selected retail component table lists a 12 V / 1.5 A supply while the V2 page lists 12 V / 3 A. Ask for the exact hardware label and supplied instructions; do not replace a supply from these web values or assume all current stock is V2."
  }
],
    alternatives: [
      "Choose a five-port 2.5GbE switch when internet, NAS, and clients do not exceed 2.5Gbps.",
      "Choose an SFP+ switch when DAC or fiber better fits heat, distance, and existing interfaces.",
      "Choose a managed switch when VLANs, LAG, monitoring, or port policies are required.",
    ],
    compareSlugs: ["tp-link-tl-sg105-m2-2-5g-switch", "trendnet-teg-s380-2-5g-switch"],
    sources: [
  {
    "name": "TRENDnet TEG-S750 Version V2 product page",
    "url": "https://www.trendnet.com/products/10g-switch/5-port-10g-switch-TEG-S750-v2.0R",
    "note": "Official current-version port speeds, fanless design, switching performance, cabling, dimensions, and feature boundaries."
  },
  {
    "name": "TRENDnet TEG-S750 support",
    "url": "https://www.trendnet.com/support/support-detail.asp?prod=115_TEG-S750",
    "note": "Official Version V2 datasheet, downloads, installation material, and hardware-version selector."
  },
  {
    "name": "Exact selected US retail identity and offer observation",
    "url": "https://www.amazon.com/dp/B09M7KSZB2",
    "note": "November 1, 2026 US10001 public selection checked. New primary selection and expanded return terms observed; point-in-time seller/delivery/conditions, not a future availability or warranty promise."
  }
],
    offers: [
      {
        merchant: "Amazon US",
        url: amazonUrl("B09M7KSZB2"),
        label: "Check TEG-S750 price on Amazon",
        priceNote: "Confirm ASIN B09M7KSZB2, TEG-S750 Version V2, US power adapter, seller, delivery, and return window.",
      },
    ],
  },
  {
    ...softLaunch,
    updatedAt: "November 1, 2026",
    site: "smarthome",
    slug: "tapo-s505d-matter-smart-dimmer",
    asin: "B0C2B8SP3W",
    seoTitle: "Tapo S505D Guide: Matter Dimmer, Neutral Wire & Bulb Fit",
    evidenceMode: "official-spec",
    researchNote:
      "Research-based guide; no hands-on, installed-fit, durability, comfort or performance test. November 1 exact merchant identity checks are separate from manufacturer specifications and any earlier manual review. Recheck the actual supplied model, accessories and current seller terms.",
    name: "Tapo S505D Matter Smart Dimmer Switch",
    brand: "Tapo",
    category: "automation",
    image: "/images/affiliate/smarthome-tapo-s505d-matter-dimmer-realistic.webp",
    imageAlt: "Editorial residential wall scene with a modern single-pole smart dimmer and a softly lit lamp",
    summary:
      "A Matter-over-Wi-Fi single-pole dimmer for buyers who have a neutral wire, compatible TRIAC-dimmable lighting, and a clear controller plan across Apple Home, Alexa, Google Home, or SmartThings.",
    verdict:
      "S505D is compelling for a neutral-equipped single-pole circuit where Matter interoperability and local wall control matter. It is not the right fix for a wired three-way circuit, an incompatible LED driver, or a home that expects Matter over Thread.",
    whyItMatters:
      "The Matter logo does not answer the electrical questions. Neutral, line, load, ground, bulb technology, wattage, dimming range, and single-pole topology decide whether the installation will work without flicker or unsafe improvisation.",
    bestFor: "A neutral-equipped single-pole dimmable lighting circuit that needs Matter over Wi-Fi",
    priceBand: "$",
    rating: 0,
    scores: [],
    pros: [
      "Matter support across major smart-home platforms",
      "Physical on/off and brightness controls remain available at the wall",
      "Tapo lists local LAN control plus schedules, scenes, and fade behavior",
    ],
    cons: [
      "Requires a neutral wire and is designed for single-pole wiring",
      "Matter runs over 2.4GHz Wi-Fi, not Thread",
      "LED compatibility and low-end dimming behavior depend on the exact bulbs or driver",
    ],
    specs: {
      ASIN: "B0C2B8SP3W",
      Model: "Tapo S505D (US); confirm one-pack versus two-pack",
      Protocol: "Matter over 2.4GHz Wi-Fi; Bluetooth used for setup",
      Wiring: "Single-pole; neutral, line, load, and ground required",
      Dimming: "Leading-edge / TRIAC phase-cut",
      Load: "Up to 150W dimmable LED or 300W incandescent/halogen",
      Platforms: "Apple Home, Alexa, Google Assistant, Samsung SmartThings",
      Dimensions: "5.04 × 3.33 × 1.77 inches",
    },
    evidence: [
      "Confirm ASIN B0C2B8SP3W, S505D, pack quantity, seller, and US electrical version",
      "Verify a neutral wire and single-pole topology before ordering; do not infer wiring from wall-plate shape",
      "Check the exact bulb or fixture driver for TRIAC dimming and keep the total load within the listed limit",
      "Use a qualified electrician when conductor identity, box fill, grounding, or local code is uncertain",
      "Confirm that the chosen ecosystem has a compatible Matter controller and suitable 2.4GHz Wi-Fi coverage",
    ],
    editorialSections: [
      {
        heading: "Matter does not remove the controller plan",
        body: "S505D can join supported Matter ecosystems, but the household still needs a compatible controller and dependable local network. Decide which platform owns the device, automations, and household access before installation instead of pairing it everywhere at once.",
      },
      {
        heading: "This is Matter over Wi-Fi, not Matter over Thread",
        body: "The switch uses 2.4GHz Wi-Fi for normal networking. A Thread border router is not the relevant requirement, but Wi-Fi coverage, multicast behavior, and the chosen Matter controller still are.",
      },
      {
        heading: "A smart button is not wired three-way compatibility",
        body: "Tapo describes S505D as single-pole. A separate Tapo button and hub can create an automation-based secondary control point, but that is different from replacing both switches on an existing wired three-way circuit.",
      },
      {
        heading: "Who should skip it",
        body: "Skip it when the box lacks neutral, the circuit is wired three-way, the fixture is not dimmable, the load exceeds the rating, or a conventional dimmer already solves the problem without adding controller and network dependencies.",
      },
    ],
    alternatives: [
      "Choose a switch certified for the exact wired three-way topology when both wall locations must remain conventional controls.",
      "Choose smart bulbs when per-bulb color control matters and the wall switch can remain continuously powered.",
      "Keep a conventional dimmer when app control and automations add no useful routine.",
    ],
    sources: [
  {
    "name": "Tapo S505D product and specifications",
    "url": "https://www.tapo.com/us/product/smart-switch/tapo-s505d/",
    "note": "Official Matter, network, load, dimming, wiring, dimensions, platform, and package information."
  },
  {
    "name": "Tapo S505D user guide",
    "url": "https://static.tp-link.com/upload/manual/2023/202305/20230517/1910013404_Tapo%20S505D%28US%29_UG_V1.pdf",
    "note": "Official installation, Matter onboarding, control, reset, and operating guidance."
  },
  {
    "name": "Exact US Amazon selection B0C2B8SP3W",
    "url": "https://www.amazon.com/dp/B0C2B8SP3W",
    "note": "November 1, 2026, US 10001: exact selection, New offer and named seller observed. Visible return label recorded; detailed eligibility and exceptions were not fully expanded for this selection. Recheck condition, package and live terms."
  }
],
    offers: [
      {
        merchant: "Amazon US",
        url: amazonUrl("B0C2B8SP3W"),
        label: "Check Tapo S505D price on Amazon",
        priceNote: "Confirm ASIN B0C2B8SP3W, US S505D Dimmer / 1-Pack, seller, wiring version, delivery, and returns.",
      },
    ],

"purchaseCheck": "Select US S505D Dimmer / 1-Pack B0C2B8SP3W, not a three-way switch. Requires neutral-equipped single-pole wiring, 120 V / 60 Hz and compatible TRIAC-dimmable loads: up to 150 W LED or 300 W incandescent/halogen. Matter uses 2.4 GHz Wi-Fi, not Thread; confirm the chosen platform's Matter controller. Use a qualified electrician for uncertain wiring.",
"amazonTitle": "Tapo S505D US · Dimmer / 1-Pack",
},
  {
    ...softLaunch,
    updatedAt: "August 21, 2026",
    site: "homeoffice",
    slug: "satechi-dual-vertical-laptop-stand",
    purchaseAlternatives: ["omoton-black-dual-vertical-stand-retailer-alternative"],
    asin: "B09WY2RLQG",
    seoTitle: "Satechi Dual Vertical Laptop Stand Guide: Will Both Slots Fit?",
    evidenceMode: "official-spec",
    researchNote:
      "This fit guide compares Satechi's product and compatibility guidance with the exact retailer listing. Their slot-width claims conflict; measure both closed devices with their cases and confirm the supplied stand before assuming fit.",
    name: "Satechi Dual Vertical Laptop Stand",
    brand: "Satechi",
    category: "ergonomics",
    image: "/images/affiliate/homeoffice-satechi-dual-vertical-stand-realistic.webp",
    imageAlt: "Editorial compact desk with two closed laptops stored in a sturdy dual-slot vertical stand",
    summary:
      "A fixed dual-slot aluminum stand with unequal openings. The manufacturer's 12/20 mm slot claims conflict with the linked listing's 0.4/0.6-inch claims, so exact device fit remains unresolved.",
    verdict:
      "The exact purchase is paused because the manufacturer's and retailer's slot widths conflict. Confirm the supplied ST-ADVSM openings against both devices and cases before choosing it. Keep your present storage if it already provides enough space.",
    whyItMatters:
      "The product name promises two devices, not two arbitrary laptops. A case, rubber foot, tapered lid, camera bump, or thick workstation can turn a nominal fit into pressure on the device or an unstable perch.",
    bestFor: "Two closed devices after both unequal slot widths and case fit are confirmed",
    priceBand: "$",
    rating: 4.6,
    scores: [
      { label: "Desk space", value: 9 },
      { label: "Build", value: 8 },
      { label: "Case flexibility", value: 5 },
    ],
    pros: [
      "Stores two devices vertically in a compact footprint",
      "Aluminum body and non-slip protective surfaces suit a permanent desk setup",
      "Open vertical storage can keep closed devices accessible to dock and monitor cables",
    ],
    cons: [
      "Fixed unequal slots require real thickness measurements",
      "A thick protective case can make a supported laptop too wide",
      "Closed-lid use still needs a power, display, sleep, and thermal plan",
    ],
    specs: {
      "ASIN": "B09WY2RLQG",
      "Model": "ST-ADVSM, Space Gray",
      "Capacity": "Two vertically stored devices",
      "Front slot": "Manufacturer: approximately 12 mm; linked listing: 0.4 in (about 10.2 mm). Unresolved conflict.",
      "Rear slot": "Manufacturer: approximately 20 mm; linked listing: 0.6 in (about 15.2 mm). Unresolved conflict.",
      "Footprint": "Manufacturer wording: 5×3.5 in, with 6 in total length; verify actual clearance rather than treating these as one rectangular footprint.",
      "Material": "Stress-resistant aluminum with protective non-slip pads",
      "Warranty": "Satechi lists a two-year warranty on the current US page"
    },
    evidence: [
      "Confirm ASIN B09WY2RLQG and model ST-ADVSM rather than a single-slot or adjustable Satechi stand",
      "Measure both closed devices at their thickest point, including feet, lid contour, and any case",
      "Confirm the supplied front and rear openings; do not use 12/20 mm as a guaranteed fit for the linked listing",
      "Test dock cables, power leads, wake behavior, and closed-lid thermals before making the setup permanent",
      "Keep the return packaging until both devices sit without pressure, wobble, or cable strain",
    ],
    editorialSections: [
      {
        "heading": "The slots are not interchangeable",
        "body": "Satechi's current FAQ lists roughly 12 mm at the front and 20 mm at the rear. The linked ASIN's bullets and dimension image instead show 0.4 and 0.6 inches, about 10.2 and 15.2 mm. These are different fit limits, not interchangeable rounding. The current listing identifies ST-ADVSM and UPC 879961007058, but that identity match does not resolve the dimensions. Keep the exact purchase paused until the supplied openings are confirmed; measure each closed device with its case and never force it into a slot."
      },
      {
        "heading": "Measure cases as hardware",
        "body": "A snap-on shell, rubber foot, camera housing, or tapered edge changes the widest cross-section. Measure the device exactly as it will be stored; do not rely on the bare chassis specification if the case will stay installed."
      },
      {
        "heading": "Use the model-specific compatibility list",
        "body": "Satechi’s dedicated ST-ADVSM support page lists Surface Pro 9 as incompatible, even though the generic product-page list includes Surface Pro 9. Treat that conflict as a reason not to assume fit. Check the specific support list and measure the device with its case; a general laptop or tablet label is insufficient."
      },
      {
        "heading": "Vertical storage is only half of a docked workflow",
        "body": "Plan power, display, peripherals, wake behavior, and cable direction. The stand saves surface area, but a cable that bends sharply against the desk or a laptop that sleeps unpredictably can erase the convenience."
      },
      {
        "heading": "Who should skip it",
        "body": "Skip it for two thick workstations, frequently changing devices, bulky cases or a setup that needs adjustable slots. A wider adjustable stand offers more fit flexibility. If your present storage leaves enough room and lets the laptop operate as intended, no new stand is needed."
      }
    ],
    alternatives: [
      "Choose an adjustable dual-slot stand when devices or cases change often.",
      "Choose a flat riser when the laptop display remains part of the workstation.",
      "Use a padded shelf when vertical cable strain or top-heavy devices make upright storage unstable.",
    ],
    sources: [
      {
        name: "Satechi Dual Vertical Laptop Stand product page",
        url: "https://satechi.com/products/satechi-dual-vertical-laptop-stand",
        note: "Official model, material, two-slot design, slot widths, footprint, case guidance, compatibility, and warranty information.",
      },
      {
        name: "Satechi device compatibility guidance",
        url: "https://support.satechi.com/hc/en-us/articles/30289399353499-Device-Compatibility-Dual-Vertical-Laptop-Stand-ST-ADVSM",
        note: "Official ST-ADVSM compatibility reference; buyers should still measure their exact device and case.",
      },
      {
        name: "OMOTON LD02 dual-slot adjustment and fit",
        url: "https://omoton.com/products/ld02",
        note: "Primary reference for the independently named OMOTON alternative: two separately adjustable slots and 14–42 mm device thickness. No Satechi specifications or universal fit are transferred.",
      },
      {
        name: "Amazon OMOTON Black dual-slot B078W3QSZY",
        url: "https://www.amazon.com/dp/B078W3QSZY",
        note: "Current Black two-slot selection, dated New seller observation and expanded return terms checked October 30, 2026. Recheck the selected offer before checkout.",
      },
    ],
    offers: [
      {
        merchant: "Amazon US",
        url: amazonUrl("B09WY2RLQG"),
        label: "Check Satechi stand price on Amazon",
        priceNote: "Confirm ASIN B09WY2RLQG, ST-ADVSM, Space Gray, seller, stock, delivery, and return terms.",
      },
    ],
  },
  {
    ...softLaunch,
    updatedAt: "October 31, 2026",
    site: "baby",
    slug: "medela-harmony-manual-breast-pump",
    asin: "B08H9QJVNZ",
    seoTitle: "Medela Harmony Manual Pump Guide: Backup, Shield Fit & Cleaning",
    evidenceMode: "official-spec",
    researchNote:
      "Current Medela US product/FAQ text, the applicable English pages 1–15 of both linked Harmony revisions and all shared foldout diagrams in the current retailer-linked file were read. These 72-page multilingual files are not claimed as 72 pages of English, and both carry non-USA-distribution notices. October 31 selected single-pump identity and expanded US returns observed; selected New, individual fit, clinical output and received US instructions remain unverified.",
    name: "Medela Harmony Manual Breast Pump",
    brand: "Medela",
    category: "feeding",
    image: "/images/affiliate/baby-medela-harmony-manual-pump-realistic.webp",
    imageAlt: "Editorial nursery still life with an assembled compact manual breast pump and travel pouch",
    summary:
      "A battery-free Harmony single-pump option, model 101041149, with a two-sided handle and a listed 24 mm Flex shield. Match the shield and supplied instructions; the old mixed-accessory bundle is not the buying option.",
    verdict:
      "Harmony is easiest to justify as a quiet occasional or backup pump. Frequent exclusive pumping, persistent pain, low output, or a mismatched shield size calls for a more individualized plan rather than simply pumping longer by hand.",
    whyItMatters:
      "A manual pump removes charging and motor failure from the routine, but it shifts work to the hand and makes assembly, seal quality, shield fit, membrane condition, cleaning, and milk-storage timing especially important.",
    bestFor: "Occasional pumping, travel, or a compact backup to an electric pump",
    priceBand: "$",
    rating: 0,
    scores: [],
    pros: [
      "No batteries, charging, tubing, or motor",
      "Two-sided handle supports stimulation and expression rhythms",
      "Small parts kit is practical for a travel or backup bag",
    ],
    cons: [
      "Hand effort and single-side pumping can make frequent sessions inefficient",
      "The included shield size is not automatically the right fit for every user",
      "Small membrane, valve, seal, and O-ring condition can affect suction",
    ],
    specs: {
  "ASIN": "B08H9QJVNZ; current single-pump selection",
  "Model": "101041149, Harmony Manual Breast Pump, 24 mm PersonalFit Flex shield in the selected listing",
  "Operation": "Manual, single-side, two-phase handle",
  "System": "Closed system",
  "Weight": "Medela lists 105g for the pump",
  "Bottle": "150mL bottle with lid and stand listed",
  "Included": "Handle, diaphragm, connector, valve, membrane plus spare, shield, bottle, lid, stand",
  "Power": "None required",
  "Historical bundle": "B0C2YYKKZF included electric-pump accessories whose description excludes Harmony; not the current purchase link."
},
    evidence: [
      "Confirm ASIN B0C2YYKKZF, current Harmony bundle, shield size, seller, and included parts",
      "Check shield fit and comfort rather than assuming the included size is correct",
      "Inspect the membrane, valve, diaphragm, O-ring, and assembly when suction changes",
      "Follow Medela's current cleaning, sanitizing, drying, and milk-handling instructions",
      "Seek qualified lactation or healthcare support for persistent pain, injury, or feeding and supply concerns",
    ],
    editorialSections: [
  {
    "heading": "Choose the single pump rather than the mixed-accessory bundle",
    "body": "The current purchase option is B08H9QJVNZ, model 101041149. The former B0C2YYKKZF bundle combined a Harmony pump with PersonalFit Flex electric-pump membranes and connectors; those connector instructions explicitly exclude Harmony. Extra parts with the same brand name are not automatically useful spares for this manual pump."
  },
  {
    "heading": "Treat it as a backup system, not only a pump",
    "body": "Keep the complete clean parts set, bottle, cap, spare membrane, storage supplies, and current instructions together. A compact pump is not useful on a trip if one small seal or lid is missing."
  },
  {
    "heading": "Shield fit controls comfort before technique does",
    "body": "The included PersonalFit Flex shield will not suit every body. Centering, freedom of movement, pressure, pain, and tissue response matter more than matching a generic size chart. Stop and get help when pumping hurts."
  },
  {
    "heading": "Small parts are the suction path",
    "body": "A loose connector, damaged membrane, worn valve, displaced diaphragm, or compromised O-ring can reduce suction. Reassemble against the current manual and inspect parts before compensating with more hand force."
  },
  {
    "heading": "Who should skip it",
    "body": "Skip it as the primary solution for frequent double pumping, unresolved pain, hand or wrist limitations, or a routine where time efficiency is critical. A supported electric or wearable plan may fit better after professional guidance."
  },
  {
    "heading": "Match the instructions supplied with the pump",
    "body": "The maker page and retailer both link multilingual Harmony instructions covering the Flex shield, two-sided handle, assembly and cleaning. Their reviewed revisions carry a non-USA-distribution notice, so they do not establish the exact US instructions, warranty or package contents received. Use the applicable supplied instructions; the included 24 mm shield is not a fit assessment or a promise of comfortable pumping."
  }
],
    alternatives: [
      "Choose a double electric pump when frequent sessions and time efficiency dominate.",
      "Choose a wearable pump when hands-free mobility matters and its fit and cleaning routine are acceptable.",
      "Use hand expression when taught and appropriate as an additional no-equipment backup skill.",
    ],
    sources: [
  {
    "name": "Medela Harmony manual breast pump",
    "url": "https://www.medela.com/en-us/breastfeeding-pumping/products/pumps/manual/harmony-manual-breast-pump",
    "note": "Official pump weight, handle, shield, closed-system, included-parts, cleaning, and intended-use information."
  },
  {
    "name": "Medela currently linked Harmony instructions",
    "url": "https://www.medela.com/010-products/010-pumps/030-manual/010-harmony---manual-breast-pump/pdf-downloads/harmony-manual-ifu.pdf",
    "note": "English pages 3–15, cover and shared foldout diagrams read; 2021/B colophon says not intended for distribution in USA. Not proof of supplied US revision."
  },
  {
    "name": "Harmony single-pump selected Amazon listing",
    "url": "https://www.amazon.com/dp/B08H9QJVNZ",
    "note": "October 31 US ZIP 10001: model 101041149, UPC 020451411491, Amazon.com selected offer and expanded 90-day returns observed. Separate lower-priced seller not mixed."
  }
],
    offers: [
  {
    "merchant": "Amazon US",
    "url": "https://www.amazon.com/dp/B08H9QJVNZ?tag=madababy-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl",
    "label": "Check Harmony single pump on Amazon",
    "priceNote": "Select Harmony Manual Breast Pump, model 101041149; confirm shield size, package, condition, seller and returns."
  }
],

"amazonDetailUrl": "https://www.amazon.com/dp/B08H9QJVNZ",
"amazonTitle": "Medela Harmony Manual Breast Pump — 101041149, 24 mm Flex Shield",
"purchaseCheck": "Choose Harmony Manual Breast Pump B08H9QJVNZ, model 101041149, rather than a milk collector, colostrum kit or the old mixed electric-parts bundle. Check the required shield size, supplied parts, applicable instructions, current condition, seller, delivery and returns.",
},
  {
    ...softLaunch,
    updatedAt: "November 1, 2026",
    site: "pet",
    slug: "surefeed-microchip-pet-feeder",
    asin: "B00O0UIPTY",
    seoTitle: "SureFeed Microchip Feeder: Fit & Care",
    evidenceMode: "official-spec",
    researchNote:
      "November 1: current non-Connect product/support and serial 0400000+ manual reviewed. Complete English instructions and diagrams on PDF 1–20 read visually, with English compliance page21 read as text; translated duplicates not reviewed. Received serial applicability must match. Standard MPF001 selected new Amazon.com offer observed. No pet, exclusion, food-temperature or lid test was performed.",
    name: "SureFeed Microchip Pet Feeder",
    brand: "Sure Petcare",
    category: "feeding",
    image: "/images/affiliate/pet-surefeed-microchip-feeder-realistic.webp",
    imageAlt: "Editorial two-cat feeding area with one cat using a covered selective-access feeder",
    summary:
      "An indoor selective-access feeder that opens for a registered implanted microchip or included SureFlap RFID collar tag, helping protect wet or dry food in multi-pet homes without requiring an app or hub.",
    verdict:
      "SureFeed solves a real problem when one pet steals food or a specific pet needs a separate diet. It does not weigh meals, dispense schedules, monitor intake, or guarantee that a timid pet will accept the moving lid without gradual training.",
    whyItMatters:
      "Access control protects a bowl; it does not replace portion planning or observation. The feeder must recognize the intended pet, exclude the others, fit the eating posture, stay clean, and remain approachable through the complete lid movement.",
    bestFor: "Keeping one cat's wet or dry food separate in a multi-pet home",
    priceBand: "$$",
    rating: 0,
    scores: [],
    pros: [
      "Reads common implanted microchips and the included SureFlap RFID collar tag",
      "Supports wet or dry food with a sealed closing lid",
      "Training mode introduces lid movement gradually without an app or hub",
    ],
    cons: [
      "Does not dispense food, schedule meals, weigh portions, or log intake",
      "Requires four C batteries, which are not included",
      "The powered feeder body cannot be submerged and the pet may need patient training",
    ],
    specs: {
  "ASIN": "B00O0UIPTY",
  "Model": "SureFeed Microchip Pet Feeder; non-Connect version",
  "Access": "Compatible implanted microchip or included SureFlap RFID collar tag",
  "Memory": "Up to 32 pet identities",
  "Food": "Wet or dry; 400mL bowl capacity or two wet-food pouches listed",
  "Power": "4× C-cell batteries, not included; about six months listed battery life",
  "Dimensions": "Manufacturer overall230W×200H×320Dmm; opening210W×155Hmm. Measure the individual pet’s comfortable entry.",
  "Warranty": "Three years listed by Sure Petcare"
},
    evidence: [
      "Confirm ASIN B00O0UIPTY and the non-Connect Microchip Pet Feeder rather than the hub-dependent Connect version",
      "Check the pet's microchip number with Sure Petcare or plan to use the included collar tag",
      "Measure the feeder opening, floor footprint, and the pet's comfortable eating posture",
      "Use training mode gradually and keep a supervised fallback feeding routine until the pet is confident",
      "Wash bowl inserts as directed, hand-wash the lid and mat, and never submerge the powered feeder body",
    ],
    editorialSections: [
  {
    "heading": "Microchip access is not portion control",
    "body": "The feeder opens and closes around a prepared bowl. It does not dispense a measured ration or report how much was eaten. Weigh or measure food separately and continue monitoring the pet's intake and condition."
  },
  {
    "heading": "Choose non-Connect versus Connect deliberately",
    "body": "This page covers the non-Connect Microchip Pet Feeder. It works without an app or hub. Buyers who want feeding-history data need to compare the Connect model and its required hub rather than assuming this ASIN includes connectivity."
  },
  {
    "heading": "Training is part of the purchase",
    "body": "Sure Petcare provides staged training so the lid moves progressively. Do not rush a timid pet or remove its familiar feeding option before it is comfortable entering, eating, and leaving through the complete motion cycle."
  },
  {
    "heading": "Who should skip it",
    "body": "Skip it when every pet shares food safely, scheduled dispensing is the main need, the pet will not tolerate the opening, or the household cannot maintain batteries and the powered base's cleaning restrictions."
  },
  {
    "heading": "Keep food holding and cleaning separate",
    "body": "The manual prohibits placing the feeder in a fridge or adding ice packs. A sealed bowl does not establish a safe food-holding time. Wash detached bowls, mat and lid as directed; the reviewed instructions say hand wash and no bowl dishwasher/microwave. Wipe the powered body without immersing it. Match the received serial’s manual and continue monitoring food access and intake."
  }
],
    alternatives: [
      "Choose an RFID collar feeder with scheduling when timed dry-food portions and access control are both required.",
      "Choose the SureFeed Connect model only when app data is worth the required hub and added setup.",
      "Use supervised separate-room feeding when motion, batteries, or feeder footprint create more problems than they solve.",
    ],
    compareSlugs: ["petlibro-one-rfid-smart-feeder", "petlibro-granary-automatic-cat-feeder"],
    sources: [
  {
    "name": "SureFeed Microchip Pet Feeder product page",
    "url": "https://www.surepetcare.com/en-us/pet-feeder/microchip-pet-feeder",
    "note": "Official access method, identity capacity, food, bowl, battery, warranty, training, and dimensions."
  },
  {
    "name": "SureFeed Microchip Pet Feeder support",
    "url": "https://www.surepetcare.com/en-eu/support/microchip-pet-feeder",
    "note": "Official setup, training, dimensions, manuals, battery, and troubleshooting material."
  },
  {
    "name": "SureFeed feeder cleaning guide",
    "url": "https://www.surepetcare.com/en-us/advice-news/how-to-clean-your-surefeed-microchip-pet-feeder-and-microchip-pet-feeder-connect",
    "note": "Official bowl, lid, mat, powered-body, drying, indoor-use, and dishwasher restrictions."
  },
  {
    "name": "November 1 exact US retailer observation",
    "url": "https://www.amazon.com/dp/B00O0UIPTY",
    "note": "Selected US 10001 listing checked November 1. Match the exact model, selected condition, included kit, seller, delivery and return terms again before ordering; this is not physical product testing."
  },
  {
    "name": "SureFeed non-Connect serial 0400000+ original manual",
    "url": "https://www.surepetcare.com/surepetcare/filestream/file-to-stream?token=1915-6a3fecd994da023a",
    "note": "English instructions/figures onPDF 1–20 and compliance text 21 reviewed. Other serial range has a separate manual; no universal exclusion, refrigeration or food-safety guarantee."
  }
],
    offers: [
      {
        merchant: "Amazon US",
        url: amazonUrl("B00O0UIPTY"),
        label: "Check SureFeed feeder price on Amazon",
        priceNote: "Confirm ASIN B00O0UIPTY, non-Connect model, included bowls and collar tag, seller, delivery, and returns.",
      },
    ],

    "purchaseCheck": "Match Standard MPF001, chip/tag compatibility, opening fit and gradual training. Confirm serial-matched care, bowls and selected New terms. This covers a prepared bowl; it does not schedule, refrigerate or measure meals. Keep supervised feeding if motion or access fit fails.",
  },
];
