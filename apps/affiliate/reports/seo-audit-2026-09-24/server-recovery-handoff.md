# Server recovery — production release not switched

At about 19:34 Asia/Shanghai on September 24, a temporary Affiliate candidate was started on loopback port 3111 with systemd unit `madabase-seo-candidate.service` and MemoryMax 350M. The following validation did not return. The memory chart rose to about 1.5GB and CPU to about 60%; whether memory pressure caused the loss of responsiveness requires journal confirmation.

The old production services were not stopped, reconfigured, or switched. Workbench terminal input stopped producing output; a new Workbench login timed out. Alibaba command execution `seo-candidate-health-20260924` was not delivered because its client was unavailable. The candidate stop is **not confirmed**. Origin HTTP and public HTTPS probes timed out. The rescue VNC console connects but requires an existing system login password.

An owner approval request is pending for a recovery reboot because the same host includes excluded Test/Tools services. Do not interpret a question about SEO status as that approval. No password, key, permission, firewall or system security change is authorized by this handoff.

After approved recovery or an authenticated rescue session:

1. Stop `madabase-seo-candidate.service`; confirm no process listens on 3111. A reboot should remove this transient unit, but verify.
2. Check the existing Affiliate/Main/Wellness systemd service health and their origin HTTP responses. Restore the existing release first if needed; do not change Test/Tools configuration.
3. Inspect the journal for OOM/reclaim events around 19:30–20:00, memory, swap and process RSS before any additional candidate. Do not repeat simultaneous candidate startup without a measured memory budget and automatic timeout/cleanup.
4. Retain previous hashed assets and all rollback releases. Do not reset the dirty repository checkout.
5. The latest Affiliate archive is in the commit containing `comprehensive-followup.md`, SHA256 `8f0ac11a80e59765018d720f5a762601b09b4c92f0db5511c4e60b1cadf80e94` (60866053 bytes). It includes the later Anker/GROWNSY and Style evidence repairs; `5fe0cdf` is superseded. Main/Wellness archives are from `4883d9c`. The already-extracted Affiliate `4883d9c` directory lacks the HON/Branch merchant correction and must not be the final release.
6. Deployment, production validation, discovery checks, precise IndexNow submission and Google recrawl remain outstanding.

Before any parallel candidate startup, run `node scripts/check-release-capacity.mjs --candidate-mib=512` on the Linux host. Failure or missing metrics blocks startup; swap is not free capacity. Require explicit `MemoryMax`, `MemorySwapMax=0`, `RuntimeMaxSec=120`, `TimeoutStopSec=10`, `Restart=no`, loopback binding and a cleanup path that verifies the unit and port stopped. If the host cannot accommodate a second process, finish off-server checks and prepare a controlled single-process cutover with rollback and downtime approval where required. Do not adjust excluded services to create capacity.

Existing production working directories observed before candidate start:

- Affiliate, port 3011: `/srv/madabase-affiliate/releases/ab2cf6d`
- Main, port 3008: `/srv/madabase-main/releases/sec-20260820-next15523`
- Wellness, port 3099: `/srv/madabase-wellness/releases/4cccf2794981dfcd80954e92d1428e191e9fa13f`

Prepared release/rollback metadata: `/var/tmp/madabase-seo-20260924-rollback.json`. Existing service configuration uses `/etc/madabase/runtime.env`; do not print its contents.
