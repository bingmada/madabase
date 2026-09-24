import type { Guide } from "./types";

// Bounded repair of the six URL Inspection exceptions observed on 2026-09-24.
// Keep the existing route, title, category and merchant anchor. These worksheets
// replace generic cross-category copy with the actual buying decision.
const repairs: Record<string, Pick<Guide, "dek" | "quickAnswer" | "sections" | "comparisonTable" | "sources" | "relatedGuides">> = {
  "smarthome:smart-bathroom-exhaust-fans-buying-guide": {
    dek: "Choose a bathroom exhaust fan by duct and housing fit, ventilation controls and noise before considering Bluetooth audio or app-controlled lighting.",
    quickAnswer: "For automatic moisture control, look for an explicitly documented humidity sensor and fan-control behavior. A Bluetooth speaker or color-changing light does not establish humidity sensing, Matter support or remote fan control. If the existing fan moves air adequately, a compatible timer or humidity control may solve the problem without replacing the housing.",
    sections: [
      { heading: "Separate ventilation from speaker and lighting features", body: "Write down three independent functions: moving air outdoors, deciding when the motor runs, and controlling the light or speaker. Check the exact model manual for each. Broan's humidity-sensing guidance describes automatic operation in response to rising moisture; its Bluetooth fan specifications describe a different feature set. Do not transfer either manufacturer's capabilities to the linked ROJOSAN model without its own documentation." },
      { heading: "Measure the replacement before ordering", body: "Record the existing housing opening, duct diameter and route, ceiling access, switch arrangement and power requirements. Compare the new model's required opening and duct connection, airflow rating in CFM and noise rating in sones. A larger grille can hide an opening but cannot prove the housing or duct will fit. Have a qualified installer assess electrical work and the model's permitted installation location." },
      { heading: "Choose the least disruptive moisture-control change", body: "Choose a replacement fan when the present unit is unsuitable, damaged or cannot meet the installation requirements. Consider a compatible control upgrade when the motor and duct are suitable but users forget to run it. Keep a manual operating path and establish the sensor's adjustment and shutoff behavior from the manual. During the return period, check normal shower operation and accessible cleaning rather than using music playback as the success test." },
    ],
    comparisonTable: { title: "Which bathroom problem needs solving?", columns: ["Humidity-sensing fan", "Existing fan with compatible timer"], rows: [
      { label: "Operating trigger", values: ["Documented sensor response and adjustment range", "User starts a timed ventilation cycle"] },
      { label: "Installation", values: ["Housing, duct, power and location must all match", "Verify motor, switch and control compatibility"] },
      { label: "What Bluetooth proves", values: ["Only the audio/control functions named in that manual", "Nothing about ventilation capacity"] },
    ] },
    sources: [{ name: "Broan humidity-control guidance", url: "https://help.broan-nutone.com/en/bath-fans/What-should-I-do-if-I-cant-wait-for-moisture-to-clear-but-I-dont-want-a-fan-to-run-all-day-long-dba", note: "Manufacturer explanation of humidity sensing; not a specification for the marketplace anchor." }, { name: "Broan Bluetooth fan specification", url: "https://broan-nutone.com/getmedia/1c59afa7-2cc9-4404-8ce1-547113067423/Spec_Sheet_SPKN80RGBL_En_Fr.pdf", note: "Illustrates why ventilation, lighting and audio capabilities must be checked separately." }],
    relatedGuides: ["temperature-humidity-sensors-buying-guide", "indoor-air-quality-monitors-buying-guide"],
  },
  "homeoffice:office-lumbar-cushions-buying-guide": {
    dek: "Check whether a lumbar cushion fits the chair's backrest and leaves enough usable seat depth, or whether adjusting the existing chair is the better first step.",
    quickAnswer: "Adjust the chair before adding a cushion. A removable lumbar support can fill a missing lower-back contour, but its thickness also pushes the sitter forward. Skip a cushion that leaves too little seat support, forces a forward perch or cannot stay at the intended height. This is a fit worksheet, not evidence that a cushion treats pain.",
    sections: [
      { heading: "Start with the chair you already have", body: "Set seat height with feet supported and adjust the existing backrest and lumbar control. OSHA describes a removable back support or rolled towel as a temporary option when lumbar support is missing. Use that idea to assess whether a small change in contour helps the setup before choosing a larger cushion; it does not establish that any particular foam product will suit you." },
      { heading: "Check the seat depth left after adding thickness", body: "Sit back with the cushion in place and assess thigh support and clearance behind the knees. Check whether the armrests and keyboard are still reachable without leaning forward. A cushion can make a deep chair usable for one person yet crowd a shallower chair. Record the backrest width and strap route, and make sure the pad stays at the lower back during ordinary recline and repositioning." },
      { heading: "Evaluate mounting and cleaning, not a pain-relief promise", body: "For the QUTOOL marketplace anchor, verify the exact dimensions, strap arrangement, removable cover and cleaning directions on the selected variation. Do not assume the foam itself is washable because the cover is. Recheck placement after getting up and sitting down. Return a cushion that cannot maintain a workable position; consider a chair with a suitable adjustment range if added padding cannot solve the underlying fit." },
    ],
    comparisonTable: { title: "Cushion or chair adjustment?", columns: ["Removable lumbar cushion", "Existing adjustable backrest"], rows: [
      { label: "Good reason to choose", values: ["Missing contour and enough remaining seat depth", "The chair can already position support correctly"] },
      { label: "Fit check", values: ["Thickness, height, strap stability and thigh support", "Backrest height, depth and recline settings"] },
      { label: "Stop condition", values: ["Forward perching or uncomfortable pressure", "Adjustment range cannot fit the sitter"] },
    ] },
    sources: [{ name: "OSHA workstation chairs", url: "https://www.osha.gov/etools/computer-workstations/components/chairs", note: "Chair adjustment and temporary removable lumbar-support guidance; no product-specific treatment claim." }],
    relatedGuides: ["office-seat-cushions-buying-guide", "office-chair-mats-buying-guide"],
  },
  "homeoffice:office-printer-stands-buying-guide": {
    dek: "Size a printer stand with trays extended, scanner lid open and cables connected. Compare a fixed shelf with a rolling cart before buying extra storage.",
    quickAnswer: "Use the printer's operating footprint, not its closed-box dimensions. The stand must support the printer and supplies while leaving space to load paper, open the scanner and clear jams. A wheeled cart is useful only if it can be secured for use and moved without pulling power or data cables.",
    sections: [
      { heading: "Measure an entire print-and-scan cycle", body: "Open every tray and cover you use, including the rear feed and scanner lid. Mark the occupied area and the access needed to reload paper or replace ink or toner. Epson's installation-space guidance illustrates that operating clearance is model-specific; use your own printer manual rather than borrowing dimensions from another model. Check that an under-desk position still allows those movements." },
      { heading: "Check load and usable shelf dimensions separately", body: "Compare the loaded printer weight with the stated capacity of the shelf that will actually hold it. A cart's total capacity is not necessarily the top shelf's rating. Account for shelf lips, support posts and handles that reduce usable space. Put heavy stored supplies where the stand's instructions permit and keep the printer's vents and service panels unobstructed." },
      { heading: "Decide whether wheels help your workflow", body: "A fixed stand suits a permanent printing position with enough access. A rolling cart can bring a scanner out from under a desk, but check caster locks, floor clearance and cable slack before moving it. For the GYIIYUO listing, verify the selected stand's actual shelf dimensions, load limits and assembly instructions; product photos cannot establish stability. Test paper loading and scanning before filling every shelf." },
    ],
    comparisonTable: { title: "Fixed shelf or rolling printer cart?", columns: ["Fixed stand", "Rolling cart"], rows: [
      { label: "Best location", values: ["Enough permanent access around the printer", "A stored position plus a clear operating position"] },
      { label: "Critical measurement", values: ["Shelf area with all trays and covers open", "Travel clearance, caster locks and cable reach"] },
      { label: "Common mismatch", values: ["The printer fits but the scanner cannot open", "The cart moves but the connected cables cannot"] },
    ] },
    sources: [{ name: "Epson installation-space guidance", url: "https://files.support.epson.com/docid/cpd6/cpd61762.pdf", note: "Example of model-specific clearance for paper ejection and consumable replacement; use the manual for your own printer." }],
    relatedGuides: ["monochrome-laser-printers-buying-guide", "compact-color-inkjet-printers-buying-guide"],
  },
  "baby:childproof-door-knob-covers-buying-guide": {
    dek: "Check a door-knob cover's shape, secure assembly and adult emergency access. Lever handles and knobs require different hardware.",
    quickAnswer: "A knob cover must fit the actual round knob, remain securely assembled and let an adult open the door quickly. It is an extra barrier, not a guarantee that a child cannot open the door. Do not use a round-knob cover as a substitute for hardware designed for a lever handle.",
    sections: [
      { heading: "Identify the handle before choosing a cover", body: "Measure the knob and the space between it and the door or trim. Check the exact cover's supported shapes and assembly directions; a decorative oval knob may behave differently from the round knob in a listing photo. For the AILUOQI marketplace anchor, confirm the variation and included pieces instead of assuming every multipack fits the same hardware." },
      { heading: "Test adult access before relying on the barrier", body: "CPSC recommends sturdy door-knob covers that adults can open quickly in an emergency. After fitting one, have the adults who use that door check operation and make sure the door still latches normally. If the cover jams, comes apart or makes necessary access difficult, stop using that setup. Keep any removed or broken pieces away from children." },
      { heading: "Keep the room-safety plan independent of the cover", body: "Decide what hazard is behind the door and maintain the appropriate storage, supervision and access controls for that hazard. Check the cover's condition and fit regularly, especially as the child learns new ways to grip and turn it. A successful installation check today does not prove continued resistance. Follow the manufacturer's intended use; do not improvise locking arrangements that interfere with emergency exit." },
    ],
    comparisonTable: { title: "Choose hardware for the actual handle", columns: ["Round-knob cover", "Lever-specific device"], rows: [
      { label: "Required match", values: ["Knob size, shape and clearance", "Lever geometry, mounting surface and swing"] },
      { label: "Adult check", values: ["Quick opening without loose pieces", "Quick operation using the specified mechanism"] },
      { label: "Ongoing limit", values: ["Children may learn to operate it", "Installation and supervision still matter"] },
    ] },
    sources: [{ name: "CPSC childproofing guidance", url: "https://www.cpsc.gov/s3fs-public/252ChildproofingYourHome32123.pdf?VersionId=dg2zlj6_mhYID_xCiup3_1wgCCI2xVvA", note: "Door-knob cover strength and adult emergency access; devices do not replace supervision." }],
    relatedGuides: ["childproof-cabinet-locks-buying-guide", "hardware-mounted-baby-gates-buying-guide"],
  },
  "baby:toddler-snack-containers-buying-guide": {
    dek: "Compare a soft-opening snack cup with a lidded food box by hand access, food fit, cleaning and supervised seated use.",
    quickAnswer: "Choose a snack container around the food and the child's ability to reach it. A flexible opening can reduce some spills but does not make food safe to eat while walking or playing. For wet food or a bag that gets tipped over, check an actual sealed lid rather than assuming a snack-cup opening is leakproof.",
    sections: [
      { heading: "Match the opening to the food and the hand", body: "Check whether the child can comfortably put a hand through the opening and release a piece of food without trapping the hand or tipping the cup. Compare a flexible flap with a simple open bowl used at the table. For the Dilovely anchor, verify the exact lid, handles and material on the chosen variation; a shared product name does not prove identical construction." },
      { heading: "Keep food preparation separate from spill control", body: "The American Academy of Pediatrics identifies choking as a concern for young children and advises appropriate food preparation and attentive eating routines. A container does not change the size, shape or texture of the food inside. Offer suitable food while the child is seated and supervised; do not let the promise of fewer crumbs determine where or how the child eats." },
      { heading: "Check cleaning and travel closure before buying", body: "Look for seams and removable parts that can trap food. Read the exact washing and temperature instructions and check the container after cleaning for retained food or damaged pieces. A separate travel lid can be useful, but verify whether it seals and how it is stored during use. If the meal includes several textures or wet food, a washable lidded food box may be easier to manage than a snack cup." },
    ],
    comparisonTable: { title: "Snack cup or lidded food box?", columns: ["Soft-opening snack cup", "Lidded food box"], rows: [
      { label: "Access", values: ["Child reaches through an opening", "Adult opens the lid for seated eating"] },
      { label: "Travel check", values: ["Flaps alone do not establish a leakproof seal", "Confirm lid and seal for the actual contents"] },
      { label: "Cleaning check", values: ["Flaps, rim and removable components", "Corners, dividers and lid gasket"] },
    ] },
    sources: [{ name: "AAP choking prevention", url: "https://www.healthychildren.org/English/health-issues/injuries-emergencies/Pages/Choking-Prevention.aspx", note: "Food preparation and supervised eating guidance; no container safety certification." }],
    relatedGuides: ["toddler-straw-cups-buying-guide", "roll-up-feeding-bibs-buying-guide"],
  },
  "network:usb-wifi-adapters-buying-guide": {
    dek: "Choose a USB Wi-Fi adapter by operating system, hardware revision, driver support and antenna placement before comparing advertised wireless speeds.",
    quickAnswer: "Check driver support for the exact operating system and hardware revision first. A USB Wi-Fi adapter replaces or adds a computer's wireless interface; it cannot fix a weak connection between the room and the router by specification alone. If a cable is practical, compare a supported USB Ethernet adapter before buying another radio.",
    sections: [
      { heading: "Confirm the driver before the adapter arrives", body: "Record the computer's operating system and version, USB connector and available port. Match the adapter's full model and hardware revision to the manufacturer's download page. TP-Link publishes different driver choices by version; support for an older macOS release does not establish support for a current Mac. Download the correct official installer through a working connection if this computer has no other network access." },
      { heading: "Understand the Archer T2U Plus anchor", body: "The linked product is the TP-Link Archer T2U Plus AC600 family anchor. Treat AC600 as a wireless class, not a promise of internet speed, and verify the exact revision and OS support on the listing and TP-Link support page. Choose a newer adapter only if the computer, router and intended band can use its capabilities. Do not install an unrelated model's driver because its antenna looks similar." },
      { heading: "Test placement and connection stability", body: "Compare the adapter in its intended position with the computer's existing connection using the same router and location. Look for reliable reconnection after sleep, a sustained transfer and normal video-call behavior. A rear port behind a metal desktop may put the antenna in an inconvenient position; a supported extension or external-base design can offer placement flexibility. If every device struggles in the room, investigate coverage before concluding the computer's adapter is the only problem." },
    ],
    comparisonTable: { title: "USB Wi-Fi or USB Ethernet?", columns: ["USB Wi-Fi adapter", "USB Ethernet adapter"], rows: [
      { label: "Infrastructure", values: ["Usable wireless coverage at the computer", "A practical cable route to the network"] },
      { label: "Compatibility", values: ["OS, hardware revision, driver and supported bands", "OS, driver, USB link and Ethernet port speed"] },
      { label: "Useful test", values: ["Placement, sleep recovery and sustained connection", "Link negotiation and a sustained wired transfer"] },
    ] },
    sources: [{ name: "TP-Link Archer T2U Plus downloads", url: "https://www.tp-link.com/us/support/download/archer-t2u-plus/", note: "Select the hardware revision and operating system before downloading a driver." }],
    relatedGuides: ["usb-c-ethernet-adapters-vs-alternatives", "indoor-wifi-access-points-vs-alternatives"],
  },
};

export function applyIndexingRepair(guide: Guide): Guide {
  const repair = repairs[`${guide.site}:${guide.slug}`];
  if (!repair) return guide;
  return {
    ...guide,
    ...repair,
    updatedAt: "September 24, 2026",
    sources: [...(repair.sources ?? []), ...(guide.sources ?? []).filter(source => !repair.sources?.some(item => item.url === source.url))],
    editorialMethod: ["Research worksheet based on the linked primary guidance and the exact merchant listing. No hands-on testing, measured performance or live-stock claim is implied."],
  };
}
