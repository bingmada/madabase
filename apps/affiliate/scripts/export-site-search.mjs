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
if (process.argv.includes("--check")) {
  if (!fs.existsSync(output) || fs.readFileSync(output, "utf8") !== serialized) throw new Error("Main search snapshot is stale: run export-site-search.mjs");
} else fs.writeFileSync(output, serialized);
console.log(JSON.stringify({ pages: unique.length, mode: process.argv.includes("--check") ? "verified" : "exported", bySite: Object.fromEntries([...new Set(unique.map((item) => item.site))].map((site) => [site, unique.filter((item) => item.site === site).length])) }));
