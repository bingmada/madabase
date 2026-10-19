import concurrent.futures
import csv
import html
import json
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPORTS = HERE.parent
HOSTS = ['network.madabase.com', 'smarthome.madabase.com', 'homeoffice.madabase.com', 'baby.madabase.com', 'pets.madabase.com', 'style.madabase.com', 'costumes.madabase.com']
EXTRA = [
 'https://baby.madabase.com/guides/toddler-learning-towers-buying-guide',
 'https://baby.madabase.com/guides/childproof-door-knob-covers-buying-guide',
 'https://network.madabase.com/guides/pass-through-ethernet-crimping-tools-buying-guide',
 'https://homeoffice.madabase.com/guides/home-office-acoustic-panels-buying-guide',
 'https://homeoffice.madabase.com/reviews/caldigit-ts4-thunderbolt-dock',
 'https://homeoffice.madabase.com/reviews/insta360-link-2-webcam',
 'https://homeoffice.madabase.com/best/logitech-mx-brio-vs-insta360-link-2',
 'https://baby.madabase.com/reviews/ergobaby-omni-breeze-carrier',
 'https://network.madabase.com/reviews/tp-link-deco-be63-wifi-7-mesh',
 'https://network.madabase.com/reviews/tp-link-deco-be67-wifi-7-mesh',
 'https://network.madabase.com/reviews/tp-link-deco-be85-wifi-7-mesh',
 'https://network.madabase.com/best/best-mesh-wifi-for-apartments-and-homes',
 'https://network.madabase.com/best/best-mesh-wifi-for-2-5gbps-internet',
 'https://network.madabase.com/best/deco-be85-vs-be67',
 'https://network.madabase.com/guides/2-5gbe-vs-10gbe-mesh-backhaul-checklist',
 'https://network.madabase.com/guides/wifi-7-mesh-budget-midrange-premium-guide',
]
COHORTS = [json.loads((REPORTS / folder / 'changed-urls.json').read_text()) for folder in ['seo-recovery-2026-10-06', 'seo-focus-2026-10-13']]
PROTECTED = list(csv.DictReader((REPORTS / 'acquisition-commerce-audit-2026-10-19/bing-protection-ledger.csv').open()))
RELEASE_LEDGER = json.loads((HERE / 'release-urls.json').read_text())
EXPECTED_HEADINGS = {r['target']: r.get('expectedHeading') for r in RELEASE_LEDGER['families']}

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args):
        return None

def fetch(url):
    parsed = urllib.parse.urlparse(url)
    origin = '--local' in sys.argv
    requested = 'http://127.0.0.1:3020' + parsed.path if origin else url
    headers = {'User-Agent': 'Madabase commerce release QA/1.0', 'Accept': 'text/html'}
    if origin:
        headers.update({'Host': parsed.hostname, 'X-Forwarded-Host': parsed.hostname, 'X-Forwarded-Proto': 'https'})
    error = None
    for attempt in range(3):
        try:
            try:
                response = urllib.request.build_opener(NoRedirect).open(urllib.request.Request(requested, headers=headers), timeout=20)
            except urllib.error.HTTPError as exc:
                response = exc
            body = response.read().decode(errors='replace')
            if response.status >= 500 and attempt < 2:
                continue
            head = re.search(r'<head[^>]*>(.*?)</head>', body, re.S | re.I)
            head = head[1] if head else ''
            canonical = re.search(r'<link[^>]*rel="canonical"[^>]*href="([^"]+)"', head)
            title = re.search(r'<title>(.*?)</title>', head, re.S)
            h1 = re.search(r'<h1[^>]*>(.*?)</h1>', body, re.S)
            sponsored = [html.unescape(tag) for tag in re.findall(r'<a\b[^>]*>', body) if re.search(r'rel="[^"]*sponsored', tag)]
            result = {'url': url, 'status': response.status, 'location': response.headers.get('Location'), 'canonical': html.unescape(canonical[1]) if canonical else None, 'title': html.unescape(title[1]) if title else None, 'h1': html.unescape(re.sub('<[^>]+>', '', h1[1])) if h1 else None, 'noindex': bool(re.search(r'<meta[^>]+name="robots"[^>]+content="[^"]*noindex', head)), 'sponsored': sponsored, 'blockedSponsoredAsins': [asin for asin in ['B001ECHXVC', 'B0C4W1L4B3'] if any(asin in tag for tag in sponsored)]}
            result['cache'] = response.headers.get('CF-Cache-Status')
            result['age'] = response.headers.get('Age')
            result['expectedHeadingPresent'] = not EXPECTED_HEADINGS.get(url) or EXPECTED_HEADINGS[url] in html.unescape(body)
            result['october19RefreshPresent'] = 'October 19, 2026' in body
            if parsed.path in ['/sitemap.xml', '/llms.txt', '/robots.txt']:
                result['body'] = body
            for marker in ['TS4 or a newer Thunderbolt 5 dock?', 'Link 2 versus Link 2 Pro', 'Buying an Omni Breeze now', 'The linked Original Learning Tower is unavailable', 'Check the selected cover pack', 'What the linked Klein kit', 'The selected TONOR set', 'Choose the exact Deco model and pack']:
                if marker in html.unescape(body):
                    result.setdefault('markers', []).append(marker)
            return result
        except Exception as exc:
            error = str(exc)
    return {'url': url, 'error': error}

