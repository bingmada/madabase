import type { SiteKey } from "./types";

export const portfolioRankingRefreshAt = "August 13, 2026";

type PortfolioRankingOpportunity = {
  site: SiteKey;
  kind: "product" | "guide" | "roundup";
  slug: string;
  query: string;
  answer: string;
  updatedAt: string;
  preferredPaths: string[];
};

export const portfolioRankingOpportunities: PortfolioRankingOpportunity[] = [
  {
    site: "network", kind: "product", slug: "netgear-gs308e-gigabit-switch",
    query: "Is NETGEAR GS308E the managed eight-port switch, and how is it different from GS308, GS308T, or GS908E?",
    answer: "GS308E is the eight-port Gigabit Plus model with basic web-managed features. Do not transfer claims from the unmanaged GS308, more capable Smart Managed Pro GS308T, or differently shaped GS908E. Confirm the exact model label, management features, VLAN and QoS needs, power supply, seller, and return terms before buying.",
    updatedAt: portfolioRankingRefreshAt,
    preferredPaths: ["/best/netgear-gs308e-vs-tp-link-tl-sg108", "/guides/home-ethernet-switch-guide", "/reviews/tp-link-tl-sg108-gigabit-switch", "/guides/ethernet-stuck-at-100-mbps-guide"],
  },
  {
    site: "network", kind: "product", slug: "tp-link-deco-be85-wifi-7-mesh",
    query: "Is Deco BE85 worth buying instead of BE63 or BE67?",
    answer: "Choose BE85 only when its higher wireless capacity, 10GbE path, extra radio resources, or demanding wireless backhaul has a measured job. BE63 is usually the cleaner value for several 2.5GbE devices, while BE67 fits a plan that needs one defined 10GbE path without paying for the full BE85 tier.",
    updatedAt: portfolioRankingRefreshAt,
    preferredPaths: ["/guides/deco-be63-vs-be67-vs-be85-buying-guide", "/best/tp-link-deco-be67-vs-be63", "/reviews/tp-link-deco-be63-wifi-7-mesh", "/reviews/tp-link-deco-be67-wifi-7-mesh"],
  },
  {
    site: "network", kind: "product", slug: "amazon-eero-6-mesh-wifi-system",
    query: "Is Amazon eero 6 still a sensible mesh system for a normal home?",
    answer: "Eero 6 is a simplicity-first dual-band mesh option, not a current high-end multi-gig or Wi-Fi 7 purchase. It can fit a modest connection and low-maintenance app workflow, but buyers who need wired backhaul ports at every node, advanced local controls, 6GHz, or multi-gig networking should compare a newer system before ordering.",
    updatedAt: portfolioRankingRefreshAt,
    preferredPaths: ["/best/best-mesh-wifi-for-apartments-and-homes", "/guides/mesh-wifi-node-placement-guide", "/guides/wifi-7-vs-wifi-6-guide"],
  },
  {
    site: "network", kind: "roundup", slug: "netgear-gs308e-vs-tp-link-tl-sg108",
    query: "NETGEAR GS308E or TP-Link TL-SG108: do you need management features?",
    answer: "Choose GS308E when basic VLAN, QoS, port statistics or traffic visibility has a real job. Choose TL-SG108 when an unmanaged fanless eight-port Gigabit switch is enough. Neither model creates a 2.5GbE path, so confirm whether Gigabit is the actual ceiling before comparing small management differences.",
    updatedAt: portfolioRankingRefreshAt,
    preferredPaths: ["/reviews/netgear-gs308e-gigabit-switch", "/reviews/tp-link-tl-sg108-gigabit-switch", "/guides/home-ethernet-switch-guide", "/best/best-2-5g-home-network-upgrades"],
  },
  {
    site: "network", kind: "product", slug: "arris-surfboard-s33-cable-modem",
    query: "Is ARRIS SURFboard S33 compatible with the plan and router you already have?",
    answer: "Check the ISP's current approved-device list, service tier, DOCSIS provisioning and whether the router can use the S33's multi-gig Ethernet output. The modem does not provide Wi-Fi or routing, and a faster modem port cannot raise an ISP plan or router WAN port that remains the bottleneck.",
    updatedAt: portfolioRankingRefreshAt,
    preferredPaths: ["/best/best-cable-modems-for-xfinity-spectrum-cox", "/guides/cable-modem-2-5g-port-buying-guide", "/guides/modem-router-combo-vs-separate-modem-router-guide", "/reviews/motorola-mb8611-cable-modem"],
  },
  {
    site: "network", kind: "guide", slug: "wifi-7-vs-wifi-6-guide",
    query: "Is Wi-Fi 7 worth replacing a working Wi-Fi 6 network?",
    answer: "Upgrade only when compatible clients, multi-gig wired ports, 6GHz conditions, congestion, latency, or mesh backhaul solve a measured limit. A Wi-Fi 7 label cannot improve an older client radio, a one-gigabit Ethernet path, poor node placement, weak ISP service, or a home that already has reliable Wi-Fi 6 coverage.",
    updatedAt: portfolioRankingRefreshAt,
    preferredPaths: ["/guides/is-wifi-7-worth-it-for-1gbps-internet", "/best/best-wifi-7-routers-for-home-networks", "/guides/wifi-7-device-compatibility-checklist", "/guides/wifi-7-mesh-budget-midrange-premium-guide"],
  },
  {
    site: "smarthome", kind: "product", slug: "meross-msg100-homekit-garage-door-opener",
    query: "Will Meross MSG100 work with the garage opener, Wi-Fi, and Apple Home setup you have?",
    answer: "Verify the exact opener against Meross compatibility guidance, including whether an accessory is required, then check 2.4GHz signal at the controller and the selected MSG100 regional variant. HomeKit support does not remove the need for correct sensor placement, physical door safety checks, and a tested manual fallback.",
    updatedAt: portfolioRankingRefreshAt,
    preferredPaths: ["/guides/smart-garage-door-controller-compatibility-hub-offline-guide", "/guides/matter-controller-vs-thread-border-router", "/reviews/aqara-hub-m3"],
  },
  {
    site: "smarthome", kind: "product", slug: "aqara-presence-multi-sensor-fp300",
    query: "Is Aqara FP300 a better room-presence sensor than FP2?",
    answer: "FP300 is the better direction when its battery-powered placement and multi-sensor role fit the room; FP2 remains the stronger direction when powered Wi-Fi presence mapping and zone behavior solve the job. Confirm current protocol, hub or controller requirements, detection boundaries, mounting position, battery or cable plan, and supported automations before choosing.",
    updatedAt: portfolioRankingRefreshAt,
    preferredPaths: ["/best/aqara-fp300-vs-fp2", "/reviews/aqara-presence-sensor-fp2", "/reviews/aqara-hub-m3"],
  },
  {
    site: "smarthome", kind: "product", slug: "aqara-presence-sensor-fp2",
    query: "Is Aqara FP2 worth its wired setup for zones and room presence?",
    answer: "FP2 is justified when one powered sensor can cover meaningful zones and the room supports careful placement and calibration. It is a poor fit when a battery sensor, simple motion trigger, or privacy-minimal setup is enough. Check Wi-Fi, app, mounting, reflection, zone and ecosystem requirements before buying.",
    updatedAt: portfolioRankingRefreshAt,
    preferredPaths: ["/best/aqara-fp300-vs-fp2", "/reviews/aqara-presence-multi-sensor-fp300", "/reviews/aqara-hub-m3"],
  },
  {
    site: "smarthome", kind: "roundup", slug: "aqara-fp300-vs-fp2",
    query: "Aqara FP300 or FP2: which presence sensor fits the room?",
    answer: "Choose FP300 for flexible battery-powered placement when its current controller path and detection behavior meet the automation. Choose FP2 when powered operation, Wi-Fi and configurable room zones justify a fixed installation. Map mounting, coverage, pets, reflections, power, protocol and fallback behavior before comparing headline features.",
    updatedAt: portfolioRankingRefreshAt,
    preferredPaths: ["/reviews/aqara-presence-multi-sensor-fp300", "/reviews/aqara-presence-sensor-fp2", "/reviews/aqara-hub-m3"],
  },
  {
    site: "smarthome", kind: "product", slug: "tapo-p125m-matter-smart-plug",
    query: "Is Tapo P125M the compact Matter plug, and does it include energy monitoring?",
    answer: "P125M is the compact-control choice when outlet clearance and Matter support matter. Do not assume it has the same energy-monitoring role as P110M. Confirm the exact model, electrical rating, plug orientation, controller, Wi-Fi and app requirements, seller and selected pack before checkout.",
    updatedAt: portfolioRankingRefreshAt,
    preferredPaths: ["/guides/tapo-p125m-vs-p110m", "/reviews/tapo-p110m-energy-monitoring-smart-plug", "/best/best-tapo-matter-smart-plug-for-energy-or-compact-control", "/guides/tapo-p110m-home-assistant-energy-monitoring"],
  },
  {
    site: "smarthome", kind: "product", slug: "schlage-encode-plus-smart-lock",
    query: "Is Schlage Encode Plus compatible with the door, Apple Home Key, and remote-access plan?",
    answer: "Buy only after the deadbolt bore, backset, door thickness, handing and strike alignment pass. Then verify the exact Encode Plus model, Apple Home Key and Thread or Wi-Fi expectations, household phone access, battery routine, physical-key fallback, seller and regional warranty.",
    updatedAt: portfolioRankingRefreshAt,
    preferredPaths: ["/guides/smart-lock-door-fit-hub-compatibility", "/guides/apple-home-key-smart-lock-buying-guide", "/guides/matter-smart-lock-controller-checklist", "/reviews/aqara-smart-lock-u100"],
  },
  {
    site: "smarthome", kind: "guide", slug: "matter-controller-vs-thread-border-router",
    query: "What is the difference between a Matter controller and a Thread border router?",
    answer: "A Matter controller adds and manages Matter devices in an ecosystem. A Thread border router connects the local Thread mesh to the home's IP network. A Matter-over-Thread device normally needs both roles somewhere in the chosen ecosystem, although one hub or speaker can provide both. Verify the exact model and software support rather than relying on the product category name.",
    updatedAt: portfolioRankingRefreshAt,
    preferredPaths: ["/guides/matter-vs-thread-vs-zigbee", "/guides/matter-thread-wifi-zigbee-device-checklist", "/reviews/aqara-hub-m3", "/guides/aqara-hub-m3-matter-thread-setup"],
  },
  {
    site: "homeoffice", kind: "guide", slug: "portable-monitor-usb-c-dp-alt-mode-displaylink-guide",
    query: "Will a USB-C laptop run a portable monitor through DP Alt Mode or DisplayLink?",
    answer: "The USB-C connector shape proves neither video output nor sufficient power. Native DP Alt Mode requires a video-capable host port and suitable cable; DisplayLink sends compressed display data through USB and requires software. Confirm the exact laptop port, operating-system and admin restrictions, monitor input, power budget, cable, resolution and refresh target.",
    updatedAt: portfolioRankingRefreshAt,
    preferredPaths: ["/reviews/asus-zenscreen-mb16acv-portable-monitor", "/guides/macbook-dual-monitor-dock-chip-compatibility-guide", "/guides/usb-c-dock-ports-explained-guide"],
  },
  {
    site: "homeoffice", kind: "guide", slug: "monochrome-laser-printers-ownership-cost-and-maintenance",
    query: "What does a monochrome laser printer cost to own after the purchase?",
    answer: "Compare toner yield under the stated test method, drum or maintenance-unit separation, duplex use, paper path, idle power, driver support and the realistic monthly page count. A low printer price can lose when starter toner is small or replacement supplies are expensive; a larger model can also waste space and capital when print volume is light.",
    updatedAt: portfolioRankingRefreshAt,
    preferredPaths: ["/guides/monochrome-laser-printers-buying-guide", "/guides/monochrome-laser-printers-vs-alternatives", "/guides/monochrome-laser-printers-setup-and-daily-workflow"],
  },
  {
    site: "homeoffice", kind: "roundup", slug: "best-standing-desks-for-small-spaces",
    query: "Which standing desk actually fits a small room?",
    answer: "Choose from the usable footprint, minimum seated height, desktop depth, monitor-arm clamp area, chair pullout, cable travel and door path—not width alone. A compact desk is a poor fit if the frame stays too high, the top is too shallow, or accessories consume the clearance that made it attractive.",
    updatedAt: portfolioRankingRefreshAt,
    preferredPaths: ["/best/ergear-48x24-vs-flexispot-e7-mini", "/reviews/flexispot-e7-mini-standing-desk", "/reviews/ergear-48x24-electric-standing-desk", "/guides/48-vs-55-inch-desk-guide"],
  },
  {
    site: "baby", kind: "product", slug: "momcozy-mw05-portable-milk-warmer",
    query: "Is Momcozy MW05 a practical portable milk warmer for the feeding routine?",
    answer: "MW05 is useful only when the exact bottle or stored-milk workflow, warming capacity, battery and charging plan, cleaning path, temperature verification and time away from an outlet fit the household. Follow current milk-handling guidance and the exact instructions; a portable warmer does not make repeated warming or prolonged holding safe.",
    updatedAt: portfolioRankingRefreshAt,
    preferredPaths: ["/guides/travel-bottle-warmer-heating-cleaning-battery-guide", "/best/philips-avent-scf358-vs-baby-brezza-smart-bottle-warmer", "/reviews/baby-brezza-smart-bottle-warmer"],
  },
  {
    site: "baby", kind: "product", slug: "babybjorn-carrier-harmony",
    query: "Is BabyBjörn Carrier Harmony suitable for a newborn and later back carry?",
    answer: "Harmony can cover different stages only when the baby meets the current size and developmental requirements for each position and the exact newborn settings are correct. Back and outward carry are not newborn modes. Confirm the manual, material, caregiver fit, airway visibility, head support, seller and return path before use.",
    updatedAt: portfolioRankingRefreshAt,
    preferredPaths: ["/guides/babybjorn-harmony-newborn-fit-checklist", "/best/babybjorn-mini-vs-harmony", "/best/babybjorn-harmony-vs-ergobaby-omni-breeze", "/reviews/ergobaby-omni-breeze-carrier"],
  },
  {
    site: "baby", kind: "roundup", slug: "best-bottle-sterilizers-and-dryers",
    query: "Which bottle sterilizer and dryer fits the real daily bottle and pump-part load?",
    answer: "Count the exact bottles, nipples, valves and compatible pump parts needed between cycles, then compare chamber fit, drying completeness, cycle time, counter clearance, descaling and storage. Cleaning, sanitizing and drying are separate jobs; choose the appliance that removes the repeated bottleneck under current public-health and manufacturer guidance.",
    updatedAt: portfolioRankingRefreshAt,
    preferredPaths: ["/reviews/dr-browns-all-in-one-sterilizer-dryer", "/reviews/grownsy-bottle-sterilizer-dryer", "/reviews/chicco-advanced-sterilizer-dryer", "/guides/bottle-washer-vs-sterilizer-vs-dryer-guide"],
  },
  {
    site: "pet", kind: "guide", slug: "open-top-self-cleaning-litter-boxes-compatibility-and-fit-guide",
    query: "Will an open-top self-cleaning litter box fit the cat and the room?",
    answer: "Measure entry height, usable interior, turning space, waste-drawer access and the full service footprint. Confirm the exact cat age, weight and mobility limits, compatible litter, sensor behavior, cleaning routine, power and backup box. An open top can improve access, but it does not remove acclimation, monitoring or mechanical safety checks.",
    updatedAt: portfolioRankingRefreshAt,
    preferredPaths: ["/reviews/neakasa-m1-plus-self-cleaning-litter-box", "/guides/open-top-self-cleaning-litter-boxes-buying-guide", "/guides/open-top-self-cleaning-litter-boxes-ownership-cost-and-maintenance", "/guides/air-purifier-placement-near-litter-box"],
  },
];
