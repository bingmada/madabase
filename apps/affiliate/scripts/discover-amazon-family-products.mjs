import fs from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  amazonFamilyRelevanceOverrides,
  amazonFamilySearchOverrides,
  amazonFamilyTitleMeetsPolicy,
} from "./amazon-family-semantic-policy.mjs";

const root = path.resolve(new URL("../../..", import.meta.url).pathname);
const defaultFamilySourcePath = path.join(root, "apps/affiliate/lib/quadruple-expansion-content.ts");
const defaultOutputPath = path.join(root, "docs/affiliate-amazon-family-products-2026-08-09.json");
const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36";
const supportedSites = new Set(["network", "smarthome", "homeoffice", "baby", "pet"]);
const stopWords = new Set([
  "a", "an", "and", "appliance", "appliances", "automatic", "baby", "dedicated", "desktop", "device", "devices",
  "for", "home", "indoor", "large", "motorized", "network", "office", "outdoor", "pet", "plus", "smart", "the",
  "with", "wireless",
]);
const execFileAsync = promisify(execFile);

function valueFor(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function integerValue(name, fallback) {
  const raw = valueFor(name);
  if (raw === undefined) return fallback;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 0) throw new Error(`${name} must be a non-negative integer`);
  return parsed;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function plainText(value = "") {
  return decodeHtml(value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function normalizedTokens(value) {
  return value
    .toLowerCase()
    .replace(/wi[\s-]?fi/g, " wifi ")
    .replace(/10[\s-]?(?:gbe|gigabit|g)/g, " 10gbe ")
    .replace(/2\.5[\s-]?(?:gbe|gigabit|g)/g, " 2.5gbe ")
    .replace(/sfp\+/g, " sfp ")
    .replace(/usb[\s-]?c/g, " usbc ")
    .replace(/air[\s-]?tag/g, " airtag ")
    .replace(/mm[\s-]?wave/g, " mmwave ")
    .replace(/[^a-z0-9.]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 1 && !stopWords.has(token))
    .map((token) => token.length > 4 && token.endsWith("ies") ? `${token.slice(0, -3)}y` : token.length > 4 && token.endsWith("s") && !token.endsWith("ss") ? token.slice(0, -1) : token);
}

function relevanceScore(familyName, title, rank) {
  const familyTokens = [...new Set(normalizedTokens(familyName))];
  const titleTokens = new Set(normalizedTokens(title));
  const overlap = familyTokens.filter((token) => titleTokens.has(token));
  const coverage = familyTokens.length ? overlap.length / familyTokens.length : 0;
  const exactPhrase = plainText(title).toLowerCase().includes(plainText(familyName).toLowerCase()) ? 2 : 0;
  const rankBonus = Math.max(0, 1 - rank * 0.04);
  return Number((coverage * 10 + overlap.length * 1.5 + exactPhrase + rankBonus).toFixed(3));
}

function minimumRelevance(familyName) {
  const count = new Set(normalizedTokens(familyName)).size;
  return count <= 1 ? 5 : count === 2 ? 6 : 6.5;
}

function parseSearchResults(html, familyName) {
  const chunks = html.match(/<div[^>]+data-component-type="s-search-result"[\s\S]*?(?=<div[^>]+data-component-type="s-search-result"|<\/body>)/gi) ?? [];
  const records = [];

  for (const [rank, chunk] of chunks.entries()) {
    const asin = chunk.match(/data-asin="([A-Z0-9]{10})"/i)?.[1]?.toUpperCase();
    const titleAriaLabel = chunk.match(/<h2[^>]+aria-label="([^"]+)"/i)?.[1];
    const titleBlocks = [...chunk.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)];
    const title = plainText(titleAriaLabel ?? titleBlocks.at(-1)?.[1] ?? "");
    if (!asin || !title) continue;

    records.push({
      asin,
      title,
      rank: rank + 1,
      sponsored: /\bSponsored\b/i.test(plainText(chunk.slice(0, 2500))),
      relevanceScore: relevanceScore(familyName, title, rank),
    });
  }

  return records.sort((left, right) => right.relevanceScore - left.relevanceScore || left.rank - right.rank);
}

function extractDetailTitle(html) {
  return plainText(
    html.match(/id="productTitle"[^>]*>([\s\S]*?)<\//i)?.[1]
      ?? html.match(/<meta[^>]+property="og:title"[^>]+content="([^"]+)"/i)?.[1]
      ?? html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
      ?? "",
  ).replace(/\s*:\s*Amazon\.com.*$/i, "").replace(/\s*-\s*Amazon\.com.*$/i, "").trim();
}

function extractBrand(html) {
  const byline = plainText(html.match(/id="bylineInfo"[^>]*>([\s\S]*?)<\//i)?.[1] ?? "")
    .replace(/^(Visit the|Brand:|Shop the)\s+/i, "")
    .replace(/\s+Store$/i, "")
    .trim();
  return byline || "Brand shown on the Amazon listing";
}

function primaryAvailabilityText(html) {
  const buyBox = html.match(/id="availabilityInsideBuyBox_feature_div"[\s\S]*?(?=<div[^>]+id="(?:quantityLimit|alternativeProduct|globalStore|quantityRelocate))/i)?.[0];
  const availability = html.match(/<div id="availability"[\s\S]*?<\/div>/i)?.[0];
  return plainText(buyBox ?? availability ?? "");
}

function looksBlocked(html) {
  return /enter the characters you see below|sorry, we just need to make sure|sorry! something went wrong|automated access|api-services-support|captcha/i.test(html);
}

async function fetchHtmlWithCurl(url) {
  const { stdout } = await execFileAsync("curl", [
    "--silent",
    "--show-error",
    "--location",
    "--compressed",
    "--max-time", "45",
    "--header", "accept-language: en-US,en;q=0.9",
    "--header", "cache-control: no-cache",
    "--user-agent", userAgent,
    "--cookie", "lc-main=en_US",
    url,
  ], { maxBuffer: 20 * 1024 * 1024 });
  if (!stdout || looksBlocked(stdout)) throw new Error("curl_fallback_blocked");
  return { status: 200, html: stdout, finalUrl: url };
}

async function fetchHtml(url, retries = 5) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "no-cache",
          "user-agent": userAgent,
        },
        redirect: "follow",
      });
      const html = await response.text();
      if (response.ok && !looksBlocked(html)) return { status: response.status, html, finalUrl: response.url };
      lastError = new Error(`HTTP ${response.status}${looksBlocked(html) ? " blocked" : ""}`);
      if (/HTTP (?:403|429|500|503)|blocked/i.test(lastError.message)) {
        try {
          return await fetchHtmlWithCurl(url);
        } catch (fallbackError) {
          lastError = fallbackError;
        }
      }
    } catch (error) {
      lastError = error;
      // Node's fetch can fail before an HTTP status is available (for example,
      // a transient TLS reset). Treat that as a transport failure and use the
      // same curl fallback as a 403/429 response instead of misclassifying the
      // product family as having no valid Amazon item.
      try {
        return await fetchHtmlWithCurl(url);
      } catch (fallbackError) {
        lastError = fallbackError;
      }
    }
    if (attempt < retries) {
      const blockedBackoff = /HTTP (?:429|503)|blocked/i.test(lastError?.message ?? "") ? attempt * 15000 : attempt * 4000;
      await sleep(blockedBackoff);
    }
  }
  throw lastError;
}

