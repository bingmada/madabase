import concurrent.futures, csv, datetime, html.parser, json, time, urllib.request, urllib.error, urllib.parse
from pathlib import Path
p=Path(__file__).resolve().parent
nas_source='https://network.madabase.com/guides/network-attached-storage-ownership-cost-and-maintenance'
nas_target='https://network.madabase.com/guides/network-attached-storage-vs-alternatives'
expected_redirects={nas_source:nas_target,
 'https://baby.madabase.com/guides/automatic-bottle-washers-setup-and-daily-workflow':'https://baby.madabase.com/guides/bottle-washer-vs-sterilizer-vs-dryer-guide',
 'https://baby.madabase.com/guides/infant-bath-tubs-ownership-cost-and-maintenance':'https://baby.madabase.com/guides/infant-bath-tubs-safety-and-skip-guide'}
class Meta(html.parser.HTMLParser):
 def __init__(self):
  super().__init__(); self.head=False; self.c=[]; self.robots=[]
 def handle_starttag(self,t,a):
  a=dict(a)
  if t=='head': self.head=True
  if t=='link' and a.get('rel')=='canonical': self.c.append({'href':a.get('href'),'inHead':self.head})
  if t=='meta' and a.get('name','').lower() in ['robots','googlebot']: self.robots.append(a.get('content',''))
 def handle_endtag(self,t):
  if t=='head': self.head=False
ua={'browser':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36','googlebot':'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'}
rows=list(csv.DictReader((p/'gsc-server-errors/Table.csv').open()))
active=[r for r in rows if urllib.parse.urlparse(r['URL']).hostname in ['network.madabase.com','smarthome.madabase.com']]
def probe(t):
 row,agent=t; u=row['URL']; r={'url':u,'ua':agent,'reportedLastCrawl':row['Last crawled'],'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 try:
  try: response=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':ua[agent]}),timeout=25)
  except urllib.error.HTTPError as e: response=e
  with response:
   body=response.read(3000000).decode(errors='replace'); m=Meta(); m.feed(body); r.update(status=response.code,finalUrl=response.geturl(),location=response.headers.get('Location'),canonicals=m.c,robots=m.robots,cache=response.headers.get('CF-Cache-Status'),xRobots=response.headers.get('X-Robots-Tag'))
  r['passedCurrentDelivery']=r['status']==200 and r['finalUrl']==u and m.c==[{'href':u,'inHead':True}] and not any('noindex' in s.lower() for s in m.robots+[r['xRobots'] or ''])
  if u in expected_redirects:
   r['expectedRedirectTarget']=expected_redirects[u]
   r['passedCurrentDelivery']=r['status']==308 and urllib.parse.urljoin(u,r['location'] or '')==expected_redirects[u]
  if u.endswith('/sitemap.xml'):
   sources=[s for s in expected_redirects if 'baby.madabase.com' in s]
   targets=[expected_redirects[s] for s in sources]
   r['retiredSourcesAbsent']=all('<loc>'+s+'</loc>' not in body for s in sources)
   r['retainedTargetsPresent']=all('<loc>'+s+'</loc>' in body for s in targets)
   r['passedCurrentDelivery']=r['status']==200 and r['retiredSourcesAbsent'] and r['retainedTargetsPresent']
 except Exception as e: r.update(error=str(e),passedCurrentDelivery=False)
 time.sleep(.4); return r
tasks=[(r,a) for r in active for a in ua]
tasks.extend([({'URL':nas_target,'Last crawled':''},'browser')])
for source,target in expected_redirects.items():
 if source==nas_source: continue
 tasks.extend([({'URL':source,'Last crawled':''},'browser'),({'URL':target,'Last crawled':''},'browser')])
tasks.append(({'URL':'https://baby.madabase.com/sitemap.xml','Last crawled':''},'browser'))
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as ex: results=list(ex.map(probe,tasks))
(p/'public-notification-checks.json').write_text(json.dumps(results,indent=2)+'\n')
print(json.dumps({'reportedActive5xxUrls':len(active),'requests':len(results),'currentlyHealthy':sum(r['passedCurrentDelivery'] for r in results),'failures':[r for r in results if not r['passedCurrentDelivery']]},indent=2))
raise SystemExit(1 if any(not r['passedCurrentDelivery'] for r in results) else 0)
