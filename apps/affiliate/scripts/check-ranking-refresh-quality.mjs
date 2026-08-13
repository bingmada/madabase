import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const workspaceDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceFiles = [
  path.join(workspaceDir, "lib", "search-opportunities.ts"),
  path.join(workspaceDir, "lib", "portfolio-ranking-opportunities.ts"),
];
const contentSources = fs
  .readdirSync(path.join(workspaceDir, "lib"))
  .filter((filename) => filename.endsWith(".ts") && !sourceFiles.some((sourceFile) => sourceFile.endsWith(filename)))
  .map((filename) => fs.readFileSync(path.join(workspaceDir, "lib", filename), "utf8"))
  .join("\n");
const quadrupleSource = fs.readFileSync(path.join(workspaceDir, "lib", "quadruple-expansion-content.ts"), "utf8");
const generatedFamilySlugs = new Set(
  [...quadrupleSource.matchAll(/\{ site: "[^"]+", slug: "([^"]+)", name:/g)].map((match) => match[1]),
);
const generatedRoleSuffixes = [
  "-buying-guide",
  "-vs-alternatives",
  "-compatibility-and-fit-guide",
  "-ownership-cost-and-maintenance",
  "-setup-and-daily-workflow",
  "-safety-and-skip-guide",
];

function contentHasSlug(slug) {
  if (contentSources.includes(`slug: "${slug}"`)) return true;
  return [...generatedFamilySlugs].some((familySlug) => generatedRoleSuffixes.some((suffix) => slug === `${familySlug}${suffix}`));
}
const errors = [];
const opportunities = [];

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node)) return node.text;
  return undefined;
}

function properties(node) {
  return new Map(
    node.properties
      .filter((property) => ts.isPropertyAssignment(property))
      .map((property) => [propertyName(property.name), property.initializer])
      .filter(([name]) => Boolean(name)),
  );
}

function stringValue(node) {
  if (!node) return undefined;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return undefined;
}

function stringArray(node) {
  if (!node || !ts.isArrayLiteralExpression(node)) return [];
  return node.elements.map(stringValue).filter(Boolean);
}

