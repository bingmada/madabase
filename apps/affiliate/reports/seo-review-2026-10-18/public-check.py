import concurrent.futures,datetime,html.parser,json,time,urllib.request,urllib.error
from pathlib import Path
ROOT=Path(__file__).resolve().parent
previous=json.loads((ROOT.parent/'seo-review-2026-10-16/index-inspections.json').read_text())
urls=[r['url'] for r in previous if r['currentDelivery']==200]+['https://smarthome.madabase.com/sitemap.xml']
class Head(html.parser.HTMLParser):
 def __init__(self):
  super().__init__(); self.head=False;self.canonicals=[];self.robots=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='head':self.head=True
  if tag=='link' and a.get('rel')=='canonical':self.canonicals.append({'href':a.get('href'),'inHead':self.head})
  if tag=='meta' and a.get('name','').lower() in ['robots','googlebot']:self.robots.append(a.get('content',''))
 def handle_endtag(self,tag):
  if tag=='head':self.head=False

def check(url):
 r={'url':url,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 try:
  try: response=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36'}),timeout=25)
  except urllib.error.HTTPError as e:response=e
  with response:
   body=response.read(3000000).decode(errors='replace');r.update(status=response.code,finalUrl=response.geturl(),cache=response.headers.get('CF-Cache-Status'),xRobotsTag=response.headers.get('X-Robots-Tag'))
  if url.endswith('sitemap.xml'):
   r['containsRetainedSmarthomeUrls']=all('<loc>'+u+'</loc>' in body for u in urls if u.startswith('https://smarthome.madabase.com/guides/'))
   r['passed']=r['status']==200 and r['containsRetainedSmarthomeUrls']
  else:
   h=Head();h.feed(body);r.update(canonicals=h.canonicals,robots=h.robots)
   r['passed']=r['status']==200 and r['finalUrl']==url and h.canonicals==[{'href':url,'inHead':True}] and not any('noindex' in v.lower() for v in h.robots+[r['xRobotsTag'] or ''])
 except Exception as e:r.update(error=str(e),passed=False)
 time.sleep(.4);return r
if __name__=='__main__':
 with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:results=list(executor.map(check,urls))
 (ROOT/'public-checks.json').write_text(json.dumps(results,indent=2)+'\n')
 print(json.dumps({'checked':len(results),'passed':sum(r['passed'] for r in results),'failures':[r for r in results if not r['passed']]},indent=2))
 raise SystemExit(1 if any(not r['passed'] for r in results) else 0)
