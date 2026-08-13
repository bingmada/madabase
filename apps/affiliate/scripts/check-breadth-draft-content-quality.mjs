import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const affiliateRoot = resolve(scriptDir, "..");
const configDir = join(affiliateRoot, "config");
const publicDir = join(affiliateRoot, "public");

const productFiles = [
  "breadth-draft-network-product-research.json",
  "breadth-draft-smarthome-product-research.json",
  "breadth-draft-homeoffice-product-research.json",
  "breadth-draft-baby-product-research.json",
  "breadth-draft-pet-product-research.json",
];

const readJson = async (file) => JSON.parse(await readFile(join(configDir, file), "utf8"));
const [pool, opportunities, imageManifest, communityEvidence, ...productSets] = await Promise.all([
  readJson("breadth-draft-120-150-research-pool.json"),
  readJson("breadth-draft-120-plus-opportunity-evidence.json"),
  readJson("breadth-draft-120-plus-image-manifest.json"),
  readJson("breadth-draft-120-plus-community-evidence.json"),
  ...productFiles.map(readJson),
]);

const products = productSets.flatMap((set) => set.products);
const familyByKey = new Map(pool.families.map((item) => [`${item.site}:${item.familySlug}`, item]));
const opportunityByKey = new Map(opportunities.records.map((item) => [`${item.site}:${item.familySlug}`, item]));
const imageByKey = new Map(imageManifest.images.map((item) => [`${item.site}:${item.familySlug}`, item]));
const communityByKey = new Map(communityEvidence.discussions.map((item) => [`${item.site}:${item.familySlug}`, item]));
const keys = products.map((item) => `${item.site}:${item.familySlug}`);
const problems = [];
const warnings = [];
const fileHashes = new Set();

function compactTitle(family) {
  const suffixes = {
    network: "Compatibility, Installation, and Testing",
    smarthome: "Fit, Local Control, and Safety",
    homeoffice: "Workspace Fit, Workflow, and Ownership Cost",
    baby: "Fit, Cleaning, and Safety Checks",
    pet: "Sizing, Setup, and Safe Use",
  };
  const detailed = `${family.familyName} Buying Guide: ${suffixes[family.site]}`;
  if (detailed.length <= 72) return detailed;
  const compact = `${family.familyName}: Fit, Trade-offs & Buying Guide`;
  return compact.length <= 72 ? compact : `${family.familyName} Buying Guide`;
}

for (const product of products) {
  const key = `${product.site}:${product.familySlug}`;
  const family = familyByKey.get(key);
  const opportunity = opportunityByKey.get(key);
  const image = imageByKey.get(key);
  const community = communityByKey.get(key);
  if (!family) problems.push(`${key}: missing family record`);
  if (!opportunity) problems.push(`${key}: missing opportunity evidence`);
  if (!image) problems.push(`${key}: missing image manifest record`);
  if (community) {
    if (community.status !== "reviewed_thread") problems.push(`${key}: unsupported community evidence status`);
    if (!/^https:\/\/(www\.)?reddit\.com\/r\/[^/]+\/comments\/[^/]+/i.test(community.url)) problems.push(`${key}: community evidence is not a direct Reddit thread`);
    if (String(community.discussionTitle).length < 6) problems.push(`${key}: community discussion title is missing`);
    if (String(community.relevanceNote).length < 100) problems.push(`${key}: community relevance note is too short`);
    if (String(community.usePolicy).length < 60) problems.push(`${key}: community evidence use policy is too short`);
  }
  if (!family || !opportunity || !image) continue;

  if (opportunity.scores.total < 70) problems.push(`${key}: opportunity score below 70`);
  if (!Array.isArray(opportunity.evidence) || opportunity.evidence.length < 2) problems.push(`${key}: fewer than two decision sources`);
  if (String(opportunity.note).length < 120) problems.push(`${key}: independent buying note is too short`);
  if (compactTitle(family).length > 72) problems.push(`${key}: SEO title exceeds 72 characters`);
  if (product.detailUrl !== `https://www.amazon.com/dp/${product.asin}`) problems.push(`${key}: detail URL does not match ASIN`);
  if (product.validation?.directStatus !== 200 || !product.validation?.asinMatched || product.validation?.unavailable) problems.push(`${key}: exact Amazon validation is incomplete`);

  const absoluteImage = join(publicDir, image.file);
  try {
    await access(absoluteImage);
    const imageBuffer = await readFile(absoluteImage);
    const hash = createHash("sha256").update(imageBuffer).digest("hex");
    const metadata = await sharp(imageBuffer).metadata();
    if (metadata.width !== 1200 || metadata.height !== 800 || metadata.format !== "webp") problems.push(`${key}: image must be a 1200x800 WebP`);
    if (hash !== image.sha256) problems.push(`${key}: image hash differs from manifest`);
    if (fileHashes.has(hash)) problems.push(`${key}: image duplicates another family`);
    fileHashes.add(hash);
  } catch (error) {
    problems.push(`${key}: image cannot be read (${error.message})`);
  }
}

