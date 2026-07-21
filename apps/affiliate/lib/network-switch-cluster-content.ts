import type { Guide, Product, Roundup } from "./types";

const updatedAt = "July 21, 2026";
const amazonUrl = (asin: string) =>
  `https://www.amazon.com/dp/${asin}?tag=bingmada-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl`;

export const networkSwitchClusterProducts: Product[] = [
  {
    site: "network",
    slug: "tp-link-tl-sg105-m2-2-5g-switch",
    asin: "B08ZHGT2ZP",
    amazonTitle: "TP-Link TL-SG105-M2 5-Port 2.5G Unmanaged Switch",
    seoTitle: "TP-Link TL-SG105-M2 Review: 5-Port 2.5G Switch & Version Risks",
    updatedAt,
    evidenceMode: "official-spec",
    researchNote:
      "We have not bench-tested this switch. This guide uses TP-Link's current US product and support pages plus the exact Amazon listing identity. Throughput, heat, and link stability still depend on the connected devices, cabling, workload, and hardware version.",
    name: "TP-Link TL-SG105-M2 5-Port 2.5G Switch",
    brand: "TP-Link",
    category: "wired",
    image: "/images/affiliate/network-tp-link-tl-sg105-m2-editorial-realistic.webp",
    summary:
      "A version-aware guide to the fanless TL-SG105-M2, covering its five 100M/1G/2.5G ports, 25Gbps switching capacity, 12.11W listed maximum draw, port budget, and unmanaged limits.",
    verdict:
      "TL-SG105-M2 is the best starting point when five silent multi-gig ports are enough for a router, NAS, desktop, access point, and one spare path. Start with eight ports if those five roles are already spoken for, and choose managed hardware when VLANs or per-port visibility are required.",
    whyItMatters:
      "A typical upstream link consumes one port. Counting the NAS, mesh node, access point, desktop, dock, and spare connection before checkout prevents a compact bargain from becoming an immediate replacement.",
    bestFor: "Five-port 2.5GbE expansion with detailed official documentation",
    priceBand: "$$",
    rating: 4.5,
    scores: [
      { label: "Port-speed value", value: 9 },
      { label: "Setup simplicity", value: 9 },
      { label: "Growth room", value: 5 },
    ],
    pros: [
      "Five auto-negotiating 100M, 1G, and 2.5G RJ45 ports",
      "Fanless metal enclosure with desktop or wall-mount placement",
      "Officially listed 25Gbps switching capacity and 10KB jumbo frames",
    ],
    cons: [
      "No VLAN configuration, port monitoring, link aggregation, or PoE",
      "Five ports can fill quickly after the upstream connection is counted",
      "Regional hardware revisions mean version-specific documents must match the delivered unit",
    ],
    specs: {
      ASIN: "B08ZHGT2ZP",
      Ports: "5 x 100Mbps/1Gbps/2.5Gbps RJ45",
      Management: "Unmanaged",
      Cooling: "Fanless",
      Enclosure: "Metal; desktop or wall mount",
      "Switching capacity": "25Gbps",
      "Jumbo frame": "10KB",
      "Maximum power": "12.11W listed",
      Dimensions: "8.2 x 4.9 x 1.0 in listed",
    },
    evidence: [
      "Confirm ASIN B08ZHGT2ZP and model TL-SG105-M2 rather than gigabit TL-SG105",
      "Check the hardware-version label before using a version-specific support document",
      "Count the upstream port plus every NAS, mesh node, access point, desktop, and adapter",
      "Verify link speed at both ends; the switch cannot upgrade a gigabit-only router, NIC, or NAS",
      "Amazon confirms the exact model, but seller, price, delivery region, and stock remain checkout checks",
    ],
    editorialSections: [
      {
        heading: "The five-port budget is the buying decision",
        body: "One port normally connects upstream to a router or another switch. That leaves four ports for a NAS, desktop, access point, mesh node, dock, or test adapter. If all four are already named, start with an eight-port switch instead of planning an immediate daisy chain.",
      },
      {
        heading: "Fanless does not mean heat-free",
        body: "TP-Link lists a fanless metal chassis and a maximum power draw of 12.11W. Leave space around the enclosure and do not bury it under power bricks or fabric. Ambient temperature, traffic, and hardware revision can change how warm it feels.",
      },
      {
        heading: "Unmanaged keeps setup simple",
        body: "There is no switch login or VLAN plan to maintain. That suits a simple home NAS or wired-backhaul shelf, but it is wrong for deliberate segmentation, port monitoring, link aggregation, or PoE-powered devices.",
      },
      {
        heading: "Who should skip it",
        body: "Skip it when gigabit clears the workload, five ports leave no spare capacity, the design needs PoE, or a 10GbE NAS backbone is the next planned upgrade.",
      },
    ],
    alternatives: [
      "Choose NETGEAR MS305 when its smaller listed footprint and warranty path are more useful.",
      "Choose TRENDnet TEG-S350 when its current five-port offer is the better value.",
      "Choose TRENDnet TEG-S380 when eight 2.5GbE ports avoid an immediate second switch.",
    ],
    compareSlugs: [
      "netgear-ms305-2-5g-switch",
      "trendnet-teg-s350-2-5g-switch",
      "trendnet-teg-s380-2-5g-switch",
    ],
    sources: [
      {
        name: "TP-Link TL-SG105-M2 product page",
        url: "https://www.tp-link.com/us/business-networking/unmanaged-switch/tl-sg105-m2/",
        note: "Official US ports, capacity, fanless design, dimensions, power, jumbo-frame, and mounting specifications.",
      },
      {
        name: "TP-Link TL-SG105-M2 support",
        url: "https://www.tp-link.com/us/support/download/tl-sg105-m2/",
        note: "Official hardware-version and region warning plus version-specific documentation.",
      },
      {
        name: "Amazon listing for ASIN B08ZHGT2ZP",
        url: "https://www.amazon.com/dp/B08ZHGT2ZP",
        note: "Exact current model identity; confirm seller, region, revision, price, and delivery at checkout.",
      },
    ],
    offers: [
      {
        merchant: "Amazon US",
        url: amazonUrl("B08ZHGT2ZP"),
        label: "Check TL-SG105-M2 price on Amazon",
        priceNote:
          "Confirm ASIN B08ZHGT2ZP, five-port TL-SG105-M2, hardware version, seller, US delivery, and return terms.",
      },
    ],
  },
  {
    site: "network",
    slug: "netgear-ms305-2-5g-switch",
    asin: "B0BGYS7731",
    amazonTitle: "NETGEAR MS305 5-Port 2.5G Unmanaged Switch",
    seoTitle: "NETGEAR MS305 Review: Compact 5-Port 2.5G Fanless Switch",
    updatedAt,
    evidenceMode: "official-spec",
    researchNote:
      "We have not bench-tested this switch. This guide uses NETGEAR's current product page, datasheet, installation guide, and exact Amazon identity. Real throughput and reliability depend on the complete path and installation environment.",
    name: "NETGEAR MS305 5-Port 2.5G Switch",
    brand: "NETGEAR",
    category: "wired",
    image: "/images/affiliate/network-netgear-ms305-editorial-realistic.webp",
    summary:
      "A compact-switch guide to MS305, with five 100M/1G/2.5G ports, fanless metal construction, 9.24W listed maximum draw, 9,720-byte jumbo frames, mounting kit, and warranty-region checks.",
    verdict:
      "MS305 is the compact five-port choice when a smaller metal enclosure, included mounting hardware, and NETGEAR's support path matter more than the lowest checkout price. It has the same five-port limit as its rivals and no managed controls.",
    whyItMatters:
      "MS305 is smaller on paper than TL-SG105-M2, which helps under a desk or on a shallow shelf. Size comes after the port budget because a compact switch that is already full is not a clean installation.",
    bestFor: "Compact under-desk or wall-mounted five-port 2.5GbE expansion",
    priceBand: "$$",
    rating: 4.4,
    scores: [
      { label: "Compact placement", value: 9 },
      { label: "Setup simplicity", value: 9 },
      { label: "Management features", value: 3 },
    ],
    pros: [
      "Five 100M, 1G, and 2.5G copper Ethernet ports",
      "Fanless metal chassis with desktop, wall, or under-table mounting",
      "NETGEAR lists 9.24W maximum draw and a limited lifetime hardware warranty subject to terms",
    ],
    cons: [
      "No VLAN, link aggregation, per-port statistics, or PoE controls",
      "Five ports leave four device ports after a typical upstream link",
      "Warranty and support coverage vary by country and purchase channel",
    ],
    specs: {
      ASIN: "B0BGYS7731",
      Model: "MS305-100NAS",
      Ports: "5 x 100Mbps/1Gbps/2.5Gbps RJ45",
      Management: "Unmanaged",
      Cooling: "Fanless",
      "Jumbo frame": "9,720 bytes listed",
      "Maximum power": "9.24W listed",
      Dimensions: "6.2 x 4.0 x 1.1 in listed",
      Mounting: "Desktop, wall, or under table",
    },
    evidence: [
      "Confirm ASIN B0BGYS7731 and model MS305-100NAS rather than gigabit GS305",
      "Count the upstream connection before treating five ports as five available client ports",
      "Check NETGEAR warranty coverage for the buyer's country and purchase channel",
      "Verify 2.5GbE negotiation on the router, NAS, computer, adapter, and cable path",
      "Amazon confirms the exact model, but seller, price, delivery region, and stock remain checkout checks",
    ],
    editorialSections: [
      {
        heading: "MS305 is the compact-placement option",
        body: "NETGEAR lists the chassis at 158 x 101 x 29mm and includes mounting hardware. That can be useful under a desk or on a shallow shelf, but leave ventilation space and keep Ethernet bend radius practical.",
      },
      {
        heading: "The warranty needs a region check",
        body: "NETGEAR advertises a limited lifetime hardware warranty on its US business page. Coverage, registration, support level, and replacement terms can vary by region and channel, so check them before warranty becomes the deciding factor.",
      },
      {
        heading: "It is still a simple unmanaged switch",
        body: "MS305 provides plug-and-play multi-gig ports without a configuration interface. Buyers who need VLANs, traffic counters, loop controls, or PoE should move to a different class rather than expecting a software upgrade.",
      },
      {
        heading: "Who should skip it",
        body: "Skip it when the network is gigabit-only, more than four downstream connections are planned, or the installation needs managed segmentation, PoE, or a 10GbE uplink.",
      },
    ],
    alternatives: [
      "Choose TP-Link TL-SG105-M2 when its documentation, current price, or hardware path is the better fit.",
      "Choose TRENDnet TEG-S350 for another compact five-port unmanaged option.",
      "Choose TRENDnet TEG-S380 when eight ports matter more than enclosure size.",
    ],
    compareSlugs: [
      "tp-link-tl-sg105-m2-2-5g-switch",
      "trendnet-teg-s350-2-5g-switch",
      "trendnet-teg-s380-2-5g-switch",
    ],
    sources: [
      {
        name: "NETGEAR MS305 product page",
        url: "https://www.netgear.com/business/wired/switches/unmanaged/ms305/",
        note: "Official current ports, dimensions, power, fanless design, mounting, jumbo-frame, and warranty information.",
      },
      {
        name: "NETGEAR MS305 installation guide",
        url: "https://www.downloads.netgear.com/files/GDC/MS305/MS305_IG_EN.pdf",
        note: "Official model, package, placement, power, and installation reference.",
      },
      {
        name: "Amazon listing for ASIN B0BGYS7731",
        url: "https://www.amazon.com/dp/B0BGYS7731",
        note: "Exact current MS305-100NAS identity; confirm seller, region, price, and delivery at checkout.",
      },
    ],
    offers: [
      {
        merchant: "Amazon US",
        url: amazonUrl("B0BGYS7731"),
        label: "Check NETGEAR MS305 price on Amazon",
        priceNote:
          "Confirm ASIN B0BGYS7731, MS305-100NAS, five 2.5G ports, seller, US delivery, warranty eligibility, and return terms.",
      },
    ],
  },
];

