import { siteGuides, siteProducts, siteRoundups, siteTools } from "./content";
import type { SiteKey } from "./types";
import type { SearchEntry } from "../../shared/content-search";

export const searchSites: SiteKey[] = ["homeoffice", "network", "smarthome", "baby", "pet", "style", "costume"];
const hosts: Record<SiteKey, string> = { homeoffice: "homeoffice", network: "network", smarthome: "smarthome", baby: "baby", pet: "pets", style: "style", costume: "costumes" };
export function siteSearchIndex(site: SiteKey): SearchEntry[] {
  const visible = (item: { publicationStatus?: string; discoveryExcluded?: boolean; sitemapExcluded?: boolean }) => item.publicationStatus !== "draft" && !item.discoveryExcluded && !item.sitemapExcluded;
  const result: SearchEntry[] = [
    ...siteGuides(site).filter(visible).map((item) => ({ site, kind: "guide" as const, title: item.title, summary: item.dek, href: `/guides/${item.slug}`, category: item.category })),
    ...siteProducts(site).filter(visible).map((item) => ({ site, kind: "product" as const, title: item.name, summary: item.summary, href: `/reviews/${item.slug}`, category: item.category, aliases: [item.brand, item.specs.Model ?? "", item.asin ?? ""] })),
    ...siteRoundups(site).filter(visible).map((item) => ({ site, kind: "comparison" as const, title: item.title, summary: item.dek, href: `/best/${item.slug}`, category: item.category })),
    ...siteTools(site).filter(visible).map((item) => ({ site, kind: "tool" as const, title: item.title, summary: item.dek, href: `/tools/${item.slug}`, category: item.category })),
  ];
  if (site === "homeoffice") result.unshift(
    { site, kind: "topic", title: "MacBook and dock compatibility finder", summary: "Chip, lid position, two independent displays, cables, power and DisplayLink permissions.", href: "/compatibility/docks", category: "desks", aliases: ["TS4", "TBT4-UD5", "USBC-6950PDZ", "M1 M2 M3 M4 M5", "dual monitors"] },
    { site, kind: "topic", title: "Monitor arm and desk fit checker", summary: "Screen weight without stand, VESA pattern, clamp thickness, curved-screen and desk construction checks.", href: "/compatibility/monitor-arms", category: "ergonomics", aliases: ["Ergotron HX", "Ergotron LX", "VESA", "Dell U2723QE U3223QE U4025QW"] },
    { site, kind: "topic", title: "ThinkCentre Tiny upgrade planner", summary: "Compare M720q, M920q and M920x memory, SSD slots, PCIe conflicts and missing parts.", href: "/compatibility/mini-pcs", category: "desks", aliases: ["M720q M920q M920x RAM SSD PCIe"] },
  );
  if (site === "network") result.unshift({ site, kind: "topic", title: "NAS and Ethernet bottleneck planner", summary: "Check every link from a laptop or Tiny PC to a NAS, count switch ports and distinguish LAN from internet speed.", href: "/compatibility/ethernet", category: "wired", aliases: ["2.5GbE", "10GbE", "NAS", "switch", "Tiny"] });
  return [...new Map(result.map((item) => [item.href, item])).values()];
}
export function allSiteSearchIndex(): SearchEntry[] {
  return searchSites.flatMap((site) => siteSearchIndex(site).map((entry) => ({ ...entry, href: `https://${hosts[site]}.madabase.com${entry.href}` })));
}
