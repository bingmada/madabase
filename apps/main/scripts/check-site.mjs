import http from "node:http";
import https from "node:https";

const localOrigin = new URL(process.env.MAIN_SITE_URL ?? "http://127.0.0.1:3030");
const canonicalOrigin = new URL(process.env.CANONICAL_ORIGIN ?? "https://madabase.com");
const expectedMinimumPages = 13;

function localUrl(pathname) {
  return new URL(pathname, localOrigin).toString();
}

async function fetchPage(url, expectedStatus = 200) {
  const response = await new Promise((resolve, reject) => {
    const transport = new URL(url).protocol === "https:" ? https : http;
    const request = transport.get(url, { headers: { "user-agent": "Madabase release verifier" } }, (incoming) => {
      const chunks = [];
      incoming.on("data", (chunk) => chunks.push(chunk));
      incoming.on("end", () => resolve({
        status: incoming.statusCode ?? 0,
        text: async () => Buffer.concat(chunks).toString("utf8"),
      }));
    });
    request.setTimeout(15_000, () => request.destroy(new Error(`${url} timed out`)));
    request.on("error", reject);
  });

  if (response.status !== expectedStatus) {
    throw new Error(`${url} returned ${response.status}; expected ${expectedStatus}`);
  }

  return response;
}

function getCanonical(html) {
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];

  for (const tag of linkTags) {
    if (!/\brel=["']canonical["']/i.test(tag)) continue;
    return tag.match(/\bhref=["']([^"']+)["']/i)?.[1];
  }

  return undefined;
}

const robots = await (await fetchPage(localUrl("/robots.txt"))).text();
const expectedSitemap = new URL("/sitemap.xml", canonicalOrigin).toString();

if (!robots.includes(`Sitemap: ${expectedSitemap}`)) {
  throw new Error(`robots.txt does not advertise ${expectedSitemap}`);
}

if (!robots.includes(`Host: ${canonicalOrigin.origin}`)) {
  throw new Error(`robots.txt does not declare ${canonicalOrigin.origin}`);
}

const sitemapXml = await (await fetchPage(localUrl("/sitemap.xml"))).text();
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

if (sitemapUrls.length < expectedMinimumPages) {
  throw new Error(`sitemap.xml contains ${sitemapUrls.length} URLs; expected at least ${expectedMinimumPages}`);
}

for (const value of sitemapUrls) {
  const canonical = new URL(value);
  if (canonical.origin !== canonicalOrigin.origin) {
    throw new Error(`sitemap URL uses the wrong origin: ${value}`);
  }
  if (/^\/(?:en|zh)(?:\/|$)/.test(canonical.pathname)) {
    throw new Error(`sitemap leaks a permanently migrated locale URL: ${value}`);
  }

  const response = await fetchPage(localUrl(canonical.pathname));
  const html = await response.text();
  const declaredCanonical = getCanonical(html);
  if (declaredCanonical !== value) {
    throw new Error(`${canonical.pathname} declares canonical ${declaredCanonical ?? "<missing>"}; expected ${value}`);
  }
}

for (const localePath of ["/en", "/en/tools/json-formatter", "/zh", "/zh/tools/json-formatter"]) {
  await fetchPage(localUrl(localePath), 404);
}

const indexNowKey = "70abb1dcfc7c05c96feaa2a5388c71b2";
const keyBody = await (await fetchPage(localUrl(`/${indexNowKey}.txt`))).text();
if (keyBody.trim() !== indexNowKey) {
  throw new Error("IndexNow key file body does not match its filename");
}

console.log(`Main-site verification passed: ${sitemapUrls.length} canonical pages, robots, sitemap, locale isolation, and IndexNow key.`);
