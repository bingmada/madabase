import type { Guide } from "./types";

// Topic-specific wording for the 54 generic fallback titles found in the audit.
export const familyDecisionTitles: Record<string, string> = {
  "bulk-ethernet-cable-reels": "Bulk Ethernet Cable: Conductor, Jacket and Installation Checks",
  "cloud-managed-access-points": "Cloud-Managed Access Points: Licences, Control and Offline Use",
  "coax-cable-testers": "Coax Cable Testers: Continuity, Mapping or Signal Testing?",
  "coax-compression-tools": "Coax Compression Tools: Match the Cable and Connector",
  "ethernet-inline-couplers": "Ethernet Couplers: Cable Category, Shielding and Placement",
  "ethernet-network-taps": "Ethernet Network TAPs: Link Speed, Capture and Power Checks",
  "fiber-cleaning-kits": "Fiber Cleaning Kits: Match the Connector and Inspect the End",
  "fiber-optic-patch-cables": "Fiber Patch Cables: Connector, Polish and Fiber-Type Checks",
  "fiber-optic-power-meters": "Fiber Power Meters: Wavelength, Range and Test Method",
  "fiber-visual-fault-locators": "Fiber Fault Locators: What Visible Light Can and Cannot Prove",
  "industrial-ethernet-switches": "Industrial Ethernet Switches: Power, Mounting and Environment",
  "kvm-over-ip-extenders": "KVM over IP: Video, USB, Latency and Network Requirements",
  "managed-2-5gbe-switches": "Managed 2.5GbE Switches: VLANs, Uplinks and Port Planning",
  "mini-ups-for-routers": "Mini Router UPS: Voltage, Polarity, Connectors and Runtime",
  "network-rack-cooling-fans": "Rack Cooling Fans: Airflow Path, Temperature and Noise",
  "network-rack-shelves": "Network Rack Shelves: Depth, Mounting and Load Checks",
  "preterminated-fiber-runs": "Preterminated Fiber: Pulling Route, Connectors and Spare Length",
  "rack-blanking-panels": "Rack Blanking Panels: Airflow Need, Mounting and Cable Access",
  "rackmount-network-ups": "Rackmount UPS: Depth, Rails, Outlets and Load-Based Runtime",
  "serial-device-servers": "Serial Device Servers: RS-232/422/485 and Software Fit",
  "sfp28-network-switches": "SFP28 Switches: 25GbE Links, Optics, Uplinks and Noise",
  "sfp28-transceivers": "SFP28 Transceivers: Fiber, Reach, FEC and Host Compatibility",
  "wall-plate-access-points": "Wall-Plate Access Points: Wall Box, PoE and Downlink Ports",
  "waterproof-rj45-couplers": "Outdoor RJ45 Couplers: Gland Fit, Cable and Sealing Checks",
  "optical-time-domain-reflectometers": "OTDR Buying Guide: Fiber, Range, Dead Zones and Test Leads",
  "acoustic-desk-dividers": "Acoustic Desk Dividers: Panel Size, Mounting and Noise Limits",
  "active-sitting-stools": "Active Sitting Stools: Height, Base Movement and Foot Support",
  "desk-cable-grommets": "Desk Cable Grommets: Hole Size, Plug Clearance and Desktop Fit",
  "desk-cable-sleeves": "Desk Cable Sleeves: Bundle Diameter, Breakouts and Access",
  "desk-pegboard-organizers": "Desk Pegboards: Attachment, Reach and Accessory Load",
  "desktop-computer-speakers": "Desktop Speakers: Inputs, Desk Space and Volume Controls",
  "desktop-file-organizers": "Desktop File Organizers: Paper Size, Capacity and Access",
  "desktop-ring-lights": "Desktop Ring Lights: Camera Position, Glare and Stand Fit",
  "desktop-shelf-systems": "Desktop Shelves: Depth, Height, Load and Monitor Clearance",
  "floor-cable-covers": "Floor Cable Covers: Cable Capacity, Wheels and Trip Edges",
  "ink-tank-printers": "Ink Tank Printers: Print Volume, Ink Cost and Maintenance",
  "keyboard-wrist-rests": "Keyboard Wrist Rests: Height, Palm Support and Keyboard Fit",
  "laptop-cooling-pads": "Laptop Cooling Pads: Vent Position, Elevation and Fan Fit",
  "monitor-light-bars": "Monitor Light Bars: Screen Shape, Glare and Webcam Clearance",
  "mouse-wrist-rests": "Mouse Wrist Rests: Reach, Movement and Palm Support",
  "office-lumbar-cushions": "Lumbar Cushions: Chair Shape, Thickness and Seat-Depth Loss",
  "office-printer-stands": "Printer Stands: Loaded Size, Paper Paths and Cable Clearance",
  "overhead-book-scanners": "Overhead Book Scanners: Page Size, Flattening and OCR Workflow",
  "portable-photo-printers": "Portable Photo Printers: Print Size, Media and Phone Support",
  "ptz-conference-cameras": "PTZ Conference Cameras: Room Framing, Control and USB Support",
  "receipt-scanners": "Receipt Scanners: Single-Sheet Feeding, Paper Limits and Export",
  "rolling-file-cabinets": "Rolling File Storage: Open Cart or Drawer Cabinet?",
  "under-desk-foot-hammocks": "Desk Foot Hammocks: Attachment, Knee Space and Stable Support",
  "under-desk-pedal-exercisers": "Under-Desk Pedal Exercisers: Knee Clearance and Chair Movement",
  "vesa-monitor-adapters": "Non-VESA Monitor Adapters: Grip, Load and Port Clearance",
  "webcam-key-lights": "Webcam Key Lights: Position, Glare, Power and Mounting",
  "childproof-door-knob-covers": "Door Knob Covers: Knob Fit, Adult Access and Exit Checks",
  "childproof-refrigerator-locks": "Refrigerator Locks: Door Fit, Attachment and Adult Access",
  "covered-self-cleaning-litter-boxes": "Covered Automatic Litter Boxes: Interior Size and Sensor Limits",
};

