"""Briefly pause Main only when the guarded Affiliate cutover needs its memory.

Main is restored in ``finally`` and by an independent recovery timer. The
Affiliate controller retains its own post-stop capacity gate and rollback.
No other service is in scope.
"""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import re
import signal
import subprocess
import time
import urllib.request

RELEASE_PATH = Path(os.environ.get(
    "MADABASE_RECOVERY_RELEASE",
    "/var/tmp/madabase-seo-recovery-20261006.py",
))
spec = importlib.util.spec_from_file_location("recovery_release", RELEASE_PATH)
release = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release)
base = release.base

MAIN = "madabase-main.service"
WATCHDOG = "madabase-seo-recovery-20261006-main-recovery"
RECORD = release.STATE / "maintenance.json"


def main_health():
    request = urllib.request.Request(
        "http://127.0.0.1:3008/",
        headers={"Host": "madabase.com", "X-Forwarded-Host": "madabase.com"},
    )
    with urllib.request.urlopen(request, timeout=5) as response:
        if response.status != 200 or "<h1" not in response.read().decode():
            raise RuntimeError("Main health failed")


def anonymous_mib(service):
    pid = base.run(["systemctl", "show", service, "--property=MainPID", "--value"])
    if not pid.isdigit() or int(pid) <= 0:
        raise RuntimeError("No running process: " + service)
    text = Path("/proc/" + pid + "/smaps_rollup").read_text()
    match = re.search(r"^Pss_Anon:\s+(\d+) kB$", text, re.M)
    if not match:
        raise RuntimeError("Missing anonymous memory accounting")
    return int(match.group(1)) / 1024


def forecast():
    capacity = base.capacity_probe()
    reclaimed = anonymous_mib(MAIN) + anonymous_mib("madabase-affiliate.service")
    pressure = capacity.get("pressureAvg10")
    headroom = capacity.get("sliceHeadroomMiB")
    if capacity["availableMiB"] + reclaimed < 768 or not isinstance(pressure, (float, int)) or pressure >= 1:
        raise RuntimeError("Insufficient maintenance forecast capacity")
    if headroom != "unlimited" and (not isinstance(headroom, (float, int)) or headroom + reclaimed < 768):
        raise RuntimeError("Insufficient maintenance slice headroom")
    return {
        "capacity": capacity,
        "reclaimableAnonymousMiB": reclaimed,
        "projectedAvailableMiB": capacity["availableMiB"] + reclaimed,
        "requiredMiB": 768,
    }


def restore_main():
    record = json.loads(RECORD.read_text())
    current = base.run(["systemctl", "show", MAIN, "--property=WorkingDirectory", "--value"])
    if current != record["mainWorkingDirectory"]:
        raise RuntimeError("Main configuration changed during maintenance")
    base.run(["systemctl", "start", MAIN], timeout=30)
    deadline = time.monotonic() + 20
    while True:
        try:
            main_health()
            break
        except Exception:
            if time.monotonic() >= deadline:
                raise
            time.sleep(1)
    record.update(mainRestored=True, restoredAt=time.strftime("%Y-%m-%dT%H:%M:%S%z"))
    base.save(RECORD, record)
    subprocess.run(["systemctl", "stop", WATCHDOG + ".timer"], capture_output=True, timeout=10)


def maintain():
    if base.metadata("affiliate")["status"] not in ["prepared", "rolled-back"]:
        raise RuntimeError("Affiliate must be prepared")
    if base.run(["systemctl", "is-active", MAIN]) != "active":
        raise RuntimeError("Main must already be active")
    main_health()
    measured = forecast()
    original = base.run(["systemctl", "show", MAIN, "--property=WorkingDirectory", "--value"])
    base.save(RECORD, {
        "mainWorkingDirectory": original,
        "forecast": measured,
        "mainRestored": False,
        "startedAt": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
    })
    base.run([
        "systemd-run", "--unit=" + WATCHDOG, "--on-active=180s",
        "--timer-property=AccuracySec=1s", "--property=RuntimeMaxSec=90",
        "--property=MemoryMax=128M", "--property=MemorySwapMax=0",
        "--property=Restart=no", "/usr/bin/python3", str(Path(__file__).resolve()), "restore-main",
    ])

    def interrupted(unused_signum, unused_frame):
        raise RuntimeError("Maintenance interrupted")

    signal.signal(signal.SIGTERM, interrupted)
    signal.signal(signal.SIGINT, interrupted)
    try:
        base.run(["systemctl", "stop", MAIN], timeout=20)
        base.activate("affiliate")
    finally:
        restore_main()
    print(json.dumps({"affiliate": base.metadata("affiliate")["status"], "mainRestored": True}), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=["activate", "restore-main"])
    args = parser.parse_args()
    maintain() if args.action == "activate" else restore_main()
