# Amazon Associates migration — November 23, 2026

Replace the previous account’s public tracking IDs with the five IDs verified in Associates Central under `madabase-20`. `apps/affiliate/config/amazon-associates.json` is the shared account mapping for runtime URLs and link checks; stale environment overrides cannot restore the previous IDs. Raw guide alternatives resolve through the normalized commerce catalog. API snapshots are accepted only for an exact current-account US tracking ID; former-account and unconfigured foreign snapshots fall back to the existing verified offer. No API credentials or private account data are included.

The owner explicitly authorized publishing after validation. Build only on the local machine using Node 20; the server receives the SHA256-pinned standalone archive. This release switches only Affiliate, preserves the Main process and previous static assets, checks capacity before and after stopping Affiliate, and arms an independent recovery timer. No server build, dependency install, database change or retired-service restart.

From the clean server source checkout at the pinned commit, run `python3 scripts/releases/amazon-account-20261123/deploy.py prepare --revision SHA`, then `activate`. Manual rollback: the same controller with `rollback`. The previous immutable release remains available.

After origin verification, use Cloudflare Custom Purge for the 47 specific content prefixes in `purge-prefixes.txt` and the five exact homepage URLs in `purge-urls.txt`. Do not purge Main, all host assets, or the whole zone. Then run `verify-attribution.py --output=/var/tmp/madabase-amazon-account-20261123/public-attribution.json` on the server to inspect the 5,320 public URLs through Cloudflare. The verifier reads links without following merchant URLs or creating click events.

`local-attribution.json` records 5,320 rendered pages and 5,686 Amazon links with zero tag, ASIN or release-identity failures. Inventory checks cover 455 unique site/ASIN pairs and 458 published offers. Build and related compatibility checks passed; lint has zero errors and ten existing warnings. Eighteen mocked deployment failure and rollback tests passed. The wider conversion-layout checker has unrelated policy findings and is not reported as a complete pass.

New application submission and website migration do not establish final Associates approval, new API eligibility, or payment of commissions from the previous account.

SEO follow-up: two Network descriptions are shortened independently of the visible answers. Only their sitemap dates advance to November 23; the three previously unindexed guide bodies and canonicals are retained. Request bounded Google live tests and recrawling after the public release.

The normal activation never operates Main. If the existing 768 MiB forecast cannot be met, `activate --allow-main-restart` is a separately approved maintenance option: stop Affiliate, briefly stop and restart the original Main runtime, then start Affiliate after the unchanged 704 MiB measured gate. Main source, archive, unit and working directory are not changed. The option must not be used without owner approval for this release. Recovery restores Main before Affiliate. Both paths retain the 768 MiB forecast, 512+192 MiB measured minimum, pressure checks and independent recovery timer.
