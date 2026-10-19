import Link from "next/link";
import type { SiteKey } from "@/lib/types";
export function DiscoveryHome({ site }: { site: SiteKey }) {
  if (site !== "homeoffice" && site !== "network") return null;
  const items = site === "homeoffice" ? [
    ["Connect your displays", "Match your MacBook, dock and screen requirements. See the cable path and reasons a setup will not work.", "/compatibility/docks"],
    ["Mount your monitor", "Check weight, VESA, curved-screen depth and the actual desk attachment before choosing an arm.", "/compatibility/monitor-arms"],
    ["Upgrade a Tiny PC", "Compare M720q, M920q and M920x slots, memory, missing parts and storage conflicts.", "/compatibility/mini-pcs"],
  ] : [
    ["Find the wired bottleneck", "Map the PC, adapters, switch and NAS. Calculate link-rate ceilings and the ports your setup needs.", "/compatibility/ethernet"],
    ["Choose the mesh and pack", "Compare the exact Deco model, backhaul path and two- versus three-unit setup.", "/guides/deco-be63-vs-be67-vs-be85-buying-guide"],
    ["Check a Tiny PC upgrade", "Start with the exact computer's storage, slots and missing parts, then plan its network.", "https://homeoffice.madabase.com/compatibility/mini-pcs"],
  ];
  return <section className="section bg-[var(--surface-muted)]"><div className="shell"><p className="eyebrow">Start with your equipment</p><h2 className="mt-3 text-3xl font-black">Check the whole setup before buying a part.</h2><div className="discovery-grid">{items.map(([title, body, href]) => <article className="discovery-card" key={href}><h3><Link href={href}>{title} →</Link></h3><p>{body}</p></article>)}</div><Link className="font-bold underline" href="/search">Search every guide, comparison and model →</Link></div></section>;
}
