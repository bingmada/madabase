import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { gzipSync } from "node:zlib";
import { firstCommerceDecision, markedCommerceDecision } from "./lib/conversion-decision-scope.mjs";
import { loadAffiliateTypescript } from "./lib/load-affiliate-typescript.mjs";

const affiliateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localOrigin = process.env.AFFILIATE_LOCAL_AUDIT_ORIGIN ?? "http://127.0.0.1:3020";
const publicAudit = process.env.AFFILIATE_PUBLIC_AUDIT === "1";
const { publishedCommerceInventory } = loadAffiliateTypescript("../../lib/commerce-inventory.ts");
const registeredCommerce = new Map(publishedCommerceInventory().map((item) => [`${item.site}:${item.slug}`, item]));
const { compatibilityTopicForGuide } = loadAffiliateTypescript("../../lib/compatibility-topics.ts");
const { findRoundup } = loadAffiliateTypescript("../../lib/content.ts");
const htmlDirectoryArgument = process.argv.find((argument) => argument.startsWith("--html-dir="));
const htmlDirectory = htmlDirectoryArgument ? path.resolve(htmlDirectoryArgument.slice("--html-dir=".length)) : null;
if (htmlDirectory) fs.mkdirSync(htmlDirectory, { recursive: true });
const expectedReleaseId = process.env.MADABASE_EXPECTED_RELEASE_ID;
const outputArgument = process.argv.find((argument) => argument.startsWith("--json="));
const outputPath = outputArgument
  ? path.resolve(process.cwd(), outputArgument.slice("--json=".length))
  : null;
const concurrencyArgument = process.argv.find((argument) => argument.startsWith("--concurrency="));
const concurrency = Math.max(1, Math.min(24, Number(concurrencyArgument?.slice("--concurrency=".length) ?? (publicAudit ? 2 : 12))));
const includeMarkets = !process.argv.includes("--base-only");
const siteArgument = process.argv.find((argument) => argument.startsWith("--site="));
const retryJsonArgument = process.argv.find((argument) => argument.startsWith("--retry-json="));
const retryJsonPath = retryJsonArgument
  ? path.resolve(process.cwd(), retryJsonArgument.slice("--retry-json=".length))
  : null;

const siteHosts = {
  network: "network.madabase.com",
  smarthome: "smarthome.madabase.com",
  homeoffice: "homeoffice.madabase.com",
  baby: "baby.madabase.com",
  pet: "pets.madabase.com",
};
const siteTrackingIds = {
  network: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_NETWORK ?? "madanetwork-20",
  smarthome: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_SMARTHOME ?? "madasmart-20",
  homeoffice: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_HOMEOFFICE ?? "madaoffice-20",
  baby: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_BABY ?? "madababy-20",
  pet: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_PET ?? "madapets-20",
};
const requestedSites = siteArgument
  ? siteArgument.slice("--site=".length).split(",").flatMap((site) => site === "amazon" ? Object.keys(siteHosts) : site)
  : Object.keys(siteHosts);
const selectedSiteHosts = Object.fromEntries(
  Object.entries(siteHosts).filter(([site]) => requestedSites.includes(site)),
);
if (!Object.keys(selectedSiteHosts).length || requestedSites.some((site) => !(site in siteHosts))) {
  throw new Error(`Invalid --site selection: ${requestedSites.join(", ")}`);
}
const marketPrefixes = ["en-gb", "en-ca", "de-de", "nl-nl"];
const contentPathPattern = /^\/(reviews|guides|best|tools|categories|products)\/[^/]+\/?$/;
const marketContentPathPattern = /^\/(en-gb|en-ca|de-de|nl-nl)\/(reviews|guides|best|tools|categories)\/[^/]+\/?$/;

function decodeEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function extractAttribute(tag, attribute) {
  return tag.match(new RegExp(`${attribute}=["']([^"']+)["']`, "i"))?.[1] ?? null;
}

function normalizeUrl(value) {
  const url = new URL(value);
  url.hash = "";
  return url.toString().replace(/\/$/, "");
}

