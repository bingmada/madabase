import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import ts from "typescript";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? "70abb1dcfc7c05c96feaa2a5388c71b2";
const SITE_DOMAINS = {
  network: process.env.NEXT_PUBLIC_NETWORK_SITE_URL ?? "https://network.madabase.com",
  smarthome: process.env.NEXT_PUBLIC_SMARTHOME_SITE_URL ?? "https://smarthome.madabase.com",
  homeoffice: process.env.NEXT_PUBLIC_HOMEOFFICE_SITE_URL ?? "https://homeoffice.madabase.com",
  baby: process.env.NEXT_PUBLIC_BABY_SITE_URL ?? "https://baby.madabase.com",
  pet: process.env.NEXT_PUBLIC_PET_SITE_URL ?? "https://pets.madabase.com",
  style: process.env.NEXT_PUBLIC_STYLE_SITE_URL ?? "https://style.madabase.com",
};
const SITE_KEYS = Object.keys(SITE_DOMAINS);
const STATIC_PATHS = [
  "/about",
  "/methodology",
  "/editorial-policy",
  "/affiliate-disclosure",
  "/privacy",
  "/contact",
];
const SITE_CATEGORIES = {
  network: ["wifi", "wired", "backup"],
  smarthome: ["access", "cameras", "climate", "automation"],
  homeoffice: ["desks", "ergonomics", "meetings"],
  baby: ["sleep", "travel", "feeding"],
  pet: ["feeding", "home-care", "comfort"],
  style: ["jewelry", "bags", "hair", "scarves", "socks", "styling"],
};
const REPO_ROOT = execFileSync("git", ["rev-parse", "--show-toplevel"], { encoding: "utf8" }).trim();

function readValue(argv, index, option) {
  const inlinePrefix = `${option}=`;
  if (argv[index].startsWith(inlinePrefix)) {
    return { value: argv[index].slice(inlinePrefix.length), consumed: 0 };
  }

  const value = argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`${option} requires a value.`);
  }

  return { value, consumed: 1 };
}

function parseArgs(argv) {
  const options = {
    submit: false,
    all: false,
    help: false,
    from: "HEAD^",
    to: "HEAD",
    since: null,
    sites: new Set(),
    urls: [],
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--submit") options.submit = true;
    else if (arg === "--all") options.all = true;
    else if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--site" || arg.startsWith("--site=")) {
      const result = readValue(argv, index, "--site");
      options.sites.add(result.value);
      index += result.consumed;
    } else if (arg === "--url" || arg.startsWith("--url=")) {
      const result = readValue(argv, index, "--url");
      options.urls.push(result.value);
      index += result.consumed;
    } else if (arg === "--from" || arg.startsWith("--from=")) {
      const result = readValue(argv, index, "--from");
      options.from = result.value;
      index += result.consumed;
    } else if (arg === "--to" || arg.startsWith("--to=")) {
      const result = readValue(argv, index, "--to");
      options.to = result.value;
      index += result.consumed;
    } else if (arg === "--since" || arg.startsWith("--since=")) {
      const result = readValue(argv, index, "--since");
      options.since = result.value;
      index += result.consumed;
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }

  if (options.all && options.since) {
    throw new Error("Use either --all or --since, not both.");
  }

  const unknownSites = [...options.sites].filter((site) => !SITE_KEYS.includes(site));
  if (unknownSites.length > 0) {
    throw new Error(`Unknown site: ${unknownSites.join(", ")}. Use one of: ${SITE_KEYS.join(", ")}.`);
  }

  if (options.sites.size === 0) {
    SITE_KEYS.forEach((site) => options.sites.add(site));
  }

  return options;
}

function printHelp() {
  console.log(`IndexNow submitter for the Madabase affiliate cluster

Usage:
  npm run indexnow:preview --workspace apps/affiliate
  npm run indexnow:preview --workspace apps/affiliate -- --from <git-ref> --to <git-ref>
  npm run indexnow:preview --workspace apps/affiliate -- --since 2026-07-13
  npm run indexnow:submit --workspace apps/affiliate -- --from <deployed-ref> --to HEAD

Options:
  --site <key>    Restrict to a site; repeat for more than one site
  --url <url>     Add an explicit URL; repeat for more than one URL
  --from <ref>    Compare content from this Git ref (default: HEAD^)
  --to <ref>      Compare content at this Git ref (default: HEAD)
  --since <date>  Read live sitemaps and include URLs with lastmod on/after YYYY-MM-DD
  --all           Bootstrap every URL from the selected live sitemaps
  --submit        Verify deployed key files and send URLs to IndexNow
  --help          Show this help

Without --submit the command is a safe preview.`);
}

