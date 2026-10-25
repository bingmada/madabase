import assert from 'node:assert/strict';
import {loadAffiliateTypescript as load} from './lib/load-affiliate-typescript.mjs';
const{costumeRelatedFamily:family,costumeRelatedProductMatches:matches,collectCostumeFamilyProducts:collect}=load('../../lib/costume-family-selection.ts');
const product=(title,categorySlug='wigs-makeup',extra={})=>({title,categorySlug,productType:null,tags:[],audience:[],premium:false,professional:false,...extra});
let roles=0,pairs=0;
for(const[p,wanted]of[
 [product('Judge Unisex Wig'),'costume-wigs'],[product('Wig Cap'),null],
 [product('FX Creme Makeup'),'theatrical-face-body-makeup'],[product('Makeup Remover'),null],
 [product('Theatrical Makeup Contact Lenses'),null],
 [product('Bat Foam Latex Prosthetic','masks-prosthetics'),'prosthetics-special-effects'],
 [product('Diablo Masquerade Mask','masks-prosthetics'),'masks-and-masquerade'],
 [product('Kids Fox Costume','costumes'),'child-costumes'],
 [product('Adult Terrier Mascot','costumes'),'mascot-costumes'],
 [product('Victorian Adult Dress','costumes'),'historical-theatrical-costumes'],
 [product('Royal Fox Outfit','costumes',{audience:['unisex']}),null],
 [product('Adult and Kids Family Outfit','costumes'),null],
]){assert.equal(family(p),wanted,p.title);roles++;}
const wig=product('Judge Unisex Wig'),mascot=product('Adult Terrier Mascot','costumes'),child=product('Kids Fox Costume','costumes'),bat=product('Bat Foam Latex Prosthetic','masks-prosthetics');
for(const[source,candidate,wanted]of[
 [wig,product('Another Judicial Wig'),true],[wig,product('Wig Stand'),false],[wig,product('Ben Nye FX Creme Makeup'),false],
 [wig,product('Kids Judicial Wig'),false],[wig,product('Adult Judicial Wig'),false],
 [mascot,product('Polar Bear Mascot','costumes',{tags:['Adults']}),true],
 [mascot,product('Kids Bear Mascot','costumes'),false],[mascot,product('Bear Mascot','costumes'),false],
 [child,product('Child Raven Costume','costumes'),true],[child,product('Adult Raven Costume','costumes'),false],
 [child,product('Raven Costume','costumes',{audience:['female']}),false],
 [bat,product('Gus Deluxe Old Man Mask','masks-prosthetics'),false],
 [bat,product('Gargoyle Flexi Ears','masks-prosthetics'),true],
 [bat,product('Prosthetic Adhesive','masks-prosthetics'),false],
 [product('Makeup Remover'),product('FX Creme Makeup'),false],
]){assert.equal(matches(source,candidate),wanted,source.title+' -> '+candidate.title);pairs++;}
const rows=[...Array.from({length:25},(_,id)=>({...product('Wig Cap '+id),id})),{...product('Kids Queen Wig'),id:25},{...product('Null Type Wig'),id:26}],calls=[];
const result=await collect(async(skip,take)=>{calls.push({skip,take});return rows.slice(skip,skip+take)},candidate=>matches(wig,candidate),3);
assert.deepEqual(result.map(x=>x.id),[26]);assert.deepEqual(calls,[{skip:0,take:24},{skip:24,take:24}]);
console.log(JSON.stringify({passed:true,roleCases:roles,sourceCandidateCases:pairs,laterCandidatePageCases:1,unknownAndConflictingAgeNotInferred:true,noForcedThreeResults:true,noDatabaseQueryOrWrite:true}));
