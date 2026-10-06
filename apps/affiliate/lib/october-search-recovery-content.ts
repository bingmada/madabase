import type { Guide } from "./types";

// Query-led recovery for the canonicals retained in the October 6 consolidation.
// These are research worksheets, not hands-on reviews. Each page keeps one user
// decision, cites primary guidance, and states the checks that must still happen
// on the exact product or computer before purchase.
const recoveryGuides: Record<string, Partial<Guide>> = {
  "homeoffice:dual-screen-portable-monitors-vs-alternatives": {
    dek: "Choose a freestanding dual portable monitor, a laptop-mounted screen extender, or one conventional monitor by host display limits, cable count, travel weight, desk depth, and the way the screens are supported.",
    quickAnswer: "Start with the laptop, not the display bundle. Confirm how many external displays the exact computer supports, which ports carry video, and whether each screen needs separate power. Choose a freestanding stacked monitor when the desk can support it without loading the laptop lid; choose a lid-mounted extender only when the laptop, hinge, screen size, travel weight, and cable path all pass. A permanent desk monitor is usually the simpler choice when portability is not part of the job.",
    governance: {
      decision: "merge",
      independentDemand: "Portable dual monitor versus laptop screen extender for an exact laptop and travel workflow.",
      distinctFrom: "Buying, fit, ownership, and setup checks now support one comparison instead of competing as five generic pages.",
      benchmark: "One host-specific wiring plan, one physical-support test, one travel test, and an explicit conventional-monitor alternative.",
    },
    comparisonTable: {
      title: "Portable dual monitor, lid extender, or desk monitor?",
      columns: ["Freestanding dual portable monitor", "Laptop-mounted extender", "Conventional desk monitor"],
      rows: [
        { label: "Support", values: ["Its own stand on a stable surface", "Laptop lid and hinge carry the assembly", "Permanent stand or monitor arm"] },
        { label: "Host check", values: ["Two video streams, ports, cables, and power", "Exact laptop size plus supported display count", "One supported video path per display"] },
        { label: "Best use", values: ["Repeatable temporary desk with more screen area", "Compact all-in-one travel setup after a fit test", "Daily fixed workstation"] },
        { label: "Skip when", values: ["Desk depth or cable count makes setup fragile", "The lid flexes, vents are blocked, or weight is excessive", "The workstation must pack and move often"] }
      ]
    },
    sections: [
      { heading: "Write the host display limit before comparing screens", body: "Record the exact laptop model, chip or GPU, operating system, available ports, and the number of external displays the manufacturer supports. Identical USB-C connectors can expose different video capabilities. Apple explicitly ties display count to the Mac model plus resolution and refresh rate; a display accessory cannot raise that host limit simply because it has two panels." },
      { heading: "Draw one cable and power path per panel", body: "For each screen, write the source port, cable, adapter, power source, target resolution, and refresh rate. Confirm whether one USB-C connection carries video and sufficient power or whether a second cable is required. A tidy product photo is not evidence that the exact laptop will drive both panels from one port." },
      { heading: "Separate screen support from portability", body: "A freestanding stacked unit puts weight on its own stand but needs desk depth and a stable surface. A lid-mounted extender reduces stand clutter but transfers load and leverage to the laptop. Test hinge movement, vent clearance, webcam clearance, cable strain, and the ability to type without screen movement before the return window closes." },
      { heading: "Run a real pack-and-work trial", body: "Pack the displays, stand, power supply, adapters, and protective case, then set up at the smallest surface you actually use. Check total carried weight, setup time, screen stability, sleep-and-wake recovery, and whether the laptop can still be positioned comfortably. If the equipment stays on one desk, compare a normal monitor before paying a portability premium." }
    ],
    sources: [
      { name: "Apple: Connect displays to your Mac", url: "https://support.apple.com/en-us/102555", note: "Official host-model, port, cable, display-count, resolution, and refresh-rate checks." },
      { name: "Apple: If an external display is dark or low resolution", url: "https://support.apple.com/en-gb/102501", note: "Official cable, adapter, DisplayPort Alt Mode, direct-connection, and troubleshooting limits." }
    ],
    editorialMethod: ["Research-synthesis decision worksheet using current manufacturer support documentation. No hands-on display, hinge-load, brightness, color, or travel test is claimed."],
  },
  "homeoffice:business-usb-c-monitors-vs-alternatives": {
    dek: "Compare a USB-C hub monitor with a separate dock by host video support, charging wattage, USB and Ethernet needs, second-monitor topology, desk ownership, and replacement risk.",
    quickAnswer: "Choose a USB-C hub monitor when one laptop, one primary screen, modest peripherals, and one-cable desk arrival are the real job. Choose a separate dock when several workstations must share the same connectivity standard, the monitor should be replaceable independently, or the desk needs ports and display paths the monitor does not provide. Confirm video, charging, data, and downstream-display support separately; the USB-C shape proves none of them by itself.",
    governance: {
      decision: "merge",
      independentDemand: "USB-C hub monitor versus a conventional monitor plus dock for a business desk.",
      distinctFrom: "The former buying, fit, ownership, and workflow URLs now answer one topology decision.",
      benchmark: "A port-by-port plan covering host video, power delivery, data rate, Ethernet, downstream display support, and replacement ownership.",
    },
    comparisonTable: {
      title: "Where should the desk hub live?",
      columns: ["USB-C hub monitor", "Monitor plus separate dock"],
      rows: [
        { label: "Best fit", values: ["One primary laptop and a stable desk standard", "Mixed laptops, richer ports, or independently replaceable parts"] },
        { label: "Verify", values: ["Host DP Alt Mode or Thunderbolt, power, USB speed, Ethernet, MST or Thunderbolt out", "Dock host support, power supply, display technology, cables, and monitor inputs"] },
        { label: "Failure impact", values: ["Monitor service can also remove the desk hub", "Dock and monitor can be replaced separately"] },
        { label: "Common mistake", values: ["Assuming every USB-C port carries video and charging", "Assuming two display sockets override the laptop GPU limit"] }
      ]
    },
    sections: [
      { heading: "Treat USB-C video, charging, and data as separate claims", body: "Record the monitor's upstream USB-C functions: DisplayPort Alt Mode or Thunderbolt, host charging wattage, USB data speed, Ethernet, and any downstream video port. Then match each one to the exact laptop. A cable that charges can still fail to carry video or full-speed data, and a monitor's listed wattage may be below a workstation laptop's normal adapter." },
      { heading: "Map the second monitor before buying", body: "Dell documents that DisplayPort daisy chaining requires MST-capable paths and that macOS extended-display behavior differs from Windows unless Thunderbolt is used. Write the primary monitor input, downstream output, second monitor input, OS behavior, total bandwidth, resolution, and refresh rate. HDMI does not become a daisy-chain output simply because the first monitor has HDMI." },
      { heading: "Compare the whole replacement boundary", body: "A hub monitor reduces boxes and cables, but a monitor repair or upgrade can also remove charging, Ethernet, and USB ports. A separate dock adds another device and power supply while allowing the display and connectivity layer to change independently. For managed fleets, include warranty handling, spare availability, cable standardization, and firmware ownership." },
      { heading: "Test one-cable arrival with the real workload", body: "Connect the normal keyboard, mouse, camera, storage, Ethernet, audio, and second display, then test charging under load, sleep-and-wake recovery, video calls, and a sustained file transfer. If one function drops or the laptop slowly discharges, solve that exact bottleneck rather than assuming a more expensive monitor will fix every USB-C limitation." }
    ],
    sources: [
      { name: "Dell: Daisy-chain monitors", url: "https://www.dell.com/support/contents/en-us/article/product-support/self-support-knowledgebase/monitor-screen-video/guide-daisy-chain-monitors", note: "Official MST, USB-C DP Alt Mode, Thunderbolt, macOS, bandwidth, cable, and display-topology guidance." },
      { name: "Apple: Connect displays to your Mac", url: "https://support.apple.com/en-us/102555", note: "Official reminder that display support depends on the exact Mac model, resolution, refresh rate, ports, and cables." }
    ],
    editorialMethod: ["Research-synthesis topology worksheet based on official computer and monitor support material. No monitor image-quality, charging, or fleet deployment test is claimed."],
  },
  "homeoffice:dual-monitor-kvm-switches-vs-alternatives": {
    dek: "Choose a dual-monitor KVM, USB switch, monitor-input workflow, or KVM dock by drawing both computers' complete display, USB, charging, and EDID paths.",
    quickAnswer: "Use a dual-monitor KVM only when both computers can supply the required two display streams and the switch matches every connector, resolution, refresh rate, USB device, and control method. A USB switch plus the monitors' own inputs is often simpler when display switching can be manual. Add a dock only for the laptop ports and charging it actually needs; a dock and a KVM solve different jobs.",
    governance: {
      decision: "merge",
      independentDemand: "How to share two monitors and USB peripherals between two exact computers.",
      distinctFrom: "Buying, compatibility, cost, and setup now live on one wiring decision page.",
      benchmark: "A complete two-host signal map plus a lower-complexity fallback that can be tested before purchase.",
    },
    comparisonTable: {
      title: "Pick the smallest switching topology that works",
      columns: ["Dual-monitor KVM", "USB switch plus monitor inputs", "KVM dock"],
      rows: [
        { label: "Switches", values: ["Two display paths plus USB", "USB only; displays switch separately", "Displays, USB, and selected laptop charging"] },
        { label: "Host requirement", values: ["Two compatible display outputs from each host", "Each host reaches monitor inputs directly", "Exact USB-C or Thunderbolt host support"] },
        { label: "Best for", values: ["Frequent one-button full-desk switching", "Stable desk where manual input changes are acceptable", "Laptop-heavy desk with verified single-cable needs"] },
        { label: "Main risk", values: ["EDID, refresh, cable, and peripheral compatibility", "More buttons and cables", "Proprietary topology and charging limits"] }
      ]
    },
    sections: [
      { heading: "Draw four display paths before shopping", body: "For each computer, draw display 1 and display 2 from the host or dock through the KVM to the monitor input. Label connector, protocol, resolution, refresh rate, HDR or VRR need, and cable length. A laptop that supports only one native external display does not gain a second native stream because the KVM has two output sockets." },
      { heading: "Keep the dock and KVM jobs separate", body: "A dock expands one computer's ports and may charge it. A KVM switches displays and peripherals between computers. Some devices combine both, but the combined product must still match the laptop's host protocol, power requirement, display count, and the desktop computer's outputs. Price every required adapter and power supply." },
      { heading: "Check EDID and inactive-host behavior", body: "KVMs differ in how they present monitor identity to each computer. ATEN's documentation exposes selectable EDID modes, showing why resolution behavior is a product-level capability rather than a generic KVM promise. Test window rearrangement, wake from sleep, hotkeys, audio, webcam, storage, and whether the inactive host still sees stable displays." },
      { heading: "Prove the simpler fallback first", body: "If each monitor already has two usable inputs, connect both computers directly and switch only keyboard and mouse with a USB switch. Test that routine for several workdays. Move to a full KVM only when the extra display switching saves enough repeated friction to justify the compatibility and cable complexity." }
    ],
    sources: [
      { name: "ATEN CM1942 user manual", url: "https://assets.aten.com/product/manual/cm1942-user-manual-w.pdf", note: "Official dual-display KVM setup and EDID-mode evidence; exact behavior remains model-specific." },
      { name: "Apple: Connect displays to your Mac", url: "https://support.apple.com/en-us/102555", note: "Official host display-count and cable checks for Mac desks." }
    ],
    editorialMethod: ["Research-synthesis wiring worksheet using official KVM and host documentation. No switching-latency, high-refresh, EDID, or peripheral compatibility test is claimed for the marketplace anchor."],
  },
  "homeoffice:office-paper-shredders-vs-alternatives": {
    dek: "Choose cross-cut or micro-cut security, manual or auto feed, and the right duty cycle by the documents, users, weekly sheet volume, bin capacity, maintenance, and safe placement.",
    quickAnswer: "For ordinary home-office personal and business records, start by defining the required DIN security level rather than buying the largest advertised sheet count. Cross-cut P-3 or P-4 covers many confidential-paper jobs; micro-cut P-5 targets more sensitive material but can trade speed and cost for smaller particles. Auto feed saves attention only when the machine permits the actual paper, staples, clips, cards, and batch size. Keep children, pets, hair, jewelry, and loose clothing away from the feed opening.",
    governance: {
      decision: "merge",
      independentDemand: "Cross-cut versus micro-cut and manual-feed versus auto-feed shredder for a real home-office workload.",
      distinctFrom: "Security, capacity, maintenance, and workflow checks support one purchase instead of five overlapping URLs.",
      benchmark: "Document-risk classification, measured weekly volume, realistic run/cool cycle, bin-emptying test, and explicit safety placement.",
    },
    comparisonTable: {
      title: "Match cut and feed method to the document job",
      columns: ["Cross-cut", "Micro-cut", "Auto-feed feature"],
      rows: [
        { label: "Typical role", values: ["Routine confidential records at the stated DIN level", "Higher-sensitivity records needing smaller particles", "Unattended batch feeding within exact material limits"] },
        { label: "Verify", values: ["P-level, particle size, run time, bin, jam handling", "P-level, particle size, throughput, oiling, bin", "Auto-feed capacity, permitted staples or clips, lock, manual slot"] },
        { label: "Skip when", values: ["The required policy demands a higher level", "Routine volume makes throughput or upkeep impractical", "Most sheets are folded, damaged, mixed, or outside the feed rules"] }
      ]
    },
    sections: [
      { heading: "Classify the documents before choosing the cut", body: "Separate low-risk paper from records containing addresses, account details, client information, strategy, or other confidential material. Fellowes maps cross-cut to DIN P-3/P-4 and micro-cut to P-5 in its current selector. Use the security policy that applies to the work; a marketing phrase such as high security is not a substitute for the listed DIN level and particle size." },
      { heading: "Measure a normal week, not one maximum stack", body: "Count the pages, envelopes, receipts, labels, staples, clips, and cards that actually accumulate. Compare this with the manual-feed limit, auto-feed rules, continuous run time, cool-down time, bin volume, and the number of users. Test a typical batch below the stated maximum during the return window instead of repeatedly operating at the limit." },
      { heading: "Price maintenance and interruption", body: "Check the exact oil or lubrication sheet requirement, bin bags, cutter-cleaning instructions, jam reversal, overheat behavior, warranty, and support path. A smaller cut can reduce visible bulk in the bin, but the complete ownership decision includes throughput, emptying frequency, noise, floor space, and time spent clearing unsuitable material." },
      { heading: "Plan a safe, dry location", body: "Place the shredder where its feed slot is not reachable by children or pets and where hair, ties, sleeves, cords, and jewelry cannot drift into it. Follow the exact manual for unplugging and jam clearing; never reach into the opening. Keep liquids and aerosol products away, and disable or unplug the unit as directed when it is not in use." }
    ],
    sources: [
      { name: "Fellowes shredder selector", url: "https://www.fellowes.com/row/en/catalog/business-machines/resources/pg/shredder-selector", note: "Manufacturer explanation of DIN cut levels, document sensitivity, particle counts, capacity, and usage selection." },
      { name: "Fellowes: How to select the right shredder", url: "https://www.fellowes.com/row/en/solutionscenter/Pages/how-to-select-the-right-shredder.aspx", note: "Manufacturer security-level and workload selection guidance." }
    ],
    editorialMethod: ["Official-spec decision worksheet. Verify the exact model manual, DIN level, feed rules, duty cycle, maintenance, and safety instructions; no throughput or noise test is claimed."],
  },
  "homeoffice:low-profile-keyboards-vs-alternatives": {
    dek: "Choose a low-profile scissor, low-profile mechanical, or standard-height keyboard by neutral wrist position, switch feel, noise, layout, connection, device switching, and the mouse space the board leaves.",
    quickAnswer: "Low profile is a geometry, not a guarantee of comfort, quiet, or speed. Start with desk and chair height: the keyboard should let the shoulders relax, elbows stay close, and wrists remain straight. Then choose scissor keys for a laptop-like short stroke, low-profile mechanical switches when distinct switch feel matters, or standard-height mechanical keys when switch and keycap choice outweigh the extra height. Test the exact layout, sound, connection, and mouse reach during the return window.",
    governance: {
      decision: "merge",
      independentDemand: "Low-profile versus standard-height keyboard for a measured workstation and real typing workflow.",
      distinctFrom: "The former buying, fit, ownership, and setup pages now support one geometry-and-input decision.",
      benchmark: "Neutral-position check, full layout audit, switch and sound trial, connection recovery test, and mouse-reach measurement.",
    },
    comparisonTable: {
      title: "Choose the keyboard geometry before the feature list",
      columns: ["Low-profile scissor", "Low-profile mechanical", "Standard-height mechanical"],
      rows: [
        { label: "Typical feel", values: ["Short, laptop-like travel", "Shorter mechanical travel with a named switch type", "Deeper switch and keycap ecosystem"] },
        { label: "Verify", values: ["Layout, key spacing, shortcuts, backlight, connection", "Switch type, stabilizers, layout, firmware, sound", "Front height, switch, keycaps, wrist position, desk clearance"] },
        { label: "Common compromise", values: ["Less switch choice or repairability", "Mechanical sound and non-standard replacement parts", "More height and possible wrist extension"] },
        { label: "Skip when", values: ["The short stroke causes errors or bottoming discomfort", "The office cannot accept its real sound", "Desk height or front edge forces the wrists upward"] },
      ],
    },
    sections: [
      { heading: "Fix workstation height before buying a thinner board", body: "OSHA advises placing the keyboard directly in front, keeping shoulders relaxed and wrists in line with the forearms. Measure the work surface, chair, keyboard front height, and mouse position together. A thin case cannot compensate for a desk that is too high, and raised rear feet can make wrist extension worse for some users." },
      { heading: "Audit the exact layout in the software you use", body: "Write down the keys used every day: function row, navigation cluster, arrows, number pad, media controls, screenshot, Insert, Delete, and operating-system modifiers. Compact low-profile layouts move or layer some of them. Rehearse spreadsheets, code, creative shortcuts, remote desktops, and login screens; remapping software may not run everywhere." },
      { heading: "Choose feel and sound with a real sample", body: "Scissor, tactile, clicky, and linear labels do not describe the complete board. Case resonance, keycaps, stabilizers, desk surface, typing force, and bottoming out all affect sound and feel. Logitech's MX Mechanical illustrates that one low-profile family can ship with tactile, clicky, or linear switches. Test the exact switch in the room and calls where it will be used." },
      { heading: "Test every connection and recovery path", body: "Pair or connect each required computer, then test device switching, wake from sleep, reconnect after restart, firmware tools, wired fallback, receiver storage, charging while working, and shortcut mapping on each OS. If the mouse must sit farther away because of a full-size board, compare a tenkeyless board plus a movable number pad before accepting the reach." },
    ],
    sources: [
      { name: "OSHA computer-workstation keyboard guidance", url: "https://www.osha.gov/etools/computer-workstations/components/keyboards", note: "Official keyboard placement, neutral wrist, sizing, tilt, and workstation-adjustment guidance." },
      { name: "Logitech MX Mechanical", url: "https://secure.logitech.com/en-sg/shop/p/mx-mechanical", note: "Manufacturer example of low-profile mechanical switch choices, full-size versus compact layout, illumination, and multi-device switching." },
    ],
    editorialMethod: ["Research-synthesis fit worksheet using OSHA guidance and current manufacturer specifications. No typing-speed, fatigue, acoustics, battery, or durability test is claimed."],
  },
  "homeoffice:desktop-label-printers-buying-guide": {
    dek: "Choose a desktop label printer by the exact label width, material, adhesive, print durability, cutter, connection, operating system, design software, and recurring roll cost required by the workflow.",
    quickAnswer: "Start with one real label, not printer speed. Record its finished width and length, surface, indoor or outdoor exposure, barcode or small-text requirement, color need, and labels per batch. Direct-thermal desktop printers avoid ink but require compatible heat-sensitive media and are not automatically suitable for every durable, outdoor, archival, shipping, or identification job. Confirm the exact roll family, maximum print width, cutter behavior, app and OS support, and connection before choosing the printer.",
    governance: {
      decision: "merge",
      independentDemand: "Desktop label printer for a defined label, software, connection, and replenishment workflow.",
      distinctFrom: "Comparison, compatibility, ownership, and setup checks now live in one buying guide.",
      benchmark: "One-label specification, exact media map, native software proof, connection test, barcode verification, and total roll cost.",
    },
    comparisonTable: {
      title: "Match the print system to the label job",
      columns: ["Direct thermal desktop", "Thermal-transfer or laminated tape", "Sheet labels in an existing printer"],
      rows: [
        { label: "Best fit", values: ["Frequent address, file, barcode, or shipping labels on supported rolls", "Longer-wear identification where the exact system supports it", "Occasional batches that already fit office-printer media"] },
        { label: "Consumables", values: ["Model-specific die-cut or continuous thermal rolls", "Tape or label plus ribbon depending on system", "Compatible sheets plus ink or toner"] },
        { label: "Verify", values: ["Print width, media, cutter, darkness, software, connection", "Material, ribbon, laminate, width, cutter, environment", "Printer path, sheet template, margins, adhesive, jam risk"] },
        { label: "Skip when", values: ["Heat, sunlight, abrasion, or required life exceeds the media claim", "Volume and per-label cost make the system impractical", "Small recurring batches create alignment waste or jams"] },
      ],
    },
    sections: [
      { heading: "Write the label specification first", body: "Measure the finished label and record its surface, adhesive, expected life, temperature, moisture, sunlight, abrasion, readability, barcode standard, and whether color carries meaning. Separate maximum media width from maximum printable width. If the label is regulated, safety-critical, or used by a carrier, verify the exact material and format with that authority rather than relying on a generic printer claim." },
      { heading: "Map the exact consumable family", body: "Brother's QL line demonstrates the key distinction between die-cut labels and continuous rolls that an automatic cutter trims to length. Confirm the selected printer accepts the required roll code, width, color, adhesive, and material. Calculate cost per usable label including wasted leaders, failed prints, roll changes, and shipping; direct thermal means no ink, not no consumable dependency." },
      { heading: "Prove the software path on the real computer", body: "Install the current supported editor or app before the return window closes. Test database or CSV import, fonts, barcode generation, sequential numbering, saved templates, user permissions, and printing after an OS update or restart. A network, Bluetooth, AirPrint, or USB feature is useful only when the exact model, device, and workflow support it." },
      { heading: "Run one complete batch and scan it", body: "Print the smallest text, densest barcode, longest continuous label, and normal multi-label batch. Check margins, cutter position, curl, adhesion, smearing or fading risk, and whether every barcode scans in the destination system. Keep a documented fallback for roll shortages, cutter failure, software lockout, or printer downtime." },
    ],
    sources: [
      { name: "Brother QL label-printer overview", url: "https://www.brother-usa.com/label-makers-printers/learn-more/brother-ql", note: "Manufacturer explanation of direct thermal printing, DK die-cut and continuous rolls, automatic cutting, widths, connections, and software." },
      { name: "Brother QL-800 quick setup guide", url: "https://www.brother-usa.com/-/media/brother/product-catalog-media/documents/2022/07/19/06/25/ql800_useng_qsg_d00l7s001.pdf", note: "Official model-level printing method, setup, software, media, and troubleshooting reference." },
    ],
    editorialMethod: ["Official-spec workflow worksheet. Verify the exact model, media code, software, barcode system, and environmental use; no print-speed, adhesion, fade, or cutter-life test is claimed."],
  },
  "homeoffice:desktop-laminators-buying-guide": {
    dek: "Choose a desktop laminator by the widest real document, required pouch thickness and finish, hot or cold material limits, batch frequency, warm-up and feed workflow, jam recovery, cooling space, and electrical safety.",
    quickAnswer: "Buy for the document and pouch, not the machine's top speed. Match the widest item plus sealed margin to the entry width, then confirm the laminator explicitly supports the selected pouch thickness and hot or cold process. Thicker pouches add rigidity but can exceed a small machine's range. For a few occasional documents, self-adhesive cold pouches or a print shop may be simpler. For repeated batches, prioritize repeatable temperature selection, straight feeding, reverse or release, auto shutoff, and safe output space.",
    governance: {
      decision: "merge",
      independentDemand: "Desktop laminator for a measured document, compatible pouch, and realistic batch frequency.",
      distinctFrom: "The former comparison, fit, ownership, and setup URLs now support one complete laminating workflow.",
      benchmark: "Document-and-pouch matrix, exact thickness support, heat-sensitive-item decision, feed and jam rehearsal, batch-time calculation, and safe placement.",
    },
    comparisonTable: {
      title: "Pick the process before the laminator",
      columns: ["Hot pouch laminator", "Cold-capable laminator or cold pouch", "Print shop or no lamination"],
      rows: [
        { label: "Best fit", values: ["Repeat documents needing compatible clear sealed protection", "Heat-sensitive material or occasional adhesive film", "Rare, oversize, specialist, or easily replaced items"] },
        { label: "Verify", values: ["Entry width, pouch mil, temperature, speed, rollers, reverse", "Cold setting, exact pouch instructions, pressure, bubbles", "Turnaround, finish, document value, replacement path"] },
        { label: "Recurring work", values: ["Warm-up, carriers if required, cleaning, cooling and storage", "Alignment, pressure, adhesive handling and trimming", "Ordering, travel or service cost"] },
        { label: "Stop signal", values: ["Wrinkle, clouding, stalled pouch, odor, damaged cable, unsafe heat", "Bubbles, lifting edges, incompatible surface", "Original is irreplaceable or process is not authorized"] },
      ],
    },
    sections: [
      { heading: "Build a document-and-pouch matrix", body: "List the largest width and length, thickness, finish, handling frequency, and whether the item is replaceable. Fellowes recommends choosing pouch size and thickness for the document and checking that the machine supports both. Leave the sealed margin required by the pouch instructions; an A4 or letter label alone does not prove an unusual card, folded item, or mounted piece will fit." },
      { heading: "Treat pouch thickness as a machine limit", body: "Pouch thickness is commonly stated per side in mil or microns, so confirm how both the pouch and machine express it. Thicker film can be more rigid but needs a compatible heat and feed setting. Use the exact recommended setting, allow the ready indication, insert the sealed edge first and straight, and do not improvise with layered pouches or materials the manual excludes." },
      { heading: "Separate warm-up from batch throughput", body: "Calculate the whole job: warm-up, setting changes, feed speed, cooling space, trimming, and recovery from a bad pouch. A fast warm-up does not prove sustained classroom or office batch capacity. For repeated work, check the stated usage level, auto shutoff, reverse or release control, and whether finished sheets can exit flat without stacking against a wall." },
      { heading: "Protect originals and rehearse a jam", body: "Scan or copy any valuable or irreplaceable item before processing, and test the pouch and settings with a disposable sample of the same material. Follow the exact release or reverse procedure without pulling against the rollers. Keep the unit dry, use an accessible outlet, preserve input and output clearance, and let hot pouches cool flat away from children and pets." },
    ],
    sources: [
      { name: "Fellowes: Choosing a laminator", url: "https://www.fellowes.com/us/en/resources/creativity/pg/choosing-a-laminator", note: "Manufacturer guidance on document width, handling frequency, pouch thickness, and hot versus cold use." },
      { name: "Fellowes: Choose the right laminating pouch", url: "https://www.fellowes.com/row/en/catalog/business-machines/resources/pg/choose-the-right-laminating-pouch", note: "Manufacturer pouch-size, thickness, finish, and machine-compatibility guidance." },
    ],
    editorialMethod: ["Official-spec document-and-pouch worksheet. No warm-up, throughput, seal, temperature, jam, or durability test is claimed for the marketplace anchor."],
  },
  "homeoffice:wireless-number-pads-buying-guide": {
    dek: "Choose a wireless number pad by the exact key layout, operating-system behavior, spreadsheet or accounting shortcuts, connection, device switching, desk position, battery path, and whether an on-screen or full keyboard already solves the job.",
    quickAnswer: "Buy a separate number pad when frequent numeric entry needs a movable ten-key cluster or when a compact keyboard keeps the mouse closer. First test the operating system's on-screen pad and the application's actual shortcuts. Then verify Num Lock behavior, decimal and thousands conventions, operators, Backspace, Tab, Enter, navigation layers, and any programmable keys. Choose Bluetooth for receiver-free multi-device use, 2.4 GHz for a dedicated receiver path, or wired mode when reconnect and charging risk must be minimized.",
    governance: {
      decision: "merge",
      independentDemand: "Separate wireless number pad for a specific numeric-entry application, layout, and desk position.",
      distinctFrom: "Comparison, OS fit, ownership, and setup checks now support one input-workflow decision.",
      benchmark: "Application shortcut audit, OS and Num Lock proof, connection recovery test, movable placement trial, and battery fallback.",
    },
    comparisonTable: {
      title: "Choose the smallest ten-key solution that works",
      columns: ["Bluetooth pad", "2.4 GHz receiver or tri-mode pad", "Full keyboard or on-screen pad"],
      rows: [
        { label: "Best fit", values: ["Receiver-free laptop or multi-device desk", "Dedicated workstation needing predictable wireless mode", "Always-present ten-key or occasional entry"] },
        { label: "Verify", values: ["OS pairing, switching, wake, battery, login behavior", "Receiver storage, USB port, wake, interference, wired fallback", "Mouse reach, keyboard width, on-screen workflow"] },
        { label: "Layout risk", values: ["Mac and Windows functions may differ", "Layers and programmable keys can require software", "Fixed position or slower pointer-based entry"] },
        { label: "Skip when", values: ["Pairing or sleep recovery interrupts critical entry", "The receiver or software is blocked by IT", "Numeric work is too rare to justify another device"] },
      ],
    },
    sections: [
      { heading: "Audit the keys inside the real application", body: "List every key and combination used in spreadsheets, accounting, point-of-sale, remote desktop, data entry, or accessibility workflows. Check decimal separator, plus, minus, multiply, divide, Enter, Tab, Backspace, 00 or 000, arrows, Home, End, and macros. A familiar keycap does not prove the application or operating system interprets it the same way." },
      { heading: "Rule out operating-system mode conflicts", body: "Microsoft and Apple both document that Mouse Keys can make the numeric keypad move the pointer instead of entering numbers. Test Num Lock or Clear behavior, login screens, remote sessions, accessibility settings, and sleep recovery on every required computer. Keep a written reset or pairing procedure where another keyboard is not available." },
      { heading: "Choose connection by failure cost", body: "Bluetooth avoids a receiver and may switch among several devices; 2.4 GHz uses a dedicated dongle; some pads add USB-C wired mode. Keychron's Q0 Max is one current example offering all three, but that does not make its heavy mechanical design necessary for ordinary data entry. Compare IT restrictions, available ports, radio congestion, charging during use, receiver replacement, firmware tools, and wired fallback." },
      { heading: "Use the pad's mobility as the ergonomic feature", body: "Place the pad on either side of the keyboard or move it away when not in use, keeping the mouse and forearm in a neutral reachable position. OSHA notes that removing a fixed ten-key section can create more mouse space. Test the pad on the actual desk for sliding, height mismatch, wrist angle, key force, sound, and repeated movement before keeping it." },
    ],
    sources: [
      { name: "Microsoft: Make input devices easier to use", url: "https://support.microsoft.com/en-us/accessibility/windows/make-your-mouse-keyboard-and-other-input-devices-easier-to-use", note: "Official Windows Num Lock, Toggle Keys, Mouse Keys, and numeric-keypad behavior guidance." },
      { name: "Apple: If a numeric keypad does not work on Mac", url: "https://support.apple.com/en-asia/guide/mac-help/mchlp2366/mac", note: "Official Mac Num Lock, Mouse Keys, and application-dependent numeric-pad behavior." },
      { name: "Keychron Q0 Max", url: "https://www.keychron.com/products/keychron-q0-max-qmk-custom-number-pad", note: "Manufacturer example of Bluetooth, 2.4 GHz, wired mode, OS support, programmability, dimensions, weight, and battery tradeoffs." },
      { name: "OSHA pointer and mouse placement", url: "https://www.osha.gov/etools/computer-workstations/components/pointer-mouse", note: "Official guidance noting that a keyboard without a fixed ten-key section can leave more room for the mouse." },
    ],
    editorialMethod: ["Research-synthesis input-workflow worksheet using OS, ergonomics, and current manufacturer documentation. No latency, battery, key feel, macro, or reliability test is claimed."],
  },
  "baby:infant-bath-tubs-safety-and-skip-guide": {
    dek: "Choose and stop using an infant bath tub by the child's developmental stage, tub stability, drainage, caregiver reach, and the rule that the child remains within arm's reach around water at all times.",
    quickAnswer: "An infant bath tub is a bathing aid, never a supervision device. Use only the stage and configuration allowed by the exact instructions, set it on the permitted stable surface, prepare every supply before adding water, and keep one hand within immediate reach of the baby. If you must leave—even briefly—take the child with you. Stop when the child exceeds a limit, can escape the support, the tub will not stay stable, or any fold, plug, cushion, or thermometer is damaged.",
    governance: {
      decision: "merge",
      independentDemand: "Infant bath tub fit, supervision, and stop-use boundaries.",
      distinctFrom: "Buying, fit, cleaning, workflow, and safety now support one higher-trust decision page.",
      benchmark: "CPSC supervision boundary, exact product-stage limit, stable placement, complete pre-bath setup, drain-and-dry routine, and explicit stop conditions.",
    },
    comparisonTable: {
      title: "Treat each bath-tub feature as a check, not a safety substitute",
      columns: ["What to verify", "What it never replaces"],
      rows: [
        { label: "Infant support", values: ["Exact stage, position, installation, and intact support", "An adult within arm's reach"] },
        { label: "Collapsible body", values: ["Every hinge or lock fully opened and stable", "A rigid, level permitted surface"] },
        { label: "Thermometer", values: ["Operation and comparison with caregiver water check", "Active temperature judgment and supervision"] },
        { label: "Drain plug", values: ["Closed for use; opened only as instructed after the child is removed", "Immediate emptying and drying after the bath"] }
      ]
    },
    sections: [
      { heading: "Prepare the complete bath before the child enters", body: "Put towels, clean clothes, soap if used, and every other supply within adult reach. Set the tub only on a surface permitted by its instructions and check that it cannot slide, tip, fold, or drain unexpectedly. CPSC says young children must never be left alone near water, even for a moment, and must remain within arm's reach." },
      { heading: "Match the stage and exact configuration", body: "Infant tubs use different inclined supports, cushions, seated positions, and transition stages. Confirm the child's developmental ability plus every stated age, weight, height, or stage limit. A child who can roll, sit, pull up, or climb can change the risk before a broad age range ends. Do not add towels, bath seats, or improvised restraints unless the manufacturer explicitly permits them." },
      { heading: "Do not outsource judgment to a thermometer", body: "A built-in thermometer can fail, lag, or measure a different part of the water. Follow the product instructions, mix the water, and make the caregiver's own temperature check before the child enters. Keep hot-water controls inaccessible and never add hot water while the child is in the tub." },
      { heading: "Remove the child before draining and inspecting", body: "Lift the child to a secure place before opening the drain or cleaning the tub. Empty the tub immediately, inspect folds, hinges, cushions, plugs, and non-slip surfaces, then dry it according to the instructions. Stop use for cracks, mold that cannot be removed, a loose support, a failed lock, a leaking plug, instability, or any recall." }
    ],
    sources: [
      { name: "CPSC infant bath tub safety standard announcement", url: "https://www.cpsc.gov/Newsroom/News-Releases/2018/New-Federal-Safety-Standard-for-Infant-Bath-Tubs-Takes-Effect", note: "Official arm's-reach supervision, unattended-water, and infant-tub safety guidance." },
      { name: "CPSC infant bath tub FAQ", url: "https://www.cpsc.gov/FAQ/Infant-Bath-Tubs", note: "Official scope and product-design definitions for infant bath tubs." }
    ],
    editorialMethod: ["Higher-trust official-spec safety worksheet based on CPSC guidance. It does not certify the marketplace product, replace its instructions, or expand any developmental limit."],
  },
  "baby:nursery-glider-chairs-safety-and-skip-guide": {
    dek: "Choose a nursery glider by controlled entry and exit, full motion clearance, stable assembly, cleanable upholstery, and a tired-feeding plan that never treats the chair as an infant sleep surface.",
    quickAnswer: "A nursery glider can support feeding and settling only while an alert caregiver controls the chair and baby. It is not a safe infant sleep surface. Before use, test sitting, standing, gliding, swiveling, reclining, and any footrest without holding the baby; keep a compliant separate sleep space nearby. Skip a chair that makes transfers unstable, exposes pinch points, blocks a crib or doorway, or encourages the caregiver to remain seated when sleep is likely.",
    governance: {
      decision: "merge",
      independentDemand: "Nursery glider fit and safe tired-feeding workflow.",
      distinctFrom: "The six generic buying and ownership pages now support one safety-led decision.",
      benchmark: "Safe-sleep boundary, empty-chair transfer trial, full motion envelope, mechanism inspection, cord plan, and an explicit tired-caregiver fallback.",
    },
    comparisonTable: {
      title: "Glider decision: comfort only counts after control",
      columns: ["Pass check", "Skip or stop signal"],
      rows: [
        { label: "Getting up", values: ["Feet supported; armrests and controls reachable", "Pulling, lunging, or unstable footrest release"] },
        { label: "Motion", values: ["Full glide, swivel, and recline clear of furniture", "Pinch point, blocked path, wall strike, or crib contact"] },
        { label: "Tired feeding", values: ["Another caregiver or safe transfer plan is ready", "Caregiver expects to sleep while holding the baby"] },
        { label: "Condition", values: ["Stable base, intact fasteners and upholstery", "Loose frame, failed lock, exposed mechanism, damage, or recall"] }
      ]
    },
    sections: [
      { heading: "Keep infant sleep separate from chair comfort", body: "The AAP recommends a separate firm, flat sleep surface that meets current safety requirements. A glider, recliner, couch, cushion, feeding pillow, or adult's arms do not become a safe sleep surface because the baby settles there. If the caregiver may fall asleep, plan help and a safe transfer before beginning the feed." },
      { heading: "Rehearse every movement without the baby", body: "Set the chair on its final floor surface, then sit, stop the glide, operate recline and footrest controls, stand, and walk the transfer route with empty hands. Check seat height, depth, arm support, and whether the chair moves when weight shifts. Skip it if standing requires momentum, furniture support, or reaching behind." },
      { heading: "Measure the complete motion envelope", body: "Mark the chair's furthest glide, swivel, recline, and footrest positions. Preserve a clear route to the crib, doorway, light, and emergency exit. Keep blankets, curtains, cords, toys, children, and pets away from moving joints. For powered models, route the cable where neither chair motion nor a child can reach it." },
      { heading: "Inspect before assembly becomes permanent", body: "Follow the exact assembly instructions and torque sequence, then check the base, fasteners, stops, locks, footrest, upholstery seams, and any electrical control. Keep packaging until transfers and motion are proven. Stop use for looseness, unexpected movement, exposed pinch points, damaged wiring, a failed control, or a recall; do not improvise a repair." }
    ],
    sources: [
      { name: "AAP safe sleep guidance for parents", url: "https://www.healthychildren.org/English/ages-stages/baby/sleep/Pages/a-parents-guide-to-safe-sleep.aspx", note: "Official parent guidance on compliant infant sleep surfaces and the risks of couches and soft armchairs." },
      { name: "CPSC Safe Sleep", url: "https://www.cpsc.gov/SafeSleep", note: "Official safe-sleep product boundaries and current nursery-product safety resources." }
    ],
    editorialMethod: ["Higher-trust research-synthesis worksheet based on AAP and CPSC guidance. No hands-on chair, upholstery, mechanism, or long-session comfort test is claimed."],
  },
  "baby:double-strollers-compatibility-and-fit-guide": {
    dek: "Fit a double stroller to both children, every doorway and elevator, the folded car-cargo opening, normal terrain, braking routine, and the exact model's walking or jogging limits.",
    quickAnswer: "A double stroller fits only when both children are within their own seat limits, the configured stroller clears the narrowest route, the folded frame enters the actual cargo opening, and the caregiver can steer, brake, fold, lift, and store it safely. Measure width at the widest fixed point, not only the seat. Treat walking, all-terrain use, and jogging as separate permissions from the exact manual; never infer them from wheel size or the words sport and urban.",
    governance: {
      decision: "merge",
      independentDemand: "Double-stroller compatibility for two children, route width, vehicle cargo, terrain, and caregiver operation.",
      distinctFrom: "Buying, comparison, ownership, workflow, and safety checks now support one fit page.",
      benchmark: "Two-child limit sheet, narrowest-route measurement, folded cargo trial, caregiver control test, and exact walking or jogging permission.",
    },
    comparisonTable: {
      title: "Pass all four double-stroller fit gates",
      columns: ["Evidence to record", "Failure means"],
      rows: [
        { label: "Children", values: ["Per-seat weight, height, age, posture, harness, and approved accessories", "The selected configuration does not fit both riders"] },
        { label: "Route", values: ["Widest stroller point versus narrowest door, lift, aisle, and gate", "Choose a narrower layout or another transport plan"] },
        { label: "Vehicle and storage", values: ["Folded dimensions, cargo opening, lift height, and remaining luggage", "The stroller cannot join the real trip"] },
        { label: "Operation", values: ["Steering, parking brake, slope control, fold, carry, and approved terrain", "The caregiver cannot control the complete load"] }
      ]
    },
    sections: [
      { heading: "Make a separate limit sheet for each child", body: "Record each seat's permitted age, weight, height, recline, harness, and developmental requirements. Add any bassinet, car-seat adapter, sibling board, or accessory limits; the lowest applicable limit controls that configuration. Do not use the total stroller capacity as though it were an interchangeable per-seat allowance." },
      { heading: "Measure the route at the real widest point", body: "Measure the stroller's widest fixed point and compare it with the narrowest home door, elevator, school gate, store aisle, transit entrance, and destination. Leave hand clearance and turning room. For a tandem stroller also test length and turning path; for side-by-side models test threshold and doorway approach rather than width alone." },
      { heading: "Prove the fold through the cargo opening", body: "Compare folded dimensions with the narrowest cargo opening, not only the interior trunk volume. Include wheels or seats that must be removed, the caregiver's lift height, and the space left for bags. Rehearse fold and unfold with the stroller empty and the brake applied before doing it around traffic or while supervising children." },
      { heading: "Separate walking, rough paths, and jogging", body: "Large air-filled tires and suspension can improve rough-path control without authorizing jogging. Follow the exact manual for approved use, child readiness, tire pressure, front-wheel mode, wrist strap, and brake operation. Test steering and parking on the normal route with a realistic load; avoid slopes or terrain the caregiver cannot control." }
    ],
    sources: [
      { name: "Thule Urban Glide 3 double", url: "https://www.thule.com/en-us/strollers/double-jogging-strollers/thule-urban-glide-3-double-_-10101998", note: "Official model page for child limits, door pass-through, folded size, weight, terrain, brake, and accessories; verify the exact selected model." },
      { name: "Thule stroller instructions", url: "https://www.thule.com/-/s/approved/std.lang.all/59/96/1475996.pdf", note: "Official configuration and limit reference for the Urban Glide 3 double family." }
    ],
    editorialMethod: ["Official-spec fit worksheet using the exact manufacturer model family as an anchor. No steering, folding, vehicle-fit, jogging, or two-child test is claimed."],
  },
  "baby:bottle-washer-vs-sterilizer-vs-dryer-guide": {
    dek: "Choose a bottle washer, sterilizer-dryer, dishwasher, or manual routine by separating milk-residue cleaning, extra sanitizing, complete drying, batch fit, counter space, and daily maintenance.",
    quickAnswer: "Cleaning removes milk residue; sanitizing is an additional germ-reduction step after cleaning; drying and protected storage prevent a clean batch from returning to a wet, exposed workflow. A bottle washer is useful when compatible bottles and pump parts create a repeated washing bottleneck. A sterilizer-dryer does not replace cleaning. Before buying either, check whether a dishwasher-safe batch already fits a hot-water and heated-dry or sanitizing cycle—CDC says a separate sanitizing step is then unnecessary for those compatible items.",
    governance: {
      decision: "merge",
      independentDemand: "Bottle washer versus sterilizer-dryer versus dishwasher or manual cleaning for a real feeding-parts batch.",
      distinctFrom: "The six automatic-bottle-washer template pages redirect here so one evidence-led guide owns the cleaning-versus-sanitizing decision.",
      benchmark: "CDC-aligned process separation, one complete disassembled batch, compatibility and nozzle map, water and detergent workflow, maintenance burden, and a skip-both path.",
    },
    comparisonTable: {
      title: "Which part of the bottle routine is actually failing?",
      columns: ["Bottle washer", "Sterilizer-dryer", "Dishwasher or manual routine"],
      rows: [
        { label: "Primary job", values: ["Clean compatible disassembled parts; some models add sanitizing and drying", "Sanitize and dry items that were already cleaned", "Clean compatible parts using an existing appliance or dedicated basin and brush"] },
        { label: "Best evidence", values: ["A full batch fits every rack and spray path", "Clean parts fit with steam and airflow paths open", "Manufacturer permits the method and small parts stay contained"] },
        { label: "Recurring work", values: ["Detergent, filters, tanks, nozzles, descaling, drying", "Water fill, descaling, rack cleaning, drying", "Loading, brush or basket cleaning, air drying, protected storage"] },
        { label: "Skip when", values: ["Loads do not fit or maintenance replaces the labor saved", "The household needs washing rather than another post-wash step", "Keep the current routine when it is safe, repeatable, and manageable"] }
      ]
    },
    sections: [
      { heading: "Separate cleaning, sanitizing, drying, and storage", body: "CDC says feeding items should be taken apart and cleaned after use. Sanitizing happens only after cleaning and is especially important for babies under two months, born prematurely, or with weakened immune systems. Completely dry parts before protected storage. Do not describe one appliance as doing a step its exact instructions omit." },
      { heading: "Build one complete disassembled batch", body: "List bottles, nipples, caps, rings, valves, membranes, flanges, collection cups, and any small inserts used between normal wash cycles. Mark which items are dishwasher-safe and which appliance racks or nozzles explicitly support them. Capacity stated as a bottle count does not prove that the accompanying pump parts fit or receive a usable spray and drying path." },
      { heading: "Compare the existing dishwasher before adding an appliance", body: "For dishwasher-safe items, CDC advises disassembly, rinsing, containment of small parts, hot water, and heated drying or a sanitizing setting where possible. A dedicated washer may still save handling or keep feeding items separate, but compare actual cycle frequency, kitchen capacity, water connections, detergent, unloading, and storage instead of assuming a new countertop machine is automatically cleaner." },
      { heading: "Price the maintenance path", body: "Record detergent or tablet requirements, filter replacement, clean- and waste-water tanks, nozzle inspection, descaling interval, rack cleaning, drying path, and the space needed to open and service the machine. Stop use for residue, blocked spray paths, retained water, damaged parts, odors, or a recall. Keep a manual or dishwasher fallback for downtime and travel." }
    ],
    sources: [
      { name: "CDC: Clean, sanitize, and store infant feeding items", url: "https://www.cdc.gov/hygiene/about/clean-sanitize-store-infant-feeding-items.html", note: "Current official cleaning, dishwasher, sanitizing, drying, and storage guidance, including higher-risk infant circumstances." },
      { name: "CDC: Clean and sanitize breast pumps", url: "https://www.cdc.gov/hygiene/about/about-breast-pump-hygiene.html", note: "Official pump-part cleaning and sanitizing boundaries; exact pump instructions still control compatibility." }
    ],
    editorialMethod: ["Higher-trust research-synthesis workflow based on CDC guidance and exact product instructions. No microbial, cleaning-performance, drying, cycle-time, or appliance-capacity test is claimed."],
  },
};

export function applyOctoberSearchRecovery(guide: Guide): Guide {
  const recovery = recoveryGuides[`${guide.site}:${guide.slug}`];
  if (!recovery) return guide;
  const recoverySources = recovery.sources ?? [];
  return {
    ...guide,
    ...recovery,
    updatedAt: "October 6, 2026",
    sources: [
      ...recoverySources,
      ...(guide.sources ?? []).filter((source) => !recoverySources.some((item) => item.url === source.url)),
    ],
  };
}

export const octoberSearchRecoveryGuideKeys = Object.keys(recoveryGuides);
