import type { Guide, Roundup } from "./types";

const updatedAt = "July 11, 2026";

export const networkMultigigRoundups: Roundup[] = [
  {
    site: "network",
    slug: "deco-be25-vs-be67",
    title: "TP-Link Deco BE25 vs BE67: Budget Wi-Fi 7 or 10GbE Mesh?",
    dek: "Compare Deco BE25 vs BE67 by 6GHz, 10GbE, 2.5GbE ports, wireless backhaul, pack cost, and the internet or NAS workload that justifies the upgrade.",
    category: "wifi",
    intent: "Choose between an affordable dual-band Deco and a premium multi-gig Wi-Fi 7 mesh system.",
    intro: "BE25 and BE67 share the Wi-Fi 7 label but solve different network problems. BE25 is a dual-band value system that makes the most sense with Ethernet backhaul, while BE67 adds 6GHz, more wireless capacity, and a 10GbE path for a home that can actually use them.",
    sections: [
      { heading: "BE25 is the wiring-first value choice", body: "Choose BE25 when a 2.5GbE WAN or wired backhaul is enough, the home has limited 6GHz clients, and the budget is better spent on Ethernet runs or a small multi-gig switch. Its dual-band design is not a flaw when the topology is deliberate." },
      { heading: "BE67 earns its premium through a defined path", body: "BE67 is easier to justify when one 10GbE connection serves a multi-gig WAN, NAS, workstation, or switch, or when wireless backhaul and many simultaneous clients are the actual bottleneck. A larger wireless number alone is not a reason to upgrade." },
      { heading: "Count ports after WAN and backhaul", body: "BE25 has two 2.5GbE ports per unit, while BE67 uses a mixed 10GbE, 2.5GbE, and 1GbE layout. Draw the modem, switch, satellite, desktop, TV, and NAS connections before comparing the headline speed." },
    ],
    decisionGuide: [
      { label: "Typical gigabit plan", detail: "BE25 usually leaves more budget for placement, wiring, or a better switch." },
      { label: "2.5Gbps plan with several wired devices", detail: "Compare BE25 port limits with BE67's mixed port layout before buying either pack." },
      { label: "10GbE NAS or WAN", detail: "BE67 has the clearer upgrade path, but the modem, switch, cable, and client must match." },
      { label: "Mostly Wi-Fi 6 devices", detail: "Do not pay for BE67 until 6GHz support, backhaul, or client density solves a measured problem." },
    ],
    methodology: ["Compare the same node count and regional hardware", "Map WAN, backhaul, switch, NAS, and fixed clients", "Separate radio link rates from application throughput", "Price wiring and adapters as part of the upgrade"],
    productSlugs: ["tp-link-deco-be25-wifi-7-mesh", "tp-link-deco-be67-wifi-7-mesh"],
    faqs: [
      { question: "Is Deco BE67 faster than BE25 for every home?", answer: "No. BE67 has more radio and port capacity, but placement, backhaul, client support, and the WAN plan control the result in a real home." },
      { question: "Does BE25 support wired backhaul?", answer: "Yes. Ethernet backhaul is one of the clearest ways to make the dual-band BE25 design work well in a multi-room home." },
      { question: "Should I buy BE67 for a one-gigabit plan?", answer: "Only when a defined local-transfer, wireless-capacity, coverage, or future multi-gig requirement justifies the premium. Otherwise improve placement or wiring first." },
    ],
  },
  {
    site: "network",
    slug: "best-mesh-wifi-for-2-5gbps-internet",
    title: "Best Mesh Wi-Fi for 2.5Gbps Internet: 4 Practical Picks",
    dek: "Compare four Wi-Fi 7 mesh systems by 2.5GbE ports, 6GHz, 10GbE paths, wired backhaul, node count, client mix, and real upgrade value.",
    category: "wifi",
    intent: "Choose a mesh system that can use a 2.5Gbps internet plan without paying for unused capacity.",
    intro: "A 2.5Gbps internet plan does not automatically require a flagship mesh. The best choice depends on whether the connection terminates at the main node, whether satellites use Ethernet, how many wired devices need multi-gig ports, and whether the home has 6GHz clients or fast local storage.",
    sections: [
      { heading: "Start with the WAN and backhaul map", body: "Write down the modem or ONT port, main-node WAN, satellite path, switch, NAS, desktop, and wall-jack speeds. A system can advertise a faster class while leaving the actual workstation or satellite path at one gigabit." },
      { heading: "Pick a port layout before a Wi-Fi class", body: "BE25 is a value dual-band option, BE63 offers four 2.5GbE ports per unit, BE67 adds a 10GbE path, and BE85 targets a more demanding premium network. The right port count can matter more than the largest aggregate wireless number." },
      { heading: "2.5Gbps internet is not 2.5Gbps per client", body: "A service plan is shared across clients and is limited by the modem, router, radio, channel conditions, and server. Treat the plan as a capacity target, then decide which local device deserves the fastest wired path." },
    ],
    decisionGuide: [
      { label: "Lowest sensible cost", detail: "BE25 fits when Ethernet backhaul and dual-band client coverage are enough." },
      { label: "Several 2.5GbE devices", detail: "BE63's four equal 2.5GbE ports can simplify a wired office, switch, TV, and satellite layout." },
      { label: "One 10GbE workload", detail: "BE67 adds a useful 10GbE path for a defined WAN, NAS, workstation, or switch connection." },
      { label: "Flagship local traffic", detail: "BE85 is easier to justify when 10GbE, high client density, premium backhaul, and fast storage are already planned." },
    ],
    methodology: ["Normalize the same node count and regional version", "Compare physical ports after WAN and backhaul are assigned", "Separate internet speed from local NAS and workstation transfers", "Include switches, adapters, cabling, and return policy in total cost"],
    productSlugs: ["tp-link-deco-be25-wifi-7-mesh", "tp-link-deco-be63-wifi-7-mesh", "tp-link-deco-be67-wifi-7-mesh", "tp-link-deco-be85-wifi-7-mesh"],
    faqs: [
      { question: "Do I need Wi-Fi 7 for 2.5Gbps internet?", answer: "No. Wi-Fi 7 can help with supported clients, 6GHz, channel width, and capacity, but wired backhaul and suitable client hardware may matter more." },
      { question: "Is BE63 enough for a 2.5Gbps plan?", answer: "It can be a strong fit when four 2.5GbE ports, tri-band radios, and Ethernet backhaul match the home. Check the exact modem and client path." },
      { question: "When is BE85 excessive?", answer: "It is excessive when the home has one-gigabit service, ordinary Wi-Fi clients, no 10GbE local traffic, and no defined plan to use the premium ports." },
    ],
  },
];

