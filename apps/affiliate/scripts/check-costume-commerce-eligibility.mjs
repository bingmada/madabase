import assert from 'node:assert/strict';
import {loadAffiliateTypescript as load} from './lib/load-affiliate-typescript.mjs';
const{costumeProductRequiresEyeCare:held,costumeGeneralCommerceWhere:where}=load('../../lib/costume-commerce-eligibility.ts');
const{shouldRecordCjClick:record}=load('../../lib/cj-click-traffic.ts');
const normal={title:'Judge Unisex Wig',productType:null,slug:'judge-unisex-wig-example'};
let identities=0;
for(const[change,expected]of[[{},false],[{title:'Cotton Candy Theatrical Contact Lenses'},true],[{title:'Pink Contact Lens'},true],[{title:'Theatre Contact-Lenses'},true],[{title:'CONTACTLENS'},true],[{productType:'Decorative Contact Lenses'},true],[{slug:'cotton-candy-theatrical-contact-lenses-fpyb29g'},true],[{title:'Contactless LED Prop'},false],[{title:'Lens-shaped Earrings'},false]]){assert.equal(held({...normal,...change}),expected,JSON.stringify(change));identities++;}
function matches(row,q){return Object.entries(q).every(([key,value])=>{
 if(key==='AND')return(Array.isArray(value)?value:[value]).every(x=>matches(row,x));
 if(key==='OR')return value.some(x=>matches(row,x));
 if(key==='NOT')return!(Array.isArray(value)?value:[value]).some(x=>matches(row,x));
 if(value===null||typeof value!=='object')return row[key]===value;
 if('contains'in value)return String(row[key]??'').toLowerCase().includes(value.contains.toLowerCase());
 throw new Error('Unexpected query condition');
});}
let queries=0;
for(const[change,expected]of[[{},true],[{productType:'Wigs'},true],[{title:'Contact Lens'},false],[{slug:'pink-contact-lenses'},false],[{productType:'ContactLenses'},false],[{productType:'Contact-Lens'},false]]){assert.equal(matches({...normal,...change},where()),expected,JSON.stringify(change));queries++;}
assert.ok(JSON.stringify(where()).includes('"productType":null'),'Nullable type explicitly retained before SQL NOT/contains filtering');
const ua='Mozilla/5.0 ordinary-browser';let traffic=0;
for(const[url,headers,expected]of[
 ['https://costumes.madabase.com/go/cj/exampletoken',{host:'costumes.madabase.com','user-agent':ua},true],
 ['http://localhost:3025/go/cj/exampletoken',{'user-agent':ua},false],
 ['http://127.0.0.1:3025/go/cj/exampletoken',{'user-agent':ua},false],
 ['http://costumes.localhost:3025/go/cj/exampletoken',{'user-agent':ua},false],
 ['http://[::1]:3025/go/cj/exampletoken',{'user-agent':ua},false],
 ['https://costumes.madabase.com/go/cj/exampletoken?madabase-qa=1',{'user-agent':ua},false],
 ['https://costumes.madabase.com/go/cj/exampletoken',{'user-agent':ua,referer:'https://costumes.madabase.com/guides/example?madabase-qa=1'},false],
 ['https://costumes.madabase.com/go/cj/exampletoken',{'user-agent':'Googlebot'},false],
 ['https://costumes.madabase.com/go/cj/exampletoken',{'user-agent':ua,referer:'invalid URL'},false],
 ['https://costumes.madabase.com/go/cj/exampletoken',{'user-agent':ua,referer:'https://costumes.madabase.com/guides/example'},true],
]){assert.equal(record(new Request(url,{headers})),expected,url);traffic++;}
console.log(JSON.stringify({passed:true,identityCases:identities,prePaginationQueryCases:queries,trafficCases:traffic,nullableProductTypePreserved:true,noDatabaseQueryOrWrite:true,noExternalRequest:true}));
