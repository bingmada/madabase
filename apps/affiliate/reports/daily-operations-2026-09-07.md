# Affiliate daily operations — 2026-09-07

## Outcome

Completed the overdue Soft151 Day-14 search gate, the ErGear/FlexiSpot Day-7 experiment gate, the latest rolling 24-hour and seven-day portfolio review, conversion checks, merchant-link checks, and production health checks. The initial review did not justify one undifferentiated rewrite of indexed and unindexed pages. After the owner directed immediate existing-page action, the exact 40 pages that were indexed and had zero impressions in both compared seven-day windows were upgraded, deployed and submitted to IndexNow. No new route, sitemap resubmission or bulk Search Console Request indexing was used.

The important result is not a new site-wide collapse. The latest 24 hours improved in impressions, clicks, CTR, and average position, while the seven-day view remained weak in clicks and CTR but improved materially in average position. The Soft151 failure is mixed: Network and the checked part of Pets are largely not indexed, while many zero-impression Smarthome, Homeoffice, and Baby pages are already indexed. The indexed double-zero group received a bounded comparison-led rewrite; unindexed, previously exposed, duplicate-status, quota-blocked and already protected pages stayed unchanged.

## Search Console

### Latest 24 hours versus previous 24 hours

| Scope | Clicks | Impressions | CTR | Position |
| --- | ---: | ---: | ---: | ---: |
| Property | 2 vs 0 | 225 vs 182 | 0.9% vs 0% | 14.3 vs 17.1 |
| Network | 0 vs 0 | 7 vs 7 | 0% vs 0% | 16.9 vs 12.4 |
| Smarthome | 0 vs 0 | 3 vs 4 | 0% vs 0% | 7.7 vs 47.8 |
| Homeoffice | 2 vs 0 | 135 vs 97 | 1.5% vs 0% | 16.2 vs 19.5 |
| Baby | 0 vs 0 | 84 vs 75 | 0% vs 0% | 11.2 vs 12.4 |
| Pets | 0 vs 0 | 5 vs 4 | 0% vs 0% | 4.6 vs 5.5 |
| Style | 0 vs 0 | 0 vs 1 | — | — |
| Costumes | 0 vs 0 | 0 vs 1 | — | — |

The two clicks came from the Homeoffice Logitech Litra Glow versus Elgato Key Light Neo page. The root-property impressions rose 23.6%, and average position improved by 2.8 positions. This rolling window is directional and does not support a same-day cliff claim.

### Latest seven days versus previous seven days

| Scope | Clicks | Impressions | CTR | Position |
| --- | ---: | ---: | ---: | ---: |
| Property | 4 vs 8 | 1,539 vs 1,689 | 0.3% vs 0.5% | 28.3 vs 35.7 |
| Network | 0 vs 2 | 49 vs 68 | 0% vs 2.9% | 26.5 vs 37.3 |
| Smarthome | 0 vs 0 | 26 vs 16 | 0% vs 0% | 35.6 vs 61.5 |
| Homeoffice | 2 vs 4 | 963 vs 1,070 | 0.2% vs 0.4% | 32.3 vs 42.0 |
| Baby | 2 vs 2 | 535 vs 557 | 0.4% vs 0.4% | 17.3 vs 20.0 |
| Pets | 0 vs 0 | 16 vs 3 | 0% vs 0% | 11.8 vs 3.3 |
| Style | 0 vs 0 | 1 vs 0 | 0% vs — | 4.0 vs — |
| Costumes | 0 vs 0 | 3 vs 2 | 0% vs 0% | 56.0 vs 41.0 |

Seven-day property impressions fell 8.9% and clicks fell four, but average position improved 7.4 positions. Homeoffice still supplies most exposure and its low CTR is the nearest acquisition bottleneck. Network remains weak, while the Smarthome and Pets percentage movements are based on very small samples.

## ErGear/FlexiSpot Day-7 gate

Exact URL: `https://homeoffice.madabase.com/best/ergear-48x24-vs-flexispot-e7-mini`

