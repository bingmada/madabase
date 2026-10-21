import assert from "node:assert/strict";
import fs from "node:fs";
import { loadAffiliateTypescript as load } from "./lib/load-affiliate-typescript.mjs";

const { ownershipCost } = load("../../../main/lib/ownership-cost.ts");
const { editorialExpansionGuides } = load("../../lib/october-editorial-expansion.ts");
const { familyDecisionTitles } = load("../../lib/guide-editorial-repairs.ts");
const { findGuide, findProduct, findRoundup, siteGuides } = load("../../lib/content.ts");
const { miniPcProfiles } = load("../../lib/tiny-models.ts");
const { planMiniPc } = load("../../lib/compatibility-engine.ts");
const { resolveFruShopping } = load("../../lib/tiny-fru.ts");
const { siteSearchIndex } = load("../../lib/site-search.ts");
const { searchContent } = load("../../../shared/content-search.ts");
const rows = [];
const check = (name, run) => { run(); rows.push({ name, passed: true }); };
const input = { purchase: 150, accessories: 20, firstYearPlan: 30, renewalPlan: 60, annualConsumables: 12, watts: 5, hoursPerDay: 24, pricePerKwh: 0.2 };
check("One year does not charge a renewal", () => assert.equal(ownershipCost(input, 1).subscriptions, 30));
check("Three years includes exactly two renewals", () => assert.equal(ownershipCost(input, 3).subscriptions, 150));
check("Power is converted from watts to kWh", () => assert.ok(Math.abs(ownershipCost(input, 3).electricity - 26.28) < 1e-9));
check("Complete three-year example", () => assert.ok(Math.abs(ownershipCost(input, 3).total - 382.28) < 1e-9));
check("Zero-priced confirmed inputs are allowed", () => assert.equal(ownershipCost(Object.fromEntries(Object.keys(input).map((key) => [key, 0])), 3).total, 0));
for (const value of [-1, Infinity, NaN]) check(`Invalid purchase ${value} rejected`, () => assert.equal(ownershipCost({ ...input, purchase: value }, 3), null));
check("More than 24 powered hours rejected", () => assert.equal(ownershipCost({ ...input, hoursPerDay: 25 }, 3), null));
for (const years of [0, 1.5, 11]) check(`Invalid ownership period ${years}`, () => assert.equal(ownershipCost(input, years), null));
check("Five distinct canonical guides", () => assert.equal(new Set(editorialExpansionGuides.map((guide) => `${guide.site}:${guide.slug}`)).size, 5));
for (const guide of editorialExpansionGuides) {
  check(`Published registry and sources: ${guide.slug}`, () => {
    assert.ok(findGuide(guide.site, guide.slug));
    assert.ok(guide.sources.length >= 2);
    assert.ok(guide.sources.every((source) => new URL(source.url).protocol === "https:"));
    assert.ok(guide.quickAnswer && guide.comparisonTable && guide.sections.length >= 4);
    assert.equal(siteGuides(guide.site).filter((item) => item.slug === guide.slug).length, 1);
  });
  check(`Discovery and reciprocal links: ${guide.slug}`, () => {
    assert.ok(siteSearchIndex(guide.site).some((item) => item.href === `/guides/${guide.slug}`));
    for (const slug of guide.relatedGuides ?? []) {
      const target = findGuide(guide.site, slug);
      assert.ok(target, `Missing guide ${slug}`);
      assert.ok(target.relatedGuides?.includes(guide.slug), `Missing backlink ${slug}`);
    }
    for (const slug of guide.relatedProducts ?? []) assert.ok(findProduct(guide.site, slug));
    for (const slug of guide.relatedRoundups) assert.ok(findRoundup(guide.site, slug));
  });
}
check("All 54 generic-title replacements are topic-specific and distinct", () => {
  assert.equal(Object.keys(familyDecisionTitles).length, 54);
  assert.equal(new Set(Object.values(familyDecisionTitles)).size, 54);
  assert.ok(Object.values(familyDecisionTitles).every((title) => !title.includes("Fit, Trade-offs")));
});
check("Cart guide distinguishes the linked cart from a cabinet", () => {
  const guide = findGuide("homeoffice", "rolling-file-cabinets-buying-guide");
  assert.match(guide.quickAnswer, /open hanging-file cart/);
  assert.match(guide.quickAnswer, /not an enclosed drawer cabinet/);
});
check("Scanner guide identifies individual receipt feeding", () => assert.match(findGuide("homeoffice", "receipt-scanners-buying-guide").quickAnswer, /single-sheet/));
check("Other-brand specifications are not transferred to the linked product", () => {
  assert.match(findGuide("homeoffice", "under-desk-pedal-exercisers-buying-guide").quickAnswer, /does not establish Putnen/);
  assert.match(findGuide("homeoffice", "vesa-monitor-adapters-buying-guide").quickAnswer, /not the VIVO/);
});
check("Gen 2 is a separate searchable model", () => {
  assert.equal(miniPcProfiles.length, 8);
  assert.equal(searchContent(siteSearchIndex("homeoffice"), "M70q Gen 2 RAM")[0].href, "/compatibility/mini-pcs#tiny-model-m70q-gen2");
});
check("Gen 2 does not inherit a second NVMe position", () => assert.equal(planMiniPc({ model: "m70q-gen2", task: "second-nvme", pcie: "no", ramGb: 0, storageNeed: "yes", storageReady: "yes", hasKit: "yes" }).status, "incompatible"));
check("Gen 2 cannot buy another generation's SATA kit", () => {
  const result = resolveFruShopping({ model: "m70q-gen2", machine: "11MY", need: "yes", scope: "serial", cable: "00XL211", carrier: "01MN886", ownsCable: false, ownsCarrier: false, photos: "yes", bay: "yes" });
  assert.equal(result.offers.length, 0);
});

const output = { passed: true, checks: rows.length, rows };
fs.writeFileSync(new URL("../reports/editorial-refresh-2026-10-20/decision-checks.json", import.meta.url), JSON.stringify(output, null, 2) + "\n");
console.log(JSON.stringify({ passed: true, checks: rows.length }));
