import fs from 'node:fs';import crypto from 'node:crypto';import {createRequire} from 'node:module';import {fileURLToPath} from 'node:url';
const fields=['id','eventType','sessionId','site','path','pageType','market','releaseId','device','channel','source','campaign','productSlug','merchant','position','createdAt'];
export function schemaStatus(rows){
 const fatal=[],missing=[];const market=rows.find(r=>r.table_name==='AffiliateClick'&&r.column_name==='market');
 if(!rows.some(r=>r.table_name==='AffiliateClick'&&r.column_name==='eventId'))fatal.push('Expected existing AffiliateClick table');
 if(!market)missing.push('AffiliateClick.market');else if(market.data_type!=='text'||market.is_nullable!=='YES')fatal.push('Unexpected AffiliateClick.market shape');
 const events=rows.filter(r=>r.table_name==='CommerceEvent');
 if(!events.length)missing.push('CommerceEvent');else for(const name of fields){const row=events.find(r=>r.column_name===name),type=name==='createdAt'?'timestamp without time zone':'text';if(!row||row.data_type!==type||row.is_nullable!=='NO')fatal.push('Unexpected CommerceEvent.'+name);}
 return {passed:!fatal.length&&!missing.length,fatal,missing};
}
async function main(){
 const apply=process.argv.includes('--apply');if(!apply&&!process.argv.includes('--check'))throw Error('Explicit --check or --apply required');
 const runtime=process.argv.find(a=>a.startsWith('--runtime='))?.slice(10);if(!runtime||!/^\/srv\/madabase-affiliate\/releases\/[A-Za-z0-9_-]+$/.test(runtime))throw Error('Explicit existing Affiliate runtime required');
 let url=fs.readFileSync('/etc/madabase/runtime.env','utf8').split(/\r?\n/).find(l=>l.startsWith('DATABASE_URL='))?.slice(13).trim();if(!url)throw Error('Configured database required');if([34,39].includes(url.charCodeAt(0))&&url.at(-1)===url[0])url=url.slice(1,-1);
 const require=createRequire(import.meta.url),{Client}=require(require.resolve('pg',{paths:[runtime+'/apps/affiliate',runtime]}));const c=new Client({connectionString:url,options:'-c lock_timeout=2000 -c statement_timeout=15000'+(apply?'':' -c default_transaction_read_only=on')});
 const sql="SELECT table_name,column_name,data_type,is_nullable FROM information_schema.columns WHERE table_schema='public' AND table_name IN ('AffiliateClick','CommerceEvent') ORDER BY table_name,ordinal_position";
 try{await c.connect();await c.query(apply?'BEGIN':'BEGIN READ ONLY');const before=schemaStatus((await c.query(sql)).rows);if(before.fatal.length)throw Error(before.fatal.join('; '));const operations=[];
 if(apply&&before.missing.length){const ddl=fs.readFileSync(new URL('./commerce-migration.sql',import.meta.url),'utf8');const split=ddl.indexOf('CREATE TABLE');if(before.missing.includes('AffiliateClick.market')){await c.query(ddl.slice(0,split));operations.push('Added nullable AffiliateClick.market');}if(before.missing.includes('CommerceEvent')){await c.query(ddl.slice(split));operations.push('Created CommerceEvent and its indexes');}
 const registry=await c.query("SELECT to_regclass('public._prisma_migrations') AS relation");if(registry.rows[0].relation){const name='20261022070000_commerce_funnel',previous=await c.query('SELECT migration_name FROM "_prisma_migrations" WHERE migration_name=$1 AND finished_at IS NOT NULL',[name]);if(!previous.rowCount)await c.query('INSERT INTO "_prisma_migrations" (id,checksum,finished_at,migration_name,started_at,applied_steps_count) VALUES ($1,$2,NOW(),$3,NOW(),1)',[crypto.randomUUID(),crypto.createHash('sha256').update(ddl).digest('hex'),name]);operations.push('Recorded applied migration in existing Prisma registry');}}
 const after=schemaStatus((await c.query(sql)).rows);if(apply&&!after.passed)throw Error('Schema verification failed after additive changes');await c.query(apply?'COMMIT':'ROLLBACK');console.log(JSON.stringify({mode:apply?'apply':'read-only-check',before,after,operations,applicationDataDeleted:false,applicationRowsInserted:false}));if(!apply&&!after.passed)process.exitCode=2;
 }catch(e){await c.query('ROLLBACK').catch(()=>{});console.error(JSON.stringify({ok:false,code:e.code??null,message:e.message}));process.exitCode=1;}finally{await c.end();}
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1])await main();
