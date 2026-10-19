import assert from "node:assert/strict";
import fs from "node:fs";
import Module from "node:module";
import { loadAffiliateTypescript } from "./lib/load-affiliate-typescript.mjs";
import { buildInventory } from "./check-affiliate-links.mjs";

const { publishedCommerceInventory, isPublishedCommerceClick } = loadAffiliateTypescript("../../lib/commerce-inventory.ts");
const { amazonFamilyProductInventory, amazonFamilyProductIdentity, findAmazonFamilyProduct } = loadAffiliateTypescript("../../lib/amazon-family-products.ts");
const inventory = publishedCommerceInventory();
const families = amazonFamilyProductInventory();
for (const product of inventory) {
  for (const offer of product.offers) assert.ok(isPublishedCommerceClick(product.site, product.slug, offer.merchant), product.slug);
  assert.equal(isPublishedCommerceClick(product.site, product.slug, "Unapproved merchant"), false);
}
for (const product of families) {
  const identity = amazonFamilyProductIdentity(product);
  const blocked = Boolean(findAmazonFamilyProduct(product.site, product.familySlug)?.offerBlock);
  assert.equal(isPublishedCommerceClick(product.site, identity.slug, "Amazon US"), !blocked);
  assert.equal(isPublishedCommerceClick(product.site, `family-${product.familySlug}`, "Amazon US"), false);
  assert.equal(isPublishedCommerceClick(product.site, identity.slug + "-extra", "Amazon US"), false);
  assert.equal(isPublishedCommerceClick("style", identity.slug, "Amazon US"), false);
  assert.ok(identity.slug.length <= 180);
}
assert.equal(isPublishedCommerceClick("baby", "family-toddler-learning-towers-b001echxvc", "Amazon US"), false);
assert.equal(isPublishedCommerceClick("network", "family-pass-through-ethernet-crimping-tools-b076mgpqzq", "Amazon US"), true);

const checked = new Set(buildInventory().map((record) => `${record.site}:${record.expectedAsin}`));
const oldAudit = new URL("../reports/acquisition-commerce-audit-2026-10-19/checker-coverage-gaps.csv", import.meta.url);
const gapRows = fs.readFileSync(oldAudit, "utf8").trim().split("\n");
const headings = gapRows.shift().split(",");
const siteColumn = headings.indexOf("site");
const asinColumn = headings.indexOf("asin");
assert.ok(siteColumn >= 0 && asinColumn >= 0);
let recovered = 0;
for (const line of gapRows) {
  const values = line.split(",");
  const key = `${values[siteColumn]}:${values[asinColumn]}`;
  if (key === "baby:B001ECHXVC") continue;
  assert.ok(checked.has(key), `Uncovered old gap: ${key}`);
  recovered++;
}
assert.equal(recovered, 209);

// Exercise the actual route with a fake database, never production analytics.
const originalLoad = Module._load;
const writes = new Map();
let attempts = 0;
Module._load = function(request, parent, isMain) {
  if (request === "@/lib/commerce-inventory") return { isPublishedCommerceClick };
  if (request === "@/lib/db") return {
    hasDatabaseUrl: () => true,
    getAffiliatePrisma: () => ({ affiliateClick: { upsert: async (input) => {
      attempts++;
      if (!writes.has(input.where.eventId)) writes.set(input.where.eventId, input.create);
      assert.deepEqual(input.update, {});
    } } }),
  };
  return originalLoad.call(this, request, parent, isMain);
};
const { POST } = loadAffiliateTypescript("../../app/api/affiliate-clicks/route.ts");
const valid = { eventId: "local-test-1", site: "network", productSlug: "family-pass-through-ethernet-crimping-tools-b076mgpqzq", merchant: "Amazon US", position: "guide-top", path: "/guides/pass-through-ethernet-crimping-tools-buying-guide" };
async function post(payload, qa = false) {
  const response = await POST(new Request("https://network.madabase.com/api/affiliate-clicks", {
    method: "POST", headers: { "Content-Type": "application/json", ...(qa ? { referer: "https://network.madabase.com/guides/test?madabase-qa=1" } : {}) }, body: JSON.stringify(payload),
  }));
  return { status: response.status, body: await response.json() };
}
assert.deepEqual((await post(valid, true)).body, { ok: true, persisted: false, reason: "qa_visit", validated: true });
assert.equal(attempts, 0);
assert.equal((await post(valid)).body.persisted, true);
assert.equal((await post(valid)).body.persisted, true);
assert.equal(writes.size, 1);
for (const bad of [null, [], { ...valid, productSlug: 123 }, { ...valid, site: "costume" }, { ...valid, merchant: "Wrong" }, { ...valid, productSlug: valid.productSlug + "-extra" }, { ...valid, path: "https://example.com" }, { ...valid, site: "baby", productSlug: "family-toddler-learning-towers-b001echxvc" }]) {
  assert.equal((await post(bad, true)).status, 400);
}
assert.equal(attempts, 2);
Module._load = originalLoad;
console.log(JSON.stringify({ passed: true, publishedIdentities: inventory.length, familyIdentities: families.length, checkedSiteAsins: checked.size, oldGapsRecovered: recovered, oldGapSuppressed: "baby:B001ECHXVC", qaWrites: 0, idempotentRows: writes.size }));