- Current seven days: 0 clicks, 77 impressions, 0% CTR, position 8.5.
- Previous seven days: 0 clicks, 38 impressions, 0% CTR, position 8.2.
- `flexispot e7 mini`: 35 versus 13 impressions.
- `ergear vs flexispot`: 5 versus 6 impressions.
- `flexispot vs ergear`: 4 versus 1 impression.
- Public page remains HTTP 200, self-canonical, indexable, and has `dateModified` 2026-08-31.

Decision: protect and hold through the meaningful Day-14 gate on September 14. Exposure more than doubled while page-one position held. Zero clicks remains a CTR concern, but the current comparison window overlaps pre-release and post-release data and is not enough to reset the title again.

## Soft151 Day-14 gate

Exact current seven-day cohort:

- 151 of 151 URLs accounted for.
- 21 exposed, 130 zero-impression.
- 0 clicks and 43 impressions.
- Previous seven days: 24 exposed, 127 zero-impression, 0 clicks and 65 impressions.
- Current site exposure: Network 0 URLs / 0 impressions; Smarthome 1 / 1; Homeoffice 12 / 24; Baby 8 / 18; Pets 0 / 0.

Authenticated live URL Inspection was required for all 130 zero-impression URLs. Search Console accepted 99 successful inspections and returned the property quota alert on attempt 100:

| Site | Indexed | Discovered, not indexed | Unknown to Google | Duplicate without user-selected canonical | Quota-blocked |
| --- | ---: | ---: | ---: | ---: | ---: |
| Network | 0 | 23 | 2 | 0 | 0 |
| Smarthome | 21 | 2 | 0 | 1 | 0 |
| Homeoffice | 19 | 0 | 0 | 2 | 0 |
| Baby | 18 | 3 | 0 | 2 | 0 |
| Pets | 0 | 6 | 0 | 0 | 31 |
| **Total** | **58** | **34** | **2** | **5** | **31** |

The exact 151-row metric, inspection, and action ledger is `apps/affiliate/reports/soft151-search-gate-2026-09-07.csv`; its machine-readable summary is `apps/affiliate/reports/soft151-search-gate-2026-09-07.json`.

The five duplicate-status URLs all currently emit the correct self-canonical in public HTML. Preserve them and recheck Google-selected canonical detail after quota renewal rather than changing working canonical markup from a stale crawl state.

## Two Smarthome rechecks

- `aqara-t1-vs-yolink-bulldog-vs-moen-flo` remains `Discovered - currently not indexed`; sitemap detected; no referring page detected in the stored GSC detail.
- `best-smart-water-shutoff-valves-retrofit-inline` remains `Discovered - currently not indexed`; sitemap detected; GSC now reports the Dutch fit-checklist and automation category as referring pages.
- Current public HTML proves the fit checklist and both roundup pages expose crawlable reciprocal links. This is not a current orphan-link defect, so no duplicate internal-link patch or Request indexing action was made.

## Conversion and production

Amazon Associates, updated through September 5 for the latest 30 days:

- 31 clicks, 25 ordered items, 80.65% conversion, and $383.37 ordered revenue.
- 24 shipped items, one returned item, and $306.39 shipped revenue.
- $10.02 product commissions plus $3.00 bounties, approximately $13.02 total.
- September 4 recorded two ordered and shipped items; September 5 recorded two ordered items and one shipped item.

Clarity, latest three days:

- 13 human sessions and 23 excluded bot sessions.
- 1.46 pages per session, 38.95% average scroll, and 32 seconds average active time.
- One outbound-click session and one `affiliate_click` session.
- Four Google-referred sessions and one Bing-referred session.
- Zero JavaScript errors; one dead-click session and one quick-back session.

Production and local validation:

