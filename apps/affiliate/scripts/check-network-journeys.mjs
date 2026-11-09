import assert from "node:assert/strict";
import fs from "node:fs";
import {createHash} from "node:crypto";
import {loadAffiliateTypescript} from "./lib/load-affiliate-typescript.mjs";
const content=loadAffiliateTypescript("../../lib/content.ts");
const {networkPagePlans,networkPagePlan,networkTopics}=loadAffiliateTypescript("../../lib/network-journeys.ts");
const {networkCatalog}=loadAffiliateTypescript("../../lib/network-catalog.ts");
const {validateNetworkDraft}=loadAffiliateTypescript("../../lib/network-plan-state.ts");
const {localizedMarketPages,isIndexableLocalizedMarketPage}=loadAffiliateTypescript("../../lib/market-content.ts");
const {buyerFacingBody}=loadAffiliateTypescript("../../lib/conversion-copy.ts");
const out=new URL("../reports/network-redesign-2026-11-06/",import.meta.url);fs.mkdirSync(out,{recursive:true});
const before=JSON.parse(fs.readFileSync(new URL("fixtures/network-redesign-baseline.json",import.meta.url),"utf8"));
const digest=value=>createHash("sha256").update(JSON.stringify(value)??"undefined").digest("hex");
let checks=0;function check(condition,message){assert.ok(condition,message);checks++;}
const inventory=Object.fromEntries(Object.entries({product:"siteProducts",comparison:"siteRoundups",guide:"siteGuides",tool:"siteTools"}).map(([kind,fn])=>[kind,content[fn]("network")]));
const catalog=networkCatalog();
check(catalog.length===167,"166 content records plus one Ethernet checker");
check(new Set(catalog.map(item=>item.path)).size===catalog.length,"unique destinations");
check(networkPagePlans.length===catalog.length,"exact page-plan coverage");
const audit=[];
for(const entry of catalog){
  const plan=networkPagePlan(entry.path);check(Boolean(plan),entry.path+" requires an explicit plan");
  check(plan.next.length===2,entry.path+" has bounded conditional steps");
  for(const next of plan.next){check(next.href!==entry.path,entry.path+" is not its own next step");check(next.when.length>25,entry.path+" names the branch condition");check(Boolean(catalog.find(item=>item.path===next.href))||["https://homeoffice.madabase.com/compatibility/docks","https://homeoffice.madabase.com/compatibility/mini-pcs"].includes(next.href),entry.path+" has a valid destination");}
  audit.push({...entry,next:plan.next,decision:plan.answer??entry.description,review:{scope:"Individual task, first decision, content evidence, exact buying identity and next-step conditions",sourceReverification:"Existing dated official/listing observations retained; no new stock, physical-test or warranty claim",checks:"pending-rendered-acceptance"}});
}
for(const topic of networkTopics)check(catalog.some(item=>item.topic===topic.id),topic.id+" is not an empty topic");
for(const [kind,items] of Object.entries(inventory))for(const item of items){
  const prior=before[kind].find(value=>value.slug===item.slug);check(Boolean(prior),"no undeclared content expansion "+item.slug);
  if(kind==="product"){
    assert.equal(digest(item.offers),prior.offers,"retailer state preserved "+item.slug);checks++;
    assert.equal(digest(item.asin),prior.asin,"original ASIN preserved "+item.slug);checks++;
    assert.equal(digest(item.specs),prior.specs,"model facts preserved "+item.slug);checks++;
    check(Boolean(item.sources?.length),"source evidence "+item.slug);
    check(digest(item.discoveryExcluded)===prior.discoveryExcluded,"hidden cohort is not promoted "+item.slug);
  }
  if(kind==="guide"){
    check(Boolean(item.quickAnswer),"specific first answer "+item.slug);
    assert.equal(digest(item.sections),prior.sections,"authored technical sections preserved "+item.slug);checks++;
    assert.equal(digest(item.comparisonTable),prior.comparisonTable,"existing guide table preserved "+item.slug);checks++;
    assert.equal(digest(item.decisionPurchase),prior.decisionPurchase,"qualification and stop conditions preserved "+item.slug);checks++;
    check(Boolean(item.sources?.length),"guide sources "+item.slug);
  }
  if(kind==="comparison"){
    check(Boolean(item.quickAnswer)&&item.decisionFirst,"decision before retailer "+item.slug);
    check(Boolean(item.comparisonTable?.rows.length),"meaningful comparison table "+item.slug);
    for(const row of item.comparisonTable.rows)check(row.values.length===item.comparisonTable.columns.length,"complete table row "+item.slug+":"+row.label);
    check(item.productSlugs.every(slug=>content.findProduct("network",slug)),"registered model choices "+item.slug);
  }
}
const now=Date.now();const valid={version:1,kind:"mesh",at:now,values:{primary:"1800",secondary:"1",keyboard:""}};
check(Boolean(validateNetworkDraft(valid,"mesh",now)),"user draft accepted");
for(const bad of [null,[],{...valid,version:2},{...valid,kind:"ethernet"},{...valid,at:now-86400001},{...valid,at:now+60001},{...valid,values:{primary:"<script>"}},{...valid,values:{primary:"-1"}},{...valid,values:{address:"private address"}},{...valid,values:[]},{...valid,at:Infinity}])check(validateNetworkDraft(bad,"mesh",now)===null,"invalid, expired or unrelated data rejected");
check(validateNetworkDraft({version:1,kind:"ethernet",at:now,values:{path:"internet",cable:"unknown",internet:"0.5"}},"ethernet",now)?.values.internet==="0.5","fractional plan rate preserved");
check(validateNetworkDraft({version:1,kind:"ethernet",at:now,values:{path:"made-up"}},"ethernet",now)===null,"unknown traffic path rejected");
check(Boolean(validateNetworkDraft({version:1,kind:"ethernet",at:now,values:{path:"direct",target:"2.5",cable:""}},"ethernet",now)),"partial answers remain restorable before cable confirmation");
check(validateNetworkDraft({version:1,kind:"ethernet",at:now,values:{path:"direct",cable:"probably"}},"ethernet",now)===null,"unsupported cable answers rejected");
const markets=localizedMarketPages.filter(page=>page.site==="network");
check(markets.filter(isIndexableLocalizedMarketPage).length===1,"qualified regional cohort is not expanded");
const targets=[];
for(const [kind,items] of Object.entries(inventory))for(const item of items){
 const prefix={product:"reviews",comparison:"best",guide:"guides",tool:"tools"}[kind];
 const paragraphs=kind==="guide"?item.sections.map(section=>buyerFacingBody(section.body)):kind==="product"?[...(item.editorialSections??[]).map(section=>buyerFacingBody(section.body)),...item.cons,...item.evidence]:[];
 targets.push({path:`/${prefix}/${item.slug}`,kind,slug:item.slug,paragraphs,table:kind==="comparison"?item.comparisonTable:undefined,sourceUrls:(item.sources??[]).map(source=>source.url),requiresContinuation:true});
}
for(const path of ["/","/categories/wifi","/categories/wired","/categories/backup","/compatibility","/compatibility/ethernet","/about","/methodology","/editorial-policy","/affiliate-disclosure","/privacy","/contact","/search","/search?topic=mesh","/search?q=BE63","/search?journey=fiber"])
 targets.push({path,kind:"navigation",requiresContinuation:path==="/compatibility/ethernet"});
for(const market of ["en-gb","en-ca","de-de","nl-nl"]){
 targets.push({path:`/${market}`,kind:"regional-home"});
 for(const page of markets)targets.push({path:`/${market}/${page.route}/${page.slug}`,kind:"regional-"+page.route,basePath:`/${page.route}/${page.slug}`,indexable:isIndexableLocalizedMarketPage(page),requiresContinuation:page.route!=="categories"});
}
fs.writeFileSync(new URL("inventory-after.json",out),JSON.stringify(inventory,null,2)+"\n");
fs.writeFileSync(new URL("page-review.json",out),JSON.stringify({status:"source-reviewed-rendering-pending",contentRecords:166,checkers:1,topics:networkTopics.length,pages:audit},null,2)+"\n");
fs.writeFileSync(new URL("http-targets.json",out),JSON.stringify(targets,null,2)+"\n");
fs.writeFileSync(new URL("unit-checks.json",out),JSON.stringify({passed:true,checks,pages:catalog.length,topics:networkTopics.length,httpTargets:targets.length,qualifiedRegionalPages:1,merchantReverification:false},null,2)+"\n");
console.log(JSON.stringify({passed:true,checks,pages:catalog.length,topics:networkTopics.length,httpTargets:targets.length},null,2));
