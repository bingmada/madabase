import assert from 'node:assert/strict';
import fs from 'node:fs';
import { loadAffiliateTypescript as load } from './lib/load-affiliate-typescript.mjs';
const { evaluateCalculator: evaluate, calculatorDefaults, calculatorFields } = load('../../lib/calculator-plans.ts');
const { siteGuides } = load('../../lib/content.ts');
const { siteSearchIndex, searchSites } = load('../../lib/site-search.ts');
const { sites } = load('../../lib/sites.ts');
const { categoryCommerceProduct } = load('../../lib/commerce-paths.ts');
const rows = [];
const check = (name, kind, values, status, text) => {
  const result = evaluate(kind, values);
  assert.equal(result.status, status, name);
  if (text) assert.ok(result.lines.join('\n').includes(text), name);
  assert.ok(!result.lines.join(' ').match(/Infinity|NaN/), name);
  rows.push({name,kind,status});
};
for (const kind of ['desk','diapers','wifi','air','mesh','matter','feeding']) {
  const defaults = calculatorDefaults(kind);
  check(`${kind}: valid example`,kind,defaults,'ready');
  check(`${kind}: blank stays unknown`,kind,{primary:'',secondary:'',keyboard:''},'unknown');
  for (const field of calculatorFields(kind)) {
    check(`${kind}: missing ${field.key}`,kind,{...defaults,[field.key]:''},'unknown');
    check(`${kind}: negative ${field.key}`,kind,{...defaults,[field.key]:'-1'},'invalid');
    check(`${kind}: nonfinite ${field.key}`,kind,{...defaults,[field.key]:'1e999'},'invalid');
    if (field.integer) check(`${kind}: fractional ${field.key}`,kind,{...defaults,[field.key]:'1.5'},'invalid');
  }
}
check('Desk: zero keyboard is explicit', 'desk',{primary:'28',secondary:'42',keyboard:'0'},'ready','about 28 in');
check('Desk: keyboard cannot consume elbow height', 'desk',{primary:'28',secondary:'42',keyboard:'28'},'invalid');
check('Diapers: newborn is zero months', 'diapers',{primary:'0',secondary:'7',keyboard:''},'ready','70 diapers');
check('Diapers: fractional age is retained', 'diapers',{primary:'1.5',secondary:'7',keyboard:''},'ready','56 diapers');
check('Diapers: arithmetic overflow', 'diapers',{primary:'2',secondary:'9007199254740991',keyboard:''},'invalid');
check('Air: 240 × 8 × 5 ÷ 60', 'air',{primary:'240',secondary:'8',keyboard:''},'ready','160 CFM');
check('Air: decimals are not coerced to minima', 'air',{primary:'24.5',secondary:'5.5',keyboard:''},'ready','11.2 CFM');
check('Air: multiplication overflow', 'air',{primary:'1e308',secondary:'1e308',keyboard:''},'invalid');
check('Air: arithmetic underflow', 'air',{primary:'1e-308',secondary:'1e-308',keyboard:''},'invalid');
check('Feeding: supplied target divided exactly', 'feeding',{primary:'3',secondary:'330',keyboard:''},'ready','110 kcal');
check('Feeding: small split does not round to zero', 'feeding',{primary:'10',secondary:'0.1',keyboard:''},'ready','less than 0.1 kcal');
check('Matter: no accessories is unknown', 'matter',{primary:'0',secondary:'0',keyboard:''},'unknown');
check('Matter: Wi-Fi only', 'matter',{primary:'0',secondary:'2',keyboard:''},'ready','No Thread border router');
check('Matter: Thread only', 'matter',{primary:'1',secondary:'0',keyboard:''},'ready','Thread devices also require');
check('Hex notation is not a measurement', 'air',{primary:'0x40',secondary:'8',keyboard:''},'invalid');
const leaks = /\b(?:the (?:page|draft|site) (?:must|will|should|needs)|qualified but|very competitive|priority because|niche but|strong current intent|demand is|independent intent|high-intent|will not rely)\b/i;
let guides = 0;
for (const site of searchSites) {
  for (const guide of siteGuides(site)) {
    guides++;
    for (const text of [guide.dek,guide.quickAnswer,...guide.sections.map(s=>s.body)]) if (text) assert.ok(!leaks.test(text),`${site}/${guide.slug}: planning note leaked: ${text}`);
  }
  for (const entry of siteSearchIndex(site)) assert.ok(!leaks.test(entry.summary),`Search leak: ${entry.href}`);
}
const commerce = [];
for (const site of Object.values(sites)) for (const category of site.categories) {
  const product = categoryCommerceProduct(site.key,category.slug);
  if (product) assert.equal(product.category,category.slug,`${site.key}/${category.slug} should not sell another category`);
  commerce.push({site:site.key,category:category.slug,product:product?.slug??null});
}
const report = {checkedAt:new Date().toISOString(),calculatorCases:rows.length,rows,guidesScanned:guides,readerPlanningLeaks:0,categoryCommerce:commerce,passed:true};
fs.mkdirSync(new URL('../reports/conversion-quality-2026-10-22/',import.meta.url),{recursive:true});
fs.writeFileSync(new URL('../reports/conversion-quality-2026-10-22/code-checks.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({calculatorCases:rows.length,guidesScanned:guides,categories:commerce.length,passed:true}));