function parseFamilies() {
  const familySourcePath = path.resolve(root, valueFor("--family-source") ?? defaultFamilySourcePath);
  const source = fs.readFileSync(familySourcePath, "utf8");
  if (familySourcePath.endsWith(".json")) {
    const parsed = JSON.parse(source);
    if (Array.isArray(parsed.families)) return parsed.families.filter((family) => supportedSites.has(family.site));
    if (parsed.sites && typeof parsed.sites === "object") {
      return Object.entries(parsed.sites).flatMap(([site, rows]) =>
        supportedSites.has(site) && Array.isArray(rows)
          ? rows.map(([familySlug, familyName]) => ({
              site,
              familySlug,
              familyName,
              category: "research-pending",
              alternative: "the simpler existing setup",
            }))
          : [],
      );
    }
    throw new Error(`Family source ${familySourcePath} does not contain a families array or site seed map`);
  }
  const pattern = /\{ site: "(network|smarthome|homeoffice|baby|pet|costume)", slug: "([^"]+)", name: "([^"]+)", category: "([^"]+)", alternative: "([^"]+)" \}/g;
  return [...source.matchAll(pattern)]
    .map((match) => ({ site: match[1], familySlug: match[2], familyName: match[3], category: match[4], alternative: match[5] }))
    .filter((family) => supportedSites.has(family.site));
}

function excludedFamilyKeys() {
  const exclusionSource = valueFor("--exclude-source");
  if (!exclusionSource) return new Set();
  const exclusionPath = path.resolve(root, exclusionSource);
  const payload = JSON.parse(fs.readFileSync(exclusionPath, "utf8"));
  if (!Array.isArray(payload.exclusions)) {
    throw new Error(`Exclusion source ${exclusionPath} does not contain an exclusions array`);
  }
  return new Set(payload.exclusions.map((item) => `${item.site}:${item.familySlug}`));
}

