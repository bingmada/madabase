import consolidationData from "../config/search-recovery-consolidations-2026-10-13.json";
import type { Guide, Product, Roundup, SiteKey } from "./types";

// This is a bounded repair of existing URLs, with a separate decision for each
// topic. Apply last so older generated repairs cannot reintroduce vague copy.
type GuideRepair = Pick<Guide, "site" | "slug"> & Partial<Guide>;
const checkedAt = "October 13, 2026";
const guides: GuideRepair[] = [
  {
    site: "homeoffice", slug: "48-vs-55-inch-desk-guide",
    dek: "Compare the usable width of a 48-inch and 55-inch desk against your screens, input devices, room clearance, and actual seated viewing distance.",
    searchQuestion: "Is a 48-inch desk enough, or should I choose a 55-inch desk?",
    quickAnswer: "A 48-inch desk can work for a compact single-screen setup. A 55-inch desk adds 7 inches (17.8 cm) of width, which helps with two screens or a writing area, but does not solve inadequate depth. Measure the actual monitor stands, keyboard, mouse sweep, and room opening before choosing either size.",
    comparisonTable: {
      title: "Width budget: screen geometry is only the starting point",
      columns: ["48-inch desk", "55-inch desk"],
      rows: [
        { label: "One 27-inch, 16:9 screen", values: ["About 23.5 in of screen width; about 24.5 in remains", "About 23.5 in of screen width; about 31.5 in remains"] },
        { label: "Two 24-inch, 16:9 screens", values: ["About 41.8 in combined; about 6.2 in remains", "About 41.8 in combined; about 13.2 in remains"] },
        { label: "Two 27-inch, 16:9 screens", values: ["About 47.1 in combined; almost no side margin", "About 47.1 in combined; about 7.9 in remains"] },
        { label: "Depth and legroom", values: ["Check the specific desk; width says nothing about depth", "Check the specific desk; wider can still be too shallow"] },
      ],
    },
    sections: [
      { heading: "Measure the equipment, not just screen diagonals", body: "The table is our geometric example, not a fit test. For a 16:9 screen, width is diagonal × 16 ÷ √337. Bezels, stand feet, a gap between screens, and angled placement change the required footprint. Tape out the manufacturer's complete screen and stand dimensions on your current surface. Include anything that must stay beside the screens, such as a speaker or laptop, rather than treating the unused width as automatically free workspace." },
      { heading: "Reserve a real mouse and writing area", body: "Place your keyboard where you actually type, then mark your mouse's normal movement area and the size of the notebook you use. A shelf or arm can clear the surface under a screen, but cannot make a keyboard, notebook, and mouse occupy the same place. If a 48-inch outline forces you to move the keyboard every time you write, the extra 7 inches has a concrete purpose. If both outlines fit comfortably, buy on depth, stability, and room clearance instead." },
      { heading: "Check eye-to-screen distance separately", body: "OSHA's workstation guidance gives a preferred viewing range of roughly 20–40 inches from the eyes to the monitor. This is not a universal minimum desktop depth: your chair position, monitor stand, screen size, and text scaling all affect the result. Sit at the proposed keyboard position and measure to the screen plane. If you must push the screen past the desk's rear edge to read comfortably, additional width will not repair that depth problem." },
      { heading: "A monitor arm changes the footprint and the mounting problem", body: "An arm may recover stand space, but its clamp needs a suitable rear edge and clear space under the top. Check for a metal apron, cable tray, wall, or glass/hollow desktop before counting the reclaimed area. On a standing desk, also check the arm and cables at both heights. Use the reinforcement guide for the mounting decision; a larger tabletop is not proof that it can support your arm." },
      { heading: "Use a room outline before ordering", body: "Mark the whole desk perimeter on the floor, then pull the chair back as you would to stand up. Open nearby doors and drawers. Record desk width, depth, rear cable clearance, chair movement, and the delivery path as separate measurements. Choose 55 inches when its extra workspace survives those checks. Choose 48 inches when the smaller outline solves a genuine room constraint and your equipment still fits; do not buy the larger size solely because it is labelled a home-office upgrade." },
    ],
    sources: [
      { name: "OSHA: computer monitors", url: "https://www.osha.gov/etools/computer-workstations/components/monitors", note: "Viewing-distance and placement guidance; the screen-width examples are our calculations." },
      { name: "OSHA: desk and work-surface checks", url: "https://www.osha.gov/etools/computer-workstations/components/desks", note: "Work area and clearance guidance, not approval of a particular desk." },
    ],
    relatedGuides: ["monitor-arm-clamp-reinforcement-guide", "usb-c-dock-vs-monitor-hub-guide"],
  },
  {
    site: "homeoffice", slug: "monitor-arm-clamp-reinforcement-guide",
    dek: "Check desktop construction, clamp range, underside clearance, reinforcement-plate thickness, and arm load before mounting a monitor.",
    searchQuestion: "Will a reinforcement plate make my desk safe for a monitor-arm clamp?",
    quickAnswer: "A reinforcement plate can spread clamp contact over a larger area on a suitable desktop. It does not certify glass, repair a hollow core, or increase an arm's load rating. Verify the desktop manufacturer's mounting permission, the arm's clamp dimensions, and the complete thickness of the top plus plates before buying.",
    comparisonTable: {
      title: "Five independent mounting checks",
      columns: ["Record before ordering", "Stop or change the mount when…"],
      rows: [
        { label: "Desktop construction", values: ["Material and any manufacturer clamp restrictions", "Construction is unknown, damaged, or prohibited by the desk maker"] },
        { label: "Combined thickness", values: ["Top + upper plate + lower plate, measured at the clamp", "The total falls outside this exact arm's documented clamp range"] },
        { label: "Underside space", values: ["Flat contact area, clamp depth, screw travel, apron and tray locations", "The clamp lands partly on a rail, curved edge, or cable tray"] },
        { label: "Supported display", values: ["Monitor weight without its stand, VESA pattern, arm weight range", "The monitor or its adapter lies outside the arm's specification"] },
        { label: "Movement clearance", values: ["Extended arm, screen corners, wall and cable travel", "Movement strikes the wall or pulls the cables taut"] },
      ],
    },
    sections: [
      { heading: "Identify the desktop before choosing a plate", body: "A desk that looks like wood may use particleboard, a thin veneer, or a hollow core. Ask the manufacturer which mounting methods it permits for the exact top. Look for swelling, cracks, loose joints, or an unsupported rear lip. Do not infer clamp suitability from the desk's overall weight capacity: a distributed load on the surface and the concentrated force at a clamp are different conditions. If the maker prohibits clamping, a plate is not an exception." },
      { heading: "Add the plates to the clamp measurement", body: "Measure the top at the actual mounting position, then add every plate that will sit between the clamp jaws. As a purely illustrative calculation, a 25 mm top plus two 3 mm plates creates a 31 mm assembly; that number still has to fit the chosen arm's instructions. Check the screw's reach and the contact shape as well as nominal thickness. Ergotron's HX attachment drawings show why mount dimensions must be checked by model; their limits should not be applied to a different arm." },
      { heading: "Inspect underneath with the desk in its final position", body: "Find the metal apron, cable tray, drawer box, and any chamfered edge. Both clamp contact faces should sit as the arm manufacturer intends, rather than having one edge suspended or resting on a moving part. A reinforcement plate with a large upper footprint can still have an obstructed lower jaw. Photograph and measure the proposed attachment area before ordering so that you can compare it with the installation drawing without relying on a product-page photograph." },
      { heading: "Check the load with the arm extended", body: "Read the arm's display weight range and VESA requirements, including any limits for curved or unusually deep screens. Moving the display farther from the clamp changes the leverage on the attachment, so a mount that appears stable when folded may behave differently in use. Follow the maker's assembly and tension procedure. Do not invent a tightening torque, add extra displays, or keep tightening to compensate for a deforming top. Stop if the surface moves, cracks, or compresses." },
      { heading: "Choose another attachment when the clamp checks fail", body: "A grommet mount is an alternative only when both the arm and desktop support the hole size and attachment method. A freestanding monitor base or another manufacturer-approved mounting location may be the better choice when the rear edge is unsuitable. After installation, check the attachment and cable slack during normal repositioning and standing-desk travel. Treat a newly visible gap or dent as a reason to stop and inspect, not as evidence that a larger plate alone will solve it." },
    ],
    sources: [{ name: "Ergotron: HX attachment dimensions", url: "https://www.ergotron.com/portals/0/literature/guidelines/choose-attachment-hx.pdf", note: "A model-specific attachment example; use your own arm and desk instructions for approval and limits." }],
    relatedGuides: ["48-vs-55-inch-desk-guide"],
  },
  {
    site: "homeoffice", slug: "portable-monitor-usb-c-dp-alt-mode-displaylink-guide",
    dek: "Work out whether your portable monitor needs native DisplayPort video, a DisplayLink driver, or HDMI before replacing cables or installing software.",
    searchQuestion: "Do I need a DP Alt Mode driver or DisplayLink for my portable monitor?",
    quickAnswer: "Native DisplayPort Alt Mode over USB-C normally does not need a separate DP Alt Mode driver. It needs video support in the host port, a suitable cable, and a compatible monitor input. DisplayLink is a different USB graphics path that needs supported hardware and software; installing its driver cannot add native video to a data-only USB-C port.",
    comparisonTable: {
      title: "Match the video path before troubleshooting",
      columns: ["Required hardware", "Software and diagnostic check"],
      rows: [
        { label: "USB-C DisplayPort Alt Mode", values: ["Host USB-C video output + video-capable cable + compatible USB-C display input", "No separate Alt Mode driver; check host specifications and GPU/OS support"] },
        { label: "DisplayLink USB graphics", values: ["A monitor or adapter that explicitly contains supported USB graphics hardware", "Install the device maker's compatible driver; check workplace software permissions"] },
        { label: "HDMI into a portable display", values: ["Host HDMI output + monitor HDMI input; monitor may need separate power", "Select HDMI on the monitor; verify the exact resolution and power requirements"] },
        { label: "Data-only USB-C", values: ["The port supplies USB data and possibly charging, without native display output", "A cable or driver alone cannot create DP Alt Mode support"] },
      ],
    },
    sections: [
      { heading: "Read the host port's specification first", body: "Find the exact laptop or desktop model and the description of the port you are using. USB-C describes a connector, so charging or file-transfer support is not enough to establish display output. Look for an explicit DisplayPort Alt Mode, Thunderbolt, or display-output statement in the manufacturer's documentation. Test another documented video port when available. Record which port works; this prevents a successful connection on one side of a laptop from being mistaken for support on every USB-C socket." },
      { heading: "Confirm the monitor's input and included cable", body: "Use the monitor model number, not just its screen size, to find the input instructions. Some portable screens accept USB-C video; others use HDMI plus a separate power lead. The ASUS MB16ACV is a specific hybrid example whose USB-A path uses USB graphics software. That does not mean a USB-A adapter works with every USB-C monitor. Try the maker's intended cable and input first, then replace a missing cable with one documented for the same video path and power requirement." },
      { heading: "Separate a driver issue from a hardware mismatch", body: "ASUS distinguishes native DP Alt Mode, which needs no separate driver, from USB graphics modes that do. If your device explicitly supports DisplayLink, obtain the supported software from the device maker and check your operating-system version and installation permissions. Keep graphics and OS updates within the host maker's guidance. Do not install an unrelated monitor utility expecting it to add missing video hardware; a utility for rotation or brightness is not evidence of USB graphics support." },
      { heading: "Treat power as a separate test", body: "A screen can receive enough power to show its logo while still receiving no usable video signal. Follow its manual for external power if the host cannot power it adequately. With the correct input selected, test the video cable and power arrangement separately and note which change fixes the failure. Avoid combining several changes at once. If the screen disconnects only when brightness rises or another USB device is attached, record that condition for the manufacturer's support team rather than assuming it proves a driver problem." },
      { heading: "Check adapter direction and software limits", body: "An ordinary USB-C-to-HDMI output cable is not a reversible HDMI-to-USB-C converter. An HDMI source feeding a USB-C-only screen requires a product explicitly documented for that direction and that screen's power/video requirements. For USB graphics, also verify protected-video playback, managed-computer policy, and any required permissions with the adapter vendor. If those limitations affect your work, prefer a supported native connection or an HDMI-input screen. On a MacBook, check the chip's native display count separately before choosing a multi-display dock." },
    ],
    sources: [
      { name: "VESA: DisplayPort FAQ", url: "https://www.displayport.org/faq/", note: "DisplayPort over USB-C and host-port capabilities." },
      { name: "ASUS: USB monitor connection and driver paths", url: "https://www.asus.com/support/faq/1048768/", note: "Distinguishes DP Alt Mode from USB graphics driver requirements." },
      { name: "ASUS: MB16ACV software and driver downloads", url: "https://www.asus.com/supportonly/mb16acv/helpdesk_download/", note: "Model-specific hybrid connection example; not a rule for every portable monitor." },
    ],
  },
  {
    site: "homeoffice", slug: "macbook-dual-monitor-dock-chip-compatibility-guide",
    dek: "Match your exact MacBook chip, open- or closed-lid setup, screen resolution, and dock technology before buying a dual-monitor dock.",
    searchQuestion: "Which MacBook chips support two native external monitors through a dock?",
    quickAnswer: "Two HDMI sockets on a dock do not prove that your MacBook can extend to two native displays. Base M1/M2 models normally support one; base M3 models support a second in Apple's supported closed-lid setup. M4/M5 MacBook Air and base M4/M5 MacBook Pro support two alongside the built-in display. Check the exact model and resolution combination before selecting a dock.",
    comparisonTable: {
      title: "Native external-display count: confirm the exact model's resolution limits",
      columns: ["Maximum count for these MacBook models", "Buying consequence"],
      rows: [
        { label: "Base M1 / M2 Air or 13-inch Pro", values: ["One native external display", "A conventional two-output dock cannot override this limit"] },
        { label: "Base M3 Air / Pro", values: ["One with the built-in display active; two in the supported closed-lid setup", "Check macOS, power, keyboard and mouse requirements for clamshell use"] },
        { label: "M4 / M5 Air; base M4 / M5 Pro", values: ["Two external displays with the built-in display", "Verify dock support for two independent Mac displays at your target modes"] },
        { label: "M1 Pro / M2 Pro / M3 Pro / M4 Pro", values: ["Two", "Supported combinations vary with resolution and refresh rate"] },
        { label: "M5 Pro", values: ["Three", "Use Apple's three-display mode limits, not an older Pro-chip assumption"] },
        { label: "M1 Max / M2 Max / M3 Max / M4 Max / M5 Max", values: ["Four", "Check the port and resolution combinations; four sockets alone prove nothing"] },
      ],
    },
    sections: [
      { heading: "Identify the chip before reading dock marketing", body: "Open About This Mac and record the model, chip, and macOS version. The word Pro in MacBook Pro is not the same as Pro in an Apple chip name. A base-chip MacBook Pro and a MacBook Pro with a Pro or Max chip can have different display support. Use Apple's page for that model rather than a list that groups all Apple silicon together. Mac Studio's Ultra chips do not belong in a MacBook compatibility table." },
      { heading: "Use the M3 closed-lid instructions as a complete setup", body: "Apple's M3 dual-display instructions include the supported macOS release, external keyboard and mouse or trackpad, and power requirements. Confirm them before budgeting for a closed-lid workstation. Reopening the lid changes which displays can remain active on these base M3 models. If your workflow needs the laptop screen throughout a call, do not buy on the closed-lid maximum; use the open-lid count and choose a supported connection path for that actual workflow." },
      { heading: "Distinguish independent screens from duplicated outputs", body: "Ask the dock maker for an explicit macOS extended-desktop statement covering your chip, two external displays, and the required resolution and refresh rate. A dock can offer multiple connectors but duplicate the same signal on a Mac. DisplayPort MST arrangements often sold for Windows do not establish two independent Mac desktops. A supported Thunderbolt configuration, two documented host connections, and a USB graphics dock are different solutions. Confirm the technology rather than relying on a product title that says dual HDMI." },
      { heading: "Check the complete display mode, not just the count", body: "Write each screen's intended resolution and refresh rate beside the port and cable that will carry it. Apple's maximum combinations and the dock's own bandwidth both have to work. A dock advertised for two 4K screens may qualify that statement by operating system, connection type, or refresh rate. If the seller cannot document your combination, prefer a supported direct connection or another dock. Closing an M4/M5 lid does not automatically create extra native display capacity." },
      { heading: "Use DisplayLink only when its trade-offs fit", body: "USB graphics may provide an additional display path on a model whose native limit is lower, but requires supported hardware and software. Check permissions, OS updates, protected media, and the dock vendor's stated limitations before ordering, especially on a managed work Mac. Keep a return-window plan: connect both screens, choose Extend, reopen or close the lid as intended, then check sleep/wake and the applications you need. This is a suggested acceptance test, not a claim that we tested a particular dock." },
    ],
    sources: [
      { name: "Apple: MacBook Pro external display support", url: "https://support.apple.com/en-us/101571", note: "Current chip-specific counts and resolution combinations." },
      { name: "Apple: MacBook Air external display support", url: "https://support.apple.com/en-us/122212", note: "M4/M5 Air open-lid support and links to older model requirements." },
      { name: "Apple: M3 dual-monitor closed-lid setup", url: "https://support.apple.com/en-us/117373", note: "Use the supported software and connection procedure for the exact M3 model." },
      { name: "Apple: 2021 MacBook Pro technical specifications", url: "https://support.apple.com/en-us/111902", note: "M1 Pro and M1 Max display-count limits." },
      { name: "Plugable: Apple silicon display support", url: "https://kb.plugable.com/understanding-external-display-support-on-apple-m1-m2-m3-and-m4-chips", note: "Dock-vendor explanation of the base M1/M2 limit and USB graphics; use Apple's model specifications for current display combinations." },
    ],
  },
  {
    site: "homeoffice", slug: "usb-c-dock-vs-monitor-hub-guide",
    dek: "Choose between a separate dock and a USB-C hub monitor by checking display support, laptop charging, peripheral ports, and what happens when you replace the screen.",
    searchQuestion: "Should I buy a USB-C dock or use the hub built into a monitor?",
    quickAnswer: "Use a monitor hub when its documented USB-C upstream connection, laptop power delivery, and peripheral ports meet your current setup. Use a separate dock when you need ports or display support the monitor lacks, or want to replace the screen independently. Both still depend on the laptop's video capabilities; extra connectors do not override its display limit.",
    comparisonTable: {
      title: "Choose for the missing function in your workstation",
      columns: ["Monitor with USB-C hub", "Separate dock"],
      rows: [
        { label: "One external screen", values: ["Can combine display, USB devices and charging if specified", "Useful if the existing screen is worth keeping but lacks upstream USB-C"] },
        { label: "Two independent screens", values: ["Check downstream video and host OS support explicitly", "Check chip, OS, output technology and simultaneous display modes"] },
        { label: "Laptop charging", values: ["Check power delivered to the host, not the monitor's total consumption", "Check host-output wattage and whether its power supply is included"] },
        { label: "Peripheral connections", values: ["Count usable USB data ports, Ethernet and audio on the exact model", "Buy for required ports and shared bandwidth, not socket count alone"] },
        { label: "Future screen replacement", values: ["The hub goes away when this monitor is replaced", "The dock can remain while the screen changes"] },
      ],
    },
    sections: [
      { heading: "Write a port list from the devices you actually use", body: "List the keyboard, mouse receiver, webcam, storage drive, Ethernet connection, audio device, and displays that must be connected at once. Mark each device's connector and data needs. Check which USB-C socket on the monitor is the upstream host connection; a downstream accessory socket may not accept a laptop video signal. Compare the remaining usable ports with your list. A shortfall of one charging-only port is different from a shortfall of an independent display output." },
      { heading: "Budget charging at the host connection", body: "Find the laptop manufacturer's charging requirement and the monitor or dock's stated power delivery to the laptop. The device's own power-supply rating is not the amount available to the host. Check whether the advertised host wattage changes when other ports are in use and whether the required supply and cable are included. If the chosen device cannot cover your intended workload, plan for the laptop's own charger or a documented alternative instead of assuming every one-cable setup charges equally well." },
      { heading: "Keep the display decision separate from the port decision", body: "A screen with built-in USB ports can work perfectly as a hub while providing no supported path to a second independent screen. A dock can make the same distinction between duplicated and extended output. Record your laptop model, operating system, each display mode, and the upstream technology before ordering. Mac users should use the chip compatibility guide for the native count; portable-screen users should use the DP Alt Mode guide to check the actual USB video path." },
      { heading: "Consider the failure and replacement workflow", body: "If the monitor supplies both video and peripheral connectivity, changing or servicing it may also disconnect the keyboard, network, and charging cable. A separate dock gives you a component that can stay when the screen changes, but adds its own power supply and cables. Choose based on which component you expect to keep. For a shared desk, also confirm input switching and peripheral switching separately; two video inputs are not proof of a built-in KVM." },
      { heading: "Make the first connection a bounded acceptance check", body: "Before hiding the cables, connect the intended laptop, its peripherals, and all displays. Check the reported resolution, refresh rate, charging status, storage operation, and a webcam call. Try the sleep/wake and screen-switching workflow you will actually use. Save the model-specific compatibility statement and return terms with your receipt. If a key requirement fails, identify the missing function before adding another hub, because several adapters cannot manufacture unsupported host video output." },
    ],
    sources: [
      { name: "VESA: DisplayPort FAQ", url: "https://www.displayport.org/faq/", note: "USB-C display capability depends on the host and connection path." },
      { name: "Apple: external displays on MacBook Pro", url: "https://support.apple.com/en-us/101571", note: "A dock does not remove the host model's native display limits." },
    ],
    relatedGuides: ["macbook-dual-monitor-dock-chip-compatibility-guide", "portable-monitor-usb-c-dp-alt-mode-displaylink-guide", "usb-c-dock-ports-explained-guide"],
  },
  {
    site: "network", slug: "pcie-wifi-adapters-vs-alternatives",
    dek: "Compare a PCIe Wi-Fi card with a USB adapter or Ethernet, then check the desktop slot, bracket, Bluetooth header, drivers, and antenna position.",
    searchQuestion: "Should I choose a PCIe Wi-Fi card or a USB Wi-Fi adapter for my desktop?",
    quickAnswer: "Choose PCIe when your desktop has a suitable accessible slot, bracket space, supported drivers, and a useful antenna position. Choose USB when you need easy installation or use with several computers. Use Ethernet when a cable is practical and reliability matters most. A PCIe card's Wi-Fi connection and its optional Bluetooth USB-header connection are separate installation checks.",
    comparisonTable: {
      title: "Connection choice and the installation work it requires",
      columns: ["Best reason to choose it", "Check before buying"],
      rows: [
        { label: "PCIe Wi-Fi card", values: ["Permanent desktop installation with a documented antenna arrangement", "Available slot, case bracket height, GPU clearance and exact OS driver"] },
        { label: "USB Wi-Fi adapter", values: ["Portable upgrade without opening the case", "Driver support, physical port space and antenna location behind the desk"] },
        { label: "Ethernet", values: ["A practical cable route without dependence on Wi-Fi reception", "Router/switch port, NIC speed and a suitable cable route"] },
        { label: "PCIe card with Bluetooth", values: ["Adds both functions when the PC supports the required connections", "An available motherboard USB header and the supplied Bluetooth lead"] },
      ],
    },
    sections: [
      { heading: "Check the slot and case as two separate dimensions", body: "Consult the motherboard layout to find a suitable slot, then look for a graphics card or other component that blocks access. As a specific manufacturer example, TP-Link's Archer TXE75E installation guide permits PCIe x1, x4, x8, or x16 slots and supplies a low-profile bracket. Those details apply to that model; another card may differ. Match the bracket to the case opening and allow room for the antenna connectors and cables outside the case. Follow the PC maker's power-off and installation instructions." },
      { heading: "Bluetooth can fail while Wi-Fi works", body: "The TXE75E's Wi-Fi uses the PCIe connection, while Bluetooth needs its supplied cable connected to a motherboard USB header. Installing a Bluetooth driver does not replace that physical connection. Before buying a card with both functions, identify the appropriate free header using your motherboard manual and check whether another device already occupies it. Treat a missing or incompatible header as a Bluetooth limitation, not proof that the entire wireless card is defective." },
      { heading: "Match drivers to hardware revision and region", body: "Record the exact model and hardware version printed on the card or box, then choose the matching regional support page and operating-system driver. TP-Link's US V1 support page describes Windows 11 requirements for using that revision's 6 GHz band. Do not transfer that statement blindly to every adapter or driver version. Wi-Fi and Bluetooth may have separate packages. Download supported drivers before opening the PC so that losing network connectivity during installation does not leave you without the files." },
      { heading: "Fix antenna placement before paying for a faster label", body: "Write down the router's supported bands and where the PC sits relative to it. A desktop under a desk or against a wall can leave rear-mounted antennas poorly positioned. A documented remote antenna base offers a placement option; it is not a promise of a particular throughput. Compare a problem connection in the intended position and a less obstructed position. If other devices also struggle there, investigate the network and placement before attributing the fault to the desktop adapter." },
      { heading: "Count installation and maintenance costs that are real", body: "Include any required low-profile bracket, antenna lead, USB-header connection, and supported driver work in the comparison. Keep the model, revision, installed driver versions, and original driver files with your PC notes. After an OS upgrade, troubleshoot the Wi-Fi and Bluetooth functions separately. Choose USB if easy removal matters more than internal installation; choose PCIe if the slot, drivers, and antenna arrangement fit." },
    ],
    sources: [
      { name: "TP-Link: Archer TXE75E installation guide", url: "https://www.tp-link.com/kz/document/27676/", note: "Exact PCIe-slot, bracket and Bluetooth USB-header example." },
      { name: "TP-Link US: Archer TXE75E V1 support", url: "https://www.tp-link.com/us/support/download/archer-txe75e/v1/", note: "Match hardware revision, operating system and region before selecting drivers." },
    ],
    relatedGuides: [],
  },
  {
    site: "network", slug: "direct-attach-copper-cables-vs-alternatives",
    dek: "Choose a short SFP+ DAC link or an optical link by checking both devices' support lists, cable type and length, routing, and the cost of the complete connection.",
    searchQuestion: "Should I use an SFP+ DAC cable or fiber transceivers for this link?",
    quickAnswer: "A DAC is convenient for a short link only when both endpoints support the exact cable and speed. Fiber with supported optical transceivers is useful when the route, distance, or separation calls for it. Do not infer compatibility from an SFP-shaped connector: confirm the switch or NIC model, port mode, cable coding, firmware, and supported length at both ends.",
    comparisonTable: {
      title: "Compare complete links, not just connector shapes",
      columns: ["What you buy", "What must match"],
      rows: [
        { label: "Passive DAC", values: ["One fixed copper cable with attached ends", "Both endpoints' support for the exact passive cable, speed and length"] },
        { label: "Active DAC", values: ["One active copper assembly with attached ends", "Explicit active-cable support at both endpoints; passive support is insufficient"] },
        { label: "Active optical cable (AOC)", values: ["One fixed optical assembly", "Exact assembly support and length; its attached ends are not separate optics"] },
        { label: "Separate optics + fiber", values: ["Two supported optical modules and the matching fiber patch lead", "Speed, optical standard, fiber type, connectors, reach and device support"] },
      ],
    },
    sections: [
      { heading: "Start with a two-endpoint record", body: "For end A and end B, record the device model, port identifier, intended link speed, firmware version, and the manufacturer's transceiver or cable support list. Then record the proposed cable's full part number, active/passive type, length, and coding at each end. A seller's statement that a cable is compatible with one brand does not establish support at the other endpoint. Mixed-brand links need both checks. If either side lacks a clear support statement, ask for one before ordering rather than treating physical insertion as approval." },
      { heading: "Use model-specific length limits", body: "Cisco's 10G SFP+ data sheet lists passive copper examples at 1, 3, and 5 metres and active examples at 7 and 10 metres. These are documented Cisco part numbers, not a universal dividing line for every DAC. Check the supported assembly on your own devices. Measure the actual routed distance with service slack and bend requirements, rather than the straight distance between chassis. Do not plan to splice or extend a fixed DAC when it turns out to be too short." },
      { heading: "Choose the optical components as a matched pair", body: "For a separate-optics link, start with the required speed and optical standard, then select supported modules at both endpoints and the matching fiber type, connector and reach. For example, SR and LR choices cannot be made solely because both modules have LC sockets; their fiber requirements differ. Check receive/transmit orientation and the manufacturer's handling instructions. Keep connector protection in place until installation and avoid looking into an optical port. An AOC avoids separate module selection but still requires exact endpoint support." },
      { heading: "Compare the entire purchase and replacement cost", body: "A DAC purchase covers the fixed assembly; a modular fiber purchase covers two optics plus the patch lead. Include any verified support restrictions, routing constraints, and spare-part needs in the cost worksheet. If an attached end of a DAC or AOC fails, the assembly may need replacement, while a modular optical connection lets you diagnose components separately. That difference can matter more than a small initial price gap. We do not quote a universal power, latency, or throughput advantage without a measured setup." },
      { heading: "Bring up the link before locking down the rack", body: "Follow both device makers' insertion and configuration procedures, set a supported port speed when required, and check each endpoint's recognized module or cable information. Inspect link state and error counters during an ordinary traffic check. A link light is a starting signal, not proof of stable operation. Save the part number, coding, firmware, and test conditions with the rack notes. If the device rejects the cable, use the supported configuration or cable rather than disabling validation on the strength of a marketplace compatibility claim." },
    ],
    sources: [
      { name: "Cisco: 10G SFP+ module and cable data sheet", url: "https://www.cisco.com/c/en/us/products/collateral/interfaces-modules/transceiver-modules/data_sheet_c78-455693.html", note: "Specific passive/active cable examples and optical standards; not a universal compatibility promise." },
      { name: "Cisco: optics-to-device compatibility matrix", url: "https://tmgmatrix.cisco.com/?npid=10", note: "Use a device-specific support record; other vendors require their own lists." },
    ],
    relatedGuides: ["sfp-plus-transceivers-buying-guide", "fiber-media-converters-buying-guide", "ten-gigabit-ethernet-switches-vs-alternatives"],
  },
];

