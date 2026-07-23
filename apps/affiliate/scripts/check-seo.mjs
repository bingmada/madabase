import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const workspaceDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const libDir = path.join(workspaceDir, "lib");
const publicDir = path.join(workspaceDir, "public");
const errors = [];
const warnings = [];
const entries = [];
const productFactoryNames = new Set(["catalogProduct", "expandedProduct"]);
const allowedOfferHosts = new Set([
  "amzn.to",
  "www.amazon.com",
  "amazon.com",
]);

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

function stringValue(node) {
  if (!node) return undefined;
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isIdentifier(node) && node.text === "draft") return "draft";
  return undefined;
}

function stringArray(node) {
  if (!node || !ts.isArrayLiteralExpression(node)) return [];
  return node.elements.map(stringValue).filter(Boolean);
}

function offerUrls(node) {
  if (!node || !ts.isArrayLiteralExpression(node)) return [];
  return node.elements.flatMap((element) => {
    if (!ts.isObjectLiteralExpression(element)) return [];
    const url = stringValue(properties(element).get("url"));
    return url ? [url] : [];
  });
}

function offerMerchants(node) {
  if (!node || !ts.isArrayLiteralExpression(node)) return [];
  return node.elements.flatMap((element) => {
    if (!ts.isObjectLiteralExpression(element)) return [];
    const merchant = stringValue(properties(element).get("merchant"));
    return merchant ? [merchant] : [];
  });
}

function objectArrayProperties(node) {
  if (!node || !ts.isArrayLiteralExpression(node)) return [];
  return node.elements
    .filter(ts.isObjectLiteralExpression)
    .map((element) => properties(element));
}

function productFactoryOfferUrls(props) {
  const affiliateUrl = stringValue(props.get("affiliateUrl"));
  const asin = stringValue(props.get("asin"));
  if (affiliateUrl?.startsWith("https://")) return [affiliateUrl];
  if (asin) return [`https://www.amazon.com/dp/${asin}?tag=bingmada-20&linkCode=ll2&language=en_US&ref_=as_li_ss_tl`];
  return [];
}

function entryKind(props) {
  if (props.has("priceBand") && props.has("offers")) return "product";
  if (props.has("productSlugs") && props.has("faqs")) return "roundup";
  if (props.has("relatedRoundups") && props.has("sections")) return "guide";
  if (props.has("kind") && props.has("relatedRoundups")) return "tool";
  return undefined;
}

function addEntry(sourceFile, node, kind) {
  const props = properties(node);
  const site = stringValue(props.get("site"));
  const slug = stringValue(props.get("slug"));

  if (!site || !slug || !kind) return;

  const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  entries.push({
    site,
    slug,
    kind,
    title: stringValue(props.get("seoTitle")) ?? stringValue(props.get("title")) ?? stringValue(props.get("name")),
    status: stringValue(props.get("publicationStatus")) ?? "published",
    image: stringValue(props.get("image")),
    productSlugs: stringArray(props.get("productSlugs")),
    relatedProducts: stringArray(props.get("relatedProducts")),
    relatedRoundups: stringArray(props.get("relatedRoundups")),
    relatedGuides: stringArray(props.get("relatedGuides")),
    offerUrls: kind === "product" && props.has("affiliateUrl") ? productFactoryOfferUrls(props) : offerUrls(props.get("offers")),
    offerMerchants: offerMerchants(props.get("offers")),
    evidenceMode: stringValue(props.get("evidenceMode")),
    researchNote: stringValue(props.get("researchNote")),
    externalTests: objectArrayProperties(props.get("externalTests")),
    location: `${path.basename(sourceFile.fileName)}:${position.line + 1}`,
  });
}

function visit(sourceFile, node) {
  if (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    productFactoryNames.has(node.expression.text) &&
    ts.isObjectLiteralExpression(node.arguments[0])
  ) {
    addEntry(sourceFile, node.arguments[0], "product");
  }

  if (ts.isObjectLiteralExpression(node)) {
    const props = properties(node);
    const kind = entryKind(props);

    addEntry(sourceFile, node, kind);
  }
  ts.forEachChild(node, (child) => visit(sourceFile, child));
}