function existingAsins() {
  const contentDirectory = path.join(root, "apps/affiliate/lib");
  const files = fs.readdirSync(contentDirectory).filter((name) => name.endsWith(".ts"));
  return new Set(files.flatMap((name) => [...fs.readFileSync(path.join(contentDirectory, name), "utf8").matchAll(/\b(B[A-Z0-9]{9})\b/g)].map((match) => match[1])));
}

function readResume(pathname) {
  if (!fs.existsSync(pathname)) return { products: [], failures: [] };
  const parsed = JSON.parse(fs.readFileSync(pathname, "utf8"));
  if (!Array.isArray(parsed.products)) throw new Error(`Resume file ${pathname} does not contain a products array`);
  return {
    products: parsed.products,
    failures: Array.isArray(parsed.failures) ? parsed.failures : [],
  };
}

function writeOutput(pathname, products, failures, totals) {
  fs.mkdirSync(path.dirname(pathname), { recursive: true });
  const temporaryPath = `${pathname}.tmp`;
  const payload = {
    generatedAt: new Date().toISOString(),
    source: "Amazon US public listing pages; no price, star rating, review count, or Amazon-hosted image is stored",
    verificationPolicy: "Each selected ASIN appeared in an Amazon search result for the family and its direct /dp/ page returned the same ASIN without a currently-unavailable signal.",
    totals,
    products: [...products].sort((left, right) => left.site.localeCompare(right.site) || left.familySlug.localeCompare(right.familySlug)),
    failures: [...failures].sort((left, right) => left.site.localeCompare(right.site) || left.familySlug.localeCompare(right.familySlug)),
  };
  fs.writeFileSync(temporaryPath, `${JSON.stringify(payload, null, 2)}\n`, { mode: 0o600 });
  fs.renameSync(temporaryPath, pathname);
}