const existingKeys = new Set(keys);
if (products.length < 120) problems.push(`selected product count ${products.length} is below the 120-page floor`);
if (new Set(keys).size !== products.length) problems.push("selected product families are not unique");
if (new Set(products.map((item) => item.asin)).size !== products.length) problems.push("selected ASINs are not unique");
if (imageManifest.count !== products.length || imageManifest.images.length !== products.length) problems.push("image manifest count differs from selected product count");
if ([...imageByKey.keys()].some((key) => !existingKeys.has(key))) problems.push("image manifest contains a non-selected family");
if ([...communityByKey.keys()].some((key) => !existingKeys.has(key))) problems.push("community evidence contains a non-selected family");
if (new Set(communityEvidence.discussions.map((item) => item.url)).size !== communityEvidence.discussions.length) problems.push("community discussion URLs are not unique");

const contentSource = await readFile(join(affiliateRoot, "lib/breadth-draft-120-plus-content.ts"), "utf8");
const inventorySource = await readFile(join(affiliateRoot, "lib/amazon-family-products.ts"), "utf8");
const sitemapSource = await readFile(join(affiliateRoot, "app/sitemap.ts"), "utf8");
if (!contentSource.includes('publicationStatus: "published"')) problems.push("guide module does not explicitly publish the cohort");
if (!contentSource.includes("sitemapExcluded: true")) problems.push("guide module does not explicitly exclude the soft-launch cohort from sitemap");
if (!contentSource.includes("releaseCandidate")) problems.push("guide module does not record a release candidate");
if (!contentSource.includes("relatedDraftGuides") || !contentSource.includes("communityEvidence") || !contentSource.includes("comparisonTable")) problems.push("guide module is missing required editorial structures");
if (!inventorySource.includes('publicationStatus: "published" as const')) problems.push("Amazon inventory does not publish cohort product anchors");
if (!sitemapSource.includes("siteGuides(site.key).filter((item) => !item.sitemapExcluded)")) problems.push("sitemap does not explicitly exclude soft-launch guides");

const missingCommunityKeys = keys.filter((key) => !communityByKey.has(key));
if (missingCommunityKeys.length > 0) warnings.push(`${missingCommunityKeys.length} pages still require a named, reviewed community thread before publication`);
const pendingProductCount = productSets.reduce((sum, set) => sum + (set.totals?.pending ?? 0), 0);
if (pendingProductCount > 0) warnings.push(`${pendingProductCount} eligible research families remain pending exact-product verification and are not part of this cohort`);

const bySite = Object.fromEntries(["network", "smarthome", "homeoffice", "baby", "pet"].map((site) => [site, products.filter((item) => item.site === site).length]));
const result = {
  status: problems.length === 0 ? "soft_launch_valid" : "invalid",
  selected: products.length,
  bySite,
  uniqueFamilies: new Set(keys).size,
  uniqueAsins: new Set(products.map((item) => item.asin)).size,
  uniqueImages: fileHashes.size,
  problems,
  releaseBlockers: warnings,
};

console.log(JSON.stringify(result, null, 2));
if (problems.length > 0) process.exitCode = 1;
