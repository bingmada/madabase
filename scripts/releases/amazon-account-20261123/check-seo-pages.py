"""Check the five approved pages without visiting any merchant links."""
import argparse
import hashlib
import json
import urllib.request
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit

HERE = Path(__file__).resolve().parent
GUIDES = [
    "https://homeoffice.madabase.com/guides/dual-screen-portable-monitors-vs-alternatives",
    "https://homeoffice.madabase.com/guides/monitor-arm-clamp-reinforcement-guide",
    "https://baby.madabase.com/guides/potty-training-seats-buying-guide",
]


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonical, self.description, self.robots, self.text = [], [], [], []
        self.main = self.script = self.h1 = 0
        self.title, self.in_title = "", False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "main": self.main += 1
        if tag in ["script", "style"]: self.script += 1
        if tag == "h1": self.h1 += 1
        if tag == "title": self.in_title = True
        if tag == "link" and a.get("rel") == "canonical": self.canonical.append(a.get("href"))
        if tag == "meta" and a.get("name") == "description": self.description.append(a.get("content"))
        if tag == "meta" and a.get("name") == "robots": self.robots.append(a.get("content", ""))

    def handle_endtag(self, tag):
        if tag == "main": self.main -= 1
        if tag in ["script", "style"]: self.script -= 1
        if tag == "title": self.in_title = False

    def handle_data(self, value):
        if self.main and not self.script: self.text.append(value)
        if self.in_title: self.title += value


def fetch(url, base=None):
    u = urlsplit(url)
    request = urllib.request.Request((base.rstrip("/") + u.path) if base else url, headers={
        "Host": u.netloc, "X-Forwarded-Host": u.netloc, "X-Forwarded-Proto": "https",
        "Accept": "text/html", "User-Agent": "Madabase SEO release QA/1.0",
    })
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({})) if base else urllib.request.build_opener()
    with opener.open(request, timeout=30) as response:
        return response.read().decode(), dict(response.headers)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--capture-baseline", action="store_true")
    parser.add_argument("--base")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    changed = {r["url"]: r for r in json.loads((HERE / "metadata-validation.json").read_text())["changed"]}
    baseline_path = HERE / "content-baseline.json"
    baseline = {} if args.capture_baseline else json.loads(baseline_path.read_text())
    build = json.loads((HERE / "artifact.json").read_text())["artifacts"]["affiliate"]["buildId"]
    rows, maps = [], {}
    for url in [*changed, *GUIDES]:
        body, headers = fetch(url, args.base)
        page = Page()
        page.feed(body)
        text_hash = hashlib.sha256(" ".join(" ".join(page.text).split()).encode()).hexdigest()
        host = urlsplit(url).netloc
        if host not in maps:
            xml, _ = fetch("https://" + host + "/sitemap.xml", args.base)
            maps[host] = {r.findtext("{*}loc"): r.findtext("{*}lastmod") for r in ET.fromstring(xml)}
        date = maps[host].get(url)
        observed = {"title": page.title, "description": page.description, "mainTextSha256": text_hash, "sitemapLastmod": date}
        if args.capture_baseline:
            baseline[url] = observed
            continue
        errors = []
        if page.canonical != [url]: errors.append("canonical")
        if page.h1 != 1: errors.append("h1")
        if any("noindex" in v.lower() for v in page.robots) or any(k.lower() == "x-robots-tag" and "noindex" in v.lower() for k, v in headers.items()): errors.append("noindex")
        if build not in body: errors.append("stale-build")
        if text_hash != baseline[url]["mainTextSha256"]: errors.append("visible-content-changed")
        if page.title != baseline[url]["title"]: errors.append("title-changed")
        if url in changed:
            if page.description != [changed[url]["description"]]: errors.append("description")
            if not (date or "").startswith("2026-11-23"): errors.append("metadata-lastmod")
        else:
            if page.description != baseline[url]["description"]: errors.append("unrelated-description-changed")
            if date != baseline[url]["sitemapLastmod"]: errors.append("unrelated-lastmod-changed")
        rows.append({"url": url, **observed, "errors": errors})
    if args.capture_baseline:
        baseline_path.write_text(json.dumps(baseline, indent=2) + "\n")
        print(json.dumps({"baselinePages": len(baseline)}))
        return
    report = {"mode": "local" if args.base else "public", "buildId": build, "checked": len(rows), "failed": sum(bool(r["errors"]) for r in rows), "results": rows}
    Path(args.output).write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report))
    raise SystemExit(1 if report["failed"] else 0)


if __name__ == "__main__": main()
