# Low-resource affiliate deployment

The repository-wide workflow is documented in `../../DEPLOYMENT.md`. This file records the affiliate-specific topology.

The six existing affiliate hosts plus the launched Costume publication are handled by one host-aware Next.js application. Do not build or run one copy per subdomain.

## Build away from production

Use Node 20 on a development machine or CI runner:

```bash
npm run build:release --workspace apps/affiliate
```

The command builds in the isolated `.next-release` directory and creates `apps/affiliate/.release/affiliate-runtime.tgz`. It contains the traced Next.js runtime, browser assets, public images, and the Linux x64 Sharp/libvips packages required by the production image routes. It intentionally excludes source files, development dependencies, and build caches. The isolated directory also prevents a running local development server from overwriting release output.

Upload and extract the archive into the affiliate application's fixed release directory. On the one-time migration, start the bundled PM2 definition:

```bash
pm2 start ecosystem.config.cjs
pm2 save
```

Future releases extract into a new immutable release directory, merge the previous release's hashed browser assets into the new release's configured dist directory, and then switch or restart the single PM2 process. For the current `.next-release` build, copy the contents of the previous `apps/affiliate/.next-release/static/` into the new directory without deleting the new files. Next.js filenames are content-hashed, so retaining both generations lets Cloudflare-cached HTML continue to load its older JS and CSS after cutover. Verify the JS and CSS referenced by new HTML plus at least one previous-generation JS and CSS URL before retiring the old process. Point all affiliate Nginx virtual hosts at the single port recorded in the bundled PM2 config. Keep the previous archive and extracted release for rollback.

## Resource guardrails

- Production must use Node 20.x. The packaged launcher refuses older Node versions.
- The current production target is Linux x64. Keep `NEXT_STANDALONE_SHARP_TARGET=linux-x64` on the affiliate release build so image routes do not inherit the build machine's native Sharp package.
- Never upload `.next/cache`, the repository `node_modules`, or the source tree as part of this release.
- Never run `next build` on the low-memory production server.
- Run one affiliate process for `network`, `smarthome`, `homeoffice`, `baby`, `pets`, `style`, and `costume`; host detection already separates their content, canonicals, disclosures, tracking configuration, and indexing rules.
- Keep Cloudflare's public affiliate HTML cache enabled. API and RSC requests remain uncached.
- Never delete the previous generation's hashed `static` files at cutover. A cached HTML document and its matching JS/CSS must age out together; production validation must probe both old and new asset hashes on all seven hosts.
- A 1-2GB swap file can prevent an emergency OOM kill, but it is a fallback, not a replacement for off-server builds and a single runtime process.

The normal `npm run build --workspace apps/affiliate` workflow remains available for current `next start` deployments. The standalone mode is enabled only by `build:release`.

## Costume catalog and commission jobs

Store the CJ SFTP password, PAT, host-key fingerprint, export path, query variables, and production `DATABASE_URL` in the deployment secret manager. Never copy `.env.local` to the server or put credentials in a command line, process manager file, archive, or Git.

For the first production import, or after a feed schema/PID change, run the catalog jobs in this order under a single-job lock:

```bash
npm run download:cj:products --workspace apps/affiliate
npm run sync:cj:products:dry-run --workspace apps/affiliate
npm run sync:cj:products --workspace apps/affiliate
npm run sync:cj:commissions --workspace apps/affiliate
```

Normal daily refreshes run the download, product sync, and commission sync without repeating the dry-run. Keep `CJ_SYNC_LIMIT=1000` in production initially. The product sync streams all 30,991 source rows, retains only a category-balanced 1,000-product working catalog, and writes the selected set in database batches. It does not hold the full export in memory. Images newly supplied by this exact Abracadabra CJ Feed inherit the same official CJ documentation permission reference; images from any other source do not. Increase the working catalog only after the existing catalog produces a real navigation, search, or conversion need.

Run Commission Detail reconciliation under the repository lock wrapper. It loads the affiliate environment, uses a rolling 45-day posting window, and exits before starting if another reconciliation still holds the lock:

```bash
npm run sync:cj:commissions:locked --workspace apps/affiliate
```

The public Costume launch indexes exactly 25 editor-reviewed product URLs. The home, category, Premium, guide, and policy pages are indexable; `/catalog`, filter combinations, and every product outside the reviewed cohort stay `noindex,follow` and out of the sitemap. Purchase availability is a separate gate: every in-stock catalog product may show a CTA after its official Feed link passes the dedicated PID/AID, exact embedded destination, authorized-image, and live merchant-destination checks. Run the production validator from the repository root with `node --env-file=apps/affiliate/.env apps/affiliate/scripts/activate-cj-catalog-links.mjs --network-direct --apply`. Exact-destination HTTP 429 responses are recorded as merchant rate limiting rather than product drift; redirects to the merchant homepage, 404 responses, mismatched variants, or tracking-identity failures remain inactive. Use `npm run publish:costume:cohort --workspace apps/affiliate` to preview an indexable cohort change and append `-- --apply` only after the preview passes exact-link, image, availability, and category checks.

The downloader requires an explicit SHA-256 host-key fingerprint, writes to a mode-600 `.part` file, verifies the remote and local byte counts, and only then replaces the configured export path. A wrong fingerprint must fail before any download.

As observed on 2026-07-22, `datatransfer.cj.com` offered only a legacy 1024-bit `ssh-dss` host key. Keep `CJ_SFTP_ALLOW_LEGACY_DSA=0` in persistent configuration. Until CJ provides a modern endpoint or authoritative key, any owner-approved compatibility run must set it to `1` for that single command only; never change system SSH defaults or disable host verification.

The first bounded dry-run must report 30,991 source and eligible rows, 1,000 accepted products, zero rejected rows, 1,000 expected-PID links, zero unexpected-PID links, and the configured category quotas. Authorize only image URLs supplied by the joined advertiser's CJ Product Feed, and store `https://developers.cj.com/docs/data-imports/product-feeds` as the permission reference; this does not authorize unrelated website scraping, logos, email assets, or arbitrary derivative creatives. Preview the scoped database change with `npm run authorize:cj:images --workspace apps/affiliate`, then apply it with an explicit trailing `-- --apply`. The Commission job treats a valid `count: 0` response as a successful no-op and upserts non-empty records by CJ commission ID.