- Release `9f61bb2` is active at `/srv/madabase-affiliate/releases/9f61bb2` under `madabase-affiliate.service` on loopback port 3011. All seven origin homepages returned HTTP 200, the process reported zero restarts and no error-log entries, and candidate port 3111 was closed after validation.
- Public validation passed all 40 upgraded pages and all 40 matching sitemap entries. Every page returned HTTP 200 with the intended title/H1, self-canonical, indexable state and September 7 modification date.
- SEO audit passed: 964 published guides, 175 products, 77 roundups, seven tools, 4,692 country routes, and 32 index-qualified country URLs.
- Affiliate-link audit passed 306 of 306 with eight known drifted or unavailable offers still suppressed.
- Search-recovery, comparison-first 36, Deep43, and next-product freeze checks passed.
- Node 20 ESLint passed. The first lint attempt used the shell's older Node runtime and failed because `structuredClone` was unavailable; rerunning under the required Node 20 environment passed without a source change.

## Owner-authorized indexed-zero recovery release

The initial hold recommendation was superseded after the owner explicitly directed immediate action and the inspection ledger supplied a safe, exact selection rule. The release includes exactly 40 existing canonical guides that met all three conditions: indexed in live URL Inspection, zero impressions in the current seven-day window, and zero impressions in the preceding seven-day window.

| Site | Existing pages upgraded |
| --- | ---: |
| Smarthome | 21 |
| Homeoffice | 6 |
| Baby | 13 |
| **Total** | **40** |

Each page keeps its route, site, product data, merchant path and full supporting content, but now has a unique decision-led title/H1, explicit primary-versus-alternative answer, four-row comparison table, first decision section and contextual related-guide links. Live SERP intent was reviewed per topic before inclusion. The release adds zero routes and has zero overlap with the September 4 comparison-first 36 or Deep43.

Source and deployment:

- Cohort ledger: `apps/affiliate/config/indexed-zero-recovery-cohort-2026-09-07.json`.
- Source/artifact commit: `9f61bb2917fa4722bdb6aed943550a0a41b0c92e` on `origin/lyd-0609`.
- Runtime archive: 60,839,849 bytes; SHA-256 `4ff347efd255477319a6f32d933e87b01b137df47cf2873a9f7068d35d0a87dd`.
- Active immutable release: `/srv/madabase-affiliate/releases/9f61bb2`; immediate rollback: `/srv/madabase-affiliate/releases/86e08e6`; unit backup: `madabase-affiliate.service.before-9f61bb2`.
- Candidate and origin checks passed all seven site hosts plus representative Smarthome, Homeoffice and Baby targets. Full public audit passed 40 of 40 pages and 40 of 40 sitemap entries.
- IndexNow accepted exactly 40 canonicals with HTTP 200: Smarthome 21, Homeoffice 6 and Baby 13. No unchanged URL, homepage, category, sitemap or prior cohort was included.

Review this cohort on September 14, September 21 and October 7. Preserve any page that gains impressions, clicks, query breadth or a top-20 position. Revisit only exact pages that remain unexposed or show a clear intent mismatch; do not reset the whole batch from a rolling 24-hour fluctuation.

## Decision and next actions

1. Hold the exact September 7 indexed-zero 40 unchanged through its September 14 Day-7 gate. Track exact-URL impressions, clicks, query breadth and position; preserve any positive signal.
2. Do not rewrite the September 4 comparison-first 36 before its September 11 Day-7 gate.
3. Do not rewrite ErGear/FlexiSpot before the September 14 Day-14 gate; its exposure direction is positive.
4. On September 8, first complete the 31 quota-blocked Pets URL inspections and recheck Google-selected canonical detail for the five duplicate-status URLs.
5. Run the Expansion757 Day-30 gate on September 8. Use that evidence to decide whether the unindexed Network/Pets segment should be consolidated, strengthened, or removed from active discovery; do not solve an indexing problem with a blind CTR rewrite.
6. Run Deep43 tactical review on September 10 and comparison-first Day 7 on September 11.
7. Keep new indexable publication and the five product pilots frozen. Do not replay sitemaps or IndexNow for unchanged URLs or for the accepted September 7 cohort.