function git(args) {
  return execFileSync("git", args, {
    cwd: REPO_ROOT,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
}

function propertyName(property) {
  if (!property.name) return null;
  if (ts.isIdentifier(property.name) || ts.isStringLiteral(property.name)) return property.name.text;
  return null;
}

function stringProperty(properties, name) {
  const property = properties.find((candidate) => propertyName(candidate) === name);
  if (!property || !ts.isPropertyAssignment(property) || !ts.isStringLiteralLike(property.initializer)) return null;
  return property.initializer.text;
}

function stringArrayProperty(properties, name) {
  const property = properties.find((candidate) => propertyName(candidate) === name);
  if (!property || !ts.isPropertyAssignment(property) || !ts.isArrayLiteralExpression(property.initializer)) return [];

  return property.initializer.elements
    .filter((element) => ts.isStringLiteralLike(element))
    .map((element) => element.text);
}

function inferPageType(propertyNames) {
  if (propertyNames.has("offers") && propertyNames.has("brand")) return "reviews";
  if (propertyNames.has("productSlugs") && propertyNames.has("methodology")) return "best";
  if (propertyNames.has("kind") && propertyNames.has("relatedRoundups")) return "tools";
  if (propertyNames.has("sections") && propertyNames.has("relatedRoundups")) return "guides";
  return null;
}

function collectContentFromSource(source, filename, catalog) {
  const sourceFile = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const properties = [...node.properties];
      const names = new Set(properties.map(propertyName).filter(Boolean));
      const site = stringProperty(properties, "site");
      const slug = stringProperty(properties, "slug");
      const pageType = inferPageType(names);

      if (site && slug && pageType && SITE_KEYS.includes(site)) {
        const path = `/${pageType}/${slug}`;
        const key = `${site}:${path}`;
        const record = {
          site,
          slug,
          path,
          pageType,
          category: stringProperty(properties, "category"),
          productSlugs: stringArrayProperty(properties, "productSlugs"),
          fingerprint: createHash("sha256").update(node.getText(sourceFile)).digest("hex"),
        };

        const existing = catalog.get(key);
        if (existing && existing.fingerprint !== record.fingerprint) {
          throw new Error(`Duplicate content key ${key} found while reading ${filename}.`);
        }
        catalog.set(key, record);
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
}

function catalogAtRef(ref) {
  const catalog = new Map();
  const files = git(["ls-tree", "-r", "--name-only", ref, "--", "apps/affiliate/lib"])
    .split("\n")
    .filter((filename) => filename.endsWith(".ts"));

  for (const filename of files) {
    const source = git(["show", `${ref}:${filename}`]);
    collectContentFromSource(source, filename, catalog);
  }

  return catalog;
}

function pageUrl(site, path) {
  return new URL(path, SITE_DOMAINS[site]).toString();
}

function addSiteShellUrls(urls, site) {
  urls.add(pageUrl(site, "/"));
  STATIC_PATHS.forEach((path) => urls.add(pageUrl(site, path)));
  SITE_CATEGORIES[site].forEach((category) => urls.add(pageUrl(site, `/categories/${category}`)));
}

function addRecordsByType(urls, catalog, selectedSites, pageTypes) {
  for (const record of catalog.values()) {
    if (selectedSites.has(record.site) && pageTypes.has(record.pageType)) {
      urls.add(pageUrl(record.site, record.path));
    }
  }
}

function addTemplateChangeUrls(urls, catalog, fromRef, toRef, selectedSites) {
  const changedFiles = git(["diff", "--name-only", fromRef, toRef, "--", "apps/affiliate"])
    .split("\n")
    .filter(Boolean);
  const allSites = () => {
    for (const site of selectedSites) addSiteShellUrls(urls, site);
    addRecordsByType(urls, catalog, selectedSites, new Set(["reviews", "best", "guides", "tools"]));
  };

  if (changedFiles.some((file) => [
    "apps/affiliate/app/layout.tsx",
    "apps/affiliate/components/JsonLd.tsx",
    "apps/affiliate/components/LayoutParts.tsx",
    "apps/affiliate/lib/seo.ts",
    "apps/affiliate/lib/sites.ts",
  ].includes(file))) {
    allSites();
    return changedFiles;
  }

  const templateTypes = new Set();
  if (changedFiles.includes("apps/affiliate/app/reviews/[slug]/page.tsx")) templateTypes.add("reviews");
  if (changedFiles.includes("apps/affiliate/app/best/[slug]/page.tsx")) templateTypes.add("best");
  if (changedFiles.includes("apps/affiliate/app/guides/[slug]/page.tsx")) templateTypes.add("guides");
  if (
    changedFiles.includes("apps/affiliate/app/tools/[slug]/page.tsx") ||
    changedFiles.includes("apps/affiliate/components/Calculator.tsx")
  ) templateTypes.add("tools");
  addRecordsByType(urls, catalog, selectedSites, templateTypes);

  if (changedFiles.includes("apps/affiliate/app/page.tsx") || changedFiles.includes("apps/affiliate/lib/content.ts")) {
    for (const site of selectedSites) urls.add(pageUrl(site, "/"));
  }
  if (changedFiles.includes("apps/affiliate/app/categories/[slug]/page.tsx")) {
    for (const site of selectedSites) {
      SITE_CATEGORIES[site].forEach((category) => urls.add(pageUrl(site, `/categories/${category}`)));
    }
  }
  if (changedFiles.includes("apps/affiliate/lib/static-pages.ts") || changedFiles.includes("apps/affiliate/app/[slug]/page.tsx")) {
    for (const site of selectedSites) STATIC_PATHS.forEach((path) => urls.add(pageUrl(site, path)));
  }
  if (changedFiles.includes("apps/affiliate/components/StyleExperience.tsx") && selectedSites.has("style")) {
    addSiteShellUrls(urls, "style");
    addRecordsByType(urls, catalog, new Set(["style"]), new Set(["reviews", "best", "guides", "tools"]));
  }

  return changedFiles;
}

function changedUrls(fromRef, toRef, selectedSites) {
  const before = catalogAtRef(fromRef);
  const after = catalogAtRef(toRef);
  if (process.env.DEBUG_INDEXNOW) {
    console.log(`Catalog records: ${fromRef}=${before.size}, ${toRef}=${after.size}`);
  }
  const urls = new Set();
  const changedRecords = [];
  const changedFiles = addTemplateChangeUrls(urls, after, fromRef, toRef, selectedSites);

  for (const key of new Set([...before.keys(), ...after.keys()])) {
    const oldRecord = before.get(key);
    const newRecord = after.get(key);
    if (oldRecord?.fingerprint === newRecord?.fingerprint) continue;

    const record = newRecord ?? oldRecord;
    if (!record || !selectedSites.has(record.site)) continue;
    changedRecords.push(record);
    urls.add(pageUrl(record.site, record.path));
    urls.add(pageUrl(record.site, "/"));
    if (record.category) urls.add(pageUrl(record.site, `/categories/${record.category}`));

    if (record.pageType === "reviews") {
      for (const candidate of after.values()) {
        if (candidate.site === record.site && candidate.productSlugs.includes(record.slug)) {
          urls.add(pageUrl(candidate.site, candidate.path));
        }
      }
    }
  }

  return { urls, changedRecords, changedFiles };
}

function decodeXml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'");
}

async function fetchWithRetry(url, options = {}) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await fetch(url, { ...options, signal: AbortSignal.timeout(20_000) });
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    }
  }

  throw new Error(`Could not reach ${url} after 3 attempts: ${lastError?.cause?.message ?? lastError?.message}`);
}

