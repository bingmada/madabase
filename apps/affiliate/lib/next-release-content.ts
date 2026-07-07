import type { Guide, Product, Roundup } from "./types";

const updatedAt = "July 3, 2026";
const draft = "draft" as const;

export const nextReleaseProducts: Product[] = [
  {
    publicationStatus: draft,
    site: "network",
    slug: "tp-link-deco-be65-pro-wifi-7-mesh",
    seoTitle: "TP-Link Deco BE65 Pro Guide: 5GbE, BE11000 & BE63 Comparison",
    updatedAt,
    name: "TP-Link Deco BE65 Pro Wi-Fi 7 Mesh",
    brand: "TP-Link",
    category: "wifi",
    image: "/images/affiliate/network-tp-link-deco-be65-pro-wifi-7-mesh.svg",
    summary:
      "A research-based guide to the US Deco BE65 Pro, including its tri-band BE11000 radios, two 5GbE ports, one 2.5GbE port, 6GHz backhaul options, and the narrower situations where it is worth choosing over Deco BE63.",
    verdict:
      "Deco BE65 Pro is the stronger fit when a 5Gbps internet plan, fast NAS, multi-gig switch, or wired backhaul can use its two 5GbE ports. Deco BE63 remains easier to justify when four 2.5GbE ports provide enough wired capacity.",
    whyItMatters:
      "The meaningful upgrade is not the small difference in advertised wireless class. It is the change from four 2.5GbE ports on BE63 to two 5GbE ports plus one 2.5GbE port on BE65 Pro.",
    bestFor: "Homes with a defined 5GbE WAN, NAS, switch, or backhaul path",
    priceBand: "$$$",
    rating: 4.5,
    scores: [
      { label: "Multi-gig ports", value: 9 },
      { label: "Wireless backhaul", value: 9 },
      { label: "Value for gigabit homes", value: 6 },
    ],
    pros: [
      "Two 5GbE WAN/LAN ports per unit",
      "Tri-band Wi-Fi 7 with 6GHz and 320MHz channel support",
      "One additional 2.5GbE port and USB connectivity",
    ],
    cons: [
      "Fewer total Ethernet ports than Deco BE63",
      "Most phones and laptops cannot use the headline aggregate speed",
      "The premium is difficult to justify without a planned multi-gig path",
    ],
    specs: {
      Model: "Deco BE65 Pro (US)",
      Wireless: "Tri-band BE11000 Wi-Fi 7",
      "6GHz radio": "Up to 5765Mbps listed",
      "5GHz radio": "Up to 4324Mbps listed",
      "2.4GHz radio": "Up to 688Mbps listed",
      Ports: "2×5GbE WAN/LAN + 1×2.5GbE WAN/LAN per unit",
      USB: "1× USB port",
      Backhaul: "Wireless, Ethernet, or combined backhaul",
      Packs: "Official page lists 1-, 2-, and 3-pack options",
    },
    evidence: [
      "Confirm the listing says BE65 Pro rather than BE65, BE65-PoE, or BE65-5G",
      "Match the pack size to the home before comparing checkout prices",
      "Map which device will use each 5GbE and 2.5GbE port",
      "Treat advertised wireless rates as link rates rather than guaranteed internet throughput",
    ],
    editorialSections: [
      {
        heading: "BE65 Pro and BE65 are different port designs",
        body: "The US BE65 Pro has two 5GbE WAN/LAN ports and one 2.5GbE WAN/LAN port per unit. The similarly named BE65 uses a different four-port 2.5GbE layout. Keep the word Pro, regional page, hardware version, and pack size visible when comparing listings.",
      },
      {
        heading: "The 5GbE path needs endpoints",
        body: "A 5GbE port matters only when the modem or ONT, cabling, switch, NAS or desktop, and actual traffic can use it. A normal gigabit plan and mostly wireless clients will not make the BE65 Pro five times faster than a gigabit mesh.",
      },
      {
        heading: "BE63 can be the better wiring fit",
        body: "BE63 supplies four 2.5GbE ports per unit. That can be more convenient for a wired television, desktop, switch, and backhaul even though no single port reaches 5Gbps.",
      },
      {
        heading: "Who should skip the BE65 Pro",
        body: "Choose a less expensive system when the internet plan is one gigabit or below, Ethernet backhaul is unavailable, client devices do not support 6GHz, or no local transfer workload needs more than 2.5Gbps.",
      },
    ],
    alternatives: [
      "Choose Deco BE63 for four 2.5GbE ports per unit and a lower-cost tri-band design.",
      "Choose Deco BE25 when Ethernet backhaul makes a dual-band value system sufficient.",
    ],
    compareSlugs: ["tp-link-deco-be63-wifi-7-mesh", "tp-link-deco-be67-wifi-7-mesh"],
    sources: [
      {
        name: "TP-Link Deco BE65 Pro",
        url: "https://www.tp-link.com/us/deco-mesh-wifi/product-family/deco-be65-pro/",
        note: "Official US radio, port, pack, USB, mode, and backhaul specifications.",
      },
      {
        name: "TP-Link Deco BE63",
        url: "https://www.tp-link.com/us/deco-mesh-wifi/product-family/deco-be63/",
        note: "Official BE63 radio and four-port 2.5GbE specifications used for comparison.",
      },
    ],
    offers: [],
  },
];