export function publicDecisionNote(note: string) {
  return note
    .replace(/^(?:Strong purchase demand around|Current demand is strong but fragmented\.)\s*/i, "Check ")
    .replace(/^Niche pass[^.]+\.\s*/i, "")
    .replace(/^Independent from [^.]+ because\s*/i, "Check ")
    .replace(/^Independent from [^.]+ through\s*/i, "Check ")
    .replace(/^Kept separate from [^.]+ through\s*/i, "Check ")
    .replace(/^(?:Clear tool-system purchase:|Qualified around|Independent measurement purchase by|Independent physical-fit question covering|The independent question is environmental and installation fit:|Qualified as a DC compatibility purchase:)\s*/i, "Check ")
    .replace(/; it cannot be a generic bag-of-tools page\./i, ".")
    .replace(/^(?:Niche but open|Competitive but distinct|Clear independent purchase|Narrow but legitimate fit query|Niche threshold pass)[^.]*\.\s*/i, "")
    .replace(/\b(?:The page|This page|The draft|This guide|The guide|This|It) (?:must|will|should) (begin with|start with|record|explain|separate|compare|account for|choose|verify|recommend|require|reject|avoid|cover|distinguish|preserve|follow) /gi, (_match, verb: string) => ({ "begin with": "Start with", "start with": "Start with", record: "Record", explain: "Consider", separate: "Separate", compare: "Compare", "account for": "Account for", choose: "Choose", verify: "Verify", recommend: "Consider", require: "Require", reject: "Do not assume", avoid: "Avoid", cover: "Check", distinguish: "Distinguish", preserve: "Preserve", follow: "Follow" }[verb.toLowerCase()] ?? verb) + " ")
    .replace(/\b(?:This will be|It will be) /gi, "Compare ")
    .trim();
}

