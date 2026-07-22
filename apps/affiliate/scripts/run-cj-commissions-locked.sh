#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
cd "$repo_root"

lock_file="${CJ_COMMISSION_LOCK_FILE:-/tmp/madabase-cj-commissions.lock}"
export CJ_COMMISSION_LOOKBACK_DAYS="${CJ_COMMISSION_LOOKBACK_DAYS:-45}"

exec flock -n "$lock_file" node -e '
  const path = require("node:path");
  require("@next/env").loadEnvConfig(path.join(process.cwd(), "apps/affiliate"));
  import("./apps/affiliate/scripts/reconcile-cj-commissions.mjs");
'
