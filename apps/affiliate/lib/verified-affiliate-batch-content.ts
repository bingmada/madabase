import type { Guide, Product, Roundup } from "./types";

const updatedAt = "July 2, 2026";

export const verifiedAffiliateBatchProducts: Product[] = [
  {
    site: "pet",
    slug: "petlibro-one-rfid-smart-feeder",
    asin: "B0FJMFYPNH",
    seoTitle:
      "PETLIBRO One RFID Feeder Review: Collar Tag, Portions & Multi-Cat Fit",
    updatedAt: "July 28, 2026",
    evidenceMode: "official-spec",
    researchNote:
      "We have not tested this feeder ourselves. This guide uses PETLIBRO's current PLAF301 product page, support material, cleaning instructions, portion guidance, and manual; the exact Amazon color, pack quantity, included tag and reader mat, and seller still require a checkout check.",
    name: "PETLIBRO One RFID Smart Feeder",
    brand: "PETLIBRO",
    category: "feeding",
    image: "/images/affiliate/pet-smart-feeder-realistic.webp",
    summary:
      "A model-specific guide to PETLIBRO's PLAF301 access-controlled feeder, including its dedicated collar tag, one-tag limit, dry-food range, meal schedules, reader mat, Wi-Fi, and backup-power behavior.",
    verdict:
      "The One RFID is the stronger PETLIBRO choice when one pet steals another pet's dry food or needs a separate diet. The less expensive Granary is easier to justify when scheduled portions—not access control—are the real problem.",
    whyItMatters:
      "This feeder recognizes PETLIBRO's dedicated collar tag rather than an implanted microchip. Each feeder binds to one tag, so a multi-pet plan may require one unit per protected pet and enough floor space to separate the readers.",
    bestFor:
      "Protecting one pet's scheduled dry-food meals in a multi-pet home",
    priceBand: "$$",
    rating: 4.2,
    scores: [
      { label: "Access control", value: 9 },
      { label: "Schedule control", value: 8 },
      { label: "Cleaning simplicity", value: 6 },
    ],
    pros: [
      "Dedicated RFID collar tag controls access to the covered bowl",
      "Up to ten scheduled meals or snacks with feeding logs",
      "Supports 2.4GHz and 5GHz Wi-Fi with emergency battery backup",
    ],
    cons: [
      "It does not read implanted microchips or third-party tags",
      "One feeder binds to one collar tag, which raises multi-pet cost",
      "Dry food only; the reader mat and moving lid add cleaning and placement work",
    ],
    specs: {
      ASIN: "B0FJMFYPNH",
      "Official model family": "PLAF301 One RFID Smart Feeder",
      Capacity: "3L / about 13 cups",
      "Pet recognition":
        "Dedicated PETLIBRO RFID collar tag; not an implanted microchip",
      Meals: "Up to 10 scheduled meals or snacks per day",
      Kibble: "Dry food, 2–15mm",
      Portions:
        "Approximately 20mL per portion by volume; no fixed gram value",
      Network: "2.4GHz and 5GHz Wi-Fi",
      Power: "Corded; 3 alkaline D batteries for emergency backup",
      Dimensions: "442 x 196 x 320mm",
      "Collar tag":
        "23 x 23 x 14.18mm; 4.2g; splashproof, not submersible",
      "Identifier limit":
        "One feeder binds to one dedicated PETLIBRO collar tag; implanted microchips and third-party tags are unsupported",
      "Reader requirement":
        "The PETLIBRO RFID reader mat is required for recognition",
    },
    evidence: [
      "Confirm ASIN B0FJMFYPNH, color, pack quantity, seller, and included collar tag",
      "Use it only with the dedicated tag and reader mat; PETLIBRO says other tags and implanted microchips are unsupported",
      "Allow room for the mat and lid, and separate multiple units according to PETLIBRO's placement guidance",
      "Weigh several real portions with the exact kibble instead of treating a volume setting as a fixed calorie amount",
    ],
    editorialSections: [
      {
        heading: "One tag per feeder is the central limitation",
        body: "The One RFID does not identify every pet in the house and route several diets through one bowl. PETLIBRO says one feeder syncs with one dedicated collar tag. In a two-pet home, that can still protect one prescription or weight-control diet, but protecting two separate diets may require two feeders.",
      },
      {
        heading: "It is RFID, but not a microchip feeder",
        body: "The included reader mat detects PETLIBRO's collar tag and opens the lid for the bound pet. Buyers specifically searching for an implanted-microchip feeder should not treat the word RFID as proof of microchip compatibility.",
      },
      {
        heading: "Battery power is a backup mode",
        body: "PETLIBRO lists three D batteries as emergency backup. Scheduled meals can continue, while Wi-Fi and some controls are disabled to preserve power. Test the saved schedule before relying on the feeder during an outage or trip.",
      },
      {
        heading: "Who should skip it",
        body: "Skip it for wet food, implanted-microchip access, very large pets, or a household that only needs timed portions. A conventional automatic feeder costs less and has fewer moving access-control parts.",
      },
    ],
    alternatives: [
      "Choose PETLIBRO Granary when timed dry-food portions are enough.",
      "Choose an implanted-microchip feeder when a collar tag is unsuitable.",
      "Use supervised feeding when a pet may chew, lose, or resist the tag.",
    ],
    compareSlugs: ["petlibro-granary-automatic-cat-feeder"],
    sources: [
      {
        name: "PETLIBRO One RFID Smart Feeder",
        url: "https://petlibro.com/products/one-rfid-pet-feeder",
        note: "Official model, tag, schedule, capacity, kibble, power, network, placement, and box-content information.",
      },
      {
        name: "PETLIBRO One RFID PLAF301 support",
        url: "https://petlibro.com/pages/how-the-one-rfid-pet-feeder-works-plaf301",
        note: "Exact tag, reader, placement, food, power, network, and battery-mode limitations.",
      },
      {
        name: "PETLIBRO One RFID PLAF301 cleaning",
        url: "https://petlibro.com/pages/how-do-i-disassemble-and-clean-the-one-rfid-pet-feeder-af301-plaf301",
        note: "Exact powered-base, collar-tag, RFID-reader, drying, and reassembly restrictions.",
      },
      {
        name: "PETLIBRO One RFID PLAF301 user manual",
        url: "https://cdn.shopify.com/s/files/1/0252/5197/1119/files/Petlibro-AF301-3L-_US_DE_IT_FR_ES.pdf?v=1774007057",
        note: "Current official multilingual PLAF301 operating manual.",
      },
      {
        name: "PETLIBRO portion-size guidance",
        url: "https://petlibro.com/pages/how-much-is-in-one-feeding-portion-plaf001-002-101-102-plaf003-004-plaf005-006-103-203-plaf008-plaf107-plaf108-plaf301",
        note: "Official explanation that PLAF301 portions are approximately 20mL by volume and do not have a fixed gram weight.",
      },
    ],
    offers: [
      {
        merchant: "Amazon US",
        url: "https://amzn.to/4aywtHU",
        label: "Check PETLIBRO One RFID price on Amazon",
        priceNote:
          "Confirm ASIN B0FJMFYPNH, PLAF301, pack quantity, color, seller, and inclusion of the dedicated collar tag and RFID reader mat.",
      },
    ],
  },
  {
    site: "homeoffice",
    slug: "ergear-48x24-electric-standing-desk",
    asin: "B0B6JJKSNM",
    seoTitle:
      "ErGear 48×24 Electric Standing Desk Review: Is It Good for Small Spaces?",
    updatedAt: "July 11, 2026",
    name: "ErGear 48×24 Electric Standing Desk with Wheels",
    brand: "ErGear",
    category: "desks",
    image: "/images/affiliate/homeoffice-ergear-48x24-standing-desk-realistic.webp",
    summary:
      "A buyer-focused review of ErGear's 48-by-24-inch electric standing desk with wheels, covering small-room fit, monitor distance, seated height, wheel stability, cable travel, and the exact listing configuration.",
    verdict:
      "This ErGear is worth comparing when a compact desk must move between rooms or clear a shared space. A fixed-foot desk is the safer choice when maximum stability, a heavy monitor arm, or a one-piece top matters more than mobility.",
    whyItMatters:
      "Casters solve a real layout problem but raise the work surface and create another movement point. The useful question is not whether the desk rolls; it is whether the locked desk remains stable at the user's standing height with the complete monitor and cable setup.",
    bestFor: "A compact sit-stand workstation that occasionally needs to move",
    priceBand: "$$",
    rating: 4.2,
    scores: [
      { label: "Small-room fit", value: 8 },
      { label: "Mobility", value: 9 },
      { label: "Heavy-monitor stability", value: 6 },
    ],
    pros: [
      "48×24-inch footprint fits many bedrooms and shared rooms",
      "Included wheels support occasional workstation movement",
      "Memory controls reduce daily sit-to-stand adjustment friction",
    ],
    cons: [
      "A split desktop has seams and more assembly alignment",
      "Wheels can increase height and movement compared with fixed feet",
      "The live listing must be checked for current height range, capacity, warranty, and exact top",
    ],
    specs: {
      ASIN: "B0B6JJKSNM",
      Desktop: "48 × 24 inches; split-board construction in the linked listing",
      Base: "Electric sit-stand frame",
      Controls: "Memory controller listed",
      Mobility: "Casters / wheels listed",
      "Before buying":
        "Confirm height range, load rating, top finish, warranty, and included hardware",
    },
    evidence: [
      "Measure the room path, chair pullout, closet and door clearance, not only the desktop footprint",
      "Confirm the lowest usable keyboard height after installing the casters",
      "Check the underside frame and seam before choosing a monitor-arm clamp position",
      "Keep power and display cables clear through the full height and rolling range",
    ],
    editorialSections: [
      {
        heading: "The wheels change desk height and stability",
        body: "Casters can make a shared room more flexible, but they add height and another mechanical connection below the frame. Confirm the desk can still reach a neutral seated keyboard height and test all wheel locks before loading the desktop.",
      },
      {
        heading: "Twenty-four inches of depth needs a screen plan",
        body: "A stock monitor stand can consume much of a 24-inch-deep top. A compatible arm may recover space, but the split top, underside frame, clamp clearance, monitor weight, and desk movement all need checking together.",
      },
      {
        heading: "Treat the Amazon listing as the configuration source",
        body: "ErGear sells closely related sizes, colors, frames, and tops. This guide is tied to ASIN B0B6JJKSNM and the 48×24 listing with wheels; confirm every live dimension, capacity, seller, and warranty term before checkout.",
      },
      {
        heading: "Who should skip it",
        body: "Skip it when the workstation supports a very heavy display, must feel immovable while typing, or needs a seamless one-piece work surface. Fixed feet and a stiffer frame are usually a better foundation for those priorities.",
      },
    ],
    alternatives: [
      "Choose FlexiSpot E7 Mini when frame stiffness and a more permanent setup matter more than wheels.",
      "Choose a fixed-height desk when standing adjustment would rarely be used.",
      "Use a mobile laptop cart when the entire desktop does not need to travel.",
    ],
    compareSlugs: [
      "flexispot-e7-mini-standing-desk",
      "uplift-v3-standing-desk",
    ],
    sources: [
      {
        name: "Amazon listing for ASIN B0B6JJKSNM",
        url: "https://www.amazon.com/dp/B0B6JJKSNM",
        note: "Exact linked configuration title and current retailer details; verify live specifications and seller before purchase.",
      },
      {
        name: "OSHA computer workstation positions",
        url: "https://www.osha.gov/etools/computer-workstations/positions",
        note: "Primary neutral-position and workstation-adjustment guidance.",
      },
    ],
    offers: [
      {
        merchant: "Amazon US",
        url: "https://amzn.to/4awNXo4",
        label: "Check ErGear 48×24 desk price on Amazon",
        priceNote:
          "Confirm ASIN B0B6JJKSNM, 48×24 size, wheels, finish, height range, capacity, seller, and warranty.",
      },
    ],
  },
  {
    site: "baby",
    slug: "baby-tula-lite-carrier",
    asin: "B09X8R4PZH",
    seoTitle:
      "Tula Lite Carrier Review: 12–30 lb Fit, Travel Pouch & Carry Limits",
    updatedAt,
    name: "Baby Tula Lite Carrier",
    brand: "Baby Tula",
    category: "travel",
    image: "/images/affiliate/baby-carrier-realistic.webp",
    summary:
      "A safety-first guide to the packable ripstop Tula Lite, including its 12–30 lb range, inward-front and back carry positions, attached storage pouch, hood, fit checks, and newborn and outward-facing limits.",
    verdict:
      "Tula Lite is best treated as a compact travel or backup carrier for a baby who already meets its size and fit requirements. It is not a newborn carrier and not the right Tula for outward-facing carry.",
    whyItMatters:
      "The packable pouch is useful only after the child fits the carrier safely. Baby Tula lists a 12–30 lb range and says the child must sit supported knee to knee without being overextended.",
    bestFor: "Packable inward-front and back carrying after the newborn stage",
    priceBand: "$$",
    rating: 4.6,
    scores: [
      { label: "Packability", value: 10 },
      { label: "Warm-weather travel", value: 8 },
      { label: "Newborn use", value: 2 },
    ],
    pros: [
      "Packs into its attached waistband while leaving a hip pouch available",
      "Quick-drying ripstop fabric and approximately one-pound carrier weight",
      "Supports inward-front and age-appropriate back carrying",
    ],
    cons: [
      "Not designed for newborns and starts at 12 lb with additional fit requirements",
      "No outward-facing carry position",
      "Lighter travel structure may be less supportive for long carries than an all-stage carrier",
    ],
    specs: {
      ASIN: "B09X8R4PZH",
      "Listed child range": "12–30 lb",
      Positions: "Front inward and back carry; no outward-facing carry",
      Material: "Quick-drying ripstop nylon",
      Storage: "Packs into attached waistband with zippered hip pouch",
      Weight: "About 1 lb",
      Hood: "Detachable sleep / sun hood included",
    },
    evidence: [
      "Confirm the child meets weight, developmental, and knee-to-knee fit guidance before first use",
      "Use front inward carry until the current manual permits back carry",
      "Keep the airway visible and the baby's face clear of fabric in every position",
      "Confirm ASIN B09X8R4PZH, Slate color, seller, and the current manual",
    ],
    editorialSections: [
      {
        heading: "This is not a newborn carrier",
        body: "Baby Tula says the Lite begins at 12 lb and requires a supported knee-to-knee seat without overextension. A baby's age or weight alone does not replace the complete fit check.",
      },
      {
        heading: "Packability is the reason to buy it",
        body: "The ripstop carrier folds into the attached waistband and keeps a front pouch available for small essentials. That makes it attractive for airports, short errands, and the stage when a child alternates between walking and being carried.",
      },
      {
        heading: "Carry positions are intentionally limited",
        body: "Tula Lite supports inward-front and back carry, not outward-facing carry. Buyers wanting an outward position or a longer all-stage range should compare Tula Explore or another model whose current manual permits those uses.",
      },
      {
        heading: "Who should skip it",
        body: "Skip it for a newborn, a child above the listed range, outward-facing carry, or long sessions where a more structured waistband and panel fit the caregiver better.",
      },
    ],
    alternatives: [
      "Choose BabyBjörn Mini for a newborn-focused front-carry workflow.",
      "Choose Ergobaby Omni Breeze for a broader listed range and more positions.",
      "Choose BabyBjörn Harmony when longer-range support matters more than packability.",
    ],
    compareSlugs: [
      "babybjorn-carrier-mini-3d-mesh",
      "ergobaby-omni-breeze-carrier",
      "babybjorn-carrier-harmony",
    ],
    sources: [
      {
        name: "Baby Tula Lite product page",
        url: "https://babytula.com/products/slate-tula-lite-baby-carrier",
        note: "Official range, positions, material, storage, measurements, hood, fit, and care information.",
      },
      {
        name: "Baby Tula Lite carrier overview",
        url: "https://babytula.com/pages/tula-lite-baby-carrier",
        note: "Official travel and packability positioning.",
      },
    ],
    offers: [
      {
        merchant: "Amazon US",
        url: "https://amzn.to/4vGnH2S",
        label: "Check Tula Lite price on Amazon",
        priceNote:
          "Confirm ASIN B09X8R4PZH, Slate color, seller, child fit, and current instructions.",
      },
    ],
  },
  {
    site: "network",
    slug: "trendnet-teg-s380-2-5g-switch",
    asin: "B08XWKF55C",
    seoTitle:
      "TRENDnet TEG-S380 Review: 8-Port 2.5G Switch, Versions & Bottlenecks",
    updatedAt,
    name: "TRENDnet TEG-S380 8-Port 2.5G Switch",
    brand: "TRENDnet",
    category: "wired",
    image: "/images/affiliate/network-ethernet-switch-realistic.webp",
    summary:
      "A version-aware guide to TRENDnet's unmanaged eight-port 2.5GbE switch, including fanless operation, Cat5e-or-better cabling, its 40Gbps official switching specification, and the hardware-version check the Amazon title does not make obvious.",
    verdict:
      "TEG-S380 is a practical step up when several desktops, access points, or NAS devices already support 2.5GbE. A gigabit switch remains the better value when only one device—or only the internet plan—can exceed 1Gbps.",
    whyItMatters:
      "A 2.5G switch does not make a gigabit router, adapter, NAS, or client faster. Every segment of the path must negotiate above gigabit, and local file transfers should be evaluated separately from internet speed.",
    bestFor: "Quiet eight-port 2.5GbE expansion for a multi-gig home network",
    priceBand: "$$",
    rating: 4.6,
    scores: [
      { label: "Multi-gig port count", value: 9 },
      { label: "Setup simplicity", value: 9 },
      { label: "Management features", value: 3 },
    ],
    pros: [
      "Eight 2.5GBASE-T ports with backward compatibility",
      "Fanless metal enclosure suits desks and network shelves",
      "Unmanaged operation requires no VLAN or switch configuration",
    ],
    cons: [
      "No managed VLAN, link-aggregation, or monitoring controls",
      "No 10GbE or SFP+ uplink",
      "TRENDnet has multiple hardware versions, so the live listing and support page must match",
    ],
    specs: {
      ASIN: "B08XWKF55C",
      Ports: "8 × 2.5GBASE-T RJ-45",
      Compatibility: "Backward compatible with slower Ethernet devices",
      "Official switching capacity":
        "40Gbps; verify the exact hardware version",
      Cooling: "Fanless",
      Enclosure: "Metal; wall-mountable",
      Cabling: "Cat5e or better for supported 2.5GbE paths",
    },
    evidence: [
      "Confirm ASIN B08XWKF55C and the TEG-S380 hardware version before using a version-specific datasheet",
      "Verify 2.5GbE support on the router, adapters, NAS, and clients at both ends of every important path",
      "Treat the official 40Gbps specification as the version-controlled source; the Amazon title may show a different aggregate figure",
      "Choose a managed switch instead if VLANs, traffic visibility, or link aggregation are required",
    ],
    editorialSections: [
      {
        heading: "Hardware version is not a footnote",
        body: "TRENDnet's support site distinguishes versions and marks older revisions as replaced by V2. Confirm the label on the retailer listing or delivered switch before downloading firmware, a datasheet, or a setup guide.",
      },
      {
        heading: "Eight 2.5G ports are useful only with a real path",
        body: "A 2.5GbE desktop talking to a 2.5GbE NAS can benefit even when the internet is slower. A 2.5Gbps internet plan also needs a compatible modem, router WAN/LAN path, client adapter, and cabling.",
      },
      {
        heading: "Unmanaged is a feature and a limitation",
        body: "Plug-and-play operation is ideal for a simple home network. It is the wrong fit when the design requires VLAN separation, per-port statistics, spanning-tree controls, or deliberate link aggregation.",
      },
      {
        heading: "Who should skip it",
        body: "Skip it when the entire network is gigabit, a five-port switch is enough, or the next planned upgrade is 10GbE. Buying unused port speed does not improve reliability.",
      },
    ],
    alternatives: [
      "Choose TP-Link TL-SG108 for inexpensive unmanaged gigabit expansion.",
      "Choose NETGEAR GS308E when light management matters more than 2.5GbE.",
      "Choose a 10GbE or SFP+ switch when the NAS backbone already exceeds 2.5GbE.",
    ],
    compareSlugs: [
      "tp-link-tl-sg105-m2-2-5g-switch",
      "netgear-ms305-2-5g-switch",
      "trendnet-teg-s350-2-5g-switch",
    ],
    sources: [
      {
        name: "TRENDnet TEG-S380 support",
        url: "https://www.trendnet.com/support/support-detail.asp?prod=110_TEG-S380",
        note: "Official version selector, ports, switching capacity, fanless design, cabling, and datasheets.",
      },
      {
        name: "Amazon listing for ASIN B08XWKF55C",
        url: "https://www.amazon.com/dp/B08XWKF55C",
        note: "Exact linked offer; confirm hardware version and seller against the TRENDnet label.",
      },
    ],
    offers: [
      {
        merchant: "Amazon US",
        url: "https://amzn.to/4bjASyA",
        label: "Check TEG-S380 price on Amazon",
        priceNote:
          "Confirm ASIN B08XWKF55C, eight-port model, hardware version, seller, and warranty.",
      },
    ],
  },
  {
    site: "smarthome",
    slug: "ultraloq-bolt-se-smart-lock",
    asin: "B0FQC6VCDW",
    seoTitle:
      "ULTRALOQ Bolt SE Review: Matter vs Wi-Fi Variant, Fingerprint & Door Fit",
    updatedAt,
    name: "ULTRALOQ Bolt SE Smart Lock",
    brand: "ULTRALOQ",
    category: "access",
    image: "/images/affiliate/smarthome-smart-lock-realistic.webp",
    summary:
      "A variant-aware guide to the Bolt SE fingerprint deadbolt, covering Matter over Thread versus Wi-Fi connectivity, controller requirements, entry methods, battery routine, weather rating, door measurements, and physical-key fallback.",
    verdict:
      "Bolt SE is a strong value option when fingerprint and keypad entry are the daily priority. Choose the exact Matter or Wi-Fi version around the household's controller infrastructure rather than assuming every listing combines both connection paths.",
    whyItMatters:
      "ULTRALOQ's official page presents Matter and Wi-Fi as technology variants. The Amazon title can be read more broadly, so buyers should verify the selected version, controller needs, and ecosystem behavior before ordering.",
    bestFor:
      "Fingerprint and keypad entry with a deliberately chosen Matter or Wi-Fi path",
    priceBand: "$$",
    rating: 4.3,
    scores: [
      { label: "Entry flexibility", value: 9 },
      { label: "Value", value: 9 },
      { label: "Variant clarity", value: 6 },
    ],
    pros: [
      "Fingerprint, keypad, app, auto-unlock, and physical-key entry",
      "Matter option supports major compatible smart-home platforms",
      "Standard deadbolt format with no new wiring",
    ],
    cons: [
      "Matter over Thread requires a compatible controller and Thread border router",
      "The exact Wi-Fi versus Matter version must be confirmed",
      "Door preparation, thickness, backset, alignment, and exterior exposure still control fit",
    ],
    specs: {
      ASIN: "B0FQC6VCDW",
      "Hardware type": "Replacement deadbolt",
      "Entry methods":
        "Fingerprint, PIN code, app, auto-unlock, and physical key",
      Connectivity:
        "Confirm Matter over Thread or Wi-Fi variant on the selected offer",
      Ecosystems:
        "Apple Home, Alexa, Google Home, and SmartThings listed for compatible Matter models",
      Weather:
        "Exterior assembly listed with weather protection; interior assembly remains indoors",
      Power:
        "Replaceable batteries; life varies with technology, battery type, signal, and use",
    },
    evidence: [
      "Confirm ASIN B0FQC6VCDW and the selected Matter or Wi-Fi technology before checkout",
      "For Matter over Thread, identify the household's compatible Matter controller and Thread border router",
      "Measure door thickness, bore holes, backset, trim clearance, and deadbolt movement",
      "Keep the physical key available outside the locked home and test every fallback method",
    ],
    editorialSections: [
      {
        heading: "Matter and Wi-Fi should be treated as variants",
        body: "ULTRALOQ's current product page asks buyers to choose a technology. Matter over Thread emphasizes local ecosystem control and needs compatible infrastructure; a Wi-Fi version follows a different remote-access path. Confirm the exact Amazon selection rather than relying on the combined wording of a long marketplace title.",
      },
      {
        heading: "Fingerprint is the everyday reason to buy",
        body: "Matter compatibility is useful, but the lock earns its keep through reliable daily entry. Enroll more than one fingerprint per frequent user, create a memorable keypad fallback, and retain the mechanical key.",
      },
      {
        heading: "Door alignment affects smart-lock reliability",
        body: "The deadbolt should extend without pushing or pulling the door. A motorized lock cannot permanently correct a tight strike plate, seasonal swelling, or an incompatible bore and backset.",
      },
      {
        heading: "Who should skip it",
        body: "Skip it when the door is not a compatible US-style deadbolt, household members cannot maintain a dependable fallback, or no one wants to manage batteries, firmware, accounts, and controller compatibility.",
      },
    ],
    alternatives: [
      "Choose Aqara U400 when UWB approach unlocking is the defining requirement.",
      "Choose Aqara U100 when Apple Home Key and an Aqara hub fit the household.",
      "Choose a non-connected keypad lock when remote control and ecosystem integration add no value.",
    ],
    compareSlugs: ["aqara-smart-lock-u400", "aqara-smart-lock-u100"],
    sources: [
      {
        name: "ULTRALOQ Bolt SE product page",
        url: "https://ultraloq.com/products/bolt-se",
        note: "Official variants, entry methods, Matter requirements, ecosystems, weather, battery, and installation information.",
      },
      {
        name: "ULTRALOQ Matter multi-platform support",
        url: "https://support.ultraloq.com/hc/en-us/articles/47696415238041-Can-the-ULTRALOQ-Bolt-Fingerprint-Matter-Lock-be-added-to-Matter-compatible-platforms-after-being-added-to-Xthings-Home-Formerly-U-home-App-already",
        note: "Official Matter sharing and Thread border-router requirements.",
      },
    ],
    offers: [
      {
        merchant: "Amazon US",
        url: "https://amzn.to/4wm0kM6",
        label: "Check ULTRALOQ Bolt SE price on Amazon",
        priceNote:
          "Confirm ASIN B0FQC6VCDW, Matter or Wi-Fi technology, finish, seller, and included hardware.",
      },
    ],
  },
];

