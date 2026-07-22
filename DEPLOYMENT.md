# Low-resource standalone releases

All five Next.js workspaces can produce an isolated standalone archive. Generated archives are intentionally ignored by Git: commit the configuration and packaging script, then build and upload the archive through the release pipeline.

## Build one application

```bash
npm run build:release:main
npm run build:release:web
npm run build:release:test
npm run build:release:affiliate
npm run build:release:wellness
```

Build every application sequentially, rather than concurrently, with:

```bash
npm run build:release:all
```

Each command writes `apps/<name>/.release/<name>-runtime.tgz`. Release builds use `.next-release`, so they do not overwrite a running development server's `.next` directory. Archives contain traced runtime dependencies, `.next/static`, `public/`, and—where present—the runtime-read `content/` directory. They exclude build caches, application source, and development dependencies.

## Deploy

Upload one archive and extract it into that application's fixed server release directory. The package already contains `start.mjs`, the complete traced runtime, runtime-read content, and `ecosystem.config.cjs`; the server does not run `npm install` or `next build`.

The one-time PM2 migration for each application is:

```bash
cd <fixed-application-release-directory>
pm2 start ecosystem.config.cjs
pm2 save
```

After that, every release is exactly: build locally, upload and extract over the same fixed directory, then restart the existing process:

```bash
pm2 restart madabase-main
pm2 restart madabase-tools
pm2 restart madabase-test
pm2 restart madabase-affiliate
pm2 restart madabase-wellness
```

Restart only the application whose archive changed. PM2 keeps the server-side environment, including `DATABASE_URL` and secrets. Keep a copy of the previous archive for rollback and verify the restarted application's routes, APIs, assets, database access, canonicals, and proxy response.

The affiliate application remains one host-aware process for all affiliate subdomains. Database-backed applications still receive `DATABASE_URL` and other secrets from the PM2/server environment; secrets are never embedded in the archive or committed to Git.

The existing `npm run build` and `next start` commands remain unchanged. Standalone mode is enabled only by the `build:release` commands.
