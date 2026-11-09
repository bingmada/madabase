import Link from "next/link";
import Image from "next/image";
import type { CSSProperties } from "react";
import type { Product,Roundup } from "@/lib/types";
import type { SiteConfig } from "@/lib/sites";
import type { MarketProfile } from "@/lib/markets";
import type { LocalizedMarketVariant } from "@/lib/market-content";
import { findProduct } from "@/lib/content";
import { reviewCommerceProduct } from "@/lib/commerce-paths";
import { isBlockedAmazonSource,findAmazonOfferBlock } from "@/lib/amazon-offer-blocks";
import { productEvidencePresentation } from "@/lib/evidence";
import { networkEditorialNote } from "@/lib/network-journeys";
import { buyerFacingBody,buyerFacingHeading } from "@/lib/conversion-copy";
import { productPageTitle,breadcrumbSchema,roundupArticleSchema,roundupProductListSchema,productNotesSchema,faqPageSchema } from "@/lib/seo";
import { editorialImageForDisplay,isEditorialCategoryImage,editorialImageAlt } from "@/lib/editorial-image";
import { AffiliateButton,AffiliateButtonGroup } from "./AffiliateButton";
import { JsonLd } from "./JsonLd";
import { AmazonListingFreshness } from "./AmazonCreatorsListing";
import { BaseMarketEditionLinks } from "./MarketExperience";
import { NetworkContinuation,NetworkPageLead,networkEditionPath,NetworkRegionalScope } from "./NetworkJourney";

