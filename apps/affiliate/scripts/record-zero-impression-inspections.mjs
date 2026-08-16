import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const affiliateDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryDir = path.resolve(affiliateDir, "../..");
const docsDir = path.join(repositoryDir, "docs");
const argumentsByName = new Map(
  process.argv.slice(2).map((argument) => {
    const [name, ...value] = argument.replace(/^--/, "").split("=");
    return [name, value.join("=")];
  }),
);
const inputPath = argumentsByName.get("input");
const reportDate = argumentsByName.get("report-date") ?? "2026-08-16";
if (!inputPath) throw new Error("Pass --input=/absolute/path/to/url-inspection-results.json");

function csv(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function zeroUrls(filename) {
  return fs.readFileSync(path.join(docsDir, filename), "utf8")
    .split("\n")
    .filter((line) => line.includes(",zero-impression,"))
    .map((line) => line.match(/https:\/\/[^,]+/)?.[0])
    .filter(Boolean);
}

const expansion = new Set(zeroUrls(`affiliate-expansion757-search-gate-${reportDate}.csv`));
const ranking = new Set(zeroUrls(`affiliate-ranking118-search-gate-${reportDate}.csv`));
const urls = [...new Set([...expansion, ...ranking])].sort();
const attempts = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const successful = new Map(
  attempts.filter((attempt) => !attempt.error && typeof attempt.onGoogle === "boolean").map((attempt) => [attempt.url, attempt]),
);
const quotaBlocker = "Google Search Console alert: Quota exceeded — You have exceeded your property's URL inspection quota. Quota is renewed daily.";
const rows = urls.map((url) => {
  const result = successful.get(url);
  const hasDetail = Boolean(result?.pageFetch || result?.lastCrawl || result?.sitemap);
  return {
    url,
    cohorts: [expansion.has(url) ? "expansion757" : "", ranking.has(url) ? "ranking118" : ""].filter(Boolean).join("+"),
    searchWindowStatus: "zero-impression",
    inspectionStatus: hasDetail ? "live-inspected-detail" : result ? "live-inspected-index-summary" : "blocked-daily-quota",
    onGoogle: result ? (result.onGoogle ? "yes" : "no") : "",
    pageIndexing: result?.indexStatus ?? "",
    sitemap: result?.sitemap ?? "",
    referringPage: result?.referringPage ?? "",
    lastCrawl: result?.lastCrawl ?? "",
    crawlAllowed: result?.crawlAllowed ?? "",
    pageFetch: result?.pageFetch ?? "",
    indexingAllowed: result?.indexingAllowed ?? "",
    userDeclaredCanonical: result?.userDeclaredCanonical ?? "",
    googleSelectedCanonical: result?.googleSelectedCanonical ?? "",
    blocker: hasDetail ? "" : result ? `Index status captured; detail recheck blocked after daily quota alert. ${quotaBlocker}` : quotaBlocker,
    checkedAt: result?.checkedAt ?? "2026-08-16T02:50:00.000Z",
  };
});

const headers = Object.keys(rows[0]);
const csvBody = [headers.join(","), ...rows.map((row) => headers.map((header) => csv(row[header])).join(",")), ""].join("\n");
const indexed = rows.filter((row) => row.onGoogle === "yes").length;
const notOnGoogle = rows.filter((row) => row.onGoogle === "no").length;
const blocked = rows.filter((row) => row.inspectionStatus === "blocked-daily-quota").length;
const detailed = rows.filter((row) => row.inspectionStatus === "live-inspected-detail").length;
const indexSummaryOnly = rows.filter((row) => row.inspectionStatus === "live-inspected-index-summary").length;
const summary = {
  reportDate,
  exactDueZeroImpressionUrls: rows.length,
  expansionZeroImpressionUrls: expansion.size,
  rankingRefreshZeroImpressionUrls: ranking.size,
  liveInspected: rows.length - blocked,
  fullIndexDetailCaptured: detailed,
  indexSummaryCapturedDetailRecheckBlocked: indexSummaryOnly,
  indexed,
  notOnGoogle,
  blockedByDailyQuota: blocked,
  blocker: blocked ? quotaBlocker : null,
  nextInspectionGate: blocked ? "2026-08-17 after the Search Console property quota renews" : null,
};

fs.writeFileSync(path.join(docsDir, `affiliate-zero-impression-inspections-${reportDate}.csv`), csvBody);
fs.writeFileSync(path.join(docsDir, `affiliate-zero-impression-inspections-${reportDate}.json`), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify(summary, null, 2));
