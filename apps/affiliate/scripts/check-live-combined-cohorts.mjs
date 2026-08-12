import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const affiliateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspaceDir = path.resolve(affiliateDir, "../..");
const expansionLedgerPath = path.join(workspaceDir, "docs", "affiliate-quadruple-expansion-ledger-2026-08-09.csv");
const cohortReviewPath = path.join(workspaceDir, "docs", "affiliate-growth-cohort-review-2026-08-12.md");

const siteHosts = {
  Network: "network.madabase.com",
  Smarthome: "smarthome.madabase.com",
  Homeoffice: "homeoffice.madabase.com",
  Baby: "baby.madabase.com",
  Pets: "pets.madabase.com",
};

function expansionUrls() {
  return fs.readFileSync(expansionLedgerPath, "utf8")
    .split("\n")
    .slice(1)
    .filter(Boolean)
    .map((line) => line.match(/https:\/\/[^,]+/)?.[0])
    .filter(Boolean);
}

function oldThirtyUrls() {
  const section = fs.readFileSync(cohortReviewPath, "utf8")
    .split("## Four-market cohort")[0]
    .split("## Release `8037871`")[1] ?? "";
  return section.split("\n")
    .map((line) => line.match(/^\| (Network|Smarthome|Homeoffice|Baby|Pets) \| `([^`]+)` \|/))
    .filter(Boolean)
    .map((match) => `https://${siteHosts[match[1]]}${match[2]}`);
}

function decodeEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function extractAttribute(tag, attribute) {
  return tag.match(new RegExp(`${attribute}=["']([^"']+)["']`, "i"))?.[1] ?? null;
}

function normalizeUrl(value) {
  try {
    const url = new URL(decodeEntities(value));
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return value;
  }
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "Madabase release auditor/1.0" },
    redirect: "follow",
  });
  return { response, text: await response.text() };
}

const expansion = expansionUrls();
const oldThirty = oldThirtyUrls();
const overlap = expansion.filter((url) => oldThirty.includes(url));
const exactUrls = [...new Set([...expansion, ...oldThirty])];

if (expansion.length !== 757) throw new Error(`Expected 757 expansion URLs; found ${expansion.length}`);
if (oldThirty.length !== 30) throw new Error(`Expected 30 release-8037871 URLs; found ${oldThirty.length}`);

const sitemapByHost = new Map();
for (const host of [...new Set(exactUrls.map((url) => new URL(url).host))]) {
  const sitemapUrl = `https://${host}/sitemap.xml`;
  const { response, text } = await fetchText(sitemapUrl);
  if (!response.ok) throw new Error(`${sitemapUrl} returned ${response.status}`);
  const urls = new Set([...text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => normalizeUrl(match[1])));
  sitemapByHost.set(host, urls);
}

const results = [];
let nextIndex = 0;
const concurrency = Math.min(18, exactUrls.length);

async function worker() {
  while (nextIndex < exactUrls.length) {
    const url = exactUrls[nextIndex++];
    const expected = normalizeUrl(url);
    const errors = [];
    try {
      const { response, text } = await fetchText(url);
      const finalUrl = normalizeUrl(response.url);
      const title = decodeEntities(text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "");
      const h1Count = (text.match(/<h1\b/gi) ?? []).length;
      const linkTags = [...text.matchAll(/<link\b[^>]*>/gi)].map((match) => match[0]);
      const canonicalTag = linkTags.find((tag) => /rel=["']canonical["']/i.test(tag));
      const canonical = canonicalTag ? normalizeUrl(extractAttribute(canonicalTag, "href") ?? "") : null;
      const imageTags = [...text.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
      const hrefs = [...text.matchAll(/href=["']([^"']+)["']/gi)].map((match) => decodeEntities(match[1]));
      const internalContentLinks = new Set(hrefs.filter((href) => {
        try {
          const target = new URL(href, expected);
          return target.host === new URL(expected).host
            && /\/(guides|reviews|best|categories|products)\//.test(target.pathname)
            && normalizeUrl(target.toString()) !== expected;
        } catch {
          return false;
        }
      }));
      const host = new URL(expected).host;
      const isCostume = host === "costumes.madabase.com";
      const amazonLinks = hrefs.filter((href) => /^https:\/\/www\.amazon\.com\/dp\/[A-Z0-9]{10}/i.test(href));

      if (response.status !== 200) errors.push(`HTTP ${response.status}`);
      if (finalUrl !== expected) errors.push(`redirected to ${finalUrl}`);
      if (!title) errors.push("missing title");
      if (h1Count !== 1) errors.push(`${h1Count} H1 elements`);
      if (canonical !== expected) errors.push(`canonical ${canonical ?? "missing"}`);
      if (/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(text)) errors.push("noindex present");
      if (!sitemapByHost.get(host)?.has(expected)) errors.push("missing from sitemap");
      if (!(text.match(/type=["']application\/ld\+json["']/gi) ?? []).length) errors.push("missing JSON-LD");
      if (!imageTags.length) errors.push("missing image");
      if (imageTags.length && !imageTags.some((tag) => (extractAttribute(tag, "alt") ?? "").trim())) errors.push("missing meaningful image alt");
      if (internalContentLinks.size < 2) errors.push(`${internalContentLinks.size} internal content links`);
      if (!isCostume && expansion.includes(url) && !amazonLinks.length) errors.push("missing exact Amazon product anchor");
      if (amazonLinks.length && !amazonLinks.some((href) => /[?&]tag=[^&]+-20(?:&|$)/.test(href))) errors.push("Amazon anchors have no tracked CTA");

      results.push({
        url,
        cohort: expansion.includes(url) ? "expansion757" : "release8037871",
        status: response.status,
        title,
        canonical,
        images: imageTags.length,
        internalContentLinks: internalContentLinks.size,
        amazonAnchors: amazonLinks.length,
        errors,
      });
    } catch (error) {
      results.push({
        url,
        cohort: expansion.includes(url) ? "expansion757" : "release8037871",
        errors: [error instanceof Error ? error.message : String(error)],
      });
    }
  }
}

await Promise.all(Array.from({ length: concurrency }, () => worker()));

const failures = results.filter((result) => result.errors.length);
const report = {
  checkedAt: new Date().toISOString(),
  expansionUrls: expansion.length,
  oldThirtyUrls: oldThirty.length,
  overlap: overlap.length,
  exactUniqueUrls: exactUrls.length,
  passed: results.length - failures.length,
  failed: failures.length,
  sitemapCounts: Object.fromEntries([...sitemapByHost].map(([host, urls]) => [host, urls.size])),
  failureDetails: failures,
};

console.log("Live combined-cohort audit");
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exit(1);
console.log("\nLive combined-cohort audit passed.");
