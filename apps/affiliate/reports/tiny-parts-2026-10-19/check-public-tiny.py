"""Public content/search/cache checks. Never follows a commissioned merchant link."""
import argparse,datetime,json,re,urllib.request,urllib.error
from pathlib import Path
HERE=Path(__file__).resolve().parent
parser=argparse.ArgumentParser();parser.add_argument('--phase',default='final');parser.add_argument('--retry-failed-canonicals',action='store_true');args=parser.parse_args()
previous=json.loads((HERE/f'public-tiny-{args.phase}.json').read_text()) if args.retry_failed_canonicals else None
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36'
def get(url):
 try:
  req=urllib.request.Request(url,headers={'User-Agent':UA,'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'})
  try:r=urllib.request.urlopen(req,timeout=25)
  except urllib.error.HTTPError as error:r=error
  with r:
   body=r.read().decode(errors='replace');h={k.lower():v for k,v in r.headers.items()}
   return {'status':r.code,'cache':h.get('cf-cache-status'),'age':h.get('age'),'cacheControl':h.get('cache-control'),'cfRay':h.get('cf-ray'),'body':body}
 except Exception as error:return {'status':0,'error':str(error),'body':''}
css=[p.name for p in (HERE.parents[3]/'apps/affiliate/.release/runtime/apps/affiliate/.next-release/static/css').glob('*.css')]
urls=json.loads((HERE/'release-urls.json').read_text())['enhancedExistingCanonicals'];rows=[]
if previous:urls=[r['url'] for r in previous['changedCanonicals'] if not r['passed']]
for url in urls:
 markers=['tiny-fru-check','tiny-fru-reference','00XL211','01MN886',*css]
 if url.endswith('/mini-pcs'):markers+=['tiny-model-m710q','tiny-model-m910q','tiny-model-m70q-gen3','tiny-model-m90q-gen3','5M11C16880']
 passes=[]
 for attempt in range(2):
  row=get(url);body=row.pop('body');row.update(current=all(m in body for m in markers),missing=[m for m in markers if m not in body],unguardedKitLink=bool(re.search(r'<a[^>]+href="[^\"]*amazon\.com/dp/B0F2DYGPDQ',body)),canonical=f'rel="canonical" href="{url}"' in body);passes.append(row)
 rows.append({'url':url,'passes':passes,'passed':passes[-1].get('status')==200 and passes[-1]['current'] and passes[-1]['canonical'] and not any(p['unguardedKitLink'] for p in passes) and passes[-1]['cache']=='HIT'})
search=[]
for host in ([] if previous else ['madabase.com','homeoffice.madabase.com']):
 for query,anchor in [('M710q RAM 32GB','m710q'),('M910q SATA FRU','m910q'),('M70q Gen 3 RAM 64GB','m70q-gen3'),('M90q Gen 3 DDR5 64GB','m90q-gen3')]:
  from urllib.parse import quote
  url='https://'+host+'/search?q='+quote(query);row=get(url);body=row.pop('body');row.update(url=url,query=query,passed=row['status']==200 and f'/compatibility/mini-pcs#tiny-model-{anchor}' in body and 'noindex' in body and 'no-store' in row.get('cacheControl','') and row.get('cache') in ['DYNAMIC','BYPASS']);search.append(row)
if previous:
 for row in rows:row['passes']=[*next(r['passes'] for r in previous['changedCanonicals'] if r['url']==row['url']),*row['passes']]
 retried={r['url']:r for r in rows};rows=[retried.get(r['url'],r) for r in previous['changedCanonicals']];search=previous['search']
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'phase':args.phase,'changedCanonicals':rows,'search':search,'passed':all(r['passed'] for r in rows+search)}
(HERE/f'public-tiny-{args.phase}.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'phase':args.phase,'currentCanonicalCount':sum(r['passed'] for r in rows),'searchChecksPassed':sum(r['passed'] for r in search),'failed':[r['url'] for r in rows+search if not r['passed']]},indent=2))
raise SystemExit(0 if report['passed'] else 1)
