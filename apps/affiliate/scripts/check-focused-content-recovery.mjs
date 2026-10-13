import assert from "node:assert/strict";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const report = path.join(root, "reports/seo-focus-2026-10-13");
const plan = JSON.parse(fs.readFileSync(path.join(root, "config/focused-content-recovery-2026-10-13.json"), "utf8"));
const baseline = JSON.parse(fs.readFileSync(path.join(report, "baseline-fingerprints.json"), "utf8"));
const ledger = JSON.parse(fs.readFileSync(path.join(report, "changed-urls.json"), "utf8"));
const loader = createRequire(import.meta.url);
loader.extensions[".ts"] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, resolveJsonModule: true },
}).outputText, filename);
const content = loader("../lib/content.ts");
const consolidation = loader("../lib/search-recovery-consolidation.ts");
const sites = plan.scope.sites;
const inventory = sites.flatMap((site) => [
  ...content.siteGuides(site).map((value) => ({ kind: "guide", ...value })),
  ...content.siteRoundups(site).map((value) => ({ kind: "roundup", ...value })),
  ...content.siteProducts(site).map((value) => ({ kind: "product", ...value })),
]);
const keyFor = (x) => `${x.site}:${x.kind}:${x.slug}`;
const sorted = (x) => Array.isArray(x) ? x.map(sorted) : x && typeof x === "object"
  ? Object.fromEntries(Object.keys(x).sort().map((key) => [key, sorted(x[key])])) : x;
const hash = (x) => crypto.createHash("sha256").update(JSON.stringify(sorted(x))).digest("hex");
const selected = new Set(plan.pages.map(keyFor));
const linkRepairs = new Set(plan.discoveryLinkRepairs.map(keyFor));
const retired = ledger.families.flatMap((family) => family.sources);
assert.equal(selected.size, 14);
assert.equal(retired.length, 9);
assert.equal(new Set(sites).size, 7);
assert.equal(inventory.length, Object.keys(baseline).length - 9, "Only the approved nine support pages may leave canonical inventory");
assert.equal(plan.scope.newRoutes, 0);
assert.equal(plan.requestIndexing, false);
const currentByKey = new Map(inventory.map((x) => [keyFor(x), x]));

for (const item of inventory) {
  const key = keyFor(item);
  const original = baseline[key];
  assert.ok(original, `Unexpected new route: ${key}`);
  if (!selected.has(key)) {
    assert.equal(hash(linkRepairs.has(key) ? Object.fromEntries(Object.entries(item).filter(([k]) => k !== "relatedGuides")) : item),
      linkRepairs.has(key) ? original.withoutRelatedGuidesHash : original.hash, `Unapproved content change: ${key}`);
    continue;
  }
  assert.equal(item.title ?? item.name, original.title, `Protected title changed: ${key}`);
  assert.equal(item.seoTitle ?? null, original.seoTitle, `Protected SEO title changed: ${key}`);
  assert.equal(item.asin ?? null, original.asin, `Commerce identity changed: ${key}`);
  assert.equal(hash(item.offers ?? []), original.offersHash, `Commerce offers changed: ${key}`);
  assert.equal(item.updatedAt, "October 13, 2026");
  assert.ok(item.sources?.length, `Missing primary sources: ${key}`);
  assert.ok((item.sections ?? item.editorialSections)?.length >= 5, `Missing tailored decision sections: ${key}`);
  for (const source of item.sources) assert.equal(new URL(source.url).protocol, "https:");
  for (const row of item.comparisonTable?.rows ?? []) assert.equal(row.values.length, item.comparisonTable.columns.length, `Table cell mismatch: ${key}`);
  if (item.kind === "product") assert.equal(item.evidenceMode, "official-spec");
}
for (const page of plan.pages) assert.ok(currentByKey.has(keyFor(page)), `Missing retained page: ${page.url}`);
for (const family of ledger.families) {
  for (const url of family.sources) {
    const slug = new URL(url).pathname.split("/").pop();
    const original = content.findGuide(family.site, slug);
    assert.ok(original, `Retired route must remain resolvable for redirect: ${url}`);
    assert.equal(consolidation.consolidationTargetSlug(original), new URL(family.target).pathname.split("/").pop());
    assert.ok(!currentByKey.has(`${family.site}:guide:${slug}`), `Redirect source in canonical inventory: ${url}`);
  }
}
for (const guide of inventory.filter((x) => x.kind === "guide")) {
  for (const slug of guide.relatedGuides ?? []) {
    assert.ok(!retired.includes(`https://${new URL(plan.pages.find((x) => x.site === guide.site).url).hostname}/guides/${slug}`), `Retired URL in direct discovery: ${guide.slug}`);
  }
}

let runtime = null;
const origin = process.argv.find((x) => x.startsWith("--origin="))?.slice(9);
if (origin) {
  let canonicals = 0, redirects = 0, sitemaps = 0;
  const request = (u, ua = "Mozilla/5.0") => {
    const target = new URL(u);
    return fetch(new URL(target.pathname, origin), { redirect: "manual", headers: { "x-forwarded-host": target.hostname, "x-forwarded-proto": "https", "user-agent": ua } });
  };
  for (const family of ledger.families) {
    for (const ua of ["Mozilla/5.0", "Googlebot/2.1 (+http://www.google.com/bot.html)"]) {
      const response = await request(family.target, ua);
      const body = await response.text();
      const head = body.match(/<head[^>]*>([\s\S]*?)<\/head>/i)?.[1] ?? "";
      assert.equal(response.status, 200, family.target);
      assert.ok(head.includes(`rel="canonical" href="${family.target}"`), `Canonical outside raw head: ${family.target}`);
      assert.ok(/<title>/.test(head));
      assert.ok(!/name="robots"[^>]*content="[^"]*noindex/i.test(head));
      assert.ok(body.includes(family.expectedHeading), `Authored content missing from rendered page: ${family.target}`);
      assert.ok(!body.includes('"@type":"Review"'), `Unsupported Review schema: ${family.target}`);
      canonicals++;
    }
    for (const source of family.sources) {
      const sourceUrl = new URL(source);
      for (const prefix of family.site === "costume" ? [""] : ["", "/en-gb", "/en-ca", "/de-de", "/nl-nl"]) {
        const response = await request(`${sourceUrl.origin}${prefix}${sourceUrl.pathname}`);
        assert.equal(response.status, 308);
        assert.equal(new URL(response.headers.get("location"), source).pathname, prefix + new URL(family.target).pathname);
        redirects++;
      }
    }
  }
  for (const host of new Set(plan.pages.map((x) => new URL(x.url).hostname))) {
    const response = await request(`https://${host}/sitemap.xml`);
    assert.equal(response.status, 200);
    const body = await response.text();
    for (const family of ledger.families.filter((x) => new URL(x.target).hostname === host)) {
      assert.equal(body.split(`<loc>${family.target}</loc>`).length - 1, 1);
      for (const source of family.sources) assert.ok(!body.includes(`<loc>${source}</loc>`));
    }
    sitemaps++;
  }
  runtime = { canonicals, redirects, sitemaps, passed: true };
}
console.log(JSON.stringify({ passed: true, primaryCanonicals: selected.size, protectedOtherCanonicals: inventory.length - selected.size, canonicalInventoryDelta: -9, runtime }, null, 2));
