import fs from "node:fs";
import { createRequire } from "node:module";

// Read-only aggregate reporting. No session identifiers or raw referrers leave
// the database; the report does not equate shopping clicks with orders.
const args = Object.fromEntries(process.argv.slice(2).map(arg => {
  const match = /^--(runtime|start|end|env-file)=(.+)$/.exec(arg);
  if (!match) throw new Error("Use --runtime=PATH --start=ISO --end=ISO [--env-file=PATH]");
  return [match[1], match[2]];
}));
if (!args.runtime || !/^\/srv\/madabase-affiliate\/releases\/[a-zA-Z0-9_-]+$/.test(args.runtime)) throw new Error("An explicit existing production runtime is required");
if (!Number.isFinite(Date.parse(args.start)) || !Number.isFinite(Date.parse(args.end)) || Date.parse(args.start) >= Date.parse(args.end)) throw new Error("Use a valid start-inclusive/end-exclusive period");
const cohort = JSON.parse(fs.readFileSync(new URL("../config/search-recovery-cohort-20261103.json", import.meta.url), "utf8"));
const paths = cohort.pages.map(page => ({site:page.site,path:new URL(page.url).pathname}));
const envFile = args["env-file"] ?? "/etc/madabase/runtime.env";
if (envFile !== "/etc/madabase/runtime.env") throw new Error("Use the existing runtime environment file");
let connectionString = fs.readFileSync(envFile,"utf8").split(/\r?\n/).find(line=>line.startsWith("DATABASE_URL="))?.slice(13).trim();
if (!connectionString) throw new Error("Configured database required");
if ([34,39].includes(connectionString.charCodeAt(0)) && connectionString.at(-1) === connectionString[0]) connectionString = connectionString.slice(1,-1);
const require = createRequire(import.meta.url);
const { Client } = require(require.resolve("pg",{paths:[args.runtime+"/apps/affiliate",args.runtime]}));
const client = new Client({connectionString,options:"-c default_transaction_read_only=on -c statement_timeout=15000 -c lock_timeout=2000"});
const selected = `SELECT e.* FROM "CommerceEvent" e JOIN jsonb_to_recordset($3::jsonb) AS c(site text,path text) ON e.site=c.site AND e.path=c.path WHERE e."createdAt">=$1 AND e."createdAt"<$2`;
const dimensions = 'site,path,"releaseId",device,market,channel,source,campaign';
try {
  await client.connect();
  await client.query("BEGIN READ ONLY");
  const readOnly = (await client.query("SHOW transaction_read_only")).rows[0].transaction_read_only;
  if (readOnly !== "on") throw new Error("Read-only transaction required");
  const values = [args.start,args.end,JSON.stringify(paths)];
  const pages = (await client.query(`WITH selected AS (${selected}), flags AS (SELECT ${dimensions},"sessionId",bool_or("eventType"='content_view') AS viewed,bool_or("eventType"='affiliate_click') AS clicked FROM selected GROUP BY ${dimensions},"sessionId") SELECT ${dimensions},count(*) FILTER(WHERE viewed)::int AS "contentSessions",count(*) FILTER(WHERE clicked)::int AS "clickSessions",count(*) FILTER(WHERE clicked AND viewed)::int AS "matchedClickSessions",count(*) FILTER(WHERE clicked AND NOT viewed)::int AS "clickSessionsWithoutContentView" FROM flags GROUP BY ${dimensions} ORDER BY site,path,"releaseId",device,market,channel,source,campaign`,values)).rows;
  const buttonDimensions = dimensions+',"productSlug",merchant,position';
  const buttons = (await client.query(`WITH selected AS (${selected}), flags AS (SELECT ${buttonDimensions},"sessionId",bool_or("eventType"='cta_view') AS exposed,bool_or("eventType"='affiliate_click') AS clicked FROM selected WHERE "eventType" IN ('cta_view','affiliate_click') GROUP BY ${buttonDimensions},"sessionId") SELECT ${buttonDimensions},count(*) FILTER(WHERE exposed)::int AS "exposedSessions",count(*) FILTER(WHERE clicked)::int AS "clickSessions",count(*) FILTER(WHERE clicked AND exposed)::int AS "matchedClickSessions",count(*) FILTER(WHERE clicked AND NOT exposed)::int AS "clickSessionsWithoutQualifiedExposure" FROM flags GROUP BY ${buttonDimensions} ORDER BY site,path,"releaseId",device,market,channel,source,campaign,"productSlug",merchant,position`,values)).rows;
  const events = (await client.query('SELECT "eventType",count(*)::int AS rows,min("createdAt") AS first,max("createdAt") AS last FROM "CommerceEvent" WHERE "createdAt">=$1 AND "createdAt"<$2 GROUP BY "eventType" ORDER BY "eventType"',[args.start,args.end])).rows;
  const legacyClicks = (await client.query('SELECT site,count(*)::int AS clicks FROM "AffiliateClick" WHERE "createdAt">=$1 AND "createdAt"<$2 GROUP BY site ORDER BY site',[args.start,args.end])).rows;
  await client.query("ROLLBACK");
  const ratio = (matched,total) => total ? Number((100*matched/total).toFixed(2)) : null;
  console.log(JSON.stringify({generatedAt:new Date().toISOString(),period:{start:args.start,end:args.end,endExclusive:true},transactionReadOnly:readOnly,cohort:paths,allSiteEventCounts:events,legacyClickCounts:legacyClicks,pages:pages.map(row=>({...row,shoppingSessionRatePercent:ratio(row.matchedClickSessions,row.contentSessions)})),buttons:buttons.map(row=>({...row,observedButtonCtrPercent:ratio(row.matchedClickSessions,row.exposedSessions)})),limits:["Counts use the existing analytics eligibility and QA-exclusion logic; remaining automation cannot be ruled out.","Sessions are anonymous tab sessions, not unique people. Page, release, device, market and acquisition dimensions remain separate.","No raw session identifiers, IP addresses, form inputs or referrers are exported.","Merchant clicks are not orders or settled revenue. No production data was written."]},null,2));
} catch (error) {
  await client.query("ROLLBACK").catch(()=>{});
  console.error(JSON.stringify({ok:false,code:error.code??null,message:error.code ? "Database report failed" : error.message}));
  process.exitCode=1;
} finally {
  await client.end();
}
