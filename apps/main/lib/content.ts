export type Publication = {
  key: string;
  name: string;
  domain: string;
  image: string;
  label: string;
  description: string;
  decision: string;
  featuredTitle: string;
  featuredHref: string;
  accent: string;
};

export const publications: Publication[] = [
  {
    key: "network",
    name: "Signalwise Picks",
    domain: "https://network.madabase.com",
    image: "/images/network.webp",
    label: "Home networking",
    description: "Mesh Wi-Fi, routers, Ethernet, switches, adapters, and backup power explained by layout and real constraints.",
    decision: "Start here when coverage, wired backhaul, port speed, or reliability controls the purchase.",
    featuredTitle: "TP-Link Deco BE67 vs. BE63",
    featuredHref: "https://network.madabase.com/best/tp-link-deco-be67-vs-be63",
    accent: "#2f6f9f",
  },
  {
    key: "smarthome",
    name: "Dwellwise Picks",
    domain: "https://smarthome.madabase.com",
    image: "/images/smart-home.webp",
    label: "Smart home",
    description: "Locks, doorbells, sensors, thermostats, Matter, Thread, and hubs with compatibility and subscriptions kept visible.",
    decision: "Start here when an ecosystem, wiring, privacy choice, or monthly fee could create regret later.",
    featuredTitle: "Matter, Thread, Wi-Fi, and Zigbee checklist",
    featuredHref: "https://smarthome.madabase.com/guides/matter-thread-wifi-zigbee-device-checklist",
    accent: "#17756e",
  },
  {
    key: "homeoffice",
    name: "Deskwise Picks",
    domain: "https://homeoffice.madabase.com",
    image: "/images/home-office.webp",
    label: "Home office",
    description: "Desks, chairs, monitor arms, lighting, docks, and meeting gear judged by fit, ergonomics, and daily friction.",
    decision: "Start here when the room is small, the workday is long, or the setup must serve more than one person.",
    featuredTitle: "Branch Ergonomic Chair research guide",
    featuredHref: "https://homeoffice.madabase.com/reviews/branch-ergonomic-chair",
    accent: "#35627a",
  },
  {
    key: "baby",
    name: "NestCheck Picks",
    domain: "https://baby.madabase.com",
    image: "/images/baby.webp",
    label: "Baby gear",
    description: "Carriers, monitors, strollers, feeding, and nursery gear with stated age, weight, fit, and safety limits in view.",
    decision: "Start here when developmental stage, caregiver fit, cleaning effort, or travel size changes the answer.",
    featuredTitle: "Ergobaby Omni Breeze positions by age",
    featuredHref: "https://baby.madabase.com/guides/ergobaby-omni-breeze-positions-by-age",
    accent: "#9a6940",
  },
  {
    key: "pet",
    name: "PawSelect Picks",
    domain: "https://pets.madabase.com",
    image: "/images/pets.webp",
    label: "Pet care",
    description: "Feeders, cameras, fountains, air quality, cleaning, and comfort gear evaluated around routines and maintenance.",
    decision: "Start here when the product has to work reliably while the household is busy or away.",
    featuredTitle: "Furbo 360 subscription and feature guide",
    featuredHref: "https://pets.madabase.com/reviews/furbo-360-dog-camera",
    accent: "#187366",
  },
  {
    key: "style",
    name: "Sideglance Style",
    domain: "https://style.madabase.com",
    image: "/images/style.webp",
    label: "Personal style",
    description: "Expressive bags and accessories considered by scale, comfort, materials, capacity, outfit fit, and return risk.",
    decision: "Start here when the interesting piece still needs to work with real outfits and ordinary days.",
    featuredTitle: "Loungefly Minnie bow vs. Rock the Dots",
    featuredHref: "https://style.madabase.com/best/loungefly-minnie-bow-vs-rock-the-dots-backpack",
    accent: "#a44462",
  },
];

