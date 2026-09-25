"""Read-only production acceptance. Never follows merchant or /go/ tracking links."""
import concurrent.futures, datetime, html, json, re, time, urllib.error, urllib.parse, urllib.request
from html.parser import HTMLParser
from pathlib import Path
ROOT=Path(__file__).resolve().parent
AUDIT=ROOT.parent/'seo-audit-2026-09-24'
BASE=json.loads((AUDIT/'priority-and-merchant-runtime-final.json').read_text())['results']
LEDGER=json.loads((AUDIT/'page-ledger.json').read_text())
WELLNESS=json.loads((AUDIT/'wellness-runtime-final.json').read_text())
TARGETS={r['url'].rstrip('/'):{'cohort':'priority','expectedTitle':r['title'][0],'expectedDescription':r['description'][0]} for r in BASE}
for r in LEDGER:
 u=r['url'].rstrip('/');p=urllib.parse.urlsplit(u)
 if p.hostname in ['style.madabase.com','costumes.madabase.com'] or p.path in ['', '/']:
  TARGETS.setdefault(u,{'cohort':'discovery' if p.hostname=='costumes.madabase.com' else 'style' if p.hostname=='style.madabase.com' else 'homepage'})
for r in WELLNESS['pages']:TARGETS.setdefault(r['url'].rstrip('/'),{'cohort':'wellness'})
class Page(HTMLParser):
 def __init__(self):
  super().__init__();self.title='';self.intitle=False;self.h1=0;self.canonical=[];self.description=[];self.links=[];self.robots=[];self.jsonld=[];self.inld=False
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if t=='title':self.intitle=True
  if t=='h1':self.h1+=1
  if t=='link' and a.get('rel')=='canonical':self.canonical.append(a.get('href',''))
  if t=='meta' and a.get('name')=='description':self.description.append(a.get('content',''))
  if t=='meta' and a.get('name')=='robots':self.robots.append(a.get('content',''))
  if t=='a':self.links.append(a)
  if t=='script' and a.get('type')=='application/ld+json':self.inld=True;self.jsonld.append('')
 def handle_endtag(self,t):
  if t=='title':self.intitle=False
  if t=='script':self.inld=False
 def handle_data(self,d):
  if self.intitle:self.title+=d
  if self.inld:self.jsonld[-1]+=d

def inspect(item):
 u,expect=item;row={'url':u,**expect,'errors':[]};body=''
 for attempt in range(2):
  try:
   with urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Madabase release QA/1.0'}),timeout=15) as r:
    row.update(status=r.status,finalUrl=r.url,cache=r.headers.get('cf-cache-status'),age=r.headers.get('age'));body=r.read().decode();break
  except Exception as e:
   if attempt:row['errors'].append(type(e).__name__+': '+str(e));return row
 p=Page();p.feed(body)
 row.update(title=p.title,canonical=p.canonical,h1=p.h1,description=p.description,rawQaGuardMarker='madabase:qa-session' in body,paused='data-commerce-paused="true"' in body)
 if row['status']!=200:row['errors'].append('HTTP '+str(row['status']))
 if [x.rstrip('/') for x in p.canonical]!=[u.rstrip('/')]:row['errors'].append('canonical mismatch')
 if p.h1!=1:row['errors'].append('h1 count '+str(p.h1))
 if not p.description or not p.description[0]:row['errors'].append('missing description')
 if any('noindex' in x for x in p.robots):row['errors'].append('noindex')
 for ld in p.jsonld:
  try:json.loads(ld)
  except ValueError:row['errors'].append('invalid JSON-LD')
 if expect.get('expectedTitle') and p.title!=expect['expectedTitle']:row['errors'].append('title differs from validated local release')
 if expect.get('expectedDescription') and p.description!=[expect['expectedDescription']]:row['errors'].append('description differs from validated local release')
 row['internalLinks']=sorted({urllib.parse.urljoin(u,a['href']).split('?')[0].split('#')[0].rstrip('/') for a in p.links if a.get('href') and urllib.parse.urlsplit(urllib.parse.urljoin(u,a['href'])).hostname==urllib.parse.urlsplit(u).hostname})
 row['sponsoredCtas']=[a['href'] for a in p.links if 'sponsored' in a.get('rel','') and a.get('href')]
 if u.endswith('/tools/desk-height-calculator') and not all(x in body for x in ['Seated elbow height from floor','Okin 36']):row['errors'].append('desk repair missing')
 if u.endswith('/categories/lingerie') and ('Catalog reference $' in body or not row['paused']):row['errors'].append('wellness repair missing')
 return row

if __name__=='__main__':
 results=[]
 with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
  for row in pool.map(inspect,TARGETS.items()):
   results.append(row)
   if len(results)%20==0:print(json.dumps({'checked':len(results),'total':len(TARGETS),'failures':sum(bool(r['errors']) for r in results)}),flush=True)
   (ROOT/'public-verification-progress.json').write_text(json.dumps(results,ensure_ascii=False,indent=2)+'\n')
 incoming={link for r in results if not r['errors'] for link in r.get('internalLinks',[]) if link!=r['url']}
 products=[r for r in results if r['url'].startswith('https://costumes.madabase.com/products/')]
 previous=json.loads((AUDIT/'conversion-paths-costume-final.json').read_text())['failureDetails']
 byurl={r['url']:r for r in results}
 costume=[{'url':r['url'],'errors':byurl.get(r['url'],{}).get('errors',['not checked']),'sponsoredCtas':len(byurl.get(r['url'],{}).get('sponsoredCtas',[]))} for r in previous]
 summary={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'total':len(results),'passed':sum(not r['errors'] for r in results),'failures':[{'url':r['url'],'errors':r['errors']} for r in results if r['errors']], 'priorityPages':sum(r['cohort']=='priority' for r in results),'costumeProducts':len(products),'costumeProductsWithIncoming':sum(r['url'] in incoming for r in products),'costumeMissingIncoming':[r['url'] for r in products if r['url'] not in incoming],'costumePurchasePaths':costume,'qaNote':'The QA guard is injected during hydration; validate its behavior in the browser, not by raw HTML substring absence.', 'ordinaryPublicUrls':True,'merchantTrackingLinksFollowed':False}
 (ROOT/'public-verification.json').write_text(json.dumps({'summary':summary,'results':results},ensure_ascii=False,indent=2)+'\n')
 print(json.dumps(summary,ensure_ascii=False),flush=True)
