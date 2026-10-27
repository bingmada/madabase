# Combined release for the retained publications

The retained applications are `apps/main` and `apps/affiliate`. Affiliate serves
Homeoffice, Baby, Network, Smarthome and Pets in one host-aware process.

On October 27 the owner authorized publishing the current accepted checkpoint
(SOURCE-04/05/06 plus five-site retirement) before continuing later batches.
Keep unmodified BODY-01 baselines and unresolved merchant work separate from accepted edits.
SOURCE-03 is already live at
`7db7935277c7608342a2a82695d77ac86905fa61`; do not publish it again as a separate release.

## Prepare and deploy the final fixed version

Use the existing Git workflow: commit the accepted source, push it, and have the
server fetch and select that exact commit. Do not deploy an unpinned moving branch
or overwrite a running checkout. Inspect the actual server service and proxy
configuration first; the repository Docker/nginx examples are not that configuration.

Build the two standalone packages sequentially with Node 20:

```bash
npm run build:release:affiliate
npm run build:release:main
```

Each command creates `apps/<name>/.release/<name>-runtime.tgz`. Packages contain the
traced runtime, static assets and public files. Secrets stay in the existing server
environment. Do not run `npm install` or `next build` on the low-memory server.

Record the commit, build IDs and archive hashes. Stage each package in a new fixed
release directory, verify it on a candidate port, and switch the actual existing
service only after those checks pass. Preserve prior static assets for cached HTML
and the active publications' rollback resources. If candidate checks fail, leave the
current version serving traffic. Validate exact public canonical URLs after the
switch, including shopping identities, isolated QA statistics, service health and
cache freshness; origin-only checks do not establish public cache freshness.
Record the release receipt and the already-authorized search update notifications.

## Retire Tools, Test, Style, Wellness and Costumes

Execute production retirement with the owner-authorized current checkpoint release.
Retarget all retired hosts away from their old services. Return HTTP 410 for all
former pages, APIs, assets and sitemaps. Keep `/robots.txt` crawlable without a
sitemap so crawlers can see the removal. Do not redirect unrelated retired pages
to the Main homepage. Remove old root `/en`, `/zh` and `/tools` proxy redirects;
the new Main middleware returns 410 for these legacy Tools/Test paths.

Stop and remove the old Tools, Test and Wellness services and their exclusive files.
Style and Costumes shared Affiliate; their exclusive content, assets, catalog,
variant and seasonal routes are removed from its new package. Remove old entries
from actual proxy, service, deployment and sitemap configuration after inspecting it.

The database cleanup manifest is
`apps/affiliate/reports/quality-remediation-2026-10-22/retired-sites-database-cleanup-plan.json`.
It is a plan, not an executed transaction. Inspect the actual schema, foreign keys,
exact ownership and preview row counts before preparing the bounded transaction.
Remove verified retired-site records and obsolete Tools/Test account, favorite,
usage, credit, test and referral tables. Preserve retained-site commerce, shared
merchant infrastructure and financial records belonging to other publications.
Abracadabra and Avidlove records require exclusive-ownership verification; no
blanket merchant cascade may delete Baby CJ products, links, clicks or commissions.
Record executed conditions, affected counts and post-checks in the final receipt.

Do not create a new archive of the removed sites. Keep only the rollback resources
needed by the retained publications and the audit evidence distinguishing planned,
locally verified and actually executed work.