urls = {r['url'] for r in PROTECTED} | set(EXTRA)
for cohort in COHORTS:
    for family in cohort['families']:
        urls.add(family['target'])
        urls.update(family['sources'])
for host in HOSTS:
    urls.update('https://' + host + path for path in ['/', '/sitemap.xml', '/robots.txt', '/llms.txt'])
mode = 'local' if '--local' in sys.argv else ('after' if '--after' in sys.argv else 'before')
previous_rows = {}
if '--retry' in sys.argv or '--refresh-changed' in sys.argv:
    previous_rows = {r['url']: r for r in json.loads((HERE / ('public-' + mode + '.json')).read_text())['rows']}
    prior = json.loads((HERE / ('public-' + mode + '.json')).read_text())
    urls = {e.get('url', e.get('discoveryUrlSetChanged')) for e in prior['errors']}
    urls.discard(None)
    if '--refresh-changed' in sys.argv:
        urls.update(EXTRA)
        urls.update(RELEASE_LEDGER['primaryChanges'])
        urls.update('https://' + host + '/sitemap.xml' for host in ['network.madabase.com', 'baby.madabase.com', 'homeoffice.madabase.com'])
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    rows = list(pool.map(fetch, sorted(urls)))
if previous_rows:
    previous_rows.update({r['url']: r for r in rows})
    rows = list(previous_rows.values())
errors = [row for row in rows if row.get('error') or row.get('status', 0) not in [200, 308]]
if mode != 'before':
    baseline = {r['url']: r for r in json.loads((HERE / 'public-before.json').read_text())['rows']}
    for row in rows:
        old = baseline.get(row['url'])
        if old is None:
            if row.get('status') != 200 or row.get('canonical') != row['url'] or row.get('blockedSponsoredAsins'):
                errors.append({'additionalDependencyFailed': row['url']})
            continue
        for key in ['status', 'location', 'canonical', 'title', 'h1', 'noindex']:
            if row.get(key) != old.get(key):
                errors.append({'url': row['url'], 'field': key, 'before': old.get(key), 'after': row.get(key)})
        if row.get('blockedSponsoredAsins'):
            errors.append({'url': row['url'], 'blockedSponsoredAsins': row['blockedSponsoredAsins']})
        if row.get('expectedHeadingPresent') is False:
            errors.append({'url': row['url'], 'authoredHeadingMissing': EXPECTED_HEADINGS.get(row['url'])})
        if row['url'] in RELEASE_LEDGER['primaryChanges'] and row.get('october19RefreshPresent') is False:
            errors.append({'url': row['url'], 'refreshDateMissing': True})
        if 'body' in row and 'body' in old:
            if row['url'].endswith('/robots.txt'):
                if row['body'] != old['body']:
                    errors.append({'robotsChanged': row['url']})
            else:
                before_urls = set(re.findall(r'https://[^\s<>\"]+', old['body']))
                after_urls = set(re.findall(r'https://[^\s<>\"]+', row['body']))
                if before_urls != after_urls:
                    errors.append({'discoveryUrlSetChanged': row['url'], 'removed': sorted(before_urls-after_urls), 'added': sorted(after_urls-before_urls)})
    for cohort in COHORTS:
        for family in cohort['families']:
            row = next(r for r in rows if r['url'] == family['target'])
            if row['status'] != 200 or row['canonical'] != family['target'] or row['noindex']:
                errors.append({'canonicalFailure': row['url']})
report = {'checkedAt': time.strftime('%Y-%m-%dT%H:%M:%S%z'), 'mode': mode, 'protectedBingAiUrls': len(PROTECTED), 'cohortTargets': sum(len(c['families']) for c in COHORTS), 'total': len(rows), 'errors': errors, 'rows': rows}
(HERE / ('public-' + mode + '.json')).write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({key: report[key] for key in ['mode', 'protectedBingAiUrls', 'cohortTargets', 'total', 'errors']}))
if errors:
    sys.exit(1)
