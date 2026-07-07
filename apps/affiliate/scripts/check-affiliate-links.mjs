import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import ts from "typescript";

const root = path.resolve(new URL("../../..", import.meta.url).pathname);
const contentDirectory = path.join(root, "apps/affiliate/lib");
const partnerTag = process.env.AMAZON_AFFILIATE_TAG ?? "bingmada-20";
const inventoryOnly = process.argv.includes("--inventory");
const siteArgument = process.argv.find((argument) =>
  argument.startsWith("--site="),
);
const siteFilter = siteArgument?.slice("--site=".length);
const jsonArgument = process.argv.find((argument) =>
  argument.startsWith("--json="),
);
const jsonOutput = jsonArgument
  ? path.resolve(process.cwd(), jsonArgument.slice("--json=".length))
  : null;

function propertyValue(node, name) {
  const property = node.properties.find(
    (item) =>
      ts.isPropertyAssignment(item) &&
      ((ts.isIdentifier(item.name) && item.name.text === name) ||
        (ts.isStringLiteral(item.name) && item.name.text === name)),
  );

  return property && ts.isPropertyAssignment(property)
    ? property.initializer
    : undefined;
}

function literalText(node) {
  return node &&
    (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    ? node.text
    : undefined;
}

function isAffiliateUrl(value) {
  if (!value.startsWith("http")) return false;

  try {
    const url = new URL(value);
    return (
      url.hostname === "amzn.to" ||
      url.searchParams.get("tag") === partnerTag ||
      url.searchParams.get("tag")?.startsWith(`${partnerTag}-`) === true
    );
  } catch {
    return false;
  }
}

function urlsBelow(node) {
  const urls = [];

  function visit(child) {
    if (ts.isStringLiteral(child) && isAffiliateUrl(child.text)) {
      urls.push(child.text);
    }
    ts.forEachChild(child, visit);
  }

  visit(node);
  return urls;
}

function fallbackAmazonUrl(asin) {
  return asin
    ? `https://www.amazon.com/dp/${asin}?tag=${partnerTag}&linkCode=ll2&language=en_US&ref_=as_li_ss_tl`
    : null;
}

function contentFiles() {
  return fs
    .readdirSync(contentDirectory)
    .filter((name) => name.endsWith(".ts"))
    .map((name) => path.join(contentDirectory, name));
}

function buildInventory() {
  const records = new Map();

  for (const file of contentFiles()) {
    const source = fs.readFileSync(file, "utf8");
    const sourceFile = ts.createSourceFile(
      file,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS,
    );

    function add(url, details = {}) {
      const current = records.get(url) ?? {
        url,
        file: path.relative(root, file),
      };
      records.set(url, { ...current, ...details });
    }

    function visit(node) {
      if (ts.isObjectLiteralExpression(node)) {
        const slug = literalText(propertyValue(node, "slug"));
        const site = literalText(propertyValue(node, "site"));
        const asin = literalText(propertyValue(node, "asin"));
        const offers = propertyValue(node, "offers");
        const affiliateUrl = literalText(propertyValue(node, "affiliateUrl"));

        if (slug && offers) {
          for (const url of urlsBelow(offers)) {
            add(url, { slug, site, expectedAsin: asin });
          }
        }

        if (slug && affiliateUrl && isAffiliateUrl(affiliateUrl)) {
          add(affiliateUrl, { slug, site, expectedAsin: asin });
        } else if (slug && affiliateUrl?.startsWith("PENDING-")) {
          const url = fallbackAmazonUrl(asin);
          if (url) add(url, { slug, site, expectedAsin: asin });
        }
      }

      if (ts.isStringLiteral(node) && isAffiliateUrl(node.text)) {
        const location = sourceFile.getLineAndCharacterOfPosition(
          node.getStart(sourceFile),
        );
        add(node.text, { line: location.line + 1 });
      }

      ts.forEachChild(node, visit);
    }

    visit(sourceFile);
  }

  return [...records.values()].sort((a, b) => a.url.localeCompare(b.url));
}

function asinFromUrl(value) {
  const url = new URL(value);
  const pathMatch = url.pathname.match(
    /\/(?:dp|gp\/product)\/([A-Z0-9]{10})(?:[/?]|$)/i,
  );
  return (
    (
      pathMatch?.[1] ??
      url.searchParams.get("creativeASIN") ??
      ""
    ).toUpperCase() || null
  );
}

function isAmazonHost(hostname) {
  return hostname === "amazon.com" || hostname.endsWith(".amazon.com");
}

async function request(url, method) {
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await fetch(url, {
        method,
        redirect: "manual",
        signal: AbortSignal.timeout(15_000),
        headers: {
          "user-agent":
            "Mozilla/5.0 (compatible; MadaBaseAffiliateLinkChecker/1.0)",
          accept: "text/html,application/xhtml+xml",
        },
      });
    } catch (error) {
      lastError = error;
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 250));
      }
    }
  }

  throw lastError;
}

