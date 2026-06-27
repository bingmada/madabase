# Madabase

SSR-first monorepo for SEO-driven tools and future AI products.

## Run locally

```bash
nvm use 20
npm install
npm run dev --workspace apps/web
npm run dev:test
```

## Phase 1 scope

- Next.js 15 SSR app
- Path-based i18n (`/en/...`, `/zh/...`)
- Registry-driven tool pages
- SEO metadata, sitemap, robots
- Placeholder ad slots
- Docker deployment files

## Test subdomain

The interactive test product is a separate Next.js workspace in `apps/test`.

```bash
npm run dev:test
npm run build:test
```

Production URLs and shared authentication are configured with:

```bash
NEXT_PUBLIC_SITE_URL=https://madabase.com
NEXT_PUBLIC_TEST_SITE_URL=https://test.madabase.com
NEXT_PUBLIC_MAIN_SITE_URL=https://madabase.com
AUTH_COOKIE_DOMAIN=.madabase.com
```

Point `test.madabase.com` at the test deployment. Both applications use the
same `DATABASE_URL`; the cookie domain allows the same session to work across
the root domain and test subdomain.
