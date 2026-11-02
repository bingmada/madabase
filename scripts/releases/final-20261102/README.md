# Final retained-site quality release

Build and package Main and Affiliate locally with Node 20. The two tracked runtime
archives under `apps/*/.release/` are the only application binaries deployed.
`artifact.json` pins their hashes and build IDs. No server build or dependency
installation is part of this release.

After local acceptance, push the fixed Git revision. On the server, fetch/pull that
revision without discarding the existing retirement worktree. If that checkout
cannot fast-forward safely, create a separate detached worktree at the fetched
revision. Run this controller from that fixed checkout:

```
python3 scripts/releases/final-20261102/deploy.py prepare --revision <40-character-commit>
python3 scripts/releases/final-20261102/deploy.py activate
```

Preparation checks the existing database schema read-only, retired origin410
responses, archive hashes, runtime entrypoints and service write-path coupling.
Previous static files are retained only when existing paths have identical hashes.
Activation has measured memory gates and an independent recovery timer. It changes
only Main/Affiliate services and existing current-version symlinks; failure restores
their prior configurations and pointers. Retired services remain stopped. It does
not repeat database migrations, retirements or previous directory deletions.

Verify public HTML/build identity, purchase destinations, QA isolation and service
health before search notifications. Record GSC/Bing sitemap and IndexNow submission
responses separately from indexing outcomes. After public acceptance, inventory
release paths and dependencies afresh before applying the current-plus-previous
retention policy; do not reuse the October deletion manifests.