for (const filename of sourceFiles) {
  const sourceFile = ts.createSourceFile(
    filename,
    fs.readFileSync(filename, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const props = properties(node);
      const site = stringValue(props.get("site"));
      const kind = stringValue(props.get("kind"));
      const slug = stringValue(props.get("slug"));
      const query = stringValue(props.get("query"));
      const answer = stringValue(props.get("answer"));
      if (site && kind && slug && query && answer) {
        const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
        opportunities.push({
          site,
          kind,
          slug,
          query,
          answer,
          preferredPaths: stringArray(props.get("preferredPaths")),
          location: `${path.basename(filename)}:${position.line + 1}`,
        });
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

const validSites = new Set(["network", "smarthome", "homeoffice", "baby", "pet", "style", "costume"]);
const validKinds = new Set(["product", "guide", "roundup"]);
const targetKeys = new Set();
const normalizedQueries = new Set();

for (const opportunity of opportunities) {
  const targetKey = `${opportunity.site}:${opportunity.kind}:${opportunity.slug}`;
  const normalizedQuery = opportunity.query.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  if (!validSites.has(opportunity.site)) errors.push(`${opportunity.location}: invalid site ${opportunity.site}`);
  if (!validKinds.has(opportunity.kind)) errors.push(`${opportunity.location}: invalid kind ${opportunity.kind}`);
  if (targetKeys.has(targetKey)) errors.push(`${opportunity.location}: duplicate target ${targetKey}`);
  if (normalizedQueries.has(normalizedQuery)) errors.push(`${opportunity.location}: duplicate query ${opportunity.query}`);
  if (!opportunity.query.endsWith("?")) errors.push(`${opportunity.location}: query must be an explicit question`);
  if (opportunity.query.length < 35) errors.push(`${opportunity.location}: query is too generic (${opportunity.query.length} chars)`);
  if (opportunity.answer.length < 150) errors.push(`${opportunity.location}: answer is too thin (${opportunity.answer.length} chars)`);
  if (opportunity.preferredPaths.length < 2) errors.push(`${opportunity.location}: needs at least two intentional internal links`);
  if (new Set(opportunity.preferredPaths).size !== opportunity.preferredPaths.length) errors.push(`${opportunity.location}: duplicate preferred path`);
  if (!contentHasSlug(opportunity.slug)) errors.push(`${opportunity.location}: target slug is missing from the content registry`);
  opportunity.preferredPaths.forEach((preferredPath) => {
    const preferredSlug = preferredPath.split("/").filter(Boolean).at(-1);
    if (!preferredSlug || !contentHasSlug(preferredSlug)) {
      errors.push(`${opportunity.location}: preferred path is missing from the content registry: ${preferredPath}`);
    }
  });

  targetKeys.add(targetKey);
  normalizedQueries.add(normalizedQuery);
}

if (opportunities.length < 100) {
  errors.push(`Ranking refresh is too narrow: expected at least 100 individually authored pages, found ${opportunities.length}`);
}

const portfolioSource = fs.readFileSync(sourceFiles[1], "utf8");
const searchSource = fs.readFileSync(sourceFiles[0], "utf8");
if (!searchSource.includes("...portfolioRankingOpportunities")) errors.push("Portfolio ranking opportunities are not included in the public registry");
if (!searchSource.includes("searchOpportunityMetaDescription")) errors.push("Search-answer metadata helper is missing");
if (!portfolioSource.includes('portfolioRankingRefreshAt = "August 13, 2026"')) errors.push("Ranking refresh date is missing or stale");

if (errors.length) {
  console.error(`Ranking refresh quality check failed with ${errors.length} issue(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

const bySite = Object.fromEntries(
  [...validSites]
    .map((site) => [site, opportunities.filter((item) => item.site === site).length])
    .filter(([, count]) => count > 0),
);

console.log(`Ranking refresh quality check passed: ${opportunities.length} individually authored existing-page opportunities.`);
console.log(JSON.stringify(bySite));

const runtimeOrigin = process.env.RANKING_AUDIT_ORIGIN;
if (runtimeOrigin) {
  const publicAudit = process.env.RANKING_PUBLIC_AUDIT === "1";
  const hosts = {
    network: "network.madabase.com",
    smarthome: "smarthome.madabase.com",
    homeoffice: "homeoffice.madabase.com",
    baby: "baby.madabase.com",
    pet: "pets.madabase.com",
    style: "style.madabase.com",
    costume: "costumes.madabase.com",
  };
  const pathFor = (opportunity) => ({
    product: `/reviews/${opportunity.slug}`,
    guide: `/guides/${opportunity.slug}`,
    roundup: `/best/${opportunity.slug}`,
  })[opportunity.kind];
  const fetchPage = (publicUrl) => {
    if (publicAudit) return fetch(publicUrl);
    const url = new URL(publicUrl);
    return fetch(`${runtimeOrigin}${url.pathname}`, {
      headers: { host: url.host, "x-forwarded-host": url.host, "x-forwarded-proto": "https" },
    });
  };
  const decode = (value) => value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&#39;", "'")
    .replaceAll("&nbsp;", " ");
  const visibleText = (html) => decode(html)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const runtimeFailures = [];
  const sitemapUrls = new Map();

  for (const host of new Set(opportunities.map((item) => hosts[item.site]))) {
    const response = await fetchPage(`https://${host}/sitemap.xml`);
    const xml = await response.text();
    const entries = new Map(
      [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)]
        .map((match) => [decode(match[1]), match[2]]),
    );
    if (response.status !== 200) runtimeFailures.push(`${host}/sitemap.xml returned ${response.status}`);
    sitemapUrls.set(host, entries);
  }

  let nextIndex = 0;
  async function worker() {
    while (nextIndex < opportunities.length) {
      const opportunity = opportunities[nextIndex++];
      const host = hosts[opportunity.site];
      const publicUrl = `https://${host}${pathFor(opportunity)}`;
      const response = await fetchPage(publicUrl);
      const html = await response.text();
      const text = visibleText(html);
      const canonical = decode(
        html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i)?.[1]
          ?? html.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["']/i)?.[1]
          ?? "",
      );
      const metaDescription = decode(
        html.match(/<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']+)/i)?.[1]
          ?? html.match(/<meta\b[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i)?.[1]
          ?? "",
      );
      const pageErrors = [];

      if (response.status !== 200) pageErrors.push(`HTTP ${response.status}`);
      if (canonical !== publicUrl) pageErrors.push(`canonical ${canonical ?? "missing"}`);
      if (!text.includes(opportunity.query)) pageErrors.push("unique query not visible");
      if (!text.includes(opportunity.answer)) pageErrors.push("unique answer not visible");
      if (!metaDescription || !metaDescription.includes(opportunity.answer.slice(0, 60))) pageErrors.push("answer-led meta description missing");
      if (!text.includes("Continue this decision")) pageErrors.push("intentional link module missing");
      if (!text.includes("Page structure updated August 13, 2026")) pageErrors.push("ranking refresh date missing");
      if (/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) pageErrors.push("noindex present");
      if (!sitemapUrls.get(host)?.get(publicUrl)?.startsWith("2026-08-13")) pageErrors.push("sitemap lastmod is not 2026-08-13");
      if (pageErrors.length) runtimeFailures.push(`${publicUrl}: ${pageErrors.join(", ")}`);
    }
  }

  await Promise.all(Array.from({ length: 8 }, () => worker()));
  if (runtimeFailures.length) {
    console.error(`Ranking refresh runtime audit failed with ${runtimeFailures.length} issue(s):`);
    runtimeFailures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }
  console.log(`${publicAudit ? "Public" : "Local"} ranking refresh runtime audit passed: ${opportunities.length} pages.`);
}
