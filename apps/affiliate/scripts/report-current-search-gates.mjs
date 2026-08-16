import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const affiliateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryDir = path.resolve(affiliateDir, "../..");
const docsDir = path.join(repositoryDir, "docs");
const argumentsByName = new Map(
  process.argv.slice(2).map((argument) => {
    const [name, ...value] = argument.replace(/^--/, "").split("=");
    return [name, value.join("=")];
  }),
);
const inputPath = argumentsByName.get("input");
const windowStart = argumentsByName.get("window-start") ?? "2026-08-07";
const windowEnd = argumentsByName.get("window-end") ?? "2026-08-13";
const reportDate = argumentsByName.get("report-date") ?? "2026-08-16";
const summaryOnly = argumentsByName.get("summary-only") === "1";
const compareInputPath = argumentsByName.get("compare-input");

if (!inputPath) {
  throw new Error("Pass --input=/absolute/path/to/gsc-pages.json");
}

const siteHosts = {
  network: "network.madabase.com",
  smarthome: "smarthome.madabase.com",
  homeoffice: "homeoffice.madabase.com",
  baby: "baby.madabase.com",
  pet: "pets.madabase.com",
  style: "style.madabase.com",
  costume: "costumes.madabase.com",
};
const pathPrefixes = { product: "reviews", guide: "guides", roundup: "best" };

function csv(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

async function governedExpansionUrls() {
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
    family: guide.familySlug,
    role: guide.familyRole,
    title: guide.title,
    url: `https://${siteHosts[guide.site]}/guides/${guide.slug}`,
  }));
}

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node)) return node.text;
  return undefined;
}

function stringValue(node) {
  if (!node) return undefined;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return undefined;
}

