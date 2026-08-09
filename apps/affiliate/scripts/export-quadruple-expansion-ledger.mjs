import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const workspaceDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryDir = path.resolve(workspaceDir, "../..");
const sourcePath = path.join(workspaceDir, "lib/quadruple-expansion-content.ts");
const source = fs.readFileSync(sourcePath, "utf8");
const javascript = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  fileName: sourcePath,
}).outputText;
const expansion = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);

const domains = {
  network: "https://network.madabase.com",
  smarthome: "https://smarthome.madabase.com",
  homeoffice: "https://homeoffice.madabase.com",
  baby: "https://baby.madabase.com",
  pet: "https://pets.madabase.com",
  costume: "https://costumes.madabase.com",
};

function csv(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const familyBySlug = new Map(expansion.quadrupleExpansionFamilies.map((family) => [`${family.site}:${family.slug}`, family]));
const rows = expansion.quadrupleExpansionGuides.map((guide) => {
  const family = familyBySlug.get(`${guide.site}:${guide.familySlug}`);
  if (!family) throw new Error(`Missing family for ${guide.site}:${guide.slug}`);
  return {
    site: guide.site,
    family: guide.familySlug,
    familyName: family.name,
    category: guide.category,
    role: guide.familyRole,
    title: guide.title,
    url: `${domains[guide.site]}/guides/${guide.slug}`,
    indexable: "yes",
    merchantStatus: "editorial-only; no unverified retailer CTA",
    releaseCohort: "portfolio-quadruple-expansion-2026-08-09",
  };
}).sort((left, right) => left.site.localeCompare(right.site) || left.family.localeCompare(right.family) || left.role.localeCompare(right.role));

const headers = Object.keys(rows[0]);
const csvBody = [headers.join(","), ...rows.map((row) => headers.map((header) => csv(row[header])).join(",")), ""].join("\n");
const counts = Object.fromEntries(Object.keys(domains).map((site) => [site, rows.filter((row) => row.site === site).length]));
const familyCounts = Object.fromEntries(Object.keys(domains).map((site) => [site, new Set(rows.filter((row) => row.site === site).map((row) => row.family)).size]));
const markdown = [
  "# Affiliate quadruple-expansion URL ledger",
  "",
  "Generated: 2026-08-09",
  "",
  "This ledger is the exact static editorial cohort for the owner-approved product-family expansion. These pages do not add a retailer CTA unless an exact authorized product, variant, destination, and attribution path are separately verified.",
  "",
  "| Site | New product families | New guide URLs |",
  "| --- | ---: | ---: |",
  ...Object.keys(domains).map((site) => `| ${site} | ${familyCounts[site]} | ${counts[site]} |`),
  `| Total | ${Object.values(familyCounts).reduce((sum, value) => sum + value, 0)} | ${rows.length} |`,
  "",
  "The exact URL-level ledger is stored in `docs/affiliate-quadruple-expansion-ledger-2026-08-09.csv`.",
  "",
  "Costume database products are a separate additive production cohort. Its working catalog may grow only by one 1,000-product step per sync; only products that pass exact link, image authorization, availability, identity, and editorial checks become indexable.",
  "",
].join("\n");

fs.writeFileSync(path.join(repositoryDir, "docs/affiliate-quadruple-expansion-ledger-2026-08-09.csv"), csvBody);
fs.writeFileSync(path.join(repositoryDir, "docs/affiliate-quadruple-expansion-ledger-2026-08-09.md"), markdown);
console.log(JSON.stringify({ ok: true, families: Object.values(familyCounts).reduce((sum, value) => sum + value, 0), urls: rows.length, counts }));

