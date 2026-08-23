import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const control = JSON.parse(fs.readFileSync(path.join(root, "apps/affiliate/config/search-recovery-control.json"), "utf8"));
const readiness = JSON.parse(fs.readFileSync(path.join(root, "apps/affiliate/config/next-product-expansion-100-readiness.json"), "utf8"));
const ledgerText = fs.readFileSync(path.join(root, control.recoveryLedger.csv), "utf8").trim();
const lines = ledgerText.split(/\r?\n/);
const header = lines[0];
const errors = [];

if (control.freeze?.active !== true) errors.push("Search recovery publishing freeze must remain active");
if ((control.freeze?.sites ?? []).length !== 7) errors.push("Recovery freeze must cover all seven affiliate sites");
if (Object.keys(control.siteStates ?? {}).length !== 7) errors.push("Every affiliate site needs an explicit recovery state");
if (lines.length - 1 !== control.recoveryLedger.expectedRows) errors.push(`Recovery ledger has ${lines.length - 1} rows; expected ${control.recoveryLedger.expectedRows}`);
for (const column of ["cohort", "site", "siteState", "url", "decision", "immediateContentMutation", "earliestActionDate", "reason"]) {
  if (!header.split(",").includes(column)) errors.push(`Recovery ledger is missing ${column}`);
}
if (readiness.status !== "research-planning") errors.push("Next product expansion escaped research-planning state");
if (readiness.publicationPolicy?.sitemapExcluded !== true || readiness.publicationPolicy?.discoveryExcluded !== true) {
  errors.push("Next product expansion must remain excluded from sitemap and discovery");
}
if (readiness.currentCounts?.pagesReadyForSitemap !== 0) errors.push("No next-product pilot page may be sitemap-ready during recovery");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  status: control.status,
  freezeActive: control.freeze.active,
  frozenSites: control.freeze.sites.length,
  siteStates: control.siteStates,
  ledgerRows: lines.length - 1,
  nextProductExpansion: readiness.status,
  pagesReadyForSitemap: readiness.currentCounts.pagesReadyForSitemap,
}, null, 2));
