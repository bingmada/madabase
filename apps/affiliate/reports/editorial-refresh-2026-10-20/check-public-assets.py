"""Read-only release check: retained and current content-hashed JS/CSS."""
import concurrent.futures
import datetime
import hashlib
import json
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
OLD = {
    'main': ['chunks/app/page-304f09475330e37c.js', 'css/8104babcd8f5b51e.css'],
    'affiliate': ['chunks/app/page-9e27dc1c0481df61.js', 'css/be0646b6f9cfee30.css'],
}
HOSTS = {'main': ['madabase.com'], 'affiliate': [f'{s}.madabase.com' for s in ['homeoffice', 'network', 'smarthome', 'baby', 'pets', 'style', 'costumes']]}
targets = []
for app, hosts in HOSTS.items():
    static = ROOT / 'apps' / app / '.release/runtime/apps' / app / '.next-release/static'
    paths = [(p, 'retained', None) for p in OLD[app]]
    for pattern in ['chunks/app/page-*.js', 'css/*.css']:
        for p in static.glob(pattern):
            paths.append((str(p.relative_to(static)), 'current', hashlib.sha256(p.read_bytes()).hexdigest()))
    for host in hosts:
        for path, generation, sha in paths:
            targets.append((f'https://{host}/_next/static/{path}', generation, sha))

def check(target):
    url, generation, expected = target
    row = {'url': url, 'generation': generation, 'expectedSha256': expected}
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Madabase-Release-Asset-QA/1.0'}), timeout=25) as response:
            body = response.read()
            actual = hashlib.sha256(body).hexdigest()
            mime = response.headers.get('content-type', '')
            row.update(status=response.status, bytes=len(body), contentType=mime, sha256=actual)
            row['passed'] = response.status == 200 and len(body) > 0 and ('javascript' in mime if url.endswith('.js') else 'text/css' in mime) and (expected is None or expected == actual)
    except Exception as error:
        row.update(passed=False, error=str(error))
    return row

with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
    rows = list(pool.map(check, targets))
report = {'checkedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'rows': rows, 'passed': all(row['passed'] for row in rows)}
(HERE / 'public-assets.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({'targets': len(rows), 'passed': sum(row['passed'] for row in rows), 'failed': [row for row in rows if not row['passed']]}, indent=2))
raise SystemExit(0 if report['passed'] else 1)
