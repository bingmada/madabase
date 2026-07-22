# Low-resource affiliate deployment

The repository-wide workflow is documented in `../../DEPLOYMENT.md`. This file records the affiliate-specific topology.

The six existing affiliate hosts plus the noindex Costume preview are handled by one host-aware Next.js application. Do not build or run one copy per subdomain.

## Build away from production

Use Node 20 on a development machine or CI runner:

```bash
npm run build:release --workspace apps/affiliate
```

The command builds in the isolated `.next-release` directory and creates `apps/affiliate/.release/affiliate-runtime.tgz`. It contains the traced Next.js runtime, browser assets, and public images. It intentionally excludes source files, development dependencies, and build caches. The isolated directory also prevents a running local development server from overwriting release output.

Upload and extract the archive into the affiliate application's fixed release directory. On the one-time migration, start the bundled PM2 definition:

```bash
pm2 start ecosystem.config.cjs
pm2 save
```

Future releases only replace the extracted files and run `pm2 restart madabase-affiliate`. Point all affiliate Nginx virtual hosts at the single port recorded in the bundled PM2 config. Keep the previous archive for rollback.

## Resource guardrails

- Production must use Node 20.x. The packaged launcher refuses older Node versions.
- Never upload `.next/cache`, the repository `node_modules`, or the source tree as part of this release.
- Never run `next build` on the low-memory production server.
- Run one affiliate process for `network`, `smarthome`, `homeoffice`, `baby`, `pets`, `style`, and `costume`; host detection already separates their content, canonicals, disclosures, tracking configuration, and preview-indexing rules.
- Keep Cloudflare's public affiliate HTML cache enabled. API and RSC requests remain uncached.
- A 1-2GB swap file can prevent an emergency OOM kill, but it is a fallback, not a replacement for off-server builds and a single runtime process.

The normal `npm run build --workspace apps/affiliate` workflow remains available for current `next start` deployments. The standalone mode is enabled only by `build:release`.

## Costume catalog and commission jobs

Store the CJ SFTP password, PAT, host-key fingerprint, export path, query variables, and production `DATABASE_URL` in the deployment secret manager. Never copy `.env.local` to the server or put credentials in a command line, process manager file, archive, or Git.

Run the catalog jobs in this order under a single-job lock:

```bash
npm run download:cj:products --workspace apps/affiliate
npm run sync:cj:products:dry-run --workspace apps/affiliate
npm run sync:cj:products --workspace apps/affiliate
npm run sync:cj:commissions --workspace apps/affiliate
```

The downloader requires an explicit SHA-256 host-key fingerprint, writes to a mode-600 `.part` file, verifies the remote and local byte counts, and only then replaces the configured export path. A wrong fingerprint must fail before any download.

As observed on 2026-07-22, `datatransfer.cj.com` offered only a legacy 1024-bit `ssh-dss` host key. Keep `CJ_SFTP_ALLOW_LEGACY_DSA=0` in persistent configuration. Until CJ provides a modern endpoint or authoritative key, any owner-approved compatibility run must set it to `1` for that single command only; never change system SSH defaults or disable host verification.

The product dry-run must accept the expected row count with zero invalid destinations and zero unexpected PIDs before the database write runs. All feed images remain `pending` until written image/brand-use permission exists. The Commission job treats a valid `count: 0` response as a successful no-op and upserts non-empty records by CJ commission ID.
