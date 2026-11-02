import type { Guide, Product, Roundup } from "./types";

const updatedAt = "July 22, 2026";
const amazonUrl = (asin: string) =>
  `https://www.amazon.com/dp/${asin}?tag=bingmada-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl`;

export const smartHomeWaterShutoffProducts: Product[] = [
  {
  "site": "smarthome",
  "slug": "aqara-valve-controller-t1",
  "asin": "B0DB8KS8Q3",
  "amazonTitle": "Aqara Smart Valve Controller T1, Zigbee 3.0, Hub Required",
  "seoTitle": "Aqara Valve Controller T1 Guide: Fit, Hub and Leak Automation",
  "updatedAt": "November 1, 2026",
  "evidenceMode": "official-spec",
  "researchNote": "We have not installed this valve controller. This page uses Aqara's current specifications and the exact Amazon identity. Valve geometry, stiffness, clearance, regional plumbing practice, hub firmware, and automation setup must be verified in the home. November 1, 2026: selected US retailer identity and purchase conditions reviewed separately; no received-unit, installation, performance or reliability test.",
  "name": "Aqara Valve Controller T1",
  "brand": "Aqara",
  "category": "automation",
  "image": "/images/affiliate/smarthome-water-valve-retrofit-editorial-realistic.webp",
  "summary": "A battery-powered Zigbee retrofit actuator for compatible lever or butterfly valves, with Aqara-hub automation, Matter-over-bridge support, manual control, and valve-fit limits.",
  "verdict": "Compare T1 when the existing valve is healthy, compatible with the supplied clamp and handle geometry, and the exact Aqara hub and automation path meet the job. Keep manual access. A stiff or corroded valve, shared system or fire-suppression concern needs professional assessment before choosing an actuator.",
  "whyItMatters": "A leak alert only reduces damage when someone can reach the shutoff. A compatible local automation can shorten that response, but a motor attached to the wrong or unhealthy valve can create false confidence.",
  "bestFor": "Aqara homes with a compatible accessible quarter-turn main valve",
  "priceBand": "$$",
  "rating": 0,
  "scores": [],
  "pros": [
    "Retrofits without cutting a compatible pipe or replacing the valve",
    "Battery power avoids placing a mains outlet beside the valve",
    "Aqara hub can connect leak detection, alerts, and shutoff automations"
  ],
  "cons": [
    "Requires a compatible Aqara Zigbee hub for smart functions",
    "Only fits supported valve sizes, handle styles, torque, and mounting clearance",
    "Matter-over-bridge does not make every third-party automation or valve state identical"
  ],
  "specs": {
    "ASIN": "B0DB8KS8Q3",
    "Model": "VC-X01E selected US record; match the supplied revision",
    "Radio": "Zigbee 3.0; Aqara hub required for connected features",
    "Matter": "Matter over a compatible Aqara bridge",
    "Power": "4 x AA batteries",
    "Valve fit": "DN15, DN20, DN25; 1/2, 3/4, and 1 in listed",
    "Handles": "Compatible lever and butterfly valves listed",
    "Torque": "Manufacturer maximum ≤ 3.6 N·m, not approval for a stiff valve",
    "Environment": "Indoor, no water ingress protection; no condensation or outdoor installation"
  },
  "evidence": [
    "Confirm ASIN B0DB8KS8Q3 and Valve Controller T1 rather than an Aqara sensor or hub bundle",
    "Photograph the valve, handle sweep, pipe size, wall clearance, and nearby obstructions before ordering",
    "A plumber should inspect a stiff, corroded, leaking, inaccessible, or non-quarter-turn valve",
    "Confirm the exact Aqara hub, region, firmware, sensor, app, and Matter path",
    "Test manual operation, alert routing, automation, battery warning, and recovery while someone is present"
  ],
  "editorialSections": [
    {
      "heading": "The valve fit is the buying decision",
      "body": "Aqara lists DN15, DN20, and DN25 pipe sizes and compatible lever or butterfly valves. That is not permission to force the actuator onto any shutoff. Confirm the handle style, 90-degree sweep, stem condition, torque, clamp position, and clearance on every side."
    },
    {
      "heading": "Aqara closes the sensor-to-valve loop",
      "body": "The strongest use case is an Aqara hub already receiving leak alerts. Build an automation that closes the valve, sounds a local alarm, and notifies the household. Keep the automation narrow enough that one noisy or misplaced sensor does not create repeated unnecessary shutoffs."
    },
    {
      "heading": "Hub and Matter are separate checks",
      "body": "The controller uses Zigbee and needs a compatible Aqara hub for connected features. Matter exposure happens through the bridge, so confirm which states and commands reach the chosen platform instead of assuming every ecosystem reproduces the Aqara app."
    },
    {
      "heading": "Who should skip it",
      "body": "Skip it for gate valves, seized or corroded valves, insufficient clearance, wet or condensing locations outside the rating, shared-building systems, or any line whose closure could affect fire suppression. Those conditions need a plumber or building professional, not a stronger motor."
    },
    {
      "heading": "Manual fallback stays essential",
      "body": "Everyone in the home should still know the manual shutoff and how to respond if the hub, battery, app, internet, or actuator fails. Run supervised tests and never hide the valve behind permanent storage."
    },
    {
      "heading": "Plan the recurring supervised check",
      "body": "Aqara’s current FAQ recommends a monthly self-check with someone present to observe the valve and correct mounting problems. Check complete closure and manual/clutch access using the received instructions. A closed icon alone is not a measured water-flow result, and battery-life estimates do not remove battery monitoring."
    }
  ],
  "alternatives": [
    "Choose YoLink X3 plus Bulldog when long-range local device-to-device control and outdoor-rated hardware matter.",
    "Choose Moen Flo when inline flow and pressure monitoring plus automatic shutoff justify professional plumbing work."
  ],
  "compareSlugs": [
    "yolink-x3-bulldog-valve-controller",
    "moen-flo-900-001-smart-water-shutoff"
  ],
  "sources": [
    {
      "name": "Aqara Valve Controller T1 product page",
      "url": "https://us.aqara.com/products/aqara-valve-controller-t1",
      "note": "Official valve sizes, handle compatibility, battery, torque, Zigbee, hub, Matter-over-bridge, and use conditions."
    },
    {
      "name": "Aqara Valve Controller T1 announcement",
      "url": "https://www.aqara.com/en/?p=94712",
      "note": "Official retrofit, automation, hub, battery-life assumption, and ecosystem context."
    },
    {
      "name": "Selected US retailer identity, November 1, 2026",
      "url": "https://www.amazon.com/dp/B0DB8KS8Q3",
      "note": "Exact model and selected package observed for New York 10001. Seller, condition, delivered total and current returns remain purchase-time checks; this is not a received-unit approval."
    },
    {
      "name": "T1 exact manufacturer specifications",
      "url": "https://www.aqara.com/us/product/valve-controller-t1-specs/",
      "note": "VC-X01E/VC-X01D, maximum torque, pipe/handle range and four AA cells. Actual supplied clamp and complete valve condition still govern fit."
    },
    {
      "name": "T1 manufacturer FAQ and current installation context",
      "url": "https://eu.aqara.com/products/aqara-valve-controller-t1",
      "note": "Monthly supervised self-check, indoor/non-waterproof boundary, supported handle sizes and Matter-over-bridge prerequisites; EU offer/stock is not used as US retail availability."
    }
  ],
  "offers": [
    {
      "merchant": "Amazon US",
      "url": "https://www.amazon.com/dp/B0DB8KS8Q3?tag=madasmart-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl",
      "label": "Check Aqara Valve Controller T1 on Amazon",
      "priceNote": "Confirm the exact model and package, current condition, seller, delivered total and return terms; read the model-specific fit check above."
    }
  ],
  "purchaseCheck": "Match T1 VC-X01E, supplied clamp and the actual healthy valve’s handle, size, sweep and clearance. Include a supported Aqara hub, suitable sensor and tested automation. Keep the unit dry and manual shutoff accessible; do not force a stiff valve."
},
  {
  "site": "smarthome",
  "slug": "yolink-x3-bulldog-valve-controller",
  "seoTitle": "YoLink X3 Bulldog Guide: Valve Fit, D2D & Kit Contents",
  "updatedAt": "November 1, 2026",
  "evidenceMode": "official-spec",
  "researchNote": "We have not installed this system. The specifications come from YoLink's official product page. A previously suspected Amazon ASIN resolves to an unrelated plumbing product, so this page intentionally has no purchase button until an exact Amazon listing is verified. November 1, 2026: selected US retailer identity and purchase conditions reviewed separately; no received-unit, installation, performance or reliability test.",
  "name": "YoLink X3 Valve Controller & Bulldog Valve Robot",
  "brand": "YoLink",
  "category": "automation",
  "image": "/images/affiliate/smarthome-water-valve-retrofit-editorial-realistic.webp",
  "summary": "A separate X3 controller and Bulldog actuator system: compare valve-body bracket fit, manual clutch access, configured D2D control, power and the supplied kit contents.",
  "verdict": "Use this as a manufacturer-documented comparison for a compatible existing ball valve and a planned local leak-response system. The exact Amazon kit is still unverified, so this page keeps a reference-only path. Resolve supplied revision and environmental limits before considering an exposed installation.",
  "whyItMatters": "Leak sensors often sit in the home's worst radio locations. YoLink's long-range LoRa path and device-to-device pairing can keep a local shutoff rule useful when ordinary Wi-Fi coverage or cloud access is unreliable.",
  "bestFor": "Long-range leak-to-shutoff automation on an existing ball valve",
  "priceBand": "$$$",
  "rating": 0,
  "scores": [],
  "pros": [
    "Bolt-on Bulldog actuator avoids pipe cutting on a compatible ball valve",
    "LoRa controller supports long-range placement and device-to-device pairing",
    "Replaceable lithium battery and IP67 controller enclosure are officially listed"
  ],
  "cons": [
    "Full app functionality requires a YoLink Hub or SpeakerHub",
    "Official direct kit is materially more expensive than a simple Zigbee actuator",
    "Bulldog mechanical fit, handle travel, controller mounting, and extension cable still require inspection"
  ],
  "specs": {
    "Model": "Current maker page: YS5001S X3 + Bulldog; match supplied controller and guide",
    "Radio": "YoLink LoRa",
    "Power": "Replaceable 3.6V lithium battery in X3 controller",
    "Controller rating": "Current webpage IP67 conflicts with the linked guide’s controller IP65 table; resolve exact revision before weather exposure",
    "Range": "Current maker open-air claim up to 2,034 ft; no installed range measured",
    "Pairing": "Device-to-device control supported",
    "Hub": "Kit-only selection excludes hub; app access/remote alerts need a compatible hub",
    "Valve fit": "Healthy compatible ball valve and secure bracket on its non-round valve body; actual handle/axis clearance required"
  },
  "evidence": [
    "Current manufacturer YS5001S kit and matching original linked guide reviewed November 1, 2026; exact Amazon option not established",
    "Current controller webpage IP67 versus original controller table IP65 kept unresolved; no weather or ingress test",
    "No valve installed, bracket mounted, D2D paired, battery replaced or flow-stop test performed"
  ],
  "editorialSections": [
    {
      "heading": "Keep the exact kit identity visible",
      "body": "The current official range names a YS5001S controller with a Bulldog Valve Robot. Kit-only and a separate hub-plus-four-sensors configuration have different contents. No exact Amazon listing is verified here; the historical unrelated shower-valve ASIN remains excluded. Use the manufacturer reference to verify the exact kit and supplied documents before choosing a seller."
    },
    {
      "heading": "The bracket fits the valve body, not any nearby pipe",
      "body": "The linked original says the existing ball valve must move smoothly and close fully. It secures the bracket to a suitable non-round part of the valve body, with the motor and valve shafts aligned. An actuator cannot repair a seized, leaking or mechanically unsuitable valve. Have an appropriate professional assess the valve and installation; retain clutch and manual access."
    },
    {
      "heading": "Separate local D2D from app access",
      "body": "Configured compatible Control-D2D pairs can act without a hub or internet while the sensor and controller remain powered and within radio range. Pairing is separate from app automations and must reflect the intended closed-valve response. Follow the exact guide and verify real closure; this review did not pair a sensor or operate a valve."
    },
    {
      "heading": "Resolve the supplied environmental rating",
      "body": "The current product page calls the controller IP67, while its linked YS5001(S)-UC guide’s controller table says IP65. The actuator is separately listed IP65. Do not blend those into a system waterproof claim. The original forbids immersion and asks for overhead cover or an enclosure outdoors; confirm the actual revision and conditions before any exposed placement."
    },
    {
      "heading": "Maintain the exact battery and the response plan",
      "body": "The original specifies its matching battery assembly and handling procedure, rather than an arbitrary loose replacement cell. Keep the supplied instructions and a supervised test schedule, inspect mounting and cable connections, and preserve the manual shutoff. A reported valve state alone is not proof that water has stopped."
    },
    {
      "heading": "Keep a suitable simpler route",
      "body": "Keep an adequate manual or existing supported shutoff routine when it meets the task. Aqara T1 is a different indoor actuator with its own hub and valve-fit requirements; an inline monitor such as Flo is a separate plumbing installation. Neither is a drop-in substitute for this system."
    }
  ],
  "alternatives": [
    "Choose Aqara Valve Controller T1 for a lower-cost Aqara Zigbee retrofit path.",
    "Choose Moen Flo when flow, pressure, and whole-home anomaly monitoring justify an inline installation."
  ],
  "compareSlugs": [
    "aqara-valve-controller-t1",
    "moen-flo-900-001-smart-water-shutoff"
  ],
  "sources": [
    {
      "name": "YoLink X3 Valve Controller & Bulldog Valve Robot",
      "url": "https://shop.yosmart.com/products/ys5001-bdog",
      "note": "Official current merchant, exact kit contents, hub requirement, controller, actuator, radio, power, warranty, and installation details."
    },
    {
      "name": "Current X3 Bulldog maker kit",
      "url": "https://shop.yosmart.com/products/yolink-x3-valve-controller-bulldog-kit",
      "note": "Current YS5001S kit contents, hub exclusion, valve condition, separate controller/actuator ratings and configured D2D context."
    },
    {
      "name": "Maker-linked X3 Bulldog original guide",
      "url": "https://www.yosmart.com/help/docs/products/YS5001BDOG-UC/YS5001BDOG-UC_instruction.pdf",
      "note": "June 11, 2026 guide, 53 physical pages. Relevant valve-body mounting, local pairing, specifications, battery and warning sections reviewed; not a unit-specific revision or physical installation test."
    }
  ],
  "offers": [],
  "purchaseCheck": "Reference-only: exact Amazon kit remains unverified. Match YS5001S/controller/actuator revision, kit contents, valve-body bracket fit, manual access and configured D2D path. Resolve the controller rating conflict before exposed use; keep a suitable manual or supported existing system."
},
  {
  "site": "smarthome",
  "slug": "moen-flo-900-001-smart-water-shutoff",
  "asin": "B00C03D01Q",
  "amazonTitle": "Moen Flo 3/4-inch Smart Water Shut Off Valve, Model 900-001",
  "seoTitle": "Moen Flo 900-001 Guide: 3/4-Inch Fit and Install",
  "updatedAt": "November 1, 2026",
  "evidenceMode": "official-spec",
  "researchNote": "We have not installed or flow-tested this unit. This page uses Moen's current model, specification, installation, and power documentation plus the exact 3/4-inch Amazon identity. A licensed plumber and local code determine the final installation. November 1, 2026: selected US retailer identity and purchase conditions reviewed separately; no received-unit, installation, performance or reliability test.",
  "name": "Moen Flo 3/4-Inch Smart Water Shutoff 900-001",
  "brand": "Moen",
  "category": "automation",
  "image": "/images/affiliate/smarthome-water-valve-inline-editorial-realistic.webp",
  "summary": "An inline 3/4-inch smart water monitor and shutoff with flow, pressure, temperature, remote and automatic closure, exact pipe-size variants, power and Wi-Fi requirements, and professional-installation risks.",
  "verdict": "Moen Flo 900-001 is the higher-commitment choice when whole-home flow monitoring and automatic inline shutoff are worth plumbing work, power, Wi-Fi, and setup. Do not buy the 3/4-inch ASIN until a plumber confirms the service-line size, straight-pipe space, manual-shutoff position, code, and fire-sprinkler layout.",
  "whyItMatters": "Unlike a bolt-on actuator, Flo watches flow, pressure, and temperature and sits directly in the main water line. That can detect patterns that a floor sensor misses, but installation errors or the wrong pipe-size variant are much more consequential.",
  "bestFor": "Whole-home flow monitoring plus inline automatic shutoff",
  "priceBand": "$$$$",
  "rating": 0,
  "scores": [],
  "pros": [
    "Measures real-time flow, pressure, and temperature and supports automatic, remote, and manual shutoff",
    "Official 3/4-inch model uses included NPT tailpieces",
    "App modes, alerts, water-use goals, and manual health tests are documented"
  ],
  "cons": [
    "Requires inline plumbing work, nearby approved power, Wi-Fi, commissioning, and code review",
    "3/4, 1, and 1-1/4-inch versions use different model numbers and Amazon ASINs",
    "Must not be installed on fire-sprinkler or hot-water distribution lines"
  ],
  "specs": {
    "ASIN": "B00C03D01Q",
    "Model": "900-001",
    "Size": "3/4 in with included NPT tailpieces",
    "Monitoring": "Flow, pressure, and temperature",
    "Shutoff": "Automatic, remote, and manual",
    "Network": "2.4 GHz Wi-Fi and correct Moen account type; offline/Local Mode affects shutoff behavior",
    "Maximum pressure": "Installer guide recommends maximum continuous 80 psi; have the actual pressure and required regulator assessed",
    "Power": "AC adapter and nearby approved outlet required",
    "Orientation": "Horizontal or vertical with flow direction observed"
  },
  "evidence": [
    "Confirm ASIN B00C03D01Q, model 900-001, and 3/4-inch size; 1-inch and 1-1/4-inch models are different products",
    "Have a licensed plumber confirm service-line size, pipe material, straight-pipe space, unions, pressure, grounding, and code",
    "Install after the manual shutoff and pressure regulator and before household branches under Moen guidance",
    "Do not install on a fire-sprinkler or suppression line or hot-water distribution line",
    "Confirm approved power reach, Wi-Fi signal, app setup, manual fallback, seller, stock, and return terms"
  ],
  "editorialSections": [
    {
      "heading": "Pipe size is an exact product identity",
      "body": "Model 900-001 is the 3/4-inch unit. Moen identifies 900-006 as 1 inch and 900-002 as 1-1/4 inch. These are not selectable labels on one universal valve. A plumber should measure and confirm the line before checkout."
    },
    {
      "heading": "Inline monitoring changes what the system can see",
      "body": "Flo monitors flow, pressure, and temperature and can run leak-detection health tests. That adds whole-home anomaly detection beyond a floor sensor, while separate point sensors can still provide fast evidence at a washer, water heater, or sink."
    },
    {
      "heading": "Installation location has safety boundaries",
      "body": "Moen says the unit belongs on the main supply after the manual shutoff and pressure-reducing valve, before the plumbing branches. It must not be installed on fire-sprinkler or suppression systems or hot-water distribution lines. Local code and complex shared or irrigation systems need professional review."
    },
    {
      "heading": "Power and Wi-Fi are part of the plumbing plan",
      "body": "The AC adapter needs an approved nearby outlet and the app needs reliable Wi-Fi at the main line. Confirm cord routing, outdoor or damp-location requirements, network signal, and manual operation before the pipe is cut."
    },
    {
      "heading": "Who should skip it",
      "body": "Skip it in a rental without approval, where installation space or power is missing, where fire-suppression plumbing cannot be isolated safely, or when a compatible bolt-on valve actuator solves the actual leak-response goal with less cost and disruption."
    },
    {
      "heading": "Commissioning and pressure are part of the purchase",
      "body": "The linked INS11955A installer guide recommends maximum continuous pressure of 80 psi. That differs from quoting a broad component maximum as an installation target. Its normal single-home setup includes an initial health test and a 7–10-day learning period; a powered device left unconnected can enter Local Mode with frequent shutoffs. Settle account, internet and recovery behavior before the pipe is cut."
    },
    {
      "heading": "Check the complete clearance and power arrangement",
      "body": "Use the exact 900-001 installation drawing, including straight inlet/outlet runs and clearance above, below and beside the device. The guide keeps the power supply off the ground, specifies approved low-voltage extension arrangements and requires a weatherproof receptacle enclosure for applicable outdoor installations. Do not use a mains extension cord to improvise reach. Retain the installation spacer and have the plumber confirm flow direction, sealing and manual access."
    }
  ],
  "alternatives": [
    "Choose Aqara Valve Controller T1 for a battery Zigbee retrofit on a compatible existing valve.",
    "Choose YoLink X3 Bulldog for long-range local sensor-to-valve pairing without cutting pipe."
  ],
  "compareSlugs": [
    "aqara-valve-controller-t1",
    "yolink-x3-bulldog-valve-controller"
  ],
  "sources": [
    {
      "name": "Moen 900-001 specification sheet",
      "url": "https://assets.moen.com/shared/docs/product-specifications/900-001sp.pdf",
      "note": "Official model, size, monitoring, shutoff, pressure, app, and certification details."
    },
    {
      "name": "Moen Flo installation guidance",
      "url": "https://solutions.moen.com/Smart_Water_Security_Products/Help_Center/Setup/Installing_the_Moen_Flo_Shutoff",
      "note": "Official main-line location and fire-suppression and hot-water exclusions."
    },
    {
      "name": "Moen Flo size guide",
      "url": "https://solutions.moen.com/Moen_Flo_Shutoff/Get_to_know_your_Product/What_size_is_my_Moen_Flo_Shutoff%3F",
      "note": "Official mapping of 900-001, 900-006, and 900-002 to pipe sizes."
    },
    {
      "name": "Selected US retailer identity, November 1, 2026",
      "url": "https://www.amazon.com/dp/B00C03D01Q",
      "note": "Exact model and selected package observed for New York 10001. Seller, condition, delivered total and current returns remain purchase-time checks; this is not a received-unit approval."
    },
    {
      "name": "Flo original installation guide INS11955A",
      "url": "https://m.media-amazon.com/images/I/C1UNLrFONrL.pdf",
      "note": "12 physical pages; English installation requirements, 80 psi continuous recommendation, mains/approved-extension limits, pipe/clearance diagrams and commissioning/Local Mode notes reviewed. Not a plumbing or pressure test."
    }
  ],
  "offers": [
    {
      "merchant": "Amazon US",
      "url": "https://www.amazon.com/dp/B00C03D01Q?tag=madasmart-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl",
      "label": "Check Moen Flo 3/4-Inch Smart Water Shutoff 900-001 on Amazon",
      "priceNote": "Confirm the exact model and package, current condition, seller, delivered total and return terms; read the model-specific fit check above."
    }
  ],
  "purchaseCheck": "Match 900-001, the 3/4-inch variant. Have a plumber confirm line size, pressure, exact clearance, fire-system separation and code. Include approved nearby power, 2.4 GHz Wi-Fi, correct account, learning period and manual fallback; never treat 175 psi as a continuous installation target."
},
];