export const verifiedAffiliateBatchRoundups: Roundup[] = [
  {
    site: "pet",
    slug: "petlibro-one-rfid-vs-granary-smart-feeder",
    updatedAt: "July 28, 2026",
    title: "PETLIBRO One RFID vs Granary: Access Control or Simple Scheduling?",
    dek: "Compare dedicated-tag meal protection with a conventional Wi-Fi feeder by pet conflict, portions, footprint, cleaning, backup power, and cost.",
    category: "feeding",
    intent:
      "choosing between access-controlled and schedule-only dry-food feeding",
    intro:
      "The One RFID and Granary can both schedule dry-food meals, but they solve different problems. One RFID adds a covered bowl and dedicated collar-tag access; Granary is the simpler choice when every pet can share the same feeding routine.",
    sections: [
      {
        heading: "Choose One RFID for food stealing",
        body: "The dedicated tag can protect one pet's meals from another animal. Remember that one feeder binds to one supported tag and does not read an implanted microchip.",
      },
      {
        heading: "Choose Granary for routine timing",
        body: "Granary removes the access-control mat and moving bowl lid. That simpler path is easier to justify when the problem is breakfast timing rather than diet separation.",
      },
      {
        heading: "Both require measured portions and human checks",
        body: "Kibble density changes the grams delivered by a volume setting. Test repeated portions and continue checking the bowl, hopper, pet, and backup plan.",
      },
    ],
    decisionGuide: [
      {
        label: "Buy One RFID",
        detail:
          "One pet steals food or needs a protected dry-food diet and can wear the dedicated tag.",
      },
      {
        label: "Buy Granary",
        detail:
          "Timed portions and app control solve the problem without access control.",
      },
      {
        label: "Choose neither",
        detail:
          "The household needs wet food, implanted-microchip access, or medically supervised feeding.",
      },
    ],
    methodology: [
      "Compared official PETLIBRO model, tag, food, schedule, and power information",
      "Separated meal scheduling from pet-identification features",
      "Included floor-space, cleaning, and multi-feeder costs",
    ],
    productSlugs: [
      "petlibro-one-rfid-smart-feeder",
      "petlibro-granary-automatic-cat-feeder",
    ],
    faqs: [
      {
        question: "Does PETLIBRO One RFID read a cat's implanted microchip?",
        answer:
          "No. PETLIBRO says it works with the dedicated collar tag and not implanted microchips or third-party tags.",
      },
      {
        question: "Can several cats use one One RFID feeder?",
        answer:
          "The feeder binds to one supported tag. It is designed to protect the bound pet's access rather than recognize several independent tags.",
      },
    ],
  },
  {
    site: "homeoffice",
    slug: "ergear-48x24-vs-flexispot-e7-mini",
    updatedAt: "August 31, 2026",
    title: "ErGear 48×24 vs FlexiSpot E7 Mini: Which Is Better?",
    dek: "Choose ErGear for mobility and casters, or FlexiSpot E7 Mini for a fixed, heavier monitor setup. Compare 48×24 space, stability, height, clamp fit, and room clearance.",
    category: "desks",
    intent: "choosing a compact standing desk for a bedroom or shared room",
    intro:
      "Choose ErGear when mobility and casters matter; choose FlexiSpot E7 Mini for a fixed workstation with a heavier monitor setup. Measure the complete setup before deciding that mobility or frame strength is automatically more useful.",
    sections: [
      {
        heading: "ErGear is the mobility option",
        body: "Choose it when the desk must clear a guest room, change walls, or move for cleaning. Confirm that the casters do not make seated keyboard height too high.",
      },
      {
        heading: "FlexiSpot is the stronger fixed-workstation direction",
        body: "A more permanent base makes more sense for a heavy monitor arm or a setup that never needs to roll. Match the exact frame and top rather than comparing only brand names.",
      },
      {
        heading: "Desktop depth controls screen comfort",
        body: "At 24 inches deep, monitor stands, laptops, and speakers compete for viewing distance. Plan the screen and clamp position before choosing accessories.",
      },
    ],
    decisionGuide: [
      {
        label: "Buy ErGear",
        detail:
          "The workstation needs to move and the linked 48×24 configuration fits the room.",
      },
      {
        label: "Buy FlexiSpot",
        detail: "Frame stiffness and a more permanent monitor setup lead.",
      },
      {
        label: "Pause",
        detail:
          "Neither desk's confirmed height range reaches both users' seated and standing elbow height.",
      },
    ],
    methodology: [
      "Compared room footprint and movement before feature count",
      "Included casters, split-top, clamp, and cable effects",
      "Kept live configuration checks visible because both brands sell several variants",
    ],
    productSlugs: [
      "ergear-48x24-electric-standing-desk",
      "flexispot-e7-mini-standing-desk",
    ],
    faqs: [
      {
        question: "Are wheels useful on a standing desk?",
        answer:
          "Yes when the desk genuinely moves. They can also raise the minimum height and introduce movement, so locked stability and seated fit need testing.",
      },
      {
        question: "Is a 48×24 desk deep enough?",
        answer:
          "It can be, especially with one well-placed monitor. Measure viewing distance, monitor stand or arm, keyboard, laptop, and underside frame together.",
      },
    ],
  },
  {
    site: "smarthome",
    slug: "ultraloq-bolt-se-vs-aqara-u400",
    title: "ULTRALOQ Bolt SE vs Aqara U400: Fingerprint Value or UWB Entry?",
    dek: "Compare daily entry, Matter over Thread, UWB, fingerprint, controllers, batteries, door fit, fallbacks, and the price premium.",
    category: "access",
    intent:
      "choosing a Matter-capable smart deadbolt around a real entry routine",
    intro:
      "Bolt SE is the value-first fingerprint and keypad lock. Aqara U400 earns its premium only when compatible household devices can use its UWB approach-unlock workflow and the controller plan is already understood.",
    sections: [
      {
        heading: "Bolt SE leads on simple value",
        body: "Fingerprint and keypad access cover most daily entries. Confirm the exact Matter or Wi-Fi variant and required controller path before treating a low price as a complete system.",
      },
      {
        heading: "U400 leads on hands-free UWB",
        body: "Choose U400 when approach-based unlocking is the feature the household actually wants—not merely because it has more entry methods.",
      },
      {
        heading: "Door fit and fallback can overrule both",
        body: "Measure the deadbolt and keep a dependable physical or local entry path. A smart-home logo cannot correct an incompatible or binding door.",
      },
    ],
    decisionGuide: [
      {
        label: "Buy Bolt SE",
        detail:
          "Fingerprint and keypad lead, and its exact connectivity variant matches the home.",
      },
      {
        label: "Buy U400",
        detail:
          "Compatible UWB phones and hands-free approach unlocking justify the premium.",
      },
      {
        label: "Pause",
        detail:
          "Door fit, Thread coverage, controller ownership, or backup entry is unresolved.",
      },
    ],
    methodology: [
      "Used current manufacturer pages for entry and connectivity claims",
      "Separated Matter compatibility from Thread infrastructure",
      "Prioritized daily entry and fallback over ecosystem-logo count",
    ],
    productSlugs: ["ultraloq-bolt-se-smart-lock", "aqara-smart-lock-u400"],
    faqs: [
      {
        question: "Does Matter over Thread mean no controller is needed?",
        answer:
          "No. A compatible Matter controller and Thread border router are still required for the intended ecosystem path.",
      },
      {
        question: "Is UWB the same as auto-unlock?",
        answer:
          "No. UWB can provide more precise proximity information on supported devices; generic auto-unlock approaches can use different signals and behavior.",
      },
    ],
  },
];

