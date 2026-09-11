import { siteGuides, siteProducts, siteRoundups } from "./content";
import { portfolioRankingOpportunities, portfolioRankingRefreshAt } from "./portfolio-ranking-opportunities";
import type { SiteKey } from "./types";

export type SearchOpportunityKind = "product" | "guide" | "roundup";

export type SearchOpportunity = {
  site: SiteKey;
  kind: SearchOpportunityKind;
  slug: string;
  query: string;
  answer: string;
  updatedAt: string;
  preferredPaths?: string[];
};

export type SearchOpportunityLink = {
  href: string;
  label: string;
  description: string;
};

const updatedAt = "July 23, 2026";
const decoClusterUpdatedAt = "July 28, 2026";
const portfolioBatchUpdatedAt = "July 28, 2026";
const cohortReviewUpdatedAt = "August 6, 2026";
const rankingReviewUpdatedAt = "August 13, 2026";
const decoBe25IntentRepairUpdatedAt = "August 20, 2026";
const pageOneCtrUpdatedAt = "September 11, 2026";

export const searchOpportunities: SearchOpportunity[] = [
  {
    site: "network",
    kind: "product",
    slug: "tp-link-deco-be67-wifi-7-mesh",
    query: "Is Deco BE67 worth buying instead of BE63 or BE85?",
    answer: "Choose BE67 when a 10GbE WAN/LAN path and faster wired backhaul will be used now. BE63 is usually the better value for a 2.5GbE home, while BE85 makes sense only when its extra radio and port capacity solve a measured bottleneck.",
    updatedAt,
    preferredPaths: ["/guides/deco-be63-vs-be67-vs-be85-buying-guide", "/best/deco-be25-vs-be67"],
  },
  {
    site: "network",
    kind: "product",
    slug: "tp-link-deco-be25-wifi-7-mesh",
    query: "Is Deco BE25 a good fit for a wired-backhaul Wi-Fi 7 home?",
    answer: "Deco BE25 is a strong value fit when two 2.5GbE ports per node are enough and Ethernet can carry backhaul. Check the planned node count, cable path, client mix, room placement, and exact pack before buying; use the dedicated BE25-versus-BE63 comparison only when 6GHz or four ports per node is the actual decision.",
    updatedAt: decoBe25IntentRepairUpdatedAt,
    preferredPaths: ["/best/deco-be25-vs-be63", "/guides/deco-be63-ethernet-backhaul-setup", "/reviews/tp-link-deco-be63-wifi-7-mesh"],
  },
  {
    site: "network",
    kind: "product",
    slug: "tp-link-deco-be63-wifi-7-mesh",
    query: "Does Deco BE63 have a more useful port layout than BE67?",
    answer: "BE63 provides four equal 2.5GbE ports per node, while BE67 provides one 10GbE, one 2.5GbE, and one 1GbE port. BE63 is often easier for several multi-gig wired devices; BE67 is the better fit only when its single 10GbE path or higher wireless capacity has a defined job.",
    updatedAt: decoClusterUpdatedAt,
    preferredPaths: ["/best/tp-link-deco-be67-vs-be63", "/guides/deco-be63-multigig-ports-guide", "/reviews/tp-link-deco-be67-wifi-7-mesh"],
  },
  {
    site: "network",
    kind: "roundup",
    slug: "tp-link-deco-be67-vs-be63",
    query: "Deco BE63 or BE67: which Ethernet ports are more useful?",
    answer: "Choose BE63 for several 2.5GbE devices because every node has four 2.5GbE ports. Choose BE67 when one 10GbE connection per node serves a real WAN, NAS, workstation, switch, or backhaul path; its other ports are one 2.5GbE and one 1GbE, so it is not a universal port-count upgrade.",
    updatedAt: decoClusterUpdatedAt,
    preferredPaths: ["/reviews/tp-link-deco-be63-wifi-7-mesh", "/reviews/tp-link-deco-be67-wifi-7-mesh", "/guides/deco-be67-10gbe-network-checklist"],
  },
  {
    site: "network",
    kind: "roundup",
    slug: "deco-be25-vs-be63",
    query: "Deco BE25 vs BE63: is 6GHz or four 2.5GbE ports worth the upgrade?",
    answer: "Choose BE63 when 6GHz improves a viable wireless-backhaul path, current 6GHz clients need that band, or four 2.5GbE ports per node avoid another switch. Choose BE25 when Ethernet carries backhaul, two ports per node are enough, and lower cost matters more than a third wireless band.",
    updatedAt: decoBe25IntentRepairUpdatedAt,
    preferredPaths: ["/reviews/tp-link-deco-be25-wifi-7-mesh", "/reviews/tp-link-deco-be63-wifi-7-mesh", "/guides/deco-be63-ethernet-backhaul-setup"],
  },
  {
    site: "network",
    kind: "guide",
    slug: "deco-be63-ethernet-backhaul-setup",
    query: "Will Deco BE63 Ethernet backhaul stay at 2.5Gbps through a switch?",
    answer: "Only when every negotiated hop supports 2.5Gbps: both Deco ports, the switch ports, wall terminations, cables, and any adapters. A gigabit switch or bad two-pair link caps that branch, and the switch must remain on the correct LAN-side topology to avoid loops in router mode.",
    updatedAt: decoClusterUpdatedAt,
    preferredPaths: ["/guides/deco-be63-multigig-ports-guide", "/reviews/tp-link-deco-be63-wifi-7-mesh", "/best/tp-link-deco-be67-vs-be63"],
  },
  {
    site: "network",
    kind: "guide",
    slug: "deco-be63-be67-two-pack-vs-three-pack",
    query: "Should you start with two or three Deco BE63 or BE67 nodes?",
    answer: "Start with two nodes when the main unit and one well-connected satellite cover the measured zones. Add a third only for a separate floor or wing with a strong upstream link or Ethernet; an extra node placed inside a dead zone can add roaming and airtime complexity without improving performance.",
    updatedAt: decoClusterUpdatedAt,
    preferredPaths: ["/guides/deco-be63-ethernet-backhaul-setup", "/best/tp-link-deco-be67-vs-be63", "/guides/is-deco-be67-worth-it-for-gigabit-internet"],
  },
  {
    site: "network",
    kind: "guide",
    slug: "is-deco-be67-worth-it-for-gigabit-internet",
    query: "Is Deco BE67 worth buying for a 1Gbps internet plan?",
    answer: "Usually not for internet speed alone. It can still make sense for demanding wireless backhaul, dense compatible clients, or a dated 5Gbps, 10Gbps, NAS, or switch upgrade, but BE63 normally offers enough headroom and more flexible 2.5GbE connectivity for a gigabit home.",
    updatedAt: decoClusterUpdatedAt,
    preferredPaths: ["/best/tp-link-deco-be67-vs-be63", "/reviews/tp-link-deco-be67-wifi-7-mesh", "/reviews/tp-link-deco-be63-wifi-7-mesh"],
  },
  {
    site: "network",
    kind: "guide",
    slug: "deco-be67-10gbe-network-checklist",
    query: "Can one Deco BE67 node dedicate 10GbE to both WAN and LAN?",
    answer: "No. Each BE67 node has one 10GbE port, so the primary node cannot use that same port as both a 10GbE WAN connection and a separate 10GbE LAN connection. Draw the modem, switch, backhaul, NAS, and client path first, then account for the remaining 2.5GbE and 1GbE ports.",
    updatedAt: decoClusterUpdatedAt,
    preferredPaths: ["/best/tp-link-deco-be67-vs-be63", "/reviews/tp-link-deco-be67-wifi-7-mesh", "/guides/deco-be63-multigig-ports-guide"],
  },
  {
    site: "baby",
    kind: "guide",
    slug: "ergobaby-omni-breeze-positions-by-age",
    query: "Which Ergobaby Omni Breeze position is appropriate at each age?",
    answer: "Start with front-inward carry after the baby meets the listed newborn minimums. Outward, hip, and back carry depend on head control, height, weight, and sitting milestones rather than age alone, so confirm every milestone in the current Ergobaby instructions before changing position.",
    updatedAt,
    preferredPaths: ["/reviews/ergobaby-omni-breeze-carrier", "/guides/ergobaby-omni-breeze-newborn-fit-checklist"],
  },
  {
    site: "pet",
    kind: "product",
    slug: "furbo-360-dog-camera",
    query: "Does Furbo 360 work without a Furbo Nanny subscription?",
    answer: "The standalone Furbo 360 keeps live view, two-way audio, treat tossing, bark alerts, and live-view tracking without Nanny. Pay for Nanny only when automatic cloud clips and advanced alerts justify the recurring cost, and verify that the selected listing is not a subscription-required bundle.",
    updatedAt,
    preferredPaths: ["/guides/furbo-360-placement-height-and-wifi-guide", "/best/furbo-360-vs-wyze-cam-pan-v3-for-pets"],
  },
  {
    site: "network",
    kind: "guide",
    slug: "ethernet-stuck-at-100-mbps-guide",
    query: "Why is an Ethernet link stuck at 100 Mbps?",
    answer: "A 100 Mbps negotiation usually points to a damaged or two-pair cable, a 100 Mbps port, a bad wall termination, or adapter settings. Replace the shortest patch cable first, confirm both port specifications, then test the negotiated local link before blaming the internet plan.",
    updatedAt,
    preferredPaths: ["/guides/home-ethernet-switch-guide", "/reviews/tp-link-tl-sg105-m2-2-5g-switch", "/guides/usb-c-ethernet-adapter-guide"],
  },
  {
    site: "baby",
    kind: "product",
    slug: "ergobaby-omni-breeze-carrier",
    query: "Is Ergobaby Omni Breeze suitable for a newborn?",
    answer: "It can be used from Ergobaby's listed newborn minimum only in the correct inward-facing setup with the seat and head support adjusted to the baby's size. It is not a blanket approval for every newborn, every caregiver body, or outward-facing carry.",
    updatedAt,
    preferredPaths: ["/guides/ergobaby-omni-breeze-positions-by-age", "/guides/ergobaby-omni-breeze-newborn-fit-checklist"],
  },
  {
    site: "homeoffice",
    kind: "product",
    slug: "branch-ergonomic-chair",
    query: "Is the Branch Ergonomic Chair a good fit, and what does its warranty cover?",
    answer: "Branch lists a seven-year parts-and-components warranty and 30-day direct return window, but seller authorization, proof, original packaging, and return fees matter.",
    updatedAt: pageOneCtrUpdatedAt,
    preferredPaths: ["/best/best-ergonomic-chairs-under-500", "/reviews/hon-ignition-2-0-chair", "/guides/ergonomic-kneeling-chairs-buying-guide"],
  },
  {
    site: "homeoffice",
    kind: "product",
    slug: "hon-ignition-2-0-chair",
    query: "What warranty and controls come with the HON Ignition 2.0 configuration?",
    answer: "Treat Ignition 2.0 as a configurable chair family: verify the exact arms, lumbar, seat depth, tilt, seller, warranty eligibility, and return path before buying.",
    updatedAt: pageOneCtrUpdatedAt,
    preferredPaths: ["/best/best-ergonomic-chairs-under-500", "/reviews/branch-ergonomic-chair", "/guides/ergonomic-kneeling-chairs-buying-guide"],
  },
  {
    site: "network",
    kind: "guide",
    slug: "deco-be63-vs-be67-vs-be85-buying-guide",
    query: "Should you buy Deco BE63, BE67, or BE85?",
    answer: "BE63 is the value choice for most multi-gig homes, BE67 is the step up when 10GbE wired paths matter, and BE85 is for demanding wireless backhaul or very fast local networks. Decide from ports, backhaul, and client capability rather than the largest advertised Wi-Fi number.",
    updatedAt,
    preferredPaths: ["/reviews/tp-link-deco-be67-wifi-7-mesh", "/reviews/tp-link-deco-be25-wifi-7-mesh"],
  },
  {
    site: "pet",
    kind: "roundup",
    slug: "coway-mighty2-vs-winix-5510-vs-levoit-vital-200s",
    query: "Which air purifier is the best fit for a pet home?",
    answer: "Choose by room size at a realistic fan speed, replacement-filter cost, washable prefilter access, and odor expectations. Levoit favors app control and a pet-oriented intake, Coway favors a simple proven layout, and Winix adds its own control and filtration trade-offs.",
    updatedAt,
    preferredPaths: ["/reviews/levoit-vital-200s-p-air-purifier", "/best/levoit-vital-200s-p-vs-shark-neverchange-max", "/guides/air-purifier-placement-near-litter-box"],
  },
  {
    site: "smarthome",
    kind: "product",
    slug: "aqara-door-and-window-sensor-p2",
    query: "Does the Aqara Door and Window Sensor P2 require an Aqara hub?",
    answer: "P2 uses Matter over Thread, so it needs a compatible Matter controller and Thread border router, not necessarily an Aqara hub. An Aqara hub may add vendor-specific functions, but the basic purchase decision starts with the controller and Thread infrastructure already in the home.",
    updatedAt,
    preferredPaths: ["/guides/matter-controller-vs-thread-border-router", "/guides/matter-vs-thread-vs-zigbee"],
  },
  {
    site: "network",
    kind: "product",
    slug: "asus-zenwifi-bt6-wifi-7-mesh",
    query: "Does ASUS ZenWiFi BT6 provide 2.5GbE for both WAN and Ethernet backhaul?",
    answer: "ASUS's US specifications list one 2.5GbE WAN port and three 1GbE LAN ports on each BT6 unit. Choose BT6 for ASUS controls and tri-band Wi-Fi 7, but draw the WAN and Ethernet-backhaul path first; do not assume that a second multi-gig Ethernet port remains available.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/best/best-mesh-wifi-for-apartments-and-homes", "/guides/mesh-wifi-node-placement-guide", "/guides/wifi-7-vs-wifi-6-guide"],
  },
  {
    site: "smarthome",
    kind: "product",
    slug: "aqara-hub-m3",
    query: "Is Aqara Hub M3 worth upgrading to from M2?",
    answer: "Upgrade when Thread border-router capability, Matter bridging, PoE, local automation, or newer device support solves a real gap. Keep M2 when the current Zigbee devices and automations are stable and none of those additions changes the household's daily control path.",
    updatedAt,
    preferredPaths: ["/guides/aqara-hub-m3-vs-m2", "/guides/aqara-hub-m3-matter-thread-setup"],
  },
  {
    site: "pet",
    kind: "product",
    slug: "petlibro-granary-automatic-cat-feeder",
    query: "Which PETLIBRO Granary size and portion setting should you choose?",
    answer: "Confirm whether the listing is the 3L or 5L model and weigh several real dispenses of the pet's kibble. PETLIBRO portions are volumetric, so capacity and portion count should be set from the food, feeding schedule, and backup-power needs rather than the family name.",
    updatedAt,
    preferredPaths: ["/guides/automatic-feeder-portion-size-guide", "/guides/automatic-feeder-cleaning-checklist", "/reviews/petlibro-one-rfid-smart-feeder"],
  },
  {
    site: "smarthome",
    kind: "product",
    slug: "eufy-video-doorbell-e340",
    query: "Can eufy E340 work without a subscription?",
    answer: "E340 can use local storage without a required monthly plan when paired with the supported storage path. Confirm what storage hardware is included, which AI or history features remain local, and whether the dual-camera view solves the actual package-area blind spot.",
    updatedAt,
    preferredPaths: ["/guides/eufy-e340-local-storage-and-homebase-guide", "/best/eufy-e340-vs-tapo-d210", "/guides/video-doorbell-battery-storage-subscription-guide"],
  },
  {
    site: "smarthome",
    kind: "guide",
    slug: "aqara-hub-m3-matter-thread-setup",
    query: "How should Aqara Hub M3 be set up for Matter and Thread?",
    answer: "Update the hub first, connect it by stable Ethernet or PoE when practical, add it to the primary Aqara home, and then commission Matter ecosystems one at a time. Preserve existing M2 automations until device migration and fallback controls have been tested.",
    updatedAt,
    preferredPaths: ["/reviews/aqara-hub-m3", "/guides/aqara-hub-m3-vs-m2"],
  },
  {
    site: "smarthome",
    kind: "guide",
    slug: "aqara-hub-m3-vs-m2",
    query: "What is the practical difference between Aqara Hub M3 and M2?",
    answer: "M3 adds Thread-border-router, newer Matter, PoE, and stronger local-control capabilities. M2 remains adequate for a stable Aqara Zigbee installation, so the upgrade is justified by a missing role or migration need—not simply because M3 is newer.",
    updatedAt,
    preferredPaths: ["/reviews/aqara-hub-m3", "/guides/aqara-hub-m3-matter-thread-setup"],
  },
  {
    site: "baby",
    kind: "guide",
    slug: "ergobaby-omni-breeze-cleaning-guide",
    query: "How do you wash and dry an Ergobaby Omni Breeze?",
    answer: "Fasten buckles, use the manufacturer-approved gentle wash settings and mild detergent, then air-dry fully before reuse. Spot cleaning between washes protects the carrier from unnecessary wear, while heat and harsh products can damage mesh, straps, or padding.",
    updatedAt,
    preferredPaths: ["/reviews/ergobaby-omni-breeze-carrier", "/guides/ergobaby-omni-breeze-positions-by-age"],
  },
  {
    site: "baby",
    kind: "guide",
    slug: "ergobaby-omni-breeze-newborn-fit-checklist",
    query: "How can you check newborn fit in an Ergobaby Omni Breeze?",
    answer: "Confirm the listed weight and height minimums, use front-inward carry, support the head and neck, keep the face visible, and adjust the seat width for the baby's size. Recheck the airway, leg position, panel height, and waistband after every adjustment.",
    updatedAt,
    preferredPaths: ["/reviews/ergobaby-omni-breeze-carrier", "/guides/ergobaby-omni-breeze-positions-by-age"],
  },
  {
    site: "homeoffice",
    kind: "product",
    slug: "ergear-48x24-electric-standing-desk",
    query: "Is a 48×24 ErGear standing desk large enough for a small office?",
    answer: "A 48×24 top can work for one monitor or a compact dual-screen layout when the keyboard, arm clamp, wall clearance, and walking path are measured together. Skip it when large speakers, deep monitor stands, or paper-heavy work need more depth.",
    updatedAt,
    preferredPaths: ["/best/ergear-48x24-vs-flexispot-e7-mini", "/best/best-standing-desks-for-small-spaces", "/guides/48-vs-55-inch-desk-guide"],
  },
  {
    site: "pet",
    kind: "roundup",
    slug: "levoit-vital-200s-p-vs-shark-neverchange-max",
    query: "Levoit Vital 200S-P or Shark NeverChange MAX for pets?",
    answer: "Levoit is easier to justify when a washable prefilter, app controls, and conventional replacement filters fit the routine. Shark's long-life-filter proposition is attractive only after checking the exact model, room size, odor expectations, and what its filter-life claim excludes.",
    updatedAt,
    preferredPaths: ["/reviews/levoit-vital-200s-p-air-purifier", "/best/coway-mighty2-vs-winix-5510-vs-levoit-vital-200s", "/guides/levoit-vital-200s-p-filter-cost-and-maintenance"],
  },
  {
    site: "pet",
    kind: "product",
    slug: "petlibro-one-rfid-smart-feeder",
    query: "Is PETLIBRO One RFID suitable for a multi-cat home?",
    answer: "It helps when one tagged pet needs controlled access to dry food, but each pet's behavior, collar-tag tolerance, bowl guarding, and portion plan still need testing. Compare it with an implanted-microchip feeder when relying on a removable collar tag is the main concern.",
    updatedAt,
    preferredPaths: ["/guides/rfid-feeder-vs-microchip-feeder-guide", "/guides/automatic-feeder-portion-size-guide", "/reviews/petlibro-granary-automatic-cat-feeder"],
  },
  {
    site: "network",
    kind: "guide",
    slug: "deco-mesh-connection-drops-troubleshooting",
    query: "How do you troubleshoot repeated Deco mesh connection drops?",
    answer: "First identify whether the client, satellite, local LAN, DNS, modem, or internet path is dropping. Then update firmware, test a wired client, move the satellite closer, remove suspect loops, and change only one variable before measuring again.",
    updatedAt,
    preferredPaths: ["/guides/mesh-wifi-node-placement-guide", "/guides/deco-be63-ethernet-backhaul-setup", "/reviews/tp-link-deco-be63-wifi-7-mesh"],
  },
  {
    site: "pet",
    kind: "guide",
    slug: "air-purifier-placement-near-litter-box",
    query: "Where should an air purifier be placed near a litter box?",
    answer: "Place it close enough to capture airborne dust and odor without aiming strong airflow directly across the litter. Leave the manufacturer's intake and outlet clear, avoid a damp or dirty corner, and keep the unit accessible for prefilter cleaning.",
    updatedAt,
    preferredPaths: ["/reviews/levoit-vital-200s-p-air-purifier", "/best/coway-mighty2-vs-winix-5510-vs-levoit-vital-200s", "/guides/levoit-vital-200s-p-filter-cost-and-maintenance"],
  },
  {
    site: "homeoffice",
    kind: "product",
    slug: "ergotron-hx-monitor-arm",
    query: "Is Ergotron HX the right monitor arm for a walking desk?",
    answer: "HX is appropriate for a heavy display that falls inside the exact weight, VESA, and size limits, provided the desk edge can support the clamp. A lighter screen may be harder to balance, and walking vibration still depends on the desk frame and mounting point.",
    updatedAt,
    preferredPaths: ["/best/best-walking-pad-and-monitor-arm-setup", "/guides/single-vs-dual-monitor-arm-walking-desk", "/guides/walking-pad-speed-monitor-stability-guide"],
  },
  {
    site: "smarthome",
    kind: "roundup",
    slug: "ultraloq-bolt-se-vs-aqara-u400",
    query: "ULTRALOQ Bolt SE or Aqara U400: which smart lock fits the door and ecosystem?",
    answer: "Choose Bolt SE when straightforward fingerprint access and its ecosystem fit matter most. Choose U400 when its newer entry methods and Aqara/Matter direction solve a real need, after verifying door fit, hub requirements, fallback entry, and region-specific feature support.",
    updatedAt,
    preferredPaths: ["/reviews/ultraloq-bolt-se-smart-lock", "/reviews/aqara-smart-lock-u400", "/guides/smart-lock-door-fit-hub-compatibility"],
  },
  {
    site: "baby",
    kind: "guide",
    slug: "ergobaby-omni-breeze-forward-facing-age-guide",
    query: "When can a baby face outward in Ergobaby Omni Breeze?",
    answer: "Outward-facing carry begins only after strong head and neck control and the current height and weight requirements are met, commonly around five to six months. Keep sessions short, watch the baby's cues, and return to inward carry when overstimulated or tired.",
    updatedAt: pageOneCtrUpdatedAt,
    preferredPaths: ["/reviews/ergobaby-omni-breeze-carrier", "/guides/ergobaby-omni-breeze-positions-by-age"],
  },
  {
    site: "baby",
    kind: "product",
    slug: "grownsy-bottle-sterilizer-dryer",
    query: "Is the GROWNSY Bottle Sterilizer and Dryer worth it for a small kitchen?",
    answer: "GROWNSY is worth considering when counter space matters and bottles are already washed. It sterilizes and dries; confirm tray fit, seller, and exact model before buying.",
    updatedAt: pageOneCtrUpdatedAt,
    preferredPaths: ["/best/best-bottle-sterilizers-and-dryers", "/guides/bottle-washer-vs-sterilizer-vs-dryer-guide", "/reviews/dr-browns-all-in-one-sterilizer-dryer"],
  },
  {
    site: "smarthome",
    kind: "roundup",
    slug: "eufy-e340-vs-tapo-d210",
    query: "eufy E340 or Tapo D210 for local video storage?",
    answer: "E340 is strongest when dual-camera package coverage and the chosen eufy storage path matter. D210 is the better fit when Tapo integration, its power arrangement, and a simpler purchase price solve the job; verify included chime, storage, and subscription boundaries.",
    updatedAt,
    preferredPaths: ["/reviews/eufy-video-doorbell-e340", "/reviews/tapo-d210-video-doorbell", "/guides/video-doorbell-battery-storage-subscription-guide"],
  },
  {
    site: "baby",
    kind: "product",
    slug: "dr-browns-all-in-one-sterilizer-dryer",
    query: "How much fits in Dr. Brown's sterilizer dryer, and does it dry fully?",
    answer: "Capacity depends on bottle shape, pump parts, and how airflow can move between items—not just the bottle count. Load the family's largest normal cycle on paper, confirm the drying program, and expect tightly nested parts to need repositioning or extra drying time.",
    updatedAt,
    preferredPaths: ["/best/best-bottle-sterilizers-and-dryers", "/guides/bottle-washer-vs-sterilizer-vs-dryer-guide", "/guides/bottle-sterilizer-dryer-for-twins-capacity-guide"],
  },
  {
    site: "homeoffice",
    kind: "roundup",
    slug: "best-walking-pad-and-monitor-arm-setup",
    query: "What monitor-arm setup stays stable with a walking pad?",
    answer: "Stability comes from a rigid desk frame, a clamp placed near strong structure, a correctly tensioned arm, and a walking speed that does not transmit excessive vibration. Choose the arm only after measuring monitor weight, VESA pattern, desktop thickness, and cable travel.",
    updatedAt,
    preferredPaths: ["/reviews/ergotron-hx-monitor-arm", "/guides/single-vs-dual-monitor-arm-walking-desk", "/guides/walking-pad-speed-monitor-stability-guide"],
  },
  {
    site: "smarthome",
    kind: "guide",
    slug: "tapo-p125m-vs-p110m",
    query: "Tapo P110M or P125M: which one has energy monitoring and Matter?",
    answer: "Model and region determine the answer, so match the full suffix on the live listing. Buy for the required plug shape, load limit, energy data, and Matter support rather than assuming every P110M or P125M listing exposes the same combination.",
    updatedAt,
    preferredPaths: ["/reviews/tapo-p125m-matter-smart-plug", "/reviews/tapo-p110m-energy-monitoring-smart-plug", "/guides/tapo-p110m-home-assistant-energy-monitoring"],
  },
  {
    site: "pet",
    kind: "guide",
    slug: "levoit-vital-200s-p-filter-cost-and-maintenance",
    query: "What does a Levoit Vital 200S-P cost to maintain?",
    answer: "Budget official compatible replacement filters at the household's actual dust, hair, and odor load, and clean the washable prefilter regularly. Do not treat the indicator as a laboratory measurement; inspect airflow, odor, dust buildup, and filter condition.",
    updatedAt,
    preferredPaths: ["/reviews/levoit-vital-200s-p-air-purifier", "/best/coway-mighty2-vs-winix-5510-vs-levoit-vital-200s", "/guides/air-purifier-placement-near-litter-box"],
  },
  {
    site: "pet",
    kind: "guide",
    slug: "rfid-feeder-vs-microchip-feeder-guide",
    query: "RFID collar feeder or implanted-microchip feeder?",
    answer: "A collar-tag feeder is easier when the pet reliably wears the supplied tag. An implanted-microchip feeder avoids a removable tag but must support the pet's chip and access behavior; compare bowl access, training, power, cleaning, and failure fallback.",
    updatedAt,
    preferredPaths: ["/reviews/petlibro-one-rfid-smart-feeder", "/reviews/petlibro-granary-automatic-cat-feeder", "/guides/automatic-feeder-cleaning-checklist"],
  },
  {
    site: "homeoffice",
    kind: "product",
    slug: "amazon-basics-monitor-arm",
    query: "Will the Amazon Basics gas-spring arm fit a 27-inch monitor?",
    answer: "Screen size alone is not enough. Confirm the exact arm's weight range, VESA pattern, clamp or grommet range, desk edge, and monitor center of gravity; a 27-inch display outside the weight range will not balance safely.",
    updatedAt,
    preferredPaths: ["/guides/single-vs-dual-monitor-arm-walking-desk", "/best/best-walking-pad-and-monitor-arm-setup", "/guides/walking-pad-desk-measurement-checklist"],
  },
  {
    site: "network",
    kind: "guide",
    slug: "deco-be63-multigig-ports-guide",
    query: "How should Deco BE63 multi-gig ports be assigned?",
    answer: "Assign the fastest required path first—WAN, wired backhaul, switch uplink, NAS, or workstation—then map every remaining hop. A fast Deco port cannot create multi-gig performance when the modem, switch, cable, or client negotiates more slowly.",
    updatedAt,
    preferredPaths: ["/reviews/tp-link-deco-be63-wifi-7-mesh", "/guides/deco-be63-ethernet-backhaul-setup", "/best/tp-link-deco-be67-vs-be63"],
  },
  {
    site: "network",
    kind: "guide",
    slug: "usb-c-ethernet-adapter-guide",
    query: "Should you buy a USB-C Ethernet adapter or a full dock?",
    answer: "Buy the adapter when reliable Ethernet is the only missing port. Buy a dock when displays, charging, storage, and peripherals must share one connection, after verifying host USB-C capabilities, power delivery, display limits, and Ethernet speed.",
    updatedAt,
    preferredPaths: ["/reviews/tp-link-ue302c-2-5g-usb-c-ethernet-adapter", "/best/tp-link-ue302c-vs-sabrent-nt-25ga", "/guides/ethernet-stuck-at-100-mbps-guide"],
  },
  {
    site: "homeoffice",
    kind: "guide",
    slug: "single-vs-dual-monitor-arm-walking-desk",
    query: "Single or dual monitor arms for a walking desk?",
    answer: "Separate single arms usually allow more independent placement and can spread clamp load; a dual arm is tidier but concentrates weight and movement. Measure both monitors, desk structure, clamp spacing, and cable travel before choosing.",
    updatedAt,
    preferredPaths: ["/best/best-walking-pad-and-monitor-arm-setup", "/reviews/amazon-basics-monitor-arm", "/guides/walking-pad-desk-measurement-checklist"],
  },
  {
    site: "homeoffice",
    kind: "guide",
    slug: "walking-pad-desk-measurement-checklist",
    query: "What should you measure before adding a walking pad under a desk?",
    answer: "Measure desk height range, pad width and length, belt area, rear clearance, step-on space, chair storage, cable paths, and monitor movement. The setup must still reach a neutral typing height when standing on the pad.",
    updatedAt,
    preferredPaths: ["/best/best-walking-pad-and-monitor-arm-setup", "/guides/walking-pad-speed-monitor-stability-guide", "/guides/single-vs-dual-monitor-arm-walking-desk"],
  },
  {
    site: "homeoffice",
    kind: "guide",
    slug: "walking-pad-speed-monitor-stability-guide",
    query: "How fast can you walk without making the monitor shake?",
    answer: "There is no universal speed: desk rigidity, floor, stride, monitor mass, and arm tension all matter. Start slowly, type a real task, watch the display edge, then change one variable at a time before increasing speed.",
    updatedAt,
    preferredPaths: ["/best/best-walking-pad-and-monitor-arm-setup", "/guides/walking-pad-desk-measurement-checklist", "/reviews/ergotron-hx-monitor-arm"],
  },
  {
    site: "network",
    kind: "guide",
    slug: "cable-modem-2-5g-port-buying-guide",
    query: "When does a cable modem need a 2.5GbE port?",
    answer: "A 2.5GbE modem port matters when the provisioned plan can exceed gigabit or when the ISP overprovisions above a 1GbE link. The router WAN port, cable, and service tier must all support the same path.",
    updatedAt,
    preferredPaths: ["/reviews/arris-surfboard-s33-cable-modem", "/best/best-cable-modems-for-xfinity-spectrum-cox", "/guides/modem-router-combo-vs-separate-modem-router-guide"],
  },
  {
    site: "pet",
    kind: "guide",
    slug: "furbo-360-placement-height-and-wifi-guide",
    query: "Where should Furbo 360 be placed for reliable tracking and Wi-Fi?",
    answer: "Use a stable elevated surface with clear rotation, a view of the dog's real resting area, secure power, and strong 2.4GHz Wi-Fi. Test blind spots, treat trajectory, audio, and the dog's reaction while someone is home.",
    updatedAt,
    preferredPaths: ["/reviews/furbo-360-dog-camera", "/best/furbo-360-vs-wyze-cam-pan-v3-for-pets"],
  },
  {
    site: "network",
    kind: "product",
    slug: "tp-link-tl-sg1005p-poe-switch",
    query: "Can TP-Link TL-SG1005P power four PoE+ devices at the same time?",
    answer: "TL-SG1005P can power four PoE devices only when each device fits the per-port limit and their combined continuous and startup draw stays within the listed 65W total budget. Add the real camera or access-point wattages, leave headroom, and choose a managed or larger switch when the system may grow.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/best/tp-link-tl-sg1005p-vs-tl-sg108pe-vs-netgear-gs308epp", "/best/best-poe-switches-for-home-cameras-and-access-points", "/guides/poe-switch-power-budget-calculator-guide", "/guides/poe-vs-poe-plus-for-cameras-access-points", "/guides/managed-vs-unmanaged-poe-switch-home-guide"],
  },
  {
    site: "network",
    kind: "product",
    slug: "tp-link-ue302c-2-5g-usb-c-ethernet-adapter",
    query: "Will TP-Link UE302C actually deliver more than 1Gbps?",
    answer: "UE302C can exceed gigabit only when the host USB-C mode, operating-system support, adapter, Ethernet cable, switch or router port, and destination all support the faster path. Check the negotiated local link speed first; a 2.5GbE adapter cannot remove a gigabit limit elsewhere.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/best/tp-link-ue302c-vs-sabrent-nt-25ga", "/guides/usb-c-ethernet-adapter-guide", "/guides/ethernet-stuck-at-100-mbps-guide", "/best/best-2-5g-home-network-upgrades", "/guides/cable-modem-2-5g-port-buying-guide"],
  },
  {
    site: "network",
    kind: "guide",
    slug: "xfinity-gateway-bridge-mode-vs-own-router-guide",
    query: "Should you put an Xfinity gateway in bridge mode when adding your own router?",
    answer: "Use bridge mode when the Xfinity gateway should remain the modem but one separate router should own routing and Wi-Fi. Confirm the gateway model and support path first, because bridge mode turns off its private Wi-Fi routing functions and changes Advanced Security, extender, and personalization behavior. Keep only one router in charge after the change.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/best/best-cable-modems-for-xfinity-spectrum-cox", "/reviews/arris-surfboard-s33-cable-modem", "/reviews/motorola-mb8611-cable-modem", "/reviews/hitron-coda56-cable-modem", "/guides/modem-router-combo-vs-separate-modem-router-guide"],
  },
  {
    site: "smarthome",
    kind: "product",
    slug: "tapo-d210-video-doorbell",
    query: "Does every Tapo D210 have the same battery capacity?",
    answer: "Choose Tapo D210 when battery-only installation, an included chime, and local microSD recording fit the job. TP-Link lists different battery specifications for D210 hardware versions—6400mAh for US V1 and 5200mAh for US V2—so verify the hardware label tied to the exact offer instead of relying on one universal capacity.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/best/ring-battery-doorbell-plus-2nd-gen-vs-tapo-d210", "/guides/video-doorbell-battery-storage-subscription-guide", "/best/eufy-e340-vs-tapo-d210", "/reviews/ring-battery-doorbell-plus-2nd-gen", "/reviews/eufy-video-doorbell-e340"],
  },
  {
    site: "smarthome",
    kind: "roundup",
    slug: "ring-battery-doorbell-plus-2nd-gen-vs-tapo-d210",
    query: "Tapo D210 or Ring Battery Doorbell Plus: which is better without a subscription?",
    answer: "Choose Tapo D210 when local microSD recording and an included chime matter more than app polish; the card is sold separately. Choose Ring Battery Doorbell Plus when Alexa, a removable battery, and Ring's app justify the bundle and current plan decision, and confirm that the linked Ring offer includes Chime Plus.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/reviews/tapo-d210-video-doorbell", "/reviews/ring-battery-doorbell-plus-2nd-gen", "/guides/video-doorbell-battery-storage-subscription-guide", "/reviews/eufy-video-doorbell-e340", "/best/eufy-e340-vs-tapo-d210"],
  },
  {
    site: "smarthome",
    kind: "product",
    slug: "google-nest-learning-thermostat-4th-gen",
    query: "Does Nest Learning Thermostat 4th Gen need a C-wire, and does Matter guarantee HVAC compatibility?",
    answer: "Matter support does not prove that the Nest Learning Thermostat 4th Gen will work with a particular HVAC system. Photograph the terminals, run Google's current compatibility checker, and verify the power path before purchase; a C-wire is not required in many supported homes, but that is not a guarantee for every system.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/best/ecobee-premium-vs-nest-learning-thermostat-4th-gen", "/reviews/ecobee-smart-thermostat-premium"],
  },
  {
    site: "smarthome",
    kind: "product",
    slug: "ultraloq-bolt-se-smart-lock",
    query: "Does ULTRALOQ Bolt SE include both Matter over Thread and Wi-Fi?",
    answer: "Do not assume one Bolt SE listing includes both Matter over Thread and Wi-Fi. ULTRALOQ presents these as technology variants, so choose the exact version that matches the home's controller, Thread-border-router, remote-access, and fallback requirements, then verify the selected Amazon variation before checkout.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/best/ultraloq-bolt-se-vs-aqara-u400", "/guides/matter-smart-lock-controller-checklist", "/guides/smart-lock-door-fit-hub-compatibility", "/reviews/aqara-smart-lock-u400", "/reviews/aqara-smart-lock-u100"],
  },
  {
    site: "smarthome",
    kind: "guide",
    slug: "tapo-p110m-home-assistant-energy-monitoring",
    query: "How do you add Tapo P110M to Home Assistant and keep energy monitoring?",
    answer: "Add the exact P110M through one primary path first: the Home Assistant TP-Link integration or Matter. Then check current power, accumulated energy, units, update interval and history before building an automation. P110, P110M and P115 are region- and model-specific names, so confirm the exact plug and current integration support instead of assuming their entity sets are identical.",
    updatedAt: rankingReviewUpdatedAt,
    preferredPaths: ["/reviews/tapo-p110m-energy-monitoring-smart-plug", "/guides/tapo-p110m-matter-vs-tapo-integration", "/guides/tapo-p125m-vs-p110m", "/best/best-tapo-matter-smart-plug-for-energy-or-compact-control", "/guides/tapo-p110m-aqara-hub-m3-pairing"],
  },
  {
    site: "smarthome",
    kind: "product",
    slug: "tapo-p110m-energy-monitoring-smart-plug",
    query: "Does Tapo P110M energy monitoring work through Matter in every smart-home app?",
    answer: "No. Use the Tapo app as the baseline for P110M power and energy history, then verify which entities the chosen Matter controller and app expose at their current software versions. Buy the exact P110M model and pack only when its plug shape, electrical limit, firmware, and vendor-app data meet the job; do not assume every Matter app shows identical energy detail.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/guides/tapo-p110m-home-assistant-energy-monitoring", "/guides/tapo-p110m-matter-vs-tapo-integration", "/guides/tapo-p125m-vs-p110m", "/best/best-tapo-matter-smart-plug-for-energy-or-compact-control", "/guides/tapo-p110m-aqara-hub-m3-pairing"],
  },
  {
    site: "smarthome",
    kind: "product",
    slug: "x-sense-sws0a41-water-leak-detector-kit",
    query: "What is included in the X-Sense SWS0A41 kit, and who should buy it?",
    answer: "SWS0A41 is a four-sensor kit with an SBS50 base station, designed for covering several leak-prone locations rather than deep Matter, Thread, Zigbee, or LoRa integration. Verify the exact kit quantity, base station, app requirements, alarm path, seller, and return terms before ordering.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/best/aqara-vs-govee-vs-xsense-vs-yolink-leak-sensors", "/best/best-water-leak-sensors-for-sinks-water-heaters", "/guides/water-leak-sensor-placement-guide", "/guides/wifi-vs-zigbee-vs-lora-water-leak-sensor-guide", "/reviews/yolink-lora-water-alarm-bundle"],
  },
  {
    site: "homeoffice",
    kind: "product",
    slug: "flexispot-e7-mini-standing-desk",
    query: "What is the FlexiSpot E7 Mini, and is it big enough for one or two monitors?",
    answer: "FlexiSpot E7 Mini is the compact E7 frame intended for 31.5–40-inch desktops, not a generic name for every small FlexiSpot desk. It is a strong fit for a laptop and one monitor. A compact dual-screen layout can work with compatible arms, but two large displays, speakers, paper, or a printer usually justify a 48-inch-or-larger desk. Add desktop thickness to the listed frame height and verify that the selected offer includes the intended E7 Mini frame and top.",
    updatedAt: cohortReviewUpdatedAt,
    preferredPaths: ["/best/ergear-48x24-vs-flexispot-e7-mini", "/reviews/ergear-48x24-electric-standing-desk", "/guides/48-vs-55-inch-desk-guide"],
  },
  {
    site: "homeoffice",
    kind: "roundup",
    slug: "ergear-48x24-vs-flexispot-e7-mini",
    query: "ErGear 48×24 or FlexiSpot E7 Mini: which fits a small room better?",
    answer: "Choose ErGear 48×24 for a larger rolling work surface, or FlexiSpot E7 Mini for a compact fixed setup. Compare height, monitor-arm fit, and room clearance.",
    updatedAt: "August 31, 2026",
    preferredPaths: ["/reviews/flexispot-e7-mini-standing-desk", "/reviews/ergear-48x24-electric-standing-desk", "/guides/48-vs-55-inch-desk-guide"],
  },
  {
    site: "homeoffice",
    kind: "product",
    slug: "huanuo-titanlift-heavy-duty-monitor-arm",
    query: "Can HUANUO TitanLift safely hold a 49-inch or 44 lb ultrawide?",
    answer: "Screen size alone cannot confirm compatibility. The exact non-RGB ASIN B0DQ19YC9H must simultaneously match the monitor-only 6.6–44 lb range, 75×75 or 100×100 VESA pattern, rear recess, curve, screw requirements, port clearance, and a structurally suitable clamp or grommet area. Leave margin near the maximum load and compare the applicable Ergotron HX pivot guidance for a deeply curved display before ordering.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/best/ergotron-hx-vs-huanuo-titanlift", "/guides/heavy-monitor-arm-weight-and-pivot-guide", "/guides/monitor-arm-clamp-reinforcement-guide"],
  },
  {
    site: "homeoffice",
    kind: "guide",
    slug: "48-vs-55-inch-desk-guide",
    query: "Should you buy a 48-inch or 55-inch desk for two monitors?",
    answer: "A 48-inch desk can support a laptop and one monitor or a modest dual-screen layout when the top is deep enough and compatible arms recover space. Choose 55 inches when a tower, writing area, speakers, or two larger screens repeatedly collide. Seven extra inches do not correct a shallow desktop, so sketch the actual stands or clamps and preserve chair, door, and walking clearance.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/best/best-standing-desks-for-small-spaces", "/reviews/flexispot-e7-mini-standing-desk", "/reviews/ergear-48x24-electric-standing-desk"],
  },
  {
    site: "homeoffice",
    kind: "guide",
    slug: "monitor-arm-clamp-reinforcement-guide",
    query: "Will a reinforcement plate make any desktop safe for a heavy monitor arm?",
    answer: "No. A reinforcement plate can spread local clamp pressure across a flat and sound surface, but it cannot strengthen glass, hollow-core, cracked, water-damaged, very thin, or unsupported material. Follow both the desk and arm limits, inspect the contact area above and below, and use an approved grommet mount, wall mount, or stock stand when the desktop edge cannot safely carry the load.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/reviews/huanuo-titanlift-heavy-duty-monitor-arm", "/guides/monitor-arm-compatibility-checklist", "/guides/heavy-monitor-arm-weight-and-pivot-guide"],
  },
  {
    site: "homeoffice",
    kind: "roundup",
    slug: "logitech-litra-glow-vs-elgato-key-light-neo",
    query: "Logitech Litra Glow or Elgato Key Light Neo: which is better for close video calls?",
    answer: "Choose Litra Glow for a restrained close-range meeting light when its mount and available USB power fit the workstation. Choose Key Light Neo when wider framing or greater output is needed, after confirming its power source, monitor mount, webcam clearance, cable path, and brightness at the real camera distance. Neither light can guarantee reflection-free glasses, so position and exposure still require testing.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/reviews/logitech-litra-glow", "/reviews/elgato-key-light-neo", "/guides/key-light-for-glasses-glare-placement"],
  },
  {
    site: "baby",
    kind: "product",
    slug: "momcozy-purehug-baby-carrier",
    query: "Is Momcozy PureHug suitable from birth, and which carry positions are documented?",
    answer: "The exact PureHug Black page recommends 3–24 months and 7–45lb, so reaching 7lb does not make it suitable from birth. It documents front carry facing inward; require both the age and weight gates, check panel and airway fit, and do not infer back, hip, or outward-facing support from generic marketplace images. Confirm ASIN B0CDQ2KVJD and the standard-versus-Air-Mesh variation before ordering.",
    updatedAt: "July 31, 2026",
    preferredPaths: ["/best/momcozy-purehug-vs-ergobaby-omni-breeze", "/reviews/ergobaby-omni-breeze-carrier", "/guides/baby-carrier-hot-weather-and-caregiver-fit-guide"],
  },
  {
    site: "baby",
    kind: "product",
    slug: "babybjorn-carrier-mini-3d-mesh",
    query: "How long is BabyBjörn Carrier Mini useful, and can it be used for back carry?",
    answer: "Carrier Mini is designed for simple front loading and shorter early-stage carries within the exact model's current listed range. The linked 3D Mesh model is listed for 7–25 lb and does not provide a back-carry position; outward carry is also not a newborn setup. Confirm the material, baby fit, current manual, seller, and return terms before ordering.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/best/babybjorn-mini-vs-harmony", "/reviews/babybjorn-carrier-harmony", "/guides/babybjorn-harmony-newborn-fit-checklist"],
  },
  {
    site: "baby",
    kind: "guide",
    slug: "babybjorn-harmony-newborn-fit-checklist",
    query: "Can a newborn use BabyBjörn Carrier Harmony safely?",
    answer: "Harmony may be used only after the baby meets the current listed minimums and the carrier is configured for front-inward newborn use. Follow the exact manual for the zipper, seat, leg, and head-support settings; keep the face visible and chin clear of the chest. Adjust every caregiver separately, begin with a short supported carry, and stop immediately if the baby slumps or the airway becomes obscured.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/reviews/babybjorn-carrier-harmony", "/best/babybjorn-mini-vs-harmony", "/best/babybjorn-harmony-vs-ergobaby-omni-breeze"],
  },
  {
    site: "baby",
    kind: "roundup",
    slug: "momcozy-purehug-vs-ergobaby-omni-breeze",
    query: "Is Ergobaby Omni Breeze worth paying more for than Momcozy PureHug?",
    answer: "Pay more for Omni Breeze when its open mesh, hip-carry option, broader model-specific instructions, or mature position system solves a real need. PureHug remains the value direction when its exact current model, inward-carry setup, waistband, and cross-back strap path fit both the baby and caregiver. Do not choose from price alone; compare the manuals, developmental limits, seller, material, and usable return path.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/reviews/momcozy-purehug-baby-carrier", "/reviews/ergobaby-omni-breeze-carrier", "/guides/baby-carrier-hot-weather-and-caregiver-fit-guide"],
  },
  {
    site: "baby",
    kind: "guide",
    slug: "ergobaby-omni-breeze-vs-babybjorn-harmony-by-age",
    query: "Ergobaby Omni Breeze or BabyBjörn Harmony: which carrier fits each stage better?",
    answer: "For newborn use, choose only after both caregivers can achieve the current inward-facing setup, visible airway, and head support. In later months, compare milestone-gated outward carry, waistband comfort, mesh, and back-carry workflow. Age alone does not approve a position, so the exact manual, baby's size and control, caregiver fit, and return path should decide.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/reviews/ergobaby-omni-breeze-carrier", "/reviews/babybjorn-carrier-harmony", "/best/babybjorn-harmony-vs-ergobaby-omni-breeze"],
  },
  {
    site: "pet",
    kind: "product",
    slug: "levoit-vital-200s-p-air-purifier",
    query: "What room size is the Levoit Vital 200S-P suitable for in a pet home?",
    answer: "For faster pet-room cleaning, use Levoit's official 388-square-foot rating at 4.8 air changes per hour rather than the 1,862-square-foot rating at one air change per hour. The Vital 200S-P lists a 250 CFM CADR, a washable pre-filter, and a particle sensor that does not detect odors.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/guides/levoit-vital-200s-p-filter-cost-and-maintenance", "/best/coway-mighty2-vs-winix-5510-vs-levoit-vital-200s", "/best/levoit-vital-200s-p-vs-shark-neverchange-max", "/guides/air-purifier-placement-near-litter-box"],
  },
  {
    site: "pet",
    kind: "roundup",
    slug: "petlibro-one-rfid-vs-granary-smart-feeder",
    query: "PETLIBRO One RFID or Granary PLAF103: which feeder should a multi-cat home buy?",
    answer: "Choose the One RFID PLAF301 when one pet needs protected access and can wear PETLIBRO's dedicated collar tag. It binds one feeder to one tag and does not read an implanted microchip. Choose the Granary PLAF103 when every pet can share scheduled dry-food portions and access control would add unnecessary cost and cleaning.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/reviews/petlibro-one-rfid-smart-feeder", "/reviews/petlibro-granary-automatic-cat-feeder", "/guides/rfid-feeder-vs-microchip-feeder-guide", "/best/best-automatic-cat-feeders"],
  },
  {
    site: "pet",
    kind: "guide",
    slug: "automatic-feeder-buying-guide",
    query: "What should you check before buying an automatic dry-food pet feeder?",
    answer: "Start with the exact food and household problem: dry versus wet food, supported kibble size, measured portion repeatability, one-pet access control, washable food-contact parts, and outage behavior. Test the saved schedule, weigh repeated dispenses of the actual kibble, and keep human checks for food, water, jams, and the pet.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/best/best-automatic-cat-feeders", "/reviews/petlibro-granary-automatic-cat-feeder", "/reviews/petlibro-one-rfid-smart-feeder", "/guides/automatic-feeder-portion-size-guide", "/guides/automatic-feeder-cleaning-checklist"],
  },
  {
    site: "pet",
    kind: "guide",
    slug: "automatic-feeder-cleaning-checklist",
    query: "Which automatic feeder parts can be washed without damaging the motor or RFID reader?",
    answer: "Wash only the removable food-contact parts that the exact model manual identifies as washable, then dry them completely before reassembly. PETLIBRO permits rinsing the Granary PLAF103 lid, tank, tank base, bowl, and tray, but not its powered base; the One RFID base, collar tag, and reader must also remain dry.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/guides/automatic-feeder-buying-guide", "/guides/automatic-feeder-portion-size-guide", "/reviews/petlibro-granary-automatic-cat-feeder", "/reviews/petlibro-one-rfid-smart-feeder", "/best/best-automatic-cat-feeders"],
  },
  {
    site: "pet",
    kind: "guide",
    slug: "automatic-feeder-portion-size-guide",
    query: "How many grams is one PETLIBRO automatic feeder portion?",
    answer: "There is no fixed gram value for one PETLIBRO portion. For PLAF103 and PLAF301, PETLIBRO describes one portion as approximately 20mL, or about 1/12 cup, by volume. Kibble size, shape, density, and freshness change its weight, so weigh several dispenses of the exact food and recalculate after changing kibble.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/reviews/petlibro-granary-automatic-cat-feeder", "/reviews/petlibro-one-rfid-smart-feeder", "/guides/automatic-feeder-buying-guide", "/guides/automatic-feeder-cleaning-checklist", "/best/petlibro-one-rfid-vs-granary-smart-feeder"],
  },
  {
    site: "pet",
    kind: "product",
    slug: "coway-airmega-mighty2-air-purifier",
    query: "What are the Coway Mighty2 AP-1512N CADR and room-size ratings?",
    answer: "The Airmega Mighty2 AP-1512N is not the older AP-1512HH. Coway lists CADR values of 240 for smoke, 242 for dust, and 249 for pollen, with coverage of 450 square feet in 15 minutes, 900 in 30 minutes, or 1,800 in 60 minutes; the largest figure is only one air change per hour.",
    updatedAt: portfolioBatchUpdatedAt,
    preferredPaths: ["/best/coway-mighty2-vs-winix-5510-vs-levoit-vital-200s", "/reviews/levoit-vital-200s-p-air-purifier", "/best/coway-mighty2-vs-shark-neverchange-max", "/guides/air-purifier-placement-near-litter-box"],
  },
  {
    site: "style",
    kind: "product",
    slug: "loungefly-mickey-mouse-mini-backpack",
    query: "What fits in a Loungefly Mickey Mouse mini backpack?",
    answer: "Use the listed exterior dimensions only as a starting point: the zipper opening, lining, front pocket, and structured shape reduce usable volume. Compare the actual daily carry list and strap range before buying it as more than an occasional statement bag.",
    updatedAt,
    preferredPaths: ["/guides/loungefly-mini-backpack-vs-full-size-for-park-day", "/guides/loungefly-faux-leather-rain-and-care-guide", "/reviews/loungefly-minnie-mouse-bow-mini-backpack"],
  },
  {
    site: "baby",
    kind: "guide",
    slug: "bottle-sterilizer-dryer-for-twins-capacity-guide",
    query: "What sterilizer-dryer capacity is practical for twins?",
    answer: "Count the family's largest real cycle—bottles, collars, nipples, pump parts, and pacifiers—and leave airflow around each item. For twins, cycle time and drying reliability usually matter more than a headline bottle count.",
    updatedAt,
    preferredPaths: ["/reviews/dr-browns-all-in-one-sterilizer-dryer", "/best/best-bottle-sterilizers-and-dryers", "/guides/bottle-washer-vs-sterilizer-vs-dryer-guide"],
  },
  {
    site: "network",
    kind: "roundup",
    slug: "deco-be25-vs-be67",
    query: "Deco BE25 or BE67 for a Wi-Fi 7 mesh?",
    answer: "BE25 is the budget choice when gigabit-class internet and modest wired needs dominate. BE67 is justified by 10GbE and stronger multi-gig ambitions; confirm pack size, backhaul, client capability, and switch path before paying for unused headroom.",
    updatedAt,
    preferredPaths: ["/reviews/tp-link-deco-be25-wifi-7-mesh", "/reviews/tp-link-deco-be67-wifi-7-mesh"],
  },
  {
    site: "pet",
    kind: "guide",
    slug: "cat-water-fountain-buying-guide",
    query: "How do you choose a cat water fountain?",
    answer: "Choose from reservoir size, material, pump access, filter availability, noise, cleaning time, and the cat's drinking behavior. Keep a separate fresh-water bowl during the transition and confirm that replacement parts remain available.",
    updatedAt,
    preferredPaths: ["/reviews/catit-flower-cat-water-fountain", "/guides/cat-fountain-filter-replacement-guide", "/guides/automatic-feeder-cleaning-checklist"],
  },
  {
    site: "style",
    kind: "product",
    slug: "betsey-johnson-cupcake-mismatch-earrings",
    query: "Are Betsey Johnson cupcake mismatch earrings comfortable for repeat wear?",
    answer: "Comfort depends on the listed length, weight, closure, and the wearer's sensitivity more than the motif. Compare the dimensions with an owned pair, inspect the finish and seller during the return window, and let the earrings remain the outfit's focal point.",
    updatedAt,
    preferredPaths: ["/best/best-betsey-johnson-mismatched-earrings", "/guides/statement-earring-size-weight-closure-guide", "/reviews/betsey-johnson-moon-star-drop-earrings"],
  },
  {
    site: "network",
    kind: "product",
    slug: "tp-link-tl-sg105-m2-2-5g-switch",
    query: "Is TP-Link TL-SG105-M2 enough for a NAS and Wi-Fi 7 mesh?",
    answer: "TL-SG105-M2 supplies five unmanaged 2.5GbE ports, but a normal upstream connection leaves four for the NAS, mesh node, workstation, dock, or access point. Buy it when that complete port map leaves one spare connection. Start with eight ports when the five roles are already occupied, and choose a managed model when VLANs, link aggregation, PoE, or per-port visibility are required.",
    updatedAt: cohortReviewUpdatedAt,
    preferredPaths: ["/guides/5-port-vs-8-port-2-5gbe-switch", "/guides/2-5gbe-switch-port-budget-for-nas-mesh", "/best/tl-sg105-m2-vs-ms305-vs-teg-s350", "/reviews/netgear-ms305-2-5g-switch", "/reviews/trendnet-teg-s380-2-5g-switch"],
  },
  {
    site: "network",
    kind: "product",
    slug: "trendnet-teg-s350-2-5g-switch",
    query: "Is TRENDnet TEG-S350 the five-port or eight-port 2.5GbE switch?",
    answer: "TEG-S350 is the five-port unmanaged 2.5GbE model. Count the upstream link first, then the NAS, mesh or access point, workstation, dock, and one spare path. Choose TEG-S380 when eight 2.5GbE ports prevent an immediate second switch, and do not expect either unmanaged model to add VLAN, PoE, or traffic-monitoring controls.",
    updatedAt: cohortReviewUpdatedAt,
    preferredPaths: ["/best/tl-sg105-m2-vs-ms305-vs-teg-s350", "/guides/5-port-vs-8-port-2-5gbe-switch", "/reviews/trendnet-teg-s380-2-5g-switch", "/guides/2-5gbe-switch-port-budget-for-nas-mesh", "/best/best-fanless-2-5gbe-switches-home-nas-mesh"],
  },
  {
    site: "network",
    kind: "product",
    slug: "trendnet-teg-s380-2-5g-switch",
    query: "Does TRENDnet TEG-S380 provide eight 2.5GbE ports, and is it managed?",
    answer: "TEG-S380 is the eight-port unmanaged direction in this cluster. It is useful when the upstream link, NAS, mesh nodes, workstations, and adapters would fill a five-port switch, but it does not become a managed switch merely because it has more ports. Confirm the exact hardware version, cooling and placement needs, and every negotiated link before buying.",
    updatedAt: cohortReviewUpdatedAt,
    preferredPaths: ["/guides/5-port-vs-8-port-2-5gbe-switch", "/guides/2-5gbe-switch-port-budget-for-nas-mesh", "/reviews/trendnet-teg-s350-2-5g-switch", "/best/best-fanless-2-5gbe-switches-home-nas-mesh", "/best/tl-sg105-m2-vs-ms305-vs-teg-s350"],
  },
  {
    site: "network",
    kind: "roundup",
    slug: "tl-sg105-m2-vs-ms305-vs-teg-s350",
    query: "TP-Link TL-SG105-M2, NETGEAR MS305, or TRENDnet TEG-S350?",
    answer: "All three solve the same basic five-port unmanaged 2.5GbE job, so decide from the exact current model, enclosure and mounting, documentation and support path, hardware-version risk, and checkout value. None removes the four-device limit after a normal upstream link. Move to an eight-port or managed class when the port map or control requirements demand it.",
    updatedAt: cohortReviewUpdatedAt,
    preferredPaths: ["/reviews/tp-link-tl-sg105-m2-2-5g-switch", "/reviews/netgear-ms305-2-5g-switch", "/reviews/trendnet-teg-s350-2-5g-switch", "/guides/5-port-vs-8-port-2-5gbe-switch", "/guides/2-5gbe-switch-port-budget-for-nas-mesh"],
  },
  {
    site: "network",
    kind: "guide",
    slug: "2-5gbe-switch-port-budget-for-nas-mesh",
    query: "How many 2.5GbE switch ports do a NAS and Wi-Fi 7 mesh need?",
    answer: "Count one port for the router uplink, then one for every NAS, wired mesh node or access point, workstation, dock, and other multi-gig device. Keep printers, TVs, hubs, and other gigabit-only devices on a cheaper gigabit branch when practical. A five-port switch normally leaves four downstream multi-gig connections; draw the complete path before choosing it.",
    updatedAt: cohortReviewUpdatedAt,
    preferredPaths: ["/guides/5-port-vs-8-port-2-5gbe-switch", "/reviews/tp-link-tl-sg105-m2-2-5g-switch", "/reviews/trendnet-teg-s380-2-5g-switch", "/best/best-fanless-2-5gbe-switches-home-nas-mesh", "/guides/2-5gbe-home-network-upgrade-checklist"],
  },
  {
    site: "network",
    kind: "product",
    slug: "apc-be600m1-router-ups",
    query: "Is APC BE600M1 enough for an ONT, modem, router, and switch?",
    answer: "BE600M1 is the compact 600VA and 330W direction for a modest network chain, not a promise of a fixed runtime. Add the measured watts for the ONT, modem, router, and switch, reserve the battery-backed outlets for that minimum path, check power-brick spacing, and compare the resulting load with APC runtime guidance before ordering.",
    updatedAt: cohortReviewUpdatedAt,
    preferredPaths: ["/best/best-ups-for-router-and-modem", "/guides/router-ups-runtime-guide", "/reviews/apc-back-ups-router-modem-bundle", "/reviews/cyberpower-sl700u-router-ups"],
  },
  {
    site: "network",
    kind: "roundup",
    slug: "best-ups-for-router-and-modem",
    query: "What size UPS should you buy for a router and modem?",
    answer: "Size the UPS from the measured load and required runtime of the complete internet path: ONT or modem, router, required switch, and any mesh node that must remain online. Compare battery-backed outlet fit and replacement-battery ownership as well as VA and watts. A larger rating adds headroom but does not by itself prove longer useful runtime.",
    updatedAt: cohortReviewUpdatedAt,
    preferredPaths: ["/guides/router-ups-runtime-guide", "/reviews/apc-be600m1-router-ups", "/reviews/apc-back-ups-router-modem-bundle", "/reviews/cyberpower-sl700u-router-ups"],
  },
  {
    site: "homeoffice",
    kind: "product",
    slug: "plugable-usbc-6950pdz-displaylink-dock",
    query: "Can Plugable USBC-6950PDZ run two monitors on a base-model Mac?",
    answer: "USBC-6950PDZ uses DisplayLink for multi-display expansion, so it can be the practical path when the Mac's native display limit is the blocker. That also means installing and maintaining DisplayLink software and accepting its workflow tradeoffs. Confirm the exact host chip, operating system, display resolutions and refresh rates, charging need, protected-content workflow, and return path before buying.",
    updatedAt: cohortReviewUpdatedAt,
    preferredPaths: ["/best/displaylink-vs-thunderbolt-dock-dual-monitors", "/guides/macbook-dual-monitor-dock-chip-compatibility-guide", "/reviews/plugable-tbt4-ud5-thunderbolt-dock", "/best/best-dual-monitor-docks-mac-windows", "/guides/usb-c-dock-ports-explained-guide"],
  },
  {
    site: "homeoffice",
    kind: "product",
    slug: "plugable-tbt4-ud5-thunderbolt-dock",
    query: "Is Plugable TBT4-UD5 a native Thunderbolt dual-monitor dock?",
    answer: "TBT4-UD5 belongs to the native Thunderbolt path, so its display support still depends on the host computer's own Thunderbolt and display capabilities. It does not use DisplayLink to override a base Mac's native external-display limit. Match the exact Mac or Windows model, ports, display count, resolution, refresh rate, charging, and cable path before buying.",
    updatedAt: cohortReviewUpdatedAt,
    preferredPaths: ["/guides/macbook-dual-monitor-dock-chip-compatibility-guide", "/best/displaylink-vs-thunderbolt-dock-dual-monitors", "/reviews/plugable-usbc-6950pdz-displaylink-dock", "/reviews/caldigit-ts4-thunderbolt-dock", "/best/best-dual-monitor-docks-mac-windows"],
  },
  {
    site: "homeoffice",
    kind: "product",
    slug: "caldigit-ts4-thunderbolt-dock",
    query: "Can CalDigit TS4 run two monitors on a Mac?",
    answer: "Only when the exact Mac model and chip support the required native external displays. TS4 provides DisplayPort plus downstream Thunderbolt or USB-C video paths, but it does not use DisplayLink to override a base Mac's native display limit. Check CalDigit's current compatibility table, then map both monitor inputs, resolution, refresh rate, cable or adapter path, and DSC support before buying.",
    updatedAt: rankingReviewUpdatedAt,
    preferredPaths: ["/guides/macbook-dual-monitor-dock-chip-compatibility-guide", "/best/best-dual-monitor-docks-mac-windows", "/reviews/plugable-tbt4-ud5-thunderbolt-dock", "/reviews/anker-675-usb-c-docking-station", "/guides/usb-c-dock-ports-explained-guide"],
  },
  {
    site: "homeoffice",
    kind: "product",
    slug: "anker-675-usb-c-docking-station",
    query: "Is Anker 675 a monitor stand, a dock, or both?",
    answer: "Anker 675 combines a monitor riser with a USB-C docking and charging role, so the purchase only makes sense when both the physical desk layout and the host connection fit. Measure the riser height and footprint, then verify the computer's display support, power need, port plan, cable reach, and exact included power hardware before ordering.",
    updatedAt: cohortReviewUpdatedAt,
    preferredPaths: ["/guides/usb-c-dock-vs-monitor-hub-guide", "/guides/usb-c-dock-ports-explained-guide", "/best/best-dual-monitor-docks-mac-windows", "/reviews/caldigit-ts4-thunderbolt-dock", "/reviews/plugable-tbt4-ud5-thunderbolt-dock"],
  },
  {
    site: "homeoffice",
    kind: "guide",
    slug: "macbook-dual-monitor-dock-chip-compatibility-guide",
    query: "Which dock can run two monitors on a MacBook?",
    answer: "Start with the exact Mac chip and model, because a dock cannot create native display support the host does not provide. Choose a native Thunderbolt path when the Mac already supports the required displays. Choose DisplayLink only when software-driven expansion solves a real base-model limit and its driver, protected-content, update, and workflow tradeoffs are acceptable.",
    updatedAt: cohortReviewUpdatedAt,
    preferredPaths: ["/best/displaylink-vs-thunderbolt-dock-dual-monitors", "/reviews/plugable-usbc-6950pdz-displaylink-dock", "/reviews/plugable-tbt4-ud5-thunderbolt-dock", "/reviews/caldigit-ts4-thunderbolt-dock", "/best/best-dual-monitor-docks-mac-windows"],
  },
  {
    site: "homeoffice",
    kind: "guide",
    slug: "usb-c-dock-ports-explained-guide",
    query: "Which USB-C dock ports and host features do you actually need?",
    answer: "List the required displays, resolution and refresh rate, charging watts, Ethernet speed, storage, card readers, audio, and USB devices first. Then verify that the computer's USB-C or Thunderbolt port supports those jobs. A dock's connector list cannot overcome a host display limit, insufficient upstream bandwidth, or missing power-delivery support.",
    updatedAt: cohortReviewUpdatedAt,
    preferredPaths: ["/guides/macbook-dual-monitor-dock-chip-compatibility-guide", "/guides/usb-c-dock-vs-monitor-hub-guide", "/best/best-dual-monitor-docks-mac-windows", "/reviews/caldigit-ts4-thunderbolt-dock", "/reviews/anker-675-usb-c-docking-station"],
  },
  {
    site: "homeoffice",
    kind: "guide",
    slug: "usb-c-dock-vs-monitor-hub-guide",
    query: "Should you buy a USB-C dock or use the monitor's built-in hub?",
    answer: "Use the monitor hub when one display already supplies the required charging and peripheral ports with a clean cable path. Buy a separate dock when several displays, faster Ethernet, storage, card readers, audio, or more reliable power delivery need an independent center. Verify the host's display support before choosing either route.",
    updatedAt: cohortReviewUpdatedAt,
    preferredPaths: ["/guides/usb-c-dock-ports-explained-guide", "/guides/macbook-dual-monitor-dock-chip-compatibility-guide", "/reviews/anker-675-usb-c-docking-station", "/reviews/caldigit-ts4-thunderbolt-dock", "/best/best-dual-monitor-docks-mac-windows"],
  },
  {
    site: "smarthome",
    kind: "product",
    slug: "aqara-valve-controller-t1",
    query: "Will Aqara Valve Controller T1 fit an existing water shutoff valve?",
    answer: "T1 is a retrofit actuator, not a universal valve replacement. The existing quarter-turn valve must be healthy, smooth, compatible with the mount and handle geometry, clear through the full sweep, and reachable for manual control. Confirm the Aqara hub and automation path, then repair a stiff or corroded valve before attaching any motor.",
    updatedAt: cohortReviewUpdatedAt,
    preferredPaths: ["/guides/smart-water-shutoff-valve-fit-checklist", "/best/aqara-t1-vs-yolink-bulldog-vs-moen-flo", "/best/best-smart-water-shutoff-valves-retrofit-inline", "/guides/leak-sensor-to-water-shutoff-automation-guide", "/reviews/yolink-x3-bulldog-valve-controller"],
  },
  {
    site: "smarthome",
    kind: "product",
    slug: "moen-flo-900-001-smart-water-shutoff",
    query: "Is Moen Flo 900-001 the 3/4-inch smart water shutoff?",
    answer: "Yes. Model 900-001 is the 3/4-inch inline Flo shutoff; the 1-inch and 1-1/4-inch versions are different model identities. A plumber must confirm service-line size, straight-pipe space, unions, manual shutoff, pressure and code, fire-system boundaries, approved power, and Wi-Fi before the pipe is cut.",
    updatedAt: cohortReviewUpdatedAt,
    preferredPaths: ["/best/aqara-t1-vs-yolink-bulldog-vs-moen-flo", "/best/best-smart-water-shutoff-valves-retrofit-inline", "/guides/smart-water-shutoff-valve-fit-checklist", "/guides/leak-sensor-to-water-shutoff-automation-guide", "/reviews/aqara-valve-controller-t1"],
  },
  {
    site: "smarthome",
    kind: "roundup",
    slug: "best-smart-water-shutoff-valves-retrofit-inline",
    query: "Should you buy a retrofit or inline smart water shutoff valve?",
    answer: "Choose a retrofit actuator when the existing quarter-turn valve is healthy and compatible and avoiding pipe work is the priority. Choose an inline system when whole-home flow, pressure, and temperature monitoring justify exact sizing, professional plumbing, approved power, Wi-Fi, and code review. Keep point leak sensors in either architecture and preserve a manual fallback.",
    updatedAt: cohortReviewUpdatedAt,
    preferredPaths: ["/guides/smart-water-shutoff-valve-fit-checklist", "/best/aqara-t1-vs-yolink-bulldog-vs-moen-flo", "/reviews/aqara-valve-controller-t1", "/reviews/yolink-x3-bulldog-valve-controller", "/reviews/moen-flo-900-001-smart-water-shutoff"],
  },
  {
    site: "smarthome",
    kind: "roundup",
    slug: "aqara-t1-vs-yolink-bulldog-vs-moen-flo",
    query: "Aqara T1, YoLink Bulldog, or Moen Flo: which shutoff architecture fits?",
    answer: "Choose Aqara for a compatible valve in an existing Aqara hub and sensor plan, YoLink when long-range retrofit control solves a difficult radio path, and Moen Flo when inline flow monitoring justifies plumbing, power, and Wi-Fi. First confirm valve health, pipe size, fire-system boundaries, manual fallback, and the supervised sensor-to-closure test.",
    updatedAt: cohortReviewUpdatedAt,
    preferredPaths: ["/best/best-smart-water-shutoff-valves-retrofit-inline", "/guides/smart-water-shutoff-valve-fit-checklist", "/reviews/aqara-valve-controller-t1", "/reviews/yolink-x3-bulldog-valve-controller", "/reviews/moen-flo-900-001-smart-water-shutoff"],
  },
  {
    site: "smarthome",
    kind: "guide",
    slug: "wifi-vs-zigbee-vs-lora-water-leak-sensor-guide",
    query: "Wi-Fi, Zigbee, or LoRa water leak sensors: which radio path is better?",
    answer: "Choose from the real distance, obstructions, hub and internet dependencies, alert path, battery plan, and whether a local sensor-to-valve automation must still work during an outage. Wi-Fi is direct but power and router dependent, Zigbee fits a healthy local mesh and hub, and LoRa favors long range. The radio label alone does not prove reliable closure.",
    updatedAt: cohortReviewUpdatedAt,
    preferredPaths: ["/guides/leak-sensor-to-water-shutoff-automation-guide", "/guides/water-leak-sensor-placement-guide", "/best/best-water-leak-sensors-for-sinks-water-heaters", "/reviews/aqara-valve-controller-t1", "/reviews/yolink-x3-bulldog-valve-controller"],
  },
  ...portfolioRankingOpportunities,
];