export function NetworkDecisionTable({table}:{table:Roundup["comparisonTable"]}){
  if(!table)return null;
  return <div className="network-table-wrap" role="region" aria-label={table.title} tabIndex={0}><table className="network-table" style={{"--guide-value-columns":table.columns.length} as CSSProperties}><caption>{table.title}</caption><thead><tr><th scope="col">Check</th>{table.columns.map(column=><th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{table.rows.map(row=><tr key={row.label}><th scope="row">{row.label}</th>{row.values.map((value,index)=><td key={index}>{value}</td>)}</tr>)}</tbody></table></div>;
}

export function NetworkSources({sources}:{sources:{name:string;url:string;note?:string}[]}) {
  const unique=[...new Map(sources.map(source=>[source.url,source])).values()];
  return <ul className="network-source-list">{unique.map(source=><li key={source.url}>{isBlockedAmazonSource("network",source.url)?<strong data-source-link-paused="true">{source.name} · retailer link paused</strong>:<a href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a>}{source.note?<p>{source.note}</p>:null}</li>)}</ul>;
}

export function NetworkComparison({site,roundup,market}:{site:SiteConfig;roundup:Roundup;market?:MarketProfile}) {
  const path=`/best/${roundup.slug}`;
  const picks=roundup.productSlugs.flatMap(slug=>{const product=findProduct("network",slug);return product?[product]:[];});
  const sources=[...(roundup.sources??[]),...picks.flatMap(product=>product.sources??[])];
  return <main className="shell network-article" lang="en" data-network-comparison="true">
    {!market?<><JsonLd data={breadcrumbSchema(site,[{name:"Home",path:"/"},{name:roundup.title,path}])}/><JsonLd data={roundupArticleSchema(site,roundup,picks)}/><JsonLd data={roundupProductListSchema(site,roundup.title,picks)}/><JsonLd data={faqPageSchema(roundup.faqs)}/></>:null}
    <NetworkPageLead path={path} market={market}/><header><p className="eyebrow">Comparison · exact models and packages</p><h1>{roundup.title}</h1><p className="network-dek">{roundup.dek}</p><p className="network-article-meta">{site.name} editorial desk · Updated {roundup.updatedAt} · Source research and documented specifications</p></header>
    {market?<NetworkRegionalScope market={market}/>:null}
    <section className="network-decision" aria-labelledby="comparison-verdict" data-decision-first-comparison="true"><h2 id="comparison-verdict">The decision</h2><p>{roundup.quickAnswer??roundup.intro}</p></section>
    <nav className="network-article-toc" aria-label="On this page"><a href="#roundup-comparison">Compare the differences</a><a href="#comparison-models">Check each model</a><a href="#comparison-sources">Sources</a><a href="#network-next-step">Next step</a></nav>
    <section className="network-article-section" id="roundup-comparison"><h2>What changes the choice?</h2><p className="evidence-note">Read the exact pack and revision beside each option. Scroll across the table when needed.</p><NetworkDecisionTable table={roundup.comparisonTable}/></section>
    {roundup.decisionGuide?.length?<section className="network-article-section network-check-grid">{roundup.decisionGuide.map(item=><div key={item.label}><h3>{item.label}</h3><p>{item.detail}</p></div>)}</section>:null}
    {roundup.sections?.length?<article className="network-article-section prose-lite">{roundup.sections.map(section=><section key={section.heading}><h2>{buyerFacingHeading(section.heading)}</h2><p>{buyerFacingBody(section.body)}</p></section>)}</article>:null}
    <section className="network-article-section" id="comparison-models"><h2>Continue with the model that fits.</h2><div className="network-model-grid" data-sticky-commerce-suppress>{picks.map(product=><article className="network-model-card" key={product.slug}><h3>{product.amazonTitle??product.name}</h3><p>{product.purchaseCheck??product.verdict??product.cons[0]}</p>{product.offers.length?<AffiliateButtonGroup site="network" product={product} market={market?.key} position="network-comparison-model" limit={1} sticky={false}/>:<p className="font-semibold" data-commerce-paused="true">The original retailer link remains paused. Read the model reference for the original identity and any separately named alternative.</p>}<Link className="network-model-reference" href={networkEditionPath(`/reviews/${product.slug}`,market)}>Read this model&apos;s evidence and limits →</Link></article>)}</div></section>
    <NetworkContinuation path={path} market={market}/>
    {roundup.faqs.length?<section className="network-article-section"><h2>Questions that affect the purchase</h2>{roundup.faqs.map(faq=><details className="guide-toc" key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</section>:null}
    <section className="network-article-section" id="comparison-sources"><h2>Sources and research method</h2><ul className="evidence-note mb-6">{roundup.methodology.map(item=><li key={item}>{item}</li>)}</ul><NetworkSources sources={sources}/></section>
    {!market?<BaseMarketEditionLinks site={site} basePath={path}/>:<p className="mt-8"><Link className="network-text-link" href={path}>Read the original US comparison →</Link></p>}
  </main>;
}

export function NetworkReview({site,product,market,variant}:{site:SiteConfig;product:Product;market?:MarketProfile;variant?:LocalizedMarketVariant}) {
  const path=`/reviews/${product.slug}`;const commerce=reviewCommerceProduct("network",product);const alternative=commerce&&commerce.slug!==product.slug;
  const block=findAmazonOfferBlock(product);const presentation=productEvidencePresentation(product);
  const image=editorialImageForDisplay(product.amazonImage??product.image);
  const actualImage=!isEditorialCategoryImage(image)&&!product.imageAlt?.startsWith("Editorial ");
  return <main className="shell network-article" lang="en" data-network-model="true">
    {!market?<><JsonLd data={breadcrumbSchema(site,[{name:"Home",path:"/"},{name:product.name,path}])}/><JsonLd data={productNotesSchema(site,product)}/></>:null}
    <NetworkPageLead path={path} market={market}/><header lang={variant?market?.languageTag:"en"}><p className="eyebrow">{product.brand} · model reference</p><h1>{variant?.title??productPageTitle(product)}</h1><p className="network-dek">{variant?.dek??product.summary}</p><p className="network-article-meta">{site.name} editorial desk{product.updatedAt?` · Updated ${product.updatedAt}`:""}</p></header>
    {market?<NetworkRegionalScope market={market}/>:null}
    <section className="network-decision" aria-labelledby="model-decision"><h2 id="model-decision">The decision</h2><p>{product.verdict??product.purchaseCheck}</p></section>
    {variant?<section className="network-article-section prose-lite" lang={market?.languageTag}><h2>{market?.labels.quickAnswer}</h2><p>{variant.quickAnswer}</p>{variant.sections.map(section=><section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}</section>:null}
    <nav className="network-article-toc" aria-label="On this page"><a href="#model-fit">Fit and limits</a><a href="#model-specifications">Specifications</a><a href="#model-buying-option">Buying option</a><a href="#model-sources">Sources</a><a href="#network-next-step">Next step</a></nav>
    <section className="network-article-section" id="model-fit"><h2>Check the whole setup.</h2><div className="network-check-grid"><div><h3>Useful fit</h3><p>{product.bestFor}</p><ul>{product.pros.map(item=><li key={item}>{item}</li>)}</ul></div><div><h3>Limits to keep visible</h3><ul>{product.cons.map(item=><li key={item}>{item}</li>)}</ul></div></div></section>
    {product.whyItMatters&&product.whyItMatters!==product.verdict?<p className="mt-6 leading-8">{product.whyItMatters}</p>:null}
    {product.editorialSections?.length?<article className="network-article-section prose-lite">{product.editorialSections.map(section=><section key={section.heading}><h2>{buyerFacingHeading(section.heading)}</h2><p>{buyerFacingBody(section.body)}</p></section>)}</article>:null}
    {product.externalTests?.length?<section className="network-article-section" id="independent-test-evidence"><h2>Attributed findings and their limits</h2><p>These are the named sources&apos; results. Their different test environments are kept separate.</p>{product.externalTests.map(test=><article className="network-model-card mt-5" key={test.url}><h3><a href={test.url} target="_blank" rel="noopener noreferrer">{test.source}</a></h3>{test.date?<p>{test.date}</p>:null}<dl>{[["Test conditions",test.testSetup],["Published result",test.result],["What it means",test.interpretation],["Limits",test.limitation]].map(([label,value])=><div className="mt-4" key={label}><dt className="font-bold">{label}</dt><dd className="text-sm leading-7">{value}</dd></div>)}</dl></article>)}</section>:null}
    <section className="network-article-section" id="model-specifications"><h2>Exact model and specification checks</h2><dl>{Object.entries(product.specs).filter(([key,value])=>key!=="Link status"&&value).map(([key,value])=><div className="grid gap-2 border-t border-[var(--network-line)] py-4 text-sm sm:grid-cols-[190px_minmax(0,1fr)]" key={key}><dt className="font-bold">{key}</dt><dd className="break-words leading-7">{value}</dd></div>)}</dl><ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-7">{product.evidence.map(item=><li key={item}>{item}</li>)}</ul></section>
    <section className="network-article-section network-purchase" id="model-buying-option"><p className="eyebrow">Exact product and purchase conditions</p><h2>{alternative?"Original identity and a separate option":"Buying option after the fit checks"}</h2><p>{product.purchaseCheck}</p>{!product.offers.length?<div data-commerce-paused="true"><strong>Original retailer link paused</strong><p className="mt-2 text-sm leading-7">{block?.reason??"The exact original listing remains unavailable or unresolved."}</p></div>:null}{commerce?.offers[0]?<><h3 className="mt-5 text-xl font-bold">{commerce.amazonTitle??commerce.name}</h3>{alternative?<p>This is a different product and package from {product.amazonTitle??product.name}. {commerce.purchaseCheck}</p>:null}<AffiliateButton site="network" product={commerce} offer={commerce.offers[0]} market={market?.key} position={alternative?"network-model-separate-alternative":"network-model-qualified-option"} sticky={false}/><AmazonListingFreshness site="network" productSlug={commerce.slug} market={market?.key}/></>:null}</section>
    <NetworkContinuation path={path} market={market}/>
    {actualImage?<figure className="network-article-section"><div className="relative aspect-[16/9] max-w-2xl overflow-hidden rounded-md bg-white"><Image src={image} alt={editorialImageAlt(image,product.imageAlt??product.name)} fill sizes="(min-width:900px) 672px,100vw" className="object-contain"/></div></figure>:null}
    <section className="network-article-section" id="model-sources"><h2>Evidence and sources</h2><p className="mb-6">{networkEditorialNote(presentation.note)}</p><NetworkSources sources={product.sources??[]}/></section>
    {!market?<BaseMarketEditionLinks site={site} basePath={path}/>:<p className="mt-8"><Link className="network-text-link" href={path}>Read the original US model reference →</Link></p>}
  </main>;
}
