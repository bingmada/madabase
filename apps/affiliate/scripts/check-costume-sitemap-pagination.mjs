import assert from "node:assert/strict";
import { loadAffiliateTypescript as load } from "./lib/load-affiliate-typescript.mjs";
const { collectAllCostumeProducts: collect } = load("../../lib/costume-indexable-pagination.ts");
let cases = 0;
for (const count of [0, 1, 99, 100, 101, 200, 201, 539]) {
  const rows = Array.from({ length: count }, (_, n) => ({ id: String(n).padStart(5, "0"), eligible: n % 11 !== 0 }));
  const calls = [];
  const result = await collect(async (after, take) => {
    calls.push({ after, take });
    return rows.filter((row) => after === null || row.id > after).slice(0, take);
  }, (row) => row.eligible);
  assert.deepEqual(result, rows.filter((row) => row.eligible));
  assert.equal(new Set(result.map((row) => row.id)).size, result.length);
  assert.equal(calls.length, Math.floor(count / 100) + 1);
  cases++;
}
let calls = 0;
await assert.rejects(() => collect(async () => {
  if (calls++) throw new Error("Explicit failed second query");
  return Array.from({ length: 100 }, (_, n) => ({ id: String(n).padStart(5, "0") }));
}, () => true), /failed second query/);
await assert.rejects(() => collect(async () => [{ id: "same" }, { id: "same" }], () => true), /did not advance/);
console.log(JSON.stringify({ passed: true, catalogBoundaryCases: cases, laterPageFailurePropagates: true, duplicateOrNonAdvancingPageRejected: true, noDatabaseQueryOrWrite: true }));