export const networkMultigigGuides: Guide[] = [
  {
    site: "network",
    slug: "is-wifi-7-worth-it-for-1gbps-internet",
    title: "Is Wi-Fi 7 Worth It for 1Gbps Internet? A Buyer Checklist",
    dek: "Separate coverage, client density, 6GHz, wired backhaul, local transfers, and future plans before paying for a Wi-Fi 7 mesh upgrade.",
    category: "wifi",
    updatedAt,
    relatedProducts: ["tp-link-deco-be63-wifi-7-mesh", "tp-link-deco-be67-wifi-7-mesh", "tp-link-deco-be25-wifi-7-mesh"],
    relatedRoundups: ["best-mesh-wifi-for-2-5gbps-internet", "tp-link-deco-be67-vs-be63"],
    sources: [
      { name: "TP-Link Deco BE63", url: "https://www.tp-link.com/us/deco-mesh-wifi/product-family/deco-be63/", note: "Official tri-band Wi-Fi 7, 6GHz, Ethernet, and backhaul specifications." },
      { name: "TP-Link Deco BE67", url: "https://www.tp-link.com/us/deco-mesh-wifi/product-family/deco-be67/", note: "Official BE14000, 10GbE, 6GHz, and backhaul specifications." },
    ],
    sections: [
      { heading: "Coverage can justify Wi-Fi 7 before speed does", body: "A newer mesh can be worthwhile when the current system has measured dead zones, crowded wireless backhaul, or too many simultaneous clients. Fix node placement and add Ethernet where possible before assuming the generation label will solve coverage." },
      { heading: "A one-gigabit plan does not make every upgrade pointless", body: "Wi-Fi 7 can improve local capacity and reduce contention for supported devices, but a single phone will not receive the aggregate class printed on the box. Count the clients that can use 6GHz, 320MHz channels, or MLO in the actual home." },
      { heading: "BE63 often makes more sense than a flagship", body: "A tri-band BE63 can provide 6GHz and four 2.5GbE ports without the full cost of BE67 or BE85. It is a more disciplined upgrade when the WAN is one gigabit but the home needs better wireless capacity or a multi-gig LAN." },
      { heading: "Local traffic changes the answer", body: "A fast NAS, workstation backup, media server, or wired access point can justify a faster port even when internet service is one gigabit. Draw that local path and verify the endpoint adapters before buying." },
      { heading: "Write down a future upgrade date", body: "Future-proofing is useful only when the modem, switch, cabling, clients, and service tier have a plausible upgrade path. A vague future plan should not outweigh a current price, placement, or return-policy problem." },
    ],
  },
  {
    site: "network",
    slug: "2-5gbe-vs-10gbe-mesh-backhaul-checklist",
    title: "2.5GbE vs 10GbE Mesh Backhaul: Which Port Speed Do You Need?",
    dek: "Choose a mesh backhaul speed from node distance, WAN, switches, NAS traffic, cable runs, and the number of devices sharing each link.",
    category: "wifi",
    updatedAt,
    relatedProducts: ["tp-link-deco-be25-wifi-7-mesh", "tp-link-deco-be63-wifi-7-mesh", "tp-link-deco-be67-wifi-7-mesh", "tp-link-deco-be85-wifi-7-mesh"],
    relatedRoundups: ["best-mesh-wifi-for-2-5gbps-internet", "tp-link-deco-be67-vs-be63"],
    sources: [
      { name: "TP-Link Deco BE63", url: "https://www.tp-link.com/us/deco-mesh-wifi/product-family/deco-be63/", note: "Official four-port 2.5GbE and Ethernet-backhaul reference." },
      { name: "TP-Link Deco BE67", url: "https://www.tp-link.com/us/deco-mesh-wifi/product-family/deco-be67/", note: "Official 10GbE, 2.5GbE, 1GbE, and backhaul reference." },
      { name: "TP-Link Deco BE85", url: "https://www.tp-link.com/us/deco-mesh-wifi/product-family/deco-be85/", note: "Official premium 10GbE and SFP+ path reference." },
    ],
    sections: [
      { heading: "The backhaul is a shared path", body: "A satellite's backhaul carries traffic for clients behind that node. One 2.5GbE link can be plenty for ordinary internet use, but simultaneous local transfers and multiple wired clients can make the shared path the bottleneck." },
      { heading: "2.5GbE is usually the practical middle ground", body: "Choose 2.5GbE when the WAN, switch, NAS, and desktop are in the same general speed tier, the cable path is already in place, and no single local workload needs more. It is easier to deploy and often leaves more usable ports." },
      { heading: "10GbE needs an endpoint on both sides", body: "A 10GbE mesh port is useful only when the modem or ONT, switch, NAS, workstation, cable, and negotiated link can use it. A 10GbE port connected to a gigabit switch is still a gigabit path." },
      { heading: "Wireless backhaul needs a different test", body: "A faster Ethernet port cannot repair a wireless satellite placed behind too many walls. Compare wired and wireless backhaul separately, and keep nodes close enough for a strong relay before adding more hardware." },
      { heading: "Check the port job before checkout", body: "Mark which port serves WAN, wired backhaul, switch, NAS, and local clients. Mixed 10GbE, 2.5GbE, and 1GbE layouts can be faster on paper but less convenient than several equal 2.5GbE ports." },
    ],
  },
  {
    site: "network",
    slug: "2-5gbe-home-network-upgrade-checklist",
    title: "2.5GbE Home Network Upgrade Checklist: Router, Switch, NAS and Cables",
    dek: "Audit every link from the ISP handoff to the mesh nodes, switch, NAS, desktop, adapter, and cable before paying for multi-gig hardware.",
    category: "wifi",
    updatedAt,
    relatedProducts: ["tp-link-deco-be63-wifi-7-mesh", "tp-link-deco-be25-wifi-7-mesh", "trendnet-teg-s380-2-5g-switch", "tp-link-ue302c-2-5g-usb-c-ethernet-adapter"],
    relatedRoundups: ["best-mesh-wifi-for-2-5gbps-internet", "best-2-5g-home-network-upgrades"],
    sources: [
      { name: "TP-Link Deco BE63", url: "https://www.tp-link.com/us/deco-mesh-wifi/product-family/deco-be63/", note: "Official mesh WAN/LAN and backhaul reference." },
      { name: "TRENDnet 2.5G unmanaged switch", url: "https://www.trendnet.com/products/2-5g-switch/TEG-S380", note: "Official port-speed and switching reference; verify the live model before purchase." },
      { name: "TP-Link UE302C", url: "https://www.tp-link.com/us/home-networking/usb-adapter/ue302c/", note: "Official USB-C 2.5GbE adapter reference and host compatibility." },
    ],
    sections: [
      { heading: "Start at the ISP handoff", body: "Confirm the modem or ONT port, service tier, and router WAN port. A 2.5Gbps plan connected through a one-gigabit handoff cannot reach the intended speed regardless of the mesh label." },
      { heading: "Assign one job to every fast port", body: "Decide whether the fastest port serves WAN, Ethernet backhaul, switch uplink, NAS, or a workstation. Avoid buying a router with one 2.5GbE port when the same port must serve both WAN and the local network." },
      { heading: "Count the devices behind the switch", body: "List desktops, NAS, TVs, access points, cameras, and mesh satellites. A compact unmanaged switch can add ports, but every client still negotiates at its own adapter speed and shares the uplink." },
      { heading: "Check the client adapter and operating system", body: "A laptop may need a compatible USB-C or USB-A 2.5GbE adapter, current driver, and a suitable dock path. Confirm the host port, cable, driver, and negotiated link rather than trusting the adapter box." },
      { heading: "Use the right cable and test the negotiated link", body: "Use a sound Cat5e or better run within the installed path and replace suspect patch cables before replacing the router. Test the link speed, local file transfer, and internet speed separately." },
    ],
  },
];
