import fs from "node:fs";
import http from "node:http";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { loadAffiliateTypescript } from "./lib/load-affiliate-typescript.mjs";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const reportDir = `${root}apps/affiliate/reports/quality-remediation-2026-10-22/`;
const ports = { affiliate: Number(process.env.AFFILIATE_PORT ?? 3025), main: Number(process.env.MAIN_PORT ?? 3026) };
const rows = [];
const retiredHost = /https?:\/\/(?:tools|test|style|wellness|costumes?)\.madabase\.com(?:[/:?"'\s]|$)/;

function request(app, host, pathname, method = "GET", extraHeaders = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ hostname: "127.0.0.1", port: ports[app], path: pathname, method,
      headers: { Host: host, "User-Agent": "MadabaseRetirementQA/1.0", ...extraHeaders } }, (res) => {
      const data = [];
      res.on("data", (chunk) => data.push(chunk));
      res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: Buffer.concat(data).toString() }));
    });
    req.setTimeout(30000, () => req.destroy(new Error(`${app} ${host}${pathname} timed out`)));
    req.on("error", reject);
    req.end();
  });
}

const removedPaths = ["/", "/en", "/zh/tools/json-formatter", "/reviews/betsey-johnson-moon-star-drop-earrings", "/en-gb/reviews/loungefly-minnie-mouse-bow-mini-backpack", "/sitemap.xml", "/sitemap-index.xml", "/images/affiliate/hero-style-realistic.webp", "/api/auth/request-code", "/api/commerce-events", "/halloween", "/catalog", "/products/removed-product"];
for (const app of Object.keys(ports)) {
  for (const host of ["tools.madabase.com", "test.madabase.com", "style.madabase.com", "wellness.madabase.com", "costumes.madabase.com", "costume.madabase.com"]) {
    for (const pathname of removedPaths) {
      const res = await request(app, host, pathname);
      rows.push({ app, host, pathname, status: res.status, passed: res.status === 410 && !res.headers.location
        && res.headers["x-robots-tag"] === "noindex" && !res.body.includes("data-commerce") });
    }
    for (const method of ["HEAD", "POST"]) {
      const res = await request(app, host, "/api/commerce-events", method);
      rows.push({ app, host, pathname: "/api/commerce-events", method, status: res.status, passed: res.status === 410 && (method !== "HEAD" || !res.body) });
    }
    const robots = await request(app, host, "/robots.txt");
    rows.push({ app, host, pathname: "/robots.txt", status: robots.status, passed: robots.status === 200 && robots.body === "User-agent: *\nAllow: /\n" && !/sitemap:|disallow:/i.test(robots.body) });
  }
  const forwarded = await request(app, "127.0.0.1", "/sitemap.xml", "GET", { "x-forwarded-host": "STYLE.MADABASE.COM.:443" });
  rows.push({ app, case: "retired forwarded hostname", status: forwarded.status, passed: forwarded.status === 410 });
}

for (const pathname of ["/en", "/zh", "/en/tools/json-formatter", "/zh/blog/how-to-format-json", "/tools/json-formatter", "/en/tests/mbti"]) {
  const res = await request("main", "madabase.com", pathname);
  rows.push({ app: "main", host: "madabase.com", pathname, status: res.status, passed: res.status === 410 && !res.headers.location });
}

for (const host of ["homeoffice", "network", "smarthome", "baby", "pets"].map((name) => `${name}.madabase.com`)) {
  for (const pathname of ["/", "/about", "/sitemap.xml", "/robots.txt", "/en-gb"]) {
    const res = await request("affiliate", host, `${pathname}?madabase-qa=retirement`);
    rows.push({ app: "affiliate", host, pathname, status: res.status, passed: res.status === 200 && !retiredHost.test(res.body) });
  }
}
for (const pathname of ["/", "/about", "/research", "/search?q=earrings&madabase-qa=retirement", "/sitemap.xml"]) {
  const res = await request("main", "madabase.com", pathname);
  const countMatches = pathname !== "/" || /5(?:<!-- -->)? focused publications/.test(res.body);
  rows.push({ app: "main", host: "madabase.com", pathname, status: res.status, passed: res.status === 200 && !retiredHost.test(res.body) && !/Sideglance Style/.test(res.body) && countMatches });
}

const { publishedCommerceInventory, isPublishedCommerceClick } = loadAffiliateTypescript("../../lib/commerce-inventory.ts");
const { allSiteSearchIndex } = loadAffiliateTypescript("../../lib/site-search.ts");
const commerce = publishedCommerceInventory();
const search = allSiteSearchIndex();
assert.ok(commerce.every((item) => !["tools", "test", "style", "wellness", "costume"].includes(item.site)));
assert.ok(search.every((item) => !retiredHost.test(item.href)));
assert.equal(isPublishedCommerceClick("style", "betsey-johnson-moon-star-drop-earrings", "Amazon US"), false);
assert.ok(["web", "test", "wellness"].every((app) => !fs.existsSync(`${root}apps/${app}`)));
const report = { at: new Date().toISOString(), scope: "Local packaged Main/Affiliate runtime; no merchant clicks or production/database operation", rows,
  total: rows.length, passed: rows.filter((row) => row.passed).length, commerceRecords: commerce.length, searchRecords: search.length,
  builds: Object.fromEntries(Object.keys(ports).map((app) => [app, fs.readFileSync(`${root}apps/${app}/.next-release/BUILD_ID`, "utf8").trim()])),
  databaseExecuted: false, deployed: false };
fs.writeFileSync(`${reportDir}site-retirement-runtime-checks.json`, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ total: report.total, passed: report.passed, failures: rows.filter((row) => !row.passed), commerceRecords: commerce.length, searchRecords: search.length }));
assert.equal(report.passed, report.total);
