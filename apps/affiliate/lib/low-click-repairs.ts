import type { Guide } from "./types";

// Existing canonicals reviewed against exact-page GSC queries on September 24.
const repairs: Record<string, Partial<Guide>> = {
  "baby:automatic-bottle-washers-vs-alternatives": {
    quickAnswer: "Choose a bottle washer when washing milk residue from compatible bottles and parts is the daily bottleneck. Choose a sterilizer-dryer when washing already works and you mainly need a permitted sanitizing or drying step. Check whether an existing dishwasher can do the job before adding another appliance.",
    sections: [
      { heading: "Separate washing from sanitizing and drying", body: "A sterilizer-dryer starts with items that have already been cleaned. It does not replace washing away milk residue. A bottle washer adds that washing step, but only for parts and loading arrangements its instructions permit. CDC says a dishwasher using hot water and heated drying or a sanitizing setting does not need a separate sanitizing step for dishwasher-safe feeding items." },
      { heading: "Count the full disassembled load", body: "Lay out one normal batch of bottles, nipples, rings, valves, and pump parts. Check both the item maker's cleaning instructions and the machine's rack diagram. A four-bottle headline does not promise room for four bottles plus every pump part. Small pieces need secure placement, and nested or obstructed parts can prevent water from reaching the surfaces that need cleaning." },
      { heading: "Measure hands-on work, not just cycle time", body: "Compare scraping or rinsing as instructed, disassembly, loading, reservoir filling, drain emptying, unloading, and machine cleaning. A longer unattended cycle may still save effort; a fast cycle that needs several small loads may not. Measure lid-open counter clearance and confirm the water and drain arrangement before ordering." },
      { heading: "Include detergent and machine maintenance", body: "Price the exact approved detergent, replacement filters where required, descaling supplies, and routine cleaning. Do not substitute ordinary foaming dish soap in a machine unless its instructions expressly allow it. Keep a workable manual-washing setup for incompatible parts, a failed cycle, or an appliance outage." },
      { heading: "Check the result before relying on the machine", body: "Inspect accessible surfaces after the first correctly loaded cycles. If residue remains, re-clean the items using an approved method and resolve the loading or machine problem before reuse. Let parts dry thoroughly before storage. Follow CDC guidance and your baby's care team's advice on additional sanitizing; a machine's convenience claim does not establish suitability for a particular infant." },
    ],
    comparisonTable: { title: "Which cleaning path removes your actual bottleneck?", columns: ["Bottle washer", "Sterilizer-dryer", "Existing dishwasher or manual routine"], rows: [
      { label: "Starting point", values: ["Washes permitted items using its approved loading and detergent", "Requires thoroughly washed items", "Clean using the exact item's permitted method"] },
      { label: "Fit check", values: ["Rack positions, jets, small parts, and full batch", "Heat tolerance and space for disassembled parts", "Dishwasher safety or access for brushing and rinsing"] },
      { label: "Daily work", values: ["Load, supply water, handle drain, unload, clean machine", "Wash separately, load, add water as required, unload", "Basket or basin setup, washing, drying, and storage"] },
      { label: "Best reason to choose", values: ["Repeated washing work is the measured bottleneck", "Washing works; permitted sanitizing or drying is the remaining job", "Current method handles the load without another appliance"] },
    ] },
    sources: [{ name: "CDC: clean, sanitize, and store infant feeding items", url: "https://cdc.gov/hygiene/about/clean-sanitize-store-infant-feeding-items.html", note: "Cleaning before sanitizing, dishwasher conditions, drying, and storage." }, { name: "Baby Brezza product manuals", url: "https://babybrezza.com/pages/user-manuals-united-states", note: "Use the Bottle Washer Pro instructions for its exact loading, detergent, maintenance, and water requirements; other models differ." }],
  },
  "baby:infant-bath-tubs-safety-and-skip-guide": {
    dek: "Check supervision, the tub's approved surface, child support, locks, drainage, and when to stop using an infant bath tub.",
    quickAnswer: "Keep the baby within an adult's reach throughout the bath. Gather supplies first, use only the surface and support arrangement permitted by the exact tub instructions, and take the baby with you if you must leave. A seat, cushion, thermometer, or nonslip label does not replace supervision.",
    sections: [
      { heading: "Stay within reach for the whole bath", body: "CPSC warns that young children must never be left alone near water, even briefly, or left under another young child's care. Put towels and supplies within reach before starting. If something interrupts you, take the baby out and with you. Drain the tub immediately after use." },
      { heading: "Use only the surface and support approved for this tub", body: "Check the exact model instructions for floor, sink, or adult-tub placement; a countertop photo is not permission to use an elevated surface. Engage every folding lock and confirm a stable base before adding water or the child. Never lift or move a tub with the baby inside. A floating cushion or insert must be explicitly approved for that model and the baby's current stage." },
      { heading: "Check water and support independently", body: "Check water temperature before placing the baby and during bathing as the instructions require; a built-in display can fail or read a different part of the water. Maintain the required hands-on support. Do not increase water depth or improvise extra padding to compensate for poor fit. Follow the tub's limits when the baby grows or changes movement abilities." },
      { heading: "Stop when the setup cannot stay stable", body: "Do not use a cracked tub, loose latch, leaking plug, slipping base, missing part, recalled product, or an insert that cannot hold its intended position. Check the model and applicable recall information, then contact the manufacturer for an approved remedy. Clean and dry the underside, seams, drain, and insert as instructed before storing." },
    ],
    comparisonTable: { title: "Before every bath", columns: ["Check", "Stop or change the setup when"], rows: [
      { label: "Adult attention", values: ["Supplies ready and baby within reach", "You need to leave or cannot maintain supervision"] },
      { label: "Surface and locks", values: ["Manual-approved surface; locks engaged", "The tub slips, rocks, leaks, or has a damaged latch"] },
      { label: "Child and insert", values: ["Correct support for the current size and stage", "Limits are exceeded or unapproved padding is needed"] },
      { label: "After bathing", values: ["Remove baby, drain, clean, and dry", "Standing water or trapped moisture remains"] },
    ] },
    sources: [{ name: "CPSC infant bath tub safety guidance", url: "https://www.cpsc.gov/CPSC-Approves-New-Federal-Safety-Standard-for-Infant-Bath-Tubs", note: "Drowning, falls, and continuous adult-supervision guidance; use the exact product instructions for placement and fit." }],
  },
  "baby:nursery-glider-chairs-safety-and-skip-guide": {
    dek: "Check caregiver alertness, getting up safely, recline clearance, pinch points, cords, and why a nursery glider is not an infant sleep space.",
    quickAnswer: "A glider is an adult chair, not a place for a baby to sleep. Avoid feeding in a soft armchair when you might fall asleep. Move the baby to an appropriate separate sleep surface, and stop using a chair whose motion, seat depth, or footrest prevents a controlled transfer or safe exit.",
    sections: [
      { heading: "Plan for tired feeds before choosing a chair", body: "The American Academy of Pediatrics warns against sleeping with an infant on a couch or soft armchair. A recline setting, nursing pillow, or comfortable cushion does not make a glider an infant sleep surface. Arrange a separate firm, flat infant sleep space nearby and plan another caregiver's help when you are too sleepy to hold or feed safely." },
      { heading: "Test getting in and out before holding the baby", body: "Check seat height and depth, reachable armrests, and the control needed to stop the motion. Rehearse sitting, standing, and operating the footrest without a baby first. Skip a chair that makes you lurch forward, pull on furniture, or reach behind while getting up. Manufacturer weight and assembly limits still apply." },
      { heading: "Measure the whole motion path", body: "With the chair empty, check full glide, swivel, and recline clearance against the crib, walls, curtains, and walkways. Keep children and pets away from moving joints and the footrest mechanism. Route power and charging cords outside those moving parts and outside the baby's reach; do not let convenience sockets determine an unsafe chair position." },
      { heading: "Stop for damage or an unreliable mechanism", body: "Stop using a chair with a loose base, failed motion lock, damaged cable, unstable recline, or exposed pinch or entrapment point. Follow the exact model's maintenance and recall instructions. Added straps, wedges, and improvised repairs are not a substitute for an approved repair or replacement." },
    ],
    comparisonTable: { title: "Glider safety and skip decisions", columns: ["Useful check", "Reason to skip or stop"], rows: [
      { label: "Alertness", values: ["Plan a safe transfer and help for tired feeds", "Risk of falling asleep with the baby on the chair"] },
      { label: "Standing up", values: ["Feet supported; controls and armrests reachable", "Cannot stop motion or stand under control"] },
      { label: "Motion clearance", values: ["Full empty-chair recline and swivel check", "Blocks a crib, doorway, or caregiver walking path"] },
      { label: "Mechanism", values: ["Stable base, safe cords, intact joints", "Damage, loose parts, pinch points, or a recall"] },
    ] },
    sources: [{ name: "AAP safe sleep guidance for parents", url: "https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx", note: "Safe infant sleep surfaces and the risks of sleeping with an infant on a soft armchair or couch." }, { name: "AAP tips for sleep-deprived parents", url: "https://healthychildren.org/English/ages-stages/baby/sleep/Pages/safe-sleep-tips-for-sleep-deprived-parents.aspx", note: "Plan feeding and caregiver support around the possibility of falling asleep." }],
  },
  "homeoffice:video-call-setup-guide": {
    quickAnswer: "Start with the call preview: choose the intended camera, microphone, and speaker; light the face; frame at eye level; then test a short recording or test call from the real desk. Fix the failing part before buying equipment. A sharper webcam will not solve echo, a backlit face, or an unstable connection.",
    sections: [
      { heading: "Check the devices selected by the meeting app", body: "A connected dock or headset can change the active microphone, speaker, or camera. Select each intended device in the app, play its speaker test, record and replay a short microphone sample, and check mute. Use the same dock, cables, and laptop power setup that you will use during the meeting." },
      { heading: "Light the face and set the camera before upgrading it", body: "Open the video preview at your normal meeting time. Move a bright window out of the background, put soft light near the camera, and adjust brightness until the face is clear without washing out detail. Bring the camera to a comfortable eye-level position. If you wear glasses, change the light's position and angle before adding brightness." },
      { heading: "Choose one audio path to prevent echo", body: "For one person in a shared or noisy room, a suitable headset can keep playback out of the microphone. For several people at one desk, test a speakerphone from every seat. Avoid joining nearby devices with both microphones and speakers active. Keep mute and volume within reach rather than solving feedback mid-call." },
      { heading: "Test the actual connection and screen-sharing routine", body: "Use the meeting service's test call from the desk. Check video, speech, and a sample screen share with ordinary background traffic. If calls break up, compare a practical wired connection or a stronger Wi-Fi location before replacing the camera. Prepare the files you will share and close private windows; confirm the app can share the intended screen." },
      { heading: "Keep a usable fallback", body: "Know how to reselect the built-in microphone and camera if a dock disconnects. Keep a charged headset or the meeting's permitted phone-audio option available when the call matters. Before joining, check framing, sound, mute, power, and the controls needed during the call." },
    ],
    comparisonTable: { title: "Match the symptom to the first check", columns: ["First check", "Possible equipment change after testing"], rows: [
      { label: "Dark face", values: ["Window direction and light position", "A small adjustable face light"] },
      { label: "Echo or room noise", values: ["Selected mic/speaker and duplicate audio", "A suitable headset or speakerphone"] },
      { label: "Awkward framing", values: ["Eye-level camera and seated position", "A stable stand or mount"] },
      { label: "Interrupted video", values: ["Connection and ordinary network load", "Wired networking or a better access-point position"] },
    ] },
    sources: [{ name: "Zoom test meeting", url: "https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0063307", note: "Official method for checking a connection, audio, and video before a meeting." }, { name: "Zoom audio testing", url: "https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0062765", note: "Official speaker and microphone selection and test workflow." }],
  },
};

export function applyLowClickRepair(guide: Guide): Guide {
  const repair = repairs[`${guide.site}:${guide.slug}`];
  return repair ? { ...guide, ...repair, updatedAt: "September 24, 2026", editorialMethod: ["Based on the primary guidance linked on this page. Product-specific limits require the exact model's current instructions; no hands-on test is claimed."] } : guide;
}
