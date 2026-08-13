import { searchOpportunities, searchOpportunityPath } from "./search-opportunities";
import type { SiteKey } from "./types";

export type SearchDemandPriority = {
  path: string;
  queryFamily: string;
  decision: string;
};

// Editorial discovery priorities based on the latest qualified content-host
// Search Console portfolio. Keep mutable metrics in durable state; this list
// only controls which existing decision paths receive the strongest discovery
// links until the next portfolio review.
const priorities: Record<SiteKey, SearchDemandPriority[]> = {
  network: [
    {
      path: "/best/tp-link-deco-be67-vs-be63",
      queryFamily: "Deco BE63 vs BE67",
      decision: "Compare 2.5GbE, 10GbE, 6GHz, pack size, and wired-backhaul value.",
    },
    {
      path: "/guides/deco-be63-ethernet-backhaul-setup",
      queryFamily: "Deco Ethernet backhaul",
      decision: "Plan ports, switches, topology, and loop checks before buying more nodes.",
    },
    {
      path: "/guides/deco-be63-be67-two-pack-vs-three-pack",
      queryFamily: "Two-pack vs three-pack mesh",
      decision: "Choose node count from layout, wall loss, placement, and wired paths.",
    },
    {
      path: "/best/asus-zenwifi-bt6-vs-deco-be63",
      queryFamily: "ASUS ZenWiFi BT6 vs Deco BE63",
      decision: "Compare software control, multi-gig ports, 6GHz mesh, and setup flow.",
    },
    {
      path: "/reviews/tp-link-tl-sg105-m2-2-5g-switch",
      queryFamily: "Five-port 2.5GbE switch",
      decision: "Check uplink count, version identity, heat, noise, and NAS or mesh fit.",
    },
    {
      path: "/guides/is-deco-be67-worth-it-for-gigabit-internet",
      queryFamily: "Is Deco BE67 worth it?",
      decision: "Match internet speed and wired devices to the ports you can actually use.",
    },
  ],
  smarthome: [
    {
      path: "/best/ring-battery-doorbell-plus-2nd-gen-vs-tapo-d210",
      queryFamily: "Tapo D210 vs Ring Doorbell Plus",
      decision: "Compare local storage, subscription boundaries, power, and alert workflow.",
    },
    {
      path: "/guides/video-doorbell-battery-storage-subscription-guide",
      queryFamily: "Video doorbell storage and subscription",
      decision: "Choose wiring, battery, local storage, and paid features as one system.",
    },
    {
      path: "/reviews/ultraloq-bolt-se-smart-lock",
      queryFamily: "ULTRALOQ Bolt SE variants",
      decision: "Separate Matter and Wi-Fi versions, then check fingerprint and door fit.",
    },
    {
      path: "/best/best-tapo-matter-smart-plug-for-energy-or-compact-control",
      queryFamily: "Tapo P110M vs P125M",
      decision: "Choose energy monitoring or compact outlet fit without confusing variants.",
    },
    {
      path: "/reviews/x-sense-sws0a41-water-leak-detector-kit",
      queryFamily: "X-Sense leak detector kit",
      decision: "Check hub dependence, alert paths, sensor placement, and shutoff limits.",
    },
  ],
  homeoffice: [
    {
      path: "/best/logitech-litra-glow-vs-elgato-key-light-neo",
      queryFamily: "Litra Glow vs Key Light Neo",
      decision: "Compare mounting, controls, glare, desk footprint, and video-call use.",
    },
    {
      path: "/reviews/huanuo-titanlift-heavy-duty-monitor-arm",
      queryFamily: "TitanLift monitor arm fit",
      decision: "Match monitor weight, curve, pivot, VESA pattern, and desk clamp.",
    },
    {
      path: "/guides/monitor-arm-clamp-reinforcement-guide",
      queryFamily: "Monitor-arm clamp reinforcement",
      decision: "Check desktop material, thickness, edge shape, and pressure distribution.",
    },
    {
      path: "/reviews/urevo-smart-walking-pad",
      queryFamily: "UREVO walking pad review",
      decision: "Measure belt, step-up height, desk clearance, capacity, and return risk.",
    },
    {
      path: "/best/ergotron-hx-vs-huanuo-titanlift",
      queryFamily: "Ergotron HX vs TitanLift",
      decision: "Compare heavy-display fit, pivot needs, clamp geometry, and value.",
    },
  ],
  baby: [
    {
      path: "/reviews/momcozy-purehug-baby-carrier",
      queryFamily: "Momcozy PureHug review",
      decision: "Separate age and weight gates, positions, caregiver fit, and material variation.",
    },
    {
      path: "/guides/ergobaby-omni-breeze-positions-by-age",
      queryFamily: "Ergobaby positions by age",
      decision: "Use developmental readiness and the current manual for each position.",
    },
    {
      path: "/best/best-bottle-sterilizers-and-dryers",
      queryFamily: "Best bottle sterilizer and dryer",
      decision: "Compare capacity, drying bottlenecks, counter space, cycles, and cleaning.",
    },
    {
      path: "/reviews/dr-browns-all-in-one-sterilizer-dryer",
      queryFamily: "Dr. Brown's sterilizer dryer",
      decision: "Check bottle and pump-part fit, cycle workflow, drying, and descaling.",
    },
    {
      path: "/best/momcozy-purehug-vs-ergobaby-omni-breeze",
      queryFamily: "Momcozy PureHug vs Ergobaby Omni Breeze",
      decision: "Compare published positions, airflow, support, caregiver fit, and price.",
    },
  ],
  pet: [
    {
      path: "/reviews/levoit-vital-200s-p-air-purifier",
      queryFamily: "Levoit Vital 200S-P for pet homes",
      decision: "Check room fit, CADR context, filter cost, noise, hair, and odor limits.",
    },
    {
      path: "/reviews/furbo-360-dog-camera",
      queryFamily: "Furbo 360 dog camera",
      decision: "Compare subscription boundaries, treat use, alerts, placement, and Wi-Fi.",
    },
    {
      path: "/guides/furbo-360-placement-height-and-wifi-guide",
      queryFamily: "Furbo placement and Wi-Fi",
      decision: "Plan camera height, room coverage, power, signal, privacy, and pet access.",
    },
    {
      path: "/guides/automatic-feeder-cleaning-checklist",
      queryFamily: "Automatic feeder cleaning",
      decision: "Check removable food-contact parts, grease paths, drying, and backup routines.",
    },
    {
      path: "/guides/automatic-feeder-portion-size-guide",
      queryFamily: "Automatic feeder portion size",
      decision: "Calibrate real volume and daily meals instead of trusting portion labels.",
    },
    {
      path: "/best/best-pet-cameras-for-apartments",
      queryFamily: "Pet cameras for apartments",
      decision: "Compare privacy, placement, local storage, subscriptions, and neighbor noise.",
    },
  ],
  style: [],
  costume: [],
};

export function siteSearchDemandPriorities(site: SiteKey) {
  const expanded = [
    ...priorities[site],
    ...searchOpportunities
      .filter((item) => item.site === site)
      .map((item) => ({
        path: searchOpportunityPath(item),
        queryFamily: item.query,
        decision: item.answer,
      })),
  ];

  return expanded.filter((item, index) => expanded.findIndex((candidate) => candidate.path === item.path) === index);
}

export function prioritizeBySearchDemand<T>(site: SiteKey, items: T[], pathFor: (item: T) => string) {
  const rank = new Map(siteSearchDemandPriorities(site).map((item, index) => [item.path, index]));
  return items
    .map((item, index) => ({ item, index, rank: rank.get(pathFor(item)) ?? Number.POSITIVE_INFINITY }))
    .sort((left, right) => left.rank - right.rank || left.index - right.index)
    .map(({ item }) => item);
}
