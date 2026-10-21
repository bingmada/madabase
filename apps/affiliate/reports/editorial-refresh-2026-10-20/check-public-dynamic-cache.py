import concurrent.futures,json,urllib.request,urllib.error,datetime
from pathlib import Path
hosts=['madabase.com','homeoffice.madabase.com','network.madabase.com','smarthome.madabase.com','baby.madabase.com','pets.madabase.com','style.madabase.com','costumes.madabase.com']
urls=['https://'+h+'/search?q=M70q%20Gen%202' for h in hosts]+['https://homeoffice.madabase.com/api/affiliate-clicks']
def check(url):
 try:
  try:r=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Madabase Cache QA/1.0'}),timeout=25)
  except urllib.error.HTTPError as e:r=e
  r.read();c=r.headers.get('Cache-Control','');cf=r.headers.get('CF-Cache-Status');passed=cf in ['DYNAMIC','BYPASS'] and (r.code==405 if '/api/' in url else r.code==200 and 'private' in c and 'no-store' in c)
  return {'url':url,'status':r.code,'cache':cf,'cacheControl':c,'passed':passed}
 except Exception as e:return {'url':url,'error':str(e),'passed':False}
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as ex:rows=list(ex.map(check,urls))
d={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'GET only; no click event created','rows':rows,'passed':all(r['passed'] for r in rows)}
Path('apps/affiliate/reports/editorial-refresh-2026-10-20/public-dynamic-cache.json').write_text(json.dumps(d,indent=2)+'\n');print(json.dumps(d,indent=2));raise SystemExit(0 if d['passed'] else 1)
