import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const affiliateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicAudit = process.env.CATEGORY_DISCOVERY_PUBLIC_AUDIT === "1";
const localOrigin = process.env.CATEGORY_DISCOVERY_ORIGIN;
const siteHosts = {
  network: "network.madabase.com",
  smarthome: "smarthome.madabase.com",
  homeoffice: "homeoffice.madabase.com",
  baby: "baby.madabase.com",
  pet: "pets.madabase.com",
  costume: "costumes.madabase.com",
};

if (!publicAudit && !localOrigin) {
  throw new Error("Set CATEGORY_DISCOVERY_ORIGIN for a local runtime, or CATEGORY_DISCOVERY_PUBLIC_AUDIT=1 for production.");
}

async function governedGuideRows() {
  const sourcePath = path.join(affiliateDir, "lib", "quadruple-expansion-content.ts");
  const briefPath = path.join(affiliateDir, "lib", "quadruple-family-editorial.ts");
  const communityPath = path.join(affiliateDir, "config", "quadruple-community-evidence.json");
  const source = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    fileName: sourcePath,
  }).outputText
    .replace(/^import communityEvidenceData[^;]+;\n/m, "")
    .replace(/^import \{ findFamilyEditorialBrief \}[^;]+;\n/m, "");
  const brief = ts.transpileModule(fs.readFileSync(briefPath, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    fileName: briefPath,
  }).outputText;
  const community = JSON.parse(fs.readFileSync(communityPath, "utf8"));
  const moduleSource = `${brief}\nconst communityEvidenceData = ${JSON.stringify(community)};\n${source}`;
  const expansion = await import(`data:text/javascript;base64,${Buffer.from(moduleSource).toString("base64")}`);
  return expansion.quadrupleExpansionGuides.map((guide) => ({
    site: guide.site,
    category: guide.category,
    role: guide.familyRole,
    url: `https://${siteHosts[guide.site]}/guides/${guide.slug}`,
  }));
}

async function fetchCategory(publicUrl) {
  const url = new URL(publicUrl);
  const target = publicAudit ? publicUrl : `${localOrigin}${url.pathname}`;
  let response;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    response = await fetch(target, {
      headers: publicAudit ? { "user-agent": "Madabase category discovery auditor/1.0" } : {
        host: url.host,
        "x-forwarded-host": url.host,
        "x-forwarded-proto": "https",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(30_000),
    });
    if (![502, 503, 504].includes(response.status) || attempt === 3) return { response, html: await response.text() };
    await response.body?.cancel();
    await new Promise((resolve) => setTimeout(resolve, attempt * 750));
  }
  return { response, html: await response.text() };
}

const rows = await governedGuideRows();
if (rows.length !== 757) throw new Error(`Expected 757 governed guide URLs; found ${rows.length}`);

const categories = new Map();
for (const row of rows) {
  const guideUrl = new URL(row.url);
  const categoryUrl = `https://${guideUrl.host}/categories/${row.category}`;
  const entry = categories.get(categoryUrl) ?? [];
  entry.push({ url: row.url, path: guideUrl.pathname, role: row.role });
  categories.set(categoryUrl, entry);
}

const sitemapLastmodByCategory = new Map();
for (const host of new Set([...categories.keys()].map((categoryUrl) => new URL(categoryUrl).host))) {
  const sitemapUrl = `https://${host}/sitemap.xml`;
  const { response, html } = await fetchCategory(sitemapUrl);
  if (response.status !== 200) throw new Error(`${sitemapUrl} returned HTTP ${response.status}`);
  for (const match of html.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>[\s\S]*?<\/url>/g)) {
    sitemapLastmodByCategory.set(match[1].replaceAll("&amp;", "&"), match[2]);
  }
}

const results = [];
let nextIndex = 0;
const entries = [...categories];
const requestedConcurrency = Number(process.env.CATEGORY_DISCOVERY_CONCURRENCY ?? (publicAudit ? 2 : 6));
const concurrency = Math.min(Math.max(1, requestedConcurrency), entries.length);

async function worker() {
  while (nextIndex < entries.length) {
    const [categoryUrl, guides] = entries[nextIndex++];
    const errors = [];
    try {
      const { response, html } = await fetchCategory(categoryUrl);
      const hrefs = new Set([...html.matchAll(/href=["']([^"']+)["']/gi)].map((match) => match[1].replaceAll("&amp;", "&")));
      const missing = guides.filter((guide) => !hrefs.has(guide.path));
      if (response.status !== 200) errors.push(`HTTP ${response.status}`);
      if (!html.includes('data-governed-discovery-links="true"')) errors.push("governed discovery section missing");
      if (missing.length) errors.push(`${missing.length} direct guide link(s) missing: ${missing.slice(0, 5).map((guide) => guide.path).join(", ")}`);
      if (!sitemapLastmodByCategory.get(categoryUrl)?.startsWith("2026-08-16")) {
        errors.push(`sitemap lastmod is not 2026-08-16 (${sitemapLastmodByCategory.get(categoryUrl) ?? "missing"})`);
      }
      results.push({ categoryUrl, expectedGuides: guides.length, directGuides: guides.length - missing.length, errors });
    } catch (error) {
      results.push({ categoryUrl, expectedGuides: guides.length, directGuides: 0, errors: [error instanceof Error ? error.message : String(error)] });
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
const failures = results.filter((result) => result.errors.length);
const report = {
  mode: publicAudit ? "public" : "local",
  categories: results.length,
  governedGuideUrls: rows.length,
  directLinksVerified: results.reduce((sum, result) => sum + result.directGuides, 0),
  passedCategories: results.length - failures.length,
  failedCategories: failures.length,
  failures,
};

console.log("Governed category discovery audit");
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
console.log("\nGoverned category discovery audit passed.");
