import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const affiliateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const inputArg = process.argv[2];
const site = process.argv[3];
function valueFor(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

if (!inputArg || !site) throw new Error("Usage: node record-breadth-draft-product-research.mjs <input-json> <site> [--base <research-json>] [--family-source <families-json>] [--exclude-source <exclusions-json>] [--drop-families <comma-separated-slugs>]");
if (!new Set(["network", "smarthome", "homeoffice", "baby", "pet"]).has(site)) throw new Error(`Unsupported site: ${site}`);

const inputPath = path.resolve(inputArg);
const payload = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const basePath = valueFor("--base");
const base = basePath ? JSON.parse(fs.readFileSync(path.resolve(basePath), "utf8")) : { products: [], failures: [] };
const exclusionPath = valueFor("--exclude-source");
const droppedFamilies = new Set((valueFor("--drop-families") ?? "").split(",").map((value) => value.trim()).filter(Boolean));
const excludedKeys = exclusionPath
  ? new Set(JSON.parse(fs.readFileSync(path.resolve(exclusionPath), "utf8")).exclusions.map((item) => `${item.site}:${item.familySlug}`))
  : new Set();
const productMap = new Map();
for (const item of [...(base.products ?? []), ...(payload.products ?? [])]) {
  if (item.site === site && !excludedKeys.has(`${item.site}:${item.familySlug}`) && !droppedFamilies.has(item.familySlug)) productMap.set(`${item.site}:${item.familySlug}`, item);
}
const products = [...productMap.values()];
const failureMap = new Map();
const pendingMap = new Map();
for (const item of [...(base.pending ?? []), ...(payload.pending ?? [])]) {
  const key = `${item.site}:${item.familySlug}`;
  if (item.site === site && !excludedKeys.has(key) && !droppedFamilies.has(item.familySlug) && !productMap.has(key)) pendingMap.set(key, item);
}
for (const item of [...(base.failures ?? []), ...(payload.failures ?? [])]) {
  const key = `${item.site}:${item.familySlug}`;
  if (item.site !== site || excludedKeys.has(key) || droppedFamilies.has(item.familySlug) || productMap.has(key)) continue;
  if (/parsed\":0|HTTP (?:403|429|500|503)|blocked|curl_|fetch failed|network|TLS|socket/i.test(item.error ?? "")) {
    pendingMap.set(key, { ...item, pendingReason: "Amazon access was throttled or returned an empty technical response; opportunity remains eligible for a later exact-product retry." });
  } else {
    failureMap.set(key, item);
  }
}
const failures = [...failureMap.values()];
const familySourcePath = valueFor("--family-source");
if (familySourcePath) {
  const familyPayload = JSON.parse(fs.readFileSync(path.resolve(familySourcePath), "utf8"));
  for (const item of familyPayload.families ?? []) {
    const key = `${item.site}:${item.familySlug}`;
    if (item.site === site && !excludedKeys.has(key) && !droppedFamilies.has(item.familySlug) && !productMap.has(key) && !failureMap.has(key) && !pendingMap.has(key)) {
      pendingMap.set(key, { ...item, pendingReason: "Not attempted after Amazon throttling; opportunity remains eligible for a later exact-product retry." });
    }
  }
}
for (const key of productMap.keys()) pendingMap.delete(key);
for (const key of failureMap.keys()) pendingMap.delete(key);
const pending = [...pendingMap.values()];
if (products.length + failures.length === 0) throw new Error(`No ${site} records found in ${inputPath}`);

const outputPath = path.join(affiliateDir, "config", `breadth-draft-${site}-product-research.json`);
const output = {
  publicationStatus: "research",
  cohort: "breadth-draft-120-plus",
  recordedAt: new Date().toISOString(),
  source: payload.source ?? base.source,
  verificationPolicy: payload.verificationPolicy ?? base.verificationPolicy,
  note: "Research evidence only. A selected search anchor is not a qualified page until intent, title semantics, official sources, safety, availability, and duplicate checks all pass.",
  totals: {
    requestedFamilies: products.length + failures.length + pending.length,
    selected: products.length,
    failed: failures.length,
    pending: pending.length,
  },
  products,
  failures,
  pending,
};

fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({ outputPath, site, selected: products.length, failed: failures.length }));
