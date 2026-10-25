import assert from 'node:assert/strict';
import fs from 'node:fs';
import {loadAffiliateTypescript as load} from './lib/load-affiliate-typescript.mjs';
const {costumeProductWhere,compareCostumePrices}=load('../../lib/costume-catalog-query.ts');
const {cleanCostumeFeedText,costumeMerchantPolicyNote,costumeMerchantPolicyUrl}=load('../../lib/costume-copy.ts');
// Evaluate the resulting boolean query against deliberately conflicting records.
function matches(row,where){return Object.entries(where).every(([key,value])=>{
 if(key==='AND')return value.every(clause=>matches(row,clause));
 if(key==='OR')return value.some(clause=>matches(row,clause));
 if(key==='NOT')return !(Array.isArray(value)?value:[value]).some(clause=>matches(row,clause));
 if(value===null||typeof value!=='object')return row[key]===value;
 if('not'in value)return row[key]!==value.not;
 if('notIn'in value)return !value.notIn.includes(row[key]);
 if('in'in value)return value.in.includes(row[key]);
 if('has'in value)return row[key].includes(value.has);
 if('contains'in value)return String(row[key]??'').toLowerCase().includes(value.contains.toLowerCase());
 if('gte'in value||'lt'in value)return(!('gte'in value)||row[key]>=value.gte)&&(!('lt'in value)||row[key]<value.lt);
 return matches(row[key],value);
});}
const base={merchant:{slug:'abracadabra-nyc',advertiserCid:'7889430'},softRetiredAt:null,availability:'in stock',categorySlug:'costumes',audience:['adult'],premium:false,professional:false,halloween:true,price:1200,title:'Wolf outfit',brand:'Example',productType:'Costume',description:'Cloth outfit'};
const input={q:'wolf',category:'costumes',feature:'premium-professional',audience:'adult',sort:'featured',page:1};
let cases=0;
for(const[change,expected]of[[{},false],[{premium:true},true],[{professional:true},true],[{premium:true,title:'Rabbit',description:'Rabbit'},false],[{premium:true,audience:['kids']},false],[{premium:true,categorySlug:'props-animatronics'},false],[{premium:true,availability:'out of stock'},false],[{premium:true,softRetiredAt:new Date()},false],[{premium:true,merchant:{slug:'other',advertiserCid:'7889430'}},false]]){assert.equal(matches({...base,...change},costumeProductWhere(input)),expected);cases++;}
assert.equal(matches({...base,premium:true},costumeProductWhere({...input,q:''})),true);cases++;
assert.equal(matches(base,costumeProductWhere({...input,feature:undefined})),true);cases++;
assert.equal(matches({...base,professional:true},costumeProductWhere({...input,feature:'premium'})),false);cases++;
assert.equal(matches({...base,premium:true,price:49},costumeProductWhere({...input,price:'1000-plus'})),false);cases++;
const reviews=JSON.parse(fs.readFileSync(new URL('../lib/reviewed-costume-variants.json',import.meta.url))).rows;
const observed=reviews.find(r=>r.available&&!r.hold&&Number(r.price)<50);
assert.equal(matches({...base,id:observed.id,title:observed.title,price:9999},costumeProductWhere({...input,q:'',audience:undefined,category:undefined,feature:undefined,price:'under-50'})),true);cases++;
assert.equal(matches({...base,id:observed.id,title:observed.title,price:9999},costumeProductWhere({...input,q:'',audience:undefined,category:undefined,feature:undefined,price:'1000-plus'})),false);cases++;
const buy=reviews.find(r=>r.transaction==='buy'&&r.available&&!r.hold),rent=reviews.find(r=>r.transaction==='rent'&&r.available&&!r.hold);
assert.equal(matches({...base,id:buy.id,rental:true},costumeProductWhere({...input,q:'',feature:'rental'})),false);cases++;
assert.equal(matches({...base,id:rent.id,rental:false},costumeProductWhere({...input,q:'',feature:'rental'})),true);cases++;
const priced=[{id:'a',title:'A',price:'49.95'},{id:'b',title:'B',price:null},{id:'c',title:'C',price:'36.95'},{id:'d',title:'D',price:'47.95'}];
assert.deepEqual([...priced].sort((a,b)=>compareCostumePrices(a,b,false)).map(p=>p.id),['c','d','a','b']);
assert.deepEqual([...priced].sort((a,b)=>compareCostumePrices(a,b,true)).map(p=>p.id),['a','d','c','b']);
const tail='Security deposit $250. Rentals up to three days. Return as is; do not launder. Severe damage may cost extra.';
const feed='<p>'+('Included garment and measurements. '.repeat(35))+'</p><p>'+tail+'</p>';
const body=cleanCostumeFeedText(feed);assert.ok(body.length>700&&body.endsWith(tail)&&!body.includes('<p>')&&!body.endsWith('…'));assert.ok(body.includes('\n\n'+tail),'Financial tail retains its own paragraph');assert.ok(cleanCostumeFeedText(feed,155).length<=156&&!cleanCostumeFeedText(feed,155).includes('\n'));assert.equal(cleanCostumeFeedText(null),null);
assert.match(costumeMerchantPolicyNote,/final.*no ordinary returns, refunds or exchanges/);assert.match(costumeMerchantPolicyNote,/rent or buy.*deposit/);assert.equal(costumeMerchantPolicyUrl,'https://abracadabranyc.com/pages/helpful-info');
const guide=fs.readFileSync(new URL('../app/guides/[slug]/page.tsx',import.meta.url),'utf8');assert.ok(!guide.includes('listIndexableCostumeProducts'),'No category-wide fallback after family query');
assert.ok(guide.includes('listCostumeGuideProducts')&&!guide.includes('listCostumeCatalogProducts'),'Guide uses the dedicated family and published-cohort selector');
console.log(JSON.stringify({passed:true,booleanQueryCases:cases,fullMerchantConditionsPreserved:true,snippetStillBounded:true,broaderGuideFallbackRemoved:true,noDatabaseQueryOrWrite:true}));
