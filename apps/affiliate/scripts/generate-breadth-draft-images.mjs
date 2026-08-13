import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const affiliateRoot = resolve(scriptDir, "..");
const outputDir = join(affiliateRoot, "public/images/affiliate");
const sourceDir = join(affiliateRoot, "assets/breadth-imagegen");

const productFiles = [
  "breadth-draft-network-product-research.json",
  "breadth-draft-smarthome-product-research.json",
  "breadth-draft-homeoffice-product-research.json",
  "breadth-draft-baby-product-research.json",
  "breadth-draft-pet-product-research.json",
];

const siteDesign = {
  network: { label: "NETWORK DECISION GUIDE", accent: "#5eead4", secondary: "#0f766e" },
  smarthome: { label: "SMART HOME DECISION GUIDE", accent: "#fbbf24", secondary: "#b45309" },
  homeoffice: { label: "HOME OFFICE DECISION GUIDE", accent: "#93c5fd", secondary: "#1d4ed8" },
  baby: { label: "BABY CARE DECISION GUIDE", accent: "#a7f3d0", secondary: "#047857" },
  pet: { label: "PET CARE DECISION GUIDE", accent: "#86efac", secondary: "#15803d" },
};

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function shorten(value, maxLength) {
  const normalized = String(value).replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, Math.max(1, maxLength - 1)).replace(/[,;:\s]+$/g, "")}…`;
}

function wrapWords(value, maxCharacters, maxLines) {
  const words = String(value).replace(/\s+/g, " ").trim().split(" ");
  const lines = [];
  let wordIndex = 0;

  while (wordIndex < words.length && lines.length < maxLines) {
    if (lines.length === maxLines - 1) {
      lines.push(shorten(words.slice(wordIndex).join(" "), maxCharacters));
      break;
    }

    let current = words[wordIndex++];
    while (wordIndex < words.length && `${current} ${words[wordIndex]}`.length <= maxCharacters) {
      current = `${current} ${words[wordIndex++]}`;
    }
    lines.push(shorten(current, maxCharacters));
  }

  return lines;
}

function tspans(lines, startY, lineHeight, className) {
  return lines
    .map((line, index) => `<tspan x="72" y="${startY + index * lineHeight}" class="${className}">${escapeXml(line)}</tspan>`)
    .join("");
}

function buildOverlay(product) {
  const design = siteDesign[product.site];
  if (!design) throw new Error(`No image design for site ${product.site}`);

  const titleSize = product.familyName.length > 55 ? 38 : product.familyName.length > 38 ? 42 : 48;
  const titleLines = wrapWords(product.familyName, titleSize <= 38 ? 31 : 28, 3);
  const titleLastY = 176 + (titleLines.length - 1) * 54;
  const checksY = Math.max(350, titleLastY + 68);
  const compareLines = wrapWords(product.alternative, 43, 2);
  const brand = product.brand === "Brand shown on the Amazon listing" ? "Brand verified on listing" : product.brand;

  return Buffer.from(`
    <svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stop-color="#07131d" stop-opacity="0.97"/>
          <stop offset="0.48" stop-color="#07131d" stop-opacity="0.89"/>
          <stop offset="0.68" stop-color="#07131d" stop-opacity="0.25"/>
          <stop offset="1" stop-color="#07131d" stop-opacity="0"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="5" stdDeviation="9" flood-color="#000" flood-opacity="0.28"/>
        </filter>
        <style>
          .sans { font-family: Arial, Helvetica, sans-serif; }
          .label { font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 2.2px; }
          .title { font-family: Arial, Helvetica, sans-serif; font-size: ${titleSize}px; font-weight: 700; letter-spacing: -0.8px; fill: #ffffff; }
          .kicker { font-family: Arial, Helvetica, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; fill: ${design.accent}; }
          .value { font-family: Arial, Helvetica, sans-serif; font-size: 20px; font-weight: 600; fill: #ffffff; }
          .muted { font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: 500; fill: #d5e0e7; }
        </style>
      </defs>
      <rect width="1200" height="800" fill="url(#shade)"/>
      <g filter="url(#shadow)">
        <rect x="66" y="62" width="310" height="42" rx="21" fill="#07131d" fill-opacity="0.76" stroke="${design.accent}" stroke-opacity="0.7"/>
      </g>
      <circle cx="91" cy="83" r="6" fill="${design.accent}"/>
      <text x="108" y="89" class="label" fill="#ffffff">${escapeXml(design.label)}</text>
      <text>${tspans(titleLines, 176, 54, "title")}</text>

      <g transform="translate(66 ${checksY})">
        <rect width="540" height="278" rx="22" fill="#07131d" fill-opacity="0.76" stroke="#ffffff" stroke-opacity="0.14"/>
        <rect width="7" height="278" rx="3.5" fill="${design.accent}"/>

        <text x="28" y="44" class="kicker">DEFINE</text>
        <text x="28" y="72" class="value">${escapeXml(shorten(product.category, 32))} fit before features</text>
        <line x1="28" x2="512" y1="94" y2="94" stroke="#ffffff" stroke-opacity="0.15"/>

        <text x="28" y="129" class="kicker">COMPARE</text>
        <text>${compareLines.map((line, index) => `<tspan x="28" y="${158 + index * 25}" class="value">${escapeXml(line)}</tspan>`).join("")}</text>
        <line x1="28" x2="512" y1="${compareLines.length > 1 ? 204 : 185}" y2="${compareLines.length > 1 ? 204 : 185}" stroke="#ffffff" stroke-opacity="0.15"/>

        <text x="28" y="${compareLines.length > 1 ? 236 : 217}" class="kicker">VERIFY EXACT ANCHOR</text>
        <text x="28" y="${compareLines.length > 1 ? 264 : 247}" class="value">ASIN ${escapeXml(product.asin)}</text>
        <text x="242" y="${compareLines.length > 1 ? 263 : 246}" class="muted">${escapeXml(shorten(brand, 25))}</text>
      </g>

      <g transform="translate(66 748)">
        <rect width="346" height="34" rx="17" fill="${design.secondary}" fill-opacity="0.92"/>
        <text x="18" y="23" class="label" fill="#ffffff" style="font-size:12px;letter-spacing:1.3px">RESEARCH DRAFT • RELEASE CHECK REQUIRED</text>
      </g>
    </svg>
  `);
}

const productSets = await Promise.all(
  productFiles.map(async (file) => JSON.parse(await readFile(join(affiliateRoot, "config", file), "utf8"))),
);
const products = productSets.flatMap((set) => set.products);
await mkdir(outputDir, { recursive: true });

const manifest = [];
for (const product of products) {
  const source = join(sourceDir, `${product.site}.png`);
  const filename = `breadth-${product.site}-${product.familySlug}.webp`;
  const destination = join(outputDir, filename);
  const image = await sharp(source)
    .resize(1200, 800, { fit: "cover", position: "center" })
    .composite([{ input: buildOverlay(product), left: 0, top: 0 }])
    .webp({ quality: 82, smartSubsample: true, effort: 5 })
    .toBuffer();
  await writeFile(destination, image);
  manifest.push({
    site: product.site,
    familySlug: product.familySlug,
    familyName: product.familyName,
    asin: product.asin,
    file: `/images/affiliate/${filename}`,
    bytes: image.length,
    sha256: createHash("sha256").update(image).digest("hex"),
  });
}

await writeFile(
  join(affiliateRoot, "config/breadth-draft-120-plus-image-manifest.json"),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), publicationStatus: "draft", count: manifest.length, images: manifest }, null, 2)}\n`,
);

console.log(JSON.stringify({ status: "generated", count: manifest.length, bySite: Object.fromEntries(Object.keys(siteDesign).map((site) => [site, manifest.filter((item) => item.site === site).length])), uniqueHashes: new Set(manifest.map((item) => item.sha256)).size, totalBytes: manifest.reduce((sum, item) => sum + item.bytes, 0) }, null, 2));