async function sitemapUrls(site, since, includeAll) {
  const sitemapUrl = pageUrl(site, "/sitemap.xml");
  const response = await fetchWithRetry(sitemapUrl, { headers: { "user-agent": "Madabase-IndexNow/1.0" } });
  if (!response.ok) throw new Error(`Could not fetch ${sitemapUrl}: HTTP ${response.status}`);
  const xml = await response.text();
  const cutoff = since ? new Date(`${since}T00:00:00.000Z`) : null;
  if (cutoff && Number.isNaN(cutoff.getTime())) throw new Error(`Invalid --since date: ${since}`);
  const urls = [];

  for (const match of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const block = match[1];
    const loc = block.match(/<loc>([\s\S]*?)<\/loc>/)?.[1];
    const lastModified = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1];
    if (!loc) continue;
    if (includeAll || (cutoff && lastModified && new Date(lastModified) >= cutoff)) {
      urls.push(decodeXml(loc.trim()));
    }
  }

  return urls;
}

function siteForUrl(value) {
  const url = new URL(value);
  return SITE_KEYS.find((site) => new URL(SITE_DOMAINS[site]).host === url.host) ?? null;
}

function validateUrls(urls, selectedSites) {
  for (const value of urls) {
    const site = siteForUrl(value);
    if (!site) throw new Error(`URL is not part of the configured affiliate cluster: ${value}`);
    if (!selectedSites.has(site)) throw new Error(`URL belongs to unselected site ${site}: ${value}`);
    if (new URL(value).protocol !== "https:") throw new Error(`IndexNow production URLs must use HTTPS: ${value}`);
  }
}

