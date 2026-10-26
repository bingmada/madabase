import fs from 'node:fs';
import https from 'node:https';
import assert from 'node:assert/strict';
import {loadAffiliateTypescript as load} from '../../scripts/lib/load-affiliate-typescript.mjs';
const D=new URL('./',import.meta.url);
const review=JSON.parse(fs.readFileSync(new URL('source03-editorial-review.json',D)));
const snippets=JSON.parse(fs.readFileSync(new URL('../../config/search-snippet-reviews.json',D)));
const buildId=fs.readFileSync(new URL('../../.next-release/BUILD_ID',D),'utf8').trim();
const {isPublishedCommerceClick}=load('../../lib/commerce-inventory.ts');
const decode=s=>s.replaceAll('&amp;','&').replace(/&#x27;|&#39;/g,"'").replaceAll('&quot;','"').replaceAll('&lt;','<').replaceAll('&gt;','>');
const text=s=>decode(s.replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();
const get=(host,path)=>new Promise((resolve,reject)=>{const q=https.get('https://'+host+path,{headers:{Accept:'text/html','User-Agent':'Mozilla/5.0 (compatible; MadabaseReleaseQA/1.0)'}},r=>{let body='';r.on('data',b=>body+=b);r.on('end',()=>resolve({status:r.statusCode,body,cache:r.headers['cf-cache-status'],age:r.headers.age}));});q.on('error',reject);q.setTimeout(25000,()=>q.destroy(new Error('timeout')));});
const rows=[];
for(const row of review.pages){
 const page=row.after,host=page.site+'.madabase.com',path=(row.kind==='guide'?'/guides/':'/reviews/')+page.slug;
 const r=await get(host,path),html=r.body.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,''),body=text(html),errors=[];
 const title=decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1]??'');
 const description=decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1]??'');
 if(r.status!==200)errors.push('HTTP '+r.status);
 if(!r.body.includes('data-commerce-release="'+buildId+'"'))errors.push('Build identity');
 if(!html.includes('rel="canonical" href="https://'+host+path+'"'))errors.push('Canonical');
 if((html.match(/<h1\b/g)??[]).length!==1)errors.push('H1 count');
 if(!title.includes(row.kind==='guide'?page.title:page.seoTitle))errors.push('Title');
 const expected=snippets[page.site+':'+row.kind+':'+page.slug]?.description;
 if(description!==expected)errors.push('Current description not rendered');
 const sections=row.kind==='guide'?page.sections:page.editorialSections;
 const h1=text(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1]??'');
 if(h1!==(row.kind==='guide'?page.title:page.seoTitle??page.name))errors.push('Exact displayed H1 identity');
 if(!body.includes('Updated October 25, 2026'))errors.push('Editorial date not rendered');
 const fields=row.kind==='guide'?[page.title,page.dek,page.quickAnswer,page.searchQuestion,...page.editorialMethod]:[page.amazonTitle??page.name,page.summary,page.verdict,page.researchNote,...page.pros,...page.cons,...Object.entries(page.specs).flat()];
 for(const s of sections)fields.push(s.heading,s.body);
 for(const field of fields.filter(Boolean))if(!body.includes(field.replace(/\s+/g,' ').trim()))errors.push('Missing current content: '+field.slice(0,65));
 for(const source of page.sources)if(!decode(html).includes('href="'+source.url+'"'))errors.push('Missing source '+source.name);
 if(row.kind==='guide'){
  const t=page.comparisonTable,region=html.match(/<section\b[^>]*id="guide-comparison"[\s\S]*?<\/section>/)?.[0]??'';
  for(const f of [t.title,...t.columns,...t.rows.flatMap(r=>[r.label,...r.values])])if(!text(region).includes(f))errors.push('Table content: '+f.slice(0,50));
  if(!/role="region"[^>]*tabindex="0"/i.test(region))errors.push('Keyboard table scroll');
  if((region.match(/scope="col"/g)??[]).length!==t.columns.length+1)errors.push('Column headers');
  if((region.match(/scope="row"/g)??[]).length!==t.rows.length)errors.push('Row headers');
  const card=html.match(/<aside\b[^>]*data-guide-decision-purchase="true"[\s\S]*?<\/aside>/)?.[0]??'';
  if(page.decisionPurchase){
   const d=page.decisionPurchase;
   if(!card)errors.push('Missing table-adjacent exact-model step');
   for(const f of [d.model,d.qualifies,d.stop,d.keep])if(!text(card).includes(f))errors.push('Missing qualification/stop/keep condition');
   if(!decode(card).includes('https://www.amazon.com/dp/'+d.asin+'?'))errors.push('Wrong decision ASIN');
   if(!text(card).includes('Check '+d.model+' on Amazon'))errors.push('Unnamed model button');
   if(!card.includes('data-commerce-position="guide-decision-exact-model"'))errors.push('Decision tracking position');
   if(html.indexOf('data-guide-decision-purchase')>html.indexOf('<article'))errors.push('Decision action below body');
  }else if(page.purchaseFlow==='task-links'){
   if(card||html.includes('data-guide-retailer-option="true"')||html.includes('data-commerce-product='))errors.push('Unqualified default purchase remains');
   for(const slug of page.relatedRoundups)if(!html.includes('href="/best/'+slug+'"'))errors.push('Missing optional task comparison '+slug);
  }
 }
 const offers=[];
 for(const m of html.matchAll(/<a\b([^>]*data-commerce-product[^>]*)>/g)){
  const attr=n=>decode(m[1].match(new RegExp(n+'="([^"]*)"'))?.[1]??'');
  const product=attr('data-commerce-product'),merchant=attr('data-commerce-merchant');
  if(!isPublishedCommerceClick(page.site,product,merchant))errors.push('Unregistered commerce identity '+product);
  offers.push({product,merchant,position:attr('data-commerce-position'),href:attr('href')});
 }
 if(/require the supported Hub 2 route|Matter and Apple Home require the correct Hub 2 path/.test(body))errors.push('Obsolete Hub2-only assertion');
 rows.push({key:row.key,kind:row.kind,host,path,status:r.status,cache:r.cache,age:r.age,title,description,sections:sections.length,offers,errors,passed:!errors.length});
}
const out={checkedAt:new Date().toISOString(),releaseId:buildId,total:rows.length,passed:rows.filter(r=>r.passed).length,rows};
fs.writeFileSync(new URL('source03-public-page-checks.json',D),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({total:out.total,passed:out.passed,failures:rows.filter(r=>!r.passed)}));assert.equal(out.passed,out.total);