const stopWords = new Set([
  "a", "an", "and", "are", "at", "be", "best", "buy", "buying", "can", "choose", "does", "for", "from",
  "guide", "how", "in", "is", "it", "of", "or", "review", "should", "the", "to", "vs", "what", "when",
  "which", "with", "without", "worth", "you",
]);

function tokens(value: string) {
  return new Set(
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 1 && !stopWords.has(token)),
  );
}

function overlap(left: Set<string>, right: Set<string>) {
  let count = 0;
  left.forEach((token) => {
    if (right.has(token)) count += 1;
  });
  return count;
}

export function findSearchOpportunity(site: SiteKey, kind: SearchOpportunityKind, slug: string) {
  return searchOpportunities.find((item) => item.site === site && item.kind === kind && item.slug === slug);
}

export function searchOpportunityUpdatedAt(site: SiteKey, kind: SearchOpportunityKind, slug: string) {
  return findSearchOpportunity(site, kind, slug) ? portfolioRankingRefreshAt : undefined;
}

export function searchOpportunityMetaDescription(opportunity?: SearchOpportunity, fallback?: string) {
  const value = (opportunity?.answer ?? fallback ?? "").replace(/\s+/g, " ").trim();
  if (value.length <= 158) return value;
  const shortened = value.slice(0, 155).replace(/\s+\S*$/, "").trim();
  return `${shortened}…`;
}