async function follow(url) {
  const redirects = [];
  let current = url;

  if (isAmazonHost(new URL(current).hostname)) {
    return {
      status: null,
      finalUrl: current,
      redirects,
      resolution: "direct_amazon_url",
    };
  }

  for (let hop = 0; hop < 8; hop += 1) {
    let response = await request(current, "HEAD");
    if (response.status === 405 || response.status === 501) {
      response = await request(current, "GET");
    }

    const location = response.headers.get("location");
    if (response.status >= 300 && response.status < 400 && location) {
      const next = new URL(location, current).toString();
      redirects.push({ status: response.status, from: current, to: next });
      if (isAmazonHost(new URL(next).hostname)) {
        return {
          status: response.status,
          finalUrl: next,
          redirects,
          resolution: "amazon_redirect",
        };
      }
      current = next;
      continue;
    }

    return {
      status: response.status,
      finalUrl: current,
      redirects,
      resolution: "terminal_response",
    };
  }

  throw new Error("too_many_redirects");
}

async function check(record) {
  try {
    const response = await follow(record.url);
    const final = new URL(response.finalUrl);
    const actualAsin = asinFromUrl(response.finalUrl);
    const actualTag = final.searchParams.get("tag");
    const problems = [];

    if (
      response.status !== null &&
      (response.status < 200 || response.status >= 400)
    )
      problems.push(`http_${response.status}`);
    if (!isAmazonHost(final.hostname))
      problems.push(`unexpected_host:${final.hostname}`);
    if (actualTag !== partnerTag)
      problems.push(`missing_or_wrong_tag:${actualTag ?? "none"}`);
    if (record.expectedAsin && actualAsin !== record.expectedAsin) {
      problems.push(`asin_mismatch:${actualAsin ?? "none"}`);
    }

    return {
      ...record,
      ok: problems.length === 0,
      status: response.status,
      finalUrl: response.finalUrl,
      actualAsin,
      actualTag,
      redirectCount: response.redirects.length,
      resolution: response.resolution,
      problems,
    };
  } catch (error) {
    return {
      ...record,
      ok: false,
      problems: [error instanceof Error ? error.message : "unknown_error"],
    };
  }
}

async function main() {
  const inventory = buildInventory().filter(
    (item) => !siteFilter || item.site === siteFilter,
  );

  if (inventoryOnly) {
    console.log(`Found ${inventory.length} Amazon affiliate URLs.`);
    for (const item of inventory) {
      console.log(
        `${item.site ?? "unscoped"}\t${item.slug ?? "unscoped"}\t${item.expectedAsin ?? "-"}\t${item.url}`,
      );
    }
    return;
  }

  const results = [];
  const concurrency = 4;

  for (let index = 0; index < inventory.length; index += concurrency) {
    const batch = inventory.slice(index, index + concurrency);
    results.push(...(await Promise.all(batch.map(check))));
  }

  const failed = results.filter((result) => !result.ok);
  const report = {
    checkedAt: new Date().toISOString(),
    partnerTag,
    total: results.length,
    passed: results.length - failed.length,
    failed: failed.length,
    note: "This automated check validates short-link resolution, Amazon destination, partner tag, and known ASINs. Live product availability and Associates exclusion status still require a signed-in Amazon/SiteStripe check.",
    results,
  };

  for (const result of results) {
    const marker = result.ok ? "PASS" : "FAIL";
    console.log(
      `${marker}\t${result.site ?? "unscoped"}\t${result.slug ?? "unscoped"}\t${result.actualAsin ?? "-"}\t${result.problems.join(",") || result.status}`,
    );
  }
  console.log(
    `Checked ${report.total}: ${report.passed} passed, ${report.failed} failed.`,
  );

  if (jsonOutput) {
    fs.mkdirSync(path.dirname(jsonOutput), { recursive: true });
    fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
    console.log(`Wrote ${jsonOutput}`);
  }

  if (failed.length) process.exitCode = 1;
}

await main();
