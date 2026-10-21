"""Read-only canonical and regression checks. No affiliate click or merchant GET."""
import concurrent.futures,csv,datetime,html,json,re,sys,urllib.request,urllib.error
from pathlib import Path
HERE=Path(__file__).resolve().parent
ledger=json.loads((HERE/'release-urls.json').read_text())
protected=list(csv.DictReader((HERE.parent/'acquisition-commerce-audit-2026-10-19/bing-protection-ledger.csv').open()))
mode=sys.argv[1] if len(sys.argv)>1 else 'after'
urls=[r['url'] for r in protected]
if mode!='baseline':urls=list(dict.fromkeys(urls+ledger['newCanonicals']+ledger['enhancedExistingCanonicals']+ledger['productTemplateCanonicals']+ledger['mainCanonicals']))
baseline={r['url']:r for r in json.loads((HERE/'protected-baseline.json').read_text())['rows']} if mode!='baseline' else {}
previous=json.loads((HERE/'public-http.json').read_text()) if mode=='retry' else None
if previous:urls=[r['url'] for r in previous['rows'] if not r['passed']]
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36'
def check(url):
 row={'url':url}
 try:
  try:r=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':UA,'Accept':'text/html,application/xhtml+xml'}),timeout=25)
  except urllib.error.HTTPError as e:r=e
  body=r.read().decode(errors='replace');head=body.split('</head>')[0];canonical=re.search(r'<link[^>]+rel="canonical"[^>]+href="([^"]+)"',head)
  row.update(status=r.code,finalUrl=r.geturl(),canonical=html.unescape(canonical[1]) if canonical else None,noindex=bool(re.search(r'<meta[^>]+name="robots"[^>]+content="[^"]*noindex',head)),cache=r.headers.get('CF-Cache-Status'),age=r.headers.get('Age'))
  issues=[]
  if mode=='baseline':row['passed']=True;return row
  if url in baseline:
   before=baseline[url]
   for key in ['status','finalUrl','canonical','noindex']:
    if row[key]!=before.get(key):issues.append('protected '+key+' changed')
  else:
   if row['status']!=200 or row['finalUrl']!=url or row['canonical']!=('https://madabase.com' if url=='https://madabase.com/' else url) or row['noindex']:issues.append('canonical/status/indexing')
  if url in ledger['decisionGuides']:
   if body.index('<table')>body.index('<article'):issues.append('comparison order')
   if len(re.findall(r'aria-label="[^"]*: country editions"',body))!=1:issues.append('edition menus')
   if 'Buying framework' in body:issues.append('generic framework')
  if url.endswith('/compatibility/mini-pcs') and 'tiny-model-m70q-gen2' not in body:issues.append('missing Gen 2')
  if url=='https://madabase.com/research' and not all(x in body for x in ['What changed','CalDigit','October 20, 2026']):issues.append('old research feed')
  if url.endswith('/household-tech-subscription-checklist') and 'Compare the complete ownership cost' not in body:issues.append('calculator missing')
  if url in ledger['productTemplateCanonicals'] and not url.startswith('https://style.'):
   if 'data-evidence-boundary="true"' not in body:issues.append('evidence boundary')
   if any('>'+x+'</h2>' in body for x in ['What matters most','Current product and listing','Fit decision guide']):issues.append('repeated panels')
  row.update(passed=not issues,issues=issues)
 except Exception as e:row.update(passed=False,error=str(e))
 return row
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:rows=list(executor.map(check,urls))
if previous:
 updated={r['url']:r for r in rows};rows=[updated.get(r['url'],r) for r in previous['rows']]
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'mode':mode,'scope':'Plain public canonical GETs, no click writes or merchant requests','total':len(rows),'passed':sum(r['passed'] for r in rows),'rows':rows}
(HERE/('protected-baseline.json' if mode=='baseline' else 'public-http.json')).write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'total':len(rows),'passed':report['passed'],'failed':[r for r in rows if not r['passed']]},indent=2))
raise SystemExit(0 if report['passed']==len(rows) else 1)
