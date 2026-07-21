import type { Guide, Product, Roundup } from "./types";

const updatedAt = "July 21, 2026";
const amazonUrl = (asin: string) =>
  `https://www.amazon.com/dp/${asin}?tag=bingmada-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl`;

export const networkUpsProducts: Product[] = [
  {
    site: "network",
    slug: "apc-back-ups-router-modem-bundle",
    asin: "B085JJZDFK",
    amazonTitle: "APC Back-UPS 850VA, 450W, BE850G2",
    seoTitle: "APC BE850G2 Review Guide: Router, ONT and NAS Backup",
    updatedAt,
    evidenceMode: "official-spec",
    researchNote:
      "We have not runtime-tested this UPS. This page uses APC's current BE850G2 specifications and the exact Amazon listing identity. Runtime depends on the measured load, battery condition, ambient temperature, and outage pattern.",
    name: "APC BE850G2 Back-UPS 850VA",
    brand: "APC",
    category: "backup",
    image: "/images/affiliate/network-router-ups-editorial-realistic.webp",
    summary:
      "A model-specific guide to the APC BE850G2 for an ONT, modem, router, switch, or small NAS, with six battery-backed outlets, three surge-only outlets, USB charging, replacement-battery planning, and runtime caveats.",
    verdict:
      "BE850G2 is the strongest fit in this group when the network shelf includes several power bricks or a small NAS and 450W of output headroom is useful. Choose a smaller unit for a low-draw ONT and router, and do not infer hours of runtime from the 850VA label.",
    whyItMatters:
      "The old page pointed to a changing bundle instead of one UPS. The rebuilt page pins the exact BE850G2 identity so outlet count, battery path, and checkout selection can be verified before money changes hands.",
    bestFor: "A fuller network shelf with ONT, router, switch and optional small NAS",
    priceBand: "$$",
    rating: 4.5,
    scores: [
      { label: "Outlet flexibility", value: 9 },
      { label: "Network headroom", value: 9 },
      { label: "Compact placement", value: 6 },
    ],
    pros: [
      "850VA and 450W official output rating",
      "Six battery-plus-surge outlets and three surge-only outlets",
      "APC lists a replaceable RBC17 battery path and two USB charging ports",
    ],
    cons: [
      "Larger and usually more expensive than a low-load router shelf needs",
      "VA and watt ratings do not state runtime at a home's actual load",
      "Wide power bricks can still block adjacent outlets",
    ],
    specs: {
      ASIN: "B085JJZDFK",
      Model: "BE850G2",
      Capacity: "850VA / 450W",
      "Battery-backed outlets": "6",
      "Surge-only outlets": "3",
      USB: "2 charging ports listed",
      Battery: "APC RBC17 replacement battery listed",
      Topology: "Standby Back-UPS",
    },
    evidence: [
      "Confirm ASIN B085JJZDFK and model BE850G2 rather than a bundle or another 850VA chassis",
      "Measure the combined ONT, modem, router, switch, mesh node, and NAS load before estimating runtime",
      "Reserve battery-backed outlets for the required internet path; use surge-only outlets for nonessential loads",
      "Check power-brick spacing, alarm placement, RBC17 availability, seller, stock, and return terms",
      "Test a controlled power loss after setup and repeat self-tests as the battery ages",
    ],
    editorialSections: [
      {
        heading: "The exact model is the first correction",
        body: "This URL previously described a vague two-UPS bundle. It now covers the BE850G2 only. Confirm the model and ASIN at checkout because BE850G2, BE850M2, BR-series units, and retailer bundles do not share the same outlet layout or battery path.",
      },
      {
        heading: "Who should buy it",
        body: "Choose BE850G2 when the protected chain includes several small devices, a switch, or a modest NAS and nine total outlets reduce power-strip clutter. Its larger output rating is headroom, not a promise that every connected device belongs on battery backup.",
      },
      {
        heading: "Who should skip it",
        body: "Skip it when only an ONT and router need protection, the shelf cannot fit the chassis, or the ISP's neighborhood equipment immediately fails during outages. A BE600M1 or compact SL700U may fit a smaller chain better.",
      },
      {
        heading: "Runtime needs a load-specific check",
        body: "Add the measured watts for every required device, then use the manufacturer's runtime information at a comparable load. Do not extrapolate a router result from a half-load runtime number. Battery age, temperature, repeated outages, and charging state all move the result.",
      },
      {
        heading: "Battery ownership is part of the price",
        body: "APC lists RBC17 as the replacement battery. Confirm local availability and replacement instructions before purchase, label the install date, keep ventilation clear, and replace a battery that fails a self-test or can no longer support the required chain.",
      },
    ],
    alternatives: [
      "Choose APC BE600M1 for a smaller ONT, modem, and router chain.",
      "Choose CyberPower SL700U when a flatter wall-mountable format matters more than a user-replaceable battery.",
    ],
    compareSlugs: ["apc-be600m1-router-ups", "cyberpower-sl700u-router-ups"],
    sources: [
      {
        name: "APC BE850G2 product page",
        url: "https://www.apc.com/us/en/product/BE850G2/apc-backups-850va-120v-2-usb-charging-ports-9-nema-outlets-3-surge/",
        note: "Official capacity, outlet layout, USB, battery, and product-document source.",
      },
      {
        name: "Amazon listing for ASIN B085JJZDFK",
        url: "https://www.amazon.com/dp/B085JJZDFK",
        note: "Exact BE850G2 marketplace identity; seller, stock, price, and delivery remain checkout checks.",
      },
    ],
    offers: [
      {
        merchant: "Amazon US",
        url: amazonUrl("B085JJZDFK"),
        label: "Check BE850G2 price on Amazon",
        priceNote: "Confirm ASIN B085JJZDFK, BE850G2, seller, battery condition policy, delivery, and return terms.",
      },
    ],
  },
  {
    site: "network",
    slug: "apc-be600m1-router-ups",
    asin: "B01FWAZEIU",
    amazonTitle: "APC UPS Battery Backup and Surge Protector, 600VA, BE600M1",
    seoTitle: "APC BE600M1 Review Guide: Small Router and Modem UPS",
    updatedAt,
    evidenceMode: "official-spec",
    researchNote:
      "We have not runtime-tested this unit. The decision is based on APC and Schneider Electric documentation plus the exact Amazon identity. Runtime must be checked against the buyer's measured watt load.",
    name: "APC BE600M1 Back-UPS 600VA",
    brand: "APC",
    category: "backup",
    image: "/images/affiliate/network-router-ups-editorial-realistic.webp",
    summary:
      "A compact 600VA/330W UPS guide for an ONT, modem, router, and one small switch, with five battery-backed outlets, two surge-only outlets, one USB port, and a replaceable-battery path.",
    verdict:
      "BE600M1 is the practical default for a modest network chain when 330W is ample and seven outlets fit the power bricks. It is a poor choice when a workstation, large NAS, or long runtime target is being hidden inside a 'router UPS' budget.",
    whyItMatters:
      "Small network loads can make a 600VA UPS more rational than an 850VA model, but the real decision is measured watts, outlet fit, and battery maintenance rather than the lowest purchase price.",
    bestFor: "ONT, modem, router and one low-power switch",
    priceBand: "$",
    rating: 4.4,
    scores: [
      { label: "Small-network fit", value: 9 },
      { label: "Battery serviceability", value: 8 },
      { label: "High-load headroom", value: 5 },
    ],
    pros: [
      "600VA and 330W output suits many small networking chains",
      "Five battery-plus-surge outlets and two surge-only outlets",
      "Replaceable battery and one USB charging port are officially listed",
    ],
    cons: [
      "Less watt headroom than BE850G2",
      "Closely spaced wall adapters can reduce usable outlet count",
      "Schneider's direct-channel stock status does not predict Amazon availability",
    ],
    specs: {
      ASIN: "B01FWAZEIU",
      Model: "BE600M1",
      Capacity: "600VA / 330W",
      "Battery-backed outlets": "5",
      "Surge-only outlets": "2",
      USB: "1 charging port listed",
      Battery: "User-replaceable path listed",
    },
    evidence: [
      "Confirm ASIN B01FWAZEIU and model BE600M1",
      "Measure the complete required network chain instead of using the router's adapter rating alone",
      "Check that every wall adapter fits without blocking the battery-backed outlets",
      "Use APC runtime data only at a comparable load and allow for battery aging",
      "Verify seller, stock, battery condition policy, and delivery at checkout",
    ],
    editorialSections: [
      {
        heading: "The 600VA sweet spot",
        body: "For an ONT, modem, router, and small switch, 330W can provide ample output headroom. The remaining question is runtime at the actual measured load, not whether the UPS can power a gaming PC at the same time.",
      },
      {
        heading: "Outlet count is not usable-outlet count",
        body: "BE600M1 lists seven outlets, but only five are battery backed. Draw the power-brick shapes on paper or test the layout while the return window is open so one oversized adapter does not block the protected sockets needed by the ONT or router.",
      },
      {
        heading: "Keep nonessential loads off the battery",
        body: "A lamp, printer, speaker, or monitor can consume runtime needed by the network. Put only the minimum internet chain on battery-backed outlets and use surge-only outlets for equipment that can turn off during an outage.",
      },
      {
        heading: "Who should skip it",
        body: "Skip it when the required load approaches the unit's output rating, a workstation or large NAS must stay up, or the runtime target demands a larger battery. Move to BE850G2 or a purpose-sized higher-capacity UPS after measuring the load.",
      },
    ],
    alternatives: [
      "Choose APC BE850G2 for more outlets and output headroom.",
      "Choose CyberPower SL700U for a slim wall-mountable chassis and two USB-A charging ports.",
    ],
    compareSlugs: ["apc-back-ups-router-modem-bundle", "cyberpower-sl700u-router-ups"],
    sources: [
      {
        name: "Schneider Electric APC BE600M1 product page",
        url: "https://www.se.com/us/en/product/BE600M1/apc-backups-600va-120v-1-usb-charging-port-7-nema-outlets-2-surge/",
        note: "Official capacity, outlet, USB, battery, and direct-channel status source.",
      },
      {
        name: "APC BE600M1 manual",
        url: "https://www.se.com/us/en/download/document/SPD_AHUG-9XB6SU_EN/",
        note: "Official operation, safety, alarm, and maintenance documentation.",
      },
      {
        name: "Amazon listing for ASIN B01FWAZEIU",
        url: "https://www.amazon.com/dp/B01FWAZEIU",
        note: "Exact BE600M1 marketplace identity; confirm seller, stock, delivery, and return terms.",
      },
    ],
    offers: [
      {
        merchant: "Amazon US",
        url: amazonUrl("B01FWAZEIU"),
        label: "Check BE600M1 price on Amazon",
        priceNote: "Confirm ASIN B01FWAZEIU, BE600M1, seller, battery policy, delivery, and return terms.",
      },
    ],
  },
  {
    site: "network",
    slug: "cyberpower-sl700u-router-ups",
    asin: "B07SKX78PV",
    amazonTitle: "CyberPower SL700U Standby UPS Battery Backup and Surge Protector",
    seoTitle: "CyberPower SL700U Review Guide: Slim Router UPS Tradeoffs",
    updatedAt,
    evidenceMode: "official-spec",
    researchNote:
      "We have not runtime-tested the SL700U. CyberPower's official figures are retained at their stated half-load and full-load conditions and are not extrapolated to a router-only load.",
    name: "CyberPower SL700U Standby UPS",
    brand: "CyberPower",
    category: "backup",
    image: "/images/affiliate/network-router-ups-editorial-realistic.webp",
    summary:
      "A slim 700VA/370W standby UPS with five battery-backed outlets, three surge-only outlets, two USB-A charging ports, wall-mount capability, and a non-user-replaceable battery tradeoff.",
    verdict:
      "SL700U is the placement-first choice when a flatter chassis or wall mounting solves a real shelf problem. Its official nine-minute half-load runtime is not a router-runtime promise, and its non-user-replaceable battery makes long-term ownership less attractive than serviceable APC options.",
    whyItMatters:
      "A UPS that fits the utility wall and leaves power bricks accessible can be better than a larger unit on the floor, but form factor should not hide the replacement-battery limitation.",
    bestFor: "Tight shelves or wall-mounted network installations",
    priceBand: "$$",
    rating: 4.2,
    scores: [
      { label: "Placement flexibility", value: 9 },
      { label: "Network output", value: 8 },
      { label: "Battery serviceability", value: 3 },
    ],
    pros: [
      "700VA and 370W official output rating",
      "Five battery-plus-surge outlets, three surge-only outlets, and two USB-A ports",
      "Compact chassis can be wall mounted",
    ],
    cons: [
      "Internal battery is not user replaceable",
      "Official two-minute full-load and nine-minute half-load figures do not describe a router-only load",
      "Simulated sine output is not the deciding feature for ordinary low-power networking gear but may matter for other loads",
    ],
    specs: {
      ASIN: "B07SKX78PV",
      Model: "SL700U",
      Capacity: "700VA / 370W",
      "Battery-backed outlets": "5",
      "Surge-only outlets": "3",
      USB: "2 USB-A charging ports",
      Runtime: "2 min at full load; 9 min at half load, manufacturer listed",
      Battery: "Non-user-replaceable",
      Mounting: "Desktop or wall mount",
    },
    evidence: [
      "Confirm ASIN B07SKX78PV and SL700U rather than another CyberPower slim-series capacity",
      "Keep the official two-minute and nine-minute runtime figures attached to full and half load",
      "Measure the actual network watts and consult the manufacturer's load-specific guidance",
      "Decide whether replacing the complete unit when the battery wears out is acceptable",
      "Verify seller, stock, delivery region, mounting clearance, and return terms",
    ],
    editorialSections: [
      {
        heading: "Placement is the reason to choose it",
        body: "The slim chassis and wall-mount option can keep a network shelf clear and make outlet access easier. Verify wall material, mounting orientation, cable strain, ventilation, and the distance to every power brick before treating the form factor as solved.",
      },
      {
        heading: "Do not convert half-load runtime into router hours",
        body: "CyberPower lists two minutes at full load and nine minutes at half load. A router chain is usually far below half load, but the battery discharge curve is not linear. Use a measured load and manufacturer guidance instead of multiplying nine minutes into a made-up promise.",
      },
      {
        heading: "The battery tradeoff is permanent",
        body: "CyberPower lists the SL700U battery as non-user-replaceable. That can be acceptable for a compact installation, but buyers who want to service the UPS after the battery ages should favor a model with an official replacement-battery path.",
      },
      {
        heading: "Who should skip it",
        body: "Skip it if a replaceable battery is a requirement, a much longer outage target demands larger capacity, or the network shelf already fits a serviceable APC model cleanly.",
      },
    ],
    alternatives: [
      "Choose APC BE600M1 when battery replacement and a smaller network chain are the priorities.",
      "Choose APC BE850G2 when more output headroom and nine total outlets matter.",
    ],
    compareSlugs: ["apc-be600m1-router-ups", "apc-back-ups-router-modem-bundle"],
    sources: [
      {
        name: "CyberPower SL700U product page",
        url: "https://www.cyberpowersystems.com/product/ups/standby/sl700u/",
        note: "Official capacity, outlet, runtime, battery, USB, topology, warranty, and mounting specifications.",
      },
      {
        name: "Amazon listing for ASIN B07SKX78PV",
        url: "https://www.amazon.com/dp/B07SKX78PV",
        note: "Exact SL700U marketplace identity; confirm seller, stock, delivery, and return terms.",
      },
    ],
    offers: [
      {
        merchant: "Amazon US",
        url: amazonUrl("B07SKX78PV"),
        label: "Check SL700U price on Amazon",
        priceNote: "Confirm ASIN B07SKX78PV, SL700U, seller, battery policy, delivery, and return terms.",
      },
    ],
  },
];