for (const filename of fs.readdirSync(libDir).filter((name) => name.endsWith(".ts"))) {
  const filePath = path.join(libDir, filename);
  const sourceText = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(filePath, sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  visit(sourceFile, sourceFile);
}

const routeKeys = new Map();
const titleKeys = new Map();
for (const entry of entries) {
  const routeKey = `${entry.site}:${entry.kind}:${entry.slug}`;
  if (routeKeys.has(routeKey)) {
    errors.push(`Duplicate route ${routeKey}: ${routeKeys.get(routeKey)} and ${entry.location}`);
  } else {
    routeKeys.set(routeKey, entry.location);
  }

  if (!entry.title) {
    errors.push(`Missing title for ${routeKey} at ${entry.location}`);
  } else {
    const titleKey = `${entry.site}:${entry.title.toLowerCase()}`;
    if (titleKeys.has(titleKey)) {
      warnings.push(`Repeated title on ${entry.site}: "${entry.title}" (${titleKeys.get(titleKey)}, ${entry.location})`);
    } else {
      titleKeys.set(titleKey, entry.location);
    }
  }

  if (entry.image?.startsWith("/")) {
    const imagePath = path.join(publicDir, entry.image);
    if (!fs.existsSync(imagePath)) errors.push(`Missing image ${entry.image} for ${routeKey}`);
  }

  if (entry.image?.toLowerCase().endsWith(".svg")) {
    errors.push(`Content image ${entry.image} for ${routeKey} must use a photographic bitmap instead of a placeholder SVG`);
  }

  for (const url of entry.offerUrls) {
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      errors.push(`Invalid affiliate URL "${url}" for ${routeKey}`);
      continue;
    }
    if (!allowedOfferHosts.has(parsed.hostname)) {
      errors.push(`Unexpected affiliate host ${parsed.hostname} for ${routeKey}`);
    }
  }

  for (const merchant of entry.offerMerchants) {
    if (!merchant.toLowerCase().includes("amazon")) {
      errors.push(`Unauthorized non-Amazon merchant ${merchant} for ${routeKey}`);
    }
  }

  if (entry.kind === "product") {
    const allowedEvidenceModes = new Set(["hands-on", "research-synthesis", "official-spec"]);
    if (entry.evidenceMode && !allowedEvidenceModes.has(entry.evidenceMode)) {
      errors.push(`Invalid evidence mode ${entry.evidenceMode} for ${routeKey}`);
    }
    if (entry.evidenceMode === "research-synthesis" && (!entry.researchNote || !entry.externalTests.length)) {
      errors.push(`Research synthesis ${routeKey} must include a disclosure and attributed external tests`);
    }
    if (entry.evidenceMode === "hands-on" && !entry.researchNote) {
      errors.push(`Hands-on product ${routeKey} must include a first-hand setup and limitations note`);
    }
    entry.externalTests.forEach((test, index) => {
      const requiredFields = ["source", "url", "testSetup", "result", "interpretation", "limitation"];
      const missing = requiredFields.filter((field) => !stringValue(test.get(field)));
      if (missing.length) {
        errors.push(`External test ${index + 1} for ${routeKey} is missing ${missing.join(", ")}`);
      }
      const testUrl = stringValue(test.get("url"));
      if (testUrl) {
        try {
          const parsed = new URL(testUrl);
          if (parsed.protocol !== "https:") errors.push(`External test ${index + 1} for ${routeKey} must use HTTPS`);
        } catch {
          errors.push(`External test ${index + 1} for ${routeKey} has an invalid URL`);
        }
      }
    });
  }
}

