import assert from "node:assert/strict";
import fs from "node:fs";
import { loadAffiliateTypescript as load } from "./lib/load-affiliate-typescript.mjs";
const { costumeVariantState: state, costumeDestinationsMatch: same, costumeReviewedCommerceWhere: where, costumeReviewedRentalWhere: rentalWhere, costumeTransactionLabel: label } = load("../../lib/costume-variant-review.ts");
const data = JSON.parse(fs.readFileSync(new URL("../lib/reviewed-costume-variants.json", import.meta.url)));
const input = (r) => ({ id: r.id, title: r.title, variantId: r.variantId, externalId: r.externalId, destinationUrl: r.destinationUrl, raw: { item_group_id: r.groupId, mpn: r.sku } });
assert.equal(data.rows.length, 76);
let identities = 0, holds = 0;
for (const row of data.rows) {
  const actual = state(input(row));
  assert.equal(actual.identity, "matched", row.title);
  assert.equal(Boolean(actual.hold), !row.available || Boolean(row.hold), row.title);
  if (actual.hold) holds++;
  for (const change of [
    { externalId: "different" }, { variantId: "different" }, { title: row.title + " different size" },
    { raw: { item_group_id: "different", mpn: row.sku } },
    { raw: { item_group_id: row.groupId, mpn: "different" } },
    { destinationUrl: row.destinationUrl.replace(/variant=[^&]+/, "variant=999") },
    { destinationUrl: row.destinationUrl + "&variant=" + row.variantId },
  ]) {
    const result = state({ ...input(row), ...change });
    assert.equal(result.identity, "conflict", row.title);
    assert.ok(result.hold, "A reviewed ID cannot authorize a changed exact variant");
    identities++;
  }
}
const buy = data.rows.find((row) => row.transaction === "buy" && row.available && !row.hold);
const rent = data.rows.find((row) => row.transaction === "rent" && row.available && !row.hold);
const unknown = data.rows.find((row) => row.transaction === "unknown" && row.available && !row.hold);
assert.equal(label(state(input(buy))), "Selected purchase");
assert.equal(label(state(input(rent))), "Selected rental");
assert.equal(label(state(input(unknown))), null);
assert.equal(label(null), null);
assert.equal(state({ ...input(buy), id: "unreviewed" }), null);
const heldIds = where().id.notIn;
assert.equal(heldIds.length, holds);
assert.ok(data.rows.filter((row) => row.transaction === "buy").every((row) => !rentalWhere().id.in.includes(row.id)));
const first = new URL(buy.destinationUrl);
assert.equal(same(buy.destinationUrl, buy.destinationUrl + "&utm_source=reference"), true);
assert.equal(same(buy.destinationUrl, first.origin + first.pathname), false);
assert.equal(same(buy.destinationUrl, buy.destinationUrl.replace("https:", "http:")), false);
assert.equal(same(buy.destinationUrl, buy.destinationUrl.replace("abracadabranyc.com", "example.com")), false);
assert.equal(same(buy.destinationUrl, buy.destinationUrl.replace(/\/products\//, "/collections/")), false);
const page = fs.readFileSync(new URL("../app/products/[slug]/page.tsx", import.meta.url), "utf8");
assert.ok(!page.includes('"NewCondition"') && !page.includes('schema.org/NewCondition'));
assert.ok(!page.includes('"@type": "Offer"'), "Historical observation must not become a current structured Offer");
console.log(JSON.stringify({ passed: true, capturedVariants: data.rows.length, identityMutationCases: identities, unavailableOrConflictHolds: holds, unknownTransactionNotInferred: true, exactRentalFilter: true, noUnverifiedStructuredOffer: true, noDatabaseQueryOrWrite: true }));
