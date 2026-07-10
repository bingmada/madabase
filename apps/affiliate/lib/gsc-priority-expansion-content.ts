import type { Guide, Roundup } from "./types";

const updatedAt = "July 10, 2026";

export const gscPriorityRoundups: Roundup[] = [
  {
    site: "baby",
    slug: "best-baby-carriers-by-age-and-position",
    title: "Best Baby Carriers by Age and Carry Position",
    dek: "Compare newborn inward carry, outward-facing readiness, hip carry, back carry, warm-weather comfort, and when a simpler carrier beats an all-stage model.",
    category: "travel",
    intent: "Choose a carrier by the baby's current milestone instead of buying the most feature-heavy option.",
    intro:
      "Baby carrier shopping gets easier when age is treated as a planning clue, not permission to use every position. Start with the carry position the baby can safely use now, then compare caregiver fit, heat, return policy, and how long the carrier should remain useful.",
    decisionGuide: [
      { label: "Newborn inward carry", detail: "Choose a carrier with clear newborn minimums, head support, and an easy front-inward setup." },
      { label: "Outward-facing interest", detail: "Wait for the listed head, neck, height, and weight requirements; do not use outward carry as a newborn feature." },
      { label: "Longer errands", detail: "A structured waist belt and lumbar support can matter more than the number of advertised positions." },
      { label: "Hot weather", detail: "Mesh helps, but shared body heat, shade, clothing, and trip length still decide comfort." },
    ],
    methodology: [
      "Separate current safe position from later advertised positions",
      "Compare official weight, height, and developmental guidance",
      "Keep caregiver fit and return policy visible because comfort is personal",
    ],
    productSlugs: [
      "ergobaby-omni-breeze-carrier",
      "babybjorn-carrier-harmony",
      "babybjorn-carrier-mini-3d-mesh",
      "momcozy-purehug-baby-carrier",
      "baby-tula-lite-carrier",
    ],
    faqs: [
      { question: "Can a newborn face outward in a carrier?", answer: "No. Newborns should use the model's approved inward-facing newborn setup after meeting the stated minimums." },
      { question: "Is an all-stage carrier always better?", answer: "Not always. A simpler newborn carrier can be easier early, while an all-stage carrier can reduce repeat buying later." },
      { question: "What matters more than age?", answer: "Weight, height, head and neck control, sitting ability, airway visibility, and the exact manual for the current carrier." },
    ],
  },
  {
    site: "baby",
    slug: "best-bottle-sterilizer-dryer-for-pump-parts",
    title: "Best Bottle Sterilizer and Dryer for Pump Parts",
    dek: "Choose between a sterilizer-dryer combo and a larger washer by counting valves, flanges, caps, bottles, drying space, and repeat cycles.",
    category: "feeding",
    intent: "Pick the feeding cleanup appliance that reduces daily pump-part and bottle friction.",
    intro:
      "A bottle sterilizer can be disappointing if the real problem is wet pump parts covering the counter. Count the small pieces first, then decide whether the daily bottleneck is washing, sanitizing, drying, or clean storage.",
    decisionGuide: [
      { label: "Drying is the pain point", detail: "A sterilizer-dryer combo can reduce counter clutter when clean parts stay wet too long." },
      { label: "Hand-washing is the pain point", detail: "A washer-style appliance deserves attention when scrubbing bottles and pump parts consumes the routine." },
      { label: "Small kitchen", detail: "Check footprint, lid clearance, drain route, and where clean parts will land after a cycle." },
      { label: "Occasional sanitizing", detail: "A simpler or smaller approach may beat a large appliance that will not stay on the counter." },
    ],
    methodology: [
      "Count bottles and pump parts instead of relying on headline bottle capacity",
      "Separate washing, sanitizing, drying, and storage",
      "Use CDC and manufacturer instructions as the safety baseline",
    ],
    productSlugs: ["momcozy-kleanpal-pro-baby-bottle-washer", "baby-brezza-sterilizer-dryer-advanced"],
    faqs: [
      { question: "Do sterilizer dryers wash bottles?", answer: "Usually no. A sterilizer-dryer handles sanitizing and drying after cleaning unless the exact model includes a wash cycle." },
      { question: "Should pump parts go in a sterilizer?", answer: "Only if the pump and appliance instructions allow it. Follow the pump maker, appliance manual, and current health guidance." },
      { question: "Is drying worth paying for?", answer: "It can be if parts must be reused quickly or if clean wet pieces are creating counter clutter every day." },
    ],
  },
  {
    site: "homeoffice",
    slug: "best-home-office-lighting-for-video-calls-in-small-rooms",
    title: "Best Home Office Lighting for Video Calls in Small Rooms",
    dek: "Choose compact lighting for Zoom, Meet, and Teams calls by face exposure, glare, monitor space, window position, and desk clutter.",
    category: "meetings",
    intent: "Improve video-call appearance in a small home office without turning the desk into a studio.",
    intro:
      "Small-room video calls usually fail because the camera sees a bright window, overhead shadows, or a dark face. A compact front light can outperform a new webcam when it is placed near the camera and adjusted before meetings.",
    decisionGuide: [
      { label: "Face is too dark", detail: "Start with a compact video light near the camera rather than a desk lamp behind the screen." },
      { label: "Need keyboard light", detail: "A monitor light bar helps desk visibility but may not brighten your face enough for calls." },
      { label: "Wear glasses", detail: "Prioritize dimming and angle control so the light does not reflect directly into the camera." },
      { label: "Tiny desk", detail: "Favor monitor-mounted or behind-monitor placement over lamp bases that consume the work surface." },
    ],
    methodology: [
      "Match the light to camera position first",
      "Check glare on glasses and glossy monitors",
      "Separate face lighting from desk lighting",
    ],
    productSlugs: ["logitech-litra-glow", "benq-screenbar-halo"],
    faqs: [
      { question: "Is a monitor light bar good for video calls?", answer: "It can help the desk, but it may not light the face as well as a camera-adjacent video light." },
      { question: "Should the light be behind the monitor?", answer: "It should light your face from near the camera path. Behind-monitor placement can work only if the light is aimed correctly." },
      { question: "Do I need a new webcam first?", answer: "Often no. Fixing face lighting can improve a normal webcam more than replacing the camera in a dim room." },
    ],
  },
];