export const networkUpsRoundups: Roundup[] = [
  {
    site: "network",
    slug: "best-ups-for-router-and-modem",
    seoTitle: "Best UPS for Router, Modem and ONT: APC vs CyberPower",
    updatedAt,
    title: "Best UPS for Router, Modem and ONT Backup Power",
    dek: "Compare APC BE600M1, BE850G2, and CyberPower SL700U by measured load, protected outlets, power-brick fit, battery replacement, and installation space.",
    category: "backup",
    intent: "choose an exact UPS for an ONT, modem, router, switch, mesh node, or small NAS without guessing runtime from VA",
    intro:
      "Keep the whole required internet path alive, not just the Wi-Fi router. Measure its watts, decide how much outage time matters, count usable battery-backed outlets, and confirm whether the ISP side remains active before increasing capacity.",
    sections: [
      {
        heading: "The three products solve different physical problems",
        body: "BE600M1 is the compact serviceable default, BE850G2 adds output and outlet headroom, and SL700U favors a slimmer wall-mountable shape while giving up user battery replacement.",
      },
      {
        heading: "Runtime is not the VA number",
        body: "VA and maximum watts describe capacity, not minutes. Use a plug-in watt meter or reliable device measurements, then check manufacturer runtime information at a comparable load and leave margin for battery aging.",
      },
      {
        heading: "Protect the minimum viable chain",
        body: "An ONT or modem, router, one essential switch, and perhaps one mesh node belong on battery. A monitor, printer, lamp, and idle accessories shorten runtime without preserving connectivity.",
      },
    ],
    decisionGuide: [
      { label: "Smallest serviceable setup", detail: "Choose APC BE600M1 for an ONT, modem, router, and one low-power switch." },
      { label: "More outlets or small NAS", detail: "Choose APC BE850G2 when six protected outlets and 450W of headroom fit the chain." },
      { label: "Wall or shallow shelf", detail: "Choose CyberPower SL700U when its slim mounting options solve a real placement constraint." },
      { label: "Long outage target", detail: "Measure load and move to a larger runtime class; do not stack unrelated loads on these compact choices." },
    ],
    methodology: [
      "Pinned every recommendation to an exact model and ASIN",
      "Used manufacturer outlet, output, runtime-condition, and battery documentation",
      "Separated capacity from runtime and serviceability from purchase price",
      "Rejected the previous ambiguous bundle identity",
    ],
    productSlugs: ["apc-be600m1-router-ups", "apc-back-ups-router-modem-bundle", "cyberpower-sl700u-router-ups"],
    faqs: [
      {
        question: "Will a UPS keep the internet working during an outage?",
        answer: "Only if every required device in the home and the ISP's upstream equipment remain powered and operational. Test a short controlled outage instead of assuming coverage.",
      },
      {
        question: "How many VA does a router need?",
        answer: "There is no useful router-only VA answer. Measure the watts for the ONT or modem, router, switch, and required mesh node, then size for output and runtime with margin.",
      },
      {
        question: "Should a NAS share the router UPS?",
        answer: "Only after its load, shutdown behavior, and runtime target are included. A NAS can materially change the battery requirement and may justify a separate UPS plan.",
      },
      {
        question: "Which UPS has a replaceable battery?",
        answer: "APC documents replacement paths for BE600M1 and BE850G2. CyberPower lists SL700U's battery as non-user-replaceable.",
      },
    ],
  },
];

