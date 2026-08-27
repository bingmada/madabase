import type { Guide, SiteKey } from "./types";
import communityEvidenceData from "../config/quadruple-community-evidence.json";
import deepRankRecoveryData from "../config/deep-rank-recovery-2026-08-27.json";
import { findFamilyEditorialBrief } from "./quadruple-family-editorial";

type ExpansionSite = Exclude<SiteKey, "style">;

type ProductFamily = {
  site: ExpansionSite;
  slug: string;
  name: string;
  category: string;
  alternative: string;
};

type SiteProfile = {
  image: string;
  imageAlt: string;
  fit: string;
  ownership: string;
  workflow: string;
  risk: string;
  sourceName: string;
  sourceUrl: string;
  purchaseNoise: string;
  planningContext: string;
  dependencies: string;
  realContext: string;
  operatingCosts: string;
  failureModes: string;
  identityRecord: string;
};

const updatedAt = "August 9, 2026";
const deepRankRecoveryUpdatedAt = "August 27, 2026";
const deepRankRecoveryTargets = new Map(
  deepRankRecoveryData.targets.map((target) => [`${target.site}:${target.slug}`, target]),
);

const siteProfiles: Record<ExpansionSite, SiteProfile> = {
  network: {
    image: "/images/affiliate/hero-network-realistic.webp",
    imageAlt: "Home network equipment arranged for a measured installation plan",
    fit: "Map every endpoint, room, cable path, port speed, power source, and fallback before choosing hardware.",
    ownership: "Include adapters, licenses, subscriptions, replacement power supplies, mounting hardware, and the time required to keep firmware and configuration current.",
    workflow: "Draw the present topology and the intended topology, label every link, then test one segment at a time before moving the rest of the network.",
    risk: "Skip a purchase when the advertised speed depends on ports, cabling, clients, radio bands, or service tiers the installation does not have.",
    sourceName: "Wi-Fi Alliance",
    sourceUrl: "https://www.wi-fi.org/discover-wi-fi",
    purchaseNoise: "a newer radio label, a laboratory throughput number, or unused management features",
    planningContext: "record the rooms, endpoints, cable paths, port speeds, power sources, internet tier, and the failure that interrupts the household",
    dependencies: "specific cabling, transceivers, power budgets, adapters, controller software, service tiers, or client capabilities",
    realContext: "topology, client mix, cable path, traffic load, and recovery window",
    operatingCosts: "cables, modules, power supplies, licenses, backup configuration, electricity, and replacement hardware",
    failureModes: "loss of power, uplink, name resolution, controller access, configuration, or a replaceable cable or module",
    identityRecord: "manufacturer, complete model, hardware revision, region, port layout, firmware branch, and included power hardware",
  },
  smarthome: {
    image: "/images/affiliate/hero-smarthome-realistic.webp",
    imageAlt: "Connected home devices arranged around a local-control planning board",
    fit: "Confirm physical fit, electrical or mechanical requirements, controller support, radio protocol, account ownership, and the manual fallback path.",
    ownership: "Count hubs, subscriptions, batteries, consumables, professional installation, cloud dependence, and replacement effort across the expected service life.",
    workflow: "Install one device, document its owner account and recovery path, test local and remote control, then add automations only after the basic device remains dependable.",
    risk: "Skip a product when safety, access, privacy, or essential operation depends on an unverified cloud feature or an unsupported controller combination.",
    sourceName: "Connectivity Standards Alliance — Matter",
    sourceUrl: "https://csa-iot.org/all-solutions/matter/",
    purchaseNoise: "a polished app screen, a protocol badge, or an automation demo that hides its dependencies",
    planningContext: "record the fixture, circuit or mounting point, controller, radio coverage, owner account, household access, manual fallback, and the failure that matters",
    dependencies: "a neutral wire, hub, bridge, account, subscription, compatible controller, professional installation, or reliable cloud service",
    realContext: "fixture, circuit, controller ecosystem, radio path, owner account, and manual fallback",
    operatingCosts: "hubs, batteries, subscriptions, sensors, professional work, account recovery, and replacement effort",
    failureModes: "loss of mains power, radio coverage, internet, controller, account access, automation state, or a replaceable battery",
    identityRecord: "manufacturer, complete model, hardware revision, electrical rating, protocol, controller support, included parts, and region",
  },
  homeoffice: {
    image: "/images/affiliate/hero-homeoffice-realistic.webp",
    imageAlt: "Home office equipment arranged for a fit and workflow comparison",
    fit: "Measure the desk, body position, device ports, operating-system support, power path, cable reach, and storage space before choosing the upgrade.",
    ownership: "Include required cables, adapters, software, replacement parts, consumables, warranty handling, and the cost of returning a poor ergonomic fit.",
    workflow: "Test the change in the real workday: startup, switching, meetings, focused work, cleanup, and shutdown should all become simpler rather than merely more elaborate.",
    risk: "Skip the product when it solves a specification problem but creates a new fit, driver, noise, glare, cable, or daily-switching problem.",
    sourceName: "OSHA Computer Workstations eTool",
    sourceUrl: "https://www.osha.gov/etools/computer-workstations",
    purchaseNoise: "a larger specification number, a dramatic desk photo, or a feature that adds switching friction",
    planningContext: "record the worker, posture, desk dimensions, computer and operating system, ports, power, cable reach, storage, meeting routine, and the task that is currently slow or uncomfortable",
    dependencies: "a driver, dock, cable, adapter, mount, power supply, operating-system feature, desk clearance, or assembly service",
    realContext: "desk, body position, computer, operating system, cable reach, workday, and shared-device routine",
    operatingCosts: "cables, adapters, software, replacement parts, consumables, warranty handling, power, and the cost of returning a poor fit",
    failureModes: "loss of power, video, USB, network, driver support, saved settings, a consumable, or an adjustable part",
    identityRecord: "manufacturer, complete model, hardware revision, operating-system support, port layout, dimensions, power supply, and included cables",
  },
  baby: {
    image: "/images/affiliate/hero-baby-realistic.webp",
    imageAlt: "Baby gear arranged for a caregiver fit and safety review",
    fit: "Use the exact child age, weight, developmental stage, caregiver fit, room or vehicle dimensions, and current manufacturer instructions.",
    ownership: "Include cleaning supplies, replacement parts, consumables, storage, travel handling, product registration, and the likelihood that the child will outgrow the item.",
    workflow: "Practice assembly, adjustment, cleaning, transfer, and emergency fallback before depending on the product during a tired or time-sensitive routine.",
    risk: "Skip or stop using the product when the exact model instructions, recall status, age or weight limits, safe-use environment, or fit cannot be confirmed.",
    sourceName: "U.S. Consumer Product Safety Commission — Baby Safety",
    sourceUrl: "https://www.cpsc.gov/Safety-Education/Safety-Guides/Kids-and-Babies",
    purchaseNoise: "a lifestyle photo, extra padding, an app feature, or a convenience claim that does not change the instructions",
    planningContext: "record the child's current age, weight and development, each caregiver, room or vehicle measurements, transfer and cleaning routine, current instructions, and the safety problem being solved",
    dependencies: "an approved base, vehicle position, attachment point, replacement part, consumable, compatible accessory, caregiver technique, or professional fitting help",
    realContext: "child stage, caregiver, room or vehicle, transfer, cleaning routine, supervision, and emergency fallback",
    operatingCosts: "approved replacement parts, cleaning supplies, consumables, storage, travel handling, registration, and the cost of outgrowing the product",
    failureModes: "a loose attachment, missing part, spill, loss of power or monitoring, changed child fit, changed vehicle or room, or an urgent transfer",
    identityRecord: "manufacturer, complete model, manufacture date or lot when present, region, child limits, included parts, recall status, and registration path",
  },
  pet: {
    image: "/images/affiliate/hero-pet-realistic.webp",
    imageAlt: "Pet-care equipment arranged for a routine and cleaning comparison",
    fit: "Match the product to the individual animal's size, behavior, coat, mobility, feeding pattern, home layout, and tolerance for sound or motion.",
    ownership: "Count filters, liners, bags, batteries, subscriptions, cleaning time, replacement parts, and the need to keep a simple manual backup available.",
    workflow: "Introduce the product gradually, observe the animal's response, keep the previous routine available, and verify cleaning and failure recovery before relying on automation.",
    risk: "Skip a product when it creates stress, blocks normal eating or drinking, restricts movement, hides a health problem, or substitutes for necessary human or veterinary care.",
    sourceName: "American Veterinary Medical Association — Pet Care",
    sourceUrl: "https://www.avma.org/resources-tools/pet-owners/petcare",
    purchaseNoise: "an app dashboard, an automatic cycle, a novelty shape, or a capacity headline detached from the animal's routine",
    planningContext: "record the individual animal's size, mobility, coat, eating or elimination pattern, sound sensitivity, behavior, home layout, cleaning routine, and the care problem being solved",
    dependencies: "a filter, liner, bag, collar tag, battery, subscription, app account, compatible food or litter, training period, or veterinary input",
    realContext: "individual animal, home layout, feeding or elimination routine, sound tolerance, cleaning schedule, and manual backup",
    operatingCosts: "filters, liners, bags, batteries, subscriptions, cleaning supplies, replacement parts, training time, and a simple manual backup",
    failureModes: "loss of power, network, water flow, food delivery, waste removal, a consumable, normal access, or an animal refusing the device",
    identityRecord: "manufacturer, complete model, animal-size limits, capacity, compatible consumables, power method, app or subscription needs, and included parts",
  },
  costume: {
    image: "/images/affiliate/hero-halloween-costume-studio-v1.webp",
    imageAlt: "Halloween costume and scene pieces arranged for fit, setup, and storage planning",
    fit: "Confirm body or display measurements, materials, visibility, movement, venue rules, power, weather limits, application supplies, delivery timing, and the exact included pieces.",
    ownership: "Include missing accessories, makeup or adhesive, batteries and fluid, alterations, cleaning, transport, storage volume, replacement parts, shipping, and return restrictions.",
    workflow: "Run a complete dress rehearsal or display setup before the event, including movement, visibility, power, guest clearance, touch-ups, removal, cleanup, and storage.",
    risk: "Skip a product when its materials, visibility, breathing, moving parts, power, weather exposure, skin contact, delivery timing, or storage requirements cannot be verified for the actual event.",
    sourceName: "U.S. FDA — Halloween Safety",
    sourceUrl: "https://www.fda.gov/consumers/consumer-updates/halloween-safety-tips-costumes-candy-and-colored-contact-lenses",
    purchaseNoise: "a premium label, a dramatic product photo, a character promise, or a bundle count that hides missing pieces",
    planningContext: "record the wearer or display measurements, event and venue, movement and visibility needs, materials and skin contact, weather, power, arrival deadline, included pieces, return terms, cleanup, and storage",
    dependencies: "alterations, underlayers, adhesive, remover, makeup, batteries, fog fluid, rigging, transport cases, venue approval, or professional application",
    realContext: "wearer or display, venue, lighting, movement, visibility, weather, setup time, cleanup, and storage",
    operatingCosts: "alterations, missing accessories, makeup or adhesive, batteries and fluid, cleaning, repairs, transport, insured shipping, and storage",
    failureModes: "restricted vision or movement, skin irritation, a failed closure or attachment, loss of power, weather exposure, a moving mechanism, delayed delivery, or damaged storage",
    identityRecord: "seller, complete product or set name, materials, measurements, included pieces, power requirements, delivery promise, return terms, and care instructions",
  },
};

