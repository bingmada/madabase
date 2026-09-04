# Affiliate daily operations — 2026-09-04

## Outcome

Published a bounded comparison-first refresh of exactly 36 existing canonical guides across five affiliate sites. No route was added, no redirect was restored, and no sitemap inventory was expanded. Release `86e08e6` is live and healthy; IndexNow accepted only the 36 changed URLs.

## Why this batch

The current recovery problem is weak discovery and deep ranking rather than a broad technical outage. Existing Search Console evidence shows comparison queries can attract impressions even when their current pages rank poorly. The batch therefore converts weak, previously untouched existing guides into explicit A-versus-B decisions without disturbing click-bearing winners or controlled cohorts.

Selection required all of the following:

- an existing canonical route;
- a concrete comparison decision supported by Search Console query evidence or validated live result coverage;
- no membership in Deep43, Ranking118, Soft151, the ErGear/FlexiSpot hold, or the protected winner set;
- enough product-independent decision criteria to create a truthful, useful page rather than a title-only rewrite.

## Scope

| Site | Existing pages refreshed |
| --- | ---: |
| Network | 8 |
| Smarthome | 8 |
| Homeoffice | 8 |
| Baby | 5 |
| Pets | 7 |
| **Total** | **36** |

The exact target URLs, titles, direct answers, decision sections, comparison rows, related links, evidence notes and review rules are recorded in `apps/affiliate/config/comparison-first-cohort-2026-09-04.json`.

## Changes made

Each target now has:

- one precise comparison title and matching search question;
- a unique direct answer near the top of the page;
- one page-specific decision section;
- an explicit comparison table with at least four practical criteria;
- relevant internal links to adjacent guides;
- September 4 `dateModified` and sitemap `lastmod` only for the changed page.

The refresh covers decisions such as wireless bridge versus Ethernet, MoCA versus powerline, 2.5GbE versus 10GbE, smart bulb versus smart switch, outdoor camera versus video doorbell, ultrawide versus dual monitors, bottle washer versus sterilizer-dryer, hip seat versus structured carrier, pet fountain versus bowl, and ramp versus stairs.

## Safety boundaries

- Zero new routes.
- Zero overlap with Deep43 or the protected ledger.
- Click-bearing comparison winners remained unchanged.
- The ErGear/FlexiSpot single-page experiment remained unchanged through its September 7 gate.
- The five isolated product pilots remained outside sitemap and discovery.
- No old IndexNow batch, sitemap, redirect source or unchanged page was replayed.

## Validation

- Comparison-first source audit: 36 targets, correct 8/8/8/5/7 allocation, four retained consolidated hubs, zero protected overlap.
- Immutable local runtime: 36 of 36 pages and 36 of 36 sitemap entries passed.
- Public runtime after cutover: 36 of 36 HTTP-200, self-canonical, indexable pages and 36 of 36 sitemap entries passed.
- Governed expansion: 757 URLs, 154 families, unique questions, answers and section bodies passed.
- Deep43 isolation: 43 of 43 remained valid.
- Search recovery, consolidation, SEO, ESLint and optimized Linux x64 release build passed.
- All seven production homepages returned HTTP 200; systemd is active with zero restarts and no error-log entries.

## Release record

- Commit/release: `86e08e6`
- Runtime path: `/srv/madabase-affiliate/releases/86e08e6`
- Rollback release: `7a30568`
- Artifact: `apps/affiliate/.release/affiliate-runtime.tgz`
- Size: `60,794,437` bytes
- SHA-256: `72a4b7c8dde2ab289030ee2fb660b670a5c79865829f6efadf505e9ca2894a48`
- IndexNow: HTTP 200 for Network 8, Smarthome 8, Homeoffice 8, Baby 5 and Pets 7.

## Measurement gates

- September 11, Day 7: directional check for exact-URL impressions, comparison-query impressions and new query variants. Do not rewrite the cohort before this gate unless a confirmed technical defect appears.
- September 18, Day 14: preserve pages gaining impressions, clicks or query breadth; inspect only pages with zero exposure or a clear intent mismatch.
- October 4, Day 30: decide portfolio-level keep, refine or retire actions from complete cohort evidence.

Rolling 24-hour data remains useful for anomaly detection, but it is not the success or failure gate for a newly published SEO batch. A same-day fall cannot measure this release because Google must first recrawl and re-evaluate the changed pages.