type Repair = Pick<Guide, "dek" | "searchQuestion" | "quickAnswer" | "sections" | "comparisonTable"> & { sources?: Guide["sources"] };
const repairs: Record<string, Repair> = {
  "under-desk-pedal-exercisers": {
    dek: "Measure moving knee clearance, chair stability and control reach, and distinguish powered pedal motion from manual resistance before choosing a desk exerciser.",
    searchQuestion: "Will a pedal exerciser fit under my desk while I work?",
    quickAnswer: "Measure moving knee clearance, not only the machine's height. Compare manual resistance with powered pedal motion, secure the chair against rolling, and check the control reach. The linked Putnen machine is motorized; Cubii fit guidance below is a separate manufacturer's example and does not establish Putnen dimensions or clearance.",
    comparisonTable: { title: "Measure the movement envelope", columns: ["How to check", "Reason to skip or change the setup"], rows: [
      { label: "Knees", values: ["Measure clearance to the lowest drawer, apron or desktop throughout the pedal stroke", "Knees contact the desk or the chair must be set outside a usable working position"] },
      { label: "Chair", values: ["Check whether pedaling moves the chair or rotates it away from the keyboard", "No suitable stable seating or restraint method allowed by the equipment instructions"] },
      { label: "Motor", values: ["Confirm whether pedals are driven, resisted manually, or support both modes", "Powered motion or control placement does not suit the user's intended use"] },
      { label: "Space", values: ["Include the complete machine footprint, pedals, cables and exit route", "The machine blocks chair movement or a clear way out"] },
    ] },
    sections: [
      { heading: "Measure in the chair you actually use", body: "Set the chair for normal keyboard use, then measure to the lowest obstruction under the desk. Static machine height does not describe the top of a moving knee. Cubii recommends two to three inches of knee clearance for its ellipticals; treat that as Cubii guidance, not a clearance specification for the linked Putnen model." },
      { heading: "Separate a powered leg mover from a manual exerciser", body: "A speed selector on a motorized device is not the same thing as a resistance control on a manually driven elliptical. Confirm the operating modes, stop control, allowed seated position and manufacturer instructions for the exact model. This page does not prescribe rehabilitation or claim calorie expenditure, circulation benefits or treatment outcomes." },
      { heading: "Fit the movement around work", body: "Check whether the chair stays in place, the keyboard remains within easy reach and the pedals can move without striking cables or drawers. Start with a short, supervised setup check using the manufacturer's directions. Scheduled standing or walking breaks are the simpler choice if the device makes the workstation awkward or blocks an exit." },
      { heading: "What remains unverified", body: "We have not measured the Putnen unit's full knee-motion envelope, noise or long-term reliability. Its historical listing identity is separate from the Cubii reference. Obtain its current manual and dimensions before treating it as a fit; no performance number is inferred from the listing title." },
    ],
    sources: [{ name: "Cubii desk-clearance guidance", url: "https://help.cubii.com/hc/en-us/articles/360036305813-Will-Cubii-ellipticals-fit-under-my-desk", note: "Cubii-specific clearance advice, not a Putnen measurement." }],
  },
  "vesa-monitor-adapters": {
    dek: "Check the exact monitor enclosure, attachment method, combined load and cable clearance before fitting a non-VESA screen to an arm.",
    searchQuestion: "Can my non-VESA monitor safely use this adapter and arm?",
    quickAnswer: "Prefer an adapter explicitly naming the exact monitor model. For a grip-style adapter, check the monitor body's thickness and shape, contact points, added weight, VESA pattern and unobstructed ports. Screen diagonal alone cannot establish fit. The linked Suptek adapter is not the VIVO example cited below.",
    comparisonTable: { title: "Two different ways to adapt a non-VESA screen", columns: ["Model-specific bracket", "Grip-style frame"], rows: [
      { label: "Fit evidence", values: ["Exact monitor model and attachment instructions", "Actual enclosure dimensions, shape and permitted grip points"] },
      { label: "Arm load", values: ["Display without stand plus adapter and attached accessories", "Display without stand plus complete frame and attached accessories"] },
      { label: "Reject the route when", values: ["The bracket names a nearby model instead of the actual display", "A grip obstructs ventilation, ports, controls or an unsuitable screen edge"] },
    ] },
    sections: [
      { heading: "Look for a model-specific mounting interface first", body: "Some non-VESA displays have a manufacturer-specific attachment behind the removable stand. Find the full monitor model, its mounting instructions and a bracket that explicitly names it. A generic gripping frame is a different mounting method and needs its own contact and retention checks." },
      { heading: "Count the adapter in the arm load", body: "The arm carries both the display without its stand and the complete adapter. Verify the actual VESA plate, screw lengths, recessed surfaces and the arm's minimum as well as maximum load. A nominal 100×100 pattern does not resolve where a gripping adapter holds a curved or unusually shaped enclosure." },
      { heading: "Inspect the screen edges and connections", body: "Draw every intended grip point on the exact display's enclosure. Reject a route that presses on an unsuitable panel edge, obstructs ventilation, blocks controls or covers a port needed by a cable. Check the full tilt and rotation travel with cables connected before accepting the installation." },
      { heading: "Keep the two manufacturers' limits separate", body: "VIVO MOUNT-UVM01 publishes its own thickness, screen-size and load limits. Those numbers do not qualify the linked Suptek B09STXZRMS adapter. This guide has no measured or manufacturer-confirmed pairing between that Suptek item and a particular monitor; the correct result for an unlisted pairing is unresolved." },
    ],
    sources: [{ name: "VIVO MOUNT-UVM01 compatibility", url: "https://vivo-us.com/collections/vesa-adapters/products/mount-uvm01", note: "Illustrates exact-adapter thickness, load and attachment conditions; not specifications for Suptek." }],
  },
  "receipt-scanners": {
    dek: "Compare the Epson RR-60’s individual-feed workflow with an automatic feeder or phone capture, including paper limits, export and software costs.",
    searchQuestion: "Is single-sheet receipt scanning enough for my workload?",
    quickAnswer: "The linked Epson RR-60 is a compact single-sheet scanner, not an automatic stack feeder. Choose it when feeding receipts individually suits the workload. Check allowed paper, carrier sheets, computer software and export before comparing speed; a phone capture workflow can be simpler for occasional receipts.",
    comparisonTable: { title: "Choose the document-handling workflow", columns: ["Epson RR-60", "Suitable automatic feeder", "Phone capture"], rows: [
      { label: "Feeding", values: ["One receipt at a time", "A stack within that exact model's paper limits", "Frame each receipt manually"] },
      { label: "Best reason to consider", values: ["Compact dedicated scanning and an acceptable individual-feed routine", "Repeated batches that justify the space and supported feeder path", "Occasional flat receipts with an existing phone"] },
      { label: "Check after capture", values: ["Fields, page edges and required export", "Double feeds, page order, fields and required export", "Glare, perspective, fields and required export"] },
    ] },
    sections: [
      { heading: "Decide whether individual feeding is acceptable", body: "Epson's RR-60 instructions describe loading one receipt at a time. A nominal scan speed does not include separating receipts, straightening them, feeding the next one or checking the captured fields. If the weekly workload is a large stack, compare a suitable automatic document feeder using its exact paper limits." },
      { heading: "Match the paper to the exact scanner instructions", body: "Read the RR-60 receipt specifications and carrier-sheet instructions before feeding thin, curled, damaged or irregular originals. Use the carrier sheet designed for that scanner where required, and support the original at entry and exit. Advice for RR-600W or another Epson scanner is not automatically an RR-60 instruction." },
      { heading: "Check the saved output, not only the preview", body: "Capture examples with faded totals, multiple taxes and a long receipt. Check the merchant, date, currency and total manually, then confirm the required PDF or data export opens in the accounting workflow. OCR is a transcription aid, not a guarantee of correct bookkeeping. Keep the original where your retention requirements call for it." },
      { heading: "When a phone is enough", body: "For occasional flat receipts, compare your existing phone and capture application before buying hardware. A scanner earns its place when the actual batch size, handling consistency or software export removes repeated work. Include software access and any renewal charges in the comparison." },
    ],
    sources: [
      { name: "Epson RR-60 / RR-70W receipt specifications", url: "https://epson.com/faq/SPT_B11B252204~faq-0000600-rr60_70w?faq_cat=faq-topFaqs", note: "Exact receipt and carrier-sheet conditions." },
      { name: "Epson RR-60 / RR-70W user guide", url: "https://files.support.epson.com/docid/cpd5/cpd59070.pdf", note: "Single-receipt feeding and operating instructions." },
    ],
  },
  "webcam-key-lights": {
    dek: "Compare an existing lamp, a monitor-mounted light and a separate stand by face lighting, screen reflections, mounting space and USB power.",
    searchQuestion: "Would better placement solve my video-call lighting first?",
    quickAnswer: "Start by moving the existing light and camera. Choose a panel only after checking face exposure, reflections in glasses, the actual clamp or stand footprint and USB power. The linked SWDPORT two-panel kit is not a Logitech Litra Glow; do not transfer Logitech output or mount specifications to it.",
    comparisonTable: { title: "Compare three lighting paths", columns: ["Existing lamp", "Monitor-mounted light", "Separate clamp or stand"], rows: [
      { label: "Placement", values: ["Try a useful angle near the camera", "Check the actual screen edge, tilt and webcam clearance", "Include the entire base or clamp and available reach"] },
      { label: "Power", values: ["Existing supported supply", "The exact light's USB or adapter requirements", "Supply for every panel used together"] },
      { label: "Keep or reject", values: ["Keep it if the meeting image already suits the task", "Reject an unsuitable edge load or blocked webcam", "Reject blocked desk movement or an obstructed cable path"] },
    ] },
    sections: [
      { heading: "Fix a bright window behind the chair first", body: "Frame the actual meeting application and compare the face with the background. Turn the desk or control the window where practical, then try a diffused existing lamp near the camera. A stronger front light can still leave an unpleasant result when the camera is exposing for a bright window." },
      { heading: "Place the light around the camera, glasses and screen", body: "Move the light to see where it reflects in glasses and glossy screens. Compare mounting height and side position without blocking the webcam or pressing an unsuitable screen edge. Logitech's Litra Glow setup guide demonstrates adjustment on its own monitor mount; that geometry is not a specification for the linked SWDPORT clamp kit." },
      { heading: "Check the complete mounting and power path", body: "Measure the stand or clamp, underside clearance and cable reach. Confirm the exact kit's supply requirements and whether both panels can use the available power sources together. Route cables clear of monitor-arm and standing-desk travel. Do not assume a laptop USB port supplies every advertised brightness mode." },
      { heading: "Keep a working lighting solution", body: "Check the final picture in the application people will see, at the time of day you normally call. If an existing lamp and a corrected angle produce a suitable result, keep them. We have not measured the linked kit's output, color accuracy, flicker or glare and do not assign it another manufacturer's results." },
    ],
    sources: [{ name: "Logitech Litra Glow setup guide", url: "https://www.logitech.com/assets/66170/litra-glow-qsg.ENG.pdf", note: "Exact Logitech mounting example; not a test or specification for the linked kit." }],
  },
  "rolling-file-cabinets": {
    dek: "Choose between an open letter-size hanging-file cart and an enclosed drawer cabinet, then check folder access, floor clearance and documented load limits.",
    searchQuestion: "Do I need an open file cart or an enclosed drawer cabinet?",
    quickAnswer: "The linked Sbanmao item is an open hanging-file cart described for letter-size folders. It is not an enclosed drawer cabinet, and this guide has not verified legal-size fit. Choose an open cart for frequent visible access; choose a suitable enclosed cabinet when privacy, drawers or document protection is the real requirement.",
    comparisonTable: { title: "The linked cart is not an enclosed cabinet", columns: ["Linked open Sbanmao cart", "Enclosed drawer cabinet"], rows: [
      { label: "File access", values: ["Visible top-access hanging files", "Access through drawers; allow full drawer travel"] },
      { label: "Paper fit", values: ["Listing names letter-size folders; legal-size fit unverified", "Check the selected rail and drawer configuration"] },
      { label: "Privacy and protection", values: ["No enclosed drawer or lock established", "Verify the actual enclosure, lock and usable interior"] },
      { label: "Unresolved facts", values: ["Current load rating and anti-tip behavior", "Loaded stability, clearances and any required anchoring"] },
    ] },
    sections: [
      { heading: "Choose open access or enclosed storage", body: "An open cart exposes file tabs and the stored papers. That can be convenient beside the desk, but it does not provide a drawer, a lock or protection from spills and dust. If the purchase requirement includes those features, use a cabinet that documents them; a low cart price does not make the two products equivalent." },
      { heading: "Measure the folders as well as the footprint", body: "Measure the actual hanging folders, tab height and usable rail separation. Check the full loaded height against the underside of the desk and allow room to lift a folder out. The linked item names letter-size use; legal-size support and any adjustable rail positions remain unverified." },
      { heading: "Allow room for wheels, feet and cables", body: "Draw the footprint with casters rotated into their widest position. Keep the cart out of chair travel and the leg area, and check the route over thresholds and the actual floor. Do not treat a castor lock as proof of stability on every slope or under a leaning load." },
      { heading: "Keep the load within documented limits", body: "We do not have a verified load rating or anti-tip test for the linked cart. Obtain its current assembly and load instructions, distribute documents as directed and avoid stacking equipment on an undesigned surface. When the purpose is only a small amount of paper, a fixed organizer on an existing shelf may remove the need for another wheeled object." },
    ],
  },
};

export function applyGuideEditorialRepair(guide: Guide): Guide {
  const repair = guide.site === "homeoffice" && guide.familySlug ? repairs[guide.familySlug] : undefined;
  if (!repair) return guide;
  return { ...guide, ...repair, decisionLayout: true, relatedGuides: [], communityEvidence: [], updatedAt: "October 20, 2026", sources: [...(repair.sources ?? []), ...(guide.sources ?? [])], comparisonTable: repair.comparisonTable ?? guide.comparisonTable };
}
