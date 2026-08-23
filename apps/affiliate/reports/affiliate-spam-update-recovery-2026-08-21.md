# Cross-site Search Recovery Ledger — 2026-08-21

This is the complete URL-level decision ledger for the three currently measured release cohorts. It freezes immediate content mutation while Google’s August 2026 spam update is rolling out; it is not a bulk deletion or redirect plan.

## Site triage

| Site | State | Ledger URLs | Cohort clicks | Cohort impressions | Aug 16 page impressions | Aug 17 | Aug 18 |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| network | recovery | 166 | 11 | 1139 | 208 | 209 | 13 |
| smarthome | recovery | 202 | 6 | 1063 | 159 | 167 | 18 |
| homeoffice | protect | 222 | 4 | 802 | 156 | 169 | 186 |
| baby | protect | 190 | 2 | 507 | 157 | 126 | 105 |
| pet | recovery | 204 | 2 | 312 | 79 | 78 | 2 |
| style | maintenance | 2 | 0 | 1 | — | — | — |
| costume | observe | 40 | 0 | 4 | — | — | — |

The daily host figures are page-filtered Search Console observations for August 12–18 and are directional because page-dimension aggregation can differ from the property total. Network, Smarthome and Pets show an August 18 cliff; Homeoffice and Baby do not. Style and Costume have too little volume for a reliable cliff diagnosis.

## Cohort completeness

| Cohort | URLs |
| --- | ---: |
| expansion757 | 757 |
| ranking118 | 118 |
| soft151 | 151 |

Total: **1026 URL decisions**. Every row has a site state, measured cohort result, explicit decision, reason, mutation hold and earliest review gate.

## Decision queue

| Decision | URLs |
| --- | ---: |
| family-merge-or-demand-review | 217 |
| hold-post-sitemap-observation | 151 |
| index-demand-and-canonical-review | 13 |
| maintenance-or-retirement-review | 39 |
| observe-index-and-demand | 4 |
| observe-index-and-demand-to-day30 | 142 |
| observe-low-sample | 3 |
| observe-mid-pack | 28 |
| protect-click-bearing-intent | 19 |
| protect-emerging-ranking | 111 |
| protect-ranking-review-ctr | 24 |
| query-fit-and-evidence-review | 30 |
| query-intent-review | 17 |
| retarget-or-merge-review | 146 |
| strengthen-evidence-after-rollout | 51 |
| strengthen-supporting-evidence | 31 |

## Operating rules

- Protect click-bearing and emerging top-ten pages; do not churn their titles or canonicals during rollout.
- Review Expansion757 at Day 14 on August 23 and Day 30 on September 8. A review is not permission for bulk deletion.
- Hold all Soft151 pages unchanged through the complete post-sitemap window ending at the August 27 gate.
- Resume indexable expansion only after the spam update completes, three complete GSC days are available, and an exact cohort gate supports the release.
- Technical outages, merchant safety defects and measurement repairs remain allowed.

Full URL ledger: `affiliate-spam-update-recovery-2026-08-21.csv`.
