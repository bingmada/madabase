import type { SiteKey } from "./types";

type TaskPaths = { keep: string; choices: { when: string; label: string; href: string }[] };
const armPaths: TaskPaths = {
  keep: "Keep the stock stand if it already provides usable screen distance and keyboard space. Unknown load, desk construction, clamp or clearance remains unresolved.",
  choices: [
    { when: "If the exact display, desk and mounting details are known.", label: "Check the documented monitor-arm profiles", href: "/compatibility/monitor-arms" },
    { when: "If the display falls outside a profile or a different arm format is needed.", label: "Compare arm load ranges and mounting paths", href: "/best/best-monitor-arms-for-home-office" },
  ],
};
const paths: Record<string, TaskPaths> = {
  "baby:baby-monitor-subscription-and-privacy-checklist": {
    "keep": "Keep a suitable monitor, or choose no camera when recording and ongoing service do not meet the household’s needs. A privacy checklist does not prove radio security or approve nursery placement.",
    "choices": [
      {
        "when": "If a separate local parent unit is the actual requirement.",
        "label": "Check DXR-8 PRO range, power and placement limits",
        "href": "/reviews/infant-optics-dxr-8-pro"
      },
      {
        "when": "If app access, remote viewing or cloud features are still needed.",
        "label": "Compare Wi-Fi and non-Wi-Fi monitor responsibilities",
        "href": "/guides/wifi-vs-non-wifi-baby-monitor-guide"
      }
    ]
  },
  "baby:baby-registry-essentials-guide": {
    "keep": "Keep suitable items already owned or safely available. A registry is not a requirement to buy every category; settle the child’s actual needs, exact instructions and recall checks first.",
    "choices": [
      {
        "when": "If a separate sleep space still needs to be selected.",
        "label": "Check full-size crib, mattress and stopping requirements",
        "href": "/guides/convertible-baby-cribs-compatibility-and-fit-guide"
      },
      {
        "when": "If vehicle-to-stroller travel is a real requirement.",
        "label": "Check the exact seat and stroller combination",
        "href": "/guides/baby-travel-systems-buying-guide"
      }
    ]
  },
  "baby:diaper-pail-replacement-bag-annual-cost-guide": {
    "keep": "Keep a suitable existing pail and use the bags its instructions permit. Buying another container does not resolve an unknown refill code or make a used bag reusable.",
    "choices": [
      {
        "when": "If the pail is Ubbi or a standard-bag container is genuinely needed.",
        "label": "Review Ubbi bag fit, cleaning and ownership conditions",
        "href": "/reviews/ubbi-steel-diaper-pail"
      }
    ]
  },
  "baby:travel-bottle-warmer-heating-cleaning-battery-guide": {
    "keep": "Keep an appropriate existing feeding and cleaning routine. An advertised battery or warming time does not establish safe storage, milk temperature or a clean bottle.",
    "choices": [
      {
        "when": "If cordless warming is a specific requirement and the received MW05 instructions can be followed.",
        "label": "Check MW05 contents, power and cleaning boundaries",
        "href": "/reviews/momcozy-mw05-portable-milk-warmer"
      },
      {
        "when": "If mains power is available and a countertop format would meet the job.",
        "label": "Compare the separate Philips SCF358 instructions",
        "href": "/reviews/philips-avent-premium-fast-bottle-warmer-scf358"
      }
    ]
  },
  "baby:travel-stroller-folded-size-checklist": {
    "keep": "Keep a suitable existing stroller when it fits the real storage and travel plan. A compact fold does not guarantee airline cabin acceptance; carrier policy and the exact folded configuration remain separate.",
    "choices": [
      {
        "when": "If a compact travel stroller is still needed after measuring the actual space.",
        "label": "Check City Tour 2 selection, fold and child limits",
        "href": "/reviews/baby-jogger-city-tour-2-stroller"
      }
    ]
  },
  "homeoffice:macbook-dual-monitor-dock-chip-compatibility-guide": {
    "keep": "Keep a working display route. Unknown chip, lid state, display mode, permitted software or power needs do not establish that a dock will add an independent screen.",
    "choices": [
      {
        "when": "If the full Mac model and display requirements are known.",
        "label": "Check the exact host and dock path",
        "href": "/compatibility/docks"
      },
      {
        "when": "If native displays and a software-assisted path are being compared.",
        "label": "Compare DisplayLink and Thunderbolt conditions",
        "href": "/best/displaylink-vs-thunderbolt-dock-dual-monitors"
      }
    ]
  },
  "homeoffice:monitor-arm-clamp-reinforcement-guide": {
    "keep": "Keep the stock stand or a suitable existing mounting arrangement. A reinforcement plate does not certify a weak, hollow, glass or otherwise unapproved desktop.",
    "choices": [
      {
        "when": "If the exact display, desktop construction and mount requirements are known.",
        "label": "Check documented arm and desk profiles",
        "href": "/compatibility/monitor-arms"
      },
      {
        "when": "If a different arm format is needed after those checks.",
        "label": "Compare arm load and mounting paths",
        "href": "/best/best-monitor-arms-for-home-office"
      }
    ]
  },
  "homeoffice:monitor-arm-for-walking-desk-guide": {
    "keep": "Keep a suitable existing stand or arm when it already meets the task. Walking-related motion, clearance and desktop suitability remain separate from static load limits; stop if the actual arrangement is unstable.",
    "choices": [
      {
        "when": "If the display, desk and intended travel are known.",
        "label": "Check the documented mounting requirements",
        "href": "/compatibility/monitor-arms"
      },
      {
        "when": "If clamp contact or reinforcement is the unresolved part.",
        "label": "Review desktop permission and clamp support",
        "href": "/guides/monitor-arm-clamp-reinforcement-guide"
      }
    ]
  },
  "homeoffice:single-vs-dual-monitor-arm-walking-desk": {
    "keep": "Keep a suitable current screen arrangement when it works. Two arm positions do not establish independent screen clearance, stability or a need to buy a dual mount.",
    "choices": [
      {
        "when": "If both displays and the desk can be identified and measured.",
        "label": "Check each mounting path and remaining unknowns",
        "href": "/compatibility/monitor-arms"
      },
      {
        "when": "If choosing separate arms versus a combined format.",
        "label": "Compare exact arm formats and load ranges",
        "href": "/best/best-monitor-arms-for-home-office"
      }
    ]
  },
  "homeoffice:usb-c-dock-ports-explained-guide": {
    "keep": "Keep the ports and cables already meeting the task. Connector shape, port count or a charging logo alone does not establish display modes, host bandwidth or a missing function.",
    "choices": [
      {
        "when": "If the exact computer and requested display path are known.",
        "label": "Check the host, screens, software and power requirements",
        "href": "/compatibility/docks"
      },
      {
        "when": "If comparing complete dock candidates after identifying the required ports.",
        "label": "Compare the Mac and Windows dock routes",
        "href": "/best/best-dual-monitor-docks-mac-windows"
      }
    ]
  },
  "homeoffice:usb-c-dock-vs-monitor-hub-guide": {
    "keep": "Keep a monitor hub or current dock when it already provides the required display, peripherals and power. A second hub is not automatically an upgrade; unclear host or cable support remains unresolved.",
    "choices": [
      {
        "when": "If checking whether the current host supports the requested display path.",
        "label": "Check the exact host and dock topology",
        "href": "/compatibility/docks"
      },
      {
        "when": "If a separate dock would add a specific missing function.",
        "label": "Compare complete dock candidates and their limits",
        "href": "/best/best-dual-monitor-docks-mac-windows"
      }
    ]
  },
  "network:2-5gbe-switch-port-budget-for-nas-mesh": {
    "keep": "Keep the existing network when it meets the measured traffic path and port count. Count the uplink and all required devices; an unknown link or cable does not become a documented 2.5Gbps path.",
    "choices": [
      {
        "when": "If the NAS, clients, uplink and required ports can be listed.",
        "label": "Check the complete Ethernet path and port budget",
        "href": "/compatibility/ethernet"
      },
      {
        "when": "If a switch is the actual missing component after those checks.",
        "label": "Compare fanless 2.5GbE port counts and power",
        "href": "/best/best-fanless-2-5gbe-switches-home-nas-mesh"
      }
    ]
  },
  "network:5-port-vs-8-port-2-5gbe-switch": {
    "keep": "Keep a switch with enough usable ports and supported links. Five devices plus an uplink require six positions; a larger switch does not fix another bottleneck.",
    "choices": [
      {
        "when": "If determining the real number of occupied ports and uplinks.",
        "label": "Check the Ethernet path before buying",
        "href": "/compatibility/ethernet"
      },
      {
        "when": "If comparing five-port and eight-port hardware for that budget.",
        "label": "Compare exact switch models and port layouts",
        "href": "/best/best-fanless-2-5gbe-switches-home-nas-mesh"
      }
    ]
  },
  "network:ethernet-cable-category-guide": {
    "keep": "Keep a suitable functioning cable. Category text alone does not certify the complete installed channel, PoE application, conductor fit or an unknown cable’s condition.",
    "choices": [
      {
        "when": "If diagnosing an existing or terminated cable.",
        "label": "Compare wire-map, qualification and certification tasks",
        "href": "/guides/ethernet-cable-testers-compatibility-and-fit-guide"
      },
      {
        "when": "If a separately identified factory patch cable is actually needed.",
        "label": "Check SlimRun selection, length and connector conditions",
        "href": "/reviews/monoprice-slimrun-cat6a-ethernet-patch-cable"
      }
    ]
  },
  "network:usb-c-ethernet-adapter-guide": {
    "keep": "Keep a working built-in or existing Ethernet path. A USB-C connector does not establish its data rate, driver support or that replacing the adapter will remove the bottleneck.",
    "choices": [
      {
        "when": "If deciding whether an adapter is the missing link.",
        "label": "Check the host-to-network traffic path",
        "href": "/compatibility/ethernet"
      },
      {
        "when": "If an independently documented 2.5G USB-C format fits the exact host and OS.",
        "label": "Check UE302C revision and host requirements",
        "href": "/reviews/tp-link-ue302c-2-5g-usb-c-ethernet-adapter"
      }
    ]
  },
  "network:when-to-upgrade-to-2-5gbe-switch": {
    "keep": "Keep adequate Gigabit equipment when the actual work does not exceed it. Internet speed, same-switch NAS traffic, cables and endpoint limits are separate questions.",
    "choices": [
      {
        "when": "If the measured bottleneck and complete traffic route are known.",
        "label": "Check whether the switch is actually limiting the flow",
        "href": "/compatibility/ethernet"
      },
      {
        "when": "If a compatible faster switch is the remaining requirement.",
        "label": "Compare fanless 2.5GbE switches and port budgets",
        "href": "/best/best-fanless-2-5gbe-switches-home-nas-mesh"
      }
    ]
  },
  "pet:automatic-litter-box-accessories-cost-guide": {
    "keep": "Keep suitable existing equipment and buy only the exact replacement parts it permits. An annual-cost estimate does not qualify generic liners, filters, sensors or another robot.",
    "choices": [
      {
        "when": "If an automatic box’s received model, care and parts requirements need to be identified.",
        "label": "Review original-model setup and maintenance boundaries",
        "href": "/guides/open-top-self-cleaning-litter-boxes-setup-and-daily-workflow"
      },
      {
        "when": "If the actual job is waste storage or odor-source control rather than a robot repair.",
        "label": "Compare the separate litter and odor-control approaches",
        "href": "/best/best-pet-odor-and-litter-upgrades"
      }
    ]
  },
  "pet:cat-fountain-filter-replacement-guide": {
    "keep": "Keep a suitable clean fountain and use its matched consumables. A generic filter listing or a new fountain is not a substitute for identifying the existing model and permitted parts.",
    "choices": [
      {
        "when": "If the installed fountain is the Catit Flower family.",
        "label": "Check the Catit model, pump and filter boundaries",
        "href": "/reviews/catit-flower-cat-water-fountain"
      },
      {
        "when": "If the existing fountain cannot meet the care or use requirements.",
        "label": "Compare complete fountain formats separately",
        "href": "/guides/cat-water-fountain-buying-guide"
      }
    ]
  },
  "pet:pet-camera-privacy-and-placement-guide": {
    "keep": "Keep a suitable camera or choose no indoor recording if privacy, placement, account access or recurring service does not meet the household’s needs. A camera does not replace a carer.",
    "choices": [
      {
        "when": "If the need is basic stationary indoor viewing without treat interaction.",
        "label": "Check Wyze Pan v3 placement, storage and account limits",
        "href": "/reviews/wyze-cam-pan-v3-pet-camera"
      },
      {
        "when": "If dog-focused treat interaction and the stated paid activation term are acceptable.",
        "label": "Review Furbo hardware, placement and plan obligations",
        "href": "/reviews/furbo-360-dog-camera"
      }
    ]
  },
  "pet:pet-camera-without-too-many-subscriptions": {
    "keep": "Keep an adequate existing camera or use no camera when recording and recurring charges are unwanted. Local storage does not establish that every AI or remote-access feature is free.",
    "choices": [
      {
        "when": "If checking a basic indoor camera’s local-card and cloud boundaries.",
        "label": "Review Wyze Pan v3 storage and plan conditions",
        "href": "/reviews/wyze-cam-pan-v3-pet-camera"
      },
      {
        "when": "If treat interaction is important enough to consider a separate paid-plan device.",
        "label": "Compare Furbo’s exact activation and renewal obligations",
        "href": "/reviews/furbo-360-dog-camera"
      }
    ]
  },
  "smarthome:matter-apple-google-home-assistant-feature-checklist": {
    "keep": "Keep existing controllers and manual controls when they already support the required functions. A Matter logo does not establish every ecosystem feature or that another hub is necessary.",
    "choices": [
      {
        "when": "If the missing role is unclear.",
        "label": "Separate the Matter-controller and Thread-border-router roles",
        "href": "/guides/matter-controller-vs-thread-border-router"
      },
      {
        "when": "If Aqara Hub M3 is being considered for a specific documented role.",
        "label": "Check the exact M3 ecosystem and local-control boundaries",
        "href": "/reviews/aqara-hub-m3"
      }
    ]
  },
  "smarthome:renter-no-drill-smart-home-plan": {
    "keep": "Keep ordinary controls when smart features do not justify the cost or permissions. Renting does not waive electrical, load or regional requirements; do not modify fixed wiring without the appropriate permission and professional assessment.",
    "choices": [
      {
        "when": "If controlling a suitable plug-in appliance is the actual requirement and the regional model and load match.",
        "label": "Check the separately identified Tapo P125M plug",
        "href": "/reviews/tapo-p125m-matter-smart-plug"
      },
      {
        "when": "If deciding whether a hub or Thread infrastructure is missing.",
        "label": "Check existing controller and border-router roles first",
        "href": "/guides/matter-controller-vs-thread-border-router"
      }
    ]
  },
  "pet:automatic-feeder-portion-size-guide": {
    keep: "Keep a suitable measured feeding routine if it already works. A portion setting does not establish calories or that the pet ate the meal.",
    choices: [{ when: "If timed dry-food meals are needed after checking the actual food and repeated dispense weights.", label: "Check Granary food, portion and backup limits", href: "/reviews/petlibro-granary-automatic-cat-feeder" }],
  },
  "homeoffice:monitor-arm-for-small-desk-guide": armPaths,
  "homeoffice:monitor-arm-compatibility-checklist": armPaths,
  "homeoffice:video-call-setup-guide": {
    keep: "Keep the built-in camera, existing light and audio path when the test call already meets the job. Change one remaining bottleneck at a time.",
    choices: [
      { when: "If face lighting remains inadequate after trying placement and brightness.", label: "Compare Litra Glow placement and power requirements", href: "/reviews/logitech-litra-glow" },
      { when: "If a fixed camera upgrade is still useful after checking light, framing and the meeting app.", label: "Check MX Brio host, mount and image-control limits", href: "/reviews/logitech-mx-brio-4k-webcam" },
    ],
  },
  "homeoffice:home-office-cable-management-guide": {
    keep: "Keep reusable ties and a working cable route when those are sufficient. A cleaner-looking bundle alone does not establish a need for a dock or a larger tray.",
    choices: [
      { when: "If power bricks need supported storage under a desktop with an approved mounting location.", label: "Compare tray mounting, load and service access", href: "/guides/under-desk-cable-trays-buying-guide" },
      { when: "If loose cables need a flexible bundle with accessible breakouts.", label: "Check sleeve diameter, breakouts and movement", href: "/guides/desk-cable-sleeves-buying-guide" },
    ],
  },
  "baby:nursery-sound-machine-night-light-guide": {
    keep: "Keep a suitable existing light or sound routine when it already works. A device does not establish safe exposure or guarantee sleep.",
    choices: [{ when: "If combined sound, light and app routines are a specific need after considering placement, exposure and continuous power.", label: "Check the current Hatch model, controls and plan terms", href: "/reviews/hatch-rest-sound-machine" }],
  },
  "baby:bottle-parts-cleaning-routine-guide": {
    keep: "Keep an effective existing cleaning and drying routine. The parts' instructions and the infant's needs determine any separate sanitizing step.",
    choices: [
      { when: "If it is unclear whether washing, sanitizing or drying is the actual bottleneck.", label: "Choose between a washer, sterilizer and dryer", href: "/guides/bottle-washer-vs-sterilizer-vs-dryer-guide" },
      { when: "If already-clean compatible parts need a separate steam-and-dry workflow.", label: "Check Dr. Brown's exact model, loading and full cycle", href: "/reviews/dr-browns-all-in-one-sterilizer-dryer" },
    ],
  },
  "network:router-placement-guide": {
    keep: "Keep the present router when placement or a supported wired path solves the problem. Unclear test results do not establish that another router or mesh pack is needed.",
    choices: [{ when: "If repeatable room checks still show a coverage gap after practical placement and wired options.", label: "Compare mesh topology, ports and pack size", href: "/best/best-mesh-wifi-for-apartments-and-homes" }],
  },
  "pet:automatic-feeder-cleaning-checklist": {
    keep: "Maintain a suitable existing feeder rather than replacing it to complete a cleaning checklist. Use the instructions for the model on its label.",
    choices: [
      { when: "If the feeder is the Granary PLAF103 family.", label: "Review Granary food-path and backup checks", href: "/reviews/petlibro-granary-automatic-cat-feeder" },
      { when: "If the feeder is One RFID PLAF301 with its dedicated tag and reader.", label: "Review the separate One RFID care and revision limits", href: "/reviews/petlibro-one-rfid-smart-feeder" },
    ],
  },
  "pet:pet-camera-subscription-cost-checklist": {
    keep: "Keep a suitable existing camera or choose no indoor camera when recording and recurring service do not meet the household's needs. Check each exact model's current plan terms.",
    choices: [
      { when: "If the job is a basic indoor check-in rather than treat interaction.", label: "Check Wyze Pan v3 viewing, storage and plan boundaries", href: "/reviews/wyze-cam-pan-v3-pet-camera" },
      { when: "If dog-focused treat interaction is useful and a paid activation term is acceptable.", label: "Check Furbo hardware and subscription obligations", href: "/reviews/furbo-360-dog-camera" },
    ],
  },
  "network:home-network-smart-home-outage-plan": {
    keep: "Keep documented manual fallbacks for essential routines. Unknown power, connector, load or runtime requirements remain unresolved; a router-only battery does not back up every hop.",
    choices: [{ when: "If the complete powered chain and actual load have been identified.", label: "Size router, modem and ONT backup runtime", href: "/guides/router-ups-runtime-guide" }],
  },
};

export function taskGuidePaths(site: SiteKey, slug: string) {
  return paths[`${site}:${slug}`];
}
