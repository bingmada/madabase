"""Briefly pause Main and an explicitly authorized extra service when needed.

Every paused service is restored in ``finally`` and by an independent recovery
timer. The Affiliate controller retains its own post-stop capacity gate and
rollback. No service outside the explicit configuration is in scope.
"""
import argparse
import http.client
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
EXTRA = os.environ.get("MADABASE_RECOVERY_EXTRA_SERVICE", "")
EXTRA_PORT = int(os.environ.get("MADABASE_RECOVERY_EXTRA_PORT", "0"))
EXTRA_HOST = os.environ.get("MADABASE_RECOVERY_EXTRA_HOST", "")
WATCHDOG = os.environ.get(
    "MADABASE_RECOVERY_WATCHDOG",
    "madabase-seo-recovery-20261006-main-recovery",
)
RECORD = release.STATE / "maintenance.json"


def main_health():
    request = urllib.request.Request(
        "http://127.0.0.1:3008/",
        headers={"Host": "madabase.com", "X-Forwarded-Host": "madabase.com"},
    )
    with urllib.request.urlopen(request, timeout=5) as response:
        if response.status != 200 or "<h1" not in response.read().decode():
            raise RuntimeError("Main health failed")


def extra_health():
    if not EXTRA:
        return
    if EXTRA_PORT <= 0 or not EXTRA_HOST:
        raise RuntimeError("Extra service health configuration is incomplete")
    connection = http.client.HTTPConnection("127.0.0.1", EXTRA_PORT, timeout=5)
    try:
        connection.request("GET", "/", headers={"Host": EXTRA_HOST})
        response = connection.getresponse()
        response.read()
        if not 200 <= response.status < 400:
            raise RuntimeError("Extra service health failed")
    finally:
        connection.close()


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
    if EXTRA:
        reclaimed += anonymous_mib(EXTRA)
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
    services = []
    if EXTRA:
        services.append((EXTRA, "extraWorkingDirectory", extra_health, "extraRestored"))
    services.append((MAIN, "mainWorkingDirectory", main_health, "mainRestored"))
    errors = []
    for service, directory_key, health, restored_key in services:
        try:
            current = base.run(["systemctl", "show", service, "--property=WorkingDirectory", "--value"])
            if current != record[directory_key]:
                raise RuntimeError(service + " configuration changed during maintenance")
            base.run(["systemctl", "start", service], timeout=30)
            deadline = time.monotonic() + 20
            while True:
                try:
                    health()
                    break
                except Exception:
                    if time.monotonic() >= deadline:
                        raise
                    time.sleep(1)
            record[restored_key] = True
        except Exception as error:
            errors.append(service + ": " + str(error))
    record["restoredAt"] = time.strftime("%Y-%m-%dT%H:%M:%S%z")
    base.save(RECORD, record)
    if errors:
        raise RuntimeError("; ".join(errors))
    subprocess.run(["systemctl", "stop", WATCHDOG + ".timer"], capture_output=True, timeout=10)


def maintain():
    if base.metadata("affiliate")["status"] not in ["prepared", "rolled-back"]:
        raise RuntimeError("Affiliate must be prepared")
    if base.run(["systemctl", "is-active", MAIN]) != "active":
        raise RuntimeError("Main must already be active")
    main_health()
    if EXTRA:
        if base.run(["systemctl", "is-active", EXTRA]) != "active":
            raise RuntimeError("Extra service must already be active")
        extra_health()
    measured = forecast()
    original = base.run(["systemctl", "show", MAIN, "--property=WorkingDirectory", "--value"])
    record = {
        "mainWorkingDirectory": original,
        "forecast": measured,
        "mainRestored": False,
        "startedAt": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
    }
    if EXTRA:
        record.update(
            extraService=EXTRA,
            extraWorkingDirectory=base.run([
                "systemctl", "show", EXTRA, "--property=WorkingDirectory", "--value",
            ]),
            extraRestored=False,
        )
    base.save(RECORD, record)
    watchdog = [
        "systemd-run", "--unit=" + WATCHDOG, "--on-active=180s",
        "--timer-property=AccuracySec=1s", "--property=RuntimeMaxSec=90",
        "--property=MemoryMax=128M", "--property=MemorySwapMax=0",
        "--property=Restart=no",
    ]
    for key in [
        "MADABASE_RECOVERY_RELEASE",
        "MADABASE_RELEASE_BASE",
        "MADABASE_RECOVERY_LEDGER",
        "MADABASE_RECOVERY_STATE",
        "MADABASE_RECOVERY_CAPACITY",
        "MADABASE_RECOVERY_SHA256",
        "MADABASE_RELEASE_LABEL",
        "MADABASE_RECOVERY_EXTRA_SERVICE",
        "MADABASE_RECOVERY_EXTRA_PORT",
        "MADABASE_RECOVERY_EXTRA_HOST",
        "MADABASE_RECOVERY_WATCHDOG",
    ]:
        if os.environ.get(key):
            watchdog.append("--setenv=" + key + "=" + os.environ[key])
    watchdog.extend(["/usr/bin/python3", str(Path(__file__).resolve()), "restore-main"])
    base.run(watchdog)

    def interrupted(unused_signum, unused_frame):
        raise RuntimeError("Maintenance interrupted")

    signal.signal(signal.SIGTERM, interrupted)
    signal.signal(signal.SIGINT, interrupted)
    try:
        if EXTRA:
            base.run(["systemctl", "stop", EXTRA], timeout=20)
        base.run(["systemctl", "stop", MAIN], timeout=20)
        base.activate("affiliate")
    finally:
        restore_main()
    print(json.dumps({
        "affiliate": base.metadata("affiliate")["status"],
        "mainRestored": True,
        "extraService": EXTRA or None,
        "extraRestored": bool(EXTRA),
    }), flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=["activate", "restore-main"])
    args = parser.parse_args()
    maintain() if args.action == "activate" else restore_main()