export const gscPriorityGuides: Guide[] = [
  {
    site: "baby",
    slug: "ergobaby-omni-breeze-forward-facing-age-guide",
    title: "Ergobaby Omni Breeze Forward-Facing Age and Fit Guide",
    dek: "Check head and neck control, height, weight, chin clearance, overstimulation, and when to turn back inward.",
    category: "travel",
    updatedAt,
    relatedProducts: ["ergobaby-omni-breeze-carrier"],
    relatedRoundups: ["best-baby-carriers-by-age-and-position", "best-baby-carriers-and-sleep-routine-upgrades"],
    sources: [
      { name: "Ergobaby Omni Breeze product guidance", url: "https://ergobaby.com/omni-breeze-baby-carrier-all", note: "Official position, size, and FAQ guidance." },
      { name: "Ergobaby Omni Breeze instructions", url: "https://ergobaby.com/instructions-omni-breeze/", note: "Official setup videos and manuals." },
    ],
    sections: [
      { heading: "Forward-facing is not a newborn mode", body: "Use the front-inward newborn setup until the baby meets the exact outward-facing requirements in the current Ergobaby instructions. Age alone is not enough." },
      { heading: "Check control and panel height", body: "Before turning outward, confirm strong head and neck control, the listed height and weight guidance, and that the chin clears the top of the panel without slumping." },
      { heading: "Use outward carry for alert short sessions", body: "Turn the baby inward when sleepy, overstimulated, cold, hot, or unable to maintain posture. Outward carry is a situational option, not the default for every errand." },
      { heading: "Reset the carrier before changing direction", body: "Seat width, strap tension, waistband position, and panel support can change between inward and outward carry. Follow the position-specific official setup each time." },
    ],
  },
  {
    site: "baby",
    slug: "ergobaby-omni-breeze-vs-babybjorn-harmony-by-age",
    title: "Ergobaby Omni Breeze vs. BabyBjorn Harmony by Age",
    dek: "Compare newborn setup, outward carry, back carry, mesh comfort, waistband support, and caregiver fit across the first year.",
    category: "travel",
    updatedAt,
    relatedProducts: ["ergobaby-omni-breeze-carrier", "babybjorn-carrier-harmony"],
    relatedRoundups: ["babybjorn-harmony-vs-ergobaby-omni-breeze", "best-baby-carriers-by-age-and-position"],
    sources: [
      { name: "Ergobaby Omni Breeze", url: "https://ergobaby.com/omni-breeze-baby-carrier-all", note: "Official size, position, and material guidance." },
      { name: "BabyBjorn Carrier Harmony", url: "https://www.babybjorn.com/products/baby-carriers/baby-carrier-harmony/", note: "Official size, position, and adjustment guidance." },
    ],
    sections: [
      { heading: "Newborn months: setup friction matters", body: "Both carriers should be judged by the correct inward-facing newborn setup, airway visibility, head support, and how confidently each caregiver can load the baby." },
      { heading: "Middle months: outward carry is milestone-bound", body: "Do not compare outward-facing as a simple age feature. Check each manual's head, neck, height, and weight requirements before using that position." },
      { heading: "Later months: support and back carry separate them", body: "For longer outings, compare waistband support, shoulder pressure, back-carry workflow, and whether the carrier remains comfortable as the child gets heavier." },
      { heading: "The better carrier is the one you can adjust correctly", body: "A feature-rich carrier loses value if one caregiver cannot get a secure fit. Return policy, instruction clarity, and real fit testing are part of the buying decision." },
    ],
  },
  {
    site: "baby",
    slug: "baby-bottle-sterilizer-dryer-counter-space-checklist",
    title: "Baby Bottle Sterilizer Dryer Counter Space Checklist",
    dek: "Measure appliance footprint, lid swing, drying path, outlet location, pump-part capacity, and where clean parts go after the cycle.",
    category: "feeding",
    updatedAt,
    relatedProducts: ["momcozy-kleanpal-pro-baby-bottle-washer", "baby-brezza-sterilizer-dryer-advanced"],
    relatedRoundups: ["best-bottle-sterilizers-and-dryers", "best-bottle-sterilizer-dryer-for-pump-parts"],
    sources: [
      { name: "CDC infant feeding item cleaning guidance", url: "https://www.cdc.gov/hygiene/about/clean-sanitize-store-infant-feeding-items.html", note: "Primary cleaning, sanitizing, drying, and storage guidance." },
    ],
    sections: [
      { heading: "Measure the permanent footprint", body: "A large feeding appliance works only if it can stay accessible. Measure width, depth, lid clearance, outlet position, and the loading path with cabinets open." },
      { heading: "Count small parts before bottles", body: "Nipples, rings, caps, valves, flanges, and pacifiers can consume more usable space than bottle bodies. Use the real daily routine before trusting a headline capacity number." },
      { heading: "Plan clean storage after drying", body: "Dry parts still need a clean landing spot. Decide whether parts stay in the appliance, move to a covered bin, or get assembled immediately." },
      { heading: "Keep washing and sanitizing separate", body: "A dryer or sterilizer does not remove milk residue unless the exact appliance includes a compatible wash cycle. Clean parts first according to the product and health guidance." },
    ],
  },
  {
    site: "homeoffice",
    slug: "home-office-lighting-for-video-calls-checklist",
    title: "Home Office Lighting for Video Calls Checklist",
    dek: "Fix face exposure, window backlight, glasses glare, monitor reflections, color temperature, and desk clutter before buying a webcam.",
    category: "meetings",
    updatedAt,
    relatedProducts: ["logitech-litra-glow", "benq-screenbar-halo"],
    relatedRoundups: ["best-video-call-lighting-for-home-office", "best-home-office-lighting-for-video-calls-in-small-rooms"],
    sources: [
      { name: "OSHA lighting guidance for computer workstations", url: "https://www.osha.gov/etools/computer-workstations/components/lighting", note: "Primary workstation lighting guidance for glare and reflections." },
    ],
    sections: [
      { heading: "Put light near the camera path", body: "The camera needs the face lit, not just the room. Start with a small light near or above the camera and reduce strong backlight from windows." },
      { heading: "Check glasses and glossy screens", body: "If the light appears as a white spot in glasses or the monitor, lower brightness, move it sideways, or raise the angle until the reflection leaves the camera view." },
      { heading: "Separate call lighting from task lighting", body: "A monitor bar can make typing easier while a camera light makes the face clearer. Some desks need both, but each solves a different job." },
      { heading: "Save a repeatable meeting preset", body: "Use the same brightness, color temperature, camera height, and chair position for recurring calls so setup friction does not make the light go unused." },
    ],
  },
  {
    site: "homeoffice",
    slug: "standing-desk-wheels-pros-cons-small-spaces",
    title: "Standing Desk Wheels: Pros and Cons for Small Spaces",
    dek: "Decide whether casters help a compact standing desk or create wobble, cable risk, floor damage, and monitor-arm instability.",
    category: "desks",
    updatedAt,
    relatedProducts: ["ergear-48x24-electric-standing-desk", "flexispot-e7-mini-standing-desk"],
    relatedRoundups: ["best-standing-desks-for-small-spaces", "best-home-office-cable-management"],
    sources: [
      { name: "OSHA workstation desks guidance", url: "https://www.osha.gov/etools/computer-workstations/components/desks", note: "Primary desk and equipment-placement guidance." },
    ],
    sections: [
      { heading: "Wheels help only when the desk must move", body: "Casters can be useful in a multipurpose room, rental, or cleaning-heavy setup. If the desk stays in one place, stability usually matters more than mobility." },
      { heading: "Check lift stability at standing height", body: "A compact desk can feel stable when seated and still wobble when raised. Wheels add another movement point, especially with a monitor arm or heavy display." },
      { heading: "Plan cables before rolling", body: "Power, monitor, dock, light, and charger cables need slack and strain relief. Rolling a desk with tight cables can pull connectors or drag a power strip." },
      { heading: "Protect the floor and lock the position", body: "Use locking casters suited to the floor type, test chair clearance, and recheck level after moving. A desk that shifts during typing or calls is not a good trade." },
    ],
  },
  {
    site: "homeoffice",
    slug: "standing-desk-designs-for-small-spaces-guide",
    title: "Standing Desk Designs for Small Spaces",
    dek: "Compare narrow electric desks, wall-facing layouts, monitor arms, rolling setups, cable paths, and storage trade-offs for bedrooms and rentals.",
    category: "desks",
    updatedAt,
    relatedProducts: ["ergear-48x24-electric-standing-desk", "flexispot-e7-mini-standing-desk", "uplift-v3-standing-desk"],
    relatedRoundups: ["best-standing-desks-for-small-spaces", "best-monitor-arms-for-home-office"],
    sources: [
      { name: "OSHA workstation purchasing guide", url: "https://www.osha.gov/etools/computer-workstations/checklists/purchasing-guide", note: "Primary desk purchasing guidance for work surface and equipment fit." },
    ],
    sections: [
      { heading: "Design around depth first", body: "Many small desks are narrow and shallow. Protect monitor distance with an arm, laptop stand, or compact display before filling the width with accessories." },
      { heading: "Use the wall but do not trap the desk", body: "Wall-facing layouts save space, but height movement, monitor-arm clearance, outlets, baseboards, and cable trays still need room behind the desktop." },
      { heading: "Keep one clear conversion path", body: "If the room changes from bedroom to office each day, decide where the chair, walking pad, and cables go during each mode. A movable desk can help only when this path is planned." },
      { heading: "Avoid decorative storage until the core setup works", body: "Shelves, pegboards, risers, and trays can crowd a compact desk. Solve keyboard, mouse, monitor, light, and power first, then add storage for specific recurring items." },
    ],
  },
];