async function verifyKey(site) {
  const keyLocation = pageUrl(site, `/${INDEXNOW_KEY}.txt`);
  const response = await fetchWithRetry(keyLocation, { cache: "no-store" });
  const body = response.ok ? (await response.text()).trim() : "";
  if (!response.ok || body !== INDEXNOW_KEY) {
    throw new Error(`IndexNow key is not deployed at ${keyLocation} (HTTP ${response.status}).`);
  }
  return keyLocation;
}

async function submitSite(site, urls) {
  const keyLocation = await verifyKey(site);
  const host = new URL(SITE_DOMAINS[site]).host;

  for (let index = 0; index < urls.length; index += 10_000) {
    const urlList = urls.slice(index, index + 10_000);
    const response = await fetchWithRetry(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host, key: INDEXNOW_KEY, keyLocation, urlList }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`IndexNow rejected ${host}: HTTP ${response.status}${body ? ` - ${body}` : ""}`);
    }

    console.log(`Submitted ${urlList.length} URL(s) for ${host}: HTTP ${response.status}`);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printHelp();
    return;
  }

  const urls = new Set(options.urls);
  let changedRecords = [];
  let changedFiles = [];

  if (options.all || options.since) {
    for (const site of options.sites) {
      const discovered = await sitemapUrls(site, options.since, options.all);
      discovered.forEach((url) => urls.add(url));
    }
  } else {
    const changed = changedUrls(options.from, options.to, options.sites);
    changed.urls.forEach((url) => urls.add(url));
    changedRecords = changed.changedRecords;
    changedFiles = changed.changedFiles;
  }

  validateUrls(urls, options.sites);
  const grouped = new Map(SITE_KEYS.map((site) => [site, []]));
  [...urls].sort().forEach((url) => grouped.get(siteForUrl(url)).push(url));

  console.log(options.submit ? "IndexNow submission" : "IndexNow preview (no URLs will be submitted)");
  if (changedRecords.length > 0) {
    console.log(`Detected ${changedRecords.length} changed content record(s) from ${options.from} to ${options.to}.`);
  }
  if (changedFiles.length > 0) {
    console.log(`Inspected ${changedFiles.length} changed affiliate file(s) for shared template impact.`);
  }

  for (const site of SITE_KEYS) {
    const siteUrls = grouped.get(site);
    if (!siteUrls.length) continue;
    console.log(`\n${site} (${siteUrls.length})`);
    siteUrls.forEach((url) => console.log(`  ${url}`));
  }

  if (urls.size === 0) {
    console.log("No eligible changed URLs found.");
    return;
  }

  if (!options.submit) {
    console.log("\nPreview complete. Add --submit only after the matching release is live.");
    return;
  }

  for (const site of SITE_KEYS) {
    const siteUrls = grouped.get(site);
    if (siteUrls.length > 0) await submitSite(site, siteUrls);
  }
}

main().catch((error) => {
  console.error(`IndexNow failed: ${error.message}`);
  process.exitCode = 1;
});
