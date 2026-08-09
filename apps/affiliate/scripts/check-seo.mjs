import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { amazonFamilyTitleMeetsPolicy } from "./amazon-family-semantic-policy.mjs";

const workspaceDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const libDir = path.join(workspaceDir, "lib");
const publicDir = path.join(workspaceDir, "public");
const errors = [];
const warnings = [];
const entries = [];
const productFactoryNames = new Set(["catalogProduct", "expandedProduct", "exactProduct"]);
const guideFactoryNames = new Set(["guide"]);
const allowedOfferHosts = new Set([
  "amzn.to",
  "www.amazon.com",
  "amazon.com",
]);
const authorizedNonAmazonOffers = new Map([
  [
    "baby:product:bc-babycare-hexa-effortless-carrier",
    {
      merchant: "Bc Babycare via CJ",
      path: "/go/cj/bc-babycare-hexa-effortless",
    },
  ],
]);

function propertyName(node) {
  if (ts.isIdentifier(node) || ts.isStringLiteral(node)) return node.text;
  return undefined;
}

function properties(node) {
  return new Map(
    node.properties
      .filter((property) => ts.isPropertyAssignment(property) || ts.isShorthandPropertyAssignment(property))
      .map((property) =>
        ts.isShorthandPropertyAssignment(property)
          ? [property.name.text, property.name]
          : [propertyName(property.name), property.initializer],
      )
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
  if (props.has("kind") && props.has("relatedRoundups")) return "tool";
  if (props.has("relatedRoundups") && props.has("sections")) return "guide";
  return undefined;
}

function addEntry(sourceFile, node, kind, factoryName) {
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
    hasUpdateDate: props.has("updatedAt") || Boolean(factoryName),
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
    addEntry(sourceFile, node.arguments[0], "product", node.expression.text);
  }

  if (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    guideFactoryNames.has(node.expression.text) &&
    ts.isObjectLiteralExpression(node.arguments[0])
  ) {
    addEntry(sourceFile, node.arguments[0], "guide", node.expression.text);
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

const quadrupleExpansionFile = path.join(libDir, "quadruple-expansion-content.ts");
const quadrupleEditorialBriefFile = path.join(libDir, "quadruple-family-editorial.ts");
const quadrupleCommunityEvidenceFile = path.join(workspaceDir, "config", "quadruple-community-evidence.json");
const quadrupleExpansionSource = fs.readFileSync(quadrupleExpansionFile, "utf8");
const quadrupleEditorialBriefJavascript = ts.transpileModule(fs.readFileSync(quadrupleEditorialBriefFile, "utf8"), {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
  fileName: quadrupleEditorialBriefFile,
}).outputText;
const quadrupleCommunityEvidenceData = JSON.parse(fs.readFileSync(quadrupleCommunityEvidenceFile, "utf8"));
const quadrupleExpansionContentJavascript = ts.transpileModule(quadrupleExpansionSource, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
  fileName: quadrupleExpansionFile,
}).outputText
  .replace(/^import communityEvidenceData[^;]+;\n/m, "")
  .replace(/^import \{ findFamilyEditorialBrief \}[^;]+;\n/m, "");
const quadrupleExpansionJavascript = `${quadrupleEditorialBriefJavascript}\nconst communityEvidenceData = ${JSON.stringify(quadrupleCommunityEvidenceData)};\n${quadrupleExpansionContentJavascript}`;
const quadrupleExpansionModule = await import(
  `data:text/javascript;base64,${Buffer.from(quadrupleExpansionJavascript).toString("base64")}`
);
const expectedExpansionFamilies = {
  network: 27,
  smarthome: 30,
  homeoffice: 33,
  baby: 24,
  pet: 30,
  costume: 10,
};
const expectedExpansionGuides = {
  network: 108,
  smarthome: 150,
  homeoffice: 165,
  baby: 144,
  pet: 150,
  costume: 40,
};
for (const [site, expected] of Object.entries(expectedExpansionFamilies)) {
  const actual = quadrupleExpansionModule.quadrupleExpansionFamilies.filter((family) => family.site === site).length;
  if (actual !== expected) errors.push(`Quadruple expansion must contain ${expected} ${site} families; found ${actual}`);
}
for (const [site, expected] of Object.entries(expectedExpansionGuides)) {
  const siteGuides = quadrupleExpansionModule.quadrupleExpansionGuides.filter((guide) => guide.site === site);
  if (siteGuides.length !== expected) errors.push(`Quadruple expansion must generate ${expected} ${site} guides; found ${siteGuides.length}`);
  const familyHubCount = siteGuides.filter((guide) => guide.familyRole === "buying").length;
  if (familyHubCount !== expectedExpansionFamilies[site]) {
    errors.push(`Quadruple expansion must generate one ${site} family hub per family; found ${familyHubCount}`);
  }
}
if (quadrupleExpansionModule.quadrupleExpansionGuides.length !== 757) {
  errors.push(`Quadruple expansion must generate 757 URL-level guides; found ${quadrupleExpansionModule.quadrupleExpansionGuides.length}`);
}
if (Object.keys(quadrupleExpansionModule.familyEditorialBriefs ?? {}).length !== 154) {
  errors.push(`Quadruple expansion must contain 154 family-specific editorial briefs; found ${Object.keys(quadrupleExpansionModule.familyEditorialBriefs ?? {}).length}`);
}
if (quadrupleCommunityEvidenceData.discussions.length !== 113) {
  errors.push(`Quadruple expansion community-evidence review must retain 113 relevant discussions; found ${quadrupleCommunityEvidenceData.discussions.length}`);
}
for (const guide of quadrupleExpansionModule.quadrupleExpansionGuides) {
  const coreText = [guide.dek, guide.quickAnswer, ...guide.sections.map((section) => `${section.heading} ${section.body}`)].filter(Boolean).join(" ");
  const coreWords = coreText.trim().split(/\s+/).filter(Boolean).length;
  if (!guide.searchQuestion || !guide.quickAnswer) errors.push(`Missing independent question or direct answer for ${guide.site}:${guide.slug}`);
  if (guide.governance?.decision !== "rewrite" || !guide.governance.independentDemand || !guide.governance.distinctFrom) {
    errors.push(`Missing URL-level governance result for ${guide.site}:${guide.slug}`);
  }
  const minimumCoreWords = guide.familyRole === "comparison" ? 390 : 320;
  if (guide.sections.length < 5 || coreWords < minimumCoreWords) errors.push(`Thin governed guide ${guide.site}:${guide.slug}: ${guide.sections.length} sections, ${coreWords} core words (minimum ${minimumCoreWords})`);
  if (!guide.comparisonTable || guide.comparisonTable.rows.length < 6) errors.push(`Missing decision table for ${guide.site}:${guide.slug}`);
  if (!guide.editorialMethod || guide.editorialMethod.length < 5) errors.push(`Missing editorial method for ${guide.site}:${guide.slug}`);
}

const amazonFamilyProductPath = path.join(workspaceDir, "config", "amazon-family-products.json");
const amazonFamilyProductData = JSON.parse(fs.readFileSync(amazonFamilyProductPath, "utf8"));
const amazonFamilyProducts = amazonFamilyProductData.products ?? [];
const amazonExpansionSites = ["network", "smarthome", "homeoffice", "baby", "pet"];
const expectedAmazonFamilyTotal = amazonExpansionSites.reduce((total, site) => total + expectedExpansionFamilies[site], 0);
if (amazonFamilyProducts.length !== expectedAmazonFamilyTotal) {
  errors.push(`Amazon family-product registry must contain ${expectedAmazonFamilyTotal} verified listings; found ${amazonFamilyProducts.length}`);
}
const amazonFamilyKeys = new Set();
const amazonFamilyAsins = new Set();
const existingEditorialAsins = new Set(
  fs.readdirSync(libDir)
    .filter((name) => name.endsWith(".ts") && name !== "amazon-family-products.ts")
    .flatMap((name) => [...fs.readFileSync(path.join(libDir, name), "utf8").matchAll(/\b(B[A-Z0-9]{9})\b/g)].map((match) => match[1])),
);
for (const site of amazonExpansionSites) {
  const expectedFamilies = quadrupleExpansionModule.quadrupleExpansionFamilies.filter((family) => family.site === site);
  const siteProducts = amazonFamilyProducts.filter((product) => product.site === site);
  if (siteProducts.length !== expectedFamilies.length) {
    errors.push(`Amazon family-product registry must contain ${expectedFamilies.length} ${site} listings; found ${siteProducts.length}`);
  }
  for (const family of expectedFamilies) {
    const product = siteProducts.find((item) => item.familySlug === family.slug);
    if (!product) {
      errors.push(`Missing Amazon listing for ${site}:${family.slug}`);
      continue;
    }
    if (product.familyName !== family.name || product.category !== family.category) {
      errors.push(`Amazon listing family identity drift for ${site}:${family.slug}`);
    }
  }
}
for (const product of amazonFamilyProducts) {
  const familyKey = `${product.site}:${product.familySlug}`;
  if (amazonFamilyKeys.has(familyKey)) errors.push(`Duplicate Amazon family listing ${familyKey}`);
  if (!/^[A-Z0-9]{10}$/.test(product.asin ?? "")) errors.push(`Invalid ASIN for Amazon family listing ${familyKey}`);
  if (amazonFamilyAsins.has(product.asin)) errors.push(`Amazon family ASIN ${product.asin} is reused`);
  if (existingEditorialAsins.has(product.asin)) errors.push(`Amazon family ASIN ${product.asin} duplicates an existing editorial product`);
  if (product.detailUrl !== `https://www.amazon.com/dp/${product.asin}`) errors.push(`Unexpected Amazon detail URL for ${familyKey}`);
  if (!product.title?.trim() || !product.brand?.trim() || Number(product.relevanceScore) < 5) errors.push(`Incomplete Amazon family listing ${familyKey}`);
  if (!amazonFamilyTitleMeetsPolicy(product.familySlug, product.title)) errors.push(`Amazon listing title fails semantic policy for ${familyKey}`);
  if (Number.isNaN(Date.parse(product.verifiedAt))) errors.push(`Invalid Amazon verification date for ${familyKey}`);
  amazonFamilyKeys.add(familyKey);
  amazonFamilyAsins.add(product.asin);
}
for (const guide of quadrupleExpansionModule.quadrupleExpansionGuides) {
  entries.push({
    site: guide.site,
    slug: guide.slug,
    kind: "guide",
    title: guide.title,
    status: guide.publicationStatus ?? "published",
    hasUpdateDate: Boolean(guide.updatedAt),
    image: guide.image,
    productSlugs: [],
    relatedProducts: guide.relatedProducts ?? [],
    relatedRoundups: guide.relatedRoundups ?? [],
    relatedGuides: guide.relatedGuides ?? [],
    offerUrls: [],
    offerMerchants: [],
    evidenceMode: undefined,
    researchNote: undefined,
    externalTests: [],
    location: "quadruple-expansion-content.ts:generated",
  });
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
      parsed = new URL(url, "https://affiliate-route.invalid");
    } catch {
      errors.push(`Invalid affiliate URL "${url}" for ${routeKey}`);
      continue;
    }
    const authorizedOffer = authorizedNonAmazonOffers.get(routeKey);
    const isAuthorizedLocalRoute =
      parsed.hostname === "affiliate-route.invalid" &&
      authorizedOffer?.path === parsed.pathname;
    if (!isAuthorizedLocalRoute && !allowedOfferHosts.has(parsed.hostname)) {
      errors.push(`Unexpected affiliate host ${parsed.hostname} for ${routeKey}`);
    }
  }

  for (const merchant of entry.offerMerchants) {
    const authorizedOffer = authorizedNonAmazonOffers.get(routeKey);
    if (!merchant.toLowerCase().includes("amazon") && authorizedOffer?.merchant !== merchant) {
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
        hasUpdateDate: props.has("updatedAt"),
        preferredPaths: stringArray(props.get("preferredPaths")),
      });
    });
  });
});

