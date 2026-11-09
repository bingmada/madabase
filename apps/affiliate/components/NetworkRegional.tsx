import Link from "next/link";
import type { SiteConfig } from "@/lib/sites";
import type { MarketProfile } from "@/lib/markets";
import type { LocalizedMarketPage,LocalizedMarketVariant } from "@/lib/market-content";
import { findGuide,findProduct,findRoundup,findTool } from "@/lib/content";
import { guideDecisionPurchaseOption } from "@/lib/guide-decision-purchase";
import { amazonFamilyProductIdentity,findAmazonFamilyProduct } from "@/lib/amazon-family-products";
import { amazonAsinAffiliateUrl } from "@/lib/affiliate-tracking";
import { compatibilityTopicForGuide } from "@/lib/compatibility-topics";
import { compatibilityPurchaseOptions } from "@/lib/compatibility-purchase-options";
import { absoluteUrl } from "@/lib/seo";
import { isBlockedAmazonSource } from "@/lib/amazon-offer-blocks";
import { NetworkComparison,NetworkDecisionTable,NetworkReview,NetworkSources } from "./NetworkContent";
import { NetworkCategory } from "./NetworkHome";
import { NetworkContinuation,NetworkPageLead,NetworkRegionalScope } from "./NetworkJourney";
import { CalculatorTool } from "./Calculator";
import { CompatibilityPlanner } from "./CompatibilityPlanner";
import { DecisionReference } from "./DecisionReference";
import { DecisionWorkedExamples } from "./DecisionWorkedExamples";
import { GuideTaskAlternative } from "./GuideTaskAlternative";
import { AffiliateButton } from "./AffiliateButton";
import { JsonLd } from "./JsonLd";

export function NetworkRegionalContent({site,market,page,variant}:{site:SiteConfig;market:MarketProfile;page:LocalizedMarketPage;variant:LocalizedMarketVariant}) {
  const path=`/${page.route}/${page.slug}`;
  const comparison=page.route==="best"?findRoundup("network",page.slug):undefined;
  const product=page.route==="reviews"?findProduct("network",page.slug):undefined;
  const guide=page.route==="guides"?findGuide("network",page.slug):undefined;
  const tool=page.route==="tools"?findTool("network",page.slug):undefined;
  const schema={"@context":"https://schema.org","@type":"Article",headline:variant.title,description:variant.dek,url:absoluteUrl(site,`/${market.routeSlug}${path}`),inLanguage:market.languageTag,author:{"@type":"Organization",name:`${site.name} editorial desk`},citation:(page.sourceLinks??[]).filter(source=>!isBlockedAmazonSource("network",source.url)).map(source=>source.url)};
  if(comparison)return <><JsonLd data={schema}/><NetworkComparison site={site} roundup={comparison} market={market}/></>;
  if(product)return <><JsonLd data={schema}/><NetworkReview site={site} product={product} market={market} variant={variant}/></>;
  if(page.route==="categories")return <NetworkCategory site={site} slug={page.slug} market={market}/>;
  const primary=guide??tool;
  if(!primary)return null;
  const family=guide?.familySlug?findAmazonFamilyProduct("network",guide.familySlug):undefined;
  const familyDecision=guide?.decisionPurchase&&family&&!family.offerBlock&&guide.decisionPurchase.asin===family.asin?guide.decisionPurchase:undefined;
  const direct=guide?guideDecisionPurchaseOption(guide,(guide.relatedProducts??[]).flatMap(slug=>{const item=findProduct("network",slug);return item?[item]:[];})):undefined;
  const identity=familyDecision&&family?amazonFamilyProductIdentity(family):direct?.product;
  const offer=familyDecision&&family?{merchant:"Amazon US",url:amazonAsinAffiliateUrl("network",family.asin),label:"Check this exact ASIN on Amazon US",priceNote:"Confirm the actual regional model and complete selected offer."}:direct?.offer;
  const decision=familyDecision??(direct?guide?.decisionPurchase:undefined);
  const checker=guide?compatibilityTopicForGuide("network",guide.slug):undefined;
  return <main className="shell network-article" lang="en" data-network-regional-content={page.route}><JsonLd data={schema}/><NetworkPageLead path={path} market={market}/><header lang={market.languageTag}><p className="eyebrow">{market.labels.edition}</p><h1>{variant.title}</h1><p className="network-dek">{variant.dek}</p></header><NetworkRegionalScope market={market}/>
    {guide?<section className="network-decision"><h2>Decision from the shared English research</h2><p>{guide.quickAnswer??guide.sections[0]?.body}</p></section>:null}
    <nav className="network-article-toc" aria-label="On this page"><a href="#network-regional-reference">Technical reference</a><a href="#network-next-step">Next step</a><a href="#network-regional-sources">Sources</a></nav>
    {tool?<><CalculatorTool tool={tool}/><section className="prose-lite mt-8">{tool.sections?.map(section=><section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}</section></>:null}
    {checker==="ethernet"?<CompatibilityPlanner topic="ethernet" purchaseOptions={compatibilityPurchaseOptions("network","ethernet")}/>:null}
    {guide?<><NetworkDecisionTable table={guide.comparisonTable}/><DecisionWorkedExamples site="network" slug={guide.slug}/><DecisionReference site="network" slug={guide.slug}/><article className="prose-lite mt-10" id="network-regional-reference">{guide.sections.map(section=><section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}</article><GuideTaskAlternative site="network" slug={guide.slug} market={market.key}/>{decision&&identity&&offer?<section className="network-article-section network-purchase" data-guide-decision-purchase="true"><h2>When {decision.model} fits</h2><p>{decision.qualifies}</p><p>{decision.stop}</p><AffiliateButton site="network" product={identity} offer={offer} market={market.key} position="network-regional-qualified-model" resolveCreatorsListing={false} modelLabel={decision.model} sticky={false}/><p>{decision.keep}</p></section>:null}</>:null}
    <NetworkContinuation path={path} market={market}/><section className="network-article-section" lang={market.languageTag}><h2>{market.labels.buyerChecks}</h2><ul className="list-disc space-y-3 pl-5 text-sm leading-7">{variant.checkoutChecks.map(check=><li key={check}>{check}</li>)}</ul></section><section className="network-article-section" id="network-regional-sources"><h2>Sources and full original reference</h2><NetworkSources sources={guide?.sources??page.sourceLinks??[]}/><Link className="network-text-link" href={path}>Read the original US research and all model-specific controls →</Link></section>
  </main>;
}
