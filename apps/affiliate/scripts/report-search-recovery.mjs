import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const args = process.argv.slice(2);
const valueFor = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const reportDate = valueFor("--date") ?? "2026-08-21";
const csvOutput = path.resolve(root, valueFor("--csv") ?? `apps/affiliate/reports/affiliate-spam-update-recovery-${reportDate}.csv`);
const reportOutput = path.resolve(root, valueFor("--report") ?? `apps/affiliate/reports/affiliate-spam-update-recovery-${reportDate}.md`);

const sources = [
  { cohort: "ranking118", file: "docs/affiliate-ranking118-search-gate-2026-08-20.csv", expected: 118 },
  { cohort: "expansion757", file: "docs/affiliate-expansion757-search-gate-2026-08-20.csv", expected: 757 },
  { cohort: "soft151", file: "docs/affiliate-soft151-search-gate-2026-08-20.csv", expected: 151 },
];
const siteStates = {
  network: "recovery",
  smarthome: "recovery",
  homeoffice: "protect",
  baby: "protect",
  pet: "recovery",
  style: "maintenance",
  costume: "observe",
};
const dailyEvidence = {
  network: { impressions7d: 1252, clicks7d: 10, aug16: 208, aug17: 209, aug18: 13, state: "recovery" },
  smarthome: { impressions7d: 1097, clicks7d: 4, aug16: 159, aug17: 167, aug18: 18, state: "recovery" },
  homeoffice: { impressions7d: 1266, clicks7d: 5, aug16: 156, aug17: 169, aug18: 186, state: "protect" },
  baby: { impressions7d: 831, clicks7d: 7, aug16: 157, aug17: 126, aug18: 105, state: "protect" },
  pet: { impressions7d: 440, clicks7d: 3, aug16: 79, aug17: 78, aug18: 2, state: "recovery" },
  style: { impressions7d: 16, clicks7d: 0, aug16: null, aug17: null, aug18: null, state: "maintenance" },
  costume: { impressions7d: 30, clicks7d: 0, aug16: null, aug17: null, aug18: null, state: "observe" },
};

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (character === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function recordsFor(file) {
  const [headers, ...rows] = parseCsv(fs.readFileSync(path.join(root, file), "utf8").replace(/^\uFEFF/, ""));
  return rows.map((row) => Object.fromEntries(headers.map((header, index) => [header.trim(), (row[index] ?? "").trim()])));
}

function metricBand(impressions, position) {
  if (!impressions) return "zero-impression";
  if (position <= 10) return "top-10";
  if (position <= 20) return "position-11-20";
  if (position <= 40) return "position-21-40";
  return "position-40-plus";
}

function classify(entry) {
  const impacted = entry.siteState === "recovery";
  if (entry.clicks > 0) {
    return {
      decision: "protect-click-bearing-intent",
      earliestActionDate: "now-protection-only",
      reason: "The exact URL earned at least one click in the complete cohort window; avoid title or canonical churn during the update.",
    };
  }
  if (entry.cohort === "soft151") {
    return {
      decision: "hold-post-sitemap-observation",
      earliestActionDate: "2026-08-27",
      reason: "This URL entered sitemap-backed discovery on August 20; rewriting or resubmitting before its first complete seven-day window would destroy the baseline.",
    };
  }
  if (entry.siteState === "maintenance" || entry.siteState === "observe") {
    return {
      decision: entry.impressions ? "observe-low-sample" : "maintenance-or-retirement-review",
      earliestActionDate: "2026-09-08",
      reason: "The site does not yet have enough search volume to justify rollout-period content changes; decide from the Day-30 cohort gate.",
    };
  }
  if (entry.cohort === "expansion757") {
    if (!entry.impressions) {
      return impacted
        ? {
            decision: "family-merge-or-demand-review",
            earliestActionDate: "2026-08-23",
            reason: "The URL has zero impressions and belongs to a site hit by the update; review family overlap, real demand and canonical choice at Day 14 without deleting it during rollout.",
          }
        : {
            decision: "observe-index-and-demand-to-day30",
            earliestActionDate: "2026-09-08",
            reason: "The host remains healthy, so preserve the URL and use the Day-30 gate to separate slow discovery from weak demand.",
          };
    }
    if (entry.position <= 10) {
      return {
        decision: "protect-emerging-ranking",
        earliestActionDate: "now-protection-only",
        reason: "The page has an emerging top-ten position; preserve its exact intent and supporting path during rollout.",
      };
    }
    if (entry.position <= 20) {
      return {
        decision: "strengthen-evidence-after-rollout",
        earliestActionDate: impacted ? "rollout-complete-plus-3-days" : "2026-08-23",
        reason: "The page is within reach of page one; only evidence-backed internal support is justified after the comparison gate.",
      };
    }
    if (entry.position <= 40) {
      return {
        decision: impacted ? "query-fit-and-evidence-review" : "observe-mid-pack",
        earliestActionDate: impacted ? "rollout-complete-plus-3-days" : "2026-09-08",
        reason: impacted
          ? "Mid-pack visibility on an affected host needs exact query-fit review after rollout, not a broad template rewrite."
          : "The host remains healthy and the page has discovery; wait for Day 30 before considering a focused improvement.",
      };
    }
    return {
      decision: "retarget-or-merge-review",
      earliestActionDate: impacted ? "rollout-complete-plus-3-days" : "2026-09-08",
      reason: "Deep visibility requires an exact-query and family-overlap decision before any retarget, merge or canonical change.",
    };
  }
  if (!entry.impressions) {
    return {
      decision: impacted ? "index-demand-and-canonical-review" : "observe-index-and-demand",
      earliestActionDate: impacted ? "rollout-complete-plus-3-days" : "2026-09-08",
      reason: "The established page has no impressions; verify indexing, demand and competing canonical intent before changing it.",
    };
  }
  if (entry.position <= 10) {
    return {
      decision: "protect-ranking-review-ctr",
      earliestActionDate: "rollout-complete-plus-3-days",
      reason: "The URL ranks in the top ten; preserve the intent and review CTR only after rollout data stabilizes.",
    };
  }
  if (entry.position <= 20) {
    return {
      decision: "strengthen-supporting-evidence",
      earliestActionDate: "rollout-complete-plus-3-days",
      reason: "The established page is on page two and is a focused supporting-evidence candidate after the update.",
    };
  }
  if (entry.position <= 40) {
    return {
      decision: "query-intent-review",
      earliestActionDate: "rollout-complete-plus-3-days",
      reason: "The page has measurable discovery but needs exact query-to-page fit evidence before a focused rewrite.",
    };
  }
  return {
    decision: "retarget-or-merge-review",
    earliestActionDate: "rollout-complete-plus-3-days",
    reason: "The established page is visible only at deep positions; evaluate demand and overlap before retargeting or merging.",
  };
}

const entries = sources.flatMap((source) => {
  const rows = recordsFor(source.file);
  if (rows.length !== source.expected) throw new Error(`${source.file} has ${rows.length} rows; expected ${source.expected}`);
  return rows.map((row) => {
    if (row.cohort !== source.cohort) throw new Error(`${row.url}: unexpected cohort ${row.cohort}`);
    const clicks = Number(row.clicks || 0);
    const impressions = Number(row.impressions || 0);
    const position = row.position ? Number(row.position) : null;
    const entry = {
      cohort: row.cohort,
      site: row.site,
      siteState: siteStates[row.site],
      family: row.family ?? "",
      roleOrKind: row.role || row.kind || "",
      slug: row.slug || new URL(row.url).pathname.split("/").filter(Boolean).at(-1) || "",
      titleOrQuery: row.title || row.query || "",
      url: row.url,
      clicks,
      impressions,
      ctr: row.ctr || "0%",
      position,
      band: metricBand(impressions, position),
      immediateContentMutation: "hold",
    };
    if (!entry.siteState) throw new Error(`${entry.url}: unknown site ${entry.site}`);
    return { ...entry, ...classify(entry) };
  });
});

const expectedTotal = sources.reduce((sum, source) => sum + source.expected, 0);
if (entries.length !== expectedTotal) throw new Error(`Recovery ledger has ${entries.length} rows; expected ${expectedTotal}`);
const identities = entries.map((entry) => `${entry.cohort}:${entry.url}`);
if (new Set(identities).size !== identities.length) throw new Error("Recovery ledger contains duplicate cohort URL identities");
if (entries.some((entry) => !entry.decision || !entry.reason || !entry.earliestActionDate)) throw new Error("Every URL must have an explicit recovery decision, reason and action gate");

function escapeCsv(value) {
  const text = value == null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

const headers = [
  "cohort", "site", "siteState", "family", "roleOrKind", "slug", "titleOrQuery", "url", "clicks", "impressions",
  "ctr", "position", "band", "decision", "immediateContentMutation", "earliestActionDate", "reason",
];
const csvRows = entries.map((entry) => headers.map((header) => escapeCsv(entry[header])).join(","));
fs.mkdirSync(path.dirname(csvOutput), { recursive: true });
fs.writeFileSync(csvOutput, `${headers.join(",")}\n${csvRows.join("\n")}\n`);

function groupCount(keyFor) {
  const result = new Map();
  for (const entry of entries) {
    const key = keyFor(entry);
    result.set(key, (result.get(key) ?? 0) + 1);
  }
  return [...result.entries()].sort(([left], [right]) => left.localeCompare(right));
}

const siteSummary = Object.keys(siteStates).map((site) => {
  const rows = entries.filter((entry) => entry.site === site);
  const evidence = dailyEvidence[site];
  return `| ${site} | ${siteStates[site]} | ${rows.length} | ${rows.reduce((sum, row) => sum + row.clicks, 0)} | ${rows.reduce((sum, row) => sum + row.impressions, 0)} | ${evidence.aug16 ?? "—"} | ${evidence.aug17 ?? "—"} | ${evidence.aug18 ?? "—"} |`;
});
const actionSummary = groupCount((entry) => entry.decision).map(([decision, count]) => `| ${decision} | ${count} |`);
const cohortSummary = groupCount((entry) => entry.cohort).map(([cohort, count]) => `| ${cohort} | ${count} |`);

const markdown = `# Cross-site Search Recovery Ledger — ${reportDate}

This is the complete URL-level decision ledger for the three currently measured release cohorts. It freezes immediate content mutation while Google’s August 2026 spam update is rolling out; it is not a bulk deletion or redirect plan.

## Site triage

| Site | State | Ledger URLs | Cohort clicks | Cohort impressions | Aug 16 page impressions | Aug 17 | Aug 18 |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
${siteSummary.join("\n")}

The daily host figures are page-filtered Search Console observations for August 12–18 and are directional because page-dimension aggregation can differ from the property total. Network, Smarthome and Pets show an August 18 cliff; Homeoffice and Baby do not. Style and Costume have too little volume for a reliable cliff diagnosis.

## Cohort completeness

| Cohort | URLs |
| --- | ---: |
${cohortSummary.join("\n")}

Total: **${entries.length} URL decisions**. Every row has a site state, measured cohort result, explicit decision, reason, mutation hold and earliest review gate.

## Decision queue

| Decision | URLs |
| --- | ---: |
${actionSummary.join("\n")}

## Operating rules

- Protect click-bearing and emerging top-ten pages; do not churn their titles or canonicals during rollout.
- Review Expansion757 at Day 14 on August 23 and Day 30 on September 8. A review is not permission for bulk deletion.
- Hold all Soft151 pages unchanged through the complete post-sitemap window ending at the August 27 gate.
- Resume indexable expansion only after the spam update completes, three complete GSC days are available, and an exact cohort gate supports the release.
- Technical outages, merchant safety defects and measurement repairs remain allowed.

Full URL ledger: \`${path.basename(csvOutput)}\`.
`;
fs.mkdirSync(path.dirname(reportOutput), { recursive: true });
fs.writeFileSync(reportOutput, markdown);
console.log(JSON.stringify({ ok: true, rows: entries.length, csv: path.relative(root, csvOutput), report: path.relative(root, reportOutput) }, null, 2));