export const nextReleaseRoundups: Roundup[] = [
  {
    publicationStatus: draft,
    site: "baby",
    slug: "nanit-pro-vs-infant-optics-dxr-8-pro",
    title: "Nanit Pro vs. Infant Optics DXR-8 Pro: App or Parent Unit?",
    dek:
      "Compare Wi-Fi and local monitoring, phone dependence, remote viewing, mounting, subscriptions, privacy, range, and the overnight workflow each system creates.",
    category: "sleep",
    intent: "Choose between an app-first smart monitor and a dedicated non-Wi-Fi parent unit.",
    intro:
      "These monitors solve different forms of reassurance. Nanit Pro centers the nursery around an app, overhead view, and optional insights. Infant Optics DXR-8 Pro keeps monitoring on a dedicated parent unit without requiring household Wi-Fi.",
    decisionGuide: [
      { label: "Overnight simplicity", detail: "DXR-8 Pro keeps the video feed on a dedicated screen." },
      { label: "Viewing away from home", detail: "Nanit uses an internet-connected app for remote access." },
      { label: "Sleep analytics", detail: "Nanit offers optional Insights plans and requires a compatible overhead mount for analytics." },
      { label: "Network preference", detail: "DXR-8 Pro avoids household Wi-Fi but still needs an in-home range test." },
    ],
    methodology: [
      "Separate core monitoring from optional subscription features",
      "Compare the actual 2 a.m. viewing workflow",
      "Check mounting, cord placement, range, and account requirements",
      "Treat every consumer monitor as a convenience device rather than a medical device",
    ],
    productSlugs: ["nanit-pro-smart-baby-monitor", "infant-optics-dxr-8-pro"],
    faqs: [
      {
        question: "Does Nanit Pro require a subscription?",
        answer:
          "No. Nanit lists live video, sound and motion notifications, background audio, breathing-motion monitoring, temperature and humidity, two-way audio, and other core controls without a paid Insights plan. Historical sleep analytics and plan-specific features are separate.",
      },
      {
        question: "Which monitor works without home Wi-Fi?",
        answer:
          "Infant Optics DXR-8 Pro communicates with its dedicated parent unit and does not depend on household Wi-Fi. Test its range and 2.4GHz interference in the actual home.",
      },
      {
        question: "Is either monitor a medical device?",
        answer:
          "No. Use the monitor for convenience and follow safe-sleep and medical guidance independently of app alerts or consumer breathing features.",
      },
    ],
  },
  {
    publicationStatus: draft,
    site: "network",
    slug: "deco-be65-pro-vs-be63",
    title: "TP-Link Deco BE65 Pro vs. BE63: 5GbE or More 2.5GbE Ports?",
    dek:
      "Compare the US BE11000 and BE10000 systems by Ethernet layout, Wi-Fi 7 radios, 6GHz backhaul, pack size, client limits, and the network upgrades required to benefit.",
    category: "wifi",
    intent: "Choose the right midrange Deco Wi-Fi 7 mesh without paying for an unused port speed.",
    intro:
      "BE65 Pro is not automatically the better home mesh because its number is higher. Its main practical advantage is a pair of 5GbE ports; BE63 counters with four 2.5GbE ports that can be easier to use in a media room or wired office.",
    decisionGuide: [
      { label: "5Gbps WAN or NAS", detail: "BE65 Pro provides two 5GbE paths per unit." },
      { label: "More wired devices", detail: "BE63 provides four 2.5GbE ports per unit." },
      { label: "Mostly wireless clients", detail: "Placement and backhaul can matter more than the modest radio-class difference." },
      { label: "Model-name risk", detail: "Verify BE65 Pro rather than BE65, BE65-PoE, or BE65-5G." },
    ],
    methodology: [
      "Use official US specifications for both models",
      "Compare identical pack sizes and hardware versions",
      "Map WAN, backhaul, switches, NAS, and fixed clients to physical ports",
      "Separate theoretical radio rates from measurable application throughput",
    ],
    productSlugs: ["tp-link-deco-be65-pro-wifi-7-mesh", "tp-link-deco-be63-wifi-7-mesh"],
    faqs: [
      {
        question: "What is the biggest difference between Deco BE65 Pro and BE63?",
        answer:
          "The port layout: BE65 Pro has two 5GbE and one 2.5GbE WAN/LAN port per unit, while BE63 has four 2.5GbE WAN/LAN ports per unit.",
      },
      {
        question: "Will BE65 Pro improve a one-gigabit internet plan?",
        answer:
          "Not by itself. Coverage, placement, backhaul, congestion, and client radios are more likely to control results when the WAN remains at one gigabit.",
      },
      {
        question: "Can both systems use Ethernet backhaul?",
        answer: "Yes. Both support Ethernet backhaul, and the useful topology depends on which ports remain after WAN and backhaul are connected.",
      },
    ],
  },
];

