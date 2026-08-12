import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const workspaceDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const releaseCandidate = "breadth-64-2026-08-16";
const contentPath = path.join(workspaceDir, "lib", "cj-baby-expansion-content.ts");
const offersPath = path.join(workspaceDir, "lib", "cj-offers.ts");
const cjPath = path.join(workspaceDir, "lib", "cj.ts");
const guidePagePath = path.join(workspaceDir, "app", "guides", "[slug]", "page.tsx");
const contentIndexPath = path.join(workspaceDir, "lib", "content.ts");
const sitesPath = path.join(workspaceDir, "lib", "sites.ts");
const categoryPagePath = path.join(workspaceDir, "app", "categories", "[slug]", "page.tsx");

async function loadTsModule(pathname) {
  const output = ts.transpileModule(fs.readFileSync(pathname, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    fileName: pathname,
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);
}

function words(value) {
  return String(value ?? "").trim().split(/\s+/).filter(Boolean).length;
}

const contentModule = await loadTsModule(contentPath);
const offersModule = await loadTsModule(offersPath);
const cjModule = await loadTsModule(cjPath);
const products = contentModule.cjBabyExpansionProducts;
const offers = offersModule.authorizedCjOffers;
const errors = [];

const expectedProducts = new Map([
  ["bc-babycare-clarvion-bottle-washer", {
    token: "bc-babycare-clarvion-bundle",
    image: "/images/affiliate/bc-babycare-clarvion-bottle-washer.png",
  }],
  ["bc-babycare-baby-food-maker", {
    token: "bc-babycare-baby-food-maker-blue-extra",
    image: "/images/affiliate/bc-babycare-baby-food-maker.jpg",
  }],
  ["bc-babycare-3-in-1-potty-chair", {
    token: "bc-babycare-potty-chair-green",
    image: "/images/affiliate/bc-babycare-3-in-1-potty-chair.png",
  }],
]);
const expectedReleaseTokens = new Set([
  "bc-babycare-portable-fan",
  "bc-babycare-airy-silicone-bib",
  "bc-babycare-clarvion-bundle",
  "bc-babycare-baby-food-maker-blue-extra",
  "bc-babycare-potty-chair-green",
]);
const expectedDualFamilies = new Set([
  "stroller-fans",
  "roll-up-feeding-bibs",
  "automatic-bottle-washers",
  "baby-food-makers",
]);

if (!Array.isArray(products) || products.length !== 3) errors.push(`Expected three CJ-only product pages; found ${products?.length ?? 0}`);
for (const product of products ?? []) {
  const expected = expectedProducts.get(product.slug);
  if (!expected) {
    errors.push(`Unexpected CJ product page ${product.slug}`);
    continue;
  }
  if (product.site !== "baby" || product.publicationStatus !== "published" || product.releaseCandidate !== releaseCandidate) {
    errors.push(`${product.slug} is not marked published in the ${releaseCandidate} Baby release`);
  }
  if (product.evidenceMode !== "official-spec" || !product.researchNote?.includes("not a hands-on")) {
    errors.push(`${product.slug} does not clearly disclose its evidence mode`);
  }
  if ((product.editorialSections?.length ?? 0) < 6 || (product.sources?.length ?? 0) < 5 || product.evidence.length < 5) {
    errors.push(`${product.slug} lacks six sections, five sources, or five verification checks`);
  }
  if (!product.editorialSections?.some((section) => /feedback|reviews/i.test(section.heading))) {
    errors.push(`${product.slug} lacks a dedicated customer-feedback interpretation section`);
  }
  const editorialText = [
    product.summary,
    product.verdict,
    product.whyItMatters,
    ...product.pros,
    ...product.cons,
    ...product.evidence,
    ...(product.editorialSections ?? []).flatMap((section) => [section.heading, section.body]),
  ].join(" ");
  const wordCount = words(editorialText);
  if (wordCount < 550) errors.push(`${product.slug} has only ${wordCount} core editorial words`);
  if (!/syndicat|anecdot|not (?:independent|proof)/i.test(editorialText)) {
    errors.push(`${product.slug} does not limit retailer-hosted feedback claims`);
  }
  if (product.offers?.length !== 1 || product.offers[0].url !== `/go/cj/${expected.token}`) {
    errors.push(`${product.slug} does not use its single local CJ redirect token`);
  }
  if (product.image !== expected.image) errors.push(`${product.slug} does not use its exact feed image`);
  const imagePath = path.join(workspaceDir, "public", expected.image.replace(/^\//, ""));
  if (!fs.existsSync(imagePath) || fs.statSync(imagePath).size < 40_000) errors.push(`${product.slug} exact feed image is missing or too small`);
}
for (const slug of expectedProducts.keys()) if (!products.some((product) => product.slug === slug)) errors.push(`Missing CJ product page ${slug}`);

const releaseOffers = offers.filter((offer) => expectedReleaseTokens.has(offer.token));
if (releaseOffers.length !== 5) errors.push(`Expected five releasable exact CJ offers; found ${releaseOffers.length}`);
for (const offer of releaseOffers) {
  if (offer.site !== "baby" || offer.advertiserCid !== "7582444" || offer.pid !== "101832977" || offer.aid !== "17184215") {
    errors.push(`${offer.token} has the wrong advertiser, publisher, or product-feed identity`);
  }
  if (offer.publicationStatus !== "published" || offer.releaseCandidate !== releaseCandidate || offer.verifiedAt !== "2026-08-12") {
    errors.push(`${offer.token} lacks current published/release verification metadata`);
  }
  if (!offer.catalogSku || !offer.variantLabel || !offer.productName) errors.push(`${offer.token} lacks exact catalog metadata`);
  const trackingUrl = new URL(offer.trackingUrl);
  const encodedDestination = trackingUrl.searchParams.get("url");
  const destinationPathMatches = encodedDestination?.includes(new URL(offer.destinationUrl).pathname)
    || (offer.token === "bc-babycare-potty-chair-green" && encodedDestination?.includes("/products/potty-chair"));
  if (!destinationPathMatches) errors.push(`${offer.token} tracking destination does not match its stored destination or approved canonical redirect`);
  if (trackingUrl.searchParams.get("cjsku") !== offer.catalogSku) errors.push(`${offer.token} tracking URL does not match its CJ SKU`);
  if (!offer.allowedDestinationHosts.includes(new URL(offer.destinationUrl).hostname)) errors.push(`${offer.token} destination host is not allowlisted`);
  const verifiedRedirect = cjModule.verifiedCjRedirectUrl({
    trackingUrl: offer.trackingUrl,
    destinationUrl: offer.destinationUrl,
    pid: offer.pid,
    aid: offer.aid,
    sid: "ct_qualityaudit",
    allowedDestinationHosts: offer.allowedDestinationHosts,
  });
  if (!verifiedRedirect || verifiedRedirect.searchParams.get("sid") !== "ct_qualityaudit") {
    errors.push(`${offer.token} fails the production CJ redirect validator`);
  }
}
const releaseFamilies = new Set(releaseOffers.map((offer) => offer.familySlug));
for (const family of expectedDualFamilies) if (!releaseFamilies.has(family)) errors.push(`Missing dual-merchant CJ offer for ${family}`);

const heldOffer = offers.find((offer) => offer.token === "bc-babycare-dino-barron-14-2");
if (!heldOffer || heldOffer.releaseCandidate !== "cj-safety-hold-2026-08-11" || heldOffer.publicationStatus !== "draft") {
  errors.push("Dino Barron playpen is not isolated in the safety-hold cohort");
}
if (products.some((product) => product.slug === "bc-babycare-dino-barron-playpen")) errors.push("Safety-held Dino Barron playpen unexpectedly has a release page");

const guidePageSource = fs.readFileSync(guidePagePath, "utf8");
const contentIndexSource = fs.readFileSync(contentIndexPath, "utf8");
const sitesSource = fs.readFileSync(sitesPath, "utf8");
const categoryPageSource = fs.readFileSync(categoryPagePath, "utf8");
if (!guidePageSource.includes("findAuthorizedCjFamilyOffer") || !guidePageSource.includes("family-guide-cj-alternative")) errors.push("Family guides do not render the authorized CJ alternative module");
if (!guidePageSource.includes("We may earn a CJ commission") || !guidePageSource.includes("not an automatic top pick")) errors.push("Family-guide CJ disclosure or recommendation limit is missing");
if (!contentIndexSource.includes("products.push(...cjBabyExpansionProducts)")) errors.push("CJ product pages are not registered in the content index");
if (!sitesSource.includes('slug: "gear"') || !sitesSource.includes('name: "Daily Gear"')) errors.push("Baby Daily Gear category is missing");
if (sitesSource.includes('...(process.env.AFFILIATE_INCLUDE_DRAFTS === "1" ? [{')) errors.push("Baby Daily Gear category is still draft-isolated");
if (!categoryPageSource.includes("Developmental readiness and age limits")) errors.push("Baby Daily Gear category framework is missing");
if (!fs.readFileSync(offersPath, "utf8").includes('process.env.AFFILIATE_INCLUDE_DRAFTS === "1"')) errors.push("Draft CJ redirects are not production-gated");

const report = {
  status: "publication_ready",
  releaseCandidate,
  newUrls: 4,
  cjOnlyProductPages: products.length,
  dualMerchantFamilies: [...expectedDualFamilies],
  exactReleaseOffers: releaseOffers.length,
  heldForSafetyEvidence: heldOffer?.productName ?? "missing",
  productCoreWords: Object.fromEntries(products.map((product) => [product.slug, words([
    product.summary,
    product.verdict,
    product.whyItMatters,
    ...product.pros,
    ...product.cons,
    ...product.evidence,
    ...(product.editorialSections ?? []).flatMap((section) => [section.heading, section.body]),
  ].join(" "))])),
};

console.log("CJ Baby expansion quality audit");
console.log(JSON.stringify(report, null, 2));
if (errors.length) {
  console.error(`\nErrors (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("\nCJ Baby expansion quality audit passed.");
