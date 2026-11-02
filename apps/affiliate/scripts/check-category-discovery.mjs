import fs from 'node:fs';
import {loadAffiliateTypescript as load} from './lib/load-affiliate-typescript.mjs';
const publicAudit=process.env.CATEGORY_DISCOVERY_PUBLIC_AUDIT==='1';
const origin=process.env.CATEGORY_DISCOVERY_ORIGIN;
if(!publicAudit&&!origin)throw new Error('Set CATEGORY_DISCOVERY_ORIGIN for a local runtime, or CATEGORY_DISCOVERY_PUBLIC_AUDIT=1 for production.');
const {sites}=load('../../lib/sites.ts');
const {siteGuides,siteProducts,siteRoundups,siteTools}=load('../../lib/content.ts');
const {isFamilyDiscoveryHub}=load('../../lib/search-recovery-consolidation.ts');
const {quadrupleExpansionFamilies:families,quadrupleExpansionGuides:generated}=load('../../lib/quadruple-expansion-content.ts');
const roles={network:['buying','comparison','fit','ownership'],smarthome:['buying','comparison','fit','ownership','workflow'],homeoffice:['buying','comparison','fit','ownership','workflow'],baby:['buying','comparison','fit','ownership','workflow','safety'],pet:['buying','comparison','fit','ownership','workflow']};
if(JSON.stringify(Object.keys(sites).sort())!==JSON.stringify(Object.keys(roles).sort()))throw new Error('Retained site inventory differs; explicitly review audit scope.');
const familyKeys=new Set();
for(const f of families){
 const key=`${f.site}:${f.slug}`;
 if(!roles[f.site]||familyKeys.has(key))throw new Error('Unexpected or duplicate family: '+key);
 familyKeys.add(key);
 const pages=generated.filter(g=>g.site===f.site&&g.familySlug===f.slug);
 if(JSON.stringify(pages.map(g=>g.familyRole).sort())!==JSON.stringify([...roles[f.site]].sort()))throw new Error('Incomplete family role set: '+key);
 if(pages.some(g=>g.category!==f.category))throw new Error('Family category mismatch: '+key);
}
const expectedGenerated=families.reduce((n,f)=>n+roles[f.site].length,0);
if(generated.length!==expectedGenerated||new Set(generated.map(g=>`${g.site}:${g.slug}`)).size!==generated.length)throw new Error('Missing or duplicate generated guide URL.');
const catalog=Object.fromEntries(Object.keys(sites).map(site=>[site,{guides:siteGuides(site).filter(g=>!g.sitemapExcluded),products:siteProducts(site).filter(p=>!p.sitemapExcluded),roundups:siteRoundups(site).filter(p=>!p.sitemapExcluded),tools:siteTools(site).filter(p=>!p.sitemapExcluded)}]));
const decode=s=>s.replaceAll('&amp;','&');
const hrefs=html=>new Set([...html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').matchAll(/href=["']([^"']+)["']/gi)].map(m=>decode(m[1])));
const get=async(url)=>{
 const u=new URL(url),target=publicAudit?url:origin+u.pathname;
 const response=await fetch(target,{headers:publicAudit?{'user-agent':'Madabase category discovery auditor/2.0'}:{host:u.host,'x-forwarded-host':u.host,'x-forwarded-proto':'https'},redirect:'manual',signal:AbortSignal.timeout(30000)});
 return {status:response.status,html:await response.text()};
};
const results=[];
for(const [site,config]of Object.entries(sites)){
 const c=catalog[site],guideKeys=new Set(c.guides.map(g=>g.slug));
 const sitemap=await get(config.domain+'/sitemap.xml');
 if(sitemap.status!==200)throw new Error(`${site} sitemap HTTP${sitemap.status}`);
 const map=new Map([...sitemap.html.matchAll(/<url>\s*<loc>([^<]+)<\/loc>([\s\S]*?)<\/url>/g)].map(m=>[decode(m[1]),m[2].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]]));
 for(const category of config.categories){
  const url=config.domain+'/categories/'+category.slug,errors=[];
  const categoryPage=await get(url),links=hrefs(categoryPage.html);
  if(categoryPage.status!==200)errors.push('HTTP'+categoryPage.status);
  if(!map.has(url))errors.push('Category missing from sitemap');
  const hubs=c.guides.filter(g=>g.category===category.slug&&isFamilyDiscoveryHub(g));
  if(hubs.length&&!categoryPage.html.includes('data-governed-discovery-links="family-hubs"'))errors.push('Family discovery section missing');
  const expectedHrefs=hubs.map(g=>'/guides/'+g.slug);
  for(const path of expectedHrefs)if(!links.has(path))errors.push('Missing current primary hub: '+path);
  // Independently calculate the actual newest dated content, not a historic
  // campaign date and never the audit execution date.
  const dates=Object.values(c).flat().filter(p=>p.category===category.slug&&p.updatedAt).map(p=>({item:p.slug,time:Date.parse(p.updatedAt+' 00:00:00 UTC')}));
  const invalid=dates.filter(d=>!Number.isFinite(d.time));
  if(invalid.length)errors.push('Invalid content dates: '+invalid.map(d=>d.item).join(','));
  const maxDate=dates.length&&!invalid.length?new Date(Math.max(...dates.map(d=>d.time))).toISOString():null;
  if(maxDate&&map.get(url)!==maxDate)errors.push(`lastmod ${map.get(url)??'missing'} differs from actual newest revision ${maxDate}`);
  if(maxDate&&Date.parse(maxDate)>Date.now())errors.push('Future category content revision');
  let intended=0,verified=0;
  for(const hub of hubs){
   const hubPage=await get(config.domain+'/guides/'+hub.slug),hubLinks=hrefs(hubPage.html);
   if(hubPage.status!==200){errors.push(`Hub ${hub.slug} HTTP${hubPage.status}`);continue;}
   const targets=[...new Set((hub.relatedGuides??[]).filter(slug=>slug!==hub.slug&&guideKeys.has(slug)))];
   // Authored guides can replace template siblings with a shorter explicit
   // decision path. Audit those declared canonical paths, not redirected pages.
   const expected=hub.relatedGuidePolicy==='explicit'?targets:targets.slice(0,8);
   for(const slug of expected){intended++;if(hubLinks.has('/guides/'+slug))verified++;else errors.push(`Hub ${hub.slug} missing declared canonical next step ${slug}`);}
  }
  results.push({site,category:category.slug,url,currentGuides:c.guides.filter(g=>g.category===category.slug).length,primaryHubs:hubs.length,primaryHubsVerified:expectedHrefs.filter(p=>links.has(p)).length,declaredNextSteps:intended,declaredNextStepsVerified:verified,expectedLastmod:maxDate,actualLastmod:map.get(url)??null,errors});
 }
}
const report={at:new Date().toISOString(),mode:publicAudit?'public':'local',scope:'Current retained-site published family hubs, declared canonical next steps, sitemap inclusion and actual revision dates. Not editorial, product or whole-site acceptance.',generatedFamilyUrls:generated.length,currentCanonicalGuides:Object.values(catalog).reduce((n,c)=>n+c.guides.length,0),categories:results.length,passedCategories:results.filter(r=>!r.errors.length).length,failedCategories:results.filter(r=>r.errors.length).length,primaryHubsVerified:results.reduce((n,r)=>n+r.primaryHubsVerified,0),declaredNextStepsVerified:results.reduce((n,r)=>n+r.declaredNextStepsVerified,0),results};
if(process.env.CATEGORY_DISCOVERY_REPORT)fs.writeFileSync(process.env.CATEGORY_DISCOVERY_REPORT,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
if(report.failedCategories)process.exitCode=1;