const opportunityFile = path.join(libDir, "search-opportunities.ts");
const opportunitySource = ts.createSourceFile(
  opportunityFile,
  fs.readFileSync(opportunityFile, "utf8"),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS,
);
const searchOpportunities = [];
opportunitySource.statements.forEach((statement) => {
  if (!ts.isVariableStatement(statement)) return;
  statement.declarationList.declarations.forEach((declaration) => {
    if (
      !ts.isIdentifier(declaration.name) ||
      declaration.name.text !== "searchOpportunities" ||
      !declaration.initializer ||
      !ts.isArrayLiteralExpression(declaration.initializer)
    ) return;
    declaration.initializer.elements.forEach((element) => {
      if (!ts.isObjectLiteralExpression(element)) return;
      const props = properties(element);
      searchOpportunities.push({
        site: stringValue(props.get("site")),
        kind: stringValue(props.get("kind")),
        slug: stringValue(props.get("slug")),
        query: stringValue(props.get("query")),
        answer: stringValue(props.get("answer")),
        preferredPaths: stringArray(props.get("preferredPaths")),
      });
    });
  });
});

if (searchOpportunities.length !== 44) {
  errors.push(`Page-two opportunity registry must contain exactly 44 entries; found ${searchOpportunities.length}`);
}
const opportunityKeys = new Set();
const publishedRoutePaths = new Set(
  entries
    .filter((entry) => entry.status === "published")
    .map((entry) => `${entry.site}:${({ product: "/reviews", guide: "/guides", roundup: "/best", tool: "/tools" })[entry.kind]}/${entry.slug}`),
);
for (const opportunity of searchOpportunities) {
  const key = `${opportunity.site}:${opportunity.kind}:${opportunity.slug}`;
  if (opportunityKeys.has(key)) errors.push(`Duplicate search opportunity ${key}`);
  opportunityKeys.add(key);
  if (!routeKeys.has(key)) errors.push(`Search opportunity points to missing route ${key}`);
  if (!opportunity.query || opportunity.query.length < 24) errors.push(`Search opportunity ${key} needs a specific query`);
  if (!opportunity.answer || opportunity.answer.length < 100) errors.push(`Search opportunity ${key} needs a substantive direct answer`);
  opportunity.preferredPaths.forEach((preferredPath) => {
    if (!publishedRoutePaths.has(`${opportunity.site}:${preferredPath}`)) {
      errors.push(`Search opportunity ${key} references missing preferred path ${preferredPath}`);
    }
  });
  const relatedCandidateCount = entries.filter((entry) => entry.site === opportunity.site && entry.status === "published" && `${entry.kind}:${entry.slug}` !== `${opportunity.kind}:${opportunity.slug}`).length;
  if (relatedCandidateCount < 5) errors.push(`Search opportunity ${key} cannot produce five verified contextual links`);
}
for (const [kind, route] of [["product", "reviews"], ["guide", "guides"], ["roundup", "best"]]) {
  const routeSource = fs.readFileSync(path.join(workspaceDir, "app", route, "[slug]", "page.tsx"), "utf8");
  if (!routeSource.includes(`SearchOpportunityBacklinks site={site.key} kind="${kind}" slug={slug}`)) {
    errors.push(`${route} template must render reciprocal links to page-two search opportunities`);
  }
}

const sitesSource = fs.readFileSync(path.join(libDir, "sites.ts"), "utf8");
for (const match of sitesSource.matchAll(/heroImage:\s*"([^"]+\.svg)"/g)) {
  errors.push(`Site hero ${match[1]} must use a photographic bitmap instead of a placeholder SVG`);
}

const productEntries = new Map(entries.filter((entry) => entry.kind === "product").map((entry) => [`${entry.site}:${entry.slug}`, entry]));
const roundupEntries = new Map(entries.filter((entry) => entry.kind === "roundup").map((entry) => [`${entry.site}:${entry.slug}`, entry]));
const guideEntries = new Map(entries.filter((entry) => entry.kind === "guide").map((entry) => [`${entry.site}:${entry.slug}`, entry]));

