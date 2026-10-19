"""Browser-shaped plain canonical GETs. Read only; never follows merchant CTAs."""
import concurrent.futures, datetime, json, urllib.request, urllib.error
from pathlib import Path
HERE=Path(__file__).resolve().parent
ledger=json.loads((HERE/'release-urls.json').read_text())
hosts=['madabase.com','homeoffice.madabase.com','network.madabase.com','smarthome.madabase.com','baby.madabase.com','pets.madabase.com','style.madabase.com','costumes.madabase.com']
categories={'homeoffice':['desks','ergonomics','meetings'],'network':['wifi','wired','backup'],'smarthome':['access','cameras','climate','automation'],'baby':['sleep','travel','feeding','gear'],'pets':['feeding','home-care','comfort'],'style':['jewelry','bags','hair','scarves','socks','styling']}
targets={f'https://{h}/':['NAS and Ethernet bottlenecks'] if h=='madabase.com' else ['compact-site-query'] for h in hosts}
for site,slugs in categories.items():
 for slug in slugs: targets[f'https://{site}.madabase.com/categories/{slug}']=['category-browser-heading']
for url in ledger['newCanonicals']+ledger['enhancedExistingCanonicals']:
 targets[url]=['compact-site-query']
 if '/guides/' in url: targets[url]+=['guide-toc','compatibility-checker']
 if '/guides/thinkcentre-' in url: targets[url]+=['parts-reference']
 if '/compatibility/' in url: targets[url]+=['compatibility-checker']
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
def get(url,markers=None,headers=None):
 try:
  request=urllib.request.Request(url,headers={'User-Agent':UA,'Accept':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',**(headers or {})})
  try:r=urllib.request.urlopen(request,timeout=25)
  except urllib.error.HTTPError as error:r=error
  body=r.read().decode(errors='replace');h={k.lower():v for k,v in r.headers.items()}
  return {'status':r.code,'cfCache':h.get('cf-cache-status'),'age':h.get('age'),'cacheControl':h.get('cache-control'),'type':h.get('content-type'),'cfRay':h.get('cf-ray'),'current':all(marker in body for marker in markers or []),'missing':[m for m in markers or [] if m not in body]}
 except Exception as error:return {'status':0,'error':str(error),'current':False}
def pair(item):
 url,markers=item
 return {'url':url,'markers':markers,'passes':[get(url,markers),get(url,markers)]}
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool: rows=list(pool.map(pair,targets.items()))
dynamic=[]
for host in hosts:
 for path,headers in [('/search?q=M720q',{})]:
  url=f'https://{host}{path}';dynamic.append({'url':url,**get(url,headers=headers)})
dynamic.append({'url':'https://homeoffice.madabase.com/api/affiliate-clicks',**get('https://homeoffice.madabase.com/api/affiliate-clicks')})
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'plainCanonicals':True,'browserShapedAccept':True,'rows':rows,'stale':[r['url'] for r in rows if any(p.get('status')!=200 or not p.get('current') for p in r['passes'])],'dynamic':dynamic}
report['unresolvedStale']=[r['url'] for r in rows if r['passes'][-1].get('status')!=200 or not r['passes'][-1].get('current')]
report['passed']=not report['unresolvedStale'] and all(r.get('cfCache') in ['DYNAMIC','BYPASS'] for r in dynamic) and all('private' in r.get('cacheControl','') and 'no-store' in r.get('cacheControl','') for r in dynamic if '/search?' in r['url'])
(HERE/'public-cache.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'plainCanonicalTargets':len(rows),'stale':report['stale'],'dynamicCached':[r['url'] for r in dynamic if r.get('cfCache')=='HIT']},indent=2))
raise SystemExit(0 if report['passed'] else 1)
