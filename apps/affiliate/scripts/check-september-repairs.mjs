import assert from "node:assert/strict";
import fs from "node:fs";

const origin = process.env.REPAIR_CHECK_ORIGIN ?? "http://127.0.0.1:3121";
const cases = [
  ["network", "/guides/usb-wifi-adapters-buying-guide", "Confirm the driver before the adapter arrives"],
  ["smarthome", "/guides/smart-bathroom-exhaust-fans-buying-guide", "Separate ventilation from speaker and lighting features"],
  ["homeoffice", "/guides/office-lumbar-cushions-buying-guide", "Check the seat depth left after adding thickness"],
  ["homeoffice", "/guides/office-printer-stands-buying-guide", "Measure an entire print-and-scan cycle"],
  ["baby", "/guides/childproof-door-knob-covers-buying-guide", "Test adult access before relying on the barrier"],
  ["baby", "/guides/toddler-snack-containers-buying-guide", "Match the opening to the food and the hand"],
  ["homeoffice", "/reviews/branch-ergonomic-chair", "Seven years for chair components, three for fabric"],
  ["homeoffice", "/reviews/hon-ignition-2-0-chair", "Lifetime coverage has shorter component terms"],
  ["style", "/categories/styling", "Styling guides"],
];
const results = [];
const scripts = new Map();
for (const [site, path, text] of cases) {
  const host = `${site}.madabase.com`;
  const canonical = `https://${host}${path}`;
  const response = await fetch(origin === "public" ? canonical : origin + path, { headers: { Host: host, "x-forwarded-host": host, "x-forwarded-proto": "https" }, signal: AbortSignal.timeout(35000) });
  const html = await response.text();
  const hrefs = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(match => match[1].replaceAll("&amp;", "&"));
  let merchantRepair = true;
  if (path === "/reviews/branch-ergonomic-chair" || path === "/reviews/hon-ignition-2-0-chair") {
    merchantRepair = hrefs.some(href => href.includes("/dp/B06Y3PGPR2") && href.includes("tag=madaoffice-20"))
      && hrefs.every(href => !href.includes("B07GNDDNMW") && !href.includes("B0GWGK4JFK") && !href.includes("amzn.to/4eWkGpe"));
    if (path === "/reviews/branch-ergonomic-chair") merchantRepair &&= html.includes("Different product") && html.includes("verified alternative");
  }
  let qaGuardDelivered = false;
  for (const match of html.matchAll(/<script[^>]+src="([^\"]+)"/g)) {
    if (!match[1].includes("/app/layout-")) continue;
    const scriptUrl = new URL(match[1], origin === "public" ? canonical : origin).href;
    if (!scripts.has(scriptUrl)) {
      const scriptResponse = await fetch(scriptUrl, { headers: { "x-forwarded-host": host }, signal: AbortSignal.timeout(35000) });
      scripts.set(scriptUrl, await scriptResponse.text());
    }
    qaGuardDelivered ||= scripts.get(scriptUrl).includes("madabase:qa-session");
  }
  const row = {
    url: canonical, status: response.status,
    canonical: html.includes(`<link rel="canonical" href="${canonical}"`),
    oneH1: (html.match(/<h1\b/g) ?? []).length === 1,
    indexable: !/<meta name="robots" content="[^"]*noindex/.test(html),
    repairPresent: html.includes(text),
    qaGuardPresent: qaGuardDelivered,
    merchantRepair,
  };
  row.pass = row.status === 200 && row.canonical && row.oneH1 && row.indexable && row.repairPresent && row.qaGuardPresent && row.merchantRepair;
  results.push(row);
}
if (origin !== "public") {
  const response = await fetch(origin + "/api/affiliate-clicks", { method: "POST", headers: { Host: "homeoffice.madabase.com", "Content-Type": "application/json", Referer: "https://homeoffice.madabase.com/?utm_source=qa&utm_medium=verification" }, body: "{}" });
  assert.deepEqual(await response.json(), { ok: true, persisted: false, reason: "qa_visit" });
}
const reportPath = new URL(`../reports/seo-audit-2026-09-24/${origin === "public" ? "public" : "candidate"}-repair-check.json`, import.meta.url);
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2) + "\n");
console.log(JSON.stringify({ passed: results.filter(row => row.pass).length, total: results.length, failures: results.filter(row => !row.pass) }));
assert.ok(results.every(row => row.pass), "Repair runtime checks failed");