for (const entry of entries) {
  for (const slug of [...entry.productSlugs, ...entry.relatedProducts]) {
    const target = productEntries.get(`${entry.site}:${slug}`);
    if (!target) {
      errors.push(`Missing related product ${entry.site}:${slug} referenced by ${entry.kind}:${entry.slug}`);
    } else if (entry.status === "published" && target.status === "draft") {
      errors.push(`Published ${entry.kind}:${entry.slug} references draft product ${slug}`);
    }
  }

  for (const slug of entry.relatedRoundups) {
    const target = roundupEntries.get(`${entry.site}:${slug}`);
    if (!target) {
      errors.push(`Missing related roundup ${entry.site}:${slug} referenced by ${entry.kind}:${entry.slug}`);
    } else if (entry.status === "published" && target.status === "draft") {
      errors.push(`Published ${entry.kind}:${entry.slug} references draft roundup ${slug}`);
    }
  }

  for (const slug of entry.relatedGuides) {
    const target = guideEntries.get(`${entry.site}:${slug}`);
    if (!target) {
      errors.push(`Missing related guide ${entry.site}:${slug} referenced by ${entry.kind}:${entry.slug}`);
    } else if (entry.status === "published" && target.status === "draft") {
      errors.push(`Published ${entry.kind}:${entry.slug} references draft guide ${slug}`);
    }
  }
}

const seoSource = fs.readFileSync(path.join(libDir, "seo.ts"), "utf8");
if (!seoSource.includes('alternates:') || !seoSource.includes("canonical: url")) {
  errors.push("pageMetadata must emit a canonical URL");
}
if (!seoSource.includes('export function productNotesSchema') || !seoSource.includes('"@type": "Article"')) {
  errors.push("Product-note pages must use Article structured data unless genuine offer/review data is available");
}
if (!seoSource.includes('product.evidenceMode === "hands-on"')) {
  errors.push("Review structured data must be limited to explicitly labeled hands-on products");
}
if (!seoSource.includes("export function roundupArticleSchema")) {
  errors.push("Roundup pages must emit Article data alongside ItemList data");
}
if (!seoSource.includes("export function productPageTitle")) {
  errors.push("Product pages must use the shared query-oriented title fallback");
}

const robotsSource = fs.readFileSync(path.join(workspaceDir, "app", "robots.ts"), "utf8");
if (!robotsSource.includes('userAgent: "OAI-SearchBot"') || !robotsSource.includes('allow: "/"')) {
  errors.push("robots.ts must explicitly allow OAI-SearchBot on public pages");
}

const llmsSource = fs.readFileSync(path.join(workspaceDir, "app", "llms.txt", "route.ts"), "utf8");
if (!llmsSource.includes("siteProducts(site.key)") || !llmsSource.includes('"Product evidence pages"')) {
  errors.push("llms.txt must list product evidence pages as well as guides and comparisons");
}

const contentSource = fs.readFileSync(path.join(libDir, "content.ts"), "utf8");
const sitemapSource = fs.readFileSync(path.join(workspaceDir, "app", "sitemap.ts"), "utf8");
if (!contentSource.includes('process.env.AFFILIATE_INCLUDE_DRAFTS === "1"')) {
  errors.push("Draft preview flag is missing from the content registry");
}
if (!sitemapSource.includes("siteProducts(site.key)") || !sitemapSource.includes("siteGuides(site.key)")) {
  errors.push("Sitemap must use publication-aware content selectors");
}

const counts = entries.reduce((result, entry) => {
  const key = `${entry.status} ${entry.kind}s`;
  result[key] = (result[key] ?? 0) + 1;
  return result;
}, {});

console.log("Affiliate SEO audit");
console.log(Object.entries(counts).sort().map(([key, value]) => `- ${key}: ${value}`).join("\n"));
if (warnings.length) {
  console.log(`\nWarnings (${warnings.length})`);
  warnings.forEach((warning) => console.log(`- ${warning}`));
}
if (errors.length) {
  console.error(`\nErrors (${errors.length})`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log("\nSEO audit passed.");
