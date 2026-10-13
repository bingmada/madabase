# Affiliate Search Portfolio

Generated: 2026-10-13
GSC data through: 2026-10-10
GSC Pages source: gsc-current-28d-pages.csv

This report joins the complete published affiliate content inventory to a Google Search Console Pages export. A missing GSC row means no recorded impression in the export window, not automatic proof of an indexing failure.

## Qualified content-host GSC context

Tools, Test, and legacy root-locale rows are permanently excluded from growth totals. New editorial root URLs are listed separately and require a post-2026-07-21 date filter for growth claims. Counts below are represented page rows from the supplied Pages CSV, not the Search Console headline-card total.

| Host | Exposed URLs | Clicks | Impressions | Weighted position |
| --- | ---: | ---: | ---: | ---: |
| homeoffice.madabase.com | 158 | 14 | 1838 | 14.0 |
| baby.madabase.com | 145 | 8 | 1367 | 10.4 |
| smarthome.madabase.com | 25 | 0 | 107 | 17.0 |
| network.madabase.com | 28 | 1 | 76 | 15.1 |
| pets.madabase.com | 19 | 0 | 59 | 7.0 |
| style.madabase.com | 2 | 0 | 2 | 8.0 |
| costumes.madabase.com | 1 | 0 | 1 | 3.0 |

## Tools migration transfer context

Legacy locale Tools paths and the Tools host are one migration cohort. Legacy Test and other locale paths are reported separately below. A host-level increase can therefore be a transfer from the old host rather than new demand. This cohort remains visible only for migration and retirement monitoring and never counts toward search-growth targets.

