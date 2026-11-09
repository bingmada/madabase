import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { SearchForm } from "../../shared/SearchControls";
import { NetworkRegionalScope, networkEditionPath } from "./NetworkJourney";
import { networkCatalog, networkEntry, networkTopicEntries } from "@/lib/network-catalog";
import { networkTopics, networkTopicPath } from "@/lib/network-journeys";
import { itemListSchema } from "@/lib/seo";
import type { SiteConfig } from "@/lib/sites";
import type { MarketProfile } from "@/lib/markets";
import { marketHomeCopy } from "@/lib/market-content";

const starts=[
  {number:"01",title:"Wi-Fi does not reach the room",body:"Test placement, then decide whether another radio or a cable is useful.",path:"/guides/router-placement-guide",tag:"Coverage"},
  {number:"02",title:"A connection is slow or keeps dropping",body:"Separate the client, cable, mesh and internet service before replacing a box.",path:"/guides/deco-mesh-connection-drops-troubleshooting",tag:"Troubleshoot"},
  {number:"03",title:"The NAS or wired desk needs more speed",body:"Map the actual traffic path and count ports, including the uplink.",path:"/compatibility/ethernet",tag:"Ethernet"},
  {number:"04",title:"The network stops during an outage",body:"Identify what failed, the complete powered chain and a workable fallback.",path:"/guides/home-network-smart-home-outage-plan",tag:"Recovery"},
];

export function NetworkHome({site,market}:{site:SiteConfig;market?:MarketProfile}) {
  const copy=market?marketHomeCopy[market.key].network:undefined;
  return <main className="network-home" lang="en">
    <JsonLd data={itemListSchema(site,"Home network decision paths",starts.map(item=>({name:item.title,path:item.path})))} />
    <section className="network-home-intro shell">
      <div><p className="eyebrow">Signalwise Picks · a Madabase publication</p><h1>Find the weak link in your home network.</h1><p className="network-dek">Find the failed room or connection. Check the equipment you own and choose the smallest useful change.</p></div>
    </section>
    {market?<div className="shell"><NetworkRegionalScope market={market}/>{copy?<section className="network-method" lang={market.languageTag}><div><h2>{copy.title}</h2><p>{copy.intro}</p><ul className="mt-4 list-disc space-y-2 pl-5 text-sm">{copy.focus.map(item=><li key={item}>{item}</li>)}</ul></div></section>:null}</div>:null}
    <section className="shell network-home-section" id="network-tasks" aria-labelledby="network-tasks-title"><div className="network-section-title"><p className="eyebrow">Start with what is happening</p><h2 id="network-tasks-title">What needs to work?</h2></div><div className="network-task-grid">{starts.map(item=><Link className="network-task-card" data-network-task={item.tag.toLowerCase()} href={networkEditionPath(item.path,market)} key={item.path}><span className="network-task-number">{item.number} / {item.tag}</span><h3>{item.title}</h3><p>{item.body}</p><span className="network-card-action">Start here →</span></Link>)}</div></section>
    <details className="shell network-home-diagram"><summary>How to read the complete network path</summary><div className="network-path-diagram" aria-label="Internet service connects to a router, then wired devices or Wi-Fi nodes"><p>Follow the actual connection</p><div className="network-diagram-line"><span>Internet<br/><small>provider / modem / ONT</small></span><i aria-hidden="true">→</i><span>Router<br/><small>routing + local network</small></span></div><div className="network-diagram-branches"><span>Wired path<br/><small>switch → client / NAS</small></span><span>Wi-Fi path<br/><small>node / AP → client</small></span></div><p className="network-diagram-note">The slower link depends on the task. A local NAS transfer need not cross the internet connection.</p></div></details>
    <section className="network-search-section"><div className="shell"><div><p className="eyebrow">Already know the model?</p><h2>Go straight to its evidence and limits.</h2><p>Search an exact model or a specific question. Unknown equipment stays unverified.</p></div><SearchForm/></div></section>
    <section className="shell network-home-section" id="guides"><div className="network-section-title"><p className="eyebrow">Choose the next part of the setup</p><h2>Keep the whole connection in view.</h2></div><div className="network-topic-grid">{networkTopics.filter(t=>["mesh","service","poe","travel-security"].includes(t.id)).map(topic=><article key={topic.id}><h3><Link href={networkTopicPath(topic.id)}>{topic.name} →</Link></h3><p>{topic.intro}</p><Link className="network-text-link" href={networkEditionPath(topic.start,market)}>{topic.question}</Link></article>)}</div></section>
    <section className="network-home-band" id="tools"><div className="shell network-home-section"><div><p className="eyebrow">Planning tools</p><h2>Use your measurements.</h2><p>Tools produce a layout or link-rate check to verify. They do not certify coverage, application speed or a retailer&apos;s offer.</p></div><div className="network-tool-list">{["/tools/mesh-node-and-backhaul-planner","/compatibility/ethernet"].map(path=>{const item=networkEntry(path)!;return <Link href={networkEditionPath(path,market)} key={path}><span>{item.title} →</span><p>{item.description}</p></Link>;})}</div></div></section>
    <section className="shell network-home-section"><div className="network-section-title"><p className="eyebrow">Installation and specialist references</p><h2>Find the matching component and procedure.</h2><p>For a defined installation task, check the exact equipment, supported tools and required evidence before ordering.</p></div><div className="network-reference-grid">{networkTopics.filter(t=>["cabling","fiber","racks","access-points","shared-devices"].includes(t.id)).map(topic=><Link key={topic.id} href={networkTopicPath(topic.id)}><h3>{topic.name} →</h3><p>{topic.intro}</p></Link>)}</div></section>
    <section className="shell network-home-section network-method"><div><p className="eyebrow">How these decisions are made</p><h2>Specifications, sources and unresolved checks stay together.</h2><p>Model notes use manufacturer documentation and attributed research. Listed speeds and coverage remain conditional claims. Keep equipment that meets the job; pause when the model, power or service requirements are unknown.</p></div><Link className="network-text-link" href="/methodology">Read the research method →</Link></section>
  </main>;
}