const categoryImages: Record<ExpansionSite, Record<string, { image: string; imageAlt: string }>> = {
  network: {
    wifi: { image: "/images/affiliate/category-network-wifi-editorial-v2.webp", imageAlt: "Original editorial scene with unbranded home Wi-Fi equipment and a measured coverage plan" },
    wired: { image: "/images/affiliate/category-network-wired-editorial-v2.webp", imageAlt: "Original editorial scene with unbranded Ethernet switching, cabling, storage, and test equipment" },
  },
  smarthome: {
    automation: { image: "/images/affiliate/category-smarthome-automation-editorial-v2.webp", imageAlt: "Original editorial scene with unbranded smart-home automation controls and sensors" },
    climate: { image: "/images/affiliate/category-smarthome-climate-editorial-v2.webp", imageAlt: "Original editorial scene with unbranded climate, energy, and charging controls" },
    access: { image: "/images/affiliate/category-smarthome-access-editorial-v2.webp", imageAlt: "Original editorial scene with unbranded smart access, alarm, and shutoff hardware" },
    cameras: { image: "/images/affiliate/category-smarthome-cameras-editorial-v2.webp", imageAlt: "Original editorial scene with unbranded indoor and outdoor camera equipment and mounts" },
  },
  homeoffice: {
    meetings: { image: "/images/affiliate/category-homeoffice-meetings-editorial-v2.webp", imageAlt: "Original editorial scene with unbranded meeting, display, audio, scanning, and printing equipment" },
    ergonomics: { image: "/images/affiliate/category-homeoffice-ergonomics-editorial-v2.webp", imageAlt: "Original editorial scene with unbranded ergonomic keyboard, pointing, stand, and foot-support equipment" },
    desks: { image: "/images/affiliate/category-homeoffice-desks-editorial-v2.webp", imageAlt: "Original editorial scene with an unbranded standing desk, power, mat, and cable-management equipment" },
  },
  baby: {
    travel: { image: "/images/affiliate/category-baby-travel-editorial-v2.webp", imageAlt: "Original editorial scene with unbranded baby travel equipment shown without a child" },
    sleep: { image: "/images/affiliate/category-baby-sleep-editorial-v2.webp", imageAlt: "Original editorial nursery scene with empty firm flat sleep surfaces and no loose bedding" },
    feeding: { image: "/images/affiliate/category-baby-feeding-editorial-v2.webp", imageAlt: "Original editorial scene with unbranded baby feeding, cleaning, changing, and bathing equipment shown empty" },
  },
  pet: {
    feeding: { image: "/images/affiliate/category-pet-feeding-editorial-v2.webp", imageAlt: "Original editorial scene with unbranded pet feeders, fountain, and enrichment equipment" },
    comfort: { image: "/images/affiliate/category-pet-comfort-editorial-v2.webp", imageAlt: "Original editorial scene with unbranded pet bedding, carrier, ramp, tracker, and door equipment" },
    "home-care": { image: "/images/affiliate/category-pet-home-care-editorial-v2.webp", imageAlt: "Original editorial scene with unbranded pet cleaning, litter, grooming, and camera equipment" },
  },
  costume: {
    costumes: { image: "/images/affiliate/category-costume-costumes-editorial-v2.webp", imageAlt: "Original unlicensed costume designs on dress forms in a professional fitting studio" },
    "wigs-makeup": { image: "/images/affiliate/category-costume-wigs-editorial-v2.webp", imageAlt: "Original costume wigs and generic theatrical makeup tools in a hygienic studio" },
    "masks-prosthetics": { image: "/images/affiliate/category-costume-masks-editorial-v2.webp", imageAlt: "Original unlicensed masks and neutral prosthetic materials arranged for safe application planning" },
    "props-animatronics": { image: "/images/affiliate/category-costume-props-editorial-v2.webp", imageAlt: "Original unlicensed theatrical props and animatronic mechanisms arranged for setup and storage planning" },
  },
};