export const verifiedAffiliateBatchGuides: Guide[] = [
  {
    site: "pet",
    slug: "rfid-feeder-vs-microchip-feeder-guide",
    title: "RFID Collar Feeder vs Implanted-Microchip Feeder",
    dek: "Understand tag compatibility, pet access, multi-feeder cost, collar tolerance, placement, cleaning, and backup feeding before choosing.",
    category: "feeding",
    updatedAt,
    relatedProducts: [
      "petlibro-one-rfid-smart-feeder",
      "petlibro-granary-automatic-cat-feeder",
    ],
    relatedRoundups: [
      "petlibro-one-rfid-vs-granary-smart-feeder",
      "best-automatic-cat-feeders",
    ],
    sources: [
      {
        name: "PETLIBRO One RFID Smart Feeder",
        url: "https://petlibro.com/products/one-rfid-pet-feeder",
        note: "Official dedicated-tag and one-tag limitations.",
      },
    ],
    sections: [
      {
        heading: "RFID describes a technology, not universal compatibility",
        body: "Some feeders read a dedicated collar tag; others read supported implanted microchips. Confirm the exact identifier before assuming the household's existing chip or tag will work.",
      },
      {
        heading: "Start with the pet conflict",
        body: "Access control helps when one animal steals another's food or diets differ. It adds little when every pet safely shares the same food and schedule.",
      },
      {
        heading: "Count feeders, tags, and floor space",
        body: "A one-tag-per-feeder design can require several units. Include reader mats, lid clearance, outlet access, cleaning space, and replacement tags in the real cost.",
      },
      {
        heading: "Keep a supervised fallback",
        body: "A lost tag, weak battery, jam, or hesitant pet can interrupt access. Introduce the feeder while someone is present and preserve a safe backup feeding plan.",
      },
    ],
  },
  {
    site: "homeoffice",
    slug: "standing-desk-casters-stability-guide",
    title: "Standing Desk Casters: Height, Stability & Cable Checklist",
    dek: "Decide whether wheels help a shared room without making seated height, monitor movement, cable travel, or floor protection worse.",
    category: "desks",
    updatedAt,
    relatedProducts: [
      "ergear-48x24-electric-standing-desk",
      "flexispot-e7-mini-standing-desk",
    ],
    relatedRoundups: [
      "ergear-48x24-vs-flexispot-e7-mini",
      "best-standing-desks-for-small-spaces",
      "best-home-office-cable-management",
    ],
    sources: [
      {
        name: "OSHA computer workstation positions",
        url: "https://www.osha.gov/etools/computer-workstations/positions",
        note: "Primary neutral-position guidance.",
      },
      {
        name: "OSHA workstation desks guidance",
        url: "https://www.osha.gov/etools/computer-workstations/components/desks",
        note: "Primary desk and equipment-placement guidance.",
      },
    ],
    sections: [
      {
        heading: "Use wheels only for a real room constraint",
        body: "Casters earn their trade-offs in a shared room, rental, or cleaning-heavy setup where the desk must move. If the desk stays parked, fixed feet usually protect seated height and stability better.",
      },
      {
        heading: "Add caster height before checking fit",
        body: "Wheels can raise the lowest desk position. Compare the finished keyboard height with seated elbow height rather than relying on the frame's number without casters.",
      },
      {
        heading: "Lock every wheel before working",
        body: "Test rolling, braking, and frame movement on the real floor. A wheel that works on hard flooring may behave differently on a rug or soft mat.",
      },
      {
        heading: "Move the cable system with the desk",
        body: "Secure the power strip to the moving desktop when appropriate, preserve one safe path to the wall, and keep cable loops away from wheels and feet.",
      },
      {
        heading: "Heavy monitors reduce the benefit",
        body: "A long monitor arm and heavy display increase visible movement and leverage. Keep the screen near its post and reconsider wheels when display stability is the main priority.",
      },
    ],
  },
  {
    site: "baby",
    slug: "packable-baby-carrier-travel-checklist",
    title: "Packable Baby Carrier Travel Checklist",
    dek: "Check child fit, carry positions, caregiver adjustment, heat, storage, inspection, and backup transport before a flight or day trip.",
    category: "travel",
    updatedAt,
    relatedProducts: ["baby-tula-lite-carrier", "ergobaby-omni-breeze-carrier"],
    relatedRoundups: ["best-baby-carriers-and-sleep-routine-upgrades"],
    sources: [
      {
        name: "Baby Tula Lite product page",
        url: "https://babytula.com/products/slate-tula-lite-baby-carrier",
        note: "Official fit, range, positions, fabric, storage, and care information.",
      },
    ],
    sections: [
      {
        heading: "Fit the child before packing",
        body: "Weight is only one requirement. Follow the exact carrier's developmental, seat, panel, airway, and position guidance before making it the travel plan.",
      },
      {
        heading: "Practice every adjustment at home",
        body: "Both caregivers should know the buckles, strap path, hood, and safe removal routine before using the carrier in a busy terminal or parking lot.",
      },
      {
        heading: "Inspect after storage",
        body: "Unpack the carrier and check fabric, seams, webbing, buckles, and adjustment before each trip. Compact storage should not hide damage or twisted straps.",
      },
      {
        heading: "Keep a backup transport plan",
        body: "Heat, fatigue, child mood, baggage, or a long walk can make a stroller or cart more appropriate. Packability does not make one carrier ideal for every travel segment.",
      },
    ],
  },
  {
    site: "network",
    slug: "when-to-upgrade-to-2-5gbe-switch",
    title: "When Is a 2.5GbE Switch Worth It?",
    dek: "Map internet, NAS, desktop, access-point, adapter, cable, and uplink speeds before replacing a working gigabit switch.",
    category: "wired",
    updatedAt,
    relatedProducts: [
      "trendnet-teg-s380-2-5g-switch",
      "tp-link-tl-sg108-gigabit-switch",
      "netgear-gs308e-gigabit-switch",
    ],
    relatedRoundups: ["best-wired-networking-upgrades"],
    sources: [
      {
        name: "TRENDnet TEG-S380 support",
        url: "https://www.trendnet.com/support/support-detail.asp?prod=110_TEG-S380",
        note: "Official 2.5GBASE-T, version, port, and cabling information.",
      },
    ],
    sections: [
      {
        heading: "Draw one end-to-end path",
        body: "Choose a real transfer—desktop to NAS or internet gateway to workstation—and label every port, adapter, and cable. The slowest negotiated segment controls that path.",
      },
      {
        heading: "Local traffic can justify 2.5G",
        body: "A fast NAS and desktop can benefit even when internet service remains below gigabit. Keep local-transfer goals separate from speed-test expectations.",
      },
      {
        heading: "Check the uplink and port budget",
        body: "An eight-port switch may still bottleneck through a gigabit router port. Count 2.5G clients, the uplink, spare ports, and any future access point before choosing size.",
      },
      {
        heading: "Stay with gigabit when it already clears the workload",
        body: "Streaming, ordinary browsing, and many office tasks do not need multi-gig Ethernet. Reliability, cable routing, and sufficient port count can be more valuable than unused speed.",
      },
    ],
  },
  {
    site: "smarthome",
    slug: "matter-smart-lock-controller-checklist",
    title: "Matter Smart Lock Controller & Thread Checklist",
    dek: "Map lock variant, Matter controller, Thread border router, phone, ecosystem, remote access, multi-admin sharing, batteries, and physical fallback.",
    category: "access",
    updatedAt,
    relatedProducts: ["ultraloq-bolt-se-smart-lock", "aqara-smart-lock-u400"],
    relatedRoundups: ["ultraloq-bolt-se-vs-aqara-u400", "aqara-u400-vs-u100"],
    sources: [
      {
        name: "ULTRALOQ Bolt SE",
        url: "https://ultraloq.com/products/bolt-se",
        note: "Official variant and controller requirements.",
      },
      {
        name: "Thread Group — What is Thread?",
        url: "https://www.threadgroup.org/What-is-Thread/Overview",
        note: "Primary Thread and border-router fundamentals.",
      },
    ],
    sections: [
      {
        heading: "Confirm the exact lock variant",
        body: "A product family can include Wi-Fi, Bluetooth, HomeKit, Matter, or Thread versions. Match the ASIN, model label, and selected retailer option before planning controllers.",
      },
      {
        heading: "Name the Matter controller and border router",
        body: "Write down the actual compatible device that will commission the lock and connect the Thread mesh. A Matter logo does not mean the lock operates without infrastructure.",
      },
      {
        heading: "Plan the first ecosystem and sharing",
        body: "Multi-admin support can share a Matter device with another ecosystem, but the commissioning and sharing flow still matters. Decide which platform owns the first setup.",
      },
      {
        heading: "Preserve local entry",
        body: "Enroll fingerprints and codes carefully, keep a physical-key or documented fallback available outside, and test low-battery behavior before depending on remote control.",
      },
    ],
  },
];