export const networkUpsGuides: Guide[] = [
  {
    site: "network",
    slug: "router-ups-runtime-guide",
    title: "Router UPS Runtime: Size Backup Power for Modem, ONT and Mesh",
    dek: "Measure the complete network load, separate protected from surge-only outlets, and estimate runtime without turning VA or half-load figures into false promises.",
    category: "backup",
    updatedAt,
    image: "/images/affiliate/network-router-ups-editorial-realistic.webp",
    imageAlt: "Home network equipment powered through a compact UPS on a utility shelf",
    relatedRoundups: ["best-ups-for-router-and-modem"],
    relatedProducts: ["apc-be600m1-router-ups", "apc-back-ups-router-modem-bundle", "cyberpower-sl700u-router-ups"],
    comparisonTable: {
      title: "What changes the UPS decision",
      columns: ["Check", "Why it matters", "Action before buying"],
      rows: [
        { label: "Required chain", values: ["One missing ONT, modem, or switch breaks connectivity", "List every device that must stay on"] },
        { label: "Measured watts", values: ["Runtime follows load, not the router label", "Measure normal and peak draw"] },
        { label: "Protected outlets", values: ["Surge-only sockets turn off during an outage", "Map every power brick to an outlet"] },
        { label: "Battery path", values: ["Battery aging changes lifetime cost", "Check official replacement support"] },
        { label: "ISP continuity", values: ["Neighborhood equipment can still fail", "Run a controlled outage test"] },
      ],
    },
    sources: [
      {
        name: "APC BE850G2 product page",
        url: "https://www.apc.com/us/en/product/BE850G2/apc-backups-850va-120v-2-usb-charging-ports-9-nema-outlets-3-surge/",
        note: "Example official capacity, outlet, and replacement-battery documentation.",
      },
      {
        name: "CyberPower SL700U product page",
        url: "https://www.cyberpowersystems.com/product/ups/standby/sl700u/",
        note: "Example official runtime values tied to stated loads and non-user-replaceable battery disclosure.",
      },
    ],
    sections: [
      {
        heading: "1. Draw the minimum internet chain",
        body: "Start at the provider handoff. The ONT or cable modem, router, one essential switch, and any mesh node needed for the occupied area must stay powered. Leave lamps, displays, printers, speakers, chargers, and nonessential nodes off the battery.",
      },
      {
        heading: "2. Measure watts instead of reading adapter maxima",
        body: "A power adapter's printed maximum is not the device's steady draw. Measure the complete chain during normal use and during a busy period when practical. Keep the measurement setup electrically safe and do not exceed the meter or outlet rating.",
      },
      {
        heading: "3. Use runtime data at a comparable load",
        body: "A UPS rated for 330W or 450W is not promising that many watts for a useful duration. Keep every published runtime attached to its stated load. Low-load behavior is nonlinear, so use the manufacturer's curve or calculator near the measured watts rather than extrapolating from half load.",
      },
      {
        heading: "4. Add margin for battery aging",
        body: "Batteries lose usable capacity with age, heat, repeated discharge, and storage conditions. A setup that barely meets the target when new is likely to disappoint later. Label the battery date, keep the UPS ventilated, and schedule self-tests.",
      },
      {
        heading: "5. Map power bricks to protected outlets",
        body: "Battery-backed and surge-only outlets are different. Sketch the physical adapters, including sideways bricks, and make sure every required device reaches a battery-backed socket without an unsafe chain of strips or extensions.",
      },
      {
        heading: "6. Test the upstream limit",
        body: "After setup, run a short controlled test while someone is present. Verify that the ONT or modem, router, switch, Wi-Fi, DNS, and real internet access remain available. Local Wi-Fi lights alone do not prove the ISP path is alive.",
      },
      {
        heading: "7. Recheck after network changes",
        body: "A new mesh node, switch, NAS, or modem changes the load and outlet plan. Repeat the measurement and controlled test instead of assuming the original runtime still applies.",
      },
    ],
  },
];