const categorySources: Record<ExpansionSite, Record<string, Array<{ name: string; url: string; note: string }>>> = {
  network: {
    wifi: [{ name: "Wi-Fi Alliance — Discover Wi-Fi", url: "https://www.wi-fi.org/discover-wi-fi", note: "Official Wi-Fi technology and certification baseline." }],
    wired: [{ name: "IEEE 802.3 Ethernet Working Group", url: "https://www.ieee802.org/3/", note: "Official Ethernet standards working-group reference." }],
  },
  smarthome: {
    automation: [{ name: "Connectivity Standards Alliance — Matter", url: "https://csa-iot.org/all-solutions/matter/", note: "Official Matter roles, certification, and ecosystem baseline." }],
    climate: [{ name: "U.S. EPA — Indoor Air Quality", url: "https://www.epa.gov/indoor-air-quality-iaq", note: "Authoritative indoor-air and source-control baseline; consumer sensors are not regulatory instruments." }],
    access: [{ name: "CISA — Secure Our World", url: "https://www.cisa.gov/secure-our-world", note: "Authoritative account, update, password, and connected-device security baseline." }],
    cameras: [{ name: "FTC — How to Secure Your Home Security Cameras", url: "https://consumer.ftc.gov/consumer-alerts/2020/01/how-secure-your-home-security-camera", note: "Authoritative account, network, update, and privacy checks for connected cameras." }],
  },
  homeoffice: {
    meetings: [{ name: "OSHA Computer Workstations eTool", url: "https://www.osha.gov/etools/computer-workstations", note: "Authoritative workstation layout and equipment-fit baseline." }],
    ergonomics: [{ name: "OSHA Computer Workstations eTool", url: "https://www.osha.gov/etools/computer-workstations", note: "Authoritative neutral-posture and workstation adjustment baseline." }],
    desks: [{ name: "OSHA Computer Workstations eTool", url: "https://www.osha.gov/etools/computer-workstations", note: "Authoritative desk, input-device, and workstation adjustment baseline." }],
  },
  baby: {
    travel: [{ name: "NHTSA — Car Seats and Booster Seats", url: "https://www.nhtsa.gov/vehicle-safety/car-seats-and-booster-seats", note: "Authoritative car-seat selection, installation, and child-fit baseline; other travel products still require their exact instructions." }],
    sleep: [{ name: "U.S. CPSC — Safe Sleep", url: "https://www.cpsc.gov/SafeSleep", note: "Authoritative firm, flat, bare sleep-surface and product-safety baseline." }],
    feeding: [{ name: "CDC — Infant and Toddler Nutrition", url: "https://www.cdc.gov/infant-toddler-nutrition/", note: "Authoritative feeding and food-safety baseline; exact product cleaning instructions still control." }],
  },
  pet: {
    feeding: [{ name: "AVMA — Pet Care", url: "https://www.avma.org/resources-tools/pet-owners/petcare", note: "Veterinary-owner baseline for feeding, hydration, behavior, and when equipment cannot replace care." }],
    comfort: [{ name: "AVMA — Pet Care", url: "https://www.avma.org/resources-tools/pet-owners/petcare", note: "Veterinary-owner baseline for fit, behavior, transport, mobility, and health escalation." }],
    "home-care": [{ name: "AVMA — Pet Care", url: "https://www.avma.org/resources-tools/pet-owners/petcare", note: "Veterinary-owner baseline for grooming, hygiene, monitoring, and care limits." }],
  },
  costume: {
    costumes: [{ name: "U.S. CPSC — Halloween Safety", url: "https://www.cpsc.gov/Safety-Education/Safety-Education-Centers/Halloween", note: "Authoritative visibility, flammability, movement, and supervision baseline." }],
    "wigs-makeup": [{ name: "U.S. FDA — Halloween Safety", url: "https://www.fda.gov/consumers/consumer-updates/halloween-safety-tips-costumes-candy-and-colored-contact-lenses", note: "Authoritative cosmetic, eye-area, skin-contact, and costume safety baseline." }],
    "masks-prosthetics": [{ name: "U.S. FDA — Halloween Safety", url: "https://www.fda.gov/consumers/consumer-updates/halloween-safety-tips-costumes-candy-and-colored-contact-lenses", note: "Authoritative face, eye, skin-contact, and visibility baseline." }],
    "props-animatronics": [{ name: "U.S. CPSC — Halloween Safety", url: "https://www.cpsc.gov/Safety-Education/Safety-Education-Centers/Halloween", note: "Authoritative seasonal fire, movement, visibility, and supervision baseline." }],
  },
};