export function effectiveContentUpdatedAt(contentUpdatedAt?: string, opportunityUpdatedAt?: string) {
  const timestamp = (value?: string) => {
    if (!value) return undefined;
    const parsed = new Date(`${value} 00:00:00 UTC`).getTime();
    return Number.isNaN(parsed) ? undefined : parsed;
  };
  const contentTimestamp = timestamp(contentUpdatedAt);
  const opportunityTimestamp = timestamp(opportunityUpdatedAt);
  if (contentTimestamp === undefined) return opportunityTimestamp === undefined ? undefined : opportunityUpdatedAt;
  if (opportunityTimestamp === undefined) return contentUpdatedAt;
  return opportunityTimestamp > contentTimestamp ? opportunityUpdatedAt : contentUpdatedAt;
}

export function searchOpportunityLinks(opportunity: SearchOpportunity): SearchOpportunityLink[] {
  const products = siteProducts(opportunity.site).map((item) => ({
    path: `/reviews/${item.slug}`,
    label: item.seoTitle ?? item.name,
    description: item.summary,
    category: item.category,
    text: `${item.slug} ${item.seoTitle ?? item.name} ${item.summary} ${item.category}`,
  }));
  const guides = siteGuides(opportunity.site).map((item) => ({
    path: `/guides/${item.slug}`,
    label: item.title,
    description: item.dek,
    category: item.category,
    text: `${item.slug} ${item.title} ${item.dek} ${item.category}`,
  }));
  const roundups = siteRoundups(opportunity.site).map((item) => ({
    path: `/best/${item.slug}`,
    label: item.seoTitle ?? item.title,
    description: item.dek,
    category: item.category,
    text: `${item.slug} ${item.seoTitle ?? item.title} ${item.dek} ${item.category}`,
  }));
  const currentPath = {
    product: `/reviews/${opportunity.slug}`,
    guide: `/guides/${opportunity.slug}`,
    roundup: `/best/${opportunity.slug}`,
  }[opportunity.kind];
  const candidates = [...products, ...guides, ...roundups];
  const current = candidates.find((item) => item.path === currentPath);
  const targetTokens = tokens(`${opportunity.slug} ${opportunity.query} ${current?.category ?? ""}`);
  const preferred = new Map((opportunity.preferredPaths ?? []).map((path, index) => [path, 100 - index]));

  return candidates
    .filter((item) => item.path !== currentPath)
    .map((item) => ({
      item,
      score:
        (preferred.get(item.path) ?? 0)
        + overlap(targetTokens, tokens(item.text)) * 8
        + (current?.category && current.category === item.category ? 4 : 0),
    }))
    .sort((left, right) => right.score - left.score || left.item.path.localeCompare(right.item.path))
    .slice(0, 5)
    .map(({ item }) => ({
      href: item.path,
      label: item.label,
      description: item.description,
    }));
}

function pathFor(kind: SearchOpportunityKind, slug: string) {
  return {
    product: `/reviews/${slug}`,
    guide: `/guides/${slug}`,
    roundup: `/best/${slug}`,
  }[kind];
}

export function searchOpportunityBacklinks(site: SiteKey, kind: SearchOpportunityKind, slug: string) {
  const sourcePath = pathFor(kind, slug);
  return searchOpportunities.filter(
    (opportunity) =>
      opportunity.site === site &&
      `${opportunity.kind}:${opportunity.slug}` !== `${kind}:${slug}` &&
      searchOpportunityLinks(opportunity).some((link) => link.href === sourcePath),
  );
}

export function searchOpportunityPath(opportunity: SearchOpportunity) {
  return pathFor(opportunity.kind, opportunity.slug);
}