guides.push(
  {
    site: "baby", slug: "ergobaby-omni-breeze-positions-by-age",
    dek: "Choose inward, outward, hip or back carry using the Omni Breeze manufacturer's size limits and developmental requirements, rather than an age label alone.",
    searchQuestion: "At what age can I use each Ergobaby Omni Breeze carrying position?",
    quickAnswer: "Newborn use starts with inward-facing carry when the baby meets the Omni Breeze size requirements and fits correctly. Outward carry is commonly around 5–6 months, while hip and back carry require sitting unassisted and the stated minimum weight. Age is only an estimate: check every condition for the intended position and follow the exact carrier's instructions before changing modes.",
    comparisonTable: {
      title: "Omni Breeze position gates from Ergobaby's product FAQ",
      columns: ["Manufacturer size guidance", "Readiness condition"],
      rows: [
        { label: "Front inward", values: ["At least 7 lb (3.2 kg) and 20 in (50.8 cm); overall carrier limit 45 lb (20.4 kg)", "Adjust the seat and support for the baby's size; verify fit using the instructions"] },
        { label: "Front outward", values: ["Taller than 25 in (63.5 cm); recommended comfort range 14–30 lb (6.4–13.6 kg)", "Strong head/neck control and chin above the panel; often about 5–6 months"] },
        { label: "Hip", values: ["17.2–45 lb (7.8–20.4 kg)", "Sits upright unassisted with strong head/neck control; often around 6 months"] },
        { label: "Back", values: ["17.2–45 lb (7.8–20.4 kg)", "Sits upright unassisted with strong head/neck control; often around 6 months"] },
      ],
    },
    sections: [
      { heading: "Why a birthday does not approve a new position", body: "Use the table as a way to find the relevant section of Ergobaby's instructions, not as an individual safety assessment. Two babies of the same age can have different size and developmental readiness. Record the baby's current weight and height, the desired mode, and whether its readiness conditions are met. A pass on one condition does not cancel a failure on another. If you are uncertain about your baby's development or fit, ask a qualified clinician and the manufacturer before using the new mode." },
      { heading: "Keep newborn use separate from later carrying modes", body: "The carrier's newborn minimum does not mean every position is suitable for a newborn. Start with the newborn inward-facing instructions and check the seat and head support with the carrier in front of you. Do not use photographs of a larger baby to select the settings. The newborn-fit checklist linked below covers this narrower task; this page is the position-selection overview, so it should not replace the actual fitting sequence." },
      { heading: "Outward-facing readiness and comfort are different checks", body: "Before choosing outward carry, verify the manufacturer's readiness conditions as well as its recommended comfort range in the table. An age estimate cannot substitute for head control or clearance above the panel. Reassess when the baby is tired or the fit changes, and use the dedicated forward-facing guide for the detailed mode checks. Do not assume that being within the carrier's overall weight limit makes outward carry the right choice for the whole outing." },
      { heading: "Check hip and back carry against their own minimum", body: "Hip and back carry share a higher minimum weight and an unassisted-sitting requirement in Ergobaby's FAQ. That is the answer to the common back-carry-age question: the approximate month is only part of the decision. Use the maker's instructions and demonstration for the intended mode before attempting it. Avoid copying a hip or back loading technique from a different carrier, even if its straps look similar." },
      { heading: "Make a mode-change record you can use again", body: "Keep the exact carrier model, current measurements, intended position, instruction version, and any unresolved fit question together. Recheck that record as the baby grows or another caregiver uses the carrier. Choose the mode whose complete conditions you can verify now, rather than the most outward-looking or advanced position. This guide is based on manufacturer information and does not claim that we fitted or tested this carrier with a child." },
    ],
    sources: [{ name: "Ergobaby: Omni Breeze positions and size FAQ", url: "https://ergobaby.com/omni-breeze-baby-carrier-all", note: "Mode-specific size and developmental requirements checked October 13, 2026; follow the instructions supplied with the exact carrier." }],
  },
  {
    site: "pet", slug: "automatic-feeder-cleaning-checklist",
    dek: "Separate washable food-contact parts from electronics, follow the exact feeder's disassembly instructions, and check that everything is dry and dispensing correctly before refilling.",
    searchQuestion: "Which automatic pet feeder parts can I wash, and how should I reassemble them?",
    quickAnswer: "Unplug the feeder and follow its model-specific instructions. Wash only the removable parts the maker permits; keep the powered base, sensors and RFID electronics out of water. Allow washed parts to dry fully before assembly and refilling, then check a dispense while you are present. Bowl hygiene and whole-feeder cleaning are separate jobs.",
    comparisonTable: {
      title: "Model-specific cleaning boundaries: do not transfer them to another feeder",
      columns: ["Manufacturer's published instruction", "Practical check"],
      rows: [
        { label: "PETLIBRO Granary AF103 / PLAF103 removable parts", values: ["Rinse and air-dry the lid, food tank, tank base, stainless bowl and bowl tray", "Remove the desiccant first; identify each part using the disassembly guide"] },
        { label: "Granary powered feeder base", values: ["Do not rinse directly or wipe with a wet cloth", "Do not confuse the removable tank base with the powered feeder base"] },
        { label: "PETLIBRO One RFID AF301 / PLAF301 electronics", values: ["Do not rinse or wet-wipe the feeder base, RFID tag or RFID reader", "Use that model's instructions for its removable accessories"] },
        { label: "Dishwasher, detergents or disinfection", values: ["A rinse instruction is not approval for every cleaning method", "Check the exact manual before using heat or cleaning chemicals"] },
      ],
    },
    sections: [
      { heading: "Do not replace bowl hygiene with a weekly feeder job", body: "FDA guidance calls for washing pet-food bowls and measuring utensils with soap and hot water after each use. That food-contact hygiene task is separate from the maker's procedure for disassembling an automatic feeder. Follow the feeder instructions for which parts can be washed and how. Wet food, visible residue, odour, contamination, or a spill changes what needs attention; a calendar reminder is not a reason to leave a dirty food-contact surface in service." },
      { heading: "Identify the model and the powered parts first", body: "Read the model label and open its cleaning instructions before taking it apart. Empty the tank, disconnect power and handle any backup batteries as the manual directs. Place the electronics away from the sink. The term tank base can describe a removable part, while feeder base describes the powered body, so match the diagram instead of deciding by the word base. A camera, motor, RFID reader, or powered lid is not washable merely because the bowl is removable." },
      { heading: "Use the model's removal sequence", body: "The Granary AF103 guide gives a specific order for removing the lid, desiccant, tank, tank base, bowl and tray. Keep the parts together and avoid forcing a latch or rotating the powered body. Use the AF301 instructions for an RFID feeder rather than copying the Granary sequence. Remove old food and residue from permitted food-contact parts before cleaning them. If the maker gives no approval for a dishwasher or particular chemical, do not infer it from stainless steel or plastic construction alone." },
      { heading: "Dry before refilling, including hidden surfaces", body: "Both PETLIBRO cleaning pages require the accessories to be completely dry before assembly. Check recesses, seams and the food path rather than relying only on a dry outer surface. Keep washed parts apart until ready to assemble, and do not use new kibble to absorb leftover moisture. Inspect the desiccant and replace it according to the exact model's instructions; do not wash it with the tank. If moisture reached a prohibited electronic part, stop and ask the manufacturer what to do before reconnecting power." },
      { heading: "Check operation while you can still intervene", body: "After permitted reassembly, check that the tank, bowl and lid are seated, then reconnect power as instructed. Verify the clock, schedule, app connection and backup-power state rather than assuming they survived the cleaning session. Run a normal dispense while you are present and inspect the outlet and delivered portion. For an RFID model, also check the intended pet's access and lid operation. Keep the cleaning date, observed problem and completed checks in a simple log; do not leave for a trip immediately after an unverified reassembly." },
    ],
    sources: [
      { name: "FDA: proper storage of pet food and treats", url: "https://www.fda.gov/animal-veterinary/animal-health-literacy/proper-storage-pet-food-treats", note: "Bowl and utensil hygiene; not instructions for washing feeder electronics." },
      { name: "PETLIBRO: Granary AF103 / PLAF103 cleaning", url: "https://petlibro.com/pages/how-do-i-disassemble-and-clean-the-granary-smart-feeder-af103-plaf103", note: "Removable-parts sequence and powered-base washing restriction." },
      { name: "PETLIBRO: One RFID AF301 / PLAF301 cleaning", url: "https://petlibro.com/pages/how-do-i-disassemble-and-clean-the-one-rfid-pet-feeder-af301-plaf301", note: "Base, RFID-tag and reader restrictions; complete-drying requirement." },
    ],
  },
);

