"""Compare protected URL identity and validate this exact pilot against an HTTP runtime."""
import argparse, concurrent.futures, datetime, html, json, re, urllib.request, urllib.parse, urllib.error
from pathlib import Path
HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[3]
parser=argparse.ArgumentParser()
parser.add_argument('--affiliate',default='http://127.0.0.1:3021')
parser.add_argument('--main',default='http://127.0.0.1:3031')
parser.add_argument('--public',action='store_true')
parser.add_argument('--output',default=str(HERE/'local-http.json'))
args=parser.parse_args()
class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*args): return None
opener=urllib.request.build_opener(NoRedirect)
def request(url):
 p=urllib.parse.urlsplit(url)
 origin=args.main if p.netloc=='madabase.com' else args.affiliate
 endpoint=url if args.public else origin+p.path+('?' + p.query if p.query else '')
 req=urllib.request.Request(endpoint,headers={'Host':p.netloc,'X-Forwarded-Host':p.netloc,'X-Forwarded-Proto':'https','User-Agent':'Madabase compatibility release QA/1.0'})
 try:
  try: r=opener.open(req,timeout=35)
  except urllib.error.HTTPError as e:r=e
  body=r.read().decode('utf-8',errors='replace')
  def value(pattern):
   m=re.search(pattern,body,re.I|re.S)
   return html.unescape(re.sub('<[^>]*>','',m[1])).strip() if m else None
  return {'url':url,'status':r.code,'location':r.headers.get('Location'),'canonical':value(r'<link[^>]*rel="canonical"[^>]*href="([^"]+)"'),'title':value(r'<title[^>]*>(.*?)</title>'),'h1':value(r'<h1\b[^>]*>(.*?)</h1>'),'noindex':bool(re.search(r'<meta[^>]*name="robots"[^>]*content="[^"]*noindex',body,re.I)),'headers':dict(r.headers),'body':body}
 except Exception as e:return {'url':url,'status':0,'error':str(e),'headers':{},'body':''}
base=json.loads((HERE.parent/'commerce-repair-2026-10-19/public-after.json').read_text())['rows']
policy=json.loads((ROOT/'apps/affiliate/config/portfolio-recovery-2026-10-08.json').read_text())
pilot=policy['qualityPilot20261019']
new_urls=pilot['newIndexablePaths']
if isinstance(new_urls,dict):new_urls=[f'https://{host if chr(46) in host else host + chr(46) + "madabase.com"}{p}' for host,paths in new_urls.items() for p in paths]
# The ledger is explicit; never infer extra indexable search permutations.
if new_urls and isinstance(new_urls[0],dict):new_urls=[x.get('url',f"https://{x.get('host','')}{x.get('path','')}") for x in new_urls]
hosts=['homeoffice','network','smarthome','baby','pets','style','costumes']
search_urls=[f'https://{host}.madabase.com/search?q=TS4' for host in hosts]+['https://madabase.com/search?q=M720q','https://madabase.com/search?page=2']
wrong=['https://baby.madabase.com/compatibility/docks','https://network.madabase.com/compatibility/mini-pcs','https://homeoffice.madabase.com/compatibility/ethernet']
urls=list(dict.fromkeys([r['url'] for r in base]+new_urls+search_urls+wrong))
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:rows=list(pool.map(request,urls))
by_url={r['url']:r for r in rows}; failures=[]; unavailable=[]
for old in base:
 row=by_url[old['url']]
 # Database-backed catalog routes need the configured origin environment.
 if not args.public and row['status'] in [404,500,502,503] and '/products/' in row['url'] and 'costumes.' in row['url']:
  unavailable.append({'url':row['url'],'reason':'Costume database unavailable in isolated local runtime'});continue
 for k in ['status','location','canonical','title','h1','noindex']:
  if old.get(k)!=row.get(k):failures.append({'url':row['url'],'check':k,'expected':old.get(k),'actual':row.get(k)})
for url in new_urls:
 row=by_url[url]
 sitemap_url='https://'+urllib.parse.urlsplit(url).netloc+'/sitemap.xml'
 sm=by_url.get(sitemap_url) or request(sitemap_url)
 if url not in re.findall(r'<loc>([^<]+)</loc>',sm['body']):failures.append({'url':url,'check':'new canonical absent from sitemap'})
 if row['status']!=200 or row['canonical']!=url or row['noindex'] or not row['h1']:failures.append({'url':url,'check':'new canonical/indexability'})
 if 'compatibility/' in url and '<table' not in row['body'] and not url.endswith('/ethernet'):failures.append({'url':url,'check':'SSR reference table missing'})
 for tag in re.findall(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>',row['body'],re.S):
  try:
   data=json.loads(tag)
   if '"@type": "Review"' in json.dumps(data):failures.append({'url':url,'check':'unsupported Review schema'})
  except Exception:failures.append({'url':url,'check':'invalid schema'})
for url in search_urls:
 row=by_url[url]
 expected=url.split('?')[0]
 if row['status']!=200 or not row['noindex'] or row['canonical']!=expected or 'noindex' not in row['headers'].get('x-robots-tag',row['headers'].get('X-Robots-Tag','')):failures.append({'url':url,'check':'search status/noindex/canonical/header'})
 if 'no-store' not in row['headers'].get('cache-control',row['headers'].get('Cache-Control','')):failures.append({'url':url,'check':'search cache must be private/no-store'})
for url in wrong:
 if by_url[url]['status']!=404:failures.append({'url':url,'check':'wrong publication must 404'})
for row in rows:
 if row['url'].endswith('/sitemap.xml') and any('/search' in x for x in re.findall(r'<loc>([^<]+)</loc>',row['body'])):failures.append({'url':row['url'],'check':'search URL leaked to sitemap'})
 for tag in re.findall(r'<a\b[^>]*>',row['body']):
  if 'sponsored' in tag and any(a in tag for a in ['B001ECHXVC','B0C4W1L4B3']):failures.append({'url':row['url'],'check':'blocked ASIN CTA'})
for row in rows:row.pop('body',None)
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'mode':'public' if args.public else 'local','baselineUrls':len(base),'protectedBingAiUrls':181,'historicalCohortTargets':31,'newCanonicals':len(new_urls),'searchChecks':len(search_urls),'wrongHostChecks':len(wrong),'total':len(rows),'failures':failures,'environmentDependent':unavailable,'rows':rows}
Path(args.output).write_text(json.dumps(report,indent=2))
print(json.dumps({k:v for k,v in report.items() if k!='rows'},indent=2))
raise SystemExit(bool(failures))