async function fetchPublicUrl(publicUrl) {
  if (publicAudit) {
    let response;
    let lastError;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        response = await fetch(publicUrl, {
          headers: {
            accept: "text/html,application/xhtml+xml",
            "user-agent": "Madabase conversion-path auditor/1.0",
          },
          redirect: "follow",
          signal: AbortSignal.timeout(30_000),
        });
        if (![502, 503, 504].includes(response.status) || attempt === 3) return response;
        await response.body?.cancel();
      } catch (error) {
        lastError = error;
        if (attempt === 3) throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    }
    if (response) return response;
    throw lastError;
  }

  const url = new URL(publicUrl);
  return fetch(`${localOrigin}${url.pathname}${url.search}`, {
    headers: {
      accept: "text/html,application/xhtml+xml",
      host: url.host,
      "x-forwarded-host": url.host,
      "x-forwarded-proto": "https",
      "user-agent": "Madabase conversion-path auditor/1.0",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(30_000),
  });
}

function softLaunchUrls() {
  const configNames = [
    "breadth-draft-network-product-research.json",
    "breadth-draft-smarthome-product-research.json",
    "breadth-draft-homeoffice-product-research.json",
    "breadth-draft-baby-product-research.json",
    "breadth-draft-pet-product-research.json",
    "next-product-expansion-100-pilot-01.json",
  ];

  return configNames.flatMap((name) => {
    const data = JSON.parse(fs.readFileSync(path.join(affiliateDir, "config", name), "utf8"));
    return (data.products ?? [])
      .filter((product) => product.site in selectedSiteHosts)
      .map((product) => product.pageSlug
        ? `https://${siteHosts[product.site]}/reviews/${product.pageSlug}`
        : `https://${siteHosts[product.site]}/guides/${product.familySlug}-buying-guide`,
      );
  });
}

async function sitemapContentUrls() {
  const urls = [];
  for (const host of Object.values(selectedSiteHosts)) {
    const sitemapUrl = `https://${host}/sitemap.xml`;
    const response = await fetchPublicUrl(sitemapUrl);
    const text = await response.text();
    if (!response.ok) throw new Error(`${sitemapUrl} returned ${response.status}`);
    for (const match of text.matchAll(/<loc>([^<]+)<\/loc>/g)) {
      const url = new URL(decodeEntities(match[1]));
      if (contentPathPattern.test(url.pathname) || marketContentPathPattern.test(url.pathname)) {
        urls.push(normalizeUrl(url.toString()));
      }
    }
  }
  return urls;
}

function expandMarketRoutes(urls) {
  if (!includeMarkets) return urls;
  const expanded = [...urls];
  for (const value of urls) {
    const url = new URL(value);
    if (!contentPathPattern.test(url.pathname)) continue;
    for (const market of marketPrefixes) {
      expanded.push(normalizeUrl(new URL(`/${market}${url.pathname}`, url.origin).toString()));
    }
  }
  return expanded;
}

function siteForHost(host) {
  return Object.entries(siteHosts).find(([, value]) => value === host)?.[0];
}

function pageKind(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  const route = marketPrefixes.includes(parts[0]) ? parts[1] : parts[0];
  return { reviews: "review", guides: "guide", best: "roundup", tools: "tool", categories: "category", products: "catalog-product" }[route] ?? "unknown";
}

function marketForPath(pathname) {
  return marketPrefixes.find((prefix) => pathname.startsWith(`/${prefix}/`)) ?? "us";
}

