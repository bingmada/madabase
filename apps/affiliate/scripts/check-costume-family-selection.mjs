import assert from 'node:assert/strict';
import {loadAffiliateTypescript as load}from './lib/load-affiliate-typescript.mjs';
const{costumeAudienceDecision:age,costumeFamilyProductMatches:matches,costumeGuideProductWhere:where,collectCostumeFamilyProducts:collect}=load('../../lib/costume-family-selection.ts');
const base={title:'Polar Bear Mascot',productType:'Clearance',tags:['Adults','Mascots'],audience:[],categorySlug:'costumes',premium:true,professional:true};
let cases=0;const check=(actual,expected,label)=>{assert.equal(actual,expected,label);cases++};
for(const[change,expected]of[[{},'adult'],[{title:'Fox Costume',tags:[],audience:['KIDS']},'kids'],[{title:'Adult and Child Family Costume Set',tags:[],audience:[]},'conflict'],[{title:'Fox Costume',tags:[],audience:['male']},'unknown'],[{title:'Fox Costume',tags:[],audience:['unisex']},'unknown'],[{title:'Kids Fox Costume',tags:['Adults'],audience:[]},'conflict'],[{title:'Adult Fox Costume',tags:[],audience:[]},'adult'],[{title:'Toddlers Fox Costume',tags:[],audience:[]},'kids'],[{title:'Babies Fox Costume',tags:[],audience:[]},'kids']])check(age({...base,...change}),expected,'Positive age evidence or explicit conflict');
for(const[family,change,category,expected]of[
 ['mascot-costumes',{},'costumes',true],
 ['historical-theatrical-costumes',{},'costumes',false],
 ['historical-theatrical-costumes',{title:'Victorian Blue Dress'},'costumes',true],
 ['historical-theatrical-costumes',{title:'Victorian Bear Mascot'},'costumes',false],
 ['historical-theatrical-costumes',{title:'Blue Party Dress',productType:'Theatrical performance'},'costumes',false],
 ['adult-costumes',{title:'Black & Grey Terrier Mascot Adult Costume',tags:[],audience:[]},'costumes',true],
 ['child-costumes',{title:'Black & Grey Terrier Mascot Adult Costume',tags:[],audience:[]},'costumes',false],
 ['child-costumes',{title:'Harry Potter Ravenclaw Classic Dress Kids Costume',tags:[],audience:[]},'costumes',true],
 ['adult-costumes',{title:'Family Adult and Kids Costume Set',tags:[]},'costumes',false],
 ['child-costumes',{title:'Family Adult and Kids Costume Set',tags:[]},'costumes',false],
 ['child-costumes',{title:'Fox Costume',tags:[],audience:['female']},'costumes',false],
 ['costume-wigs',{title:'Queen Wig',categorySlug:'wigs-makeup'},'wigs-makeup',true],
 ['costume-wigs',{title:'Face Paint — Wig Sold Separately',categorySlug:'wigs-makeup'},'wigs-makeup',false],
 ['costume-wigs',{title:'Queen Wig (Mask Sold Separately)',categorySlug:'wigs-makeup'},'wigs-makeup',true],
 ['masks-and-masquerade',{title:'Queen Wig (Mask Sold Separately)',categorySlug:'masks-prosthetics'},'masks-prosthetics',false],
 ['costume-wigs',{title:'Queen Makeup',categorySlug:'wigs-makeup'},'wigs-makeup',false],
 ['masks-and-masquerade',{title:'Cat Mask',categorySlug:'masks-prosthetics'},'masks-prosthetics',true],
 ['masks-and-masquerade',{title:'The Deluxe Joker Purple & Green Child Costume w/ Mask',productType:'Child Costume',categorySlug:'masks-prosthetics'},'masks-prosthetics',false],
 ['masks-and-masquerade',{title:'Creeping Dead Mask w/ Bone Suit Adult Costume',productType:'Costume Rental',categorySlug:'masks-prosthetics'},'masks-prosthetics',false],
 ['masks-and-masquerade',{title:'Adult Costume Mask',productType:'Masks',categorySlug:'masks-prosthetics'},'masks-prosthetics',true],
 ['masks-and-masquerade',{title:'Kids Dress-Up Mask',productType:'Masks',categorySlug:'masks-prosthetics'},'masks-prosthetics',true],
 ['masks-and-masquerade',{title:'Half Mask for Adult Costume',productType:'Masks',categorySlug:'masks-prosthetics'},'masks-prosthetics',true],
 ['historical-theatrical-costumes',{title:"Classic 1920s Scalloped Sequin Flapper Dress Women's Adult Costume"},'costumes',true],
 ['historical-theatrical-costumes',{title:"Authentic Vintage 1960s Blue Sailor Pinup Dress Women's Costume"},'costumes',true],
 ['historical-theatrical-costumes',{title:"1930’s Adult Suit"},'costumes',true],
 ['historical-theatrical-costumes',{title:'1960s Bear Mascot'},'costumes',false],
 ['historical-theatrical-costumes',{title:'Vintage Creeper Clown Costume'},'costumes',false],
 ['historical-theatrical-costumes',{title:'1920s Costume Wig',categorySlug:'wigs-makeup'},'costumes',false],
 ['theatrical-face-body-makeup',{title:'Ben Nye Stage Blood',categorySlug:'wigs-makeup'},'wigs-makeup',true],
 ['theatrical-face-body-makeup',{title:'Ben Nye Fake Aged Dark Blood',categorySlug:'wigs-makeup'},'wigs-makeup',true],
 ['theatrical-face-body-makeup',{title:'Stage Blood Remover',categorySlug:'wigs-makeup'},'wigs-makeup',false],
 ['theatrical-face-body-makeup',{title:'Stage Blood Brush',categorySlug:'wigs-makeup'},'wigs-makeup',false],
 ['theatrical-face-body-makeup',{title:'Fake Blood Bottle Prop',categorySlug:'props-animatronics'},'wigs-makeup',false],
 ['masks-and-masquerade',{title:'Unmasked Character',categorySlug:'masks-prosthetics'},'masks-prosthetics',false],
 ['prosthetics-special-effects',{title:'Elf Ears',categorySlug:'masks-prosthetics'},'masks-prosthetics',true],
 ['prosthetics-special-effects',{title:'Elf Earrings',categorySlug:'masks-prosthetics'},'masks-prosthetics',false],
 ['theatrical-face-body-makeup',{title:'Blue Face Paint',categorySlug:'wigs-makeup'},'wigs-makeup',true],
 ['theatrical-face-body-makeup',{title:'Blue Wig',categorySlug:'wigs-makeup'},'wigs-makeup',false],
 ['theatrical-face-body-makeup',{title:'Cotton Candy Theatrical Contact Lenses',categorySlug:'wigs-makeup'},'wigs-makeup',false],
 ['theatrical-face-body-makeup',{title:'Theatrical Makeup Contact Lens Kit',categorySlug:'wigs-makeup'},'wigs-makeup',false],
 ['theatrical-face-body-makeup',{title:'Ben Nye Liquid Latex',categorySlug:'wigs-makeup'},'wigs-makeup',false],
 ['theatrical-face-body-makeup',{title:'Ben Nye Burns & Blisters Wheel FX Creme Makeup',categorySlug:'wigs-makeup'},'wigs-makeup',true],
 ['theatrical-face-body-makeup',{title:'Makeup Remover',categorySlug:'wigs-makeup'},'wigs-makeup',false],
 ['theatrical-face-body-makeup',{title:'Spirit Gum Adhesive',categorySlug:'wigs-makeup'},'wigs-makeup',false],
 ['theatrical-face-body-makeup',{title:'Makeup Brush Set',categorySlug:'wigs-makeup'},'wigs-makeup',false],
 ['costume-wigs',{title:'Wig Cap',categorySlug:'wigs-makeup'},'wigs-makeup',false],
 ['costume-wigs',{title:'Wig Stand',categorySlug:'wigs-makeup'},'wigs-makeup',false],
 ['costume-wigs',{title:'Queen Wig with Cap Included',categorySlug:'wigs-makeup'},'wigs-makeup',true],
 ['masks-and-masquerade',{title:'Bat Foam Latex Prosthetic',categorySlug:'masks-prosthetics'},'masks-prosthetics',false],
 ['masks-and-masquerade',{title:'Mask Adhesive',categorySlug:'masks-prosthetics'},'masks-prosthetics',false],
 ['prosthetics-special-effects',{title:'Gus Deluxe Old Man Mask',categorySlug:'masks-prosthetics'},'masks-prosthetics',false],
 ['prosthetics-special-effects',{title:'Bat Foam Latex Prosthetic',categorySlug:'masks-prosthetics'},'masks-prosthetics',true],
 ['prosthetics-special-effects',{title:'Prosthetic Adhesive',categorySlug:'masks-prosthetics'},'masks-prosthetics',false],
 ['props-and-animatronics',{title:'Static Skeleton',categorySlug:'props-animatronics'},'props-animatronics',true],
 ['adult-costumes',{title:'Adult Queen Wig',categorySlug:'wigs-makeup'},'wigs-makeup',false],
 ['unknown-family',{},'costumes',false],
])check(matches({...base,...change},family,category),expected,family+' role and category: '+(change.title??base.title));
for(const[f,c]of[['high-end-costumes','costumes'],['mascot-costumes','costumes'],['historical-theatrical-costumes','costumes'],['adult-costumes','costumes'],['child-costumes','costumes'],['costume-wigs','wigs-makeup'],['masks-and-masquerade','masks-prosthetics'],['prosthetics-special-effects','masks-prosthetics'],['theatrical-face-body-makeup','wigs-makeup'],['props-and-animatronics','props-animatronics']]){const q=where(f,c);assert.ok(q);assert.equal(q.categorySlug,c);assert.deepEqual(q.editorial,{is:{status:'published',indexable:true}});assert.equal(q.images.some.usageStatus,'authorized');assert.equal(q.affiliateLinks.some.active,true);assert.equal(q.softRetiredAt,null);assert.equal(JSON.stringify(q).includes('description'),false);cases++;}
check(where('child-costumes','wigs-makeup'),null,'Wrong family/category cannot query');check(where('unknown-family','costumes'),null,'Unknown family cannot query');
const records=Array.from({length:55},(_,id)=>({id,match:id>=26}));const calls=[];const selected=await collect(async(skip,take)=>{calls.push({skip,take});return records.slice(skip,skip+take)},p=>p.match);assert.deepEqual(selected.map(p=>p.id),[26,27,28,29,30,31]);assert.deepEqual(calls,[{skip:0,take:24},{skip:24,take:24}]);
const emptyCalls=[];assert.deepEqual(await collect(async(skip,take)=>{emptyCalls.push(skip);return records.slice(skip,skip+take)},()=>false),[]);assert.deepEqual(emptyCalls,[0,24,48]);
console.log(JSON.stringify({passed:true,classificationAndQueryCases:cases,paginationCases:2,roleUsesPositiveTitleEvidence:true,genderDoesNotInferAge:true,ageConflictAndUnknownRetained:true,indexabilityBeforePagination:true,noBroadFallback:true,noDatabaseQueryOrWrite:true}));
