export { miniPcProfiles } from "./tiny-models";
// Editorial facts and offer identity are deliberately separate. No live price or stock is inferred here.
export const evidenceCheckedAt = "October 19, 2026";
export type EvidenceSource = { id: string; title: string; url: string; locator: string; checkedAt?: string };
export const compatibilitySources: EvidenceSource[] = [
  {id:"m70q-gen2",title:"Lenovo PSREF: ThinkCentre M70q Gen 2",url:"https://psref.lenovo.com/syspool/Sys/PDF/ThinkCentre/ThinkCentre_M70q_Gen_2/ThinkCentre_M70q_Gen_2_Spec.pdf",locator:"Memory/Storage p.3 and expansion p.5: two DDR4 slots, one storage M.2 and one WLAN M.2. Chipset label conflicts with processor information; chipset-derived claims remain unresolved.",checkedAt:"October 20, 2026"},
  {id:"m70q-gen2-hmm",title:"Lenovo M70q Gen 2 / M90q Gen 2 maintenance manual",url:"https://download.lenovo.com/pccbbs/thinkcentre_pdf/m70q_gen2_m90q_gen2_hmm_en.pdf",locator:"Manufacturer maintenance reference; use the exact machine type and Parts Lookup for fitted parts. This library has not verified an M70q Gen 2 cable/carrier or a cross-generation replacement.",checkedAt:"October 20, 2026"},
  {id:"m710q",title:"Lenovo PSREF: ThinkCentre M710 Tiny",url:"https://psref.lenovo.com/syspool/Sys/PDF/ThinkCentre/ThinkCentre_M710_Tiny/ThinkCentre_M710_Tiny_Spec.pdf",locator:"One-page platform specification: memory, storage, processor-dependent memory rate and power"},
  {id:"m710q-hmm",title:"Lenovo M710q user and hardware maintenance manual",url:"https://download.lenovo.com/pccbbs/pubs/m710q/en/index.html",locator:"Cover machine types; replaceable parts; storage drive, memory and M.2 replacement topics"},
  {id:"m910q",title:"Lenovo PSREF: ThinkCentre M910 Tiny",url:"https://psref.lenovo.com/syspool/Sys/PDF/ThinkCentre/ThinkCentre_M910_Tiny/ThinkCentre_M910_Tiny_Spec.pdf",locator:"One-page platform specification: memory, storage, chipset and power; M910q not M910x"},
  {id:"m910q-hmm",title:"Lenovo M910q user and hardware maintenance manual",url:"https://download.lenovo.com/pccbbs/pubs/m910q/en/index.html",locator:"Cover machine types; system board; storage drive, memory and M.2 replacement topics"},
  {id:"m70q-gen3",title:"Lenovo PSREF: ThinkCentre M70q Gen 3",url:"https://psref.lenovo.com/syspool/Sys/PDF/ThinkCentre/ThinkCentre_M70q_Gen_3/ThinkCentre_M70q_Gen_3_Spec.pdf",locator:"Memory and Storage (p.3); Power (p.4); Expansion and Ethernet (p.5): DDR4, one SSD position"},
  {id:"m70q-gen3-hmm",title:"Lenovo Gen 3 user guide: M70q / M80q / M90q",url:"https://download.lenovo.com/pccbbs/thinkcentre_pdf/m70q_gen3_m80q_gen3_m90q_gen3_ug_en.pdf",locator:"Printed p.5 memory distinction; pp.42–43 HDD bracket; pp.49–50 M.2 and memory. Cable/riser FRUs still require Parts Lookup."},
  {id:"m90q-gen3",title:"Lenovo PSREF: ThinkCentre M90q Gen 3",url:"https://psref.lenovo.com/syspool/Sys/PDF/ThinkCentre/ThinkCentre_M90q_Gen_3/ThinkCentre_M90q_Gen_3_Spec.pdf",locator:"Memory (p.3), Storage/Power (p.4), Expansion (p.5): DDR5, two SSD positions; match fitted options"},
  {id:"m90q-gen3-hmm",title:"Lenovo Gen 3 user guide: M90q / M80q / M70q",url:"https://download.lenovo.com/pccbbs/thinkcentre_pdf/m70q_gen3_m80q_gen3_m90q_gen3_ug_en.pdf",locator:"Printed p.5 DDR5; pp.42–43 HDD bracket; pp.49–50 M.2 and memory; not an arbitrary PCIe-card installation approval"},
  {id:"tiny-gen3-types",title:"Lenovo Gen 3 machine-type identification",url:"https://download.lenovo.com/pccbbs/thinkcentre_pdf/m70q_gen3_m80q_gen3_m90q_gen3_ug_en.pdf",locator:"Printed p.57, Appendix A, Certification-related information: product names mapped to machine types"},

  { id: "m720q-hmm", title: "Lenovo M720Q hardware maintenance manual", url: "https://download.lenovo.com/pccbbs/thinkcentre_pdf/m720q_ughmm_en.pdf", locator: "Printed pp. 26–30: drive, cable, PCIe adapter; pp. 50–53: memory and M.2 locking clip; match cover machine type" },
  { id: "kingston-m720q", title: "Kingston memory selector: M720Q Tiny", url: "https://www.kingston.com/en/memory/search/model/99279/lenovo-thinkcentre-m720q-tiny", locator: "System-specific module list: KCP426SS6/4 (4GB), KCP426SS8/8 (8GB), KCP426SD8/16 (16GB); manufacturer-selector evidence, not Lenovo FRUs or seller stock" },
  { id: "m920q-hmm", title: "Lenovo M920Q hardware maintenance manual", url: "https://download.lenovo.com/pccbbs/thinkcentre_pdf/m920q_ughmm_en.pdf", locator: "Printed pp. 26–30: drive, cable, PCIe adapter; pp. 50–53: memory and M.2 locking clip; match cover machine type" },
  { id: "kingston-m920q", title: "Kingston memory selector: M920Q Tiny", url: "https://www.kingston.com/unitedkingdom/en/memory/search/model/98610/lenovo-thinkcentre-m920-m920q-tiny", locator: "System-specific module list: KCP426SS6/4 (4GB), KCP426SS8/8 (8GB), KCP426SD8/16 (16GB); manufacturer-selector evidence, not Lenovo FRUs or seller stock" },
  { id: "m920x-hmm", title: "Lenovo M920X hardware maintenance manual", url: "https://download.lenovo.com/pccbbs/thinkcentre_pdf/m920x_ughmm_en.pdf", locator: "Printed pp. 26–30: drive, cable, PCIe adapter; pp. 50–53: memory and M.2 locking clip; match cover machine type" },
  { id: "kingston-m920x", title: "Kingston memory selector: M920X Tiny", url: "https://www.kingston.com/en/memory/search/model/98785/lenovo-thinkcentre-m920x-tiny", locator: "System-specific module list: KCP426SS6/4 (4GB), KCP426SS8/8 (8GB), KCP426SD8/16 (16GB); manufacturer-selector evidence, not Lenovo FRUs or seller stock" },
  { id: "lenovo-parts", title: "Lenovo Parts Lookup", url: "https://support.lenovo.com/us/en/parts-lookup", locator: "Identify by machine type / serial; match FRU and substitute list before ordering; enter serial only on Lenovo, not Madabase" },
  { id: "mx500", title: "Crucial MX500 product flyer", url: "https://www.crucial.es/content/dam/crucial/ssd-products/mx500/flyer/crucial-mx500-ssd-productflyer-letter-en.pdf", locator: "2.5-inch 7mm SATA model CT1000MX500SSD1; product specification only, not machine qualification" },
  { id: "samsung-970", title: "Samsung 970 EVO Plus datasheet", url: "https://download.semiconductor.samsung.com/resources/data-sheet/Samsung_NVMe_SSD_970_EVO_Plus_Data_Sheet_Rev.3.0_10129514049229.pdf", locator: "Product specifications and model codes: 1TB MZ-V7S1T0B/AM, M.2 2280, PCIe 3.0 x4 NVMe" },
  { id: "netgear-multigig", title: "NETGEAR: Multi-Gigabit Ethernet", url: "https://kb.netgear.com/000049004/What-is-Multi-Gigabit-Ethernet-and-how-can-I-benefit-from-using-NETGEAR-Multi-Gigabit-Ethernet-Switches-in-my-network", locator: "Negotiated port speeds and endpoint/cabling requirements; not application throughput" },
  { id: "netgear-ms305", title: "NETGEAR MS305 installation guide", url: "https://www.downloads.netgear.com/files/GDC/MS305/MS305_IG_EN.pdf", locator: "Connect the switch; five/eight physical ports and port LED link-rate indications" },
  { id: "tplink-ue302c", title: "TP-Link UE302C specifications", url: "https://www.tp-link.com/uk/home-networking/usb-ethernet-adapter/ue302c/", locator: "USB 3.0 Type-C input; one 2.5 Gigabit Ethernet output; OS and driver requirements" },
  { id: "apple-air", title: "Apple: MacBook Air display support", url: "https://support.apple.com/en-us/122212", locator: "M4/M5: Two external displays; maximum resolution and refresh combinations" },
  { id: "apple-pro", title: "Apple: MacBook Pro display support", url: "https://support.apple.com/en-us/101571", locator: "Chip-specific external display counts and connection combinations" },
  { id: "apple-m3", title: "Apple: M3 closed-lid dual displays", url: "https://support.apple.com/en-us/117373", locator: "Before you begin; connect displays; opening the lid" },
  { id: "apple-m1", title: "Apple: M1 MacBook Air technical specifications", url: "https://support.apple.com/en-us/111883", locator: "Video Support: one external display" },
  { id: "apple-m2", title: "Apple: M2 MacBook Air technical specifications", url: "https://support.apple.com/en-us/111867", locator: "Display Support: one external display" },
  { id: "ts4", title: "CalDigit TS4 manual", url: "https://downloads.caldigit.com/TS4/CalDigit_TS4_Manual.pdf", locator: "DisplayPort / Thunderbolt monitor connections and supported hosts" },
  { id: "caldigit-mac", title: "CalDigit: MacBook multiple-monitor support", url: "https://www.caldigit.com/macbook-multiple-monitor-support-with-caldigit-thunderbolt-docks/", locator: "Thunderbolt 4 support table and M3 closed-lid notes" },
  { id: "ud5", title: "Plugable TBT4-UD5", url: "https://plugable.com/products/tbt4-ud5", locator: "Features: dual 4K60 HDMI; macOS compatibility; 96W certified charging" },
  { id: "displaylink", title: "Plugable USBC-6950PDZ", url: "https://plugable.com/products/usbc-6950pdz", locator: "Features and power: dual HDMI 4K60, driver, HDCP, 82W, charger not included" },
  { id: "lx", title: "Ergotron LX specification sheet", url: "https://media.ergotron.com/reserved/resources/lx-arms-fur-all-ea-orig.pdf", locator: "LX Desk Monitor Arm: load range, VESA and 2-piece clamp; do not substitute LX Pro" },
  { id: "lx-clamp", title: "Ergotron LX attachment geometry (German)", url: "https://media.ergotron.com/reserved/resources/choose-attachment-lx-de-orig.pdf", locator: "Standard 2-piece desk clamp diagram; verify supplied clamp revision" },
  { id: "dell-27-32", title: "Dell U2723QE / U3223QE official datasheet", url: "https://www.delltechnologies.com/asset/en-us/products/electronics-and-accessories/technical-support/dell-ultrasharp-27-and-32-usbc-hub-monitors-u2723qe-u3223qe-datasheet.pdf", locator: "Technical specification: panel-only VESA weight; mounting interface. Direct PDF access can vary by region." },
  { id: "dell-40", title: "Dell U4025QW technical specifications", url: "https://www.dell.com/en-us/shop/monitors/apd/dell-ultrasharp-40-curved-thunderbolttm-hub-monitor-u4025qw/u4025qw_monitor/-", locator: "Physical Characteristics: VESA 100×100; Dimensions and Weight: 8.35kg without stand and cables; curved panel" },
  { id: "hx", title: "Ergotron HX specification sheet", url: "https://media.ergotron.com/reserved/resources/05-hxarms-fur-ea-orig.pdf", locator: "HX Single load range and VESA; pivot accessories are distinct" },
  { id: "hx-clamp", title: "Ergotron HX attachment geometry", url: "https://www.ergotron.com/portals/0/literature/guidelines/choose-attachment-hx.pdf", locator: "Standard 2-piece desk clamp: 16–66mm; use exact clamp revision" },
  { id: "m720q", title: "Lenovo PSREF: ThinkCentre M720 Tiny", url: "https://psref.lenovo.com/syspool/Sys/PDF/ThinkCentre/ThinkCentre_M720_Tiny/ThinkCentre_M720_Tiny_Spec.html", locator: "Memory; Storage; Power Supply; Mechanical notes; Onboard Ethernet" },
  { id: "m920q", title: "Lenovo PSREF: ThinkCentre M920 Tiny", url: "https://psref.lenovo.com/syspool/Sys/PDF/ThinkCentre/ThinkCentre_M920_Tiny/ThinkCentre_M920_Tiny_Spec.html", locator: "Memory; Storage; Power Supply; Mechanical notes; Onboard Ethernet" },
  { id: "m920x", title: "Lenovo PSREF: ThinkCentre M920x Tiny", url: "https://psref.lenovo.com/syspool/Sys/PDF/ThinkCentre/ThinkCentre_M920x_Tiny/ThinkCentre_M920x_Tiny_Spec.html", locator: "Memory footnotes; Storage; RAID special-bid condition; Mechanical conflict note" },
];
export const macProfiles = [
  { id: "m1-air", name: "MacBook Air M1", open: 1, closed: 1, sources: ["apple-m1"] },
  { id: "m2-air", name: "MacBook Air M2", open: 1, closed: 1, sources: ["apple-m2"] },
  { id: "m3", name: "MacBook Air / base MacBook Pro M3", open: 1, closed: 2, sources: ["apple-m3"] },
  { id: "m4-air", name: "MacBook Air M4", open: 2, closed: 2, sources: ["apple-air"] },
  { id: "m5-air", name: "MacBook Air M5", open: 2, closed: 2, sources: ["apple-air"] },
  { id: "m4-base", name: "MacBook Pro with base M4", open: 2, closed: 2, sources: ["apple-pro"] },
  { id: "m5-base", name: "MacBook Pro with base M5", open: 2, closed: 2, sources: ["apple-pro"] },
  { id: "pro", name: "MacBook Pro with M1/M2/M3/M4 Pro", open: 2, closed: 2, sources: ["apple-pro"] },
  { id: "m5-pro", name: "MacBook Pro with M5 Pro", open: 3, closed: 3, sources: ["apple-pro"] },
  { id: "max", name: "MacBook Pro with M1/M2/M3/M4/M5 Max", open: 4, closed: 4, sources: ["apple-pro"] },
];
export const dockProfiles = [
  { id: "ts4", name: "CalDigit TS4", technology: "native", displays: 2, hostWatts: 98, ethernetGbps: 2.5, productSlug: "caldigit-ts4-thunderbolt-dock", sources: ["ts4", "caldigit-mac"], wiring: "Mac Thunderbolt port → supplied Thunderbolt cable → TS4. Screen 1: TS4 DisplayPort → display. Screen 2: a downstream Thunderbolt port → USB-C/Thunderbolt display, or a suitable USB-C-to-HDMI/DisplayPort video adapter. The USB-C data-only ports are not display outputs." },
  { id: "ud5", name: "Plugable TBT4-UD5", technology: "native", displays: 2, hostWatts: 96, ethernetGbps: 1, productSlug: "plugable-tbt4-ud5-thunderbolt-dock", sources: ["ud5"], wiring: "Mac Thunderbolt port → supplied Thunderbolt host cable → TBT4-UD5. Use one HDMI cable from each HDMI output to each screen. Do not replace the host cable with a charge-only USB-C cable." },
  { id: "displaylink", name: "Plugable USBC-6950PDZ", technology: "displaylink", displays: 2, hostWatts: 82, ethernetGbps: 1, productSlug: "plugable-usbc-6950pdz-displaylink-dock", sources: ["displaylink"], wiring: "Mac USB-C port → dock → two HDMI cables → two HDMI displays. Install DisplayLink Manager and allow the required macOS permissions. Add a compatible 45–100W USB-C charger; it is not included. 82W is the maximum host output with a sufficient power source, not a promise for every charger." },
] as const;
export const armProfiles = [
  { id: "lx", name: "Ergotron LX single, standard 2-piece clamp", sku: "45-241 series (not LX Pro)", minKg: 3.2, maxKg: 11.3, minMm: 10, maxMm: 60, vesa: ["75x75", "100x100"], source: "lx", href: "/best/best-monitor-arms-for-home-office" },
  { id: "hx", name: "Ergotron HX single, standard 2-piece clamp", sku: "45-475 series; original clamp drawing", minKg: 9, maxKg: 19, minMm: 16, maxMm: 66, vesa: ["75x75", "100x100", "200x200"], source: "hx", href: "/reviews/ergotron-hx-monitor-arm" },
];
export const monitorProfiles = [
  { id: "u2723qe", name: "Dell U2723QE", kg: 4.48, vesa: "100x100", curved: "flat", source: "dell-27-32" },
  { id: "u3223qe", name: "Dell U3223QE", kg: 5.65, vesa: "100x100", curved: "flat", source: "dell-27-32" },
  { id: "u4025qw", name: "Dell U4025QW", kg: 8.35, vesa: "100x100", curved: "curved", source: "dell-40" },
];
export function evidenceSources(ids: readonly string[]) { return compatibilitySources.filter((source) => ids.includes(source.id)); }
