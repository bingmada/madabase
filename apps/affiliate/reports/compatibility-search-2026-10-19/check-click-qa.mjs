import assert from 'node:assert/strict';
import fs from 'node:fs';
const endpoint='http://127.0.0.1:3021/api/affiliate-clicks';
const examples=[['homeoffice','Amazon US',200],['network','Amazon US',400],['homeoffice','eBay',400]];
const rows=[];
for(const [site,merchant,expected] of examples){
 const response=await fetch(endpoint,{method:'POST',headers:{'content-type':'application/json','referer':'https://homeoffice.madabase.com/guides/thinkcentre-m720q-upgrade-compatibility-guide?madabase-qa=1'},body:JSON.stringify({eventId:`qa-compatibility-${site}-${merchant}`,site,market:'us',productSlug:'thinkcentre-m720q-tiny-b0b14ftvtv',merchant,position:'release-qa',path:'/guides/thinkcentre-m720q-upgrade-compatibility-guide'})});
 const body=await response.json();assert.equal(response.status,expected);if(expected===200){assert.equal(body.persisted,false);assert.equal(body.validated,true);assert.equal(body.reason,'qa_visit');}rows.push({site,merchant,status:response.status,body});
}
fs.writeFileSync(new URL('./click-qa.json',import.meta.url),JSON.stringify({passed:true,rows,productionDatabaseWrites:0},null,2)+'\n');
console.log('Exact new ASIN accepted, wrong site and unapproved merchant rejected; QA writes zero events.');
