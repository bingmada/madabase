"""Read rendered purchase URLs without visiting merchants or emitting click events."""
import argparse
import concurrent.futures
import hashlib
import json
import re
import time
import urllib.request
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

HERE = Path(__file__).resolve().parent


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []

    def handle_starttag(self, tag, attrs):
        if tag == "a":
            self.links.append(dict(attrs))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", help="Local origin; omit to check actual public URLs")
    parser.add_argument("--output", required=True)
    parser.add_argument("--concurrency", type=int, default=2)
    args = parser.parse_args()
    manifest = json.loads((HERE / "attribution-targets.json").read_text())
    build = json.loads((HERE / "artifact.json").read_text())["artifacts"]["affiliate"]["buildId"]
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({})) if args.base else urllib.request.build_opener()

    def check(target):
        source = urlsplit(target["url"])
        request_url = args.base.rstrip("/") + source.path if args.base else target["url"]
        request = urllib.request.Request(request_url, headers={
            "Host": source.netloc, "X-Forwarded-Host": source.netloc,
            "X-Forwarded-Proto": "https", "User-Agent": "Madabase attribution QA/1.0",
        })
        for attempt in range(2):
            try:
                with opener.open(request, timeout=30) as response:
                    body = response.read().decode()
                    page = Page()
                    page.feed(body)
                    errors, count = [], 0
                    for a in page.links:
                        url = urlsplit(a.get("href", ""))
                        is_amazon = url.hostname == "amazon.com" or (url.hostname or "").endswith(".amazon.com")
                        query = parse_qs(url.query)
                        if not is_amazon or (not query.get("tag") and "data-commerce-product" not in a):
                            continue
                        count += 1
                        tag = query.get("tag", [None])
                        if tag != [manifest["trackingIds"][target["site"]]]:
                            errors.append("wrong-tag:" + str(tag))
                        slug = a.get("data-commerce-product")
                        if slug:
                            asin = re.search(r"/(?:dp|gp/product)/([A-Z0-9]{10})(?:/|$)", url.path, re.I)
                            expected = manifest["productAsins"].get(target["site"] + ":" + slug)
                            if not asin or not expected or asin[1].upper() != expected:
                                errors.append("product-identity:" + slug)
                            if not {"sponsored", "nofollow"}.issubset(a.get("rel", "").split()):
                                errors.append("purchase-rel:" + slug)
                    if build not in body:
                        errors.append("stale-build")
                    if target["expectedAmazonLinks"] and not count:
                        errors.append("missing-previous-purchase-links")
                    return {**target, "amazonLinks": count, "errors": sorted(set(errors)),
                            "cache": response.headers.get("CF-Cache-Status"),
                            "retries": attempt, "status": response.status}
            except Exception as error:
                if attempt:
                    return {**target, "amazonLinks": 0, "errors": [str(error)]}
                time.sleep(.5)

    rows = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.concurrency) as pool:
        for row in pool.map(check, manifest["targets"]):
            rows.append(row)
            if len(rows) % 500 == 0:
                print(json.dumps({"checked": len(rows), "failed": sum(bool(r["errors"]) for r in rows)}), flush=True)
    failures = [r for r in rows if r["errors"]]
    result = {"mode": "local" if args.base else "public", "buildId": build,
              "checked": len(rows), "failed": len(failures),
              "amazonLinks": sum(r["amazonLinks"] for r in rows),
              "bySite": dict(Counter(r["site"] for r in rows)),
              "cacheStatuses": dict(Counter(r.get("cache") for r in rows)),
              "targetsSha256": hashlib.sha256((HERE / "attribution-targets.json").read_bytes()).hexdigest(),
              "scope": "Rendered attribution, exact merchant ASIN, retained purchase links and release identity; no merchant clicks, product availability or account approval checks.",
              "failures": failures}
    Path(args.output).write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps(result), flush=True)
    raise SystemExit(1 if failures else 0)


if __name__ == "__main__":
    main()
