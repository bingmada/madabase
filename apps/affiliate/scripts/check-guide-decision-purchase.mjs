import assert from 'node:assert/strict';
import {loadAffiliateTypescript as load} from './lib/load-affiliate-typescript.mjs';
const {findGuide,findProduct}=load('../../lib/content.ts');
const {guideDecisionPurchaseOption:option}=load('../../lib/guide-decision-purchase.ts');
const {guideCommerceProduct}=load('../../lib/commerce-paths.ts');
const {isPublishedCommerceClick}=load('../../lib/commerce-inventory.ts');
const keys=[
 ['network','poe-vs-poe-plus-for-cameras-access-points','B076HZFY3F'],
 ['network','managed-vs-unmanaged-poe-switch-home-guide','B01BW0AD1W'],
 ['smarthome','smart-garage-door-controller-compatibility-hub-offline-guide','B084Z5QZR2'],
 ['smarthome','smart-blind-motor-hub-local-control-guide','B0BMLFZ4CP'],
 ['smarthome','whole-home-energy-monitor-cloud-local-installation-guide','B0C79PNK84'],
 ['baby','travel-stroller-for-small-car-guide','B0CN79NZ8J'],
 ['pet','automatic-feeder-buying-guide','B0BYD73PHN'],
];
let guards=0;
for(const [site,slug,asin]of keys){
 const guide=findGuide(site,slug),products=guide.relatedProducts.map(s=>findProduct(site,s));
 const found=option(guide,products);assert.equal(found?.product.asin??found?.product.specs.ASIN,asin);assert.ok(isPublishedCommerceClick(site,found.product.slug,found.offer.merchant));
 assert.ok(guide.decisionPurchase.qualifies&&guide.decisionPurchase.stop&&guide.decisionPurchase.keep);
 const product=found.product,base=structuredClone(product);
 const changed=p=>[p,...products.filter(p=>p.slug!==product.slug)];
 for(const delta of [{site:site==='baby'?'network':'baby'},{slug:'unrelated-product'},{publicationStatus:'draft'},{asin:'B000000000'},{offers:[]}]){
  assert.equal(option(guide,changed({...base,...delta})),undefined);guards++;
 }
 for(const url of ['https://www.amazon.com/dp/B000000000','http://www.amazon.com/dp/'+asin,'https://amazon.com.evil.invalid/dp/'+asin,'https://www.amazon.co.uk/dp/'+asin,'https://user:password@www.amazon.com/dp/'+asin,'https://www.amazon.com:8443/dp/'+asin,'https://www.amazon.com/']){
  assert.equal(option(guide,changed({...base,offers:[{...found.offer,url}]})),undefined);guards++;
 }
 assert.equal(option({...guide,purchaseFlow:'task-links'},products),undefined);guards++;
 assert.equal(option({...guide,decisionPurchase:undefined},products),undefined);guards++;
 assert.equal(option(guide,[...products,structuredClone(product)]),undefined);guards++;
}
const registry=findGuide('baby','baby-registry-essentials-guide');assert.equal(registry.purchaseFlow,'task-links');assert.equal(guideCommerceProduct('baby',registry),undefined);assert.equal(option(registry,[]),undefined);
for(const slug of ['travel-stroller-folded-size-checklist','baby-monitor-subscription-and-privacy-checklist','diaper-pail-replacement-bag-annual-cost-guide','travel-bottle-warmer-heating-cleaning-battery-guide']){
 const guide=findGuide('baby',slug);assert.equal(guide.purchaseFlow,'task-links');assert.equal(guideCommerceProduct('baby',guide),undefined);assert.equal(option(guide,guide.relatedProducts?.map(s=>findProduct('baby',s))??[]),undefined);
}
console.log(JSON.stringify({passed:true,exactModelGuides:keys.length,identityGuardCases:guards,registryDefaultPurchaseRemoved:true,unknownAndKeepExistingConditionsPresent:true}));