export const networkSwitchClusterRoundups: Roundup[] = [
  {
    site: "network",
    slug: "best-fanless-2-5gbe-switches-home-nas-mesh",
    seoTitle: "Best Fanless 2.5GbE Switches for Home NAS & Mesh: 4 Picks",
    updatedAt,
    title: "Best Fanless 2.5GbE Switches for a Home NAS and Wi-Fi 7 Mesh",
    dek: "Compare TP-Link, NETGEAR, and TRENDnet 2.5GbE switches by five-versus-eight-port fit, enclosure size, management limits, power, mounting, version risk, and usable network path.",
    category: "wired",
    intent: "Choose a quiet unmanaged 2.5GbE switch for a NAS, desktop, Wi-Fi 7 access point, or wired mesh backhaul without wasting ports or buying the wrong switch class.",
    intro:
      "TP-Link TL-SG105-M2 is the documentation-rich five-port starting point, NETGEAR MS305 is the compact mounting choice, TRENDnet TEG-S350 is the alternate five-port value path, and TEG-S380 is the move when five ports are already too tight. All four are unmanaged and fanless; none replaces managed or PoE hardware.",
    sections: [
      {
        heading: "Five ports usually means four downstream devices",
        body: "The router or upstream switch normally consumes one port. Count the NAS, desktop, mesh node, access point, dock, TV, console, and one spare before comparing prices.",
      },
      {
        heading: "A 2.5G label does not repair a gigabit path",
        body: "The modem or ONT, router, switch, cable, adapter, NAS, and client must negotiate the intended speed. Use local file transfers and OS link status to separate LAN performance from internet speed.",
      },
      {
        heading: "Unmanaged is a deliberate limit",
        body: "These switches are attractive because they need no configuration. Choose another class when VLANs, PoE, link aggregation, per-port statistics, or deliberate loop controls are requirements.",
      },
    ],
    decisionGuide: [
      { label: "Best five-port starting point", detail: "Choose TP-Link TL-SG105-M2 when five ports are enough and the delivered revision matches its documents." },
      { label: "Best compact mount", detail: "Choose NETGEAR MS305 when footprint, mounting kit, and support path justify its price." },
      { label: "Best alternate value", detail: "Choose TRENDnet TEG-S350 when its exact current offer beats the other five-port choices." },
      { label: "Best for more devices", detail: "Choose TRENDnet TEG-S380 when eight ports avoid an immediate second switch." },
    ],
    methodology: [
      "Verified exact models and Amazon ASIN identities",
      "Used official port, fan, enclosure, power, version, and mounting sources",
      "Compared usable port budget after the upstream link",
      "Kept managed, PoE, and 10GbE requirements as explicit skip conditions",
    ],
    productSlugs: [
      "tp-link-tl-sg105-m2-2-5g-switch",
      "netgear-ms305-2-5g-switch",
      "trendnet-teg-s350-2-5g-switch",
      "trendnet-teg-s380-2-5g-switch",
    ],
    faqs: [
      {
        question: "Is a five-port 2.5GbE switch enough for a home NAS?",
        answer: "Often, but count the upstream link first. A typical five-port plan leaves four ports for a NAS, desktop, access point, mesh node, or adapter.",
      },
      {
        question: "Do I need Cat6 for 2.5GbE?",
        answer: "2.5GBASE-T can work over much existing Cat5e cabling, but run length, terminations, wall plates, damage, and noise still need testing. Cat6 does not fix a bad connector.",
      },
      {
        question: "Should I buy a managed 2.5GbE switch instead?",
        answer: "Buy managed when VLANs, traffic visibility, link aggregation, or loop controls are requirements. For a simple flat home network, unmanaged is easier and usually cheaper.",
      },
    ],
  },
  {
    site: "network",
    slug: "tl-sg105-m2-vs-ms305-vs-teg-s350",
    seoTitle: "TL-SG105-M2 vs MS305 vs TEG-S350: Best 5-Port 2.5G Switch",
    updatedAt,
    title: "TP-Link TL-SG105-M2 vs NETGEAR MS305 vs TRENDnet TEG-S350",
    dek: "Compare three fanless five-port 2.5GbE switches by size, power, official documentation, mounting, hardware-version risk, warranty path, and when eight ports are better.",
    category: "wired",
    intent: "Choose among three exact five-port unmanaged 2.5GbE switches after confirming that five ports and a flat network are enough.",
    intro:
      "All three products solve the same core job. TP-Link leads on current specification detail, NETGEAR has the smallest listed footprint, and TRENDnet remains a practical value comparison. Current price, region, revision, and warranty can change the winner.",
    sections: [
      {
        heading: "Choose by installation after the port count passes",
        body: "If five ports are enough, compare shelf depth, mounting, power-brick placement, airflow, support documents, and return path. If five ports are not enough, stop comparing these models and move to eight ports.",
      },
      {
        heading: "Version and region checks are purchase risks",
        body: "TP-Link and TRENDnet publish version-specific support material, while NETGEAR warranty coverage can vary by region and channel. Confirm the delivered label before applying a datasheet or warranty.",
      },
      {
        heading: "None is the managed or PoE answer",
        body: "Do not buy one expecting VLANs, per-port traffic visibility, link aggregation, or power for cameras and access points. Those requirements point to another product family.",
      },
    ],
    decisionGuide: [
      { label: "Pick TP-Link", detail: "You want the clearest current US specifications and its physical size fits the shelf." },
      { label: "Pick NETGEAR", detail: "The smaller footprint, mounting options, and eligible warranty path matter most." },
      { label: "Pick TRENDnet", detail: "Its exact five-port offer is the better value and hardware version is clear." },
      { label: "Pick none", detail: "Five ports, unmanaged controls, or a 2.5GbE-only backbone cannot satisfy the topology." },
    ],
    methodology: [
      "Compared manufacturer specifications instead of marketplace summaries",
      "Verified exact Amazon ASIN and model identity",
      "Separated location, version, warranty, and seller checks from permanent specifications",
    ],
    productSlugs: [
      "tp-link-tl-sg105-m2-2-5g-switch",
      "netgear-ms305-2-5g-switch",
      "trendnet-teg-s350-2-5g-switch",
    ],
    faqs: [
      {
        question: "Which of these five-port switches is fastest?",
        answer: "All three provide five 2.5GbE ports. Topology, connected devices, cabling, heat, revision, and support matter more than expecting one to make a 2.5GbE link faster than another.",
      },
      {
        question: "Can I connect one to Wi-Fi 7 mesh?",
        answer: "Yes when the mesh unit exposes a compatible Ethernet port and the topology follows its vendor guidance. The switch does not add wireless speed by itself.",
      },
      {
        question: "When should I buy an eight-port switch?",
        answer: "Buy eight ports when the upstream link plus known devices already consume four or five ports, or when spare capacity is more valuable than the smallest enclosure.",
      },
    ],
  },
];

