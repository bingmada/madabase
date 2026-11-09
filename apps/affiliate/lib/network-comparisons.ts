import type { Roundup } from "./types";

type Review = Pick<Roundup,"quickAnswer"|"comparisonTable"|"decisionGuide"> & { productSlugs?: string[] };
const table = (title: string, columns: string[], rows: [string,...string[]][]) => ({title,columns,rows:rows.map(([label,...values])=>({label,values}))});

// These are decisions from the existing model evidence, not scores or tests.
// Pack quantities describe the registered offers, not interchangeable prices.
export const networkComparisonReviews: Record<string,Review> = {
  "best-mesh-wifi-for-apartments-and-homes": {
    quickAnswer: "Keep one well-placed router when it covers the required rooms. Choose mesh only for repeatable remaining gaps with useful node positions and a strong wireless or supported Ethernet backhaul. BE25 can suit a wiring-first layout; BE63 adds 6GHz and more multi-gig ports. Premium Deco or Orbi hardware needs a defined capacity or port requirement. Decide the smallest useful node count before comparing the linked packs.",
    productSlugs: ["tp-link-deco-be25-wifi-7-mesh","tp-link-deco-be63-wifi-7-mesh","tp-link-deco-be67-wifi-7-mesh","tp-link-deco-be85-wifi-7-mesh","asus-zenwifi-bt6-wifi-7-mesh","amazon-eero-6-mesh-wifi-system","netgear-orbi-970-wifi-7-mesh"],
    comparisonTable: table("Choose the layout before the mesh kit",["Useful requirement","Limit to resolve"],[
      ["Keep one router","Important rooms work after practical placement checks","A mesh purchase is unnecessary for this stated task"],
      ["BE25 · linked two-pack","Dual-band mesh with supported Ethernet backhaul and two 2.5GbE ports per node","No 6GHz; assign WAN and backhaul before calling a port spare"],
      ["BE63 · linked three-pack","6GHz or several useful 2.5GbE connections per node","Three nodes need useful positions; compare the same quantity before price"],
      ["BE67 / BE85 · linked two-packs","A defined 10GbE or greater radio-capacity job","BE67 has one 10GbE port; BE85's RJ45/SFP+ combo is one shared link"],
      ["eero 6 · three routers","An app-led Gigabit-era layout with three useful positions","Portless extenders are different; optional paid features need separate checking"],
      ["BT6 / Orbi 970","A deliberate ASUS or premium Orbi system choice","Original BT6 purchase remains paused; advertised coverage is not a property test"],
    ]),
    decisionGuide:[{label:"One weak room",detail:"Test placement, a cable-fed AP or one supported relay before replacing a complete system."},{label:"Several separate zones",detail:"Draw each node and its upstream path. A larger pack is useful only when the additional position serves a remaining need."}],
  },
  "best-wifi-7-routers-for-home-networks": {
    quickAnswer:"Choose a single router when one practical central position can serve the home. BE400 suits a defined 2.5GbE WAN/LAN route; RT-BE86U adds a 10GbE path and more 2.5GbE LAN ports. Both are dual-band without 6GHz. Compare a tri-band mesh node only when its radio or future supported node layout solves a real requirement. Keep a working router when placement or provider service is the actual limit.",
    comparisonTable:table("One-router port and radio decision",["BE400","RT-BE86U","BE63 system reference"],[
      ["Radio scope","2.4/5GHz; no 6GHz","2.4/5GHz; no 6GHz","Tri-band including 6GHz"],
      ["Wired roles","1×2.5G WAN; 1×2.5G LAN; 3×1G LAN","1×10G WAN/LAN; 4×2.5G LAN","4×2.5G WAN/LAN per node"],
      ["Purchase scope","One router","One router","Registered offer is three nodes, not a single-unit price"],
      ["Do not choose for","An assumed 6GHz radio or guaranteed distant-room coverage","Guaranteed gaming latency or automatic whole-home coverage","A second or third node without a useful placement and backhaul plan"],
    ]),
  },
  "best-wired-networking-upgrades": {
    quickAnswer:"Identify whether the missing piece is a port, a faster link, a suitable cable route or laptop connectivity. A switch cannot repair a failed cable, and a hub cannot upgrade a slower upstream network. Keep adequate components. Choose each item for the isolated job rather than treating this mixed list as a ranking of substitutes.",
    comparisonTable:table("Match the part to the problem",["Choose this for","Check first"],[
      ["TL-SG108 / GS308E","More Gigabit sockets; GS308E adds documented basic management","Eight total ports include the uplink; neither provides PoE"],
      ["TEG-S380","Several endpoints with a useful 2.5GbE path","Eight total ports, hardware revision and no configurable management"],
      ["Jadaol White 50ft","A suitable protected serviceable cable route","No concealed-installation approval or faster category is inferred"],
      ["SlimRun Blue 5ft ten-pack","Short accessible patching","It is a ten-pack and not a room-to-room cable; check PoE requirements"],
      ["UGREEN 15598 hub","An exact host needing its Ethernet, USB and supported display functions","4K30 ceiling; conflicting laptop charging output remains a check"],
    ]),
  },
  "deco-be25-vs-be67": {
    quickAnswer:"Choose BE25 when dual-band coverage, useful wired backhaul and two 2.5GbE ports per node meet the layout. Consider BE67 for a defined 6GHz, wireless-backhaul or single 10GbE job. BE63 is also worth comparing when the gap between these two systems exceeds the actual requirement. Both registered offers are two-packs; confirm current region, revision and included supplies.",
    comparisonTable:table("BE25 and BE67: what changes the purchase",["BE25","BE67"],[
      ["Radio bands","2.4/5GHz; no 6GHz","2.4/5/6GHz"],
      ["Ports per node","2×2.5GbE","1×10GbE + 1×2.5GbE + 1×1GbE"],
      ["Registered pack","Two nodes","Two nodes"],
      ["Useful reason","Wiring-first mesh without a 6GHz requirement","One defined 10GbE link or justified additional radio capacity"],
      ["Hold the purchase","Unknown layout or two ports already allocated","No identified workload for the premium; one fast port cannot serve two physical links"],
    ]),
  },
  "best-mesh-wifi-for-2-5gbps-internet": {
    comparisonTable:table("Mesh ports and pack quantities for a 2.5Gbps plan",["BE25","BE63","BE67","BE85"],[
      ["Ports per node","2×2.5GbE","4×2.5GbE","1×10G + 1×2.5G + 1×1G","1×10G RJ45 + 1×10G shared RJ45/SFP+ combo + 2×2.5G"],
      ["6GHz","No","Yes","Yes","Yes"],
      ["Registered offer","Two-pack","Three-pack","Two-pack","Two-pack"],
      ["Useful distinction","Dual-band, wiring-first value","Several 2.5G connections and tri-band radio","One defined 10G job","Two 10G-class links or a specific premium radio need"],
      ["Common stop","The modem, WAN, backhaul or client still limits the required path","The modem, WAN, backhaul or client still limits the required path","WAN use consumes the one 10G port","The combo's two sockets are not two simultaneous links"],
    ]),
  },
  "best-cable-modems-for-xfinity-spectrum-cox": {
    quickAnswer:"First confirm the current provider-approved exact model for the service address, speed tier, upload profile and voice requirements. Keep an adequate approved gateway or modem. S33, MB8611 and CODA56 are modem-only US cable references with a 2.5GbE handoff, not Wi-Fi routers, voice gateways or fiber ONTs. Only compare checkout cost and support after the service check passes.",
    comparisonTable:table("Complete the provider check before choosing a modem",["Required evidence","What these examples do not establish"],[
      ["Address and tier","The provider currently approves the exact model and profile","A DOCSIS 3.1 or 2.5GbE badge is not address-specific approval"],
      ["Voice and plan terms","The permitted voice path and rental/plan consequences","These three references do not supply voice ports or Wi-Fi"],
      ["Router handoff","A separate router accepts the required rate","Two modem sockets do not automatically bond into one faster service"],
      ["Keep the current gateway","Current workload and provider terms already fit","A newer router is not a reason to replace the modem too"],
    ]),
  },
  "arris-s33-vs-motorola-mb8611-vs-hitron-coda56": {
    quickAnswer:"Among models currently approved for your exact service, compare the delivered New-unit cost, seller, support and physical fit. S33 lists a 2.5GbE port plus a separate Gigabit port; MB8611 and CODA56 each list one 2.5GbE port. None supplies routing, Wi-Fi or voice. An upload-profile benefit needs current provider confirmation, and CODA56's conflicting footprint figures remain a placement check.",
    comparisonTable:table("Modem-only identities and handoffs",["ARRIS S33","Motorola MB8611","Hitron CODA56"],[
      ["Selected ASIN","B08FMSC5WZ","B08DDFKXKC","B0BKZ4DHNL"],
      ["Ethernet","1×2.5GbE + 1×1GbE listed","1×2.5GbE","1×2.5GbE"],
      ["Router / Wi-Fi / voice","Not supplied","Not supplied","Not supplied"],
      ["Purchase check","Exact provider tier, upload profile and newer-model confusion","Provider tier, current support, New seller and warranty","Provider tier, support and conflicting size descriptions"],
      ["No purchase needed","Existing approved modem already meets the service","Existing approved modem already meets the service","Existing approved modem already meets the service"],
    ]),
  },
  "best-2-5g-home-network-upgrades": {
    quickAnswer:"Start with the component that preserves the current bottleneck. A five- or eight-port switch serves suitable local endpoints; an adapter adds one supported host connection; MoCA addresses a confirmed coax route. They solve different jobs. Keep working parts and count the whole path before buying a router, switch and adapters together.",
    comparisonTable:table("Choose the smallest useful 2.5G change",["Useful job","Stop condition"],[
      ["TEG-S350 / TEG-S380","More useful 2.5GbE sockets: five or eight total","Only a slower endpoint or storage device needs changing"],
      ["UE302C / NT-25GA","One supported USB host needs a 2.5GbE port","Unknown OS/driver or a slower shared USB path"],
      ["ECB7250K02 pair","A documented compatible coax link reaches a required room","Unknown coax, provider coexistence or mixed-node compatibility"],
      ["Keep the installed route","The actual workload already completes adequately","An internet speed class alone is not a local upgrade requirement"],
    ]),
  },
  "tp-link-ue302c-vs-sabrent-nt-25ga": {
    quickAnswer:"Both are one-port 2.5GbE USB-C adapters. Choose only after the exact host data path and OS/driver support are confirmed; neither provides displays, charging or a faster upstream network. Compare current seller, return and support terms. NT-25GA's extended-warranty registration condition is a separate ownership check, not a performance advantage.",
    comparisonTable:table("Two adapters under the same host requirements",["TP-Link UE302C","Sabrent NT-25GA"],[
      ["Selected ASIN","B0DSCDGD4G","B0CXBRNSC4"],
      ["Job","One 2.5GbE RJ45 connection over USB-C","One 2.5GbE RJ45 connection over USB-C"],
      ["Whole-path check","USB 3.0 or faster data, supported OS/driver, suitable Ethernet path","USB 3.0 or faster data, supported OS/driver, suitable Ethernet path"],
      ["Additional desk functions","No display, charging or extra USB ports","No display, charging or extra USB ports"],
      ["Ownership check","Exact revision, support, selected seller and returns","Selected seller and eligibility; 90-day registration condition for extended coverage"],
    ]),
  },
  "best-fanless-2-5gbe-switches-home-nas-mesh": {
    quickAnswer:"Count the upstream cable first: a five-port switch normally leaves four device sockets, and an eight-port switch leaves seven. TL-SG105-M2, MS305 and TEG-S350 suit the smaller layout; compare TEG-S380 when five ports are insufficient. All are unmanaged, fanless data-switch references. Choose another class for PoE or configurable management, and keep Gigabit when it already clears the workload.",
    comparisonTable:table("Port capacity before enclosure and support",["TL-SG105-M2","MS305","TEG-S350","TEG-S380"],[
      ["Total / after one uplink","5 / 4","5 / 4","5 / 4","8 / 7"],
      ["2.5GbE","All five ports","All five ports","All five ports; verify revision and legacy rates","All eight ports; verify revision"],
      ["Controls / power to devices","Unmanaged / no PoE","Unmanaged / no PoE","Unmanaged / no PoE","Unmanaged / no PoE"],
      ["Choose after count passes","Mounting, power-brick room, current documentation","Compact enclosure and documented mounting/support","Current revision and delivered value","More useful device sockets without managed features"],
    ]),
  },
  "tl-sg105-m2-vs-ms305-vs-teg-s350": {
    quickAnswer:"These three meet the same basic five-port unmanaged 2.5GbE job. Once four device sockets after the uplink are enough, choose by actual mounting space, received revision, supplied adapter, support and current delivered terms. Do not infer one is faster or more reliable without comparable testing. Move to eight ports or another managed/PoE class when the task requires it.",
    comparisonTable:table("Same five-port job, different installation checks",["TL-SG105-M2","MS305-100NAS","TEG-S350"],[
      ["Device sockets after uplink","Four","Four","Four"],
      ["Documented format","Fanless metal; desktop or wall mount","Fanless metal; desktop, wall or under-table mounting","Fanless; confirm supplied revision and mounting instructions"],
      ["Listed dimensions","8.2 × 4.9 × 1.0 in","6.2 × 4.0 × 1.1 in","Match the received revision's documentation"],
      ["Do not transfer","PoE or managed functions from similarly named products","MS305E management features to MS305","Current V2 details onto unidentified earlier stock"],
      ["Measured performance claim","No comparative throughput result is established here","No comparative throughput result is established here","No comparative throughput result is established here"],
    ]),
  },
  "best-ups-for-router-and-modem": {
    quickAnswer:"Measure the complete essential chain and choose by runtime at that load, battery-backed outlet fit and battery service. BE600M1 provides five battery-backed sockets; BE850G2 provides six and greater output capacity; SL700U offers a slim format with a non-user-replaceable battery. VA and maximum watts are not minutes of router runtime. Keep a healthy adequate UPS and verify whether the provider remains online during an outage.",
    comparisonTable:table("Network UPS: protected sockets and ownership",["APC BE600M1","APC BE850G2","CyberPower SL700U"],[
      ["Capacity","600VA / 330W","850VA / 450W","700VA / 370W"],
      ["Battery-backed / surge-only sockets","5 / 2","6 / 3","5 / 3"],
      ["Battery service","User-replaceable path listed","RBC17 replacement path listed","Non-user-replaceable"],
      ["Useful distinction","A modest measured network chain","Additional outlet/output headroom","Slim placement or documented wall mounting"],
      ["Installation scope","Selected 120V/NEMA model; original adapters stay in use","One UPS, not a modem/router bundle","Selected 120V model; half-load minutes are not a router-runtime promise"],
    ]),
  },
  "best-poe-switches-for-home-cameras-and-access-points": {
    quickAnswer:"List endpoint PoE standards, switch-side allocations and needed data rates first. Count powered ports separately from uplinks, then decide whether configurable management is required. The three general-purpose references differ in four versus eight powered-capable ports; RLA-PS1 has a camera-focused layout and an unresolved maker port-speed conflict. Keep adequate injectors or existing power when no shared switch is needed.",
    comparisonTable:table("Powered ports, total allocation and management",["TL-SG1005P","TL-SG108PE","GS308EPP","RLA-PS1"],[
      ["Total / powered-capable ports","5 / 4","8 / 4","8 / 8","8 powered + 2 listed Gigabit uplinks"],
      ["Listed shared PoE budget","65W; confirm revision and adapter","64W","123W","120W"],
      ["Management","Unmanaged","Easy Smart","Easy Smart Managed Essentials","Confirm the exact camera/NVR control requirements"],
      ["Data-path check","Gigabit; verify actual PoE+ revision limits","Gigabit; exact hardware/firmware","Gigabit; uplink still consumes a port","Maker overview/table conflict on powered-port speed remains unresolved"],
    ]),
  },
  "tp-link-tl-sg1005p-vs-tl-sg108pe-vs-netgear-gs308epp": {
    quickAnswer:"Choose TL-SG1005P for a confirmed four-device power plan without configurable management. Compare TL-SG108PE for four powered devices plus useful basic controls, and GS308EPP for more powered ports and a larger shared budget. Check each endpoint, the actual hardware revision and the uplink port. A managed-switch purchase alone does not implement camera isolation.",
    comparisonTable:table("Choose the powered-port and control plan",["TL-SG1005P","TL-SG108PE","GS308EPP"],[
      ["Total ports","Five Gigabit","Eight Gigabit","Eight Gigabit"],
      ["Powered-capable ports","Four; confirm actual revision's af/at limits","Four PoE+ listed","Eight PoE+ listed"],
      ["Shared budget","65W listed; match adapter/revision","64W listed","123W listed"],
      ["Controls","Unmanaged","Easy Smart management","Easy Smart Managed Essentials"],
      ["Reason to stop","Need VLAN configuration or more powered ports","Need more than four powered ports or faster-than-Gigabit data","Uplink/device count, 123W or Gigabit no longer meets the plan"],
    ]),
  },
  "tp-link-deco-be67-vs-be63": {
    quickAnswer:"Choose BE63 when four 2.5GbE ports per node serve the actual network. Choose BE67 for a defined job for its one 10GbE port or a justified radio-capacity requirement. Assign WAN before counting LAN/backhaul ports. The registered BE67 is a two-pack and BE63 a three-pack; compare equal useful node counts and full system cost, while keeping adequate existing equipment.",
    comparisonTable:table("BE67 versus BE63: the fast port has one job",["BE67","BE63"],[
      ["Ports per node","1×10GbE + 1×2.5GbE + 1×1GbE","4×2.5GbE"],
      ["If the fastest port is WAN","No second 10GbE port remains on that node","Three 2.5GbE ports remain before backhaul/client assignments"],
      ["Registered offer","Two-pack · B0FQYQRZQX","Three-pack · B0CN8QLS4K"],
      ["Useful reason","A documented 10GbE or radio-capacity requirement","Several useful 2.5GbE connections"],
      ["Shared check","Tri-band does not guarantee a client rate or wall coverage","Tri-band does not guarantee a client rate or wall coverage"],
    ]),
  },
  "deco-be25-vs-be63": {},
  "deco-be85-vs-be67": {
    quickAnswer:"BE85 is justified when a useful second 10GbE-class link, SFP+ route or specific premium radio requirement exceeds BE67's layout. BE67 fits a plan needing one 10GbE job. Both registered offers are two-packs. The BE85 RJ45/SFP+ combo is one shared logical port, not two simultaneous links; keep a suitable smaller system when the premium solves no remaining task.",
    comparisonTable:table("BE85 and BE67: useful ports rather than aggregate speed",["BE85","BE67"],[
      ["10GbE-class links per node","One RJ45 + one shared RJ45/SFP+ combo","One RJ45"],
      ["Other ports","2×2.5GbE","1×2.5GbE + 1×1GbE"],
      ["Registered offer","Two-pack · B0C4W1L4B3","Two-pack · B0FQYQRZQX"],
      ["Useful requirement","Two defined fast-link jobs, supported optics or a specific radio-capacity need","One defined 10GbE link and an adequate remaining port plan"],
      ["Do not infer","Both combo sockets can be used simultaneously","A 10GbE WAN leaves another 10GbE LAN port"],
    ]),
  },
  "asus-zenwifi-bt6-vs-deco-be63": {
    comparisonTable:table("Different kits and different wired paths",["ASUS BT6","Deco BE63"],[
      ["Registered identity","B0DHWBW4MZ · two-pack","B0CN8QLS4K · three-pack"],
      ["Ports per node","1×2.5GbE WAN + 3×1GbE LAN listed","4×2.5GbE WAN/LAN"],
      ["Wired-backhaul consequence","Do not infer a second multi-gig LAN port","Allocate WAN and backhaul from the same four ports"],
      ["Retailer state","Original purchase path remains paused pending ownership conditions","A separate documented product and quantity, not a substitute ASUS listing"],
      ["First decision","Do two useful nodes serve the actual layout?","Does the layout justify three nodes?"],
    ]),
  },
  "netgear-gs308e-vs-tp-link-tl-sg108": {
    quickAnswer:"Choose GS308E-400NAS only when its documented basic VLAN, QoS or monitoring controls have a defined job. TL-SG108 is the simpler unmanaged eight-port Gigabit option. Both have no PoE and leave seven sockets after one uplink. Keep the current switch when its ports and controls already meet the task; choose another class for useful multi-gig or powered links.",
    comparisonTable:table("Eight Gigabit ports: do the controls have a job?",["GS308E-400NAS","TL-SG108, No PoE"],[
      ["Management","Easy Smart features; match exact revision","Unmanaged"],
      ["Total / after one uplink","8 / 7","8 / 7"],
      ["Rate and endpoint power","Gigabit; no PoE","Gigabit; no PoE"],
      ["Useful reason","A documented configuration or visibility requirement","Simple port expansion without that configuration work"],
      ["Do not transfer","Features from another GS308 suffix/revision","Management or PoE from similarly named TP-Link models"],
    ]),
  },
  "best-deco-wifi-7-mesh-for-wired-backhaul": {
    quickAnswer:"For an already practical Ethernet backhaul, compare the ports left after WAN and satellite connections. BE25 can meet a dual-band, wiring-first requirement; BE63 adds 6GHz and four 2.5GbE ports; BE67 adds one 10GbE job with fewer equal-speed sockets. Keep adequate existing mesh. Check each remote node and switch, not only the main unit's headline class.",
    comparisonTable:table("Ports remaining for a wired mesh plan",["BE25","BE63","BE67"],[
      ["Ports per node","2×2.5GbE","4×2.5GbE","1×10G + 1×2.5G + 1×1G"],
      ["6GHz","No","Yes","Yes"],
      ["Registered offer","Two-pack","Three-pack","Two-pack"],
      ["Main-node planning","WAN plus one backhaul can occupy both ports","Assign WAN, backhaul and useful wired clients","Using 10G for WAN leaves 2.5G and 1G for the other jobs"],
      ["Satellite planning","A wired backhaul spends one of two ports","A wired backhaul spends one of four ports","Choose which speed the backhaul consumes"],
    ]),
  },
};

export function reviewedNetworkComparison(roundup: Roundup): Roundup {
  if(roundup.site!=="network") return roundup;
  const review=networkComparisonReviews[roundup.slug];
  return review ? {...roundup,...review,decisionFirst:true,updatedAt:"November 7, 2026"} : roundup;
}
