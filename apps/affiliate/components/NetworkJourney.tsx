import Link from "next/link";
import { networkPagePlan, networkTopic, networkTopicPath } from "@/lib/network-journeys";
import { networkLinkTitle } from "@/lib/network-catalog";
import { localizedMarketPathForBasePath, localizedMarketPages, isIndexableLocalizedMarketPage, basePathForMarketPage } from "@/lib/market-content";
import type { MarketProfile } from "@/lib/markets";
import { NetworkPlanSummary } from "./NetworkPlanState";

export function networkEditionPath(path:string, market?:MarketProfile) {
  if(!market || !path.startsWith("/") || path.startsWith("/compatibility") || path.includes("#"))return path;
  const page=localizedMarketPages.find(item=>item.site==="network"&&basePathForMarketPage(item)===path);
  if(!page||!isIndexableLocalizedMarketPage(page))return path;
  return localizedMarketPathForBasePath(market,"network",path)??path;
}

export function NetworkPageLead({path,market}:{path:string;market?:MarketProfile}) {
  const plan=networkPagePlan(path);if(!plan)return null;
  const topic=networkTopic(plan.topic);
  return <div className="network-page-lead" data-network-page={path} data-network-topic={topic.id}>
    <nav aria-label="Breadcrumb" className="network-breadcrumb"><Link href={market?`/${market.routeSlug}`:"/"}>Home</Link><span aria-hidden="true">/</span><Link href={networkTopicPath(topic.id)}>{topic.name}</Link></nav>
    <NetworkPlanSummary topic={topic.id} currentPath={path} />
  </div>;
}

export function NetworkContinuation({path,market}:{path:string;market?:MarketProfile}) {
  const plan=networkPagePlan(path);if(!plan)return null;
  const topic=networkTopic(plan.topic);
  return <section className="network-next" id="network-next-step" aria-labelledby="network-next-title" data-network-continuation={path} lang="en">
    <p className="eyebrow">Continue when you need another check</p><h2 id="network-next-title">Choose the step that matches what you found.</h2>
    <div className="network-next-grid">{plan.next.map(next=><article key={next.href}><p>{next.when}</p><Link href={networkEditionPath(next.href,market)} data-network-next={plan.topic}>{networkLinkTitle(next.href)} <span aria-hidden="true">→</span></Link>{next.href.startsWith("https://homeoffice.")?<small>Homeoffice model reference · Madabase</small>:null}</article>)}</div>
    <p className="network-keep">{topic.keep}</p>
    <Link className="network-topic-return" href={networkTopicPath(topic.id)}>Browse the complete {topic.name.toLowerCase()} topic →</Link>
  </section>;
}

export function NetworkRegionalScope({market}:{market:MarketProfile}) {
  return <aside className="network-scope" lang="en" data-network-regional-scope="true"><strong>{market.countryName} edition · check the actual regional equipment.</strong><p>The shared technical research uses the named source models and packages. Confirm the local provider, permitted wireless bands, hardware revision, supplied power, node count and warranty. A US retailer link or automatic redirect does not verify an equivalent local offer.</p></aside>;
}
