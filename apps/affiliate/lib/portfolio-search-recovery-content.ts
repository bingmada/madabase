import type { Guide, Product } from "./types";

const updatedAt = "October 6, 2026";

const guidePatches: Record<string, Partial<Guide>> = {
  "network:deco-be63-vs-be67-vs-be85-buying-guide": {
    updatedAt,
    searchQuestion: "Should you buy Deco BE63, BE67, or BE85 for a Wi-Fi 7 mesh?",
    governance: {
      decision: "keep",
      independentDemand: "A three-model Deco Wi-Fi 7 decision based on wired ports, backhaul, pack size, clients, and the network that already exists.",
      distinctFrom: "The individual reviews verify one model, the pack-size guide chooses node count, and the backhaul guide plans cabling; this page alone chooses between BE63, BE67, and BE85.",
      benchmark: "Preserve the click-bearing URL and first-screen answer while making the current US hardware and port differences scannable from official TP-Link specifications.",
    },
    comparisonTable: {
      title: "Current US Deco BE63, BE67, and BE85 wired-path check",
      columns: ["Deco BE63", "Deco BE67", "Deco BE85"],
      rows: [
        {
          label: "Ethernet per unit",
          values: [
            "4× 2.5Gbps WAN/LAN",
            "1× 10Gbps, 1× 2.5Gbps, and 1× 1Gbps WAN/LAN",
            "1× 10Gbps, 1× 10Gbps SFP+/RJ45 combo, and 2× 2.5Gbps WAN/LAN",
          ],
        },
        {
          label: "Best reason to step up",
          values: [
            "Several useful 2.5GbE paths without paying for unused 10GbE",
            "One defined 10GbE WAN, NAS, workstation, or backhaul path",
            "Two 10GbE-class paths, SFP+ flexibility, and a premium local-network plan",
          ],
        },
        {
          label: "Do not assume",
          values: [
            "The BE10000 class is one-client throughput",
            "Every port is 10Gbps or that one 10Gbps port remains LAN after WAN is assigned",
            "SFP+ replaces the need to map the ONT, switch, NAS, clients, and cables",
          ],
        },
      ],
    },
    editorialMethod: [
      "Current US model pages and support records were checked on October 6, 2026. This is a specification-led network-planning guide, not a hands-on throughput or coverage test.",
    ],
    relatedGuides: [
      "deco-be63-ethernet-backhaul-setup",
      "deco-be63-be67-two-pack-vs-three-pack",
      "deco-wifi-7-single-unit-vs-two-pack",
      "mesh-wifi-node-placement-guide",
      "is-wifi-7-worth-it-for-1gbps-internet",
    ],
  },
  "smarthome:matter-thread-wifi-zigbee-device-checklist": {
    title: "Matter vs Thread vs Wi-Fi vs Zigbee: Device Checklist",
    dek: "Identify the application standard, radio or network, controller, Thread border router, Zigbee bridge, app, and fallback required before buying a smart-home device.",
    updatedAt,
    searchQuestion: "What is the difference between Matter, Thread, Wi-Fi, and Zigbee when buying a smart-home device?",
    quickAnswer: "Matter is the interoperability layer, while Thread, Wi-Fi, and Ethernet can carry Matter traffic. Zigbee is a separate device-and-network stack that normally needs a compatible coordinator or bridge. A Matter-over-Wi-Fi device needs a Matter controller and Wi-Fi, while a Matter-over-Thread device also needs a compatible Thread border router. Read the exact product's transport and ecosystem support instead of treating a Matter logo as proof that every existing hub or feature will work.",
    governance: {
      decision: "merge",
      independentDemand: "A purchase checklist that turns Matter, Thread, Wi-Fi, and Zigbee labels into the exact controller, border-router, bridge, app, account, and fallback requirements for one device.",
      distinctFrom: "The controller-versus-border-router page explains two infrastructure roles in depth. The broad comparison and hub-checklist material now support this one device-level purchase path instead of competing as separate pages.",
      benchmark: "One protocol inventory, one ownership path, one commissioning test, one outage test, and explicit checks for bridged features before the return window closes.",
    },
    comparisonTable: {
      title: "Translate the label into the infrastructure you need",
      columns: ["What it describes", "Usually required", "Common buying mistake"],
      rows: [
        {
          label: "Matter over Wi-Fi",
          values: ["Matter application layer over the home IP network", "A compatible Matter controller and usable Wi-Fi", "Buying a Thread border router when the device does not use Thread"],
        },
        {
          label: "Matter over Thread",
          values: ["Matter application layer over a low-power Thread IP mesh", "A compatible Matter controller plus Thread border router", "Assuming every Matter controller also supplies the correct Thread role"],
        },
        {
          label: "Zigbee",
          values: ["A separate low-power mesh and application stack", "A compatible Zigbee coordinator or vendor hub", "Assuming a Zigbee accessory becomes a native Thread device when bridged to Matter"],
        },
        {
          label: "Bridge to Matter",
          values: ["A bridge exposes supported functions from another network", "The original hub plus a Matter controller", "Expecting every vendor-specific setting, event, and automation to cross the bridge"],
        },
      ],
    },
    sections: [
      {
        heading: "Write six fields for the exact product",
        body: "Record the device model and region, application standard, transport or radio, required controller, required border router or bridge, and primary app or account. Matter can run over Wi-Fi, Thread, or Ethernet, so the Matter logo alone does not identify the network path. Product generations with similar names can use different transports.",
      },
      {
        heading: "Separate the Matter controller from the Thread border router",
        body: "The Matter controller commissions and manages a Matter accessory inside an ecosystem. A Thread border router connects a Thread mesh to the wider IP network. One speaker, display, streaming box, or hub can provide both roles, but verify the exact generation, current software, region, and ecosystem support instead of assuming the product family name is enough.",
      },
      {
        heading: "Treat Zigbee bridging as a feature subset",
        body: "A Zigbee accessory remains on its Zigbee network when a compatible bridge exposes it to Matter. Before buying, identify which controls, sensor values, scenes, alerts, firmware updates, history, and automations remain in the vendor app and which appear in the second ecosystem. Keep the original hub when it still owns updates or critical automations.",
      },
      {
        heading: "Commission through one primary ownership path",
        body: "Choose the household and account that should own the device, update the controller and accessory, and commission near the required controller or border router. Add a second ecosystem only after the first path is stable. Save reset instructions privately and never publish active setup codes in screenshots, support posts, or analytics notes.",
      },
      {
        heading: "Test the failure modes before the return window closes",
        body: "Turn off internet access without removing local power, reboot the controller and border router, test a physical control, and confirm household sharing and recovery. A local protocol does not guarantee that the vendor's app, cloud history, voice assistant, remote access, or every automation remains available during an outage.",
      },
      {
        heading: "Skip another hub when the missing role is not proven",
        body: "Inventory compatible speakers, displays, routers, streaming boxes, and bridges already in the home. Do not add a hub because its logos look familiar. Buy only when the exact device is supported, a required role is missing, or the new hub provides a documented feature that changes the household's real workflow.",
      },
    ],
    sources: [
      { name: "Connectivity Standards Alliance Matter FAQ", url: "https://csa-iot.org/all-solutions/matter/matter-faq/", note: "Official explanation of Matter and its Wi-Fi, Thread, Ethernet, and Bluetooth commissioning relationships." },
      { name: "Thread Group resources", url: "https://threadgroup.org/resources", note: "Official Thread networking, border-router, interoperability, and current-version resources." },
      { name: "Thread Group smart-home network white paper", url: "https://www.threadgroup.org/Portals/0/documents/ElegantlyConnectingYourSmartHomeNetworkWhitePaper_4431_1.pdf", note: "Official comparison of Thread, Zigbee, Wi-Fi, and other home-network roles." },
    ],
    editorialMethod: [
      "Standards-led decision worksheet using current CSA and Thread Group material. Verify the exact device, region, controller generation, software, bridge support, and feature exposure before purchase; no interoperability test is claimed.",
    ],
    relatedGuides: [
      "matter-controller-vs-thread-border-router",
      "aqara-hub-m3-vs-m2",
      "aqara-hub-m3-matter-thread-setup",
      "aqara-hub-m3-home-assistant-matter-guide",
      "ikea-parasoll-vs-myggbett-zigbee-matter-thread",
    ],
  },
};

