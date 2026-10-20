import assert from 'node:assert/strict';
import fs from 'node:fs';
const endpoint='https://homeoffice.madabase.com/api/affiliate-clicks';
const examples=[['homeoffice','Amazon US',200],['network','Amazon US',400],['homeoffice','eBay',400]];
const rows=[];
const slugs=['thinkcentre-m720q-tiny-b0b14ftvtv','kingston-kcp426sd8-16-b07d2dz42b','crucial-mx500-1tb-b078211kbb','deal4go-sata-kit-00xl211-01mn886-b0f2dygpdq'];
for(const productSlug of slugs)for(const [site,merchant,expected] of examples){
 const response=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json','referer':'https://homeoffice.madabase.com/guides/thinkcentre-m720q-upgrade-compatibility-guide?madabase-qa=1'},body:JSON.stringify({eventId:`qa-tiny-parts-${Date.now()}-${rows.length}`,site,market:'us',productSlug,merchant,position:'release-qa',path:'/guides/thinkcentre-m720q-upgrade-compatibility-guide'})});
 const body=await response.json();assert.equal(response.status,expected,`${productSlug}/${site}/${merchant}: ${JSON.stringify(body)}`);if(expected===200){assert.equal(body.persisted,false);assert.equal(body.validated,true);assert.equal(body.reason,'qa_visit');}rows.push({productSlug,site,merchant,status:response.status,body});
}
fs.writeFileSync(new URL('./public-click-qa.json',import.meta.url),JSON.stringify({passed:true,rows,productionDatabaseWrites:0},null,2)+'\n');
console.log('Exact new ASIN accepted, wrong site and unapproved merchant rejected; QA writes zero events.');
