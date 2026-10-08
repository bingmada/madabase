"""Guarded immutable Affiliate release for the October search-recovery batch.

This controller reuses the already-tested October 2 single-process cutover,
capacity gates, watchdog and rollback implementation. It replaces only the
immutable artifact identity and the origin acceptance test for this batch.
It never builds on the production host or modifies its repository checkout.
"""
import argparse
import hashlib
import importlib.util
import json
import os
from pathlib import Path
import re
import urllib.error
import urllib.parse
import urllib.request

BASE_PATH = Path(os.environ.get(
    "MADABASE_RELEASE_BASE",
    "/var/tmp/madabase-seo-recovery-20261006-base.py",
))
LEDGER = Path(os.environ.get(
    "MADABASE_RECOVERY_LEDGER",
    "/var/tmp/madabase-seo-recovery-20261006-urls.json",
))
STATE = Path(os.environ.get(
    "MADABASE_RECOVERY_STATE",
    "/var/tmp/madabase-seo-recovery-20261006",
))
CAPACITY = Path(os.environ.get(
    "MADABASE_RECOVERY_CAPACITY",
    "/var/tmp/madabase-seo-capacity-20261006.mjs",
))
ARCHIVE_SHA256 = os.environ.get(
    "MADABASE_RECOVERY_SHA256",
    "40dc368375e9f8e055ae4c6330252a7ffbb66eacebcb26ed26c518747fbca7d3",
)

spec = importlib.util.spec_from_file_location("guarded_release_base", BASE_PATH)
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)

base.STATE = STATE
base.CAPACITY = CAPACITY
base.PLAN = {
    "affiliate": {
        "port": 3011,
        "sha256": ARCHIVE_SHA256,
        "hosts": [
            "network.madabase.com",
            "smarthome.madabase.com",
            "homeoffice.madabase.com",
            "baby.madabase.com",
            "pets.madabase.com",
            "style.madabase.com",
            "costumes.madabase.com",
        ],
    },
}


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, request, file_pointer, code, message, headers, new_url):
        return None


def request_origin(host, path):
    request = urllib.request.Request(
        "http://127.0.0.1:3011" + path,
        headers={
            "Host": host,
            "X-Forwarded-Host": host,
            "X-Forwarded-Proto": "https",
            "User-Agent": "Madabase October recovery origin QA/1.0",
        },
    )
    opener = urllib.request.build_opener(NoRedirect)
    try:
        response = opener.open(request, timeout=8)
    except urllib.error.HTTPError as error:
        response = error
    body = response.read().decode(errors="replace")
    return response.status, response.headers, body


def validate_ledger_file():
    ledger = json.loads(LEDGER.read_text())
    targets = {family["target"] for family in ledger["families"]}
    sources = {source for family in ledger["families"] for source in family["sources"]}
    if len(ledger["families"]) != 17 or len(targets) != 17 or len(sources) != 55:
        raise RuntimeError("Recovery ledger count mismatch")
    if ledger.get("newRoutes") != 0 or ledger.get("requestIndexing") is not False:
        raise RuntimeError("Recovery ledger publication boundary changed")
    return ledger


def verify_recovery():
    ledger = validate_ledger_file()
    errors = []
    target_count = 0
    redirect_count = 0
    sitemap_count = 0
    targets_by_host = {}
    sources_by_host = {}

    for family in ledger["families"]:
        target = urllib.parse.urlparse(family["target"])
        targets_by_host.setdefault(target.hostname, []).append(family["target"])
        status, headers, body = request_origin(target.hostname, target.path)
        head_match = re.search(r"<head[^>]*>(.*?)</head>", body, re.I | re.S)
        head = head_match.group(1) if head_match else ""
        canonical = 'rel="canonical" href="' + family["target"] + '"'
        if status != 200 or canonical not in head:
            errors.append("target failed: " + family["target"])
        if re.search(r'<meta[^>]+name="robots"[^>]+content="[^"]*noindex', head, re.I):
            errors.append("target noindex: " + family["target"])
        target_count += 1

        for source_url in family["sources"]:
            source = urllib.parse.urlparse(source_url)
            sources_by_host.setdefault(source.hostname, []).append(source_url)
            status, headers, unused_body = request_origin(source.hostname, source.path)
            location = headers.get("Location")
            if status != 308 or location != target.path:
                errors.append(
                    "redirect failed: " + source_url + " -> " + str(status) + " " + str(location)
                )
            redirect_count += 1

    for host in sorted(targets_by_host):
        status, unused_headers, sitemap = request_origin(host, "/sitemap.xml")
        if status != 200:
            errors.append("sitemap failed: " + host)
        for target_url in targets_by_host[host]:
            if sitemap.count(target_url) != 1:
                errors.append("sitemap target count failed: " + target_url)
        for source_url in sources_by_host.get(host, []):
            if source_url in sitemap:
                errors.append("sitemap contains redirect source: " + source_url)
        sitemap_count += 1

    if errors:
        raise RuntimeError("; ".join(errors[:8]))
    return {
        "targets": target_count,
        "redirects": redirect_count,
        "sitemaps": sitemap_count,
        "errors": 0,
    }


# The base controller calls this while the rollback watchdog is still armed.
base.verify_metadata = verify_recovery


def verify_local_artifact(path):
    digest = hashlib.sha256(Path(path).read_bytes()).hexdigest()
    if digest != ARCHIVE_SHA256:
        raise RuntimeError("Local artifact hash mismatch")
    return digest


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("action", choices=["prepare", "activate", "rollback", "watchdog", "verify-origin", "verify-artifact"])
    parser.add_argument("app", choices=["affiliate"], nargs="?", default="affiliate")
    parser.add_argument("--revision")
    parser.add_argument("--artifact")
    args = parser.parse_args()
    base.REVISION = args.revision
    if args.action == "prepare":
        base.prepare()
    elif args.action == "activate":
        base.activate(args.app)
    elif args.action == "verify-origin":
        print(json.dumps(verify_recovery()), flush=True)
    elif args.action == "verify-artifact" and args.artifact:
        print(verify_local_artifact(args.artifact), flush=True)
    elif args.action == "verify-artifact":
        raise RuntimeError("--artifact is required")
    else:
        base.rollback(args.app, automatic=args.action == "watchdog")
