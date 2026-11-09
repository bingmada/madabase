import Link from "next/link";
import { Menu } from "lucide-react";
import type { SiteConfig } from "@/lib/sites";
import { NavigationDisclosure } from "./NavigationDisclosure";
import { PageCommissionDisclosure } from "./PageCommissionDisclosure";
import { NetworkJourneyEvents } from "./NetworkPlanState";

const nav=[ ["Wi-Fi & mesh","/categories/wifi"],["Wired & installation","/categories/wired"],["Power & recovery","/categories/backup"],["Search models","/search"] ];
export function NetworkChrome({site,children}:{site:SiteConfig;children:React.ReactNode}) {
  return <body className="network-site" style={{"--brand":site.theme.brand,"--brand-strong":site.theme.brandStrong,"--brand-soft":site.theme.brandSoft,"--accent":site.theme.accent,"--accent-soft":site.theme.accentSoft} as React.CSSProperties}>
    <a className="network-skip" href="#network-main">Skip to content</a><div className="network-publication"><div className="shell"><a href="https://madabase.com">Madabase</a><span>Independent consumer research</span></div></div>
    <header className="network-header"><div className="shell"><Link className="network-logo" href="/">Signalwise<span>Picks</span></Link><nav className="network-desktop-nav" aria-label="Primary navigation">{nav.map(([name,href])=><Link key={href} href={href}>{name}</Link>)}</nav><NavigationDisclosure className="network-mobile-nav"><summary aria-label="Open navigation menu"><Menu size={20} aria-hidden="true"/>Browse</summary><nav aria-label="Mobile navigation"><Link href="/">Home</Link>{nav.map(([name,href])=><Link key={href} href={href}>{name}</Link>)}<Link href="/compatibility/ethernet">Check an Ethernet path</Link><Link href="/methodology">Research method</Link></nav></NavigationDisclosure></div></header>
    <div id="network-main" tabIndex={-1}/><NetworkJourneyEvents/>{children}
    <footer className="network-footer"><div className="shell"><div className="network-footer-top"><div><Link className="network-logo" href="/">Signalwise<span>Picks</span></Link><p>Home-network decisions from Madabase.</p><p>Keep useful equipment. Match the complete path before buying.</p></div><nav aria-label="Topic libraries">{nav.map(([name,href])=><Link key={href} href={href}>{name}</Link>)}<Link href="/compatibility/ethernet">Ethernet checker</Link></nav><nav aria-label="Site information">{["about","methodology","editorial-policy","affiliate-disclosure","privacy","contact"].map(slug=><Link key={slug} href={`/${slug}`}>{({about:"About",methodology:"Research method","editorial-policy":"Editorial policy","affiliate-disclosure":"Affiliate disclosure",privacy:"Privacy",contact:"Contact"} as Record<string,string>)[slug]}</Link>)}</nav></div><PageCommissionDisclosure>{site.disclosure}</PageCommissionDisclosure><p className="network-footer-network"><a href="https://madabase.com">Madabase research</a><a href="https://homeoffice.madabase.com">Homeoffice equipment and compatibility</a><a href="https://smarthome.madabase.com">Smart-home control and compatibility</a></p></div></footer>
  </body>;
}