async function inspectPage(publicUrl) {
  const url = new URL(publicUrl);
  const site = siteForHost(url.host);
  const errors = [];
  try {
    const response = await fetchPublicUrl(publicUrl);
    const html = await response.text();
    const htmlFile = htmlDirectory ? `${createHash("sha256").update(publicUrl).digest("hex").slice(0, 24)}.html.gz` : null;
    if (htmlFile) fs.writeFileSync(path.join(htmlDirectory, htmlFile), gzipSync(html));
    if (expectedReleaseId) {
      const releases = new Set([...html.matchAll(/data-commerce-release=["']([^"']+)["']/g)].map((match) => match[1]));
      if (releases.size !== 1 || !releases.has(expectedReleaseId)) errors.push("wrong or missing commerce release identity");
    }
    const anchorTags = [...html.matchAll(/<a\b[^>]*href=["'][^"']+["'][^>]*>/gi)];
    const affiliateAnchors = anchorTags
      .map((match) => ({
        tag: match[0],
        index: match.index,
        href: decodeEntities(extractAttribute(match[0], "href") ?? ""),
        rel: (extractAttribute(match[0], "rel") ?? "").toLowerCase(),
        source: extractAttribute(match[0], "data-affiliate-link-source"),
        firstViewport: extractAttribute(match[0], "data-first-viewport-affiliate") === "true",
        ctaIntent: extractAttribute(match[0], "data-cta-intent"),
        stickyCommerce: extractAttribute(match[0], "data-sticky-commerce-enabled") === "true",
        productSlug: extractAttribute(match[0], "data-commerce-product"),
        merchant: extractAttribute(match[0], "data-commerce-merchant"),
      }))
      // Amazon detail URLs also appear in editorial source citations. Only
      // instrumented commerce anchors (or sponsored CJ redirects) are CTAs.
      .filter((anchor) =>
        Boolean(anchor.source)
        || (/\/go\/cj\//i.test(anchor.href) && anchor.rel.includes("sponsored")),
      );
    const amazonAnchors = affiliateAnchors.filter((anchor) => /amazon\.com\/dp\//i.test(anchor.href));
    const cjAnchors = affiliateAnchors.filter((anchor) => /\/go\/cj\//i.test(anchor.href));
    const firstViewportAnchors = affiliateAnchors.filter((anchor) => anchor.firstViewport);
    const categoryDiscovery = pageKind(url.pathname) === "category" && anchorTags.some((match) =>
      /^\/(?:(?:en-gb|en-ca|de-de|nl-nl)\/)?(?:reviews|best|guides)\/[a-z0-9-]+\/?$/.test(extractAttribute(match[0], "href") ?? ""));
    const expectedTag = siteTrackingIds[site];
    const firstAffiliateIndex = html.indexOf("data-affiliate-link-source=");
    const firstSponsoredCjIndex = html.search(/<a\b[^>]*href=["'][^"']*\/go\/cj\/[^"']+["'][^>]*rel=["'][^"']*sponsored/i);
    const firstViewportAnchorIndex = html.indexOf("data-first-viewport-affiliate=");
    const firstCommerceIndex = [firstAffiliateIndex, firstSponsoredCjIndex, firstViewportAnchorIndex]
      .filter((index) => index >= 0)
      .sort((a, b) => a - b)[0] ?? -1;
    const firstDecision = firstCommerceDecision(html);
    const guideDecision = pageKind(url.pathname) === "guide"
      ? markedCommerceDecision(html, "data-guide-decision-purchase") : undefined;
    const taskDecision = pageKind(url.pathname) === "guide"
      ? markedCommerceDecision(html, "data-guide-task-paths") : undefined;
    const qualifiedTaskPaths = Boolean(taskDecision && /<h2\b/i.test(taskDecision.html)
      && /href="\/(?:(?:en-gb|en-ca|de-de|nl-nl)\/)?(?:guides|reviews|best|compatibility)\//i.test(taskDecision.html)
      && [...taskDecision.html.matchAll(/<(?:p|li)\b[^>]*>([\s\S]*?)<\/(?:p|li)>/gi)].length >= 2);
    const registeredAnchor = (anchor) => {
      const registered = registeredCommerce.get(`${site}:${anchor.productSlug}`);
      if (!registered?.offers.some((offer) => offer.merchant === anchor.merchant)) return false;
      try {
        const destination = new URL(anchor.href, publicUrl);
        if (["www.amazon.com", "amazon.com"].includes(destination.hostname)) {
          return registered.asin && destination.pathname.match(/^\/dp\/([A-Z0-9]{10})(?:\/|$)/i)?.[1].toUpperCase() === registered.asin;
        }
        return registered.offers.some((offer) => offer.merchant === anchor.merchant
          && new URL(offer.url, publicUrl).href === destination.href);
      } catch { return false; }
    };
    const guideDecisionAnchors = affiliateAnchors.filter((anchor) => guideDecision
      && anchor.index > guideDecision.start && anchor.index < guideDecision.end
      && /^(?:guide|market-(?:gb|ca|de|nl))-decision-exact-model$/.test(extractAttribute(anchor.tag, "data-commerce-position") ?? ""));
    // Reviewed guides place a qualified exact-model step beside their decision
    // table. This is a distinct layout, not a first-viewport geometry claim.
    const qualifiedGuideDecision = Boolean(guideDecision && guideDecisionAnchors.length
      && /<h2\b/i.test(guideDecision.html)
      && [...guideDecision.html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
        .filter((match) => match[1].replace(/<[^>]*>/g, "").trim()).length >= 3);
    const alternativeDecision = pageKind(url.pathname) === "guide"
      ? markedCommerceDecision(html, "data-guide-task-alternative")
        ?? markedCommerceDecision(html, "data-merchant21-route")
      : undefined;
    const alternativeAnchors = affiliateAnchors.filter((anchor) => alternativeDecision
      && anchor.index > alternativeDecision.start && anchor.index < alternativeDecision.end);
    // A separately named alternative has its own qualification/keep conditions.
    // It must not be relabelled as the paused original's first-screen purchase.
    const qualifiedAlternative = Boolean(alternativeDecision && alternativeAnchors.length
      && /<h2\b/i.test(alternativeDecision.html)
      && [...alternativeDecision.html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
        .filter((match) => match[1].replace(/<[^>]*>/g, "").trim()).length >= 3
      && alternativeAnchors.every(registeredAnchor));
    const contextualDecision = pageKind(url.pathname) === "guide"
      ? markedCommerceDecision(html, "data-guide-family-purchase-reference") ?? markedCommerceDecision(html, "data-guide-retailer-option")
      : pageKind(url.pathname) === "tool" ? markedCommerceDecision(html, "data-tool-retailer-reference") : undefined;
    const contextualAnchors = affiliateAnchors.filter((anchor) => contextualDecision
      && anchor.index > contextualDecision.start && anchor.index < contextualDecision.end);
    const contextualModelReference = Boolean(contextualDecision && contextualAnchors.length
      && /<h2\b/i.test(contextualDecision.html) && /<p\b/i.test(contextualDecision.html)
      && contextualAnchors.every(registeredAnchor));
    const slug = url.pathname.split("/").filter(Boolean).at(-1);
    const plannerHandoff = pageKind(url.pathname) === "guide"
      && Boolean(compatibilityTopicForGuide(site, slug))
      && html.includes('id="compatibility-checker"') && /<form\b/i.test(html)
      && html.includes('id="guide-reference-content"');
    const roundupChoice = pageKind(url.pathname) === "roundup"
      && findRoundup(site, slug)?.purchaseFlow === "task-links"
      && Boolean(markedCommerceDecision(html, "data-roundup-task-choice"))
      && html.includes('href="#quick-comparison"')
      && affiliateAnchors.length > 0 && affiliateAnchors.every(registeredAnchor);
    const decisionFirstRoundup = pageKind(url.pathname) === "roundup"
      && findRoundup(site, slug)?.decisionFirst === true;
    const decisionFirstBlock = decisionFirstRoundup
      ? markedCommerceDecision(html, "data-decision-first-comparison") : undefined;
    const decisionModels = decisionFirstBlock ? html.indexOf('id="comparison-models"') : -1;
    const decisionTable = decisionFirstBlock ? html.indexOf('id="roundup-comparison"') : -1;
    const qualifiedComparison = Boolean(decisionFirstBlock
      && html.indexOf('id="comparison-verdict"') > html.indexOf("</h1>")
      && decisionTable > html.indexOf('id="comparison-verdict"')
      && decisionModels > decisionTable
      && (firstCommerceIndex < 0 || firstCommerceIndex > decisionTable)
      && html.includes('id="comparison-sources"')
      && !html.includes('data-first-viewport-commerce="true"')
      && affiliateAnchors.every(registeredAnchor));
    const commercePaused = html.includes('data-commerce-paused="true"');
    const informationalCalculator = site === "baby"
      && /^\/(?:en-gb\/|en-ca\/|de-de\/|nl-nl\/)?tools\/diaper-usage-calculator\/?$/.test(url.pathname);
    const firstH1CloseIndex = html.indexOf("</h1>");
    const firstDecisionBlock = decodeEntities(firstDecision?.html ?? "")
      .replace(/<[^>]+>/g, " ").toLowerCase();
    const firstDecisionFriction = [
      "we have not",
      "source basis",
      "evidence snapshot",
      "listing anchor",
      "owner feedback",
      "customer feedback",
      "retailer reviews",
    ].filter((phrase) => firstDecisionBlock.includes(phrase));
    // This is a structural check. Actual first-viewport geometry is verified
    // in responsive browser QA, rather than inferred from HTML byte offsets.
    const firstViewportContainerFollowsH1 = firstH1CloseIndex >= 0
      && (firstDecision?.start ?? -1) > firstH1CloseIndex;
    const firstViewportAnchorInsideCompactContainer = firstViewportAnchorIndex >= (firstDecision?.start ?? Infinity)
      && firstViewportAnchorIndex < (firstDecision?.end ?? -1);
    const firstContentImageOffset = firstH1CloseIndex >= 0
      ? html.slice(firstH1CloseIndex).search(/<img\b/i)
      : -1;
    const firstImageIndex = firstContentImageOffset >= 0
      ? firstH1CloseIndex + firstContentImageOffset
      : -1;
    const beforeFirstImage = firstCommerceIndex >= 0 && (firstImageIndex < 0 || firstCommerceIndex < firstImageIndex);
    const requirePreImageCta = true
      && pageKind(url.pathname) !== "catalog-product";

    if (response.status !== 200) errors.push(`HTTP ${response.status}`);
    if (!affiliateAnchors.length) {
      // A merchant-integrity pause is an explicit safe state, not a missing
      // conversion path. The page must label it instead of substituting an
      // unrelated product merely to satisfy the CTA audit.
      if (!commercePaused && !informationalCalculator && !qualifiedTaskPaths && !plannerHandoff && !categoryDiscovery && !qualifiedComparison) errors.push("missing sponsored Amazon/CJ CTA or qualified task handoff");
    } else {
      if (informationalCalculator) errors.push("unrelated commerce CTA on diaper quantity calculator");
      if (!qualifiedGuideDecision && !qualifiedAlternative && !qualifiedTaskPaths && !contextualModelReference && !plannerHandoff && !roundupChoice && !qualifiedComparison) {
        if (!firstViewportAnchors.length) errors.push("missing designated first-viewport affiliate CTA");
        if (!firstViewportAnchors.some((anchor) => anchor.ctaIntent === "price-availability")) {
          errors.push("first-viewport CTA does not state the price-and-availability intent");
        }
        if (pageKind(url.pathname) !== "category" && !firstViewportAnchors.some((anchor) => anchor.stickyCommerce)) {
          errors.push("first-viewport CTA does not enable the responsive sticky commerce path");
        }
        if (pageKind(url.pathname) === "category" && firstViewportAnchors.some((anchor) => anchor.stickyCommerce)) errors.push("category discovery must not float one product over other task choices");
        if (!firstDecision?.html.includes('data-commission-slot="true"')) {
          errors.push("first decision block is missing the page disclosure slot below the CTA");
        }
        if (firstDecisionFriction.length) {
          errors.push(`first decision block contains conversion-friction copy: ${firstDecisionFriction.join(", ")}`);
        }
        if (!firstViewportContainerFollowsH1) errors.push("first-viewport commerce container must follow the H1");
        if (!firstViewportAnchorInsideCompactContainer) errors.push("designated first-viewport CTA is not inside the compact H1 commerce container");
      }
      if (guideDecision && !qualifiedGuideDecision) errors.push("qualified guide decision needs its exact-model CTA and qualification, stop and keep checks");
      if (requirePreImageCta && !beforeFirstImage) errors.push("first affiliate CTA appears after the first page image");
    }
    if (taskDecision && !qualifiedTaskPaths) errors.push("task guide needs a named internal next step and keep/unknown conditions");
    if (decisionFirstRoundup && !qualifiedComparison) errors.push("decision-first comparison needs its verdict, differences, exact model paths and sources in order");
    for (const anchor of affiliateAnchors) {
      if (!registeredAnchor(anchor)) errors.push(`unregistered or mismatched CTA identity/destination: ${anchor.href}`);
      if (!anchor.rel.includes("sponsored") || !anchor.rel.includes("nofollow")) {
        errors.push(`CTA missing sponsored/nofollow: ${anchor.href}`);
      }
    }
    for (const anchor of amazonAnchors) {
      const tag = new URL(anchor.href).searchParams.get("tag");
      if (tag !== expectedTag) errors.push(`wrong Amazon tracking ID ${tag ?? "missing"}; expected ${expectedTag}`);
    }

    return {
      url: publicUrl,
      site,
      kind: pageKind(url.pathname),
      market: marketForPath(url.pathname),
      htmlFile,
      finalPath: new URL(response.url).pathname,
      status: response.status,
      cacheStatus: response.headers.get("cf-cache-status"),
      cacheAge: response.headers.get("age"),
      amazonCtas: amazonAnchors.length,
      cjCtas: cjAnchors.length,
      firstViewportCtas: firstViewportAnchors.length,
      conversionLayout: qualifiedComparison ? "decision-first-comparison" : categoryDiscovery ? "category-discovery" : qualifiedTaskPaths ? "qualified-task-handoff" : qualifiedGuideDecision ? "qualified-guide-decision" : qualifiedAlternative ? "explicit-task-alternative" : plannerHandoff ? "interactive-requirements-planner" : contextualModelReference ? "contextual-model-reference" : roundupChoice ? "explicit-roundup-model-choice" : "first-viewport-or-paused",
      ctaBeforeFirstImage: beforeFirstImage,
      commercePaused,
      errors: [...new Set(errors)],
    };
  } catch (error) {
    return {
      url: publicUrl,
      site,
      kind: pageKind(url.pathname),
      market: marketForPath(url.pathname),
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}

const retryUrls = retryJsonPath
  ? JSON.parse(fs.readFileSync(retryJsonPath, "utf8")).failureDetails.map((result) => result.url)
  : null;
const baseUrls = [...new Set(retryUrls ?? [...(await sitemapContentUrls()), ...softLaunchUrls()])];
const exactUrls = [...new Set(expandMarketRoutes(baseUrls))].sort();
const results = [];
let nextIndex = 0;

async function worker() {
  while (nextIndex < exactUrls.length) {
    const url = exactUrls[nextIndex++];
    results.push(await inspectPage(url));
  }
}

await Promise.all(Array.from({ length: Math.min(concurrency, exactUrls.length) }, () => worker()));
results.sort((a, b) => a.url.localeCompare(b.url));
const failures = results.filter((result) => result.errors.length);
const report = {
  checkedAt: new Date().toISOString(),
  expectedReleaseId: expectedReleaseId ?? null,
  capturedHtmlDirectory: htmlDirectory,
  mode: publicAudit ? "public" : "local",
  includeMarkets,
  concurrency,
  baseUrls: baseUrls.length,
  exactUrls: exactUrls.length,
  passed: results.length - failures.length,
  failed: failures.length,
  noCta: failures.filter((result) => result.errors.includes("missing sponsored Amazon/CJ CTA")).length,
  commercePaused: results.filter((result) => result.commercePaused).length,
  bySite: Object.fromEntries(Object.keys(selectedSiteHosts).map((site) => [site, {
    checked: results.filter((result) => result.site === site).length,
    failed: failures.filter((result) => result.site === site).length,
    noCta: failures.filter((result) => result.site === site && result.errors.includes("missing sponsored Amazon/CJ CTA")).length,
    commercePaused: results.filter((result) => result.site === site && result.commercePaused).length,
  }])),
  byKind: Object.fromEntries(["review", "guide", "roundup", "tool", "category", "catalog-product"].map((kind) => [kind, {
    checked: results.filter((result) => result.kind === kind).length,
    failed: failures.filter((result) => result.kind === kind).length,
    noCta: failures.filter((result) => result.kind === kind && result.errors.includes("missing sponsored Amazon/CJ CTA")).length,
    commercePaused: results.filter((result) => result.kind === kind && result.commercePaused).length,
  }])),
  failureDetails: failures,
  results,
};

if (outputPath) fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log("Affiliate conversion-path audit");
console.log(JSON.stringify({
  checkedAt: report.checkedAt,
  mode: report.mode,
  includeMarkets: report.includeMarkets,
  concurrency: report.concurrency,
  baseUrls: report.baseUrls,
  exactUrls: report.exactUrls,
  passed: report.passed,
  failed: report.failed,
  noCta: report.noCta,
  bySite: report.bySite,
  byKind: report.byKind,
  report: outputPath,
}, null, 2));

if (failures.length) {
  console.error(`\n${failures.length} conversion-path failures; first 50:`);
  console.error(JSON.stringify(failures.slice(0, 50), null, 2));
  process.exit(1);
}
console.log("\nAffiliate conversion-path audit passed.");
