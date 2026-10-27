import assert from 'node:assert/strict';
import {loadAffiliateTypescript as load} from './lib/load-affiliate-typescript.mjs';
const {findProduct}=load('../../lib/content.ts');
const {applySiteAffiliateTracking}=load('../../lib/affiliate-tracking.ts');
const {findAmazonOfferBlock}=load('../../lib/amazon-offer-blocks.ts');
const {effectiveContentUpdatedAt}=load('../../lib/content-updated-at.ts');
const p=findProduct('baby','nanit-pro-smart-baby-monitor'),hold=structuredClone(findAmazonOfferBlock(p));
assert.equal(hold.checkedAt,'2026-09-25');
let cases=0;
for(const [input,expected] of [['October 26, 2026','October 26, 2026'],['June 21, 2026','September 25, 2026'],[undefined,'September 25, 2026'],['invalid','September 25, 2026']]){
 const result=applySiteAffiliateTracking({...p,updatedAt:input,amazonDetailUrl:'https://www.amazon.com/dp/'+p.asin,sources:[{name:'Historical Amazon',url:'https://www.amazon.com/dp/'+p.asin}],offers:[{merchant:'Amazon US',url:'https://www.amazon.com/dp/'+p.asin,label:'Check',priceNote:'Historical identity'}]});
 assert.equal(result.updatedAt,expected);assert.deepEqual(result.offers,[]);assert.equal(result.amazonDetailUrl,undefined);assert.deepEqual(result.sources,[]);assert.deepEqual(findAmazonOfferBlock(result),hold);cases++;
}
assert.equal(effectiveContentUpdatedAt('October 26, 2026',undefined),'October 26, 2026');
assert.equal(effectiveContentUpdatedAt(undefined,undefined),undefined);
assert.equal(effectiveContentUpdatedAt('invalid','also invalid'),undefined);
console.log(JSON.stringify({passed:true,blockedProductDateCases:cases,datedHoldUnchanged:true,blockedOffersRemainSuppressed:true}));