| Segment | Exposed URLs | Clicks | Impressions | Weighted position |
| --- | ---: | ---: | ---: | ---: |
| legacy madabase.com /en/tools/** + /zh/tools/** | 1 | 0 | 1 | 8.0 |
| tools.madabase.com | 1 | 0 | 1 | 1.0 |
| migration subtotal | 2 | 0 | 2 | 4.5 |

Migration share of represented page-row impressions: 0.1%. This is not a share of a finite ranking quota and should not be read as impressions taken from affiliate pages.

## New Main cohort

Main is structurally separated from locale paths. If the supplied export window begins before the 2026-07-21 launch, non-locale URL rows can still contain historical root-domain activity; use a post-launch date-filtered export before making a Main growth claim.

| Segment | Exposed URLs | Clicks | Impressions | Weighted position |
| --- | ---: | ---: | ---: | ---: |
| new Main (non-locale madabase.com) | 8 | 0 | 25 | 7.1 |

## Other excluded transition context

Legacy Test, other locale, Test-host, and www rows remain visible only for cleanup monitoring.

| Segment | Exposed URLs | Clicks | Impressions | Weighted position |
| --- | ---: | ---: | ---: | ---: |
| legacy madabase.com /en/tests/** + /zh/tests/** | 1 | 0 | 3 | 8.3 |

## Portfolio baseline

- Published content-registry pages: 1125
- Soft-launch registry pages intentionally excluded from sitemap/discovery: 5
- Standalone editorial routes outside the registry but present in sitemap: 1
- Expected base editorial URLs in the seven sitemaps: 1121
- Pages with impressions in the GSC export: 312
- Pages without an impression row: 813
- Affiliate clicks represented: 20
- Affiliate impressions represented: 3236
- Affiliate GSC URLs not matched to a content registry entry: 66
- Page-two search-answer and contextual-link modules implemented: 100
- Recovery rows classified for no-impression inventory: 813

## Non-ledger GSC rows

These rows belong to qualified affiliate hosts but are not base-canonical editorial pages. They remain visible as a separate structural and localized cohort instead of being silently discarded or misclassified as missing content.

| Scope | GSC rows |
| --- | ---: |
| category-archive | 6 |
| consolidated-redirect-source | 25 |
| localized-edition | 8 |
| policy-or-about | 20 |
| site-home | 7 |

## Site inventory

| Site | Registry pages | Sitemap base editorial | With impressions | Without impressions |
| --- | ---: | ---: | ---: | ---: |
| pet | 185 | 184 | 11 | 174 |
| homeoffice | 226 | 225 | 142 | 84 |
| baby | 225 | 224 | 118 | 107 |
| network | 165 | 164 | 22 | 143 |
| smarthome | 238 | 237 | 18 | 220 |
| style | 63 | 63 | 1 | 62 |
| costume | 23 | 24 | 0 | 23 |

## Performance cohorts

| Cohort | Pages | Default action |
| --- | ---: | --- |
| protect-and-convert | 11 | Preserve the query target; improve the first-screen decision, CTA, and supporting internal links. |
| page-one-zero-click | 19 | Rewrite title and description around the exact buying objection; keep the body intent stable and test CTR. |
| page-two-push | 32 | Add the missing query answer, comparison evidence, and 3-5 contextual internal links from stronger pages. |
| low-sample-observe | 208 | Preserve the query target until the sample reaches 20-30 impressions; verify indexing, intent, and internal discovery without rewriting the page. |
| mid-pack-rebuild | 19 | Realign title, H1, intro, and section coverage to one primary query; add one supporting page only if intent is distinct. |
| low-rank-retarget | 11 | Revalidate the SERP and primary keyword; rewrite the page around the dominant intent or consolidate cannibalizing pages. |
| deep-rank-rebuild-or-merge | 12 | Treat the current keyword as unproven: rebuild for a narrower intent, merge into a stronger canonical, or retire from the sitemap. |
| new-observation | 15 | Confirm indexing, canonical, sitemap discovery, and internal links; hold the keyword stable through the day-7 gate. |
| zero-impression | 798 | Inspect index status, canonical, age, duplication, and keyword demand; then retarget, merge, or keep only when the page has a distinct job. |

## No-impression recovery queue

Every published page without a GSC impression row is assigned a decision gate. Observation rows are intentionally held stable; repair and review rows remain active work.

| Decision | Pages | Next action |
| --- | ---: | --- |
| observe-day-7 | 14 | Hold the query stable; check indexing and first query signals at day 7. |
| observe-day-30 | 1 | Hold through the 30-day gate unless a technical defect appears. |
| maintenance-hold | 62 | Keep out of the growth queue; review with the maintenance portfolio at day 30. |
| duplicate-intent-review | 131 | Compare intent and merge into the stronger canonical when the jobs overlap. |
| repair-content-integrity | 28 | Add an explicit evidence mode, exact-product sources, and version checks before promotion. |
| repair-local-discovery | 9 | Repair the local content or internal-link gap, then recheck discovery. |
| demand-and-index-review | 568 | Inspect live index state and keyword demand before rewriting or retiring. |

## First remediation queue

This queue is ordered by the closest organic opportunity first, then by impressions. The CSV contains every page.

| Site | Page | Clicks | Impressions | Position | Cohort | Local gaps |
| --- | --- | ---: | ---: | ---: | --- | --- |
| homeoffice | [Branch Ergonomic Chair Guide: Warranty, Fit & Returns](https://homeoffice.madabase.com/reviews/branch-ergonomic-chair) | 0 | 227 | 7.8 | page-one-zero-click | none |
| homeoffice | [Anker 675 Guide: One-Monitor Dock and Stand, Not Dual Display](https://homeoffice.madabase.com/reviews/anker-675-usb-c-docking-station) | 0 | 207 | 7.6 | page-one-zero-click | none |
| baby | [Ergobaby Omni Breeze Forward Facing: Age & Fit Checks](https://baby.madabase.com/guides/ergobaby-omni-breeze-forward-facing-age-guide) | 0 | 148 | 7.3 | page-one-zero-click | none |
| homeoffice | [DP Alt Mode Driver vs DisplayLink: Portable Monitor Guide](https://homeoffice.madabase.com/guides/portable-monitor-usb-c-dp-alt-mode-displaylink-guide) | 0 | 81 | 8.3 | page-one-zero-click | none |
| homeoffice | [HON Ignition 2.0 Guide: Warranty, Fit & Controls](https://homeoffice.madabase.com/reviews/hon-ignition-2-0-chair) | 0 | 81 | 8.8 | page-one-zero-click | none |
| homeoffice | [CalDigit TS4 Guide: Mac Dual-Monitor Compatibility & 98W](https://homeoffice.madabase.com/reviews/caldigit-ts4-thunderbolt-dock) | 0 | 80 | 9.7 | page-one-zero-click | none |
| baby | [BabyBjörn Harmony vs. Ergobaby Omni Breeze](https://baby.madabase.com/best/babybjorn-harmony-vs-ergobaby-omni-breeze) | 0 | 60 | 8.0 | page-one-zero-click | none |
| baby | [Philips Avent SCF358 Bottle Warmer Guide](https://baby.madabase.com/reviews/philips-avent-premium-fast-bottle-warmer-scf358) | 0 | 50 | 8.0 | page-one-zero-click | none |
| baby | [Dr. Brown's vs Baby Brezza Sterilizer Dryer: Capacity & Fit](https://baby.madabase.com/best/dr-browns-vs-baby-brezza-sterilizer-dryer) | 0 | 49 | 8.2 | page-one-zero-click | none |
| baby | [Momcozy PureHug Guide: 3-Month Fit & Carry Limits](https://baby.madabase.com/reviews/momcozy-purehug-baby-carrier) | 0 | 42 | 9.6 | page-one-zero-click | none |
| homeoffice | [Wireless Presentation Clicker Guide: USB, Bluetooth, Range, and Controls](https://homeoffice.madabase.com/guides/wireless-presentation-clickers-buying-guide) | 0 | 33 | 8.6 | page-one-zero-click | none |
| baby | [Infant Bath Tubs: Safety Limits and When to Skip](https://baby.madabase.com/guides/infant-bath-tubs-safety-and-skip-guide) | 0 | 28 | 8.1 | page-one-zero-click | none |
| homeoffice | [Key Light Placement for Glasses: Reduce Video-Call Glare](https://homeoffice.madabase.com/guides/key-light-for-glasses-glare-placement) | 0 | 26 | 7.7 | page-one-zero-click | none |
| homeoffice | [ASUS ZenScreen MB16ACV Guide: USB-C & DisplayLink](https://homeoffice.madabase.com/reviews/asus-zenscreen-mb16acv-portable-monitor) | 0 | 25 | 7.3 | page-one-zero-click | none |
| homeoffice | [Plugable TBT4-UD5 Guide: Native Dual 4K Mac Compatibility](https://homeoffice.madabase.com/reviews/plugable-tbt4-ud5-thunderbolt-dock) | 0 | 25 | 9.0 | page-one-zero-click | none |
| baby | [Baby Wipe Warmer Buying Guide: Heat, Moisture, and Cleaning](https://baby.madabase.com/guides/baby-wipe-warmers-buying-guide) | 0 | 20 | 8.3 | page-one-zero-click | none |
| baby | [Nursery Glider Chairs: Safety Limits and When to Skip](https://baby.madabase.com/guides/nursery-glider-chairs-safety-and-skip-guide) | 0 | 20 | 9.3 | page-one-zero-click | none |
| homeoffice | [Elgato Key Light Neo Guide: Monitor-Mounted Video Call Light](https://homeoffice.madabase.com/reviews/elgato-key-light-neo) | 0 | 20 | 9.6 | page-one-zero-click | implicit-evidence-mode |
| homeoffice | [Logitech Litra Glow Guide: Mount, Controls & Call-Lighting Fit](https://homeoffice.madabase.com/reviews/logitech-litra-glow) | 0 | 20 | 7.5 | page-one-zero-click | none |
| baby | [Ergobaby Omni Breeze Guide: Newborn Fit, Weight Limit & Positions](https://baby.madabase.com/reviews/ergobaby-omni-breeze-carrier) | 0 | 69 | 13.4 | page-two-push | implicit-evidence-mode |
| baby | [Baby Brezza Sterilizer Dryer Guide: Bottle Size & Capacity](https://baby.madabase.com/reviews/baby-brezza-sterilizer-dryer-advanced) | 0 | 55 | 13.2 | page-two-push | none |
| baby | [Bottle Washer vs. Sterilizer vs. Dryer](https://baby.madabase.com/guides/bottle-washer-vs-sterilizer-vs-dryer-guide) | 0 | 53 | 14.6 | page-two-push | none |
| baby | [GROWNSY Bottle Sterilizer Dryer Guide: Worth It for Small Kitchens?](https://baby.madabase.com/reviews/grownsy-bottle-sterilizer-dryer) | 0 | 47 | 10.3 | page-two-push | none |
| baby | [BabyBjörn Carrier Mini Guide: Newborn Fit vs. Harmony](https://baby.madabase.com/reviews/babybjorn-carrier-mini-3d-mesh) | 0 | 31 | 12.2 | page-two-push | implicit-evidence-mode |
| baby | [Tula Lite Carrier Guide: 12–30 lb Fit, Travel Pouch & Carry Limits](https://baby.madabase.com/reviews/baby-tula-lite-carrier) | 0 | 25 | 13.8 | page-two-push | implicit-evidence-mode |
| homeoffice | [UPLIFT V3 Standing Desk: Size, Height & Fit Guide](https://homeoffice.madabase.com/reviews/uplift-v3-standing-desk) | 0 | 23 | 10.0 | page-two-push | implicit-evidence-mode |
| baby | [How to Clean an Ergobaby Omni Breeze](https://baby.madabase.com/guides/ergobaby-omni-breeze-cleaning-guide) | 0 | 19 | 7.6 | page-two-push | none |
| smarthome | [Aqara FP300 Guide: Price, Battery, Thread & FP2](https://smarthome.madabase.com/reviews/aqara-presence-multi-sensor-fp300) | 0 | 17 | 13.6 | page-two-push | none |
| baby | [Baby Brezza Smart Bottle Warmer Guide & SCF358 Comparison](https://baby.madabase.com/reviews/baby-brezza-smart-bottle-warmer) | 0 | 16 | 7.4 | page-two-push | none |
| homeoffice | [Ergotron HX Guide: Heavy Monitor Arm for Walking Desks](https://homeoffice.madabase.com/reviews/ergotron-hx-monitor-arm) | 0 | 16 | 8.5 | page-two-push | implicit-evidence-mode |
| smarthome | [Nest Learning Thermostat 4th Gen Guide: Matter, Wiring & Sensor](https://smarthome.madabase.com/reviews/google-nest-learning-thermostat-4th-gen) | 0 | 16 | 11.3 | page-two-push | implicit-evidence-mode |
| baby | [Childproof Cabinet Lock Buying Guide: Hazard Storage, Door Fit, and Daily Re-Locking](https://baby.madabase.com/guides/childproof-cabinet-locks-buying-guide) | 0 | 15 | 7.5 | page-two-push | long-title |
| homeoffice | [How to Reduce Monitor Wobble on a Walking Desk](https://homeoffice.madabase.com/guides/reduce-monitor-wobble-walking-desk) | 0 | 15 | 9.3 | page-two-push | none |
| baby | [Momcozy KleanPal Pro Guide: Cycles, Capacity & Counter Fit](https://baby.madabase.com/reviews/momcozy-kleanpal-pro-baby-bottle-washer) | 0 | 14 | 9.1 | page-two-push | implicit-evidence-mode |
| homeoffice | [FlexiSpot E7 Mini Guide: Dimensions, Height & Small-Desk Fit](https://homeoffice.madabase.com/reviews/flexispot-e7-mini-standing-desk) | 0 | 14 | 10.3 | page-two-push | implicit-evidence-mode |
| baby | [BabyBjörn Mini vs. Harmony](https://baby.madabase.com/best/babybjorn-mini-vs-harmony) | 0 | 13 | 6.8 | page-two-push | weak-title |
| homeoffice | [Overhead book scanners: Fit, Trade-offs & Buying Guide](https://homeoffice.madabase.com/guides/overhead-book-scanners-buying-guide) | 0 | 13 | 8.8 | page-two-push | none |
| homeoffice | [Thunderbolt Dock vs KVM Switch: Which Do You Need?](https://homeoffice.madabase.com/guides/thunderbolt-kvm-docks-vs-alternatives) | 0 | 13 | 8.8 | page-two-push | none |
| homeoffice | [Lume Cube Edge 2.0 Guide: Desk Lamp and Webcam Light for Calls](https://homeoffice.madabase.com/reviews/lume-cube-edge-2-desk-light) | 0 | 13 | 11.0 | page-two-push | implicit-evidence-mode |
| baby | [BabyBjörn Harmony Newborn Fit Checklist](https://baby.madabase.com/guides/babybjorn-harmony-newborn-fit-checklist) | 0 | 12 | 7.2 | page-two-push | none |

## All-domain query context (not an affiliate priority queue)

No query CSV was supplied.

## Operating rules

1. Do not change every title on every run. Preserve a page's primary target through its 7-day observation window unless the target is clearly wrong.
2. Page-one zero-click pages receive snippet and decision-answer work. Positions 11-20 receive missing coverage and internal-link work.
3. Positions 21-60 require intent realignment before more support URLs are added. Positions over 60 require SERP revalidation and a rebuild-or-merge decision.
4. A no-impression page is checked for indexing, canonical, age, duplication, keyword demand, and internal links. It is then kept, retargeted, merged, or retired; it is not left indefinitely by default.
5. Re-import a 28-day Pages CSV weekly and use 24-hour data only for recent-change monitoring. The long window drives portfolio decisions; the short window catches release effects.

Full queue: page-ledger.csv
Recovery queue: zero-impression-ledger.csv
Non-ledger GSC rows: unmatched-gsc-urls.csv
