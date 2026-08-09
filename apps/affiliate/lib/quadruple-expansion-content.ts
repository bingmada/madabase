import type { Guide, SiteKey } from "./types";

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
};

const updatedAt = "August 9, 2026";

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

  { site: "costume", slug: "inflatable-halloween-costumes", name: "Inflatable Halloween costumes", category: "costumes", alternative: "standard fabric costumes" },
  { site: "costume", slug: "mascot-costumes", name: "Mascot costumes", category: "costumes", alternative: "character masks with separate garments" },
  { site: "costume", slug: "historical-theatrical-costumes", name: "Historical and theatrical costumes", category: "costumes", alternative: "standard party costumes" },
  { site: "costume", slug: "plus-size-halloween-costumes", name: "Plus-size Halloween costumes", category: "costumes", alternative: "custom or separately assembled looks" },
  { site: "costume", slug: "couples-group-costumes", name: "Couples and group costumes", category: "costumes", alternative: "independent coordinated outfits" },
  { site: "costume", slug: "silicone-creature-masks", name: "Silicone creature masks", category: "masks-prosthetics", alternative: "latex masks or foam prosthetics" },
  { site: "costume", slug: "foam-latex-prosthetics", name: "Foam-latex prosthetics", category: "masks-prosthetics", alternative: "full-face masks" },
  { site: "costume", slug: "costume-adhesives-removers", name: "Costume adhesives and removers", category: "wigs-makeup", alternative: "self-adhesive effects or masks" },
  { site: "costume", slug: "uv-blacklights-halloween-projectors", name: "UV blacklights and Halloween projectors", category: "accessories-party-effects", alternative: "conventional scene lighting" },
  { site: "costume", slug: "outdoor-inflatables-graveyard-props", name: "Outdoor inflatables and graveyard props", category: "props-animatronics", alternative: "compact porch decorations" },
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

function sectionsFor(family: ProductFamily, role: (typeof rolesBySite)[ExpansionSite][number]) {
  const profile = siteProfiles[family.site];
  if (role === "buying") return [
    { heading: "Define the buying job", body: `Start with the exact problem ${family.name.toLowerCase()} must solve. Write down the room, user, equipment, routine, constraints, and failure that prompted the purchase before comparing features.` },
    { heading: "Measure the real environment", body: profile.fit },
    { heading: "Compare a complete system", body: `Compare ${family.name.toLowerCase()} with every required accessory and service, not as an isolated box. A lower headline price can become the more expensive choice after adapters, installation, consumables, or replacement parts are added.` },
    { heading: "Keep a skip decision", body: profile.risk },
  ];
  if (role === "comparison") return [
    { heading: "The decision fork", body: `${family.name} make sense when their specialized function solves the repeated problem. ${family.alternative} are the stronger alternative when they meet the same need with fewer dependencies or less maintenance.` },
    { heading: "Compare like with like", body: `Normalize the comparison for capacity, fit, included parts, required accessories, ongoing service, and the same expected use period. Do not compare a complete ${family.name.toLowerCase()} package with an incomplete alternative.` },
    { heading: "Prefer the simpler failure mode", body: `Ask what happens when power, connectivity, consumables, software, or a moving part fails. The better option is often the one the household can understand, recover, and temporarily replace.` },
    { heading: "Make the choice reversible", body: `Verify the return window, preserve packaging until fit is proven, and test the most important workflow before retiring the existing ${family.alternative.toLowerCase()} setup.` },
  ];
  if (role === "fit") return [
    { heading: "Record exact compatibility", body: profile.fit },
    { heading: "Check the complete model identity", body: `Confirm the manufacturer, complete model or variant, region, included parts, current instructions, and the exact retailer listing. Similar names do not prove that two ${family.name.toLowerCase()} share the same limits.` },
    { heading: "Test the limiting condition", body: `Identify the smallest clearance, weakest connection, least compatible user or device, and most demanding normal task. A product that passes only an ideal demonstration may still fail the real installation.` },
    { heading: "Plan the fallback", body: `Keep a safe manual or previous-system fallback until compatibility, reliability, cleaning, and recovery have been proven in the actual environment.` },
  ];
  if (role === "ownership") return [
    { heading: "Calculate total ownership", body: profile.ownership },
    { heading: "Price the normal year", body: `Estimate purchase, setup, electricity or batteries, consumables, cleaning, replacement parts, and service over one realistic year. Use current checkout information rather than a remembered launch price.` },
    { heading: "Check maintenance access", body: `Confirm that the parts requiring cleaning, inspection, replacement, charging, or updates remain reachable after installation. Maintenance that is awkward is maintenance that gets skipped.` },
    { heading: "Protect the exit path", body: `Record the warranty, return process, data export or account-removal steps when applicable, and the cost of returning to ${family.alternative.toLowerCase()} if the product does not fit.` },
  ];
  if (role === "workflow") return [
    { heading: "Stage the first setup", body: profile.workflow },
    { heading: "Define the normal routine", body: `Write the few actions that should happen every day or week with ${family.name.toLowerCase()}. If the routine requires repeated app repair, special handling, or difficult cleaning, the automation has not removed the original friction.` },
    { heading: "Test recovery", body: `Deliberately test a safe loss of power, network, consumable, or normal access where appropriate. Confirm alerts, local controls, saved settings, and the steps needed to resume service.` },
    { heading: "Review after a real week", body: `After ordinary use, compare time saved, new chores, reliability, user or animal response, and maintenance with the previous ${family.alternative.toLowerCase()} routine.` },
  ];
  return [
    { heading: "Use current instructions first", body: profile.fit },
    { heading: "Check recalls and registration", body: `Verify the exact model against current recall information, register eligible durable products, retain the model and date code, and follow the manufacturer instructions rather than a generic product-category shortcut.` },
    { heading: "Do not extend stated limits", body: `Age, weight, developmental, installation, sleep, restraint, supervision, and environmental limits are boundaries. Added accessories or online anecdotes do not expand them.` },
    { heading: "Know when to stop", body: profile.risk },
  ];
}

function guideFor(family: ProductFamily, role: (typeof rolesBySite)[ExpansionSite][number]): Guide {
  const profile = siteProfiles[family.site];
  const siblingSlugs = rolesBySite[family.site].map((item) => roleSlug(family, item)).filter((slug) => slug !== roleSlug(family, role));
  const title = titleFor(family, role);
  return {
    site: family.site,
    slug: roleSlug(family, role),
    title,
    dek: role === "comparison"
      ? `Choose between ${family.name.toLowerCase()} and ${family.alternative.toLowerCase()} using fit, dependencies, ownership cost, failure recovery, and the repeated job that needs solving.`
      : `Evaluate ${family.name.toLowerCase()} by measurable fit, setup, ongoing work, failure recovery, and the checks that prevent an expensive mismatch.`,
    category: family.category,
    updatedAt,
    image: profile.image,
    imageAlt: profile.imageAlt,
    sources: [{ name: profile.sourceName, url: profile.sourceUrl, note: "Authoritative category-level baseline; verify the exact product instructions and current listing separately." }],
    sections: sectionsFor(family, role),
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
