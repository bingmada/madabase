# Affiliate deep-rank recovery — August 27, 2026

Status: production deployed, publicly validated, and exact IndexNow notification complete

## Why this batch exists

The rolling 24-hour comparison improved average position while total impressions remained weak, so the problem is not a uniform portfolio-wide ranking collapse. The complete August 18-24 Search Console export identified a narrower actionable group: existing governed guides with confirmed exposure, zero clicks, and average position deeper than 40.

This release improves that exact group without changing the query target. It is an existing-page recovery exception under the active publication freeze; it does not publish a new URL, open a new product cohort, or broadly rewrite titles.

## Exact cohort

- 43 existing guide URLs
- 186 complete-window impressions
- Average-position range: 43 through 106
- Network: 3 URLs
- Smarthome: 2 URLs
- Homeoffice: 21 URLs
- Baby: 17 URLs
- Pets, Style, and Costume: 0 URLs because none passed the evidence gate

The canonical machine-readable ledger is `apps/affiliate/config/deep-rank-recovery-2026-08-27.json`.

## Protected pages

The release deliberately leaves these groups unchanged:

- every page averaging position 40 or better;
- every page with a click in the complete measurement window;
- Ranking118 and Soft151 controlled cohorts;
- the four pages individually refreshed on August 23;
- all August 23 consolidation hubs and redirect sources;
- zero-impression pages pending index and demand diagnosis.

The target ledger has zero overlap with Ranking118, Soft151, or the 25 consolidated families.

## Page changes

Each selected guide receives three material, page-specific changes:

1. a stronger first-screen direct answer built from the family’s exact job, four decision dimensions, ownership burden, setup path, and stop condition;
2. one new role-specific decision section for buying, comparison, compatibility, ownership, workflow, or safety intent;
3. an August 27 update date and sitemap lastmod.

Titles, H1s, slugs, canonicals, search questions, product identities, commerce CTAs, merchant links, and existing sibling-intent links are unchanged. The 43 direct answers and 43 added decision sections are unique.

## Validation

- deep-rank cohort audit: 43 of 43 passed;
- governed expansion audit: 757 URLs, 154 families, 757 unique questions, 757 unique direct answers, and no repeated section body;
- Ranking118/Soft151 overlap: 0;
- consolidation-family overlap: 0;
- SEO audit: 964 published guides, 175 products, 77 roundups, and seven tools passed;
- affiliate links: 306 of 306 passed with eight known unavailable offers still suppressed;
- ESLint, TypeScript, and optimized Next.js build: passed;
- immutable Linux x64 candidate: 43 of 43 pages returned HTTP 200 with the expected title/H1, self-canonical, indexability, update date, and decision section;
- candidate sitemap: 43 of 43 exact entries carried August 27 lastmod;
- category discovery: 154 of 154 family hubs and 515 of 515 remaining support links passed.

Release commit `a4e8e63` is pushed to `origin/lyd-0609`. The 60,737,284-byte archive has SHA-256 `eb88921834501e2428432f3bf460ef7741f599753bbe02bb4f7ac00f2e3a2d37`; the server extracted the hash-matched Git object into `/srv/madabase-affiliate/releases/a4e8e63` without changing the dirty fixed checkout. The systemd service and `current` symlink point to that immutable release on loopback port 3011 with zero restarts. Release `22f2985` is retained as immediate rollback.

All seven origin homepages returned HTTP 200. The exact public audit then passed 43 of 43 pages and 43 of 43 sitemap entries. IndexNow accepted exactly 43 changed canonicals with HTTP 200: Network 3, Smarthome 2, Homeoffice 21, and Baby 17. No previous release URL, redirect source, zero-impression page, unchanged sitemap, or product pilot was submitted.

## Measurement and rollback

Do not judge this batch from same-day or partial 24-hour movement. Use rolling 24 hours only for anomaly detection, then compare the exact 43-URL cohort on complete data at:

- first directional review: September 3, 2026;
- tactical review: September 10, 2026;
- portfolio decision: September 24, 2026.

Protect individual URLs that gain clicks or move into the top 20. At the tactical gate, revise only pages that remain exposed and deep; do not reset the whole cohort. Roll back the release only for a confirmed runtime, canonical, indexability, merchant, or severe relevance defect—not for normal short-term ranking volatility.