export function NetworkCategory({site,slug,market}:{site:SiteConfig;slug:string;market?:MarketProfile}) {
  const names:Record<string,string>={wifi:"Wi-Fi, mesh and access points",wired:"Wired networks and installation",backup:"Backup power and recovery"};
  const intros:Record<string,string>={wifi:"Start with coverage or a specific radio requirement. Keep node count, backhaul, clients and software support in the same decision.",wired:"Start with the traffic path or installation job. Speed, power, media, mounting and application support are separate checks.",backup:"Separate provider loss, failed routing and local power loss. Back up the required chain and keep an independent way to recover."};
  const topics=networkTopics.filter(topic=>topic.category===slug);
  const entries=networkCatalog().filter(item=>!item.hidden&&topics.some(topic=>topic.id===item.topic));
  return <main className="network-directory shell" lang="en"><JsonLd data={itemListSchema(site,names[slug],entries.map(item=>({name:item.title,path:item.path})))} /><nav className="network-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><span>Topic library</span></nav><p className="eyebrow">Browse by the job</p><h1>{names[slug]}</h1><p className="network-dek">{intros[slug]}</p>{market?<NetworkRegionalScope market={market}/>:null}<nav className="network-topic-jump" aria-label="Topics in this library">{topics.map(topic=><a key={topic.id} href={`#${topic.id}`}>{topic.name} ↓</a>)}</nav>
    {topics.map(topic=><section id={topic.id} className="network-directory-topic" key={topic.id}><div className="network-section-title"><p className="eyebrow">{topic.question}</p><h2>{topic.name}</h2><p>{topic.intro}</p><Link className="network-text-link" href={networkEditionPath(topic.start,market)}>Start with the decision →</Link></div><div className="network-directory-list">{networkTopicEntries(topic.id).map(item=><article key={item.path}><p className="eyebrow">{item.kind}</p><h3><Link href={networkEditionPath(item.path,market)}>{item.title} →</Link></h3><p>{item.description}</p></article>)}</div></section>)}
    <section className="network-method"><p>Find an exact model or another task in the <Link href="/search">complete searchable library</Link>. A model missing from this library remains unverified.</p></section>
  </main>;
}