export const researchItems = [
  { publication: "Signalwise Picks", topic: "Home networking", title: "Deco BE67 vs. BE63: where the upgrade actually matters", summary: "A model-by-model decision around ports, backhaul, pack count, and the homes that can use the extra capacity.", href: "https://network.madabase.com/best/tp-link-deco-be67-vs-be63", updated: "Updated July 2026" },
  { publication: "Dwellwise Picks", topic: "Smart home", title: "Matter, Thread, Wi-Fi, or Zigbee before checkout", summary: "A compatibility-first checklist that separates the app, controller, radio, hub, and border-router requirements.", href: "https://smarthome.madabase.com/guides/matter-thread-wifi-zigbee-device-checklist", updated: "Updated July 2026" },
  { publication: "Deskwise Picks", topic: "Home office", title: "Branch Ergonomic Chair: warranty, returns, and fit", summary: "The decision beyond dimensions, including current warranty scope, return friction, adjustment range, and alternatives.", href: "https://homeoffice.madabase.com/reviews/branch-ergonomic-chair", updated: "Updated July 2026" },
  { publication: "NestCheck Picks", topic: "Baby gear", title: "Ergobaby Omni Breeze positions by age", summary: "A milestone-led guide to newborn setup, inward carry, outward-facing timing, hip carry, and back carry.", href: "https://baby.madabase.com/guides/ergobaby-omni-breeze-positions-by-age", updated: "Updated July 2026" },
  { publication: "PawSelect Picks", topic: "Pet care", title: "Furbo 360: what stays free and what needs Nanny", summary: "A clear separation of live camera controls, paid detection features, current subscription risk, and checkout variants.", href: "https://pets.madabase.com/reviews/furbo-360-dog-camera", updated: "Updated July 2026" },
  { publication: "Sideglance Style", topic: "Personal style", title: "Which Minnie mini backpack is easier to wear", summary: "A practical comparison of scale, palette, capacity, outfit range, and the details to verify before ordering.", href: "https://style.madabase.com/best/loungefly-minnie-bow-vs-rock-the-dots-backpack", updated: "Updated July 2026" },
];

export type GuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Guide = {
  slug: string;
  title: string;
  dek: string;
  category: string;
  updatedAt: string;
  readingTime: string;
  image: string;
  verdict: string;
  steps: string[];
  sections: GuideSection[];
  related: Array<{ label: string; href: string }>;
  sources: Array<{ label: string; href: string }>;
};

