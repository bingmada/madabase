import assert from 'node:assert/strict';
import { loadAffiliateTypescript } from './lib/load-affiliate-typescript.mjs';
const { searchContent } = loadAffiliateTypescript('../../../shared/content-search.ts');
const { siteSearchIndex, allSiteSearchIndex } = loadAffiliateTypescript('../../lib/site-search.ts');
const { planMiniPc, checkArm } = loadAffiliateTypescript('../../lib/compatibility-engine.ts');
const { miniPcParts, costSummary } = loadAffiliateTypescript('../../lib/upgrade-parts.ts');
const { matchingComponentOffers } = loadAffiliateTypescript('../../lib/upgrade-offers.ts');
const { networkDecision, compareDocks } = loadAffiliateTypescript('../../lib/setup-decisions.ts');
const rows = [];
function scenario(question, expected, verify) { verify(); rows.push({question,expected,passed:true}); }
for (const query of ['M720q RAM 32GB','Can I upgrade my M720q from 8 GB to 32 GB','M720q 1TB SSD','M720q 64GB memory','M720q second NVMe','M920x second SSD','B0B14FTVTV','M720q SATA cable FRU']) scenario(query,'Exact matching Tiny guide remains discoverable without claiming that capacity/route passes',()=>{
  const results = searchContent(siteSearchIndex('homeoffice'),query);
  const guide = query.includes('M920x') ? 'm920x' : 'm720q';
  assert.ok(results.slice(0,3).some((entry)=>entry.href===`/guides/thinkcentre-${guide}-upgrade-compatibility-guide`),JSON.stringify(results.slice(0,3)));
  if (/M(?:720q|920q|920x)/.test(query)) assert.ok(results.filter((entry)=>entry.kind==='guide' && entry.modelIds).every((entry)=>entry.modelIds.includes(guide)), 'Comparison mentions must not masquerade as the requested model guide');
});
scenario('MacBook M2 two4K60 monitors','Resolution describes the request without becoming a nonexistent device model',()=>assert.ok(searchContent(siteSearchIndex('homeoffice'),'MacBook M2 two 4K60 monitors').some((entry)=>entry.href==='/compatibility/docks')));
scenario('Unknown exact model with familiar capacity','No substitution of an unrelated Tiny model',()=>assert.equal(searchContent(allSiteSearchIndex(),'M9999q RAM 32GB').length,0));
scenario('Publication and content filters','No other publication leaks into a zero-result exact model request',()=>assert.equal(searchContent(allSiteSearchIndex(),'M720q RAM 32GB',{site:'network',kind:'product'}).length,0));
const p={model:'m720q',task:'ram',ramGb:32,pcie:'unknown',hasKit:'unknown'};
const now=Date.parse('2026-10-19T12:00:00Z');
scenario('8GB + 4GB to 16GB','Buy one8GB; retain slot1, replace slot2; show the8GB reference, never substitute a16GB offer',()=>{
 const parts=miniPcParts('m720q','ram',16,[8,4]);
 assert.equal(parts[0].purchaseCount,1);assert.equal(parts[0].capacityGb,8);assert.match(parts[0].reference,/KCP426SS8\/8/);
 assert.match(parts[0].check,/Slot 1: keep the existing 8GB/);assert.match(parts[0].check,/Slot 2: remove the 4GB module/);
 assert.equal(matchingComponentOffers(parts,[false,false,false],now).length,0);
});
scenario('16GB + empty to32GB','One single16GB module offer; no full kit or second module implied',()=>{
 const parts=miniPcParts('m720q','ram',32,[16,0]);assert.equal(parts[0].purchaseCount,1);assert.match(parts[0].check,/Slot 2: fit one 16GB/);assert.equal(matchingComponentOffers(parts,[false,false,false],now)[0].asin,'B07D2DZ42B');
});
scenario('8GB +8GB to32GB','Two single16GB modules; remove both old8GB modules',()=>{
 const parts=miniPcParts('m720q','ram',32,[8,8]);assert.equal(parts[0].purchaseCount,2);assert.match(parts[0].check,/Slot 1: remove the 8GB/);assert.match(parts[0].check,/Slot 2: remove the 8GB/);
});
scenario('16GB already available','No-buy; zero memory cost excluded and no component offer',()=>{
 const result=planMiniPc({...p,ramGb:16,modules:[8,8]});assert.ok(result.noBuy);assert.equal(result.parts[0].purchaseCount,0);assert.equal(matchingComponentOffers(result.parts,[false,false,false],now).length,0);assert.equal(costSummary(result.parts.map((part)=>({owned:part.purchaseCount===0||part.id!=='memory',cost:''}))).total,0);
});
scenario('Uninspected memory slots','Unknown; no resolved quantity, part number or purchase option',()=>{
 const r=planMiniPc({...p,modules:[-1,-1]});assert.equal(r.status,'unknown');assert.equal(r.parts[0].reference,undefined);assert.equal(matchingComponentOffers(r.parts,[false,false,false],now).length,0);
});
scenario('Need64GB rather than historical32GB validation','Unknown; never turns an existing32GB unit into a false64GB recommendation',()=>{
 const r=planMiniPc({...p,ramGb:64,modules:[16,16]});assert.equal(r.status,'unknown');assert.equal(r.noBuy,undefined);assert.equal(matchingComponentOffers(r.parts,[false,false,false],now).length,0);
});
scenario('Working storage already sufficient','No new drive, carrier, cable or computer purchase',()=>{
 const r=planMiniPc({...p,task:'sata',storageNeed:'no'});assert.equal(r.status,'supported');assert.match(r.noBuy,/No new SSD/);assert.equal(r.parts,undefined);
});
scenario('M920x second NVMe without inspected mount','Unknown until actual free socket, retainer and clearance verified',()=>{
 const r=planMiniPc({...p,model:'m920x',task:'second-nvme',storageNeed:'yes',storageReady:'unknown'});assert.equal(r.status,'unknown');
 assert.equal(planMiniPc({...p,model:'m920x',task:'second-nvme',storageNeed:'yes',storageReady:'yes'}).status,'conditional');
});
scenario('M720q second NVMe','Reject this position; propose replacing existing NVMe or checking SATA separately',()=>{
 const r=planMiniPc({...p,task:'second-nvme',storageNeed:'yes',storageReady:'yes'});assert.equal(r.status,'incompatible');assert.match(r.reasons.join(' '),/Replace the existing NVMe/);
});
scenario('Missing SATA kit despite a suitable drive listing','Hold the purchase; a bare drive is not a completed assembly',()=>assert.equal(planMiniPc({...p,task:'sata',storageNeed:'yes',pcie:'no',hasKit:'unknown'}).status,'unknown'));
scenario('Copied or reused part already owned / offer expired','No unwanted or expired component button',()=>{
 const parts=miniPcParts('m720q','ram',32,[16,0]);assert.equal(matchingComponentOffers(parts,[true,false,false],now).length,0);assert.equal(matchingComponentOffers(parts,[false,false,false],Date.parse('2026-10-26T09:20:00Z')).length,0);
});
scenario('Existing arm meets the confirmed fit','Keep the matching arm; no replacement needed',()=>{
 const r=checkArm({arm:'lx',kg:4.48,mm:25,vesa:'100x100',construction:'approved',curved:'flat',clearance:'yes',ports:'yes',travel:'yes',alreadyOwned:'yes'});assert.ok(r.noBuy);
});
const n={pc:2.5,adapter:2.5,nas:2.5,switchRate:2.5,devices:5,ports:5,uplinks:1,path:'same-switch',routerLan:1,routerWan:1,internet:1,target:2.5,cable:'yes'};
scenario('One switch port short','At least6 usable ports; link to switch choices rather than an unrelated Tiny page',()=>{
 const r=networkDecision(n);assert.equal(r.status,'incompatible');assert.match(r.parts.find((part)=>part.id==='switch').quantity,/At least 6/);assert.match(r.href,/best-fanless/);
});
scenario('Dedicated direct NAS flow','Irrelevant switch and router inputs do not block or cause a switch purchase',()=>{
 const r=networkDecision({...n,path:'direct',switchRate:NaN,devices:0,ports:0,uplinks:0});assert.equal(r.status,'supported');assert.equal(r.parts.find((part)=>part.id==='switch').purchaseCount,0);
});
scenario('Internet flow','An unused NAS field does not block the actual WAN/plan diagnosis',()=>{
 const r=networkDecision({...n,path:'internet',nas:NaN});assert.equal(r.status,'incompatible');assert.match(r.reasons.join(' '),/Router WAN/);
});
scenario('A500Mbps internet plan','Use the actual0.5Gbps plan rather than a fabricated physical-port rate',()=>assert.match(networkDecision({...n,path:'internet',internet:0.5}).title,/^0.5Gbps/));
scenario('Dock comparison without owning a selected dock','All three exact routes have identities; only a confirmed existing route produces a no-buy result',()=>{
 const d={mac:'m4-air',dock:'compare',screens:2,lid:'open',mode:'4k60',input:'hdmi',software:'no',workload:'office',powerWatts:67,clamshellReady:'unknown'};
 assert.equal(compareDocks(d,'no').candidates.length,3);assert.equal(compareDocks(d,'no').noBuy,undefined);assert.ok(compareDocks(d,'yes').noBuy);
});
console.log(JSON.stringify({passed:true,independentJourneyCases:rows.length,rows},null,2));
