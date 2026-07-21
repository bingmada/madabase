const args = process.argv.slice(2);
const valueFor = (flag, fallback) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : fallback;
};

const oldOrigin = valueFor("--old-origin", "https://madabase.com").replace(/\/$/, "");
const newOrigin = valueFor("--new-origin", "https://tools.madabase.com").replace(/\/$/, "");
const limit = Number(valueFor("--limit", "0"));
const migratedPath = /^\/(en|zh)(?:\/|$)/;

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
const newSitemapResponse = await request(`${newOrigin}/sitemap.xml`);
if (!newSitemapResponse.ok) {
  console.error(`New sitemap returned ${newSitemapResponse.status}`);
  process.exit(1);
}

const allNewUrls = sitemapUrls(await newSitemapResponse.text()).filter((url) => migratedPath.test(new URL(url).pathname));
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

if (failures.length > 0) {
  console.error(`Tools migration verification failed (${failures.length}):`);
  failures.slice(0, 50).forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Tools migration verification passed for ${urls.length} URLs.`);
