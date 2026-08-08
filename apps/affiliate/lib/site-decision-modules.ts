import type { SiteKey } from "./types";

export type SiteDecisionModule = {
  site: SiteKey;
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  links: Array<{
    href: string;
    label: string;
    note: string;
  }>;
};

// These modules widen homepage discovery without creating another URL or
// changing the query target, merchant, or evidence on the linked pages.
const decisionModules: SiteDecisionModule[] = [
  {
    site: "network",
    slug: "mesh-backhaul-plan",
    eyebrow: "Coverage before the router box",
    title: "Plan mesh nodes, wired backhaul, and multigig ports",
    description: "Start with the home layout, Ethernet paths, and internet tier so the mesh kit and pack size solve the right bottleneck.",
    links: [
      {
        href: "/best/tp-link-deco-be67-vs-be63",
        label: "Compare Deco BE67 and BE63",
        note: "Wireless bands, port layout, backhaul, and value",
      },
      {
        href: "/guides/deco-be63-be67-two-pack-vs-three-pack",
        label: "Choose a two-pack or three-pack",
        note: "Floor plan, node spacing, overlap, and dead zones",
      },
      {
        href: "/tools/mesh-node-and-backhaul-planner",
        label: "Plan nodes and backhaul",
        note: "Map rooms, floors, Ethernet, and likely node count",
      },
    ],
  },
  {
    site: "network",
    slug: "wired-poe-resilience",
    eyebrow: "The network behind the Wi-Fi",
    title: "Build a wired, powered, and outage-ready core",
    description: "Connect switch ports, PoE demand, cameras, access points, and backup runtime before buying infrastructure one device at a time.",
    links: [
      {
        href: "/best/best-fanless-2-5gbe-switches-home-nas-mesh",
        label: "Compare fanless 2.5GbE switches",
        note: "Port count, thermals, NAS links, and mesh backhaul",
      },
      {
        href: "/best/best-poe-switches-for-home-cameras-and-access-points",
        label: "Choose a home PoE switch",
        note: "Power budget, port mix, cameras, and access points",
      },
      {
        href: "/best/best-ups-for-router-and-modem",
        label: "Keep the modem and router online",
        note: "Load, runtime, outlets, and realistic outage coverage",
      },
    ],
  },
  {
    site: "smarthome",
    slug: "local-security-access",
    eyebrow: "Security without hidden costs",
    title: "Build a local-first entry and camera plan",
    description: "Compare recording, subscriptions, power, door fit, and fallback access as one household system.",
    links: [
      {
        href: "/best/eufy-e340-vs-ring-battery-doorbell-plus",
        label: "Compare eufy E340 and Ring",
        note: "Local storage, dual-camera coverage, and plan costs",
      },
      {
        href: "/best/schlage-encode-plus-vs-aqara-u100",
        label: "Compare Schlage Encode Plus and Aqara U100",
        note: "Home Key, fingerprint entry, hubs, and door fit",
      },
      {
        href: "/guides/video-doorbell-battery-storage-subscription-guide",
        label: "Plan doorbell power, storage, and alerts",
        note: "Choose the operating model before the camera",
      },
    ],
  },
  {
    site: "smarthome",
    slug: "matter-energy-water",
    eyebrow: "Utilities that respond",
    title: "Connect Matter control, energy data, and water protection",
    description: "Start with infrastructure and failure response before adding another isolated smart-home device.",
    links: [
      {
        href: "/best/aqara-fp300-vs-fp2",
        label: "Choose an Aqara presence sensor",
        note: "Battery power, room zones, Thread, Zigbee, and Wi-Fi",
      },
      {
        href: "/best/best-smart-water-shutoff-valves-retrofit-inline",
        label: "Compare automatic water shutoff approaches",
        note: "Retrofit actuators, inline systems, and manual fallback",
      },
      {
        href: "/tools/matter-thread-compatibility-checker",
        label: "Check Matter and Thread infrastructure",
        note: "Controllers, border routers, hubs, and device paths",
      },
    ],
  },
  {
    site: "homeoffice",
    slug: "movement-ergonomic-fit",
    eyebrow: "Movement that fits the desk",
    title: "Plan a stable sit-stand and walking setup",
    description: "Treat desk height, monitor support, floor movement, and cable travel as one ergonomic system.",
    links: [
      {
        href: "/best/best-walking-pad-and-monitor-arm-setup",
        label: "Compare walking-pad and monitor-arm setups",
        note: "Display weight, wobble, belt space, and desk clearance",
      },
      {
        href: "/guides/standing-desk-casters-stability-guide",
        label: "Check standing-desk caster stability",
        note: "Added height, wheel locks, cables, and floor movement",
      },
      {
        href: "/tools/desk-height-calculator",
        label: "Calculate sitting and standing desk height",
        note: "Use body measurements before buying furniture",
      },
    ],
  },
  {
    site: "homeoffice",
    slug: "calls-compact-lighting",
    eyebrow: "Calls without a crowded desk",
    title: "Build a compact lighting and meeting setup",
    description: "Compare mounting, glare, controls, and desk footprint instead of choosing a light from brightness alone.",
    links: [
      {
        href: "/best/logitech-mx-brio-vs-insta360-link-2",
        label: "Choose a fixed or tracking webcam",
        note: "4K modes, privacy, framing, and presenter movement",
      },
      {
        href: "/best/logitech-litra-glow-vs-elgato-key-light-neo",
        label: "Compare Litra Glow and Key Light Neo",
        note: "Mounting, controls, glare, and everyday call use",
      },
      {
        href: "/guides/key-light-for-glasses-glare-placement",
        label: "Reduce glasses glare before buying more lights",
        note: "Placement, height, angle, and screen reflections",
      },
    ],
  },
  {
    site: "baby",
    slug: "feeding-cleanup-workflow",
    eyebrow: "A cleaner feeding workflow",
    title: "Match washing, sterilizing, drying, and counter space",
    description: "Choose the appliance around the real bottle and pump-part cycle rather than one headline feature.",
    links: [
      {
        href: "/best/philips-avent-scf358-vs-baby-brezza-smart-bottle-warmer",
        label: "Compare bottle warmers",
        note: "Water bath, steam, controls, alerts, and safe-use checks",
      },
      {
        href: "/guides/bottle-washer-vs-sterilizer-vs-dryer-guide",
        label: "Separate washing, sterilizing, and drying",
        note: "Decide which labor bottleneck the appliance must solve",
      },
      {
        href: "/guides/bottle-sterilizer-hard-water-descaling-guide",
        label: "Plan for hard water and descaling",
        note: "Mineral buildup, cleaning access, and maintenance time",
      },
    ],
  },
  {
    site: "baby",
    slug: "carrier-travel-fit",
    eyebrow: "Fit before features",
    title: "Choose carrier positions and travel gear by readiness",
    description: "Keep developmental limits, caregiver fit, folded size, and the actual trip in the same decision path.",
    links: [
      {
        href: "/best/best-baby-carriers-by-age-and-position",
        label: "Compare carriers by age and position",
        note: "Newborn fit, inward carry, outward readiness, hip, and back carry",
      },
      {
        href: "/guides/ergobaby-omni-breeze-positions-by-age",
        label: "Check Omni Breeze positions by age",
        note: "Use the current manual and developmental readiness",
      },
      {
        href: "/guides/travel-stroller-folded-size-checklist",
        label: "Measure a travel stroller before the trip",
        note: "Folded size, carry policy, storage, and toddler fit",
      },
    ],
  },
  {
    site: "pet",
    slug: "feeding-hydration-routines",
    eyebrow: "Daily routines that still need checking",
    title: "Plan feeding access, portions, and hydration together",
    description: "Match the feeder or fountain to the pet, food, cleaning routine, backup plan, and multi-pet household.",
    links: [
      {
        href: "/best/best-automatic-cat-feeders",
        label: "Compare automatic cat feeders",
        note: "Schedules, portions, backup power, and cleaning",
      },
      {
        href: "/best/petlibro-one-rfid-vs-granary-smart-feeder",
        label: "Choose access control or simple scheduling",
        note: "RFID collar access, shared bowls, and routine fit",
      },
      {
        href: "/guides/cat-water-fountain-buying-guide",
        label: "Plan a cat water-fountain routine",
        note: "Capacity, filters, pump access, cleaning, and backup water",
      },
    ],
  },
  {
    site: "pet",
    slug: "monitoring-air-odor",
    eyebrow: "Monitor the pet and the room",
    title: "Connect cameras, air cleaning, and odor control",
    description: "Separate what the camera can show from what ventilation, filtration, litter care, and source control must solve.",
    links: [
      {
        href: "/best/neakasa-m1-plus-vs-petkit-puramax-2",
        label: "Compare automatic litter boxes",
        note: "Open or enclosed entry, cat limits, litter, and fallback",
      },
      {
        href: "/best/coway-mighty2-vs-winix-5510-vs-levoit-vital-200s",
        label: "Compare air purifiers for pet homes",
        note: "Room size, particle CADR, filters, noise, and odor limits",
      },
      {
        href: "/guides/apartment-litter-odor-control-guide",
        label: "Build an apartment litter-odor plan",
        note: "Source control, airflow, cleaning, and realistic filter expectations",
      },
    ],
  },
  {
    site: "costume",
    slug: "scene-props-planning",
    eyebrow: "Build the scene before buying the prop",
    title: "Plan space, power, timing, and storage for Halloween",
    description: "Treat a large prop as a seasonal setup with delivery, footprint, anchoring, power, weather, and off-season storage requirements.",
    links: [
      {
        href: "/guides/large-prop-animatronic-space-and-power-checklist",
        label: "Check animatronic space and power",
        note: "Footprint, ceiling height, outlets, anchoring, and weather",
      },
      {
        href: "/guides/when-to-order-a-halloween-costume",
        label: "Work backward from the event date",
        note: "Delivery, try-on, exchanges, alterations, and backup time",
      },
      {
        href: "/guides/costume-prop-care-and-storage-guide",
        label: "Protect props between events",
        note: "Cleaning, drying, batteries, packing, and storage space",
      },
    ],
  },
  {
    site: "costume",
    slug: "fit-finish-repeat-use",
    eyebrow: "A look that survives the whole event",
    title: "Resolve fit, materials, visibility, and finish",
    description: "Combine measurements, mask comfort, hair, makeup, and repeat-use care before committing to a complete character look.",
    links: [
      {
        href: "/guides/costume-sizing-measurements-and-returns",
        label: "Measure for costume sizing and returns",
        note: "Body measurements, garment ease, layers, and return windows",
      },
      {
        href: "/guides/mask-and-prosthetic-fit-materials-guide",
        label: "Check mask and prosthetic fit",
        note: "Materials, ventilation, visibility, adhesives, and skin contact",
      },
      {
        href: "/guides/wig-facial-hair-and-makeup-planning-guide",
        label: "Coordinate wig, facial hair, and makeup",
        note: "Attachment order, color matching, wear time, and cleanup",
      },
    ],
  },
];

export function siteDecisionModules(site: SiteKey) {
  return decisionModules.filter((module) => module.site === site);
}