const roundups: Array<Pick<Roundup, "site" | "slug"> & Partial<Roundup>> = [
  {
    site: "homeoffice", slug: "logitech-litra-glow-vs-elgato-key-light-neo",
    dek: "Compare Litra Glow's 250-lumen output with Key Light Neo's power-dependent 400/700/1,000-lumen modes, plus monitor fit, controls and placement for video calls.",
    intro: "Litra Glow is a compact choice when modest close-range fill and Logitech G HUB controls suit the desk. Key Light Neo offers more stated output, but its 1,000-lumen mode needs the specified external power supply. Choose from your available power, camera framing and mounting space; manufacturer lumen ratings do not prove how either light will look on your face.",
    comparisonTable: {
      title: "Manufacturer specifications: output is not a measured webcam result",
      columns: ["Logitech Litra Glow", "Elgato Key Light Neo"],
      rows: [
        { label: "Published output", values: ["250 lumens maximum", "400 lm over USB-A; 700 lm over suitable USB-C; 1,000 lm with specified external power"] },
        { label: "Power needed for the maximum", values: ["Logitech specifies a USB 3.0 port", "5 V, at least 3 A external supply; confirm the exact cable and supply"] },
        { label: "Colour temperature", values: ["2,700–6,500 K", "2,900–7,000 K"] },
        { label: "Controls", values: ["On-device controls and optional Logitech G HUB", "On-device controls and optional Elgato Control Center over Wi-Fi"] },
        { label: "Mount check", values: ["Monitor mount; detachable mount exposes a ¼-20 tripod thread", "Check the included monitor stand against screen thickness, webcam and rear clearance"] },
      ],
    },
    decisionGuide: [
      { label: "Close webcam call with limited power", detail: "Start with the lower-output Litra Glow when its USB and mount requirements fit; confirm face exposure with your actual camera." },
      { label: "More output for wider framing", detail: "Neo's greater stated output provides more adjustment headroom, provided you budget for the power path that enables it." },
      { label: "Only the included USB-A cable", detail: "Plan around Neo's 400-lumen USB-A mode; its higher figures are not the output of that included connection." },
      { label: "Glasses or a reflective screen", detail: "Neither light guarantees reflection-free video. Check off-axis placement, camera angle and brightness before buying more output." },
    ],
    sections: [
      { heading: "Choose the Neo power path before comparing brightness", body: "Elgato's brightness support article assigns different output levels to USB-A, USB-C and external power. It also states that the USB-C cable and external supply for the higher-output paths are not included. Read the current bundle contents before ordering and use the documented supply and connection. A socket's USB-C shape alone does not prove adequate available power. Elgato's quick-start guidance recommends a direct connection, so do not budget for maximum output through an unverified shared hub." },
      { heading: "Do not turn lumens into a face-exposure score", body: "These are manufacturer output specifications, not lux measurements at a fixed distance or a side-by-side camera test. Distance, angle, diffusion, room light and webcam exposure all change the image. More available output can help when the light is farther away, but a close light may simply need dimming. Pick enough adjustment for the actual framing and keep the controls accessible. We have not measured colour accuracy, perceived comfort or video quality for these lights." },
      { heading: "Measure the mount around the webcam", body: "Check the top of the monitor, bezel thickness, rear shape and the existing camera mount. Compare the fixture and mount dimensions with the space available, including cables and screen movement. On a laptop, consider the load and clearance at the display rather than assuming a desktop monitor mount works equally well. Litra Glow's detachable mount provides a documented tripod-thread option; a separate support still needs its own compatible attachment and space." },
      { heading: "Control reflections before changing products", body: "A reflection in glasses is partly a placement problem. During a permitted setup check, adjust the light's position and camera angle, then reduce output and inspect the actual call preview. Keep screen reflections and webcam exposure in the same check. This is a suggested procedure for the buyer, not a claim that either product passed our test. If the physical desk cannot accommodate an off-axis position, consider a different mounting arrangement instead of assuming a larger light eliminates glare." },
      { heading: "Check the software workflow and full purchase", body: "Litra Glow uses optional G HUB controls; Neo uses optional Control Center and Wi-Fi for its software path. Confirm current operating-system support and workplace installation policy, while keeping onboard controls as part of the comparison. Include any required Neo supply or cable, and verify the exact light model at the linked merchant. The related task-light option serves a different desk-lighting job; do not treat it as a measured winner in this two-product comparison." },
    ],
    methodology: ["Official-spec comparison checked October 13, 2026; no hands-on brightness or camera test", "Power modes checked against Elgato's brightness support article", "Mount and control claims checked against manufacturer documentation", "Suggested buyer checks are procedures, not measured product scores"],
    sources: [
      { name: "Logitech: Litra Glow specifications", url: "https://support.logi.com/hc/en-gb/articles/4418106727447-Specification-Litra-Glow", note: "Output, colour range, USB requirement, mount and G HUB support." },
      { name: "Elgato: Key Light Neo brightness information", url: "https://help.elgato.com/hc/en-us/articles/25946490270477-Elgato-Key-Light-Neo-Brightness-Information", note: "400/700/1,000-lumen modes, power requirements and separately supplied accessories." },
      { name: "Elgato: Key Light Neo quick-start guide", url: "https://www.elgato.com/us/en/explorer/products/lighting/elgato-key-light-neo-quick-start-guide/", note: "Connection and control setup; use the documented power path." },
    ],
    faqs: [
      { question: "Is Key Light Neo brighter than Litra Glow on USB-A?", answer: "The manufacturers state 400 lumens for Neo's USB-A mode and 250 lumens maximum for Litra Glow. That compares specifications, not measured illumination or webcam exposure at your desk." },
      { question: "Do I get 1,000 lumens from the included Neo cable?", answer: "The included USB-A connection corresponds to the 400-lumen mode. Elgato assigns 1,000 lumens to its specified external-power path, with a 5 V supply rated for at least 3 A; confirm the current bundle and required cable." },
      { question: "Which is better when I wear glasses?", answer: "Neither is guaranteed to remove reflections. Check position, camera angle and lower brightness in the real call preview; available mounting space matters as much as the output specification." },
    ],
  },
];

