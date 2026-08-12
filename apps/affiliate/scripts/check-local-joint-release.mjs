import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const affiliateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localOrigin = process.env.AFFILIATE_LOCAL_AUDIT_ORIGIN ?? "http://127.0.0.1:3020";
const publicAudit = process.env.AFFILIATE_PUBLIC_AUDIT === "1";
const domains = {
  network: "network.madabase.com",
  smarthome: "smarthome.madabase.com",
  homeoffice: "homeoffice.madabase.com",
  baby: "baby.madabase.com",
  pet: "pets.madabase.com",
};
const expectedSitemapCounts = { network: 232, smarthome: 249, homeoffice: 254, baby: 233, pet: 221 };

async function loadTsModule(relativePath) {
  const pathname = path.join(affiliateDir, relativePath);
  const output = ts.transpileModule(fs.readFileSync(pathname, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    fileName: pathname,
  }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(output).toString("base64")}`);
}

async function localFetch(publicUrl, options = {}) {
  if (publicAudit) return fetch(publicUrl, options);

  const url = new URL(publicUrl);
  return fetch(`${localOrigin}${url.pathname}${url.search}`, {
    ...options,
    headers: {
      host: url.host,
      "x-forwarded-host": url.host,
      "x-forwarded-proto": "https",
      ...(options.headers ?? {}),
    },
  });
}

function canonicalFrom(html) {
  const tags = [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]);
  const tag = tags.find((value) => /rel=["']canonical["']/i.test(value));
  return tag?.match(/href=["']([^"']+)["']/i)?.[1]?.replaceAll("&amp;", "&") ?? null;
}

const pilot1 = await loadTsModule("lib/broad-product-pilot-content.ts");
const pilot2 = await loadTsModule("lib/broad-product-pilot-2-content.ts");
const pilot3 = await loadTsModule("lib/broad-product-pilot-3-content.ts");
const cjProductsModule = await loadTsModule("lib/cj-baby-expansion-content.ts");
const cjOffersModule = await loadTsModule("lib/cj-offers.ts");
const broadGuides = [
  ...pilot1.broadProductPilotGuides,
  ...pilot2.broadProductPilot2Guides,
  ...pilot3.broadProductPilot3Guides,
];
const cjProducts = cjProductsModule.cjBabyExpansionProducts;
const newUrls = [
  ...broadGuides.map((guide) => `https://${domains[guide.site]}/guides/${guide.slug}`),
  ...cjProducts.map((product) => `https://baby.madabase.com/reviews/${product.slug}`),
  "https://baby.madabase.com/categories/gear",
];
const repairedUrls = [
  "https://network.madabase.com/guides/xfinity-gateway-bridge-mode-vs-own-router-guide",
  "https://homeoffice.madabase.com/guides/48-vs-55-inch-desk-guide",
  "https://pets.madabase.com/guides/automatic-feeder-buying-guide",
  "https://pets.madabase.com/guides/automatic-feeder-portion-size-guide",
  "https://pets.madabase.com/guides/automatic-feeder-cleaning-checklist",
  "https://baby.madabase.com/guides/ergobaby-omni-breeze-vs-babybjorn-harmony-by-age",
  "https://baby.madabase.com/guides/babybjorn-harmony-newborn-fit-checklist",
  "https://homeoffice.madabase.com/guides/monitor-arm-clamp-reinforcement-guide",
];

if (broadGuides.length !== 60 || cjProducts.length !== 3 || newUrls.length !== 64) {
  throw new Error(`Joint release inventory mismatch: ${broadGuides.length} guides, ${cjProducts.length} products, ${newUrls.length} URLs`);
}

