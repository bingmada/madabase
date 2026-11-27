# D8 US content pilot — November 27, 2026

The owner authorized a fresh search/content review and publication after validation. Publish one exact D8 ASIN B0H6Q2G76Z, its KleanPal Pro comparison and contextual links from the existing washer guide as one Affiliate release. Preserve the existing tank-based Baby Brezza offer B0DDLGJG5J. Remove the unsupported KleanPal rating/scores; no performance ranking is invented.

US retailer identity, White selection, 120 V / 60 Hz and an In Stock US ZIP 10001 buy box were rechecked November 27. Sold by Smartlin, fulfilled by Amazon; selected condition remains unestablished. Do not publish a live price, review rating, bundle guarantee or availability guarantee. Manufacturer timing conflicts and the European support PDF remain explicit; no regional manual substitution. Regional descriptors remain compatibility-only and the two new pages have no regional sitemap entries.

## Review and scope

`assessment.json` contains comparable active-host Google/Bing rows and their exact periods. Google page-filtered Web impressions are 94 versus 91 (Nov 18–24 versus Nov 11–17), both with zero clicks. Bing active-host Web page rows are 344 versus 271 impressions and 4 versus 11 clicks (Nov 19–25 versus Nov 12–18). Do not compare Bing All/Web-and-Chat overview totals with these rows. Sample sizes are small and both windows include days before the November 23 release.

The same 1,145 submitted Google URLs now show 601 indexed, versus 598 in the November 16 report. The existing washer guide is indexed, but its recorded crawl is November 4, not a verified new post-November-23 crawl. The D8 pages were not previously deployed; these numbers do not measure their effect.

Build from a clean archive of the scoped source commit with Node 20. Exclude the pre-existing CJ click/reporting, package script and shared-state edits. Do not build or install dependencies on the production host. `artifact.json` pins the locally built standalone SHA256 and build ID; runtime secrets are injected by systemd and are not in the archive.

## Activation and recovery

The controller is the previously tested Affiliate-only release controller with independent paths/state/timer for this pilot. Run `prepare --revision SHA` from the clean pinned server source checkout, then the default `activate`. The default never stops or rewrites Main. Preserve the 768 MiB forecast, 704 MiB actual capacity check, memory-pressure checks, immutable previous release, retained static assets, current-pointer drift checks and independent recovery timer. The separate `--allow-main-restart` option requires explicit approval for this release if the unchanged capacity forecast rejects normal activation; do not infer that approval from an older release.

79 critical origin checks and all five active host homepages/sitemaps must pass. Verify the new product/comparison, updated guide, existing KleanPal and feeding category, attribution, canonicals, schema and public cache bodies. Retired services stay stopped. No database mutation, retired-domain revival, firewall/cache-rule change or whole-zone purge.

Purge only the exact changed Baby HTML paths and sitemap listed in `purge-prefixes.txt`, plus the exact Baby homepage in `purge-urls.txt`. New URLs need no purge. If a homepage needs a root-prefix purge, obtain the scope exception instead of widening the purge silently. Verify plain canonical URLs and a repeat cache response.

After publication, request indexing for the two new URLs and changed guide, retaining successful receipts separately from actual indexing. Finish with the actual production commit/build, checks and any limitation; do not label local acceptance as publication.
