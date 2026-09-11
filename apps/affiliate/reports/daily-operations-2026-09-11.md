# Affiliate daily operations — 2026-09-11

## Executive decision

- The rolling 24-hour view is **0 vs 1 clicks, 167 vs 165 impressions, 0% vs 0.6% CTR, and position 23.3 vs 19.5**. The two-impression difference is not a new visibility cliff; the immediate problem is still weak click-through and uneven page coverage.
- The latest complete seven days are **6 vs 6 clicks, 1,512 vs 1,661 impressions (-9.0%), 0.4% vs 0.4% CTR, and position 17.5 vs 35.6**. Google is showing fewer portfolio results, but the results that remain visible rank much better.
- The September 4 comparison-first 36 Day-7 gate is mixed but directionally useful: 10 vs 17 impressions, six vs eight exposed URLs, 30 current-zero URLs, and a current exposed weighted position of 6.4. All 30 zero-exposure pages remain indexed. Preserve this cohort through its September 18 Day-14 gate instead of resetting it from a thin first-week sample.
- The two Network families deferred on September 8 have now crossed their documented consolidation threshold. Eight indexed measured routes with effectively no current exposure were reduced to **two retained comparison hubs plus six permanent redirects**, with zero new routes.
- Four unprotected page-one zero-click pages with 264 complete-window impressions received query-backed title and first-answer repairs. The ErGear experiment was explicitly excluded and remains protected through September 14.

## Search Console diagnosis

| Scope | Current | Previous | Decision |
| --- | --- | --- | --- |
| Rolling 24 hours | 0 clicks / 167 impressions / position 23.3 | 1 / 165 / 19.5 | No new cliff; use only as directional monitoring |
| Latest complete seven days | 6 / 1,512 / 17.5 | 6 / 1,661 / 35.6 | Coverage down 9%, ranking quality materially stronger |
| Network | 2 clicks / 52 impressions / position 14.5 | 0 / 63 / 36.1 | Protect current exposed winners; consolidate only the two threshold-crossing all-zero families |
| Homeoffice | 4 / 841 / 20.8 | 3 / 1,086 / 40.2 | Largest coverage loss and clearest page-one CTR opportunity |
| Baby | 0 / 632 / 13.1 | 3 / 520 / 20.9 | Exposure and position improved; repair only unprotected page-one zero-click intent |
| Pets | 0 / 40 / 7.2 | 0 / 2 / 27.5 | Small but positive; no rewrite |

The Deep43 tactical cohort produced 34 vs 48 impressions across 14 vs 16 exposed URLs, with weighted position improving to 29.4 from 56.2. That evidence does not justify another cohort-wide rewrite. It does, however, clear the September 10 protection conflict for the two exact Network families because every measured route in those families remains indexed and unexposed in the current comparison.

## Existing-page release

### Network topic hierarchy

The release applies the exact ledger in `deferred-family-consolidations-2026-09-11.json` and `seo-consolidation-ledger-2026-09-11.json`:

- `sfp-plus-network-switches`: retain `/guides/sfp-plus-network-switches-vs-alternatives`; permanently redirect its buying, fit, and workflow siblings.
- `poe-splitters`: retain `/guides/poe-splitters-vs-alternatives`; permanently redirect its buying, fit, and workflow siblings.
- Result: **8 measured URLs → 2 indexable canonical hubs + 6 HTTP 308 redirects**. The useful sibling material is merged into the retained hubs, redirect sources are absent from discovery and sitemaps, and no route was added.

### Page-one CTR cohort

The exact four-page cohort is recorded in `page-one-ctr-cohort-2026-09-11.json`:

- Homeoffice `/reviews/branch-ergonomic-chair`: 94 impressions, position 7.47; title now answers review, warranty, fit, and return intent without a hands-on claim.
- Homeoffice `/reviews/hon-ignition-2-0-chair`: 63 impressions, position 8.86; title and first answer now clarify warranty, configuration, and return-path intent.
- Baby `/guides/ergobaby-omni-breeze-forward-facing-age-guide`: 54 impressions, position 8.61; title and first answer now lead with age, head/neck control, size, chin clearance, and overstimulation boundaries.
- Baby `/reviews/grownsy-bottle-sterilizer-dryer`: 53 impressions, position 9.75; title and first answer now address exact-product review and small-kitchen fit while keeping the sterilizer-versus-washer boundary clear.

