import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const workspaceDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const libDir = path.join(workspaceDir, "lib");
const args = process.argv.slice(2);
const valueFor = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};

const gscPath = valueFor("--gsc");
const queryPath = valueFor("--queries");
const reportPath = path.resolve(workspaceDir, valueFor("--report") ?? "../../docs/affiliate-search-portfolio.md");
const csvPath = path.resolve(workspaceDir, valueFor("--csv") ?? "../../docs/affiliate-search-portfolio.csv");
const reportDate = valueFor("--date") ?? new Date().toISOString().slice(0, 10);

if (!gscPath) {
  console.error("Usage: node scripts/report-search-portfolio.mjs --gsc /path/to/Pages.csv [--queries /path/to/Queries.csv]");
  process.exit(1);
}

const siteHosts = {
  pet: "pets.madabase.com",
  homeoffice: "homeoffice.madabase.com",
  baby: "baby.madabase.com",
  network: "network.madabase.com",
  smarthome: "smarthome.madabase.com",
  style: "style.madabase.com",
};
const productFactoryNames = new Set(["catalogProduct", "expandedProduct"]);
const entries = [];

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function csvRecords(filename) {
  const [headers, ...rows] = parseCsv(fs.readFileSync(filename, "utf8").replace(/^\uFEFF/, ""));
  return rows.map((row) => Object.fromEntries(headers.map((header, index) => [header.trim(), (row[index] ?? "").trim()])));
}

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node)) return node.text;
  return undefined;
}

function properties(node) {
  return new Map(
    node.properties
      .filter(ts.isPropertyAssignment)
      .map((property) => [propertyName(property.name), property.initializer])
      .filter(([name]) => Boolean(name)),
  );
}

function sourceConstants(sourceFile) {
  const constants = new Map();
  sourceFile.statements.forEach((statement) => {
    if (!ts.isVariableStatement(statement)) return;
    statement.declarationList.declarations.forEach((declaration) => {
      if (ts.isIdentifier(declaration.name) && declaration.initializer && (ts.isStringLiteral(declaration.initializer) || ts.isNoSubstitutionTemplateLiteral(declaration.initializer))) {
        constants.set(declaration.name.text, declaration.initializer.text);
      }
    });
  });
  return constants;
}

function stringValue(node, constants) {
  if (!node) return undefined;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isIdentifier(node)) {
    if (node.text === "draft") return "draft";
    return constants.get(node.text);
  }
  return undefined;
}

function arrayLength(node) {
  return node && ts.isArrayLiteralExpression(node) ? node.elements.length : 0;
}

function stringArray(node, constants) {
  if (!node || !ts.isArrayLiteralExpression(node)) return [];
  return node.elements.map((item) => stringValue(item, constants)).filter(Boolean);
}

function entryKind(props) {
  if (props.has("priceBand") && props.has("offers")) return "product";
  if (props.has("productSlugs") && props.has("faqs")) return "roundup";
  if (props.has("relatedRoundups") && props.has("sections")) return "guide";
  if (props.has("kind") && props.has("relatedRoundups")) return "tool";
  return undefined;
}

function defaultProductTitle(site, name) {
  const suffix = {
    pet: "Review: Fit, Cleaning & Buying Guide",
    homeoffice: "Review: Fit, Specs & Buying Guide",
    baby: "Review: Age, Fit & Buying Guide",
    network: "Review: Specs, Setup & Buying Guide",
    smarthome: "Review: Compatibility & Buying Guide",
    style: "Review: Size, Materials & Fit",
  }[site];
  const detailedTitle = `${name} ${suffix}`;
  if (detailedTitle.length <= 72) return detailedTitle;

  const compactTitle = `${name} Review & Buying Guide`;
  return compactTitle.length <= 72 ? compactTitle : `${name} Review`;
}

