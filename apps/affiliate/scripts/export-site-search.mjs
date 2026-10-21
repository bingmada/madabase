import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadAffiliateTypescript } from "./lib/load-affiliate-typescript.mjs";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const { allSiteSearchIndex } = loadAffiliateTypescript("../../lib/site-search.ts");
const { guides } = loadAffiliateTypescript("../../../main/lib/content.ts");
const entries = [...allSiteSearchIndex(), ...guides.map((item) => ({ site: "main", kind: "guide", title: item.title, summary: item.dek, href: `https://madabase.com/guides/${item.slug}`, category: item.category }))];
const unique = [...new Map(entries.map((entry) => [entry.href, entry])).values()];
const output = path.join(root, "apps/main/lib/search-index.json");
const serialized = JSON.stringify(unique, null, 2) + "\n";
const updateLedger = JSON.parse(fs.readFileSync(path.join(root, "apps/affiliate/config/editorial-updates.json"), "utf8"));
const entriesByHref = new Map(unique.map((entry) => [entry.href, entry]));
const seenUpdates = new Set();
const updates = updateLedger.entries.map((record) => {
  const entry = entriesByHref.get(record.href);
  if (!entry) throw new Error(`Editorial update points to unpublished or missing content: ${record.href}`);
  if (seenUpdates.has(record.href)) throw new Error(`Duplicate editorial update: ${record.href}`);
  seenUpdates.add(record.href);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.updatedAt) || !Number.isFinite(Date.parse(record.updatedAt)) || !record.change?.trim()) {
    throw new Error(`Editorial update needs a dated substantive change: ${record.href}`);
  }
  return { site: entry.site, title: entry.title, href: entry.href, summary: entry.summary, updatedAt: record.updatedAt, change: record.change };
}).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.href.localeCompare(b.href));
const updatesOutput = path.join(root, "apps/main/lib/research-updates.json");
const updatesSerialized = JSON.stringify(updates, null, 2) + "\n";
if (process.argv.includes("--check")) {
  if (!fs.existsSync(output) || fs.readFileSync(output, "utf8") !== serialized) throw new Error("Main search snapshot is stale: run export-site-search.mjs");
  if (!fs.existsSync(updatesOutput) || fs.readFileSync(updatesOutput, "utf8") !== updatesSerialized) throw new Error("Main editorial updates snapshot is stale: run export-site-search.mjs");
} else {
  fs.writeFileSync(output, serialized);
  fs.writeFileSync(updatesOutput, updatesSerialized);
}
console.log(JSON.stringify({ pages: unique.length, mode: process.argv.includes("--check") ? "verified" : "exported", bySite: Object.fromEntries([...new Set(unique.map((item) => item.site))].map((site) => [site, unique.filter((item) => item.site === site).length])) }));
