import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
const productFiles = Object.keys(domains).map((site) => `breadth-draft-${site}-product-research.json`);
const products = productFiles.flatMap((name) => JSON.parse(fs.readFileSync(path.join(affiliateDir, "config", name), "utf8")).products);
const requestedConcurrency = Number(process.env.BREADTH_AUDIT_CONCURRENCY ?? (publicAudit ? 2 : 8));
const concurrency = Math.max(1, Math.min(12, Number.isFinite(requestedConcurrency) ? requestedConcurrency : 2));

if (products.length !== 151) throw new Error(`Expected 151 soft-launch products; found ${products.length}`);

async function publicFetchWithRetry(publicUrl, options) {
  let response;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    response = await fetch(publicUrl, {
      ...options,
      headers: {
        accept: "text/html,application/xhtml+xml",
        "user-agent": "Madabase breadth auditor/1.0",
        ...(options.headers ?? {}),
      },
      signal: AbortSignal.timeout(30_000),
    });
    if (![502, 503, 504].includes(response.status) || attempt === 3) return response;
    await response.body?.cancel();
    await new Promise((resolve) => setTimeout(resolve, attempt * 750));
  }
  return response;
}

async function localFetch(publicUrl, options = {}) {
  if (publicAudit) return publicFetchWithRetry(publicUrl, options);
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
  const tag = [...html.matchAll(/<link\b[^>]*>/gi)]
    .map((match) => match[0])
    .find((value) => /rel=["']canonical["']/i.test(value));
  return tag?.match(/href=["']([^"']+)["']/i)?.[1]?.replaceAll("&amp;", "&") ?? null;
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
let nextIndex = 0;
async function worker() {
  while (nextIndex < products.length) {
    const product = products[nextIndex++];
    const publicUrl = `https://${domains[product.site]}/guides/${product.familySlug}-buying-guide`;
    const response = await localFetch(publicUrl);
    const html = await response.text();
    const errors = [];
    const normalizedHtml = html.replaceAll("&amp;", "&");
    const sitemap = sitemapByHost.get(domains[product.site]);

    if (response.status !== 200) errors.push(`HTTP ${response.status}`);
    if (!/<title[^>]*>[^<]+<\/title>/i.test(html)) errors.push("missing title");
    if ((html.match(/<h1\b/gi) ?? []).length !== 1) errors.push("not exactly one H1");
    if (canonicalFrom(html) !== publicUrl) errors.push(`canonical ${canonicalFrom(html) ?? "missing"}`);
    if (/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) errors.push("noindex present");
    if (sitemap?.has(publicUrl)) errors.push("soft-launch URL is present in sitemap");
    if (!(html.match(/type=["']application\/ld\+json["']/gi) ?? []).length) errors.push("missing JSON-LD");
    if (!new RegExp(`<img\\b[^>]*(?:src|alt)=["'][^"']*breadth-${product.site}-${product.familySlug}`, "i").test(html)) errors.push("dedicated image missing");
    if (!normalizedHtml.includes(product.asin)) errors.push(`ASIN ${product.asin} missing`);
    if (!new RegExp(`https://www\\.amazon\\.com/dp/${product.asin}\\?[^"']*tag=[^&"']+-20`, "i").test(normalizedHtml)) errors.push("tracked exact Amazon link missing");
    if (!/Final checkout checklist/i.test(html)) errors.push("buyer-facing checkout checklist missing");
    if (/What must be rechecked on release day|this draft|keep this page in draft/i.test(html)) errors.push("internal release wording exposed");
    if (errors.length) failures.push({ publicUrl, errors });
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));
const report = {
  checkedAt: new Date().toISOString(),
  mode: publicAudit ? "public" : "local",
  concurrency,
  pages: products.length,
  passed: products.length - failures.length,
  failed: failures.length,
  bySite: Object.fromEntries(Object.keys(domains).map((site) => [site, products.filter((item) => item.site === site).length])),
  sitemapCounts: Object.fromEntries([...sitemapByHost].map(([host, urls]) => [host, urls.size])),
  sitemapIncludedSoftLaunchUrls: products.filter((product) => sitemapByHost.get(domains[product.site])?.has(`https://${domains[product.site]}/guides/${product.familySlug}-buying-guide`)).length,
  failures,
};

console.log(`${publicAudit ? "Public" : "Local"} breadth soft-launch audit`);
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
console.log(`\n${publicAudit ? "Public" : "Local"} breadth soft-launch audit passed.`);
