import concurrent.futures
import datetime
import html.parser
import json
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
LEDGER = json.loads((ROOT / 'changed-urls.json').read_text())

class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None

class Meta(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.head = False
        self.canonicals = []
        self.robots = []
        self.title_in_head = False
    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'head': self.head = True
        if tag == 'title': self.title_in_head = self.head
        if tag == 'link' and a.get('rel') == 'canonical':
            self.canonicals.append({'href': a.get('href'), 'inHead': self.head})
        if tag == 'meta' and a.get('name', '').lower() in ['robots', 'googlebot']:
            self.robots.append(a.get('content', ''))
    def handle_endtag(self, tag):
        if tag == 'head': self.head = False

UAS = {
    'browser': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36',
    'googlebot': 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
}

def check(t):
    url, kind, ua, target = t
    r = {'url': url, 'kind': kind, 'ua': ua, 'expectedTarget': target, 'checkedAt': datetime.datetime.now(datetime.timezone.utc).isoformat()}
    try:
        op = urllib.request.build_opener(NoRedirect())
        try:
            response = op.open(urllib.request.Request(url, headers={'User-Agent': UAS[ua], 'Accept': 'text/html' if kind == 'canonical' else '*/*'}), timeout=20)
        except urllib.error.HTTPError as e:
            response = e
        with response:
            body = response.read(4000000).decode(errors='replace')
            r.update(status=response.code, location=response.headers.get('Location'), cache=response.headers.get('CF-Cache-Status'), ray=response.headers.get('CF-Ray'), xRobotsTag=response.headers.get('X-Robots-Tag'))
        if kind == 'canonical':
            m = Meta(); m.feed(body)
            heading = next((f['expectedHeading'] for f in LEDGER['families'] if f['target']==url), None)
            r.update(canonicals=m.canonicals, robots=m.robots, titleInHead=m.title_in_head, authoredContentPresent=heading is None or heading in body, unsupportedReviewSchema='\"@type\":\"Review\"' in body)
            r['passed'] = r['status'] == 200 and m.canonicals == [{'href': url, 'inHead': True}] and m.title_in_head and r['authoredContentPresent'] and not r['unsupportedReviewSchema'] and not any('noindex' in v.lower() for v in m.robots + [r['xRobotsTag'] or ''])
        elif kind == 'redirect':
            r['passed'] = r['status'] == 308 and urllib.parse.urljoin(url, r['location'] or '') == target
        elif kind == 'sitemap':
            host = urllib.parse.urlparse(url).hostname
            targets = [f['target'] for f in LEDGER['families'] if urllib.parse.urlparse(f['target']).hostname == host]
            sources = [s for f in LEDGER['families'] for s in f['sources'] if urllib.parse.urlparse(s).hostname == host]
            r.update(missingOrDuplicateTargets=[u for u in targets if body.count('<loc>'+u+'</loc>') != 1], remainingSources=[u for u in sources if '<loc>'+u+'</loc>' in body])
            r['passed'] = r['status'] == 200 and not r['missingOrDuplicateTargets'] and not r['remainingSources']
        else:
            r['passed'] = r['status'] == 200
    except Exception as e:
        r.update(error=str(e), passed=False)
    time.sleep(.35)
    return r

if __name__ == '__main__':
    tasks = []
    for f in LEDGER['families']:
        tasks.extend((f['target'], 'canonical', ua, None) for ua in UAS)
        for u in f['sources']:
            source = urllib.parse.urlparse(u)
            target = urllib.parse.urlparse(f['target'])
            prefixes = [''] if f['site']=='costume' else ['', '/en-gb', '/en-ca', '/de-de', '/nl-nl']
            tasks.extend((source.scheme+'://'+source.netloc+prefix+source.path, 'redirect', 'browser', target.scheme+'://'+target.netloc+prefix+target.path) for prefix in prefixes)
    for host in sorted({urllib.parse.urlparse(f['target']).hostname for f in LEDGER['families']}):
        tasks.extend([(f'https://{host}/sitemap.xml', 'sitemap', 'browser', None), (f'https://{host}/robots.txt', 'robots', 'browser', None)])
    tasks.append(('https://madabase.com/', 'health', 'browser', None))
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        for r in executor.map(check, tasks):
            results.append(r)
            (ROOT / 'public-probe.json').write_text(json.dumps(results, indent=2)+'\n')
            if len(results) % 25 == 0: print(json.dumps({'checked': len(results), 'total': len(tasks), 'failed': sum(not x['passed'] for x in results)}), flush=True)
    print(json.dumps({'checked': len(results), 'passed': sum(r['passed'] for r in results), 'failures': [r for r in results if not r['passed']]}, indent=2), flush=True)
    raise SystemExit(1 if any(not r['passed'] for r in results) else 0)
