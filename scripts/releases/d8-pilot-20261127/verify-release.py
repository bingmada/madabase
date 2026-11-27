"""Read-only origin/public acceptance; never follows a retailer purchase link."""
import argparse
import concurrent.futures
import html
import json
import urllib.request
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

HERE = Path(__file__).resolve().parent
HOSTS = ["baby.madabase.com", "network.madabase.com", "smarthome.madabase.com", "homeoffice.madabase.com", "pets.madabase.com"]
TAGS = dict(zip(HOSTS, ["madabasebaby-20", "madabasenet-20", "madabasesmart-20", "madabaseoffice-20", "madabasepets-20"]))
CHANGED = {
    "/reviews/momcozy-deepclean-d8-bottle-washer",
    "/best/momcozy-deepclean-d8-vs-kleanpal-pro",
    "/reviews/momcozy-kleanpal-pro-baby-bottle-washer",
    "/guides/bottle-washer-vs-sterilizer-vs-dryer-guide",
}


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.meta = [], {}
        self.canonical = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "a":
            self.links.append(attrs)
        if tag == "meta":
            self.meta[attrs.get("name")] = attrs.get("content", "")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", help="Local/origin URL; omit to inspect actual public canonical URLs")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    build = json.loads((HERE / "artifact.json").read_text())["artifacts"]["affiliate"]["buildId"]
    checks = json.loads((HERE / "release-urls.json").read_text())["affiliateChecks"]
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({})) if args.base else urllib.request.build_opener()

    def get(host, path):
        url = args.base.rstrip("/") + path if args.base else "https://" + host + path
        req = urllib.request.Request(url, headers={"Host": host, "X-Forwarded-Host": host, "X-Forwarded-Proto": "https", "User-Agent": "Madabase scoped release QA/1.0"})
        with opener.open(req, timeout=30) as response:
            return response.status, response.read().decode(), dict(response.headers)

    def check(item):
        errors = []
        try:
            status, body, headers = get(item["host"], item["path"])
            decoded = html.unescape(body)
            errors.extend("marker:" + marker for marker in item["markers"] if marker not in decoded)
            page = Page()
            page.feed(body)
            if page.canonical != item["canonical"]:
                errors.append("canonical")
            # Unchanged public pages may legitimately retain the previous cache entry.
            if (args.base or item["path"] in CHANGED) and build not in body:
                errors.append("build-id")
            for link in page.links:
                url = urlsplit(link.get("href", ""))
                if not (url.hostname == "amazon.com" or (url.hostname or "").endswith(".amazon.com")):
                    continue
                query = parse_qs(url.query)
                if query.get("tag") or "data-commerce-product" in link:
                    if query.get("tag") != [TAGS[item["host"]]]:
                        errors.append("attribution")
                if "data-commerce-product" in link and not {"sponsored", "nofollow"}.issubset(link.get("rel", "").split()):
                    errors.append("purchase-rel")
            if item["path"] in CHANGED and "noindex" in page.meta.get("robots", ""):
                errors.append("unexpected-noindex")
            if item["path"] in {
                "/reviews/momcozy-deepclean-d8-bottle-washer",
                "/best/momcozy-deepclean-d8-vs-kleanpal-pro",
            } and not 50 <= len(page.meta.get("description", "")) <= 165:
                errors.append("new-page-description-length")
            return {"host": item["host"], "path": item["path"], "status": status, "cache": headers.get("CF-Cache-Status"), "errors": sorted(set(errors))}
        except Exception as exc:
            return {"host": item["host"], "path": item["path"], "errors": [str(exc)]}

    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        results = list(pool.map(check, checks))
    for host in HOSTS:
        for path in ["/", "/sitemap.xml"]:
            try:
                status, body, headers = get(host, path)
                errors = []
                if path == "/sitemap.xml":
                    if "<loc>" not in body:
                        errors.append("empty-sitemap")
                    if host == "baby.madabase.com":
                        for suffix in ["/reviews/momcozy-deepclean-d8-bottle-washer", "/best/momcozy-deepclean-d8-vs-kleanpal-pro"]:
                            if "https://baby.madabase.com" + suffix + "</loc>" not in body:
                                errors.append("missing-pilot-sitemap-entry:" + suffix)
                            if any("/" + locale + suffix + "</loc>" in body for locale in ["en-gb", "en-ca", "de-de", "nl-nl"]):
                                errors.append("unqualified-regional-sitemap-entry")
                results.append({"host": host, "path": path, "status": status, "cache": headers.get("CF-Cache-Status"), "errors": errors})
            except Exception as exc:
                results.append({"host": host, "path": path, "errors": [str(exc)]})
    status, image, _ = get("baby.madabase.com", "/images/affiliate/momcozy-d8-load-decision.svg")
    results.append({"host": "baby.madabase.com", "path": "/images/affiliate/momcozy-d8-load-decision.svg", "status": status, "errors": [] if "<svg" in image else ["missing-diagram"]})
    failures = [row for row in results if row["errors"]]
    output = {"mode": "origin" if args.base else "public", "buildId": build, "checked": len(results), "failed": len(failures), "failures": failures, "results": results}
    Path(args.output).write_text(json.dumps(output, indent=2) + "\n")
    print(json.dumps({key: output[key] for key in ["mode", "buildId", "checked", "failed", "failures"]}))
    raise SystemExit(bool(failures))


if __name__ == "__main__":
    main()
