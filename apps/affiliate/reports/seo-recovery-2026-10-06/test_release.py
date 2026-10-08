import importlib.util
import json
import os
from contextlib import ExitStack
from pathlib import Path
import tempfile
from unittest.mock import patch
from urllib.parse import urlparse

HERE = Path(__file__).resolve().parent
os.environ["MADABASE_RELEASE_BASE"] = str(HERE.parent / "seo-release-2026-10-02" / "deploy.py")
os.environ["MADABASE_RECOVERY_LEDGER"] = str(HERE / "changed-urls.json")
os.environ["MADABASE_RECOVERY_RELEASE"] = str(HERE / "deploy.py")


def load(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


release = load("recovery_release_test", HERE / "deploy.py")
ledger = release.validate_ledger_file()
targets = {family["target"] for family in ledger["families"]}
redirects = {
    source: urlparse(family["target"]).path
    for family in ledger["families"]
    for source in family["sources"]
}


def successful_origin(host, path):
    url = "https://" + host + path
    if path == "/sitemap.xml":
        return 200, {}, "\n".join(sorted(target for target in targets if urlparse(target).hostname == host))
    if url in redirects:
        return 308, {"Location": redirects[url]}, ""
    if url in targets:
        return 200, {}, '<html><head><link rel="canonical" href="' + url + '"/></head><body>recovery</body></html>'
    raise AssertionError("Unexpected origin request " + url)


with patch.object(release, "request_origin", side_effect=successful_origin):
    assert release.verify_recovery() == {"targets": 17, "redirects": 55, "sitemaps": 7, "errors": 0}


def broken_origin(host, path):
    status, headers, body = successful_origin(host, path)
    if path == urlparse(next(iter(targets))).path:
        body = "<html><head></head><body>broken</body></html>"
    return status, headers, body


with patch.object(release, "request_origin", side_effect=broken_origin):
    try:
        release.verify_recovery()
        raise AssertionError("Missing canonical must fail")
    except RuntimeError:
        pass


maintenance = load("recovery_maintenance_test", HERE / "maintenance.py")
for scenario in ["success", "forecast-failure", "watchdog-failure", "stop-failure", "activate-failure"]:
    with tempfile.TemporaryDirectory() as temp:
        actions = []

        def run(args, timeout=30):
            if args[:2] == ["systemctl", "is-active"]:
                return "active"
            if args[0] == "systemd-run" and scenario == "watchdog-failure":
                raise RuntimeError("watchdog unavailable")
            if args[:2] == ["systemctl", "stop"]:
                actions.append("stop-main")
                if scenario == "stop-failure":
                    raise RuntimeError("stop failed")
            return "/unchanged-main"

        def forecast():
            if scenario == "forecast-failure":
                raise RuntimeError("capacity")
            return {"projectedAvailableMiB": 800}

        def activate(app):
            actions.append("activate-affiliate")
            if scenario == "activate-failure":
                raise RuntimeError("rollback simulated")

        with ExitStack() as stack:
            stack.enter_context(patch.object(maintenance, "RECORD", Path(temp) / "state.json"))
            stack.enter_context(patch.object(maintenance.base, "metadata", return_value={"status": "prepared"}))
            stack.enter_context(patch.object(maintenance.base, "run", side_effect=run))
            stack.enter_context(patch.object(maintenance, "main_health"))
            stack.enter_context(patch.object(maintenance, "forecast", side_effect=forecast))
            stack.enter_context(patch.object(maintenance.base, "activate", side_effect=activate))
            stack.enter_context(patch.object(maintenance, "restore_main", side_effect=lambda: actions.append("restore-main")))
            try:
                maintenance.maintain()
                assert scenario == "success"
            except RuntimeError:
                assert scenario != "success"
        if scenario in ["forecast-failure", "watchdog-failure"]:
            assert actions == []
        else:
            assert actions[0] == "stop-main" and actions[-1] == "restore-main"

for available, pressure, headroom, expected in [
    (220, 0, "unlimited", True),
    (150, 0, "unlimited", False),
    (220, 1, "unlimited", False),
    (220, 0, 100, False),
]:
    with ExitStack() as stack:
        stack.enter_context(patch.object(maintenance.base, "capacity_probe", return_value={
            "availableMiB": available,
            "pressureAvg10": pressure,
            "sliceHeadroomMiB": headroom,
        }))
        stack.enter_context(patch.object(maintenance, "anonymous_mib", return_value=280))
        try:
            maintenance.forecast()
            assert expected
        except RuntimeError:
            assert not expected

with tempfile.TemporaryDirectory() as temp:
    actions = []
    watchdog_command = []

    def extra_run(args, timeout=30):
        if args[:2] == ["systemctl", "is-active"]:
            return "active"
        if args[0] == "systemd-run":
            watchdog_command.extend(args)
            return "scheduled"
        if args[:2] == ["systemctl", "show"]:
            return "/unchanged-test" if args[2] == "madabase-test.service" else "/unchanged-main"
        if args[:2] == ["systemctl", "stop"]:
            actions.append("stop-" + args[2])
            return ""
        return ""

    with ExitStack() as stack:
        stack.enter_context(patch.dict(os.environ, {
            "MADABASE_RECOVERY_EXTRA_SERVICE": "madabase-test.service",
            "MADABASE_RECOVERY_EXTRA_PORT": "3009",
            "MADABASE_RECOVERY_EXTRA_HOST": "test.madabase.com",
        }))
        stack.enter_context(patch.object(maintenance, "EXTRA", "madabase-test.service"))
        stack.enter_context(patch.object(maintenance, "EXTRA_PORT", 3009))
        stack.enter_context(patch.object(maintenance, "EXTRA_HOST", "test.madabase.com"))
        stack.enter_context(patch.object(maintenance, "RECORD", Path(temp) / "state.json"))
        stack.enter_context(patch.object(maintenance.base, "metadata", return_value={"status": "prepared"}))
        stack.enter_context(patch.object(maintenance.base, "run", side_effect=extra_run))
        stack.enter_context(patch.object(maintenance, "main_health"))
        stack.enter_context(patch.object(maintenance, "extra_health"))
        stack.enter_context(patch.object(maintenance, "forecast", return_value={"projectedAvailableMiB": 860}))
        stack.enter_context(patch.object(maintenance.base, "activate", side_effect=lambda app: actions.append("activate-affiliate")))
        stack.enter_context(patch.object(maintenance, "restore_main", side_effect=lambda: actions.append("restore-services")))
        maintenance.maintain()
    assert actions == [
        "stop-madabase-test.service",
        "stop-madabase-main.service",
        "activate-affiliate",
        "restore-services",
    ]
    assert "--setenv=MADABASE_RECOVERY_EXTRA_SERVICE=madabase-test.service" in watchdog_command
    assert "--setenv=MADABASE_RECOVERY_EXTRA_PORT=3009" in watchdog_command

for changed_service in [None, "madabase-test.service", "madabase-main.service"]:
    with tempfile.TemporaryDirectory() as temp:
        record = Path(temp) / "state.json"
        maintenance.base.save(record, {
            "mainWorkingDirectory": "/unchanged-main",
            "extraWorkingDirectory": "/unchanged-test",
            "mainRestored": False,
            "extraRestored": False,
        })
        starts = []

        def restore_run(args, timeout=30):
            service = args[2]
            if args[:2] == ["systemctl", "show"]:
                if service == changed_service:
                    return "/externally-changed"
                return "/unchanged-test" if service == "madabase-test.service" else "/unchanged-main"
            if args[:2] == ["systemctl", "start"]:
                starts.append(service)
                return ""
            return ""

        with ExitStack() as stack:
            stack.enter_context(patch.object(maintenance, "EXTRA", "madabase-test.service"))
            stack.enter_context(patch.object(maintenance, "RECORD", record))
            stack.enter_context(patch.object(maintenance.base, "run", side_effect=restore_run))
            stack.enter_context(patch.object(maintenance, "main_health"))
            stack.enter_context(patch.object(maintenance, "extra_health"))
            stack.enter_context(patch.object(maintenance.subprocess, "run"))
            try:
                maintenance.restore_main()
                assert changed_service is None
            except RuntimeError:
                assert changed_service is not None
        if changed_service is None:
            assert starts == ["madabase-test.service", "madabase-main.service"]
        else:
            assert changed_service not in starts
            assert ({"madabase-test.service", "madabase-main.service"} - {changed_service}).issubset(starts)

print("Recovery origin, canonical, redirect, sitemap, maintenance, extra-service recovery and rollback simulations passed")