if (searchOpportunities.length !== 98) {
  errors.push(`Search opportunity registry must contain exactly 98 entries; found ${searchOpportunities.length}`);
}
const opportunityKeys = new Set();
const opportunityDateKeys = new Set();
const publishedRoutePaths = new Set(
  entries
    .filter((entry) => entry.status === "published")
    .map((entry) => `${entry.site}:${({ product: "/reviews", guide: "/guides", roundup: "/best", tool: "/tools" })[entry.kind]}/${entry.slug}`),
);
const moduleFile = path.join(libDir, "site-decision-modules.ts");
const moduleSource = ts.createSourceFile(
  moduleFile,
  fs.readFileSync(moduleFile, "utf8"),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS,
);
const decisionModules = [];
moduleSource.statements.forEach((statement) => {
  if (!ts.isVariableStatement(statement)) return;
  statement.declarationList.declarations.forEach((declaration) => {
    if (
      !ts.isIdentifier(declaration.name)
      || declaration.name.text !== "decisionModules"
      || !declaration.initializer
      || !ts.isArrayLiteralExpression(declaration.initializer)
    ) return;
    declaration.initializer.elements.forEach((element) => {
      if (!ts.isObjectLiteralExpression(element)) return;
      const props = properties(element);
      decisionModules.push({
        site: stringValue(props.get("site")),
        slug: stringValue(props.get("slug")),
        eyebrow: stringValue(props.get("eyebrow")),
        title: stringValue(props.get("title")),
        description: stringValue(props.get("description")),
        links: objectArrayProperties(props.get("links")).map((link) => ({
          href: stringValue(link.get("href")),
          label: stringValue(link.get("label")),
          note: stringValue(link.get("note")),
        })),
      });
    });
  });
});
if (decisionModules.length !== 12) {
  errors.push(`Site decision-module registry must contain exactly 12 modules; found ${decisionModules.length}`);
}
const moduleKeys = new Set();
const moduleCounts = new Map();
for (const decisionModule of decisionModules) {
  const key = `${decisionModule.site}:${decisionModule.slug}`;
  if (moduleKeys.has(key)) errors.push(`Duplicate site decision module ${key}`);
  moduleKeys.add(key);
  moduleCounts.set(decisionModule.site, (moduleCounts.get(decisionModule.site) ?? 0) + 1);
  if (!decisionModule.eyebrow || !decisionModule.title || !decisionModule.description) {
    errors.push(`Site decision module ${key} is missing display copy`);
  }
  if (decisionModule.links.length !== 3) {
    errors.push(`Site decision module ${key} must contain exactly 3 verified paths`);
  }
  const hrefs = new Set();
  for (const link of decisionModule.links) {
    if (!link.href || !link.label || !link.note) {
      errors.push(`Site decision module ${key} contains an incomplete path`);
      continue;
    }
    if (hrefs.has(link.href)) errors.push(`Site decision module ${key} repeats ${link.href}`);
    hrefs.add(link.href);
    if (!publishedRoutePaths.has(`${decisionModule.site}:${link.href}`)) {
      errors.push(`Site decision module ${key} references missing published path ${link.href}`);
    }
  }
}
for (const site of ["network", "smarthome", "homeoffice", "baby", "pet", "costume"]) {
  if (moduleCounts.get(site) !== 2) errors.push(`${site} must expose exactly 2 site decision modules`);
}
for (const site of ["style"]) {
  if (moduleCounts.has(site)) errors.push(`${site} must remain outside the current decision-module expansion`);
}
for (const opportunity of searchOpportunities) {
  const key = `${opportunity.site}:${opportunity.kind}:${opportunity.slug}`;
  if (opportunityKeys.has(key)) errors.push(`Duplicate search opportunity ${key}`);
  opportunityKeys.add(key);
  if (opportunity.hasUpdateDate) opportunityDateKeys.add(key);
  else errors.push(`Search opportunity ${key} is missing updatedAt`);
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
for (const entry of entries.filter((item) => item.status === "published")) {
  const key = `${entry.site}:${entry.kind}:${entry.slug}`;
  if (!entry.hasUpdateDate && !opportunityDateKeys.has(key)) {
    errors.push(`Published route ${key} is missing updatedAt`);
  }
}
for (const [kind, route] of [["product", "reviews"], ["guide", "guides"], ["roundup", "best"]]) {
  const routeSource = fs.readFileSync(path.join(workspaceDir, "app", route, "[slug]", "page.tsx"), "utf8");
  if (!routeSource.includes(`SearchOpportunityBacklinks site={site.key} kind="${kind}" slug={slug}`)) {
    errors.push(`${route} template must render reciprocal links to page-two search opportunities`);
  }
}

const reviewTemplateSource = fs.readFileSync(path.join(workspaceDir, "app", "reviews", "[slug]", "page.tsx"), "utf8");
const reviewImageIndex = reviewTemplateSource.indexOf("src={displayImage}");
const reviewFirstScreenSource = reviewImageIndex === -1
  ? ""
  : reviewTemplateSource.slice(0, reviewImageIndex);
if (
  !reviewFirstScreenSource.includes('aria-label="Mobile purchase decision checks"') ||
  !reviewFirstScreenSource.includes("md:hidden") ||
  !reviewFirstScreenSource.includes("product.cons[0]") ||
  !reviewFirstScreenSource.includes("primaryOffers[0].priceNote")
) {
  errors.push("Product template must show mobile skip and merchant-listing verification checks before the product image");
}
if (!reviewFirstScreenSource.includes('position="review-hero"')) {
  errors.push("Product template must show the primary sponsored CTA before the product image");
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
if (!seoSource.includes("const richProductEligible = Boolean(editorialReview || offers)")) {
  errors.push("Product structured data must require a genuine review or verified numeric offer");
}
if (!seoSource.includes("export function roundupArticleSchema")) {
  errors.push("Roundup pages must emit Article data alongside ItemList data");
}
const roundupListSchemaSource = seoSource.slice(
  seoSource.indexOf("export function roundupProductListSchema"),
  seoSource.indexOf("export function faqPageSchema"),
);
if (roundupListSchemaSource.includes('"@type": "Product"')) {
  errors.push("Roundup ItemList data must not emit incomplete Product objects");
}
const roundupArticleSchemaSource = seoSource.slice(
  seoSource.indexOf("export function roundupArticleSchema"),
  seoSource.indexOf("export function productNotesSchema"),
);
if (!roundupArticleSchemaSource.includes('"@type": "Thing"')) {
  errors.push("Roundup Article subjects must use Thing unless genuine Product rich-result data exists");
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
if (!llmsSource.includes("indexableLocalizedMarketPagesForSite")) {
  errors.push("llms.txt must advertise only index-qualified country editions");
}

const contentSource = fs.readFileSync(path.join(libDir, "content.ts"), "utf8");
const sitemapSource = fs.readFileSync(path.join(workspaceDir, "app", "sitemap.ts"), "utf8");
if (!contentSource.includes('process.env.AFFILIATE_INCLUDE_DRAFTS === "1"')) {
  errors.push("Draft preview flag is missing from the content registry");
}
if (!sitemapSource.includes("siteProducts(site.key)") || !sitemapSource.includes("siteGuides(site.key)")) {
  errors.push("Sitemap must use publication-aware content selectors");
}

const amazonSiteKeys = ["network", "smarthome", "homeoffice", "baby", "pet", "style"];
const marketsSource = fs.readFileSync(path.join(libDir, "markets.ts"), "utf8");
for (const siteKey of amazonSiteKeys) {
  if (!marketsSource.match(new RegExp(`marketSiteKeys[^;]+["']${siteKey}["']`, "s"))) {
    errors.push(`Amazon publication ${siteKey} must enable automatic country editions`);
  }
}

const marketContentSource = fs.readFileSync(path.join(libDir, "market-content.ts"), "utf8");
for (const requiredSelector of [
  "siteProducts(siteKey)",
  "siteRoundups(siteKey)",
  "siteGuides(siteKey)",
  "siteTools(siteKey)",
  "site.categories.map",
  "marketSiteKeys.flatMap(automaticPagesForSite)",
  'indexStatus: "compatibility"',
  "isIndexableLocalizedMarketPage",
  "hasIndexableLocalizedMarketPages",
  "indexableLocalizedMarketPagesForSite",
]) {
  if (!marketContentSource.includes(requiredSelector)) {
    errors.push(`Automatic country-edition registry must use ${requiredSelector}`);
  }
}
for (const [kind, route] of [
  ["product", "reviews"],
  ["roundup", "best"],
  ["guide", "guides"],
  ["tool", "tools"],
  ["category", "categories"],
]) {
  const templateSource = fs.readFileSync(
    path.join(workspaceDir, "app", route, "[slug]", "page.tsx"),
    "utf8",
  );
  if (!templateSource.includes("BaseMarketEditionLinks")) {
    errors.push(`${kind} template must expose all automatic country editions`);
  }
}

const localizedRouteSource = fs.readFileSync(
  path.join(workspaceDir, "app", "[slug]", "[kind]", "[contentSlug]", "page.tsx"),
  "utf8",
);
if (!localizedRouteSource.includes("findLocalizedMarketPage")) {
  errors.push("Country-edition route must resolve every generated market page");
}
if (
  !localizedRouteSource.includes("isIndexableLocalizedMarketPage")
  || !localizedRouteSource.includes("index: false")
  || !localizedRouteSource.includes("follow: true")
) {
  errors.push("Compatibility-only country pages must emit noindex,follow");
}

const marketHomeRouteSource = fs.readFileSync(
  path.join(workspaceDir, "app", "[slug]", "page.tsx"),
  "utf8",
);
if (
  !marketHomeRouteSource.includes("hasIndexableLocalizedMarketPages")
  || !marketHomeRouteSource.includes("index: false")
) {
  errors.push("Country hubs without index-qualified pages must emit noindex,follow");
}

const marketExperienceSource = fs.readFileSync(
  path.join(workspaceDir, "components", "MarketExperience.tsx"),
  "utf8",
);
if (marketExperienceSource.includes('"@type": "Product"')) {
  errors.push("Country-edition Article subjects must not emit incomplete Product structured data");
}
if (!marketExperienceSource.includes('url: absoluteUrl(site, `/reviews/${product.slug}`)')) {
  errors.push("Country-edition Article subjects must link their Thing entity to the canonical evidence page");
}

const counts = entries.reduce((result, entry) => {
  const key = `${entry.status} ${entry.kind}s`;
  result[key] = (result[key] ?? 0) + 1;
  return result;
}, {});

console.log("Affiliate SEO audit");
console.log(Object.entries(counts).sort().map(([key, value]) => `- ${key}: ${value}`).join("\n"));
const automaticEditorialPages = entries.filter(
  (entry) => entry.status === "published" && amazonSiteKeys.includes(entry.site),
).length;
console.log(`- automatic country-edition editorial routes: ${automaticEditorialPages * 4}`);
const indexQualifiedPages = (marketContentSource.match(/indexStatus:\s*"qualified",/g) ?? []).length;
const indexQualifiedSites = new Set(
  [...marketContentSource.matchAll(
    /site:\s*"([^"]+)"[\s\S]{0,160}?indexStatus:\s*"qualified"/g,
  )].map((match) => match[1]),
).size;
console.log(`- index-qualified country-edition URLs: ${(indexQualifiedPages + indexQualifiedSites) * 4}`);
console.log(`- verified Amazon family listings: ${amazonFamilyProducts.length}`);
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