const productFamilies: ProductFamily[] = [
  { site: "network", slug: "indoor-wifi-access-points", name: "Indoor Wi-Fi access points", category: "wifi", alternative: "mesh Wi-Fi systems" },
  { site: "network", slug: "outdoor-wifi-access-points", name: "Outdoor Wi-Fi access points", category: "wifi", alternative: "indoor access points in weather-protected locations" },
  { site: "network", slug: "point-to-point-wireless-bridges", name: "Point-to-point wireless bridges", category: "wifi", alternative: "buried Ethernet or fiber links" },
  { site: "network", slug: "wifi-range-extenders", name: "Wi-Fi range extenders", category: "wifi", alternative: "mesh nodes or wired access points" },
  { site: "network", slug: "usb-wifi-adapters", name: "USB Wi-Fi adapters", category: "wifi", alternative: "PCIe Wi-Fi cards" },
  { site: "network", slug: "pcie-wifi-adapters", name: "PCIe Wi-Fi adapters", category: "wifi", alternative: "USB Wi-Fi adapters" },
  { site: "network", slug: "moca-network-adapters", name: "MoCA network adapters", category: "wired", alternative: "powerline or new Ethernet cabling" },
  { site: "network", slug: "powerline-network-adapters", name: "Powerline network adapters", category: "wired", alternative: "MoCA or wired access points" },
  { site: "network", slug: "ten-gigabit-ethernet-switches", name: "10GbE switches", category: "wired", alternative: "2.5GbE switches" },
  { site: "network", slug: "sfp-plus-network-switches", name: "SFP+ network switches", category: "wired", alternative: "RJ45 10GbE switches" },
  { site: "network", slug: "ethernet-network-interface-cards", name: "Ethernet network interface cards", category: "wired", alternative: "USB-C Ethernet adapters" },
  { site: "network", slug: "usb-c-ethernet-adapters", name: "USB-C Ethernet adapters", category: "wired", alternative: "internal network interface cards" },
  { site: "network", slug: "poe-injectors", name: "PoE injectors", category: "wired", alternative: "PoE switches" },
  { site: "network", slug: "poe-splitters", name: "PoE splitters", category: "wired", alternative: "local device power adapters" },
  { site: "network", slug: "poe-extenders", name: "PoE extenders", category: "wired", alternative: "fiber or a closer powered switch" },
  { site: "network", slug: "sfp-plus-transceivers", name: "SFP+ transceivers", category: "wired", alternative: "direct-attach copper cables" },
  { site: "network", slug: "direct-attach-copper-cables", name: "Direct-attach copper cables", category: "wired", alternative: "optical transceivers and fiber" },
  { site: "network", slug: "fiber-media-converters", name: "Fiber media converters", category: "wired", alternative: "switches with native fiber ports" },
  { site: "network", slug: "network-attached-storage", name: "Network-attached storage appliances", category: "wired", alternative: "direct-attached storage or cloud storage" },
  { site: "network", slug: "hardware-firewall-appliances", name: "Hardware firewall appliances", category: "wired", alternative: "security features built into a router" },
  { site: "network", slug: "vpn-gateways", name: "Dedicated VPN gateways", category: "wired", alternative: "router-based VPN service" },
  { site: "network", slug: "dual-wan-routers", name: "Dual-WAN routers", category: "wifi", alternative: "a standard router with manual failover" },
  { site: "network", slug: "five-g-home-internet-gateways", name: "5G home internet gateways", category: "wifi", alternative: "cable or fiber internet" },
  { site: "network", slug: "mobile-hotspots", name: "Mobile hotspots", category: "wifi", alternative: "phone tethering or travel routers" },
  { site: "network", slug: "home-network-racks", name: "Home network racks", category: "wired", alternative: "wall shelves or structured-media cabinets" },
  { site: "network", slug: "ethernet-patch-panels", name: "Ethernet patch panels", category: "wired", alternative: "direct cable termination" },
  { site: "network", slug: "ethernet-cable-testers", name: "Ethernet cable testers", category: "wired", alternative: "basic continuity testers or professional certification" },

  { site: "smarthome", slug: "matter-smart-bulbs", name: "Matter smart bulbs", category: "automation", alternative: "smart switches" },
  { site: "smarthome", slug: "smart-light-strips", name: "Smart light strips", category: "automation", alternative: "smart bulbs or fixed accent lighting" },
  { site: "smarthome", slug: "smart-wall-switches", name: "Smart wall switches", category: "automation", alternative: "smart bulbs" },
  { site: "smarthome", slug: "smart-dimmer-switches", name: "Smart dimmer switches", category: "automation", alternative: "standard switches with smart bulbs" },
  { site: "smarthome", slug: "smart-power-strips", name: "Smart power strips", category: "automation", alternative: "individual smart plugs" },
  { site: "smarthome", slug: "outdoor-smart-plugs", name: "Outdoor smart plugs", category: "automation", alternative: "weather-rated timers" },
  { site: "smarthome", slug: "mmwave-presence-sensors", name: "mmWave presence sensors", category: "automation", alternative: "PIR motion sensors" },
  { site: "smarthome", slug: "smart-contact-sensors", name: "Smart contact sensors", category: "automation", alternative: "motion sensors" },
  { site: "smarthome", slug: "smart-motion-sensors", name: "Smart motion sensors", category: "automation", alternative: "presence sensors" },
  { site: "smarthome", slug: "temperature-humidity-sensors", name: "Temperature and humidity sensors", category: "climate", alternative: "thermostat room sensors" },
  { site: "smarthome", slug: "indoor-air-quality-monitors", name: "Indoor air-quality monitors", category: "climate", alternative: "single-purpose particle or CO2 monitors" },
  { site: "smarthome", slug: "smart-smoke-co-listeners", name: "Smart smoke and CO listeners", category: "automation", alternative: "interconnected smart alarms" },
  { site: "smarthome", slug: "smart-blind-motors", name: "Smart blind motors", category: "automation", alternative: "complete motorized shades" },
  { site: "smarthome", slug: "smart-curtain-motors", name: "Smart curtain motors", category: "automation", alternative: "motorized curtain tracks" },
  { site: "smarthome", slug: "smart-garage-door-controllers", name: "Smart garage-door controllers", category: "access", alternative: "complete connected openers" },
  { site: "smarthome", slug: "whole-home-energy-monitors", name: "Whole-home energy monitors", category: "climate", alternative: "circuit-level smart plugs" },
  { site: "smarthome", slug: "smart-water-shutoff-valves", name: "Smart water shutoff valves", category: "automation", alternative: "leak sensors without automatic shutoff" },
  { site: "smarthome", slug: "smart-irrigation-controllers", name: "Smart irrigation controllers", category: "climate", alternative: "weather-based standalone timers" },
  { site: "smarthome", slug: "matter-hubs-bridges", name: "Matter hubs and bridges", category: "automation", alternative: "platform-native controllers" },
  { site: "smarthome", slug: "smart-scene-buttons", name: "Smart scene buttons", category: "automation", alternative: "app and voice controls" },
  { site: "smarthome", slug: "smart-home-sirens", name: "Smart-home sirens", category: "access", alternative: "complete monitored alarm systems" },
  { site: "smarthome", slug: "diy-smart-alarm-kits", name: "DIY smart alarm kits", category: "access", alternative: "professionally monitored security systems" },
  { site: "smarthome", slug: "indoor-security-cameras", name: "Indoor security cameras", category: "cameras", alternative: "privacy shutters or local sensors" },
  { site: "smarthome", slug: "outdoor-security-cameras", name: "Outdoor security cameras", category: "cameras", alternative: "video doorbells or floodlight cameras" },
  { site: "smarthome", slug: "floodlight-security-cameras", name: "Floodlight security cameras", category: "cameras", alternative: "separate lighting and cameras" },
  { site: "smarthome", slug: "robot-vacuums", name: "Robot vacuums", category: "automation", alternative: "cordless vacuums" },
  { site: "smarthome", slug: "robot-mops", name: "Robot mops", category: "automation", alternative: "combined vacuum-mop robots" },
  { site: "smarthome", slug: "smart-displays", name: "Smart displays", category: "automation", alternative: "tablets or smart speakers" },
  { site: "smarthome", slug: "smart-speakers", name: "Smart speakers", category: "automation", alternative: "smart displays" },
  { site: "smarthome", slug: "smart-ev-chargers", name: "Smart EV chargers", category: "climate", alternative: "non-connected Level 2 chargers" },

  { site: "homeoffice", slug: "business-usb-c-monitors", name: "Business USB-C monitors", category: "meetings", alternative: "monitors plus a separate dock" },
  { site: "homeoffice", slug: "ultrawide-office-monitors", name: "Ultrawide office monitors", category: "meetings", alternative: "dual-monitor setups" },
  { site: "homeoffice", slug: "dual-screen-portable-monitors", name: "Dual-screen portable monitors", category: "meetings", alternative: "single portable monitors" },
  { site: "homeoffice", slug: "vertical-office-monitors", name: "Vertical office monitors", category: "meetings", alternative: "standard landscape monitors" },
  { site: "homeoffice", slug: "monitor-color-calibrators", name: "Monitor color calibrators", category: "meetings", alternative: "factory-calibrated displays" },
  { site: "homeoffice", slug: "mechanical-office-keyboards", name: "Mechanical office keyboards", category: "ergonomics", alternative: "low-profile keyboards" },
  { site: "homeoffice", slug: "ergonomic-split-keyboards", name: "Ergonomic split keyboards", category: "ergonomics", alternative: "standard keyboards" },
  { site: "homeoffice", slug: "low-profile-keyboards", name: "Low-profile keyboards", category: "ergonomics", alternative: "mechanical keyboards" },
  { site: "homeoffice", slug: "productivity-mice", name: "Productivity mice", category: "ergonomics", alternative: "basic wireless mice" },
  { site: "homeoffice", slug: "vertical-mice", name: "Vertical mice", category: "ergonomics", alternative: "standard mice or trackballs" },
  { site: "homeoffice", slug: "office-trackballs", name: "Office trackballs", category: "ergonomics", alternative: "vertical mice" },
  { site: "homeoffice", slug: "wireless-number-pads", name: "Wireless number pads", category: "ergonomics", alternative: "full-size keyboards" },
  { site: "homeoffice", slug: "office-call-headsets", name: "Office call headsets", category: "meetings", alternative: "USB speakerphones" },
  { site: "homeoffice", slug: "wireless-conference-headsets", name: "Wireless conference headsets", category: "meetings", alternative: "wired USB headsets" },
  { site: "homeoffice", slug: "usb-condenser-microphones", name: "USB condenser microphones", category: "meetings", alternative: "headset microphones" },
  { site: "homeoffice", slug: "xlr-office-microphones", name: "XLR microphones for office studios", category: "meetings", alternative: "USB microphones" },
  { site: "homeoffice", slug: "desktop-audio-interfaces", name: "Desktop audio interfaces", category: "meetings", alternative: "direct USB microphones" },
  { site: "homeoffice", slug: "dual-monitor-kvm-switches", name: "Dual-monitor KVM switches", category: "meetings", alternative: "USB switches plus monitor input switching" },
  { site: "homeoffice", slug: "thunderbolt-kvm-docks", name: "Thunderbolt KVM docks", category: "meetings", alternative: "separate docks and KVM switches" },
  { site: "homeoffice", slug: "sheetfed-document-scanners", name: "Sheet-fed document scanners", category: "meetings", alternative: "flatbed scanners or multifunction printers" },
  { site: "homeoffice", slug: "flatbed-document-scanners", name: "Flatbed document scanners", category: "meetings", alternative: "sheet-fed scanners" },
  { site: "homeoffice", slug: "monochrome-laser-printers", name: "Monochrome laser printers", category: "meetings", alternative: "inkjet printers" },
  { site: "homeoffice", slug: "color-laser-multifunction-printers", name: "Color laser multifunction printers", category: "meetings", alternative: "separate printers and scanners" },
  { site: "homeoffice", slug: "desktop-label-printers", name: "Desktop label printers", category: "meetings", alternative: "standard paper labels" },
  { site: "homeoffice", slug: "office-paper-shredders", name: "Office paper shredders", category: "meetings", alternative: "secure shredding services" },
  { site: "homeoffice", slug: "desktop-laminators", name: "Desktop laminators", category: "meetings", alternative: "protective sleeves" },
  { site: "homeoffice", slug: "adjustable-laptop-stands", name: "Adjustable laptop stands", category: "ergonomics", alternative: "monitor arms with laptop trays" },
  { site: "homeoffice", slug: "under-desk-keyboard-trays", name: "Under-desk keyboard trays", category: "ergonomics", alternative: "height-adjustable desks" },
  { site: "homeoffice", slug: "office-footrests", name: "Office footrests", category: "ergonomics", alternative: "lower desks or chairs with better height range" },
  { site: "homeoffice", slug: "standing-desk-anti-fatigue-mats", name: "Standing-desk anti-fatigue mats", category: "desks", alternative: "supportive indoor shoes or movement breaks" },
  { site: "homeoffice", slug: "home-office-acoustic-panels", name: "Home-office acoustic panels", category: "meetings", alternative: "soft furnishings or directional microphones" },
  { site: "homeoffice", slug: "under-desk-cable-trays", name: "Under-desk cable trays", category: "desks", alternative: "surface cable raceways" },
  { site: "homeoffice", slug: "desktop-power-centers", name: "Desktop power centers", category: "desks", alternative: "under-desk surge protectors" },

  { site: "baby", slug: "infant-car-seats", name: "Infant car seats", category: "travel", alternative: "convertible car seats" },
  { site: "baby", slug: "convertible-car-seats", name: "Convertible car seats", category: "travel", alternative: "infant seats followed by harnessed seats" },
  { site: "baby", slug: "belt-positioning-booster-seats", name: "Belt-positioning booster seats", category: "travel", alternative: "forward-facing harnessed seats" },
  { site: "baby", slug: "full-size-strollers", name: "Full-size strollers", category: "travel", alternative: "travel strollers" },
  { site: "baby", slug: "jogging-strollers", name: "Jogging strollers", category: "travel", alternative: "all-terrain everyday strollers" },
  { site: "baby", slug: "double-strollers", name: "Double strollers", category: "travel", alternative: "single strollers with riding boards" },
  { site: "baby", slug: "stroller-wagons", name: "Stroller wagons", category: "travel", alternative: "double strollers" },
  { site: "baby", slug: "baby-travel-systems", name: "Baby travel systems", category: "travel", alternative: "separately selected car seats and strollers" },
  { site: "baby", slug: "baby-wraps-slings", name: "Baby wraps and slings", category: "travel", alternative: "structured baby carriers" },
  { site: "baby", slug: "hip-seat-carriers", name: "Hip-seat baby carriers", category: "travel", alternative: "soft structured carriers" },
  { site: "baby", slug: "bedside-bassinets", name: "Bedside bassinets", category: "sleep", alternative: "full-size cribs" },
  { site: "baby", slug: "convertible-baby-cribs", name: "Convertible baby cribs", category: "sleep", alternative: "standard cribs" },
  { site: "baby", slug: "crib-mattresses", name: "Crib mattresses", category: "sleep", alternative: "manufacturer-included sleep surfaces" },
  { site: "baby", slug: "travel-cribs-playards", name: "Travel cribs and playards", category: "sleep", alternative: "portable bassinets" },
  { site: "baby", slug: "adjustable-high-chairs", name: "Adjustable high chairs", category: "feeding", alternative: "clip-on or booster seats" },
  { site: "baby", slug: "table-booster-seats", name: "Table booster seats", category: "feeding", alternative: "full high chairs" },
  { site: "baby", slug: "baby-food-makers", name: "Baby food makers", category: "feeding", alternative: "standard steamers and blenders" },
  { site: "baby", slug: "automatic-bottle-washers", name: "Automatic bottle washers", category: "feeding", alternative: "manual washing plus sterilizer-dryers" },
  { site: "baby", slug: "changing-pads", name: "Changing pads", category: "feeding", alternative: "portable changing mats" },
  { site: "baby", slug: "structured-diaper-bags", name: "Structured diaper bags", category: "travel", alternative: "ordinary backpacks with organizers" },
  { site: "baby", slug: "infant-bath-tubs", name: "Infant bath tubs", category: "feeding", alternative: "sink inserts or supported bathing" },
  { site: "baby", slug: "hardware-mounted-baby-gates", name: "Hardware-mounted baby gates", category: "sleep", alternative: "pressure-mounted gates" },
  { site: "baby", slug: "nursery-glider-chairs", name: "Nursery glider chairs", category: "sleep", alternative: "supportive stationary chairs" },
  { site: "baby", slug: "nursery-humidifiers", name: "Nursery humidifiers", category: "sleep", alternative: "whole-home humidity control" },

  { site: "pet", slug: "wet-food-automatic-feeders", name: "Wet-food automatic feeders", category: "feeding", alternative: "dry-food feeders or manual feeding" },
  { site: "pet", slug: "microchip-pet-feeders", name: "Microchip pet feeders", category: "feeding", alternative: "RFID-tag feeders" },
  { site: "pet", slug: "wireless-pump-pet-fountains", name: "Wireless-pump pet fountains", category: "feeding", alternative: "corded pet fountains" },
  { site: "pet", slug: "large-dog-water-fountains", name: "Large-dog water fountains", category: "feeding", alternative: "large gravity bowls" },
  { site: "pet", slug: "cat-gps-trackers", name: "Cat GPS trackers", category: "comfort", alternative: "Bluetooth item trackers" },
  { site: "pet", slug: "dog-activity-collars", name: "Dog activity collars", category: "comfort", alternative: "GPS-only trackers" },
  { site: "pet", slug: "airtag-pet-collar-holders", name: "AirTag pet collar holders", category: "comfort", alternative: "cellular GPS trackers" },
  { site: "pet", slug: "microchip-pet-doors", name: "Microchip pet doors", category: "comfort", alternative: "collar-tag electronic doors" },
  { site: "pet", slug: "motorized-smart-pet-doors", name: "Motorized smart pet doors", category: "comfort", alternative: "standard flap doors" },
  { site: "pet", slug: "treat-dispensing-pet-cameras", name: "Treat-dispensing pet cameras", category: "home-care", alternative: "general indoor cameras" },
  { site: "pet", slug: "open-top-self-cleaning-litter-boxes", name: "Open-top self-cleaning litter boxes", category: "home-care", alternative: "enclosed automatic litter boxes" },
  { site: "pet", slug: "top-entry-litter-boxes", name: "Top-entry litter boxes", category: "home-care", alternative: "front-entry litter boxes" },
  { site: "pet", slug: "cat-litter-mats", name: "Cat litter mats", category: "home-care", alternative: "washable floor runners" },
  { site: "pet", slug: "pet-hair-vacuum-tools", name: "Pet-hair vacuum tools", category: "home-care", alternative: "manual rollers and brushes" },
  { site: "pet", slug: "pet-hair-clippers", name: "Pet hair clippers", category: "home-care", alternative: "professional grooming" },
  { site: "pet", slug: "pet-nail-grinders", name: "Pet nail grinders", category: "home-care", alternative: "pet nail clippers" },
  { site: "pet", slug: "pet-dryers", name: "Pet dryers", category: "home-care", alternative: "towels and human-safe low-airflow drying" },
  { site: "pet", slug: "deshedding-brushes", name: "Deshedding brushes", category: "home-care", alternative: "grooming vacuum attachments" },
  { site: "pet", slug: "robot-vacuums-for-pet-hair", name: "Robot vacuums for pet hair", category: "home-care", alternative: "cordless vacuums" },
  { site: "pet", slug: "pet-stain-carpet-cleaners", name: "Pet-stain carpet cleaners", category: "home-care", alternative: "spot extractors or professional cleaning" },
  { site: "pet", slug: "cooling-pet-beds", name: "Cooling pet beds", category: "comfort", alternative: "elevated mesh beds" },
  { site: "pet", slug: "washable-orthopedic-pet-beds", name: "Washable orthopedic pet beds", category: "comfort", alternative: "standard foam pet beds" },
  { site: "pet", slug: "soft-sided-pet-carriers", name: "Soft-sided pet carriers", category: "comfort", alternative: "hard-sided crates" },
  { site: "pet", slug: "vehicle-pet-restraints", name: "Vehicle pet restraints", category: "comfort", alternative: "secured travel crates" },
  { site: "pet", slug: "dog-ramps", name: "Dog ramps", category: "comfort", alternative: "pet stairs" },
  { site: "pet", slug: "interactive-puzzle-feeders", name: "Interactive puzzle feeders", category: "feeding", alternative: "slow-feed bowls" },
  { site: "pet", slug: "automatic-ball-launchers", name: "Automatic ball launchers", category: "comfort", alternative: "manual fetch toys" },
  { site: "pet", slug: "smart-bird-feeders", name: "Smart bird feeders", category: "comfort", alternative: "standard wildlife feeders" },
  { site: "pet", slug: "automatic-aquarium-feeders", name: "Automatic aquarium feeders", category: "feeding", alternative: "manual measured feeding" },
  { site: "pet", slug: "aquarium-water-monitors", name: "Aquarium water monitors", category: "home-care", alternative: "manual liquid test kits" },

  { site: "costume", slug: "high-end-costumes", name: "High-end costumes", category: "costumes", alternative: "standard party costumes or rentals" },
  { site: "costume", slug: "mascot-costumes", name: "Mascot costumes", category: "costumes", alternative: "character masks with separate garments" },
  { site: "costume", slug: "historical-theatrical-costumes", name: "Historical and theatrical costumes", category: "costumes", alternative: "standard party costumes" },
  { site: "costume", slug: "adult-costumes", name: "Adult costumes", category: "costumes", alternative: "separately assembled character looks" },
  { site: "costume", slug: "child-costumes", name: "Child costumes", category: "costumes", alternative: "simple clothing-based dress-up" },
  { site: "costume", slug: "costume-wigs", name: "Costume wigs", category: "wigs-makeup", alternative: "temporary hair color or headpieces" },
  { site: "costume", slug: "masks-and-masquerade", name: "Masks and masquerade masks", category: "masks-prosthetics", alternative: "prosthetics or makeup-only transformations" },
  { site: "costume", slug: "prosthetics-special-effects", name: "Prosthetics and special effects", category: "masks-prosthetics", alternative: "full-face masks" },
  { site: "costume", slug: "theatrical-face-body-makeup", name: "Theatrical face and body makeup", category: "wigs-makeup", alternative: "masks or ready-made character kits" },
  { site: "costume", slug: "props-and-animatronics", name: "Props and animatronics", category: "props-animatronics", alternative: "compact static decorations" },
];