export const smartHomeWaterShutoffRoundups: Roundup[] = [
  {
    site: "smarthome",
    slug: "best-smart-water-shutoff-valves-retrofit-inline",
    seoTitle: "Smart Water Shutoff Valves: Retrofit vs Inline Systems",
    updatedAt,
    title: "Smart Water Shutoff Valves: Retrofit and Inline Picks",
    dek: "Compare Aqara T1, YoLink X3 Bulldog, and Moen Flo by valve fit, radio path, local automation, pipe work, power, flow monitoring, and manual fallback.",
    category: "automation",
    intent: "choose an automatic water shutoff that fits the existing valve, leak-sensor system, plumbing, power, and response plan",
    intro:
      "A retrofit actuator turns an existing compatible ball valve. An inline system becomes part of the water main and can measure flow. Decide between those architectures before comparing apps or logos.",
    sections: [
      {
        heading: "Retrofit systems depend on valve health",
        body: "Aqara and YoLink avoid cutting pipe, but only when the existing quarter-turn valve moves smoothly, the handle and stem geometry fit, and the actuator has a clear sweep and stable mount.",
      },
      {
        heading: "Inline systems demand a plumbing plan",
        body: "Moen Flo adds flow, pressure, and temperature monitoring but needs an exact pipe-size model, straight-pipe space, approved power, Wi-Fi, code review, and professional installation.",
      },
      {
        heading: "Detection and closure should have separate checks",
        body: "Keep point sensors at washers, water heaters, sinks, and sumps even when an inline monitor is installed. Test the sensor, hub, local alarm, notification, actuator, manual fallback, and recovery as one supervised chain.",
      },
    ],
    decisionGuide: [
      { label: "Aqara household", detail: "Choose Valve Controller T1 when the compatible valve and Aqara hub already fit the plan." },
      { label: "Long range or outbuilding", detail: "Choose YoLink X3 Bulldog for LoRa and device-to-device pairing on a compatible ball valve." },
      { label: "Whole-home flow monitoring", detail: "Choose Moen Flo 900-001 only after a plumber confirms the 3/4-inch installation." },
      { label: "Stiff or corroded valve", detail: "Buy no actuator yet; repair or replace the valve through a qualified plumber first." },
    ],
    methodology: [
      "Separated bolt-on valve actuators from inline flow-monitoring systems",
      "Verified exact model, merchant destination, official source, and pipe-size identity",
      "Prioritized valve health, fire-system safety, manual fallback, and supervised testing",
      "Rejected a drifted YoLink Amazon ASIN and used the exact official merchant instead",
    ],
    productSlugs: ["aqara-valve-controller-t1", "yolink-x3-bulldog-valve-controller", "moen-flo-900-001-smart-water-shutoff"],
    faqs: [
      {
        question: "Can a smart actuator fit any water shutoff valve?",
        answer: "No. Handle type, pipe size, torque, stem condition, sweep, mounting clearance, environment, and system purpose all matter. Never force an actuator onto a stiff or corroded valve.",
      },
      {
        question: "Do I still need leak sensors with a smart shutoff?",
        answer: "Yes. Point sensors can detect water early at a washer, water heater, sink, sump, or appliance. The shutoff hardware is the response step, not a replacement for coverage.",
      },
      {
        question: "Can a smart valve go on a fire-sprinkler line?",
        answer: "Do not place these products where closure could disable fire suppression. Moen explicitly excludes fire-sprinkler and suppression lines; local code and a qualified professional control the final design.",
      },
      {
        question: "Will the valve still work without internet?",
        answer: "It depends on the product and automation path. Check manual control and local device-to-device or hub behavior separately from cloud alerts, then test the exact setup under supervision.",
      },
    ],
  },
  {
    site: "smarthome",
    slug: "aqara-t1-vs-yolink-bulldog-vs-moen-flo",
    seoTitle: "Aqara T1 vs YoLink Bulldog vs Moen Flo Smart Shutoff",
    updatedAt,
    title: "Aqara T1 vs YoLink Bulldog vs Moen Flo",
    dek: "Choose between Aqara's Zigbee retrofit, YoLink's long-range bolt-on system, and Moen's inline flow-monitoring shutoff without mixing their installation classes.",
    category: "automation",
    intent: "compare three automatic water shutoff architectures before buying hardware or scheduling plumbing",
    intro:
      "Aqara is the lower-cost hub retrofit, YoLink is the long-range local-pairing retrofit, and Moen Flo is the whole-home inline monitor. The right answer comes from the valve and plumbing, not the app screenshot.",
    sections: [
      {
        heading: "Aqara is the ecosystem retrofit",
        body: "It fits a compatible quarter-turn valve and makes the most sense when Aqara leak sensors and a hub already exist. Confirm valve size, handle, torque, clearance, battery, and bridge behavior.",
      },
      {
        heading: "YoLink is the range retrofit",
        body: "The X3 controller and Bulldog actuator fit a compatible ball valve while LoRa and device-to-device pairing address difficult basement or detached-space radio paths.",
      },
      {
        heading: "Moen is the plumbing and monitoring project",
        body: "Flo sits inline, monitors flow, pressure, and temperature, and can close automatically. It needs an exact pipe-size model, plumbing space, approved power, Wi-Fi, installation, and code review.",
      },
    ],
    decisionGuide: [
      { label: "Choose Aqara", detail: "You have a compatible valve and Aqara sensors or hub, and the installation is indoors and accessible." },
      { label: "Choose YoLink", detail: "Long range and local device-to-device control justify the higher retrofit cost." },
      { label: "Choose Moen", detail: "Flow monitoring and automatic whole-home protection justify professional inline work." },
      { label: "Choose none yet", detail: "The valve is unhealthy, pipe size is unknown, or a fire/shared system has not been reviewed." },
    ],
    methodology: [
      "Compared architecture, not only features",
      "Kept exact valve and pipe-size requirements visible",
      "Included hub, power, radio, local-control, and professional-installation risks",
      "Used official manufacturer documentation and exact current merchant destinations",
    ],
    productSlugs: ["aqara-valve-controller-t1", "yolink-x3-bulldog-valve-controller", "moen-flo-900-001-smart-water-shutoff"],
    faqs: [
      {
        question: "Which one is easiest to install?",
        answer: "Aqara and YoLink are bolt-on products only when the existing valve is compatible and healthy. Moen requires inline plumbing work. 'Easy' should never mean forcing a motor onto a bad valve.",
      },
      {
        question: "Which one works best with leak sensors?",
        answer: "Aqara fits Aqara automations; YoLink supports its long-range sensors and device-to-device path; Moen adds whole-home monitoring and can still benefit from point sensors. Confirm exact integrations before purchase.",
      },
      {
        question: "Which one needs an outlet?",
        answer: "Moen Flo uses an AC adapter and needs approved nearby power. Aqara T1 and YoLink X3 use batteries, though their hubs and connected ecosystem still need power.",
      },
    ],
  },
];