async function verifyCandidate(family, candidate, delayMs) {
  await sleep(delayMs);
  const detailUrl = `https://www.amazon.com/dp/${candidate.asin}`;
  const detail = await fetchHtml(detailUrl);
  const directTitle = extractDetailTitle(detail.html) || candidate.title;
  const asinMatched = detail.html.toUpperCase().includes(candidate.asin);
  // Amazon detail pages can mention an unavailable recommendation or variation
  // far below the active offer. Availability must be read from the primary
  // buy box, otherwise an in-stock ASIN can be rejected as a false positive.
  const unavailable = /currently unavailable|we don['’]t know when or if this item will be back in stock|temporarily out of stock/i.test(primaryAvailabilityText(detail.html));
  const semanticMatch = amazonFamilyTitleMeetsPolicy(family.familySlug, directTitle);
  const titleWordCount = plainText(directTitle).split(/\s+/).filter(Boolean).length;
  const directRelevance = relevanceScore(family.familyName, directTitle, candidate.rank - 1);
  const threshold = minimumRelevance(family.familyName);
  if (!asinMatched || unavailable || titleWordCount < 5 || !semanticMatch || directRelevance < threshold) {
    return { ok: false, reason: !asinMatched ? "asin_not_confirmed" : unavailable ? "currently_unavailable" : titleWordCount < 5 ? "insufficient_detail_title" : !semanticMatch ? "semantic_policy_rejected" : "low_detail_relevance", directTitle, directRelevance };
  }
  return {
    ok: true,
    product: {
      ...family,
      asin: candidate.asin,
      title: directTitle,
      brand: extractBrand(detail.html),
      detailUrl,
      verifiedAt: new Date().toISOString(),
      searchRank: candidate.rank,
      sponsoredSearchResult: candidate.sponsored,
      relevanceScore: directRelevance,
      validation: {
        directStatus: detail.status,
        asinMatched,
        unavailable,
      },
    },
  };
}

async function main() {
  const outputPath = path.resolve(root, valueFor("--output") ?? defaultOutputPath);
  const siteFilter = valueFor("--site");
  const familySlugFilter = new Set((valueFor("--families") ?? "").split(",").map((value) => value.trim()).filter(Boolean));
  const manualAsins = new Map((valueFor("--manual-asins") ?? "").split(",").map((value) => value.trim()).filter(Boolean).map((entry) => {
    const [familySlug, asin] = entry.split("=");
    if (!familySlug || !/^[A-Z0-9]{10}$/i.test(asin ?? "")) throw new Error(`Invalid --manual-asins entry: ${entry}`);
    return [familySlug, asin.toUpperCase()];
  }));
  if (siteFilter && !supportedSites.has(siteFilter)) throw new Error(`Unsupported --site ${siteFilter}`);
  const delayMs = integerValue("--delay-ms", 1200);
  const limit = integerValue("--limit", Number.MAX_SAFE_INTEGER);
  const resume = hasFlag("--resume");
  const retryFailures = hasFlag("--retry-failures");
  const excludedKeys = excludedFamilyKeys();
  const allFamilies = parseFamilies()
    .filter((family) => !siteFilter || family.site === siteFilter)
    .filter((family) => familySlugFilter.size === 0 || familySlugFilter.has(family.familySlug))
    .filter((family) => !excludedKeys.has(`${family.site}:${family.familySlug}`));
  const allFamilyKeys = new Set(allFamilies.map((family) => `${family.site}:${family.familySlug}`));
  const prior = resume ? readResume(outputPath) : { products: [], failures: [] };
  const priorProducts = prior.products.filter((product) => allFamilyKeys.has(`${product.site}:${product.familySlug}`));
  const priorFailures = (retryFailures ? [] : prior.failures)
    .filter((failure) => allFamilyKeys.has(`${failure.site}:${failure.familySlug}`));
  const completedKeys = new Set([
    ...priorProducts.map((product) => `${product.site}:${product.familySlug}`),
    ...priorFailures.map((failure) => `${failure.site}:${failure.familySlug}`),
  ]);
  const families = allFamilies.filter((family) => !completedKeys.has(`${family.site}:${family.familySlug}`)).slice(0, limit);
  const usedAsins = existingAsins();
  for (const product of priorProducts) usedAsins.add(product.asin);
  const products = [...priorProducts];
  const failures = [...priorFailures];

  for (const [index, family] of families.entries()) {
    try {
      await sleep(index === 0 ? 0 : delayMs);
      const relevanceName = amazonFamilyRelevanceOverrides[family.familySlug] ?? family.familyName;
      const manualAsin = manualAsins.get(family.familySlug);
      let candidates;
      if (manualAsin) {
        candidates = usedAsins.has(manualAsin) ? [] : [{ asin: manualAsin, title: "", rank: 1, sponsored: false, relevanceScore: 0 }];
      } else {
        const searchName = amazonFamilySearchOverrides[family.familySlug] ?? family.familyName;
        const searchUrl = `https://www.amazon.com/s?k=${encodeURIComponent(searchName)}`;
        const search = await fetchHtml(searchUrl);
        const parsedCandidates = parseSearchResults(search.html, relevanceName);
        candidates = parsedCandidates
          .filter((candidate) => amazonFamilyTitleMeetsPolicy(family.familySlug, candidate.title))
          .filter((candidate) => !usedAsins.has(candidate.asin) && candidate.relevanceScore >= minimumRelevance(relevanceName))
          .slice(0, 5);
        if (!candidates.length) {
          const sample = parsedCandidates.slice(0, 3).map((candidate) => ({
            asin: candidate.asin,
            title: candidate.title,
            score: candidate.relevanceScore,
            semanticMatch: amazonFamilyTitleMeetsPolicy(family.familySlug, candidate.title),
            alreadyUsed: usedAsins.has(candidate.asin),
          }));
          throw new Error(`no_relevant_unique_search_result:${JSON.stringify({ parsed: parsedCandidates.length, threshold: minimumRelevance(relevanceName), sample })}`);
        }
      }
      if (!candidates.length) throw new Error("no_relevant_unique_search_result");

      let selected;
      const rejected = [];
      for (const candidate of candidates) {
        const verified = await verifyCandidate({ ...family, familyName: relevanceName }, candidate, delayMs);
        if (verified.ok) {
          selected = verified.product;
          break;
        }
        rejected.push({ asin: candidate.asin, reason: verified.reason, title: verified.directTitle, relevanceScore: verified.directRelevance });
      }
      if (!selected) throw new Error(`no_verified_candidate:${JSON.stringify(rejected)}`);

      products.push({ ...selected, familyName: family.familyName });
      usedAsins.add(selected.asin);
      console.log(JSON.stringify({ progress: `${completedKeys.size + index + 1}/${allFamilies.length}`, site: family.site, family: family.familySlug, asin: selected.asin, title: selected.title, score: selected.relevanceScore }));
    } catch (error) {
      const failure = { ...family, error: error instanceof Error ? error.message : String(error) };
      failures.push(failure);
      console.error(JSON.stringify({ site: family.site, family: family.familySlug, error: failure.error }));
      if (/HTTP (?:429|503)|blocked/i.test(failure.error)) {
        writeOutput(outputPath, products, failures, { requestedFamilies: allFamilies.length, selected: products.length, failed: failures.length, remaining: Math.max(0, allFamilies.length - products.length - failures.length) });
        throw error;
      }
    }
    writeOutput(outputPath, products, failures, { requestedFamilies: allFamilies.length, selected: products.length, failed: failures.length, remaining: Math.max(0, allFamilies.length - products.length - failures.length) });
  }

  writeOutput(outputPath, products, failures, { requestedFamilies: allFamilies.length, selected: products.length, failed: failures.length, remaining: Math.max(0, allFamilies.length - products.length - failures.length) });
  if (failures.length) process.exitCode = 2;
}

await main();