const rolesBySite: Record<ExpansionSite, Array<"buying" | "comparison" | "fit" | "ownership" | "workflow" | "safety">> = {
  network: ["buying", "comparison", "fit", "ownership"],
  smarthome: ["buying", "comparison", "fit", "ownership", "workflow"],
  homeoffice: ["buying", "comparison", "fit", "ownership", "workflow"],
  baby: ["buying", "comparison", "fit", "ownership", "workflow", "safety"],
  pet: ["buying", "comparison", "fit", "ownership", "workflow"],
  costume: ["buying", "comparison", "fit", "ownership"],
};

function roleSlug(family: ProductFamily, role: (typeof rolesBySite)[ExpansionSite][number]) {
  if (role === "buying") return `${family.slug}-buying-guide`;
  if (role === "comparison") return `${family.slug}-vs-alternatives`;
  if (role === "fit") return `${family.slug}-compatibility-and-fit-guide`;
  if (role === "ownership") return `${family.slug}-ownership-cost-and-maintenance`;
  if (role === "workflow") return `${family.slug}-setup-and-daily-workflow`;
  return `${family.slug}-safety-and-skip-guide`;
}

function titleName(value: string) {
  const minorWords = new Set(["and", "for", "of", "or", "to", "with"]);
  return value.split(" ").map((word, index) => {
    if (index > 0 && minorWords.has(word)) return word;
    if (/[A-Z0-9]/.test(word.slice(1)) || word.includes("-") || word.includes("+")) return word;
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
  }).join(" ");
}