export const smartHomeWaterShutoffGuides: Guide[] = [
  {
    site: "smarthome",
    slug: "smart-water-shutoff-valve-fit-checklist",
    title: "Smart Water Shutoff Valve Fit Checklist",
    dek: "Check valve type, pipe size, handle sweep, torque, clearance, power, Wi-Fi, hub, fire-system boundaries, and manual access before buying an actuator or inline shutoff.",
    category: "automation",
    updatedAt,
    image: "/images/affiliate/smarthome-water-valve-retrofit-editorial-realistic.webp",
    imageAlt: "Generic smart actuator mounted over a brass water shutoff valve beside a leak sensor",
    relatedRoundups: ["best-smart-water-shutoff-valves-retrofit-inline", "aqara-t1-vs-yolink-bulldog-vs-moen-flo"],
    relatedProducts: ["aqara-valve-controller-t1", "yolink-x3-bulldog-valve-controller", "moen-flo-900-001-smart-water-shutoff"],
    relatedGuides: ["leak-sensor-to-water-shutoff-automation-guide", "water-leak-sensor-placement-guide"],
    comparisonTable: {
      title: "Retrofit or inline fit check",
      columns: ["Question", "Retrofit actuator", "Inline monitor and shutoff"],
      rows: [
        { label: "Existing valve", values: ["Must be compatible, healthy, smooth, and accessible", "Manual upstream shutoff remains necessary"] },
        { label: "Pipe work", values: ["Usually no pipe cutting", "Pipe cutting, unions, size, code, and testing"] },
        { label: "Power", values: ["Often battery at actuator; hub still powered", "Approved nearby outlet and cord route"] },
        { label: "Monitoring", values: ["Needs point sensors or another trigger", "Can add flow, pressure, and temperature"] },
        { label: "Professional review", values: ["Needed for unhealthy or uncertain valves", "Expected for inline installation"] },
      ],
    },
    sources: [
      {
        name: "Aqara Valve Controller T1",
        url: "https://us.aqara.com/products/aqara-valve-controller-t1",
        note: "Example retrofit valve-size, handle, torque, battery, and environment requirements.",
      },
      {
        name: "Moen Flo installation guidance",
        url: "https://solutions.moen.com/Smart_Water_Security_Products/Help_Center/Setup/Installing_the_Moen_Flo_Shutoff",
        note: "Example inline location and fire/hot-water exclusions.",
      },
    ],
    sections: [
      {
        heading: "1. Identify the system before touching the valve",
        body: "Find the main water shutoff, pipe material, pipe size, pressure regulator, irrigation branches, shared-building plumbing, well equipment, and any fire-suppression branch. Stop and use a qualified plumber when the layout is uncertain.",
      },
      {
        heading: "2. Inspect the existing valve",
        body: "Record whether it is a lever ball valve, butterfly valve, gate valve, or another design. Look for corrosion, leakage, bent handles, packing damage, stiffness, wall contact, and incomplete 90-degree travel. Do not use a motor to overcome a valve that needs repair.",
      },
      {
        heading: "3. Measure the actuator envelope",
        body: "Photograph and measure the pipe diameter, handle length, stem area, full handle sweep, wall gap, adjacent pipes, insulation, shelves, and service access. Leave room to remove batteries, clamps, and the actuator later.",
      },
      {
        heading: "4. Treat inline products as plumbing projects",
        body: "Confirm the exact model for the measured pipe size, straight-pipe length, unions, flow direction, pressure range, grounding, sediment conditions, approved power, Wi-Fi, drainage risk, local code, and installer responsibility before ordering.",
      },
      {
        heading: "5. Protect fire suppression and shared systems",
        body: "A consumer smart shutoff must not disable a fire-sprinkler or suppression line. Shared dwellings, irrigation branches, well systems, recirculation, and complex service layouts require professional and code review before any closure automation is enabled.",
      },
      {
        heading: "6. Preserve manual access",
        body: "The household needs a visible, reachable manual shutoff even when automation works. Label it, keep the route clear, and document how to override the system during battery, hub, power, network, app, or actuator failure.",
      },
    ],
  },
  {
    site: "smarthome",
    slug: "leak-sensor-to-water-shutoff-automation-guide",
    title: "Leak Sensor to Automatic Water Shutoff: Build a Safer Response Chain",
    dek: "Connect point detection, a local alarm, household notifications, a compatible valve, supervised closure, manual fallback, and recovery without trusting one cloud rule.",
    category: "automation",
    updatedAt,
    image: "/images/affiliate/smarthome-water-valve-inline-editorial-realistic.webp",
    imageAlt: "Professional check of an inline smart water shutoff installed after a manual valve",
    relatedRoundups: ["best-water-leak-sensors-for-sinks-water-heaters", "best-smart-water-shutoff-valves-retrofit-inline"],
    relatedProducts: [
      "aqara-water-leak-sensor-3-pack-hub-kit",
      "yolink-lora-water-alarm-bundle",
      "aqara-valve-controller-t1",
      "yolink-x3-bulldog-valve-controller",
      "moen-flo-900-001-smart-water-shutoff",
    ],
    relatedGuides: ["water-leak-sensor-placement-guide", "wifi-vs-zigbee-vs-lora-water-leak-sensor-guide", "smart-water-shutoff-valve-fit-checklist"],
    comparisonTable: {
      title: "Every layer in the response chain",
      columns: ["Layer", "Primary job", "Failure to test"],
      rows: [
        { label: "Point sensor", values: ["Detect water where it first appears", "Leak flows around or never reaches sensor"] },
        { label: "Local alarm", values: ["Wake or alert someone nearby", "Phone-only alert is missed"] },
        { label: "Notification", values: ["Reach household away from home", "Permissions, account, or internet fails"] },
        { label: "Valve action", values: ["Stop the compatible water path", "Motor stalls or closes wrong line"] },
        { label: "Manual recovery", values: ["Inspect, repair, reopen safely", "Water returns before cause is fixed"] },
      ],
    },
    sources: [
      {
        name: "YoLink X3 Bulldog product page",
        url: "https://shop.yosmart.com/products/ys5001-bdog",
        note: "Example device-to-device leak protection and long-range valve-control path.",
      },
      {
        name: "Moen Flo specification sheet",
        url: "https://assets.moen.com/shared/docs/product-specifications/900-001sp.pdf",
        note: "Example automatic, remote, and manual closure plus whole-home monitoring.",
      },
    ],
    sections: [
      {
        heading: "1. Place sensors where water appears first",
        body: "Cover water heaters, washers, sump areas, dishwashers, refrigerator lines, toilets, sink cabinets, and HVAC condensate according to the home's risk. A single sensor beside the main valve cannot detect every leak early.",
      },
      {
        heading: "2. Keep a local alarm",
        body: "A hub, siren, or sensor alarm should make the problem obvious to someone at home even if phone permissions, Wi-Fi, the router, or a cloud service fails. Name every sensor by location.",
      },
      {
        heading: "3. Add the narrowest safe closure rule",
        body: "Use only verified leak sensors to command the main valve, include household notifications, and avoid unrelated humidity or flaky contact signals. For a new system, test notification-only behavior before enabling automatic closure.",
      },
      {
        heading: "4. Test local and cloud paths separately",
        body: "Verify sensor-to-hub, hub-to-actuator, device-to-device control if supported, app push, email or SMS, household sharing, battery alerts, internet loss, hub power loss, and manual button operation. One successful app tap does not validate the chain.",
      },
      {
        heading: "5. Use a supervised wet test",
        body: "Follow the sensor maker's safe test method while someone stands at the valve. Confirm detection, alarm, notification, full closure, app state, and manual access. Never create uncontrolled water flow just to prove automation.",
      },
      {
        heading: "6. Reopen only after inspection",
        body: "A closed valve is evidence, not a repair. Find the water source, inspect for damage, involve a plumber or appliance professional when needed, then reopen slowly while watching the affected area.",
      },
      {
        heading: "7. Schedule maintenance",
        body: "Test sensors, notifications, battery status, actuator motion, manual shutoff access, and household instructions on a recurring schedule and after hub, router, app, firmware, plumbing, or valve changes.",
      },
    ],
  },
];