function addEntry(sourceFile, constants, node, kind, factoryName) {
  const props = properties(node);
  const site = stringValue(props.get("site"), constants);
  const slug = stringValue(props.get("slug"), constants);
  if (!site || !slug || !kind) return;

  const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  const pathPrefix = { product: "/reviews", roundup: "/best", guide: "/guides", tool: "/tools" }[kind];
  const explicitSeoTitle = stringValue(props.get("seoTitle"), constants);
  const baseTitle = stringValue(props.get("title"), constants) ?? stringValue(props.get("name"), constants);
  const relatedProducts = stringArray(props.get("relatedProducts"), constants);
  const productSlugs = stringArray(props.get("productSlugs"), constants);
  const relatedRoundups = stringArray(props.get("relatedRoundups"), constants);
  const relatedGuides = stringArray(props.get("relatedGuides"), constants);

  entries.push({
    site,
    slug,
    kind,
    path: `${pathPrefix}/${slug}`,
    url: `https://${siteHosts[site]}${pathPrefix}/${slug}`,
    title: explicitSeoTitle ?? (kind === "product" && baseTitle ? defaultProductTitle(site, baseTitle) : baseTitle),
    description: stringValue(props.get("summary"), constants) ?? stringValue(props.get("dek"), constants),
    status: stringValue(props.get("publicationStatus"), constants) ?? "published",
    updatedAt: stringValue(props.get("updatedAt"), constants) ?? (factoryName ? constants.get("updatedAt") : undefined),
    evidenceMode: stringValue(props.get("evidenceMode"), constants),
    sourceCount: arrayLength(props.get("sources")),
    sectionCount: arrayLength(props.get("sections")) + arrayLength(props.get("editorialSections")),
    faqCount: arrayLength(props.get("faqs")),
    internalLinkCount: new Set([...relatedProducts, ...productSlugs, ...relatedRoundups, ...relatedGuides]).size,
    factoryName,
    location: `${path.basename(sourceFile.fileName)}:${position.line + 1}`,
  });
}

function visit(sourceFile, constants, node) {
  if (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    productFactoryNames.has(node.expression.text) &&
    ts.isObjectLiteralExpression(node.arguments[0])
  ) {
    addEntry(sourceFile, constants, node.arguments[0], "product", node.expression.text);
  }

  if (ts.isObjectLiteralExpression(node)) {
    const kind = entryKind(properties(node));
    if (kind) addEntry(sourceFile, constants, node, kind);
  }
  ts.forEachChild(node, (child) => visit(sourceFile, constants, child));
}

