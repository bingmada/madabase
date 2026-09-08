import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const affiliateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const localOrigin = process.env.AFFILIATE_LOCAL_AUDIT_ORIGIN ?? "http://127.0.0.1:3020";
const publicAudit = process.env.AFFILIATE_PUBLIC_AUDIT === "1";
const outputArgument = process.argv.find((argument) => argument.startsWith("--json="));
const outputPath = outputArgument
  ? path.resolve(process.cwd(), outputArgument.slice("--json=".length))
  : null;
const concurrencyArgument = process.argv.find((argument) => argument.startsWith("--concurrency="));
const concurrency = Math.max(1, Math.min(24, Number(concurrencyArgument?.slice("--concurrency=".length) ?? (publicAudit ? 2 : 12))));
const includeMarkets = !process.argv.includes("--base-only");
const siteArgument = process.argv.find((argument) => argument.startsWith("--site="));

const siteHosts = {
  network: "network.madabase.com",
  smarthome: "smarthome.madabase.com",
  homeoffice: "homeoffice.madabase.com",
  baby: "baby.madabase.com",
  pet: "pets.madabase.com",
  style: "style.madabase.com",
  costume: "costumes.madabase.com",
};
const siteTrackingIds = {
  network: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_NETWORK ?? "madanetwork-20",
  smarthome: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_SMARTHOME ?? "madasmart-20",
  homeoffice: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_HOMEOFFICE ?? "madaoffice-20",
  baby: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_BABY ?? "madababy-20",
  pet: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_PET ?? "madapets-20",
  style: process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID_STYLE ?? "madastyle-20",
};
const criticalFirstViewportAsins = new Map([
  ["https://baby.madabase.com/guides/ergobaby-omni-breeze-positions-by-age", "B0931ZY7DK"],
]);
const requestedSites = siteArgument
  ? siteArgument.slice("--site=".length).split(",").flatMap((site) => site === "amazon" ? Object.keys(siteHosts).filter((key) => key !== "costume") : site)
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
    for (let attempt = 1; attempt <= 3; attempt += 1) {
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
      await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    }
    return response;
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
    const anchorTags = [...html.matchAll(/<a\b[^>]*href=["'][^"']+["'][^>]*>/gi)].map((match) => match[0]);
    const affiliateAnchors = anchorTags
      .map((tag) => ({
        tag,
        href: decodeEntities(extractAttribute(tag, "href") ?? ""),
        rel: (extractAttribute(tag, "rel") ?? "").toLowerCase(),
        source: extractAttribute(tag, "data-affiliate-link-source"),
        firstViewport: extractAttribute(tag, "data-first-viewport-affiliate") === "true",
        ctaIntent: extractAttribute(tag, "data-cta-intent"),
        stickyCommerce: extractAttribute(tag, "data-sticky-commerce-enabled") === "true",
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
    const expectedFirstViewportAsin = criticalFirstViewportAsins.get(normalizeUrl(publicUrl));
    const expectedTag = siteTrackingIds[site];
    const firstAffiliateIndex = html.indexOf("data-affiliate-link-source=");
    const firstSponsoredCjIndex = html.search(/<a\b[^>]*href=["'][^"']*\/go\/cj\/[^"']+["'][^>]*rel=["'][^"']*sponsored/i);
    const firstViewportAnchorIndex = html.indexOf("data-first-viewport-affiliate=");
    const firstCommerceIndex = [firstAffiliateIndex, firstSponsoredCjIndex, firstViewportAnchorIndex]
      .filter((index) => index >= 0)
      .sort((a, b) => a - b)[0] ?? -1;
    const firstViewportContainerIndex = html.indexOf("data-first-viewport-commerce=");
    const commercePaused = html.includes('data-commerce-paused="true"');
    const firstH1CloseIndex = html.indexOf("</h1>");
    // Keep this check scoped to the initial decision area. Larger slices reach
    // valid bottom-of-page methodology text in Next.js output and create false
    // positives for copy that is nowhere near the first CTA.
    const firstDecisionBlock = firstH1CloseIndex >= 0
      ? decodeEntities(html.slice(firstH1CloseIndex, firstH1CloseIndex + 8_000)).toLowerCase()
      : "";
    const firstDecisionFriction = [
      "we have not",
      "not hands-on",
      "not a hands-on",
      "source basis",
      "evidence snapshot",
      "listing anchor",
      "owner feedback",
      "customer feedback",
      "retailer reviews",
    ].filter((phrase) => firstDecisionBlock.includes(phrase));
    const firstViewportContainerFollowsH1 = firstH1CloseIndex >= 0
      && firstViewportContainerIndex > firstH1CloseIndex
      && firstViewportContainerIndex - firstH1CloseIndex <= 1_000;
    const firstViewportAnchorInsideCompactContainer = firstViewportAnchorIndex > firstViewportContainerIndex
      && firstViewportAnchorIndex - firstViewportContainerIndex <= 6_000;
    const firstContentImageOffset = firstH1CloseIndex >= 0
      ? html.slice(firstH1CloseIndex).search(/<img\b/i)
      : -1;
    const firstImageIndex = firstContentImageOffset >= 0
      ? firstH1CloseIndex + firstContentImageOffset
      : -1;
    const beforeFirstImage = firstCommerceIndex >= 0 && (firstImageIndex < 0 || firstCommerceIndex < firstImageIndex);
    const requirePreImageCta = !(site === "style" && pageKind(url.pathname) === "review")
      && pageKind(url.pathname) !== "catalog-product";

    if (response.status !== 200) errors.push(`HTTP ${response.status}`);
    if (!affiliateAnchors.length) {
      // A merchant-integrity pause is an explicit safe state, not a missing
      // conversion path. The page must label it instead of substituting an
      // unrelated product merely to satisfy the CTA audit.
      if (!commercePaused) errors.push("missing sponsored Amazon/CJ CTA");
    } else {
      if (!firstViewportAnchors.length) errors.push("missing designated first-viewport affiliate CTA");
      if (!firstViewportAnchors.some((anchor) => anchor.ctaIntent === "price-availability")) {
        errors.push("first-viewport CTA does not state the price-and-availability intent");
      }
      if (!firstViewportAnchors.some((anchor) => anchor.stickyCommerce)) {
        errors.push("first-viewport CTA does not enable the responsive sticky commerce path");
      }
      if (!firstDecisionBlock.includes("purchase link")) {
        errors.push("first decision block is missing a concise purchase-link label near the CTA");
      }
      if (firstDecisionFriction.length) {
        errors.push(`first decision block contains conversion-friction copy: ${firstDecisionFriction.join(", ")}`);
      }
      if (!firstViewportContainerFollowsH1) errors.push("first-viewport commerce container is not directly after the H1");
      if (!firstViewportAnchorInsideCompactContainer) errors.push("designated first-viewport CTA is not inside the compact H1 commerce container");
      if (requirePreImageCta && !beforeFirstImage) errors.push("first affiliate CTA appears after the first page image");
      if (expectedFirstViewportAsin && !firstViewportAnchors.some((anchor) => anchor.href.toUpperCase().includes(`/DP/${expectedFirstViewportAsin}`))) {
        errors.push(`first-viewport CTA does not target required ASIN ${expectedFirstViewportAsin}`);
      }
    }
    for (const anchor of affiliateAnchors) {
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
      status: response.status,
      amazonCtas: amazonAnchors.length,
      cjCtas: cjAnchors.length,
      firstViewportCtas: firstViewportAnchors.length,
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

const baseUrls = [...new Set([...(await sitemapContentUrls()), ...softLaunchUrls()])];
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