function titleFor(family: ProductFamily, role: (typeof rolesBySite)[ExpansionSite][number]) {
  const name = titleName(family.name);
  if (role === "buying") return `${name} Buying Guide`;
  if (role === "comparison") return `${name} vs. ${family.alternative}`;
  if (role === "fit") return `${name}: Compatibility and Fit Guide`;
  if (role === "ownership") return `${name}: Ownership Cost and Maintenance`;
  if (role === "workflow") return `${name}: Setup and Daily Workflow`;
  return `${name}: Safety Limits and When to Skip`;
}

const discussionByFamily = new Map(
  communityEvidenceData.discussions.map((item) => [`${item.site}:${item.familySlug}`, item]),
);

function searchQuestionFor(family: ProductFamily, role: (typeof rolesBySite)[ExpansionSite][number]) {
  const brief = findFamilyEditorialBrief(family.site, family.slug);
  if (!brief) throw new Error(`Missing editorial brief for ${family.site}:${family.slug}`);
  if (role === "buying") return `Which ${family.name.toLowerCase()} are worth buying when the real job is to ${brief.job}?`;
  if (role === "comparison") return `Should you choose ${family.name.toLowerCase()} or ${family.alternative.toLowerCase()} for this job?`;
  if (role === "fit") return `Will ${family.name.toLowerCase()} fit the exact user, space, equipment, and installation path?`;
  if (role === "ownership") return `What will ${family.name.toLowerCase()} cost and require after checkout?`;
  if (role === "workflow") return `How should ${family.name.toLowerCase()} be set up and used without adding a new daily chore?`;
  return `When should a caregiver skip or stop using ${family.name.toLowerCase()}?`;
}

function quickAnswerFor(family: ProductFamily, role: (typeof rolesBySite)[ExpansionSite][number]) {
  const brief = findFamilyEditorialBrief(family.site, family.slug);
  if (!brief) throw new Error(`Missing editorial brief for ${family.site}:${family.slug}`);
  const [first, second] = brief.dimensions;
  if (role === "buying") return `Start with ${first} and ${second}, not the longest feature list. Buy only when the product can ${brief.job}, the setup is realistic, and the household accepts ${brief.ownership}. Skip it when ${brief.skip}.`;
  if (role === "comparison") return `${family.name} are the stronger choice when their specialized path can ${brief.job}. Choose ${family.alternative.toLowerCase()} when it reaches the same outcome with fewer fit, setup, or maintenance dependencies—especially when ${brief.skip}.`;
  if (role === "fit") return `Compatibility passes only when all four checks are confirmed: ${brief.dimensions.join("; ")}. Verify the exact model and variant, then test the limiting condition before the return window closes.`;
  if (role === "ownership") return `Budget beyond checkout for ${brief.ownership}. The disciplined choice is the one that remains serviceable and recoverable after normal wear, cleaning, updates, consumables, or a failed part.`;
  if (role === "workflow") return `Use this order: ${brief.setup}. Keep the previous routine available until normal operation and a safe recovery test both work.`;
  return `Use only the exact current instructions and stop when ${brief.skip}. Community anecdotes and added accessories never expand the manufacturer's age, weight, fit, installation, supervision, or environmental limits.`;
}

function deepRankRecoveryAnswerFor(family: ProductFamily, role: (typeof rolesBySite)[ExpansionSite][number]) {
  const brief = findFamilyEditorialBrief(family.site, family.slug);
  if (!brief) throw new Error(`Missing editorial brief for ${family.site}:${family.slug}`);
  const [first, second, third, fourth] = brief.dimensions;

  if (role === "buying") return `For ${family.name.toLowerCase()}, the purchase threshold is proof that the selected model can ${brief.job}. Verify ${first} and ${second} before checkout; use ${third} and ${fourth} as return-window tests. Do not buy when ${brief.skip}.`;
  if (role === "comparison") return `Choose ${family.name.toLowerCase()} over ${family.alternative.toLowerCase()} only when the specialized path can ${brief.job}. Compare both options under the same ${first}, ${second}, ${third}, and ${fourth} conditions, including every required dependency and one year of ownership. Prefer the alternative when ${brief.skip}.`;
  if (role === "fit") return `${family.name} fit only after four separate checks pass: ${first}; ${second}; ${third}; and ${fourth}. Record the exact model, measurement, standard, or supported condition for each one and treat ${brief.skip} as a failed fit—not as an accessory problem to work around.`;
  if (role === "ownership") return `The real ownership budget for ${family.name.toLowerCase()} includes ${brief.ownership}. Record a baseline for ${first} and ${second}, monitor ${third} and ${fourth}, and keep the previous routine available until an ordinary failure can be recovered without guesswork.`;
  if (role === "workflow") return `Set up ${family.name.toLowerCase()} in this order: ${brief.setup}. Put ${first} and ${second} on the installation checklist, then build the repeatable routine around ${third} and ${fourth}. Revert if ${brief.skip}.`;
  return `For ${family.name.toLowerCase()}, safety begins with the exact current instructions and four verified boundaries: ${first}; ${second}; ${third}; and ${fourth}. Stop use when ${brief.skip}; an accessory, forum tip, or different model's instructions cannot expand that limit.`;
}

function deepRankRecoverySectionFor(family: ProductFamily, role: (typeof rolesBySite)[ExpansionSite][number]): Guide["sections"][number] {
  const brief = findFamilyEditorialBrief(family.site, family.slug);
  if (!brief) throw new Error(`Missing editorial brief for ${family.site}:${family.slug}`);
  const [first, second, third, fourth] = brief.dimensions;

  if (role === "buying") return {
    heading: `${family.name}: a three-gate buying decision`,
    body: `Gate one is job proof: the exact model must ${brief.job}. Gate two is fit proof: confirm ${first} and ${second} from current product-level evidence. Gate three is ownership proof: test ${third} and ${fourth} during normal use while the decision is still reversible. A failure at any gate is a reason to keep ${family.alternative.toLowerCase()}, especially when ${brief.skip}.`,
  };
  if (role === "comparison") return {
    heading: `${family.name} or ${family.alternative}: normalize the comparison`,
    body: `Compare complete, workable paths—not a fully equipped ${family.name.toLowerCase()} setup against an incomplete alternative. Price and verify ${first}, ${second}, ${third}, and ${fourth} for both sides. Choose the specialized path only if its ability to ${brief.job} remains valuable after setup, maintenance, and a plausible failure; otherwise ${family.alternative.toLowerCase()} is the cleaner decision.`,
  };
  if (role === "fit") return {
    heading: `${family.name}: write a pass or fail for every fit check`,
    body: `Record one evidence-backed result beside each condition: ${first}; ${second}; ${third}; and ${fourth}. “Probably compatible” is not a pass. Use the exact model or variant, measure the limiting real-world condition, and follow this reversible sequence: ${brief.setup}. Stop the fit assessment when ${brief.skip}.`,
  };
  if (role === "ownership") return {
    heading: `${family.name}: the first-year ownership record`,
    body: `At setup, record the exact product identity and a baseline for ${first}, ${second}, ${third}, and ${fourth}. Add the expected work and cost of ${brief.ownership}. Recheck the record after ordinary wear or a change in the environment, and define the point at which repair, replacement, or a return to ${family.alternative.toLowerCase()} is more rational than another workaround.`,
  };
  if (role === "workflow") return {
    heading: `${family.name}: day one, normal week, and recovery test`,
    body: `Day one follows this sequence: ${brief.setup}. During a normal week, record whether ${first}, ${second}, ${third}, and ${fourth} remain understandable and repeatable for the actual user. Before retiring the old routine, test a safe recovery from one plausible failure. The workflow fails when ${brief.skip}.`,
  };
  return {
    heading: `${family.name}: a safety boundary is a stop, not a target`,
    body: `Confirm the current instructions, model identity, recall status, approved configuration, and the four controlling conditions: ${first}; ${second}; ${third}; and ${fourth}. Recheck them after movement, cleaning, growth, wear, or a caregiver change. Stop immediately when ${brief.skip}; do not use padding, adapters, copied settings, or anecdotes to extend the boundary.`,
  };
}

