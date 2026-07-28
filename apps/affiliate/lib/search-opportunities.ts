import { siteGuides, siteProducts, siteRoundups } from "./content";
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
    query: "Is Deco BE25 enough, or should you buy Deco BE63?",
    answer: "Choose BE25 when two 2.5GbE ports per node, dual-band coverage, and Ethernet backhaul fit the plan. Move to BE63 when its 6GHz radio, stronger wireless-backhaul options, or four 2.5GbE ports per node solve a specific constraint; the Wi-Fi 7 label alone does not justify the upgrade.",
    updatedAt: decoClusterUpdatedAt,
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
    query: "Does Deco BE63's 6GHz band justify upgrading from BE25?",
    answer: "Pay for BE63 when 6GHz improves a viable wireless-backhaul path, current 6GHz clients need that band, or four 2.5GbE ports avoid another switch. BE25 remains the value choice when Ethernet carries backhaul, two ports per node are enough, and the home is mostly using 5GHz clients.",
    updatedAt: decoClusterUpdatedAt,
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
    answer: "The Branch chair is most convincing when its seat depth, arm range, and lumbar shape fit the actual user. Measure first and read the current residential warranty exclusions; a long warranty is useful only when the seller, usage type, and covered component match the claim.",
    updatedAt,
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
    query: "How does ASUS ZenWiFi BT6 compare with Deco BE63?",
    answer: "BT6 is the better fit when ASUS controls and its firmware ecosystem are preferred; BE63 is easier to justify when its port layout, simpler Deco management, and wider buying ecosystem match the home. Compare exact pack, ports, backhaul plan, and firmware features before price.",
    updatedAt,
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
  },
  {
    site: "smarthome",
    kind: "product",
    slug: "eufy-video-doorbell-e340",
    query: "Can eufy E340 work without a subscription?",
    answer: "E340 can use local storage without a required monthly plan when paired with the supported storage path. Confirm what storage hardware is included, which AI or history features remain local, and whether the dual-camera view solves the actual package-area blind spot.",
    updatedAt,
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
  },
  {
    site: "pet",
    kind: "roundup",
    slug: "levoit-vital-200s-p-vs-shark-neverchange-max",
    query: "Levoit Vital 200S-P or Shark NeverChange MAX for pets?",
    answer: "Levoit is easier to justify when a washable prefilter, app controls, and conventional replacement filters fit the routine. Shark's long-life-filter proposition is attractive only after checking the exact model, room size, odor expectations, and what its filter-life claim excludes.",
    updatedAt,
  },
  {
    site: "pet",
    kind: "product",
    slug: "petlibro-one-rfid-smart-feeder",
    query: "Is PETLIBRO One RFID suitable for a multi-cat home?",
    answer: "It helps when one tagged pet needs controlled access to dry food, but each pet's behavior, collar-tag tolerance, bowl guarding, and portion plan still need testing. Compare it with an implanted-microchip feeder when relying on a removable collar tag is the main concern.",
    updatedAt,
    preferredPaths: ["/guides/rfid-feeder-vs-microchip-feeder-guide"],
  },
  {
    site: "network",
    kind: "guide",
    slug: "deco-mesh-connection-drops-troubleshooting",
    query: "How do you troubleshoot repeated Deco mesh connection drops?",
    answer: "First identify whether the client, satellite, local LAN, DNS, modem, or internet path is dropping. Then update firmware, test a wired client, move the satellite closer, remove suspect loops, and change only one variable before measuring again.",
    updatedAt,
  },
  {
    site: "pet",
    kind: "guide",
    slug: "air-purifier-placement-near-litter-box",
    query: "Where should an air purifier be placed near a litter box?",
    answer: "Place it close enough to capture airborne dust and odor without aiming strong airflow directly across the litter. Leave the manufacturer's intake and outlet clear, avoid a damp or dirty corner, and keep the unit accessible for prefilter cleaning.",
    updatedAt,
  },
  {
    site: "homeoffice",
    kind: "product",
    slug: "ergotron-hx-monitor-arm",
    query: "Is Ergotron HX the right monitor arm for a walking desk?",
    answer: "HX is appropriate for a heavy display that falls inside the exact weight, VESA, and size limits, provided the desk edge can support the clamp. A lighter screen may be harder to balance, and walking vibration still depends on the desk frame and mounting point.",
    updatedAt,
  },
  {
    site: "smarthome",
    kind: "roundup",
    slug: "ultraloq-bolt-se-vs-aqara-u400",
    query: "ULTRALOQ Bolt SE or Aqara U400?",
    answer: "Choose Bolt SE when straightforward fingerprint access and its ecosystem fit matter most. Choose U400 when its newer entry methods and Aqara/Matter direction solve a real need, after verifying door fit, hub requirements, fallback entry, and region-specific feature support.",
    updatedAt,
  },
  {
    site: "baby",
    kind: "guide",
    slug: "ergobaby-omni-breeze-forward-facing-age-guide",
    query: "When can a baby face outward in Ergobaby Omni Breeze?",
    answer: "Outward-facing carry begins only after strong head and neck control and the current height and weight requirements are met, commonly around five to six months. Keep sessions short, watch the baby's cues, and return to inward carry when overstimulated or tired.",
    updatedAt,
    preferredPaths: ["/reviews/ergobaby-omni-breeze-carrier", "/guides/ergobaby-omni-breeze-positions-by-age"],
  },
  {
    site: "smarthome",
    kind: "roundup",
    slug: "eufy-e340-vs-tapo-d210",
    query: "eufy E340 or Tapo D210 for local video storage?",
    answer: "E340 is strongest when dual-camera package coverage and the chosen eufy storage path matter. D210 is the better fit when Tapo integration, its power arrangement, and a simpler purchase price solve the job; verify included chime, storage, and subscription boundaries.",
    updatedAt,
  },
  {
    site: "baby",
    kind: "product",
    slug: "dr-browns-all-in-one-sterilizer-dryer",
    query: "How much fits in Dr. Brown's sterilizer dryer, and does it dry fully?",
    answer: "Capacity depends on bottle shape, pump parts, and how airflow can move between items—not just the bottle count. Load the family's largest normal cycle on paper, confirm the drying program, and expect tightly nested parts to need repositioning or extra drying time.",
    updatedAt,
  },
  {
    site: "homeoffice",
    kind: "roundup",
    slug: "best-walking-pad-and-monitor-arm-setup",
    query: "What monitor-arm setup stays stable with a walking pad?",
    answer: "Stability comes from a rigid desk frame, a clamp placed near strong structure, a correctly tensioned arm, and a walking speed that does not transmit excessive vibration. Choose the arm only after measuring monitor weight, VESA pattern, desktop thickness, and cable travel.",
    updatedAt,
  },
  {
    site: "smarthome",
    kind: "guide",
    slug: "tapo-p125m-vs-p110m",
    query: "Tapo P110M or P125M: which one has energy monitoring and Matter?",
    answer: "Model and region determine the answer, so match the full suffix on the live listing. Buy for the required plug shape, load limit, energy data, and Matter support rather than assuming every P110M or P125M listing exposes the same combination.",
    updatedAt,
  },
  {
    site: "pet",
    kind: "guide",
    slug: "levoit-vital-200s-p-filter-cost-and-maintenance",
    query: "What does a Levoit Vital 200S-P cost to maintain?",
    answer: "Budget official compatible replacement filters at the household's actual dust, hair, and odor load, and clean the washable prefilter regularly. Do not treat the indicator as a laboratory measurement; inspect airflow, odor, dust buildup, and filter condition.",
    updatedAt,
  },
  {
    site: "pet",
    kind: "guide",
    slug: "rfid-feeder-vs-microchip-feeder-guide",
    query: "RFID collar feeder or implanted-microchip feeder?",
    answer: "A collar-tag feeder is easier when the pet reliably wears the supplied tag. An implanted-microchip feeder avoids a removable tag but must support the pet's chip and access behavior; compare bowl access, training, power, cleaning, and failure fallback.",
    updatedAt,
    preferredPaths: ["/reviews/petlibro-one-rfid-smart-feeder"],
  },
  {
    site: "homeoffice",
    kind: "product",
    slug: "amazon-basics-monitor-arm",
    query: "Will the Amazon Basics gas-spring arm fit a 27-inch monitor?",
    answer: "Screen size alone is not enough. Confirm the exact arm's weight range, VESA pattern, clamp or grommet range, desk edge, and monitor center of gravity; a 27-inch display outside the weight range will not balance safely.",
    updatedAt,
  },
  {
    site: "network",
    kind: "guide",
    slug: "deco-be63-multigig-ports-guide",
    query: "How should Deco BE63 multi-gig ports be assigned?",
    answer: "Assign the fastest required path first—WAN, wired backhaul, switch uplink, NAS, or workstation—then map every remaining hop. A fast Deco port cannot create multi-gig performance when the modem, switch, cable, or client negotiates more slowly.",
    updatedAt,
  },
  {
    site: "network",
    kind: "guide",
    slug: "usb-c-ethernet-adapter-guide",
    query: "Should you buy a USB-C Ethernet adapter or a full dock?",
    answer: "Buy the adapter when reliable Ethernet is the only missing port. Buy a dock when displays, charging, storage, and peripherals must share one connection, after verifying host USB-C capabilities, power delivery, display limits, and Ethernet speed.",
    updatedAt,
  },
  {
    site: "homeoffice",
    kind: "guide",
    slug: "single-vs-dual-monitor-arm-walking-desk",
    query: "Single or dual monitor arms for a walking desk?",
    answer: "Separate single arms usually allow more independent placement and can spread clamp load; a dual arm is tidier but concentrates weight and movement. Measure both monitors, desk structure, clamp spacing, and cable travel before choosing.",
    updatedAt,
  },
  {
    site: "homeoffice",
    kind: "guide",
    slug: "walking-pad-desk-measurement-checklist",
    query: "What should you measure before adding a walking pad under a desk?",
    answer: "Measure desk height range, pad width and length, belt area, rear clearance, step-on space, chair storage, cable paths, and monitor movement. The setup must still reach a neutral typing height when standing on the pad.",
    updatedAt,
  },
  {
    site: "homeoffice",
    kind: "guide",
    slug: "walking-pad-speed-monitor-stability-guide",
    query: "How fast can you walk without making the monitor shake?",
    answer: "There is no universal speed: desk rigidity, floor, stride, monitor mass, and arm tension all matter. Start slowly, type a real task, watch the display edge, then change one variable at a time before increasing speed.",
    updatedAt,
  },
  {
    site: "network",
    kind: "guide",
    slug: "cable-modem-2-5g-port-buying-guide",
    query: "When does a cable modem need a 2.5GbE port?",
    answer: "A 2.5GbE modem port matters when the provisioned plan can exceed gigabit or when the ISP overprovisions above a 1GbE link. The router WAN port, cable, and service tier must all support the same path.",
    updatedAt,
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
    site: "style",
    kind: "product",
    slug: "loungefly-mickey-mouse-mini-backpack",
    query: "What fits in a Loungefly Mickey Mouse mini backpack?",
    answer: "Use the listed exterior dimensions only as a starting point: the zipper opening, lining, front pocket, and structured shape reduce usable volume. Compare the actual daily carry list and strap range before buying it as more than an occasional statement bag.",
    updatedAt,
  },
  {
    site: "baby",
    kind: "guide",
    slug: "bottle-sterilizer-dryer-for-twins-capacity-guide",
    query: "What sterilizer-dryer capacity is practical for twins?",
    answer: "Count the family's largest real cycle—bottles, collars, nipples, pump parts, and pacifiers—and leave airflow around each item. For twins, cycle time and drying reliability usually matter more than a headline bottle count.",
    updatedAt,
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
  },
  {
    site: "style",
    kind: "product",
    slug: "betsey-johnson-cupcake-mismatch-earrings",
    query: "Are Betsey Johnson cupcake mismatch earrings comfortable for repeat wear?",
    answer: "Comfort depends on the listed length, weight, closure, and the wearer's sensitivity more than the motif. Compare the dimensions with an owned pair, inspect the finish and seller during the return window, and let the earrings remain the outfit's focal point.",
    updatedAt,
  },
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
  return findSearchOpportunity(site, kind, slug)?.updatedAt;
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
