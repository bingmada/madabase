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
    eyebrow: "Control paths before convenience",
    title: "Check garage and blind compatibility before adding automation",
    description: "Match the physical mechanism first, then decide whether direct Wi-Fi, Bluetooth, a hub, Matter, or manual fallback is enough.",
    links: [
      {
        href: "/reviews/meross-msg100-homekit-garage-door-opener",
        label: "Check Meross MSG100 compatibility",
        note: "Opener model, accessory, Wi-Fi, platforms, and fallback",
      },
      {
        href: "/reviews/switchbot-blind-tilt",
        label: "Check SwitchBot Blind Tilt fit",
        note: "Blind mechanism, Bluetooth, Hub 2, Matter, and manual use",
      },
      {
        href: "/guides/smart-garage-door-controller-compatibility-hub-offline-guide",
        label: "Map hub and offline behavior",
        note: "Trace the control path before installing a retrofit motor",
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
        href: "/reviews/emporia-vue-3-home-energy-monitor",
        label: "Check Emporia Vue 3 panel fit",
        note: "Electrician work, circuit clamps, cloud data, and outages",
      },
      {
        href: "/best/best-smart-water-shutoff-valves-retrofit-inline",
        label: "Compare automatic water shutoff approaches",
        note: "Retrofit actuators, inline systems, and manual fallback",
      },
      {
        href: "/guides/whole-home-energy-monitor-cloud-local-installation-guide",
        label: "Compare cloud and local energy data",
        note: "Installation, retention, outage behavior, and useful decisions",
      },
    ],
  },
  {
    site: "homeoffice",
    slug: "movement-ergonomic-fit",
    eyebrow: "Two computers, one desk",
    title: "Switch peripherals and add a portable second screen",
    description: "Separate USB sharing, display switching, charging, and portable-monitor video so every cable has one clear job.",
    links: [
      {
        href: "/reviews/ugreen-30768-usb-3-switch",
        label: "Check the UGREEN 30768 USB switch",
        note: "Four peripherals, two computers, no video switching",
      },
      {
        href: "/guides/usb-switch-vs-kvm-vs-dock-guide",
        label: "Choose USB switch, KVM, or dock",
        note: "Map peripherals, displays, Ethernet, and charging",
      },
      {
        href: "/reviews/asus-zenscreen-mb16acv-portable-monitor",
        label: "Check ZenScreen host compatibility",
        note: "DP Alt Mode, DisplayLink, power, and missing HDMI",
      },
    ],
  },
  {
    site: "homeoffice",
    slug: "calls-compact-lighting",
    eyebrow: "Calls without a crowded desk",
    title: "Build a compact camera, light, and audio setup",
    description: "Treat framing, glare, room pickup, privacy, and cable routing as one meeting system.",
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
        href: "/reviews/jabra-speak2-40-usb-speakerphone",
        label: "Check Jabra Speak2 40 room fit",
        note: "Wired USB, pickup radius, privacy, and UC variant",
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
        href: "/reviews/momcozy-mw05-portable-milk-warmer",
        label: "Check a portable direct-contact warmer",
        note: "Heating path, battery cycles, transfer, and cleaning",
      },
      {
        href: "/guides/bottle-washer-vs-sterilizer-vs-dryer-guide",
        label: "Separate washing, sterilizing, and drying",
        note: "Decide which labor bottleneck the appliance must solve",
      },
      {
        href: "/reviews/boon-lawn-bottle-drying-rack",
        label: "Plan bottle drying and storage",
        note: "Counter space, airflow, rack cleaning, and protected storage",
      },
    ],
  },
  {
    site: "baby",
    slug: "carrier-travel-fit",
    eyebrow: "Recurring nursery cost",
    title: "Compare diaper-pail bags and travel feeding upkeep",
    description: "Count real bag changes, cleaning steps, battery cycles, and storage space instead of stopping at purchase price.",
    links: [
      {
        href: "/reviews/ubbi-steel-diaper-pail",
        label: "Check the Ubbi standard-bag system",
        note: "Steel body, 13-gallon bags, cleaning, and odor routine",
      },
      {
        href: "/guides/diaper-pail-replacement-bag-annual-cost-guide",
        label: "Calculate annual pail bag cost",
        note: "Use real change frequency and current refill pack counts",
      },
      {
        href: "/guides/travel-bottle-warmer-heating-cleaning-battery-guide",
        label: "Plan the full travel warming cycle",
        note: "Heat, temperature check, clean, dry, recharge, and repeat",
      },
    ],
  },
  {
    site: "pet",
    slug: "feeding-hydration-routines",
    eyebrow: "Care equipment the pet must accept",
    title: "Plan grooming noise and GPS recovery together",
    description: "Match sound, coat, collar fit, cellular coverage, subscription cost, and a calm introduction to the individual pet.",
    links: [
      {
        href: "/reviews/neakasa-p1-pro-pet-grooming-vacuum",
        label: "Check Neakasa P1 Pro pet fit",
        note: "Noise, suction, coat tools, dust cup, and gradual introduction",
      },
      {
        href: "/reviews/tractive-dog-6-gps-tracker",
        label: "Check Tractive DOG 6 total cost",
        note: "Subscription, coverage, battery, collar fit, and recovery",
      },
      {
        href: "/guides/pet-gps-tracker-subscription-cost-coverage-guide",
        label: "Compare GPS coverage and billed plans",
        note: "Model a full term, renewal, weak-signal routes, and backup ID",
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
        href: "/guides/automatic-litter-box-accessories-cost-guide",
        label: "Budget litter-box accessories",
        note: "Liners, litter, steps, mats, deodorizers, and backup box",
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
        href: "/guides/halloween-fog-machine-lighting-power-guide",
        label: "Plan fog, lighting, and power",
        note: "Visibility, rated fluid, cables, weather, and shutdown",
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
        href: "/guides/special-effects-makeup-skin-contact-removal-guide",
        label: "Plan special-effects makeup safely",
        note: "Skin-contact materials, patch directions, removal, and cleanup",
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