export const networkSwitchClusterGuides: Guide[] = [
  {
    site: "network",
    slug: "5-port-vs-8-port-2-5gbe-switch",
    title: "5-Port vs 8-Port 2.5GbE Switch: Count the Uplink First",
    dek: "Choose five or eight multi-gig ports by counting the router uplink, NAS, desktops, Wi-Fi 7 access points, mesh nodes, docks, media devices, and spare capacity.",
    category: "wired",
    updatedAt,
    image: "/images/affiliate/network-netgear-ms305-editorial-realistic.webp",
    imageAlt: "Generic five-port fanless Ethernet switch mounted under a home-office desk near a NAS",
    comparisonTable: {
      title: "Five-port versus eight-port planning",
      columns: ["Five-port switch", "Eight-port switch", "What to verify"],
      rows: [
        { label: "Typical usable ports", values: ["4 after one upstream link", "7 after one upstream link", "Count the topology, not the box"] },
        { label: "Best fit", values: ["Router, NAS, desktop, AP", "Several rooms, APs, media", "Leave one or two spares"] },
        { label: "Placement", values: ["Smaller desk or shelf", "Larger shelf and cable bundle", "Measure plugs and bend radius"] },
        { label: "Upgrade risk", values: ["Fills sooner", "Higher cost and power", "Do not buy unused speed"] },
      ],
    },
    sources: [
      { name: "TP-Link TL-SG105-M2", url: "https://www.tp-link.com/us/business-networking/unmanaged-switch/tl-sg105-m2/", note: "Official five-port reference." },
      { name: "TRENDnet TEG-S380", url: "https://www.trendnet.com/products/2-5g-switch/TEG-S380", note: "Official eight-port reference." },
      { name: "NETGEAR MS305", url: "https://www.netgear.com/business/wired/switches/unmanaged/ms305/", note: "Official compact five-port reference." },
    ],
    sections: [
      {
        heading: "Subtract the upstream connection first",
        body: "A five-port switch commonly leaves four downstream ports; an eight-port switch leaves seven. If the topology uses another switch link, count that link too.",
      },
      {
        heading: "Name every fixed device",
        body: "Write down the router, NAS, workstation, access point, mesh node, dock, TV, console, recorder, and room feed. Mark which devices actually need 2.5GbE.",
      },
      {
        heading: "A spare port is useful, unused speed is not",
        body: "One or two spare ports simplify troubleshooting and a known upgrade. Buying eight multi-gig ports for three permanent devices is harder to justify when a gigabit branch can serve printers and hubs.",
      },
      {
        heading: "Avoid casual daisy chains",
        body: "A second switch adds another power supply, uplink, cable bundle, and failure point. If the first switch is full on day one, eight ports are usually cleaner.",
      },
    ],
    relatedProducts: [
      "tp-link-tl-sg105-m2-2-5g-switch",
      "netgear-ms305-2-5g-switch",
      "trendnet-teg-s350-2-5g-switch",
      "trendnet-teg-s380-2-5g-switch",
    ],
    relatedRoundups: [
      "best-fanless-2-5gbe-switches-home-nas-mesh",
      "tl-sg105-m2-vs-ms305-vs-teg-s350",
      "best-2-5g-home-network-upgrades",
    ],
    relatedGuides: [
      "when-to-upgrade-to-2-5gbe-switch",
      "2-5gbe-home-network-upgrade-checklist",
      "2-5g-vs-10g-switch-for-home-nas-guide",
    ],
  },
  {
    site: "network",
    slug: "2-5gbe-switch-port-budget-for-nas-mesh",
    title: "2.5GbE Switch for NAS and Wi-Fi 7 Mesh: Port Budget Checklist",
    dek: "Map the modem or ONT, router, switch, NAS, workstation, Wi-Fi 7 access point, mesh backhaul, adapters, and slower side devices before buying.",
    category: "wired",
    updatedAt,
    image: "/images/affiliate/network-tp-link-tl-sg105-m2-editorial-realistic.webp",
    imageAlt: "Generic five-port 2.5GbE switch beside a NAS and mesh node on a tidy home network shelf",
    comparisonTable: {
      title: "End-to-end 2.5GbE path check",
      columns: ["Device or link", "Minimum question", "Common failure"],
      rows: [
        { label: "Router uplink", values: ["Does LAN negotiate 2.5G?", "Multi-gig WAN, gigabit LAN"] },
        { label: "NAS", values: ["Can NIC and storage sustain it?", "Fast port, slow workload"] },
        { label: "Computer", values: ["Built-in 2.5G or supported adapter?", "Driver or USB cap"] },
        { label: "Mesh or AP", values: ["Which port handles backhaul?", "Fast switch, gigabit mesh port"] },
        { label: "Cabling", values: ["Do both ends negotiate reliably?", "Bad lead, jack, or termination"] },
      ],
    },
    sources: [
      { name: "TP-Link TL-SG105-M2", url: "https://www.tp-link.com/us/business-networking/unmanaged-switch/tl-sg105-m2/", note: "Official multi-gig and Cat5e-path reference." },
      { name: "TP-Link Deco BE63", url: "https://www.tp-link.com/us/deco-mesh-wifi/product-family/deco-be63/", note: "Mesh example with several 2.5GbE ports." },
      { name: "Sabrent NT-25GA", url: "https://sabrent.com/products/nt-25ga", note: "USB-C 2.5GbE client-adapter example." },
    ],
    sections: [
      {
        heading: "Draw one path before buying hardware",
        body: "Choose a real job such as desktop-to-NAS backup or router-to-mesh backhaul. Draw every port and cable. The slowest negotiated segment sets the ceiling.",
      },
      {
        heading: "Separate local traffic from internet speed",
        body: "A desktop and NAS can benefit from 2.5GbE with slower internet. A 2Gbps plan can still test below gigabit on one client because of Wi-Fi, server, protocol, or adapter limits.",
      },
      {
        heading: "Keep slow devices off the expensive port budget",
        body: "Printers, smart-home hubs, TVs, and many consoles do not need dedicated 2.5GbE. A gigabit branch can preserve multi-gig ports for the NAS, workstation, access point, and backhaul.",
      },
      {
        heading: "Verify after installation",
        body: "Check link speed on the router, switch, NAS, and computer, then run a local transfer that can sustain the target. Internet speed tests alone cannot prove the LAN path.",
      },
    ],
    relatedProducts: [
      "tp-link-tl-sg105-m2-2-5g-switch",
      "netgear-ms305-2-5g-switch",
      "trendnet-teg-s380-2-5g-switch",
      "tp-link-ue302c-2-5g-usb-c-ethernet-adapter",
    ],
    relatedRoundups: [
      "best-fanless-2-5gbe-switches-home-nas-mesh",
      "best-2-5g-home-network-upgrades",
      "tl-sg105-m2-vs-ms305-vs-teg-s350",
    ],
    relatedGuides: [
      "5-port-vs-8-port-2-5gbe-switch",
      "2-5gbe-home-network-upgrade-checklist",
      "when-to-upgrade-to-2-5gbe-switch",
    ],
  },
];