const products: Array<Pick<Product, "site" | "slug"> & Partial<Product>> = [
  {
    site: "smarthome", slug: "aqara-presence-multi-sensor-fp300",
    evidenceMode: "official-spec",
    researchNote: "We have not tested FP300. This guide uses Aqara's US product page, official manual and platform connection guide checked October 13, 2026. Firmware, exposed controls, room behaviour, seller and bundle must be verified for the buyer's actual setup.",
    summary: "A model-specific buying and setup guide to FP300's battery-powered presence sensing: choose Thread or Zigbee, budget for the required controller, check what settings the platform exposes, and verify presence and absence before relying on an automation.",
    verdict: "Choose FP300 for presence automation where a permanent power cable is awkward and the intended platform supports the required functions. Choose the documented FP2 alternative when the job needs room-zone mapping. Budget for the complete controller setup and battery replacements, not just the sensor's listed price.",
    editorialSections: [
      { heading: "Price: compare the complete setup cost", body: "For the exact PS-S04E / ASIN B0FG2MD3YP listing, record the sensor price, quantity, seller, mount contents, shipping and return terms. Then add the hardware your home lacks: the supported Aqara hub for Zigbee, or the required Matter controller and Thread border-router functions for Thread. One compatible device may supply both controller roles, but verify that explicitly. Battery replacements also belong in the ownership budget. We do not freeze a promotional price into this guide or assume a multipack is the same purchase." },
      { heading: "Choose Thread or Zigbee by the function you need", body: "Aqara documents two protocol paths. Thread joins a supported Matter ecosystem with a Matter controller and Thread border router. Zigbee joins a supported Aqara hub and exposes Aqara-specific controls. Write down the exact hub, app and firmware versions, then check whether your platform exposes the occupancy and environmental readings needed by the proposed rule. A compatibility logo does not establish every advanced setting. Use the official platform guide for your ecosystem before committing to a protocol." },
      { heading: "Protocol switching needs a settings record", body: "The official manual warns that switching protocols is equivalent to restoring factory settings and clears device settings and data. Save the current configuration and automation requirements before following the app's procedure. Do not treat switching as a harmless toggle or assume existing rules will follow the sensor into the other protocol. Aqara also recommends updating firmware through the supported app workflow. Confirm the current procedure for your device instead of copying a forum sequence written for another firmware version." },
      { heading: "Battery figures are estimates with stated conditions", body: "The US product page states up to three years for Zigbee and two for Thread using two CR2450 cells. Aqara's support FAQ describes laboratory assumptions including 25°C, default dual-presence mode, four hours of daily presence and a specified reporting load. Those conditions are not a prediction for your room. Record installation date, protocol, enabled readings and reporting settings so that a later change in battery life has context. Follow the supplied battery replacement instructions and keep coin cells away from children." },
      { heading: "Check occupied and empty-room behaviour separately", body: "Before using the sensor to control lighting, log its presence state in your actual seated location and its absence state after you leave. Repeat the check with the usual fan or HVAC conditions and note placement and firmware. Aqara's FAQ warns that interference can extend absence confirmation beyond the configured period. Start with a reversible light rule and a manual control, then observe the result. This is a suggested acceptance procedure, not a claim that FP300 passed our reliability test or will never produce a false trigger." },
      { heading: "Decide whether single-area presence is the right job", body: "A battery sensor can simplify placement, but one presence decision is different from separate desk, sofa and doorway zones. Compare the linked FP2 documentation when zone mapping is required. If you need an unverified advanced control, have no compatible controller, or cannot place the sensor according to the supplied manual, resolve that gap before ordering. The manufacturer manual and US product page also differ on the upper operating-temperature figure, so use the documentation supplied for your region and exact unit rather than a blended specification." },
    ],
    sources: [
      { name: "Aqara US: Presence Multi-Sensor FP300", url: "https://us.aqara.com/products/presence-multi-sensor-fp300", note: "US product specifications and mode-dependent battery estimates." },
      { name: "Aqara: FP300 help centre and FAQ", url: "https://store-support.aqara.com/products/multi-presence-sensor-fp300", note: "Official support, lab assumptions and absence-confirmation caveats." },
      { name: "Aqara: FP300 English user manual", url: "https://cdn.shopify.com/s/files/1/0710/9220/7830/files/Presence_Multi-Sensor_FP300_User_Manual-EN.pdf?v=1762828282", note: "Controller requirements, protocol-switch data loss and safe setup instructions. Region-specific limits must be checked." },
      { name: "Aqara: connecting FP300 to third-party platforms", url: "https://cdn.shopify.com/s/files/1/0710/9220/7830/files/How_to_Connect_to_Third-Party_Platforms.pdf?v=1780542797", note: "Platform-specific prerequisites and connection paths." },
    ],
  },
];