for (const filename of fs.readdirSync(libDir).filter((name) => name.endsWith(".ts"))) {
  const filePath = path.join(libDir, filename);
  const sourceFile = ts.createSourceFile(filePath, fs.readFileSync(filePath, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  visit(sourceFile, sourceConstants(sourceFile), sourceFile);
}

function normalizedUrl(value) {
  try {
    const url = new URL(value);
    url.hash = "";
    url.search = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return value.replace(/\/$/, "");
  }
}

const gscRecords = csvRecords(path.resolve(gscPath)).map((record) => ({
  url: normalizedUrl(record["Top pages"] ?? record.Page ?? record.Pages ?? ""),
  clicks: Number(record.Clicks || 0),
  impressions: Number(record.Impressions || 0),
  ctr: Number((record.CTR || "0").replace("%", "")),
  position: Number(record.Position || 0),
}));
const gscByUrl = new Map(gscRecords.map((record) => [record.url, record]));
const queryRecords = queryPath ? csvRecords(path.resolve(queryPath)) : [];
const domainStats = Object.values(gscRecords.reduce((result, record) => {
  const host = new URL(record.url).hostname;
  const current = result[host] ?? { host, urls: 0, clicks: 0, impressions: 0, weightedPosition: 0 };
  current.urls += 1;
  current.clicks += record.clicks;
  current.impressions += record.impressions;
  current.weightedPosition += record.position * record.impressions;
  result[host] = current;
  return result;
}, {})).sort((left, right) => right.impressions - left.impressions);

function daysSince(value) {
  if (!value) return undefined;
  const timestamp = Date.parse(value);
  const current = Date.parse(`${reportDate}T00:00:00Z`);
  if (!Number.isFinite(timestamp) || !Number.isFinite(current)) return undefined;
  return Math.max(0, Math.floor((current - timestamp) / 86_400_000));
}

function performanceBand(metrics, age) {
  if (!metrics) return age !== undefined && age <= 7 ? "new-observation" : "zero-impression";
  if (metrics.position <= 10 && metrics.clicks > 0) return "protect-and-convert";
  if (metrics.position <= 10) return "page-one-zero-click";
  if (metrics.position <= 20) return "page-two-push";
  if (metrics.position <= 40) return "mid-pack-rebuild";
  if (metrics.position <= 60) return "low-rank-retarget";
  return "deep-rank-rebuild-or-merge";
}

function primaryAction(band) {
  const actions = {
    "protect-and-convert": "Preserve the query target; improve the first-screen decision, CTA, and supporting internal links.",
    "page-one-zero-click": "Rewrite title and description around the exact buying objection; keep the body intent stable and test CTR.",
    "page-two-push": "Add the missing query answer, comparison evidence, and 3-5 contextual internal links from stronger pages.",
    "mid-pack-rebuild": "Realign title, H1, intro, and section coverage to one primary query; add one supporting page only if intent is distinct.",
    "low-rank-retarget": "Revalidate the SERP and primary keyword; rewrite the page around the dominant intent or consolidate cannibalizing pages.",
    "deep-rank-rebuild-or-merge": "Treat the current keyword as unproven: rebuild for a narrower intent, merge into a stronger canonical, or retire from the sitemap.",
    "new-observation": "Confirm indexing, canonical, sitemap discovery, and internal links; hold the keyword stable through the day-7 gate.",
    "zero-impression": "Inspect index status, canonical, age, duplication, and keyword demand; then retarget, merge, or keep only when the page has a distinct job.",
  };
  return actions[band];
}

function localGaps(entry) {
  const gaps = [];
  if (!entry.title || entry.title.length < 28) gaps.push("weak-title");
  if (entry.title?.length > 72) gaps.push("long-title");
  if (!entry.description || entry.description.length < 80) gaps.push("thin-summary");
  if (!entry.updatedAt) gaps.push("missing-update-date");
  if (entry.kind === "product" && !entry.factoryName && entry.sourceCount === 0) gaps.push("no-source-link");
  if (entry.kind === "product" && !entry.factoryName && !entry.evidenceMode) gaps.push("implicit-evidence-mode");
  if (entry.kind === "roundup" && entry.internalLinkCount < 3) gaps.push("small-product-set");
  if (entry.kind === "guide" && entry.internalLinkCount < 3) gaps.push("underlinked-guide");
  return gaps;
}

const portfolio = entries
  .filter((entry) => entry.status === "published")
  .map((entry) => {
    const metrics = gscByUrl.get(normalizedUrl(entry.url));
    const age = daysSince(entry.updatedAt);
    const band = performanceBand(metrics, age);
    return {
      ...entry,
      age,
      metrics,
      band,
      action: primaryAction(band),
      gaps: localGaps(entry),
    };
  })
  .sort((left, right) => {
    const rank = {
      "page-one-zero-click": 0,
      "page-two-push": 1,
      "mid-pack-rebuild": 2,
      "low-rank-retarget": 3,
      "deep-rank-rebuild-or-merge": 4,
      "zero-impression": 5,
      "protect-and-convert": 6,
      "new-observation": 7,
    };
    return rank[left.band] - rank[right.band] || (right.metrics?.impressions ?? 0) - (left.metrics?.impressions ?? 0) || left.url.localeCompare(right.url);
  });

function escapeCsv(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const csvHeaders = ["site", "kind", "url", "title", "updated_at", "age_days", "clicks", "impressions", "ctr_percent", "position", "band", "local_gaps", "primary_action", "source_location"];
const csvRows = portfolio.map((entry) => [
  entry.site,
  entry.kind,
  entry.url,
  entry.title,
  entry.updatedAt,
  entry.age,
  entry.metrics?.clicks,
  entry.metrics?.impressions,
  entry.metrics?.ctr,
  entry.metrics?.position,
  entry.band,
  entry.gaps.join(";"),
  entry.action,
  entry.location,
]);
fs.writeFileSync(csvPath, `${[csvHeaders, ...csvRows].map((row) => row.map(escapeCsv).join(",")).join("\n")}\n`);

const bandOrder = [
  "protect-and-convert",
  "page-one-zero-click",
  "page-two-push",
  "mid-pack-rebuild",
  "low-rank-retarget",
  "deep-rank-rebuild-or-merge",
  "new-observation",
  "zero-impression",
];
const countsFor = (items, key) => Object.fromEntries([...new Set(items.map((item) => item[key]))].sort().map((value) => [value, items.filter((item) => item[key] === value).length]));
const siteCounts = countsFor(portfolio, "site");
const bandCounts = countsFor(portfolio, "band");
const affiliateGscRecords = gscRecords.filter((record) => Object.values(siteHosts).includes(new URL(record.url).hostname));
const unmatchedGsc = affiliateGscRecords.filter((record) => !portfolio.some((entry) => normalizedUrl(entry.url) === record.url));
const noMetricEntries = portfolio.filter((entry) => !entry.metrics);
const exposedEntries = portfolio.filter((entry) => entry.metrics);
const totalAffiliateMetrics = exposedEntries.reduce((result, entry) => ({
  clicks: result.clicks + entry.metrics.clicks,
  impressions: result.impressions + entry.metrics.impressions,
}), { clicks: 0, impressions: 0 });
const topQueue = portfolio.filter((entry) => !["protect-and-convert", "new-observation"].includes(entry.band)).slice(0, 40);
const topQueries = queryRecords.slice(0, 30);

const lines = [
  "# Affiliate Search Portfolio",
  "",
  `Generated: ${reportDate}`,
  "",
  "This report joins the complete published affiliate content inventory to a Google Search Console Pages export. A missing GSC row means no recorded impression in the export window, not automatic proof of an indexing failure.",
  "",
  "## Domain-wide GSC context",
  "",
  "| Host | Exposed URLs | Clicks | Impressions | Weighted position |",
  "| --- | ---: | ---: | ---: | ---: |",
  ...domainStats.map((item) => `| ${item.host} | ${item.urls} | ${item.clicks} | ${item.impressions} | ${item.impressions ? (item.weightedPosition / item.impressions).toFixed(1) : "-"} |`),
  "",
  "## Portfolio baseline",
  "",
  `- Published content pages: ${portfolio.length}`,
  `- Pages with impressions in the GSC export: ${exposedEntries.length}`,
  `- Pages without an impression row: ${noMetricEntries.length}`,
  `- Affiliate clicks represented: ${totalAffiliateMetrics.clicks}`,
  `- Affiliate impressions represented: ${totalAffiliateMetrics.impressions}`,
  `- Affiliate GSC URLs not matched to a content registry entry: ${unmatchedGsc.length}`,
  "",
  "## Site inventory",
  "",
  "| Site | Published pages | With impressions | Without impressions |",
  "| --- | ---: | ---: | ---: |",
  ...Object.keys(siteHosts).map((site) => `| ${site} | ${siteCounts[site] ?? 0} | ${portfolio.filter((entry) => entry.site === site && entry.metrics).length} | ${portfolio.filter((entry) => entry.site === site && !entry.metrics).length} |`),
  "",
  "## Performance cohorts",
  "",
  "| Cohort | Pages | Default action |",
  "| --- | ---: | --- |",
  ...bandOrder.map((band) => `| ${band} | ${bandCounts[band] ?? 0} | ${primaryAction(band)} |`),
  "",
  "## First remediation queue",
  "",
  "This queue is ordered by the closest organic opportunity first, then by impressions. The CSV contains every page.",
  "",
  "| Site | Page | Clicks | Impressions | Position | Cohort | Local gaps |",
  "| --- | --- | ---: | ---: | ---: | --- | --- |",
  ...topQueue.map((entry) => `| ${entry.site} | [${entry.title}](${entry.url}) | ${entry.metrics?.clicks ?? "-"} | ${entry.metrics?.impressions ?? "-"} | ${entry.metrics?.position?.toFixed(1) ?? "-"} | ${entry.band} | ${entry.gaps.join(", ") || "none"} |`),
  "",
  "## Query signals",
  "",
  ...(topQueries.length ? [
    "| Query | Clicks | Impressions | CTR | Position |",
    "| --- | ---: | ---: | ---: | ---: |",
    ...topQueries.map((record) => `| ${record["Top queries"]} | ${record.Clicks} | ${record.Impressions} | ${record.CTR} | ${record.Position} |`),
  ] : ["No query CSV was supplied."]),
  "",
  "## Operating rules",
  "",
  "1. Do not change every title on every run. Preserve a page's primary target through its 7-day observation window unless the target is clearly wrong.",
  "2. Page-one zero-click pages receive snippet and decision-answer work. Positions 11-20 receive missing coverage and internal-link work.",
  "3. Positions 21-60 require intent realignment before more support URLs are added. Positions over 60 require SERP revalidation and a rebuild-or-merge decision.",
  "4. A no-impression page is checked for indexing, canonical, age, duplication, keyword demand, and internal links. It is then kept, retargeted, merged, or retired; it is not left indefinitely by default.",
  "5. Re-import a 28-day Pages CSV weekly and use 24-hour data only for recent-change monitoring. The long window drives portfolio decisions; the short window catches release effects.",
  "",
  `Full queue: ${path.relative(path.dirname(reportPath), csvPath)}`,
  "",
];

fs.writeFileSync(reportPath, lines.join("\n"));
console.log(`Search portfolio report written to ${reportPath}`);
console.log(`Full page queue written to ${csvPath}`);
console.log(`Published pages: ${portfolio.length}; with impressions: ${exposedEntries.length}; without impressions: ${noMetricEntries.length}`);
