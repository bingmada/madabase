import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const workspaceDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const libDir = path.join(workspaceDir, "lib");
const sourcePath = path.join(libDir, "quadruple-expansion-content.ts");
const briefPath = path.join(libDir, "quadruple-family-editorial.ts");
const communityPath = path.join(workspaceDir, "config", "quadruple-community-evidence.json");
const deepRankRecoveryPath = path.join(workspaceDir, "config", "deep-rank-recovery-2026-08-27.json");
const amazonPath = path.join(workspaceDir, "config", "amazon-family-products.json");

function transpile(filePath) {
  return ts.transpileModule(fs.readFileSync(filePath, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    fileName: filePath,
  }).outputText;
}

const community = JSON.parse(fs.readFileSync(communityPath, "utf8"));
const deepRankRecovery = JSON.parse(fs.readFileSync(deepRankRecoveryPath, "utf8"));
const amazon = JSON.parse(fs.readFileSync(amazonPath, "utf8"));
const contentJavascript = transpile(sourcePath)
  .replace(/^import communityEvidenceData[^;]+;\n/m, "")
  .replace(/^import deepRankRecoveryData[^;]+;\n/m, "")
  .replace(/^import \{ findFamilyEditorialBrief \}[^;]+;\n/m, "");
const javascript = `${transpile(briefPath)}\nconst communityEvidenceData = ${JSON.stringify(community)};\nconst deepRankRecoveryData = ${JSON.stringify(deepRankRecovery)};\n${contentJavascript}`;
const expansion = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);
const guides = expansion.quadrupleExpansionGuides;
const errors = [];

function words(value) {
  return String(value ?? "").trim().split(/\s+/).filter(Boolean).length;
}

function uniqueCount(values) {
  return new Set(values).size;
}

if (guides.length !== 757) errors.push(`Expected 757 governed URLs; found ${guides.length}`);
if (expansion.quadrupleExpansionFamilies.length !== 154) errors.push(`Expected 154 families; found ${expansion.quadrupleExpansionFamilies.length}`);
if (Object.keys(expansion.familyEditorialBriefs).length !== 154) errors.push(`Expected 154 editorial briefs; found ${Object.keys(expansion.familyEditorialBriefs).length}`);
if (uniqueCount(guides.map((guide) => guide.searchQuestion)) !== guides.length) errors.push("Search questions are not unique at URL level");
if (uniqueCount(guides.map((guide) => guide.quickAnswer)) !== guides.length) errors.push("Quick answers are not unique at URL level");
if (community.discussions.length !== 113) errors.push(`Expected 113 reviewed community sources; found ${community.discussions.length}`);
if (amazon.products.length !== 144) errors.push(`Expected 144 exact Amazon family anchors; found ${amazon.products.length}`);

const sectionBodies = guides.flatMap((guide) => guide.sections.map((section) => section.body));
const duplicateSectionBodies = sectionBodies.length - uniqueCount(sectionBodies);
const repeatedBodyGroups = [...sectionBodies.reduce((map, body) => map.set(body, (map.get(body) ?? 0) + 1), new Map()).entries()]
  .filter(([, count]) => count > 1)
  .sort((left, right) => right[1] - left[1]);
if (duplicateSectionBodies) errors.push(`${duplicateSectionBodies} section bodies are repeated verbatim across ${repeatedBodyGroups.length} repeated groups`);

const coreWordCounts = guides.map((guide) => words([
  guide.dek,
  guide.searchQuestion,
  guide.quickAnswer,
  ...guide.sections.flatMap((section) => [section.heading, section.body]),
  guide.comparisonTable?.title,
  ...(guide.comparisonTable?.rows.flatMap((row) => [row.label, ...row.values]) ?? []),
].filter(Boolean).join(" ")));
for (const guide of guides) {
  if (guide.governance?.decision !== "rewrite") errors.push(`${guide.site}:${guide.slug} lacks a rewrite governance decision`);
  if (guide.sections.length < 5) errors.push(`${guide.site}:${guide.slug} has fewer than five governed sections`);
  if (!guide.comparisonTable || guide.comparisonTable.rows.length < 6) errors.push(`${guide.site}:${guide.slug} lacks a six-row decision table`);
  if (!guide.sources?.length) errors.push(`${guide.site}:${guide.slug} lacks an authoritative source`);
  if (!guide.image) errors.push(`${guide.site}:${guide.slug} lacks an editorial image`);
}

const images = [...new Set(guides.map((guide) => guide.image))];
if (images.length !== 19) errors.push(`Expected 19 category-specific editorial images; found ${images.length}`);
for (const image of images) {
  const filePath = path.join(workspaceDir, "public", image.replace(/^\//, ""));
  if (!fs.existsSync(filePath)) errors.push(`Missing editorial image file ${image}`);
  else if (fs.statSync(filePath).size < 50_000) errors.push(`Editorial image file is unexpectedly small ${image}`);
}

const report = {
  urls: guides.length,
  families: expansion.quadrupleExpansionFamilies.length,
  uniqueSearchQuestions: uniqueCount(guides.map((guide) => guide.searchQuestion)),
  uniqueQuickAnswers: uniqueCount(guides.map((guide) => guide.quickAnswer)),
  editorialBriefs: Object.keys(expansion.familyEditorialBriefs).length,
  sectionBodies: sectionBodies.length,
  uniqueSectionBodies: uniqueCount(sectionBodies),
  topRepeatedSectionBodies: repeatedBodyGroups.slice(0, 5).map(([body, count]) => ({ count, excerpt: body.slice(0, 180) })),
  editorialImages: images.length,
  communityDiscussions: community.discussions.length,
  exactAmazonAnchors: amazon.products.length,
  coreWords: {
    min: Math.min(...coreWordCounts),
    average: Number((coreWordCounts.reduce((sum, value) => sum + value, 0) / coreWordCounts.length).toFixed(1)),
    max: Math.max(...coreWordCounts),
  },
};

console.log("Governed expansion quality audit");
console.log(JSON.stringify(report, null, 2));
if (errors.length) {
  console.error(`\nErrors (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log("\nGoverned expansion quality audit passed.");