const productPatches: Record<string, Partial<Product>> = {
  "pet:levoit-vital-200s-p-air-purifier": {
    seoTitle: "Levoit Vital 200S-P for Pets: CADR, Hair & Filter Cost",
    updatedAt,
    summary: "A research-based Levoit Vital 200S-P guide for pet homes, separating the 250 CFM official specification and washable pre-filter from attributed particle, noise, pet-hair, and ownership observations.",
    verdict: "Vital 200S-P is a strong medium-room candidate when airborne pet hair loads the washable pre-filter, schedules are useful, and the 388-square-foot 4.8-ACH rating fits the closed room. Skip it for a large open plan, a household expecting it to remove settled hair, or a buyer who cannot accept recurring main-filter cost and source-level odor cleaning.",
    researchNote: "We have not tested the Vital 200S-P ourselves. This guide separates Levoit's current specifications from attributed RTINGS and HouseFresh tests of the Vital 200S family and Popular Mechanics' two-week pet-home use of the current Vital 200S-P. Their rooms, units, particle sensors, fan settings, noise methods, pets, and observations differ, so results are not averaged or presented as our own.",
    externalTests: [
      {
        source: "RTINGS",
        url: "https://www.rtings.com/air-purifier/reviews/levoit/vital-200s",
        date: "Test Bench 1.3.1; review updated June 4, 2026 and writing updated July 17, 2026",
        testSetup: "RTINGS tested a purchased White/Black Vital 200S. Its public methodology reports PM1.0 clean-air delivery at maximum output and at a quieter setting capped at 45dBA, plus measured noise at the lowest and highest fan speeds.",
        result: "RTINGS measured 216 CFM PM1.0 CADR at maximum output and associated that result with a 337 sq. ft. room. At Speed 2 under its low-noise method, it measured 87 CFM and associated the result with 135 sq. ft. Measured noise ranged from 32.7 to 55.6dBA.",
        interpretation: "The machine has useful medium-room particle performance, but quiet operation materially reduces the room size it can refresh quickly. A large maximum-coverage claim should not be used as the bedroom sizing target.",
        limitation: "RTINGS tested one color variant of the Vital 200S under its own PM1 and noise methodology. Confirm that the current Vital 200S-P listing and filter match the tested family, and do not compare its room-size output directly with a manufacturer one-air-change claim.",
      },
      {
        source: "HouseFresh",
        url: "https://housefresh.com/levoit-vital-200s-review/",
        date: "Long-term review refreshed in 2026 after more than two years of ownership",
        testSetup: "HouseFresh says it bought the Vital 200S and used the same particle-removal, sound-meter, and energy-meter workflow it applies across its purifier tests. It tested full speed and a sub-45dBA Speed 2 setting.",
        result: "HouseFresh reported 249 CFM PM1 CADR at top speed and 128 CFM below 45dBA. Its room test reached PM1 zero in 23 minutes at full speed and 46 minutes at Speed 2. Sound measured 38.3 to 57.7dBA from three feet, and top-speed power measured 44.55W.",
        interpretation: "The result supports the Vital 200S as a strong value for a medium room and shows the practical speed-versus-noise trade-off. It also makes electricity and replacement filters part of the buying decision rather than an afterthought.",
        limitation: "This is one site's room, sensor, electricity-price assumption, and purchased unit. Its annual-cost estimate changes with fan schedule, local electricity price, filter loading, genuine-filter price, and replacement frequency.",
      },
      {
        source: "Popular Mechanics",
        url: "https://www.popularmechanics.com/home/a73653472/levoit-vital-200s-p-air-purifier-review/",
        date: "Published September 9, 2026 after two weeks of use in a pet-occupied finished basement",
        testSetup: "The reviewer used a Vital 200S-P in a basement used by a cat and observed Pet Mode, sound at several settings, and material collected on the removable pre-filter.",
        result: "The reviewer reported visible pet hair on the pre-filter after several cycles, found the pre-filter straightforward to clean, and described the highest Pet Mode interval as audible but not distracting in that room.",
        interpretation: "The observation supports the practical value of accessible pre-filter cleaning in a shedding-pet room, while particle sizing, room sizing, and odor control still require the official and instrumented evidence on this page.",
        limitation: "This is one recent two-week household observation, not a controlled CADR, allergen, odor, long-term filter-life, or multi-home durability test.",
      },
    ],
  },
};

export function applyPortfolioSearchRecoveryGuide(guide: Guide): Guide {
  const patch = guidePatches[`${guide.site}:${guide.slug}`];
  return patch ? { ...guide, ...patch } : guide;
}

export function applyPortfolioSearchRecoveryProduct(product: Product): Product {
  const patch = productPatches[`${product.site}:${product.slug}`];
  return patch ? { ...product, ...patch } : product;
}