export const guides: Guide[] = [
  {
    slug: "connected-home-buying-order",
    title: "The right buying order for a connected home",
    dek: "Build the network and control layer before buying a pile of devices that cannot communicate reliably.",
    category: "Connected home",
    updatedAt: "July 21, 2026",
    readingTime: "8 minute read",
    image: "/images/network.webp",
    verdict: "Start with coverage, Ethernet opportunities, and the control ecosystem. Buy visible devices such as locks, cameras, and sensors only after you know how they connect, where their controller lives, and which functions survive an internet outage.",
    steps: ["Map rooms and fixed devices", "Stabilize the network", "Choose the control ecosystem", "Add one high-value device", "Test failure behavior before scaling"],
    sections: [
      { heading: "1. Map the home before choosing hardware", paragraphs: ["Mark the internet entry point, work areas, televisions, cameras, doorbells, hubs, and places where walls or floors weaken wireless coverage. This turns a vague upgrade into a placement problem that can be tested.", "Also mark every realistic Ethernet path. A wired path to a desk, access point, television, or mesh node can matter more than buying the most expensive wireless model."], bullets: ["Count floors and difficult walls", "Mark devices that cannot move", "Identify existing Ethernet, coax, and power outlets", "Separate coverage problems from internet-plan problems"] },
      { heading: "2. Stabilize the network first", paragraphs: ["A smart device can have excellent software and still feel unreliable when it sits at the edge of coverage. Fix unstable Wi-Fi, poor node placement, overloaded wireless backhaul, or a failing router before using device replacement as the solution.", "Do not buy Wi-Fi 7 only because it is newest. The useful question is whether the home's clients, wired ports, internet service, and backhaul can use the additional capacity."], bullets: ["Prefer wired backhaul where it is practical", "Check port speed and pack count, not only the Wi-Fi generation", "Keep hubs and border routers away from enclosed metal cabinets"] },
      { heading: "3. Choose the control path before the device", paragraphs: ["Matter describes an application layer, while Thread, Wi-Fi, and Ethernet describe network transports. A Matter logo does not by itself confirm that the household already owns the required controller or Thread border router.", "Write down the primary control app, voice platform if any, local-control expectations, and whether a manufacturer account or cloud service is required. This prevents a home from accumulating several disconnected apps for simple routines."], bullets: ["Controller or hub required", "Thread border router required", "Manufacturer account required", "Cloud-dependent or locally controllable", "Shared household access available"] },
      { heading: "4. Add one device and test the boring failures", paragraphs: ["Start with one device that solves a repeated problem, then test it for a week before expanding the ecosystem. Check notifications, shared access, automation delays, battery reporting, firmware updates, and recovery after router or internet restarts.", "A successful pilot tells you more than a long compatibility list because it exposes the exact household accounts, phones, wireless conditions, and routines the final system must support."], bullets: ["Restart the router and internet connection", "Test a phone away from home", "Confirm another household member can control it", "Review privacy and notification settings", "Record the reset and re-pairing steps"] },
      { heading: "5. Scale by routine, not by room count", paragraphs: ["Expand only when the next device improves an existing routine. A contact sensor that turns off climate control when a window opens has a clear role. A collection of disconnected sensors with no response path adds maintenance instead of reducing it.", "Keep a small inventory of model, protocol, room, hub, battery type, account owner, and subscription. That record becomes valuable when hardware versions or platform support change."] },
    ],
    related: [
      { label: "Compare mesh Wi-Fi for apartments and homes", href: "https://network.madabase.com/best/best-mesh-wifi-for-apartments-and-homes" },
      { label: "Use the Matter, Thread, Wi-Fi, and Zigbee checklist", href: "https://smarthome.madabase.com/guides/matter-thread-wifi-zigbee-device-checklist" },
      { label: "Plan Aqara Hub M3 and Matter setup", href: "https://smarthome.madabase.com/guides/aqara-hub-m3-matter-thread-setup" },
    ],
    sources: [
      { label: "Connectivity Standards Alliance: Matter", href: "https://csa-iot.org/all-solutions/matter/" },
      { label: "Thread Group: What is Thread?", href: "https://www.threadgroup.org/What-is-Thread/Overview" },
      { label: "Wi-Fi Alliance: Wi-Fi CERTIFIED 7", href: "https://www.wi-fi.org/discover-wi-fi/wi-fi-certified-7" },
    ],
  },
  {
    slug: "home-office-network-and-ergonomics",
    title: "Upgrade a home office in the order you will feel",
    dek: "Fix connection reliability, body fit, lighting, and meeting quality before spending on decorative upgrades.",
    category: "Work and focus",
    updatedAt: "July 21, 2026",
    readingTime: "7 minute read",
    image: "/images/home-office.webp",
    verdict: "The highest-value sequence is usually reliable connectivity, a workstation that fits the user, controllable task lighting, and only then cameras, microphones, docks, and accessories. Solve the interruption that happens every day before optimizing a feature used once a week.",
    steps: ["Measure recurring friction", "Make the connection dependable", "Fit chair, desk, and display", "Control light and sound", "Add meeting gear last"],
    sections: [
      { heading: "1. Write down the interruptions for one week", paragraphs: ["Before shopping, record what actually breaks concentration: calls freezing, a shoulder reaching toward the keyboard, glare after lunch, a laptop running out of ports, or a chair that becomes uncomfortable after an hour.", "Frequency matters. A modest fix used five days a week usually creates more value than a premium feature that looks impressive but rarely changes the work."], bullets: ["How often the problem happens", "How long it interrupts work", "Whether another household member shares the setup", "Whether the solution must move or store away"] },
      { heading: "2. Make the connection boring", paragraphs: ["Video calls need stability more than an impressive peak speed test. Test the desk at working hours, confirm whether the computer uses Wi-Fi or Ethernet, and identify whether the bottleneck is local coverage, wireless interference, a dock, or the internet service.", "Where practical, a wired path to the desk or a properly placed mesh node removes uncertainty from every later camera, audio, and cloud-software decision."], bullets: ["Run repeated tests at the desk", "Check upload as well as download", "Test the actual dock or USB adapter", "Avoid hiding a mesh node under or behind the desk"] },
      { heading: "3. Fit the workstation to the person", paragraphs: ["Chair labels such as ergonomic do not guarantee fit. Seat height, depth, armrest range, lumbar shape, desk clearance, and return terms all matter. Adjust the chair and desk around a neutral working position before buying accessories intended to correct a bad base setup.", "Place the frequently used input devices close enough that elbows stay near the body. The display should be easy to view without repeatedly bending the neck or leaning forward."], bullets: ["Feet supported", "Back supported", "Shoulders relaxed", "Keyboard and mouse close", "Display positioned for a neutral head posture"] },
      { heading: "4. Control light before upgrading the camera", paragraphs: ["A controllable light source often improves both eye comfort and video-call appearance. Position the display to reduce window glare, add task light for documents and keyboard work, and use a soft front light only when meetings need it.", "A more expensive webcam cannot compensate for a bright window behind the user or a face lit only by the monitor."], bullets: ["Check morning and afternoon glare", "Keep task light out of the display reflection", "Use separate work and call lighting when needed"] },
      { heading: "5. Add docks and meeting gear around real ports", paragraphs: ["List every display, network, charging, storage, camera, and audio connection before choosing a dock. Confirm the laptop's port capabilities and power requirements instead of assuming every USB-C connector supports the same functions.", "Choose microphones, speakers, or headsets based on room noise and call frequency. A simple headset can be the better decision in a shared room even when a desk microphone looks cleaner."] },
    ],
    related: [
      { label: "Review the Branch Ergonomic Chair fit and warranty", href: "https://homeoffice.madabase.com/reviews/branch-ergonomic-chair" },
      { label: "Compare monitor arms for home offices", href: "https://homeoffice.madabase.com/best/best-monitor-arms-for-home-office" },
      { label: "Plan a wired home-office connection", href: "https://network.madabase.com/guides/ethernet-adapter-speed-troubleshooting" },
    ],
    sources: [
      { label: "OSHA Computer Workstations eTool", href: "https://www.osha.gov/etools/computer-workstations" },
      { label: "NIOSH: Working from home ergonomics", href: "https://www.cdc.gov/niosh/blogs/2020/working-from-home.html" },
    ],
  },
  {
    slug: "household-tech-subscription-checklist",
    title: "The household technology subscription checklist",
    dek: "Compare the cost and usefulness of cloud features before a camera, monitor, doorbell, or feeder becomes another monthly bill.",
    category: "Recurring cost",
    updatedAt: "July 21, 2026",
    readingTime: "8 minute read",
    image: "/images/smart-home.webp",
    verdict: "Separate what the hardware does for free from what the subscription adds. Then compare the amount billed today, renewal price, minimum term, camera or household limits, cancellation timing, and what happens to recordings and automations when the plan ends.",
    steps: ["List free hardware functions", "Price the full ownership period", "Check account and device limits", "Plan the no-subscription fallback", "Set a renewal reminder"],
    sections: [
      { heading: "1. Make two feature lists", paragraphs: ["Create one list for functions that work after buying the hardware and another for functions that require a paid service. Live view, local recording, basic alerts, cloud history, person detection, package detection, and emergency escalation are often split differently across products.", "This prevents an attractive camera price from hiding the fact that the one feature the household wants sits behind a recurring plan."], bullets: ["Live view and two-way audio", "Local or included recording", "Detection and alert types", "Cloud history length", "Sharing and extra users", "Emergency or monitoring services"] },
      { heading: "2. Compare the billed total, not the monthly equivalent", paragraphs: ["A plan advertised as a low monthly amount may be billed for a full year or require a minimum commitment. Record the amount charged today, promotional period, normal renewal price, taxes where applicable, cancellation deadline, and refund policy.", "For a three-year comparison, include likely extra-device charges and the cost of any storage card, hub, or base station needed to avoid the subscription."], bullets: ["Initial charge", "Renewal charge", "Minimum term", "Extra device fee", "Required hardware", "Cancellation and refund terms"] },
      { heading: "3. Check whether the plan belongs to a device or household", paragraphs: ["Some services cover one camera, others cover several devices at one location, and others charge for each additional camera. A plan that looks reasonable for one doorbell may become expensive after adding indoor cameras or pet coverage.", "Also verify who owns the account. Shared access should not depend on one person's private login, especially for locks, baby monitoring, pet care, or safety alerts."], bullets: ["Number of included devices", "Number of homes or locations", "Guest and household permissions", "Account transfer and device resale"] },
      { heading: "4. Decide what failure is acceptable", paragraphs: ["Ask what remains when the internet is down, the company service is unavailable, payment fails, or the subscription ends. A product may retain live local controls while losing cloud history and advanced alerts, or it may lose most of its useful behavior.", "For safety-sensitive routines, keep a non-cloud fallback. A camera is not a substitute for childcare, a connected feeder still needs in-person checks, and a smart lock should retain a reliable physical or local entry path."], bullets: ["Internet outage", "Power outage", "Service outage", "Expired payment method", "Cancelled plan"] },
      { heading: "5. Review subscriptions as a household portfolio", paragraphs: ["A single monthly fee can be easy to justify. Several overlapping storage, alert, monitoring, and AI plans are harder to notice. Review the household total twice a year and remove plans whose paid features are no longer used.", "Keep the decision notes with the account owner, renewal date, current plan, and cancellation path. That small record makes future product comparisons faster and reduces accidental renewals."] },
    ],
    related: [
      { label: "See what Furbo 360 keeps free", href: "https://pets.madabase.com/reviews/furbo-360-dog-camera" },
      { label: "Compare pet cameras for apartments", href: "https://pets.madabase.com/best/best-pet-cameras-for-apartments" },
      { label: "Compare smart-home protocols before buying", href: "https://smarthome.madabase.com/guides/matter-thread-wifi-zigbee-device-checklist" },
    ],
    sources: [
      { label: "FTC Consumer Advice: subscriptions and negative options", href: "https://consumer.ftc.gov/articles/getting-and-out-free-trials-auto-renewals-and-negative-option-subscriptions" },
      { label: "NIST research on smart-home security and privacy", href: "https://www.nist.gov/blogs/cybersecurity-insights/staff-spotlight-nist-usable-cybersecurity-security-and-privacy-smart" },
    ],
  },
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
