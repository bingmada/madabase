import fs from "node:fs";
import { loadAffiliateTypescript } from "./lib/load-affiliate-typescript.mjs";
const {commerceFunnelReport}=loadAffiliateTypescript("../../lib/commerce-funnel-report.ts");
const [input,start,end]=process.argv.slice(2);
if(!input||!start||!end) throw new Error("Usage: node scripts/report-commerce-funnel.mjs events.json START_ISO END_ISO (reads an exported JSON array; does not access the database)");
console.log(JSON.stringify(commerceFunnelReport(JSON.parse(fs.readFileSync(input,"utf8")),start,end),null,2));
