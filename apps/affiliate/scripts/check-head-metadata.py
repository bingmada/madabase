"""Check raw HTTP HTML, before JavaScript can relocate streamed metadata.

Input: JSON array of URLs or {url, canonical?, noindex?} objects. The optional
base URL targets an extracted standalone runtime while preserving tenant Host.
"""
import argparse
import concurrent.futures
import datetime
from html.parser import HTMLParser
import json
from pathlib import Path
import time
import urllib.parse
import urllib.request

UAS = {
    'browser': 'Mozilla/5.0 AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36',
    'googlebot': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'inspection': 'Mozilla/5.0 (compatible; Google-InspectionTool/1.0;)',
}


class Metadata(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.in_head = False
        self.in_title = False
        self.head_count = 0
        self.canonicals = []
        self.titles = []
        self.descriptions = []
        self.robots = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'head':
            self.in_head = True
            self.head_count += 1
        elif tag == 'body':
            self.in_head = False
        elif tag == 'title':
            self.in_title = True
            self.titles.append({'text': '', 'inHead': self.in_head})
        elif tag == 'link' and 'canonical' in (attrs.get('rel') or '').lower().split():
            self.canonicals.append({'href': attrs.get('href'), 'inHead': self.in_head})
        elif tag == 'meta':
            name = (attrs.get('name') or '').lower()
            if name in ('description', 'robots'):
                getattr(self, name + 's' if name == 'description' else name).append({
                    'content': attrs.get('content', ''), 'inHead': self.in_head})

    def handle_endtag(self, tag):
        if tag == 'head':
            self.in_head = False
        elif tag == 'title':
            self.in_title = False

    def handle_data(self, text):
        if self.in_title:
            self.titles[-1]['text'] += text


def assess(html, canonical, noindex=False):
    parsed = Metadata()
    parsed.feed(html)
    errors = []
    if parsed.head_count != 1:
        errors.append('Expected one explicit head')
    def normalize_root(url):
        parts = urllib.parse.urlsplit(url or '')
        return urllib.parse.urlunsplit(parts._replace(path=parts.path or '/'))
    if (len(parsed.canonicals) != 1 or not parsed.canonicals[0]['inHead']
            or normalize_root(parsed.canonicals[0]['href']) != normalize_root(canonical)):
        errors.append('Expected one matching canonical inside head')
    for name, key in [('titles', 'text'), ('descriptions', 'content')]:
        values = getattr(parsed, name)
        if len(values) != 1 or not values[0]['inHead'] or not values[0][key].strip():
            errors.append('Expected one nonempty ' + name + ' inside head')
    actual_noindex = any('noindex' in r['content'].lower() for r in parsed.robots)
    if actual_noindex != noindex:
        errors.append('Unexpected robots indexability')
    if any(not r['inHead'] for r in parsed.robots):
        errors.append('Robots metadata outside head')
    return {'errors': errors, 'canonical': parsed.canonicals, 'title': parsed.titles,
            'description': parsed.descriptions, 'robots': parsed.robots}


def probe(item, ua, base_url=None):
    if isinstance(item, str):
        item = {'url': item}
    url = item['url']
    parts = urllib.parse.urlsplit(url)
    target = base_url.rstrip('/') + parts.path + ('?' + parts.query if parts.query else '') if base_url else url
    headers = {'User-Agent': UAS[ua], 'Accept': 'text/html'}
    if base_url:
        headers.update({'Host': parts.netloc, 'X-Forwarded-Host': parts.netloc})
    result = {'url': url, 'ua': ua, 'checkedAt': datetime.datetime.now(datetime.timezone.utc).isoformat()}
    started = time.monotonic()
    try:
        with urllib.request.urlopen(urllib.request.Request(target, headers=headers), timeout=20) as response:
            result.update(status=response.status, cache=response.headers.get('cf-cache-status'))
            data = response.read(4_000_001)
            result.update(assess(data.decode(errors='replace'), item.get('canonical', url), item.get('noindex', False)))
            if len(data) > 4_000_000:
                result['errors'].append('Response exceeds validation size bound')
            if response.status != 200 or response.url != target:
                result['errors'].append('Unexpected status or redirect')
    except Exception as exc:
        result['errors'] = [str(exc)]
    result['elapsedMs'] = round((time.monotonic() - started) * 1000)
    return result


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--urls', type=Path, required=True)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--base-url')
    parser.add_argument('--uas', default=','.join(UAS))
    args = parser.parse_args()
    uas = args.uas.split(',')
    if any(ua not in UAS for ua in uas):
        parser.error('Unknown user agent')
    items = json.loads(args.urls.read_text())
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
        for result in pool.map(lambda pair: probe(*pair, args.base_url), [(item, ua) for item in items for ua in uas]):
            results.append(result)
            if len(results) % 100 == 0:
                print(json.dumps({'checked': len(results), 'failed': sum(bool(r['errors']) for r in results)}), flush=True)
    args.output.write_text(json.dumps(results, indent=2) + '\n')
    failures = [r for r in results if r['errors']]
    print(json.dumps({'checked': len(results), 'failed': len(failures), 'failures': failures[:10]}), flush=True)
    raise SystemExit(bool(failures))


if __name__ == '__main__':
    main()
