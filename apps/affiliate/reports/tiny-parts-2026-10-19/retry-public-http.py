"""Retry only transport failures from the completed public regression run."""
import ast, datetime, json, types, urllib.request, urllib.parse, urllib.error, re, html
from pathlib import Path

HERE = Path(__file__).resolve().parent
original = json.loads((HERE / 'public-http.json').read_text())
source = (HERE.parent / 'compatibility-search-2026-10-19/check-http.py').read_text()
# Reuse the exact reviewed request/parser, without executing its full URL sweep.
namespace = dict(urllib=__import__('urllib'), re=re, html=html,
                 args=types.SimpleNamespace(public=True, main='', affiliate=''))
tree = ast.parse(source)
for node in tree.body:
    if isinstance(node, ast.ClassDef) and node.name == 'NoRedirect':
        exec(ast.get_source_segment(source, node), namespace)
namespace['opener'] = urllib.request.build_opener(namespace['NoRedirect'])
for node in tree.body:
    if isinstance(node, ast.FunctionDef) and node.name == 'request':
        exec(ast.get_source_segment(source, node), namespace)

targets = [r['url'] for r in original['rows'] if r['status'] == 0]
assert targets and all(f['url'] in targets for f in original['failures']), 'A content failure requires separate investigation'
retries = []
for url in targets:
    row = namespace['request'](url)
    if row['status'] == 0:
        row = namespace['request'](url)
    row.pop('body', None)
    retries.append(row)
by_url = {r['url']: r for r in retries}
failures = []
for failure in original['failures']:
    actual = by_url[failure['url']].get(failure['check'])
    if actual != failure.get('expected'):
        failures.append({**failure, 'actual': actual})
report = dict(original)
report.update(checkedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),
              failures=failures, transportRetriedUrls=targets,
              rows=[by_url.get(r['url'], r) for r in original['rows']])
(HERE / 'public-http-retries.json').write_text(json.dumps({'rows': retries, 'failures': failures}, indent=2) + '\n')
(HERE / 'public-http-final.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps({'total': report['total'], 'transportRetried': len(targets), 'failures': failures, 'environmentDependent': report['environmentDependent']}, indent=2))
raise SystemExit(bool(failures))