const sitemapByHost = new Map();
for (const [site, host] of Object.entries(domains)) {
  const response = await localFetch(`https://${host}/sitemap.xml`);
  const text = await response.text();
  const urls = new Set([...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
  sitemapByHost.set(host, urls);
  if (response.status !== 200) throw new Error(`${host} sitemap returned ${response.status}`);
  if (urls.size !== expectedSitemapCounts[site]) throw new Error(`${host} sitemap has ${urls.size}; expected ${expectedSitemapCounts[site]}`);
}

const failures = [];
for (const publicUrl of [...newUrls, ...repairedUrls]) {
  const response = await localFetch(publicUrl);
  const html = await response.text();
  const errors = [];
  const isNew = newUrls.includes(publicUrl);
  const isBroadGuide = broadGuides.some((guide) => publicUrl.endsWith(`/guides/${guide.slug}`));
  const isCjProduct = cjProducts.some((product) => publicUrl.endsWith(`/reviews/${product.slug}`));
  if (response.status !== 200) errors.push(`HTTP ${response.status}`);
  if (!(html.match(/<title[^>]*>[^<]+<\/title>/i))) errors.push("missing title");
  if ((html.match(/<h1\b/gi) ?? []).length !== 1) errors.push("not exactly one H1");
  if (canonicalFrom(html) !== publicUrl) errors.push(`canonical ${canonicalFrom(html) ?? "missing"}`);
  if (/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) errors.push("noindex present");
  if (!sitemapByHost.get(new URL(publicUrl).host)?.has(publicUrl)) errors.push("missing from sitemap");
  if (!(html.match(/type=["']application\/ld\+json["']/gi) ?? []).length) errors.push("missing JSON-LD");
  if (publicUrl !== "https://baby.madabase.com/categories/gear" && !(html.match(/<img\b[^>]*alt=["'][^"']+["']/i))) errors.push("missing meaningful image");
  if (isBroadGuide && !/https:\/\/www\.amazon\.com\/dp\/[A-Z0-9]{10}\?[^"']*tag=[^&"']+-20/i.test(html.replaceAll("&amp;", "&"))) errors.push("missing tracked exact Amazon CTA");
  if (isCjProduct && (!/href=["']\/go\/cj\//i.test(html) || !/rel=["'][^"']*sponsored[^"']*nofollow/i.test(html))) errors.push("missing sponsored/nofollow local CJ CTA");
  if (isNew && publicUrl.endsWith("/categories/gear") && !html.includes("Developmental readiness and age limits")) errors.push("Daily Gear framework missing");
  if (errors.length) failures.push({ publicUrl, errors });
}

const releaseOffers = cjOffersModule.authorizedCjOffers.filter((offer) => offer.releaseCandidate === "breadth-64-2026-08-16");
for (const offer of releaseOffers) {
  const response = await localFetch(`https://baby.madabase.com/go/cj/${offer.token}`, { redirect: "manual" });
  const location = response.headers.get("location") ?? "";
  const localDatabaseGate = response.status === 503 && (await response.text()).includes('"reason":"database_not_configured"');
  const trackedRedirect = [301, 302, 303, 307, 308].includes(response.status) && location.includes(offer.catalogSku);
  if (!localDatabaseGate && !trackedRedirect) {
    failures.push({ publicUrl: `https://baby.madabase.com/go/cj/${offer.token}`, errors: [`redirect ${response.status} ${location}`] });
  }
}

for (const heldPath of [
  "https://baby.madabase.com/reviews/bc-babycare-dino-barron-playpen",
  "https://baby.madabase.com/go/cj/bc-babycare-dino-barron-14-2",
]) {
  const response = await localFetch(heldPath, { redirect: "manual" });
  if (response.status !== 404) failures.push({ publicUrl: heldPath, errors: [`safety-held route returned ${response.status}`] });
}

const report = {
  checkedAt: new Date().toISOString(),
  newUrls: newUrls.length,
  repairedUrls: repairedUrls.length,
  exactCheckedPages: newUrls.length + repairedUrls.length,
  cjRedirects: releaseOffers.length,
  sitemapCounts: Object.fromEntries([...sitemapByHost].map(([host, urls]) => [host, urls.size])),
  safetyHeldRoutes: 2,
  passed: newUrls.length + repairedUrls.length + releaseOffers.length + 2 - failures.length,
  failed: failures.length,
  failures,
  newUrlsBySite: Object.fromEntries(Object.entries(domains).map(([site, host]) => [site, newUrls.filter((url) => new URL(url).host === host).length])),
  newUrls,
  repairedUrls,
};

console.log(`${publicAudit ? "Public" : "Local"} joint-release audit`);
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
console.log(`\n${publicAudit ? "Public" : "Local"} joint-release audit passed.`);
