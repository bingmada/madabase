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
  const comparisonFirstPath = path.join(affiliateDir, "config", "comparison-first-cohort-2026-09-04.json");
  const deepRankRecoveryPath = path.join(affiliateDir, "config", "deep-rank-recovery-2026-08-27.json");
  const consolidationPath = path.join(affiliateDir, "config", "search-recovery-consolidations-2026-08-23.json");
  const day30ConsolidationPath = path.join(affiliateDir, "config", "search-recovery-consolidations-2026-09-08.json");
  const deferredConsolidationPath = path.join(affiliateDir, "config", "deferred-family-consolidations-2026-09-11.json");
  const pageOneCtrPath = path.join(affiliateDir, "config", "page-one-ctr-cohort-2026-09-11.json");
  const source = ts.transpileModule(fs.readFileSync(sourcePath, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    fileName: sourcePath,
  }).outputText
    .replace(/^import communityEvidenceData[^;]+;\n/m, "")
    .replace(/^import comparisonFirstData[^;]+;\n/m, "")
    .replace(/^import deepRankRecoveryData[^;]+;\n/m, "")
    .replace(/^import \{ findFamilyEditorialBrief \}[^;]+;\n/m, "");
  const brief = ts.transpileModule(fs.readFileSync(briefPath, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    fileName: briefPath,
  }).outputText;
  const community = JSON.parse(fs.readFileSync(communityPath, "utf8"));
  const comparisonFirst = JSON.parse(fs.readFileSync(comparisonFirstPath, "utf8"));
  const deepRankRecovery = JSON.parse(fs.readFileSync(deepRankRecoveryPath, "utf8"));
  const consolidation = JSON.parse(fs.readFileSync(consolidationPath, "utf8"));
  const day30Consolidation = JSON.parse(fs.readFileSync(day30ConsolidationPath, "utf8"));
  const deferredConsolidation = JSON.parse(fs.readFileSync(deferredConsolidationPath, "utf8"));
  const pageOneCtr = JSON.parse(fs.readFileSync(pageOneCtrPath, "utf8"));
  const pageOneCtrCategories = new Set(pageOneCtr.targets.map((item) => `${item.site}:${item.category}`));
  const consolidatedFamilyTargets = new Map([
    ...consolidation.families.map((item) => [`${item.site}:${item.familySlug}`, "buying"]),
    ...day30Consolidation.families.map((item) => [`${item.site}:${item.familySlug}`, item.targetRole]),
    ...deferredConsolidation.families.map((item) => [`${item.site}:${item.familySlug}`, item.targetRole]),
  ]);
  const moduleSource = `${brief}\nconst communityEvidenceData = ${JSON.stringify(community)};\nconst comparisonFirstData = ${JSON.stringify(comparisonFirst)};\nconst deepRankRecoveryData = ${JSON.stringify(deepRankRecovery)};\n${source}`;
  const expansion = await import(`data:text/javascript;base64,${Buffer.from(moduleSource).toString("base64")}`);
  return expansion.quadrupleExpansionGuides.map((guide) => {
    const familyKey = `${guide.site}:${guide.familySlug}`;
    const targetRole = consolidatedFamilyTargets.get(familyKey);
    return {
      site: guide.site,
      category: guide.category,
      family: guide.familySlug,
      role: guide.familyRole,
      hub: targetRole ? guide.familyRole === targetRole : guide.familyRole === "buying",
      consolidated: Boolean(targetRole),
      day30Consolidated: day30Consolidation.families.some((item) => `${item.site}:${item.familySlug}` === familyKey),
      deferredConsolidated: deferredConsolidation.families.some((item) => `${item.site}:${item.familySlug}` === familyKey),
      pageOneCtrCategory: pageOneCtrCategories.has(`${guide.site}:${guide.category}`),
      url: `https://${siteHosts[guide.site]}/guides/${guide.slug}`,
    };
  });
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
    entry.push({ url: row.url, path: guideUrl.pathname, family: row.family, role: row.role, hub: row.hub, consolidated: row.consolidated, day30Consolidated: row.day30Consolidated, deferredConsolidated: row.deferredConsolidated, pageOneCtrCategory: row.pageOneCtrCategory });
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
      const hubs = guides.filter((guide) => guide.hub);
      const supportingGuides = guides.filter((guide) => !guide.hub && !guide.consolidated);
      const missingHubs = hubs.filter((guide) => !hrefs.has(guide.path));
      let missingSupportLinks = 0;
      if (response.status !== 200) errors.push(`HTTP ${response.status}`);
      if (!html.includes('data-governed-discovery-links="family-hubs"')) errors.push("family-hub discovery section missing");
      if (missingHubs.length) errors.push(`${missingHubs.length} primary family hub link(s) missing: ${missingHubs.slice(0, 5).map((guide) => guide.path).join(", ")}`);
      const expectedCategoryLastmod = guides.some((guide) => guide.deferredConsolidated || guide.pageOneCtrCategory)
        ? "2026-09-11"
        : guides.some((guide) => guide.day30Consolidated)
          ? "2026-09-08"
          : "2026-08-23";
      if (!sitemapLastmodByCategory.get(categoryUrl)?.startsWith(expectedCategoryLastmod)) {
        errors.push(`sitemap lastmod is not ${expectedCategoryLastmod} (${sitemapLastmodByCategory.get(categoryUrl) ?? "missing"})`);
      }

      for (const hub of hubs) {
        const familySupport = supportingGuides.filter((guide) => guide.family === hub.family);
        const { response: hubResponse, html: hubHtml } = await fetchCategory(hub.url);
        const hubHrefs = new Set([...hubHtml.matchAll(/href=["']([^"']+)["']/gi)].map((match) => match[1].replaceAll("&amp;", "&")));
        const missing = familySupport.filter((guide) => !hubHrefs.has(guide.path));
        missingSupportLinks += missing.length;
        if (hubResponse.status !== 200) errors.push(`${hub.path} returned HTTP ${hubResponse.status}`);
        if (hub.consolidated) {
          if (!hubHtml.includes('data-consolidated-family-hub="true"')) errors.push(`${hub.path} consolidated family hub missing`);
        } else if (!hubHtml.includes('data-family-topic-cluster="true"')) errors.push(`${hub.path} family topic cluster missing`);
        if (missing.length) errors.push(`${hub.path} is missing ${missing.length} supporting link(s): ${missing.slice(0, 3).map((guide) => guide.path).join(", ")}`);
      }

      results.push({
        categoryUrl,
        expectedGuides: guides.length,
        directFamilyHubs: hubs.length - missingHubs.length,
        expectedFamilyHubs: hubs.length,
        supportLinksVerified: supportingGuides.length - missingSupportLinks,
        expectedSupportLinks: supportingGuides.length,
        errors,
      });
    } catch (error) {
      results.push({ categoryUrl, expectedGuides: guides.length, directFamilyHubs: 0, supportLinksVerified: 0, errors: [error instanceof Error ? error.message : String(error)] });
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
const failures = results.filter((result) => result.errors.length);
const report = {
  mode: publicAudit ? "public" : "local",
  categories: results.length,
  governedGuideUrls: rows.length,
  directFamilyHubsVerified: results.reduce((sum, result) => sum + result.directFamilyHubs, 0),
  supportLinksVerified: results.reduce((sum, result) => sum + result.supportLinksVerified, 0),
  passedCategories: results.length - failures.length,
  failedCategories: failures.length,
  failures,
};

console.log("Governed category discovery audit");
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
console.log("\nGoverned category discovery audit passed.");