function rankingRefreshUrls() {
  const sourceFiles = [
    path.join(affiliateDir, "lib", "search-opportunities.ts"),
    path.join(affiliateDir, "lib", "portfolio-ranking-opportunities.ts"),
  ];
  const opportunities = [];
  for (const filename of sourceFiles) {
    const sourceFile = ts.createSourceFile(filename, fs.readFileSync(filename, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
    function visit(node) {
      if (ts.isObjectLiteralExpression(node)) {
        const properties = new Map(
          node.properties
            .filter((property) => ts.isPropertyAssignment(property))
            .map((property) => [propertyName(property.name), property.initializer])
            .filter(([name]) => Boolean(name)),
        );
        const site = stringValue(properties.get("site"));
        const kind = stringValue(properties.get("kind"));
        const slug = stringValue(properties.get("slug"));
        const query = stringValue(properties.get("query"));
        const answer = stringValue(properties.get("answer"));
        if (site && kind && slug && query && answer && siteHosts[site] && pathPrefixes[kind]) {
          opportunities.push({
            site,
            kind,
            slug,
            query,
            url: `https://${siteHosts[site]}/${pathPrefixes[kind]}/${slug}`,
          });
        }
      }
      ts.forEachChild(node, visit);
    }
    visit(sourceFile);
  }
  return opportunities.filter(
    (item, index) => opportunities.findIndex((candidate) => candidate.url === item.url) === index,
  );
}

function breadthSoftLaunchUrls() {
  const filenames = ["network", "smarthome", "homeoffice", "baby", "pet"]
    .map((site) => path.join(affiliateDir, "config", `breadth-draft-${site}-product-research.json`));
  return filenames.flatMap((filename) => {
    const products = JSON.parse(fs.readFileSync(filename, "utf8")).products ?? [];
    return products.map((product) => ({
      site: product.site,
      kind: "guide",
      slug: `${product.familySlug}-buying-guide`,
      family: product.familySlug,
      title: product.title,
      url: `https://${siteHosts[product.site]}/guides/${product.familySlug}-buying-guide`,
    }));
  });
}

function metricSummary(rows) {
  const exposed = rows.filter((row) => row.impressions > 0);
  const clicks = rows.reduce((sum, row) => sum + row.clicks, 0);
  const impressions = rows.reduce((sum, row) => sum + row.impressions, 0);
  const weightedPosition = impressions
    ? exposed.reduce((sum, row) => sum + row.position * row.impressions, 0) / impressions
    : null;
  return {
    urls: rows.length,
    exposed: exposed.length,
    zeroImpression: rows.length - exposed.length,
    clicks,
    impressions,
    ctr: impressions ? clicks / impressions : 0,
    weightedPosition,
  };
}

function nextAction(cohort, metric) {
  if (cohort === "soft151") {
    if (!metric) return "Hold in indexable, internally linked, sitemap-excluded Day-3 observation; review at the August 20 Day-7 gate.";
    return "Preserve the early query signal and remain sitemap-excluded; inspect the exact query at the August 20 Day-7 gate.";
  }
  if (!metric && cohort === "ranking118") {
    return "Run live Google URL Inspection; preserve the August 13 answer and title while verifying its existing category and reciprocal links. Do not rewrite without query evidence.";
  }
  if (!metric) return "Run live Google URL Inspection and add a direct category discovery link; do not invent a title without query evidence.";
  if (metric.clicks > 0) return "Protect the click-bearing intent and avoid title churn; verify conversion and strengthen only relevant supporting links.";
  if (metric.position <= 10) return "Page-one zero-click: hold the title until enough impressions accumulate; verify the visible answer and snippet alignment.";
  if (metric.position <= 20) return "Page-two push: preserve query intent and strengthen direct category plus sibling discovery links.";
  if (metric.position <= 40) return "Mid-pack: improve crawl discovery and evidence-backed internal links before considering a rewrite.";
  return "Deep exposure: keep indexability healthy, improve discovery, and wait for query-level evidence before retargeting.";
}

function enrich(items, cohort, metrics) {
  return items.map((item) => {
    const metric = metrics.get(item.url);
    return {
      cohort,
      ...item,
      clicks: metric?.clicks ?? 0,
      impressions: metric?.impressions ?? 0,
      ctr: metric?.ctr ?? "0%",
      position: metric?.position ?? "",
      exposureStatus: metric ? "exposed" : "zero-impression",
      nextAction: nextAction(cohort, metric),
    };
  });
}

function writeCsv(filename, rows) {
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const body = [headers.join(","), ...rows.map((row) => headers.map((header) => csv(row[header])).join(",")), ""].join("\n");
  fs.writeFileSync(path.join(docsDir, filename), body);
}

function groupSummary(rows, field) {
  return Object.fromEntries(
    [...new Set(rows.map((row) => row[field] ?? "unknown"))]
      .sort()
      .map((value) => [value, metricSummary(rows.filter((row) => (row[field] ?? "unknown") === value))]),
  );
}

function comparisonSummary(items, comparisonByUrl) {
  const rows = items.map((item) => comparisonByUrl.get(item.url)).filter(Boolean);
  const summarize = (period) => {
    const impressionsKey = `${period}Impressions`;
    const clicksKey = `${period}Clicks`;
    const positionKey = `${period}Position`;
    const impressions = rows.reduce((sum, row) => sum + row[impressionsKey], 0);
    const clicks = rows.reduce((sum, row) => sum + row[clicksKey], 0);
    return {
      exposed: rows.filter((row) => row[impressionsKey] > 0).length,
      clicks,
      impressions,
      ctr: impressions ? clicks / impressions : 0,
      weightedPosition: impressions
        ? rows.reduce((sum, row) => sum + row[positionKey] * row[impressionsKey], 0) / impressions
        : null,
    };
  };
  return { current24h: summarize("current"), previous24h: summarize("previous") };
}

const gscRows = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const metrics = new Map(gscRows.map((row) => [row.url.replace(/\/$/, ""), row]));
const expansionRows = await governedExpansionUrls();
const rankingRows = rankingRefreshUrls();
const softRows = breadthSoftLaunchUrls();

if (expansionRows.length !== 757) throw new Error(`Expected 757 expansion URLs; found ${expansionRows.length}`);
if (rankingRows.length !== 118) throw new Error(`Expected 118 ranking-refresh URLs; found ${rankingRows.length}`);
if (softRows.length !== 151) throw new Error(`Expected 151 soft-launch URLs; found ${softRows.length}`);

const expansion = enrich(expansionRows, "expansion757", metrics);
const ranking = enrich(rankingRows, "ranking118", metrics);
const soft = enrich(softRows, "soft151", metrics);
const titleExperimentUrls = new Set([
  "https://smarthome.madabase.com/guides/tapo-p110m-home-assistant-energy-monitoring",
  "https://homeoffice.madabase.com/reviews/caldigit-ts4-thunderbolt-dock",
  "https://pets.madabase.com/reviews/furbo-360-dog-camera",
]);
const titleExperiment = ranking.filter((row) => titleExperimentUrls.has(row.url));
const report = {
  reportDate,
  source: {
    property: "sc-domain:madabase.com",
    searchType: "Web",
    windowStart,
    windowEnd,
    pageRows: gscRows.length,
  },
  cohorts: {
    expansion757: {
      summary: metricSummary(expansion),
      bySite: groupSummary(expansion, "site"),
      byRole: groupSummary(expansion, "role"),
    },
    ranking118: {
      summary: metricSummary(ranking),
      bySite: groupSummary(ranking, "site"),
    },
    titleExperiment3: { summary: metricSummary(titleExperiment), rows: titleExperiment },
    soft151: {
      summary: metricSummary(soft),
      bySite: groupSummary(soft, "site"),
    },
  },
};

if (compareInputPath) {
  const comparisonRows = JSON.parse(fs.readFileSync(compareInputPath, "utf8"));
  const comparisonByUrl = new Map(comparisonRows.map((row) => [row.url.replace(/\/$/, ""), row]));
  report.previous24hComparison = {
    allPropertyPages: comparisonSummary(comparisonRows, comparisonByUrl),
    expansion757: comparisonSummary(expansion, comparisonByUrl),
    ranking118: comparisonSummary(ranking, comparisonByUrl),
    titleExperiment3: comparisonSummary(titleExperiment, comparisonByUrl),
    soft151: comparisonSummary(soft, comparisonByUrl),
  };
  fs.writeFileSync(
    path.join(docsDir, `affiliate-gsc-pages-compare-24h-${reportDate}.json`),
    `${JSON.stringify(comparisonRows, null, 2)}\n`,
  );
}

fs.writeFileSync(
  path.join(docsDir, `affiliate-gsc-pages-${windowStart}-to-${windowEnd}.json`),
  `${JSON.stringify(gscRows, null, 2)}\n`,
);
fs.writeFileSync(
  path.join(docsDir, `affiliate-current-search-gates-${reportDate}.json`),
  `${JSON.stringify(report, null, 2)}\n`,
);
if (!summaryOnly) {
  writeCsv(`affiliate-expansion757-search-gate-${reportDate}.csv`, expansion);
  writeCsv(`affiliate-ranking118-search-gate-${reportDate}.csv`, ranking);
  writeCsv(`affiliate-soft151-search-gate-${reportDate}.csv`, soft);
}

console.log(JSON.stringify(report, null, 2));
