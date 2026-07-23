import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const valueFor = (flag, fallback) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : fallback;
};

const oldOrigin = valueFor("--old-origin", "https://madabase.com").replace(/\/$/, "");
const newOrigin = valueFor("--new-origin", "https://tools.madabase.com").replace(/\/$/, "");
const limit = Number(valueFor("--limit", "0"));
const migratedPath = /^\/(en|zh)(?:\/|$)/;
const workspaceDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sunsetSource = fs.readFileSync(path.join(workspaceDir, "lib", "tool-sunset.ts"), "utf8");
const sunsetSetBody = sunsetSource.match(/phaseOneSunsetToolSlugs\s*=\s*new Set\(\[([\s\S]*?)\]\)/)?.[1] ?? "";
const sunsetSlugs = [...sunsetSetBody.matchAll(/"([^"]+)"/g)].map((match) => match[1]);

async function request(url, redirect = "follow") {
  return fetch(url, {
    redirect,
    headers: { "user-agent": "MadabaseMigrationVerifier/1.0" },
    signal: AbortSignal.timeout(20_000),
  });
}

function sitemapUrls(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1].replaceAll("&amp;", "&"));
}

function canonical(html) {
  return html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1]
    ?? html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)?.[1];
}

const failures = [];
if (sunsetSlugs.length !== 20) failures.push(`Expected 20 phase-one sunset tools, found ${sunsetSlugs.length}`);
const newSitemapResponse = await request(`${newOrigin}/sitemap.xml`);
if (!newSitemapResponse.ok) {
  console.error(`New sitemap returned ${newSitemapResponse.status}`);
  process.exit(1);
}

const allNewUrls = sitemapUrls(await newSitemapResponse.text()).filter((url) => migratedPath.test(new URL(url).pathname));
for (const slug of sunsetSlugs) {
  for (const locale of ["en", "zh"]) {
    const retiredUrl = `${newOrigin}/${locale}/tools/${slug}`;
    if (allNewUrls.includes(retiredUrl)) failures.push(`${retiredUrl}: sunset route remains in sitemap`);
  }
}
const urls = limit > 0 ? allNewUrls.slice(0, limit) : allNewUrls;
if (urls.length === 0) {
  console.error("New sitemap contains no migrated locale URLs");
  process.exit(1);
}

async function verifyNewUrl(newUrl) {
  try {
    const response = await request(newUrl);
    const body = await response.text();
    if (response.status !== 200) failures.push(`${newUrl}: expected 200, received ${response.status}`);
    if (canonical(body) !== newUrl) failures.push(`${newUrl}: canonical is ${canonical(body) ?? "missing"}`);

    const robots = response.headers.get("x-robots-tag") ?? "";
    if (robots.includes("noindex")) failures.push(`${newUrl}: production still sends X-Robots-Tag noindex`);
  } catch (error) {
    failures.push(`${newUrl}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

for (let index = 0; index < urls.length; index += 8) {
  await Promise.all(urls.slice(index, index + 8).map(verifyNewUrl));
}

for (let index = 0; index < sunsetSlugs.length; index += 4) {
  await Promise.all(sunsetSlugs.slice(index, index + 4).flatMap((slug) => ["en", "zh"].map(async (locale) => {
    const retiredUrl = `${newOrigin}/${locale}/tools/${slug}`;
    try {
      const response = await request(retiredUrl);
      const body = await response.text();
      if (response.status !== 200) failures.push(`${retiredUrl}: expected crawlable 200 during phase one, received ${response.status}`);
      if (canonical(body) !== retiredUrl) failures.push(`${retiredUrl}: canonical is ${canonical(body) ?? "missing"}`);
      if (!/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(body) && !/<meta[^>]+content=["'][^"']*noindex[^"']*["'][^>]+name=["']robots/i.test(body)) {
        failures.push(`${retiredUrl}: missing HTML noindex`);
      }
    } catch (error) {
      failures.push(`${retiredUrl}: ${error instanceof Error ? error.message : String(error)}`);
    }
  })));
}

for (const locale of ["en", "zh"]) {
  const directoryUrl = `${newOrigin}/${locale}/tools`;
  const directoryBody = await (await request(directoryUrl)).text();
  for (const slug of sunsetSlugs) {
    if (directoryBody.includes(`/${locale}/tools/${slug}`)) failures.push(`${directoryUrl}: still links to sunset tool ${slug}`);
  }
}

const oldSitemapResponse = await request(`${oldOrigin}/sitemap.xml`);
if (oldSitemapResponse.ok) {
  const oldSitemapUrls = sitemapUrls(await oldSitemapResponse.text());
  if (oldSitemapUrls.some((url) => new URL(url).origin === oldOrigin && migratedPath.test(new URL(url).pathname))) {
    failures.push("Old sitemap still contains migrated locale URLs");
  }
} else if (![404, 410].includes(oldSitemapResponse.status)) {
  failures.push(`${oldOrigin}/sitemap.xml: received ${oldSitemapResponse.status}`);
}

for (let index = 0; index < urls.length; index += 8) {
  await Promise.all(urls.slice(index, index + 8).map(async (newUrl) => {
    const path = new URL(newUrl).pathname;
    const oldUrl = `${oldOrigin}${path}`;
    try {
      const response = await request(oldUrl, "manual");
      const location = response.headers.get("location");
      if (![301, 308].includes(response.status)) failures.push(`${oldUrl}: expected permanent redirect, received ${response.status}`);
      if (location !== newUrl) failures.push(`${oldUrl}: redirects to ${location ?? "missing"} instead of ${newUrl}`);
    } catch (error) {
      failures.push(`${oldUrl}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }));
}

const probePath = new URL(urls.find((url) => new URL(url).pathname.includes("/tools/")) ?? urls[0]).pathname;
const probeResponse = await request(`${oldOrigin}${probePath}?migration_probe=1`, "manual");
const expectedProbe = `${newOrigin}${probePath}?migration_probe=1`;
if (probeResponse.headers.get("location") !== expectedProbe) failures.push(`${oldOrigin}${probePath}: query-string redirect was not preserved`);

for (const origin of [oldOrigin, newOrigin]) {
  for (const path of ["/tests/retired-probe", "/en/tests/retired-probe", "/zh/tests/retired-probe"]) {
    const response = await request(`${origin}${path}`, "manual");
    if (response.status !== 410) failures.push(`${origin}${path}: expected 410, received ${response.status}`);
    if (!(response.headers.get("x-robots-tag") ?? "").includes("noindex")) failures.push(`${origin}${path}: missing noindex header`);
  }
}

if (failures.length > 0) {
  console.error(`Tools migration verification failed (${failures.length}):`);
  failures.slice(0, 50).forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Tools migration verification passed for ${urls.length} URLs.`);