The ErGear-versus-FlexiSpot page was not changed. No click-bearing winner, comparison-first primary field, indexed-zero page, merchant identity, route, canonical, or new publication cohort was broadened into this release.

## Conversion and merchant health

- Clarity, last seven days: 49 human sessions, 44 users, 1.39 pages/session, 33.5% average scroll, 1.4 minutes active, and two `affiliate_click` sessions. Referrals included Google 7, Bing 5, Copilot 3, and ChatGPT 2; no JavaScript error signal was present.
- Amazon's latest available September 4–10 period was last updated September 9: 22 clicks, four orders, 18.18% conversion, $199.96 ordered revenue, and $7.80 earnings. Treat the lag as unavailable later-day reporting, not zero revenue.
- CJ is still authentication-blocked and therefore unavailable rather than zero.
- The repository affiliate-link audit passed **306 of 306** exact destinations while eight known drifted or unavailable offers remained suppressed.
- Amazon Creators inventory still contains 295 exact US ASINs across all six US tags. The public listing endpoint returns HTTP 200 with private/no-store/noindex and `listing:null`; no credential or dynamic-product migration was attempted.

## Validation and production

- Source contracts, JSON syntax, SEO, search-recovery control, affiliate links, Deep43, comparison-first 36, indexed-zero 40, the September 8 Day-30 consolidation, and ESLint passed.
- The immutable local runtime passed the exact 2-family / 8-route / 2-hub / 6-redirect contract, all four CTR pages and sitemap entries, all 19 governed categories, and 697 Network/Homeoffice/Baby base conversion routes with zero failures or missing CTAs.
- The Node 20 optimized build, type check, static generation, Linux x64 packaging, and final immutable-runtime recheck passed. The production archive is **60,850,739 bytes**, SHA-256 `8a288c332682a57c7bf5e8162a613e0cc9deaadbc7e2c9284ebbbe4cd3795f72`.
- Commit `3d04dcd5e5d88c8f2e4250beb8aeb73b19bdabd2` was pushed to `origin/lyd-0609`. The server pulled it through the existing `/srv/madabase-affiliate/sources/9b924b7` repository; the server archive hash matched local.
- Candidate port 3111 passed the exact consolidation and CTR audits plus the three affected category lastmods. Production now runs from `/srv/madabase-affiliate/releases/3d04dcd` under `madabase-affiliate.service` on port 3011 with zero restarts. The current pointer also resolves to `3d04dcd`, candidate port 3111 is closed, and `4d78d2e` plus its backed-up unit remain available for immediate rollback.
- Public audits passed the exact two retained hubs, six permanent redirects, four CTR pages, four sitemap entries, all 19 governed categories, 154 direct family hubs, and 418 surviving support links.
- IndexNow accepted exactly **10 changed canonicals** with HTTP 200: Network 3, Homeoffice 3, and Baby 4. The six redirect sources, protected pages, sitemaps, old cohorts, homepages, product pilots, and unrelated hosts were not submitted.

## Ordered next actions

1. September 14: run the indexed-zero 40 Day-7 gate and ErGear Day-14 gate. Preserve any page gaining impressions, clicks, query breadth, or a top-20 position.
2. September 15: run the September 8 27-family consolidation Day-7 gate. Do not reverse redirects from rolling-hour noise.
3. September 18: run comparison-first 36 Day-14 and this release's Day-7 gates. Protect the two retained Network hubs and four CTR pages if they gain exposure or clicks; inspect only exact zero-exposure or clearly mismatched URLs.
4. September 24: run the Deep43 portfolio gate. September 25 and October 11 are this release's Day-14 and Day-30 gates.
5. Keep new indexable publication frozen. Do not replay unchanged IndexNow URLs, bulk Request Indexing, or successful sitemaps.

## Daily close

- Status: `complete_released_public_verified_indexnow_exact_10`
- Main action: two-family Network consolidation plus four-page unprotected page-one CTR repair
- Search Console: checked; rolling 24 hours and complete seven-day comparison recorded
- Clarity: checked
- Amazon: checked; reporting lag recorded
- CJ: blocked-auth, not counted as zero
- Affiliate links: 306/306 passed
- Production and Cloudflare: origin/service/public content verified; no cache purge required
- Bing: not due for a separate mutation
- External distribution: read-only separate workflow; no duplicate publication
- Tomorrow's first step: monitor technical anomalies only; the next decision gate is September 14
