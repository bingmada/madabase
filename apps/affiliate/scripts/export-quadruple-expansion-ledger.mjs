import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const workspaceDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryDir = path.resolve(workspaceDir, "../..");
const sourcePath = path.join(workspaceDir, "lib/quadruple-expansion-content.ts");
const amazonProductPath = path.join(workspaceDir, "config/amazon-family-products.json");
const source = fs.readFileSync(sourcePath, "utf8");
const javascript = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  fileName: sourcePath,
}).outputText;
const expansion = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);
const amazonProducts = JSON.parse(fs.readFileSync(amazonProductPath, "utf8")).products ?? [];

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
const amazonProductByFamily = new Map(amazonProducts.map((product) => [`${product.site}:${product.familySlug}`, product]));
const rows = expansion.quadrupleExpansionGuides.map((guide) => {
  const family = familyBySlug.get(`${guide.site}:${guide.familySlug}`);
  if (!family) throw new Error(`Missing family for ${guide.site}:${guide.slug}`);
  const amazonProduct = amazonProductByFamily.get(`${guide.site}:${guide.familySlug}`);
  if (guide.site !== "costume" && !amazonProduct) throw new Error(`Missing Amazon product for ${guide.site}:${guide.familySlug}`);
  return {
    site: guide.site,
    family: guide.familySlug,
    familyName: family.name,
    category: guide.category,
    role: guide.familyRole,
    title: guide.title,
    url: `${domains[guide.site]}/guides/${guide.slug}`,
    indexable: "yes",
    merchantSource: guide.site === "costume" ? "Costume PostgreSQL/CJ catalog" : "Amazon US",
    merchantStatus: guide.site === "costume" ? "CTA requires active verified database offer" : "exact listing verified",
    asin: amazonProduct?.asin ?? "",
    productTitle: amazonProduct?.title ?? "database product selected at request time",
    productVerifiedAt: amazonProduct?.verifiedAt ?? "database availability checked at request time",
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
  "This ledger is the exact editorial cohort for the owner-approved product-family expansion. Network, Smart Home, Home Office, Baby, and Pet use one independently verified Amazon US listing anchor per new family. Costume resolves active CJ products from PostgreSQL and does not use the Amazon registry.",
  "",
  "| Site | New product families | New guide URLs |",
  "| --- | ---: | ---: |",
  ...Object.keys(domains).map((site) => `| ${site} | ${familyCounts[site]} | ${counts[site]} |`),
  `| Total | ${Object.values(familyCounts).reduce((sum, value) => sum + value, 0)} | ${rows.length} |`,
  "",
  `Verified Amazon family anchors: ${amazonProducts.length}.`,
  "",
  "The exact URL-level ledger is stored in `docs/affiliate-quadruple-expansion-ledger-2026-08-09.csv`.",
  "",
  "Costume database products are a separate additive production cohort. Its working catalog may grow only by one 1,000-product step per sync; only products that pass exact link, image authorization, availability, identity, and editorial checks become indexable.",
  "",
].join("\n");

fs.writeFileSync(path.join(repositoryDir, "docs/affiliate-quadruple-expansion-ledger-2026-08-09.csv"), csvBody);
fs.writeFileSync(path.join(repositoryDir, "docs/affiliate-quadruple-expansion-ledger-2026-08-09.md"), markdown);
console.log(JSON.stringify({ ok: true, families: Object.values(familyCounts).reduce((sum, value) => sum + value, 0), urls: rows.length, counts }));
