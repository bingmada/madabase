import type { Guide } from "./types";

// Owner-approved October 20 expansion. Each page owns a different buying task;
// manufacturer specifications are not presented as our own test results.
const date = "October 20, 2026";
const source = (name: string, url: string, note: string) => ({ name, url, note });

export const editorialExpansionGuides: Guide[] = [
  {
    site: "homeoffice", slug: "caldigit-ts4-vs-ts5-vs-ts5-plus", category: "desks",
    title: "CalDigit TS4 vs TS5 vs TS5 Plus: Upgrade or Keep Your Dock?",
    dek: "Compare the three CalDigit generations by host connection, charging, Ethernet and display wiring, with a separate decision for keeping a working TS4.",
    updatedAt: date, decisionLayout: true, image: "/images/affiliate/hero-homeoffice-realistic.webp",
    imageAlt: "Editorial home office scene, not a hands-on test of these docks",
    searchQuestion: "Should I keep TS4, buy TS5, or pay for TS5 Plus?",
    quickAnswer: "Keep a working TS4 when its displays, 98W charging and 2.5GbE already meet your requirements. Compare TS5 for a new Thunderbolt 5 desk that needs up to 140W and 2.5GbE; compare TS5 Plus when a complete 10GbE path or its additional ports has a real job. The host and monitor modes must still qualify.",
    comparisonTable: { title: "The differences that change the desk plan", columns: ["TS4", "TS5", "TS5 Plus"], rows: [
      { label: "Upstream generation", values: ["Thunderbolt 4", "Thunderbolt 5", "Thunderbolt 5"] },
      { label: "Listed host charging ceiling", values: ["98W", "140W", "140W"] },
      { label: "Ethernet port", values: ["2.5GbE", "2.5GbE", "10GbE"] },
      { label: "Display cable plan", values: ["DisplayPort plus downstream Thunderbolt video", "Downstream Thunderbolt video; include required video adapters", "DisplayPort 2.1 plus downstream Thunderbolt video"] },
      { label: "Reason to choose", values: ["Reuse a matching dock; avoid replacing working ports", "A new TB5 host and a suitable USB-C/Thunderbolt peripheral layout", "A verified 10GbE endpoint path or additional physical ports"] },
    ] },
    sections: [
      { heading: "Write the cable plan before comparing port totals", body: "List each display input, resolution and refresh target, then draw the video path from the host through the dock. Include the actual cable or adapter at each end. A USB-C-shaped data port is not automatically a video output, and an HDMI-to-DisplayPort adapter is not interchangeable with a DisplayPort-to-HDMI cable." },
      { heading: "An older host does not gain a Thunderbolt 5 link", body: "Check the exact computer against CalDigit's compatibility matrix. Connection to an older supported host uses that host's capabilities; the TB5 label does not upgrade the computer's controller. For MacBooks, native display count is also a chip-specific constraint. These are native docks, so a dock purchase does not supply a DisplayLink workaround." },
      { heading: "Work out whether 10GbE changes the whole path", body: "TS5 Plus is useful for networking only when the endpoint, cable, switch and NAS or server can use the faster link. A 1GbE switch or a 2.5GbE NAS leaves that lower bottleneck in place. Draw local storage traffic separately from internet traffic; a faster local connection does not change the ISP plan." },
      { heading: "Compare complete upgrade cost", body: "Include video adapters, a suitable host cable, any switch or NIC needed for the intended network path, and return costs. Keep a known-good TS4 configuration when the new dock changes none of the daily requirements. Test the complete purchased setup for both displays, charging under the normal workload, peripherals and sleep/wake during its return window; this guide does not certify those results." },
      { heading: "Which listing is this guide recommending?", body: "The existing TS4 research page remains about TS4. This comparison does not relabel its purchase link as TS5 or TS5 Plus. New-model buying links require a separate exact-model and bundle check; the manufacturer references below are editorial sources." },
    ],
    sources: [
      source("CalDigit generation comparison", "https://www.caldigit.com/compare-thunderbolt-stations/", "Three-model port and generation comparison, checked October 20, 2026."),
      source("CalDigit TS4 manual", "https://downloads.caldigit.com/TS4/CalDigit_TS4_Manual.pdf", "TS4 charging and connection paths."),
      source("CalDigit TS5", "https://www.caldigit.com/thunderbolt-5-dock-ts5/", "TS5 physical ports, charging and host compatibility."),
      source("CalDigit TS5 Plus", "https://www.caldigit.com/thunderbolt-5-dock-ts5-plus/", "TS5 Plus 10GbE, power and host-dependent display modes."),
    ],
    relatedProducts: ["caldigit-ts4-thunderbolt-dock"], relatedGuides: ["macbook-dual-monitor-dock-chip-compatibility-guide", "usb-c-dock-ports-explained-guide"], relatedRoundups: [],
  },
  {
    site: "homeoffice", slug: "insta360-link-2-vs-link-2-pro-webcam", category: "meetings",
    title: "Insta360 Link 2 vs Link 2 Pro: Fixed Desk or Moving Presenter?",
    dek: "Choose between Link 2, Link 2C, Link 2 Pro and Link 2C Pro by framing, sensor, audio needs, computer support and the equipment you already own.",
    updatedAt: date, decisionLayout: true, image: "/images/affiliate/hero-homeoffice-realistic.webp",
    searchQuestion: "Which Link webcam makes sense for my actual calls?",
    quickAnswer: "Choose the framing job first: Link 2 and Link 2 Pro have a motorized gimbal; the 2C versions do not. The Pro pair adds a larger listed sensor and revised audio features. Keep a working camera when lighting, framing or microphone placement is the actual problem. Check software support on the exact computer before paying for advanced modes.",
    comparisonTable: { title: "Four models, two separate choices", columns: ["Link 2", "Link 2C", "Link 2 Pro", "Link 2C Pro"], rows: [
      { label: "Framing hardware", values: ["Motorized gimbal", "Fixed camera", "Motorized gimbal", "Fixed camera"] },
      { label: "Listed sensor format", values: ["1/2-inch", "1/2-inch", "1/1.3-inch", "1/1.3-inch"] },
      { label: "Main reason to compare", values: ["Moving presenter at an older-generation price", "A fixed desk with no need for mechanical tracking", "Moving presenter plus the Pro capture/audio feature set", "Pro capture/audio feature set without a gimbal"] },
    ] },
    sections: [
      { heading: "Seated calls and moving presentations are different jobs", body: "For a seated call, position the camera at a useful height and frame the chair before adding tracking. For whiteboard teaching or desk demonstrations, write down where the camera must follow you and whether the app supports the required mode. Automatic digital framing and a physically rotating camera are different mechanisms; a 2C model should not be purchased as a motorized tracker." },
      { heading: "A larger sensor is a specification, not our low-light score", body: "The Pro models list a larger sensor than the Link 2 pair. This is a hardware difference, not a measured image-quality ranking from Madabase. Room light, exposure, the conferencing app's processing and connection quality still affect the delivered call. Compare a better lamp or a corrected camera angle with the cost of replacing a camera that already works." },
      { heading: "Check the computer before the AI features", body: "Insta360's Pro specifications list operating-system and hardware requirements for Link Controller, virtual camera and background features. They explicitly exclude ARM-based Windows for Link Controller and flag potential AMD GPU limitations for background effects. A company-managed laptop may also restrict installation. Confirm the exact feature and computer rather than interpreting USB connectivity as permission or support for every software mode." },
      { heading: "Keep microphone choice separate", body: "The Pro series changes its microphone system and audio modes. That does not establish that it replaces a dedicated microphone in your room. Compare distance from speaker, keyboard noise, multiple people and the need for a headset. If the microphone you own already handles the room, choose the camera on framing and required capture modes." },
      { heading: "Check the full setup during the return window", body: "Use the actual meeting application, mounting position and usual light. Check framing, privacy control, permissions, sleep/wake and whether advanced modes survive the app's own video processing. Existing Link 2 links remain identified as Link 2; no Pro listing or hands-on performance claim is inferred from them." },
    ],
    sources: [
      source("Insta360 hardware comparison", "https://onlinemanual.insta360.com/link2cpro/en-us/specs/hardware/hardware", "Model-specific sensors, gimbals and hardware."),
      source("Insta360 Pro system requirements", "https://www.insta360.com/product/insta360-link2-pro", "Operating systems, supported modes and software limitations, checked October 20, 2026."),
      source("Insta360 Link 2 vs Pro", "https://www.insta360.com/blog/news/insta360-link-2-vs-link-2-pro.html", "Manufacturer description of the Pro generation; not an independent test."),
    ],
    relatedProducts: ["insta360-link-2-webcam", "logitech-mx-brio-4k-webcam"], relatedGuides: ["video-call-setup-guide"], relatedRoundups: ["logitech-mx-brio-vs-insta360-link-2", "logitech-litra-glow-vs-elgato-key-light-neo"],
  },
  {
    site: "smarthome", slug: "matter-apple-google-home-assistant-feature-checklist", category: "automation",
    title: "Matter in Apple Home, Google Home and Home Assistant: Feature Checks",
    dek: "Check the exact controls, transport, bridge and firmware before choosing an ecosystem; a Matter badge does not describe every available device feature.",
    updatedAt: date, decisionLayout: true, image: "/images/affiliate/hero-smarthome-realistic.webp",
    searchQuestion: "Will the features I need appear in my chosen Matter app?",
    quickAnswer: "Compare the feature, not only the logo. Record the device type, firmware, Wi-Fi or Thread transport, controller and any bridge. Then check the specific controls in the platform's current support table. Home Assistant's native local integration can expose features that its Matter route does not, so switching protocols can lose useful controls.",
    comparisonTable: { title: "What to establish for each control path", columns: ["Apple Home", "Google Home", "Home Assistant"], rows: [
      { label: "Device type", values: ["Check Apple's currently supported accessory types", "Check Google's device-type and control-support table", "Check the Matter integration and any native integration"] },
      { label: "Thread", values: ["Check the particular iPhone/home-hub and border-router requirements", "Confirm a suitable Thread border router for Thread devices", "Matter controller and Thread border router are separate roles"] },
      { label: "Extra features", values: ["Do not assume the vendor app's settings appear in Home", "Voice, app and display control support can differ", "Compare local native integration with Matter before migrating"] },
      { label: "A bridged accessory", values: ["Check the bridge's exported device and feature list", "The bridge cannot make unsupported controls appear", "Check both the bridge's export and HA's support"] },
    ] },
    sections: [
      { heading: "Write a feature record for the exact device", body: "Use one row for each function you actually need: basic on/off, dimming, lock state, temperature, energy reporting, scenes or notifications. For every row, record whether the function is exposed through Matter, remains vendor-app-only or is unresolved. Include device model, region, firmware, bridge firmware and the controller application version so the record can be checked again after an update." },
      { heading: "A bridge adds another compatibility boundary", body: "A Zigbee accessory behind a Matter bridge is not a native Matter-over-Thread accessory. The bridge decides what it exports. Home Assistant documents that Hue's native local integration offers Hue-specific functions beyond the basic controls exposed by its Matter bridge. That is a concrete reason to compare integration routes rather than replacing a working native route for the Matter label." },
      { heading: "Pairing locally and controlling remotely are different", body: "Apple documents direct local accessory pairing and control on supported iPhones and software, with additional hub and Thread conditions. That does not imply an unattended household has a complete remote-control path. Record which always-on controller, border router and account must be available for each routine, then distinguish local operation from control while away." },
      { heading: "Test the intended route before moving the whole home", body: "Start with one non-essential accessory. Check the required controls, a second household user, a router restart and loss of internet while the local network remains powered. Save the working settings before changing networks. Home Assistant's Matter documentation requires local IPv6 and multicast discovery; isolated networks need explicit network design, not random firewall changes." },
    ],
    sources: [
      source("Apple Matter accessory support", "https://support.apple.com/en-us/102135", "Accessory types and current iPhone/hub conditions."),
      source("Google Matter device support", "https://developers.home.google.com/matter/supported-devices", "Device-type and control support vary by control surface."),
      source("Home Assistant Matter integration", "https://www.home-assistant.io/integrations/matter/", "Native-integration differences, bridges, transport and network prerequisites."),
    ],
    relatedGuides: ["matter-thread-wifi-zigbee-device-checklist", "aqara-hub-m3-matter-thread-setup"], relatedRoundups: [],
  },
  {
    site: "network", slug: "home-network-smart-home-outage-plan", category: "backup",
    title: "Home Network Outage Plan: Power, Local Control and Recovery",
    dek: "Separate ISP loss, router failure and power loss, then plan the modem, ONT, router, hubs and essential device fallbacks as a complete chain.",
    updatedAt: date, decisionLayout: true, image: "/images/affiliate/hero-network-realistic.webp",
    searchQuestion: "What will still work if my internet or power fails?",
    quickAnswer: "Identify the failed layer first. Internet loss can leave a powered local network working; a router failure can remove that local path; power loss also stops mains-powered endpoints. Back up the complete required chain, and keep physical access and care routines available independently. A UPS does not guarantee that the ISP's outside equipment stays online.",
    comparisonTable: { title: "Three failures that need different plans", columns: ["ISP connection lost", "Router or local network unavailable", "Household mains power lost"], rows: [
      { label: "Local IP control", values: ["May continue while controller, network and endpoints remain powered", "IP paths may stop even though the endpoints have power", "Only the powered parts of the local chain can continue"] },
      { label: "Away-from-home access", values: ["Ordinary cloud access cannot cross the failed internet path", "Not established by powering the modem alone", "Needs a complete powered connection and a working outside service"] },
      { label: "First action", values: ["Check local devices separately from internet reachability", "Check router, switch and access-point power and links", "Use physical fallbacks; identify the required backup load"] },
    ] },
    sections: [
      { heading: "Draw every powered hop", body: "Start at the ISP handoff: ONT or modem, router, required switch or access point, controller, Thread border router and the endpoint. Mark power adapters and PoE sources. Backing up the router while leaving the ONT or PoE switch unpowered breaks the chain. Include a battery-powered device's hub and the phone used for local control where those are required." },
      { heading: "Plan runtime from the real load", body: "Measure or obtain the load for the complete selected chain, then use the exact UPS manufacturer's runtime curve. VA is not a duration, and dividing advertised battery capacity by one device's adapter rating does not establish usable runtime. For DC units, voltage, polarity, connector and current rating must match every powered device. Do not improvise mains wiring or use a plug adapter to assume electrical compatibility." },
      { heading: "Record one fallback for each essential routine", body: "For entry, retain the lock's documented physical or local method and keep it accessible. For pet feeding, distinguish a saved local schedule from app access and confirm the exact model's battery behavior. PETLIBRO's PLAF103 documentation describes emergency battery operation with restricted Wi-Fi functions; that is not a claim about every feeder. Keep a person and a non-automated care plan available." },
      { heading: "Make a recovery checklist", body: "For a non-essential test, first interrupt only the internet uplink while leaving local equipment powered; restore it before testing another layer. Record which controls remain available and which notifications disappear. Check clock, saved schedules, recording and reconnection after restoration. Do not deliberately interrupt security, heating or caregiving functions that people are relying on." },
    ],
    sources: [
      source("Home Assistant offline operation", "https://www.home-assistant.io/faq/", "Local integrations and cloud-dependent features have different outage behavior."),
      source("PETLIBRO PLAF103 power behavior", "https://petlibro.com/pages/how-the-granary-wifi-feeder-works", "Exact feeder example: saved schedules, batteries and restricted Wi-Fi."),
      source("Aqara B50 fallback methods", "https://www.aqara.com/en/product/smart-lock-b50/", "Exact lock example; not a guarantee for another lock model."),
    ],
    relatedGuides: ["mini-ups-for-routers-buying-guide"], relatedRoundups: ["best-ups-for-router-and-modem"],
  },
  {
    site: "smarthome", slug: "renter-no-drill-smart-home-plan", category: "cameras",
    title: "Renter Smart Home Plan: No-Drill Mounts and Reversible Upgrades",
    dek: "Check the doorbell generation, wall finish, removal method, charging access and move-out cost before choosing a supposedly rental-friendly device.",
    updatedAt: date, decisionLayout: true, image: "/images/affiliate/hero-smarthome-realistic.webp",
    searchQuestion: "Which smart-home changes can I remove when I move?",
    quickAnswer: "Start with freestanding or battery-powered devices that need no permanent alteration. For adhesive doorbell mounts, match the exact generation and approved surface; a no-drill label does not establish compatibility with rough walls, glass, a wedge or a solar accessory. Record permission and removal conditions before installing anything in a shared entrance.",
    comparisonTable: { title: "Choose the installation path before the device", columns: ["Freestanding", "Adhesive accessory", "Wired or mechanically altered"], rows: [
      { label: "Examples", values: ["Indoor camera on a stable shelf; plug-in hub", "An exact-model doorbell mount or sensor mount", "Lock hardware, thermostat, relay or new cable hole"] },
      { label: "Main constraint", values: ["Outlet, cable route, field of view and stability", "Model, substrate, temperature and removal instructions", "Permission, wiring or door fit and qualified installation"] },
      { label: "Move-out record", values: ["Device, power supply and account removal", "Replacement adhesive and the prescribed removal method", "Original parts, restoration plan and installation records"] },
    ] },
    sections: [
      { heading: "No-drill Ring mounts are not one interchangeable family", body: "Ring's older battery-doorbell mount lists Video Doorbell 3, 3 Plus, 4 and the named Battery Doorbell generations. A separate second-generation mount is documented for Battery Doorbell 2K, 2K Plus and 4K Pro. A similar product name does not prove the plate or screw pattern matches. Read the exact accessory's supported-device list before ordering." },
      { heading: "The wall can rule out the adhesive option", body: "The older Ring mount specifies a smooth, even vertical surface and excludes glass; it advises against brick, shingles and rough stucco. It also excludes combination with its wedge/corner kits and solar charger. Those limits belong to that exact accessory. Do not generalize them to a newer mount, and do not assume an adhesive marketed as removable cannot affect an unsuitable finish." },
      { heading: "Make charging and removal part of the installation", body: "Confirm the door still opens fully, the device can be removed for charging, and the camera view is useful at the actual mounting height. Keep the required release tool and removal directions. Record the accessory, adhesive type and surface before installation so a move does not become a search for unknown replacement strips." },
      { heading: "Use a reversible first installation", body: "Start with one device and a documented mounting method. Keep original door hardware and avoid changes to common entrances without the relevant permission. For a leak sensor, prioritize a suitable reachable location and a working notification path before buying an automated shutoff. For wiring, locks and plumbing, a reversible-looking product still needs its own installation assessment." },
    ],
    sources: [
      source("Ring older no-drill mount", "https://shop.ring.com/products/no-drill-mount-rvd3", "Exact supported models, surfaces and incompatible accessories."),
      source("Ring second-generation mount installation", "https://pa.ring.com/support/articles/2vr8r/installing-no-drill-mount-2nd-gen-for-battery-doorbell-2nd-gen-devices?hasLangChanged=true", "Separate 2K and 4K battery-doorbell accessory."),
      source("Ring's renter installation examples", "https://blog.ring.com/home-security/best-ring-devices-for-renters/", "Freestanding and no-drill product classes; manufacturer's guidance, not lease permission."),
    ],
    relatedGuides: ["video-doorbell-battery-storage-subscription-guide", "matter-thread-wifi-zigbee-device-checklist"], relatedRoundups: [],
  },
];

export function addEditorialExpansionLinks(guide: Guide): Guide {
  const additions = editorialExpansionGuides.filter((item) => item.site === guide.site && item.relatedGuides?.includes(guide.slug));
  return additions.length ? { ...guide, relatedGuides: [...new Set([...(guide.relatedGuides ?? []), ...additions.map((item) => item.slug)])] } : guide;
}