export const nextReleaseGuides: Guide[] = [
  {
    publicationStatus: draft,
    site: "baby",
    slug: "nanit-pro-without-subscription",
    title: "Nanit Pro Without a Subscription: What Still Works?",
    dek:
      "Separate Nanit's core live-monitoring functions from paid Insights features before deciding whether the camera still fits after a trial ends.",
    category: "sleep",
    updatedAt,
    sections: [
      {
        heading: "Core monitoring does not require an Insights plan",
        body: "Nanit states that the Pro monitor can still provide live video, real-time sound and motion notifications, background audio, temperature and humidity, two-way audio, white noise, a nightlight, and limited user sharing without a paid Insights subscription. An internet connection and Nanit account remain part of the app-based system.",
      },
      {
        heading: "Breathing Motion Monitoring is listed among core features",
        body: "Nanit also lists sensor-free Breathing Motion Monitoring among the functions available without a paid plan when the compatible Breathing Wear and setup requirements are followed. This consumer feature is not medical monitoring and should not change safe-sleep or medical decisions.",
      },
      {
        heading: "Historical insights are the upgrade decision",
        body: "Paid plans are mainly relevant when the household values sleep history, analytics, saved moments, developmental insights, or longer access to recorded events. Compare the current plan table because included features and retention periods can change.",
      },
      {
        heading: "Mount choice affects analytics",
        body: "Nanit says sleep analytics require a supported overhead view from the Floor Stand or Wall Mount. A Multi-Stand can be useful for travel or flexible viewing, but it does not create the same overhead analytics workflow.",
      },
      {
        heading: "Decide using the post-trial routine",
        body: "Ignore the free-trial period for a moment and list the functions the household will use every night afterward. If live view and alerts are enough, the subscription may be unnecessary. If historical sleep trends are the reason to buy Nanit, include the current plan cost in the ownership decision.",
      },
    ],
    sources: [
      {
        name: "Nanit Pro Baby Monitor",
        url: "https://www.nanit.com/products/nanit-pro-camera",
        note: "Official no-subscription FAQ, included features, mount choices, and trial information.",
      },
      {
        name: "Nanit Memberships",
        url: "https://www.nanit.com/pages/memberships?locale=en-US",
        note: "Current plan positioning and requirement for a Floor Stand or Wall Mount for Insights.",
      },
    ],
    relatedRoundups: ["best-baby-monitors-for-apartments", "nanit-pro-vs-infant-optics-dxr-8-pro"],
    relatedProducts: ["nanit-pro-smart-baby-monitor"],
  },
  {
    publicationStatus: draft,
    site: "baby",
    slug: "nanit-floor-stand-vs-wall-mount",
    title: "Nanit Floor Stand vs. Wall Mount: Which Nursery Setup Fits?",
    dek:
      "Compare floor space, drilling, crib position, cable management, room changes, analytics alignment, and the cost of each Nanit overhead setup.",
    category: "sleep",
    updatedAt,
    sections: [
      {
        heading: "Both mounts are designed for the overhead view",
        body: "Nanit positions both the Floor Stand and Wall Mount as compatible overhead setups for sleep analytics. The decision is therefore less about camera quality and more about furniture, installation, movement, and cable routing.",
      },
      {
        heading: "Choose the Floor Stand for flexibility",
        body: "The Floor Stand can slide under a crib or bassinet, adjusts between supported heights, and can move between rooms more easily. Measure the base against drawers, solid crib panels, baseboards, and walking paths before assuming it will fit.",
      },
      {
        heading: "Choose the Wall Mount to preserve floor space",
        body: "The Wall Mount suits a crib that will remain against a suitable wall and a household comfortable drilling and routing the included cord covers. Confirm stud, fastener, cable, outlet, and crib-position requirements before installation.",
      },
      {
        heading: "Plan for the toddler stage",
        body: "A flexible stand can move as furniture changes, while a wall mount may be cleaner but leaves holes and a fixed camera position. Recheck cord reach and access whenever the mattress height or bed changes.",
      },
      {
        heading: "Do not improvise the mounting geometry",
        body: "An off-center shelf or unsecured generic arm may create a poorer view and unsafe cord placement. Follow the current Nanit instructions and keep cords outside the child's reach rather than optimizing only for the app image.",
      },
    ],
    sources: [
      {
        name: "Nanit Pro Baby Monitor",
        url: "https://www.nanit.com/products/nanit-pro-camera",
        note: "Official Floor Stand and Wall Mount use cases and included-system details.",
      },
      {
        name: "Nanit Floor Stand",
        url: "https://www.nanit.com/products/floor-stand",
        note: "Official fit, height-position, crib-placement, and product-only information.",
      },
    ],
    relatedRoundups: ["best-baby-monitors-for-apartments", "nanit-pro-vs-infant-optics-dxr-8-pro"],
    relatedProducts: ["nanit-pro-smart-baby-monitor"],
  },
  {
    publicationStatus: draft,
    site: "pet",
    slug: "shark-neverchange-max-hp302-specs-maintenance",
    title: "Shark NeverChange MAX HP302 Specs & Maintenance Guide",
    dek:
      "Read the HP302 coverage claim correctly, identify each filter layer, and plan debris-screen cleaning, odor-cartridge choices, placement, and eventual HEPA inspection.",
    category: "home-care",
    updatedAt,
    sections: [
      {
        heading: "HP302 is the extra-large NeverChange MAX model",
        body: "Shark lists HP302 for up to 1,400 square feet in one hour. That is a one-air-cleaning-cycle framing under stated conditions, not proof that a divided 1,400-square-foot home will receive uniform filtration.",
      },
      {
        heading: "The outer screens still need maintenance",
        body: "NeverChange does not mean maintenance-free. Hair and larger debris collect on the washable Debris Defense screens, which should be removed and cleaned according to the manual so they do not restrict airflow into the HEPA layers.",
      },
      {
        heading: "Treat the five-year claim as conditional",
        body: "Shark's long filter-life claim depends on stated testing and use conditions. Inspect the system, respond to the unit's filter guidance, and recognize that smoke, construction dust, heavy pet load, blocked airflow, or unusual environments can differ from the comparison scenario.",
      },
      {
        heading: "The odor cartridge is a separate scented feature",
        body: "The Odor Neutralizer cartridge does not replace the HEPA filter and it does not remove the need to clean litter, urine, bedding, upholstery, or moisture at the source. Fragrance-sensitive households should evaluate the cartridge separately from particle filtration.",
      },
      {
        heading: "Placement controls real airflow",
        body: "Keep the intake and exhaust clear, avoid hiding the purifier behind furniture, and use a room where doors and circulation support the intended cleaning path. A smaller closed room can receive more cycles per hour than the maximum-coverage headline implies.",
      },
    ],
    sources: [
      {
        name: "Shark NeverChange Air Purifier MAX HP302",
        url: "https://www.sharkclean.com/products/shark-neverchange-air-purifier-max-zidHP302",
        note: "Official model, coverage, filter-system, debris-screen, odor, and warranty information.",
      },
      {
        name: "Shark NeverChange HEPA replacement filter",
        url: "https://www.sharkclean.com/products/shark-neverchangeanti-allergen-true-hepa-filter-zidHE3FKPET",
        note: "Official compatible replacement-filter information.",
      },
    ],
    relatedRoundups: ["coway-mighty2-vs-shark-neverchange-max", "levoit-vital-200s-p-vs-shark-neverchange-max"],
    relatedProducts: ["shark-neverchange-max-air-purifier"],
  },
  {
    publicationStatus: draft,
    site: "homeoffice",
    slug: "40-vs-48-inch-standing-desk",
    title: "40-Inch vs. 48-Inch Standing Desk: How Much Space Do You Need?",
    dek:
      "Translate desktop width into monitor, laptop, keyboard, clamp, speaker, walking-pad, wall-clearance, and cable space before choosing a compact standing desk.",
    category: "desks",
    updatedAt,
    sections: [
      {
        heading: "Usable width is smaller than the advertised number",
        body: "A 40-inch top can fit a focused laptop or single-monitor setup, but monitor bases, speaker stands, laptop docks, and cable exits consume width quickly. Measure the actual objects at their widest points rather than arranging rectangles on a product photo.",
      },
      {
        heading: "Forty inches favors one primary screen",
        body: "A compact top works best with one monitor, a laptop kept closed or on a vertical stand, and limited accessories. A monitor arm can recover surface depth, but its clamp and the desk frame still need clear mounting space.",
      },
      {
        heading: "Forty-eight inches creates a useful margin",
        body: "Eight extra inches can make room for an open laptop beside one monitor, a larger keyboard and mouse area, or safer separation between devices and the desktop edge. It does not automatically make dual large monitors comfortable.",
      },
      {
        heading: "Check frame, feet, and travel—not only the top",
        body: "The lifting columns and feet may be narrower or deeper than the desktop. Measure wall trim, doors, chair movement, drawers, a walking pad, and the full standing-height cable path before buying.",
      },
      {
        heading: "Choose the smallest desk that survives the real routine",
        body: "A narrow desk is valuable when it preserves a walkway or fits a bedroom, but replacing it after adding a monitor or dock is not efficient. Lay out the workstation with tape, include future equipment you are genuinely likely to add, and keep a few inches of tolerance.",
      },
    ],
    sources: [
      {
        name: "ErGear 48 × 24 Electric Standing Desk listing",
        url: "https://www.amazon.com/dp/B0DKJ4FDGG",
        note: "Current 48-inch reference product already covered on the site; verify the live variation before purchase.",
      },
    ],
    relatedRoundups: ["best-standing-desks-for-small-spaces", "ergear-48x24-vs-flexispot-e7-mini"],
    relatedProducts: ["ergear-48x24-electric-standing-desk", "flexispot-e7-mini-standing-desk"],
  },
];