function comparisonTableFor(family: ProductFamily, role: (typeof rolesBySite)[ExpansionSite][number]): NonNullable<Guide["comparisonTable"]> {
  const brief = findFamilyEditorialBrief(family.site, family.slug);
  if (!brief) throw new Error(`Missing editorial brief for ${family.site}:${family.slug}`);
  if (role === "comparison") {
    return {
      title: `${family.name} and ${family.alternative}: the decision dimensions`,
      columns: [family.name, family.alternative],
      rows: [
        { label: "Primary job", values: [`Best when the product can ${brief.job}.`, `Best when the same outcome needs fewer specialized dependencies.`] },
        ...brief.dimensions.map((dimension, index) => ({
          label: `Check ${index + 1}`,
          values: [`Verify ${dimension}.`, `Confirm the alternative removes or simplifies ${dimension}.`],
        })),
        { label: "Skip signal", values: [`Skip when ${brief.skip}.`, "Prefer the alternative only after confirming it solves the same repeated problem." ] },
      ],
    };
  }

  const roleLabel = role === "fit" ? "Compatibility" : role === "ownership" ? "Ownership" : role === "workflow" ? "Workflow" : role === "safety" ? "Safety" : "Buying";
  return {
    title: `${roleLabel} checks that change the ${family.name.toLowerCase()} decision`,
    columns: ["What to verify", "Decision effect"],
    rows: [
      ...brief.dimensions.map((dimension, index) => ({
        label: `Decision ${index + 1}`,
        values: [dimension, `Treat any unanswered question about ${dimension} as a reason to pause rather than assume fit.`],
      })),
      { label: "Setup proof", values: [brief.setup, "Complete this path before retiring the previous routine or equipment." ] },
      { label: "Exit condition", values: [brief.skip, `Use ${family.alternative.toLowerCase()} or keep the current setup when this condition applies.`] },
    ],
  };
}

function sectionsFor(family: ProductFamily, role: (typeof rolesBySite)[ExpansionSite][number]) {
  const brief = findFamilyEditorialBrief(family.site, family.slug);
  if (!brief) throw new Error(`Missing editorial brief for ${family.site}:${family.slug}`);
  const profile = siteProfiles[family.site];
  const [first, second, third, fourth] = brief.dimensions;

  if (role === "buying") return [
    { heading: `Start with the job: ${brief.job}`, body: `${family.name} should earn their cost and ongoing effort by solving that repeated job, not by winning on ${profile.purchaseNoise}. Before comparing listings, ${profile.planningContext}. Then compare the product with ${family.alternative.toLowerCase()} under the same real conditions and for the same period.` },
    { heading: `The first two buying checks are ${first} and ${second}`, body: `For ${family.name.toLowerCase()}, ${first} and ${second} usually eliminate more poor choices than a long feature comparison. Confirm both from the exact current product details or instructions. If either depends on ${profile.dependencies}, include that dependency in the purchase and setup plan rather than treating it as a later detail.` },
    { heading: `Do not ignore ${third} or ${fourth}`, body: `For this ${family.name.toLowerCase()} decision, ${third} and ${fourth} determine whether a product that looks correct online will still work in the real use case. Measure or test the limiting condition across the actual ${profile.realContext}; preserve packaging and use the return period to reproduce the most demanding normal task rather than an ideal demonstration.` },
    { heading: "Price the complete first year", body: `The family-specific ownership plan includes ${brief.ownership}. Also price ${profile.operatingCosts}. A lower checkout price is not better when it creates repeated work or leaves the household unable to recover from a common failure.` },
    { heading: "Keep a written skip decision", body: `Do not buy when ${brief.skip}. That is not a missing premium feature; it is evidence that the product does not fit the current job. Keep the simpler ${family.alternative.toLowerCase()} route available until the new option passes fit, normal use, maintenance, and recovery checks.` },
  ];

  if (role === "comparison") return [
    { heading: `The real fork is specialized function versus ${family.alternative.toLowerCase()}`, body: `${family.name} win when they can ${brief.job} and that function removes a known recurring problem. ${family.alternative} win when they reach the same outcome with fewer dependencies, less maintenance, a more understandable failure mode, or a cleaner return path.` },
    { heading: `Normalize ${first} and ${second}`, body: `Compare both paths across the same ${profile.realContext}, with every required dependency included. A complete ${family.name.toLowerCase()} package should not be compared with an incomplete alternative, and a retailer headline should not replace product-level compatibility evidence.` },
    { heading: `Use ${third} and ${fourth} as tie-breakers`, body: `In a ${family.name.toLowerCase()} comparison, ${third} and ${fourth} reveal the friction that appears after an attractive demo. Choose the path that can be installed, used, cleaned, updated, and recovered by the people who will actually own it. Prefer the simpler failure mode when performance is otherwise close.` },
    { heading: "Compare ownership, not only purchase price", body: `${family.name} bring an ownership path of ${brief.ownership}. Price that against the maintenance and replacement work of ${family.alternative.toLowerCase()} over one normal year. Include the value of time and the cost of losing the service while a proprietary part, account, or repair is unavailable.` },
    { heading: "Make the choice reversible", body: `Use this test path before the return window closes: ${brief.setup}. Preserve the old setup and packaging until the product survives normal use. Choose the alternative immediately when ${brief.skip}.` },
  ];

  if (role === "fit") return [
    { heading: `Compatibility check 1: ${first}`, body: `For ${family.name.toLowerCase()}, record the exact value, standard, measurement, or supported condition behind ${first} before checkout. A broad category label does not prove that the selected variant fits. Confirm the ${profile.identityRecord} rather than assuming similarly named products share limits.` },
    { heading: `Compatibility check 2: ${second}`, body: `Test ${second} across the actual ${profile.realContext}—not a product-photo setup. If this ${family.name.toLowerCase()} fit depends on ${profile.dependencies}, confirm the exact part, service, or behavior as part of compatibility.` },
    { heading: `Compatibility checks 3 and 4: ${third}; ${fourth}`, body: `For ${family.name.toLowerCase()}, ${third} and ${fourth} are the limiting conditions most likely to surface only after installation. Measure the smallest clearance, weakest connection, least compatible user or device, and the most demanding normal task. Passing an ideal bench test is not enough.` },
    { heading: "Prove fit in a reversible order", body: `Use this sequence: ${brief.setup}. Keep labels, packaging, manuals, and the previous system until the product works through normal use and a recovery test. Photograph wiring, measurements, or assembly states that would be difficult to reconstruct.` },
    { heading: "A failed fit check is a stop signal", body: `Stop when ${brief.skip}. Do not repair a fundamental mismatch with unapproved accessories, copied settings, or community anecdotes. Use ${family.alternative.toLowerCase()} when it meets the job with a clearer compatibility path.` },
  ];

  if (role === "ownership") return [
    { heading: "Build the cost beyond checkout", body: `Normal ownership includes ${brief.ownership}. Put those items beside the purchase price before comparing products, then add ${profile.operatingCosts} and the cost of downtime.` },
    { heading: `Maintenance starts with ${first} and ${second}`, body: `For ${family.name.toLowerCase()}, ${first} and ${second} are not only buying checks; they determine what must be inspected, cleaned, updated, calibrated, charged, or replaced. Confirm that service points remain reachable after installation and that parts are sold for the exact model rather than only for a similar family name.` },
    { heading: `Watch ${third} and ${fourth} over the first year`, body: `Record the ${family.name.toLowerCase()} baseline for ${third} and ${fourth} after setup and check it after ordinary use. Ownership problems are easier to catch when settings, measurements, supply part numbers, and photos are documented before wear, firmware changes, seasonal conditions, or a different user changes the result.` },
    { heading: "Price failure and recovery", body: `For ${family.name.toLowerCase()}, ask what happens after ${profile.failureModes}. Keep the instructions, warranty, exact product identity, data-removal steps where applicable, and a practical fallback. The previous ${family.alternative.toLowerCase()} routine should remain available until recovery is proven.` },
    { heading: "Know the economic stop point", body: `Exit when ${brief.skip}. Also stop spending when recurring parts, service, cleaning, or recovery work exceeds the value of the repeated job. A familiar alternative is often cheaper than extending ownership of a mismatched specialized product.` },
  ];

  if (role === "workflow") return [
    { heading: "Stage setup before changing the routine", body: `Use this order: ${brief.setup}. Complete the first setup while there is time to read, observe, and reverse decisions. Add one device, user, animal, automation, accessory, or workflow step at a time so the cause of a failure remains visible.` },
    { heading: `Put ${first} and ${second} into the setup checklist`, body: `Verify ${first} and ${second} for the selected ${family.name.toLowerCase()} in the real environment and record the result. The routine should not depend on remembering a hidden app state, unsupported adapter, special handling step, or unlabelled configuration that another household member cannot recover.` },
    { heading: `Design daily use around ${third} and ${fourth}`, body: `For ${family.name.toLowerCase()}, write the few actions that should occur every day or week around ${third} and ${fourth}. Include cleaning, charging, refilling, data review, physical inspection, or supervision where relevant. If those actions are harder than the previous ${family.alternative.toLowerCase()} routine, the new product has not removed the original friction.` },
    { heading: "Test recovery deliberately", body: `For ${family.name.toLowerCase()}, safely simulate the most plausible ordinary failure created by the ownership path: ${profile.failureModes}. Confirm the relevant alerts, manual controls, saved settings, physical checks, and exact steps needed to resume the routine without creating a second problem.` },
    { heading: "Review after a normal week", body: `Compare time saved, new chores, reliability, user or animal response, and maintenance. Revert when ${brief.skip}. Keep the workflow only if it solves the original job and remains understandable to the people who must use and recover it.` },
  ];

  return [
    { heading: "Use the exact current instructions", body: `Begin with ${first} and ${second}. Confirm the complete model, date or lot information when present, approved configuration, child limits, recall status, and registration path. Category advice and community discussion cannot replace the instructions for the selected product.` },
    { heading: `Treat ${third} as a boundary`, body: `For ${family.name.toLowerCase()}, ${third} is a boundary rather than a target to stretch. Age, weight, developmental, installation, sleep, restraint, supervision, and environmental limits remain controlling; added padding, straps, adapters, accessories, online tips, or a different model's manual do not expand them.` },
    { heading: `Recheck ${fourth} during normal use`, body: `A ${family.name.toLowerCase()} product can pass initial assembly and become unsafe after movement, growth, cleaning, a loose part, a changed vehicle or room, or a different caregiver routine. Recheck ${fourth}, fit, and physical condition before relying on convenience features.` },
    { heading: "Practice the safe-use workflow", body: `Follow this sequence: ${brief.setup}. Practice when rested and able to observe each step. Keep a safe manual fallback and ensure every caregiver understands stop-use conditions, emergency removal, and the location of current instructions.` },
    { heading: "Know when to stop", body: `Stop when ${brief.skip}. Also stop after damage, a recall, missing required parts, unknown history, or any inability to follow the exact instructions. Contact the manufacturer or an appropriate qualified professional rather than improvising around a safety boundary.` },
  ];
}