const guideByKey = new Map(guides.map((item) => [`${item.site}:${item.slug}`, item]));
const roundupByKey = new Map(roundups.map((item) => [`${item.site}:${item.slug}`, item]));
const productByKey = new Map(products.map((item) => [`${item.site}:${item.slug}`, item]));
const focusedRedirects = new Map(consolidationData.families.flatMap((family) =>
  family.sourceSlugs.map((slug) => [`${family.site}:${slug}`, family.targetSlug] as const),
));

export function applyFocusedGuideRecovery(guide: Guide): Guide {
  const repair = guideByKey.get(`${guide.site}:${guide.slug}`);
  const relatedGuides = (repair?.relatedGuides ?? guide.relatedGuides)?.map((slug) =>
    focusedRedirects.get(`${guide.site}:${slug}`) ?? slug,
  ).filter((slug, index, items) => slug !== guide.slug && items.indexOf(slug) === index);
  if (!repair) return relatedGuides && JSON.stringify(relatedGuides) !== JSON.stringify(guide.relatedGuides)
    ? { ...guide, relatedGuides } : guide;
  return { ...guide, ...repair, relatedGuides, updatedAt: checkedAt,
    editorialMethod: ["Manufacturer documentation checked on October 13, 2026. Calculations and suggested acceptance checks are labelled; this is not a hands-on product test."],
  };
}

export function applyFocusedRoundupRecovery(roundup: Roundup): Roundup {
  const repair = roundupByKey.get(`${roundup.site}:${roundup.slug}`);
  return repair ? { ...roundup, ...repair, updatedAt: checkedAt } : roundup;
}

export function applyFocusedProductRecovery(product: Product): Product {
  const repair = productByKey.get(`${product.site}:${product.slug}`);
  return repair ? { ...product, ...repair, updatedAt: checkedAt } : product;
}

export function focusedSearchAnswer(site: SiteKey, kind: "guide" | "roundup" | "product", slug: string) {
  const key = `${site}:${slug}`;
  if (kind === "guide") return guideByKey.get(key)?.quickAnswer;
  if (kind === "roundup") return roundupByKey.get(key)?.intro;
  return productByKey.get(key)?.verdict;
}