function guideFor(family: ProductFamily, role: (typeof rolesBySite)[ExpansionSite][number]): Guide {
  const profile = siteProfiles[family.site];
  const categoryImage = categoryImages[family.site][family.category];
  const sources = categorySources[family.site][family.category] ?? [{ name: profile.sourceName, url: profile.sourceUrl, note: "Authoritative category-level baseline." }];
  const brief = findFamilyEditorialBrief(family.site, family.slug);
  if (!brief) throw new Error(`Missing editorial brief for ${family.site}:${family.slug}`);
  const discussion = discussionByFamily.get(`${family.site}:${family.slug}`);
  const siblingSlugs = rolesBySite[family.site].map((item) => roleSlug(family, item)).filter((slug) => slug !== roleSlug(family, role));
  const title = titleFor(family, role);
  const searchQuestion = searchQuestionFor(family, role);
  const slug = roleSlug(family, role);
  const recoveryTarget = deepRankRecoveryTargets.get(`${family.site}:${slug}`);
  const roleLabel = role === "buying" ? "buying" : role === "comparison" ? "comparison" : role === "fit" ? "compatibility" : role === "ownership" ? "ownership" : role === "workflow" ? "workflow" : "safety";
  return {
    site: family.site,
    slug,
    title,
    dek: recoveryTarget
      ? `A direct ${roleLabel} answer for ${family.name.toLowerCase()}: decide whether the product can ${brief.job}, verify all four model-level conditions, and keep the choice reversible when ${brief.skip}.`
      : role === "comparison"
        ? `Choose between ${family.name.toLowerCase()} and ${family.alternative.toLowerCase()} for one concrete job: ${brief.job}. Compare four product-level checks, ownership cost, and the failure mode you can actually recover.`
        : `${searchQuestion} This guide turns that question into model-level checks, a reversible setup, a first-year ownership plan, and a clear skip decision.`,
    category: family.category,
    updatedAt: recoveryTarget ? deepRankRecoveryUpdatedAt : updatedAt,
    image: categoryImage?.image ?? profile.image,
    imageAlt: categoryImage?.imageAlt ?? profile.imageAlt,
    searchQuestion,
    quickAnswer: recoveryTarget ? deepRankRecoveryAnswerFor(family, role) : quickAnswerFor(family, role),
    editorialMethod: [
      "Define one independent purchase or use question for this URL.",
      `Verify the four family-specific dimensions: ${brief.dimensions.join("; ")}.`,
      family.site === "costume" ? "Resolve shoppable products only from the active Costume PostgreSQL/CJ catalog." : "Use an exact Amazon ASIN only as a current retailer identity and checkout anchor, not as hands-on evidence.",
      discussion ? "Separate public community discussion from official specifications and editorial judgment." : "Do not add a community claim when no sufficiently relevant public discussion was found.",
      "Keep a written stop condition and a reversible test path.",
    ],
    communityEvidence: discussion ? [{
      sourceName: discussion.sourceName,
      title: discussion.discussionTitle,
      url: discussion.url,
      note: "A public owner discussion used to identify questions and failure modes. Comments are anecdotal; no username, vote count, rating, or verbatim review is reproduced, and product facts must be verified independently.",
    }] : [],
    governance: {
      decision: "rewrite",
      independentDemand: searchQuestion,
      distinctFrom: role === "comparison"
        ? `The buying page asks whether to enter the category; this page decides between ${family.name.toLowerCase()} and ${family.alternative.toLowerCase()}.`
        : `This URL answers the ${role} decision and does not substitute for the sibling ${rolesBySite[family.site].filter((item) => item !== role).join(", ")} decisions.`,
      benchmark: role === "buying" || role === "comparison"
        ? "Deco BE63 vs BE67 vs BE85 guide: direct answer, exact decision dimensions, model anchor, sources, and dense internal links."
        : "Ergobaby positions guide and Deco BE63 research page: one exact question, model-level limits, evidence separation, original editorial image, and explicit skip conditions.",
    },
    sources: sources.map((source) => ({ ...source, note: `${source.note} Verify the exact product instructions and current listing separately.` })),
    sections: recoveryTarget ? [deepRankRecoverySectionFor(family, role), ...sectionsFor(family, role)] : sectionsFor(family, role),
    comparisonTable: comparisonTableFor(family, role),
    relatedRoundups: [],
    relatedProducts: [],
    relatedGuides: siblingSlugs,
    familySlug: family.slug,
    familyRole: role,
  };
}

export const quadrupleExpansionGuides: Guide[] = productFamilies.flatMap((family) =>
  rolesBySite[family.site].map((role) => guideFor(family, role)),
);

export const quadrupleExpansionFamilies = productFamilies;
