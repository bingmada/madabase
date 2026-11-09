"""Read-only release acceptance over actual public URLs; no analytics or merchant clicks."""
import argparse, concurrent.futures, hashlib, html, json, re, time, urllib.error, urllib.request
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path

HERE = Path(__file__).resolve().parent

class Page(HTMLParser):
 def __init__(self):
  super().__init__(); self.h1=0; self.ids=[]; self.canonical=[]; self.robots=[]; self.continuations=0; self.head=False; self.canonical_in_head=False; self.links=[]; self.assets=set(); self.inputs=[]; self.anchor=None; self.order=0; self.decision=None; self.first_merchant=None
 def handle_starttag(self,tag,attrs):
  a=dict(attrs); self.order+=1
  if tag=='head': self.head=True
  if tag=='h1': self.h1+=1
  if a.get('id'): self.ids.append(a['id'])
  if tag=='link' and a.get('rel')=='canonical': self.canonical.append(a.get('href')); self.canonical_in_head=self.head
  if tag=='meta' and a.get('name')=='robots': self.robots.append(a.get('content',''))
  if 'data-network-continuation' in a: self.continuations+=1
  if 'data-decision-first-comparison' in a: self.decision=self.order
  if tag=='a':
   self.anchor={**a,'text':''}; self.links.append(self.anchor)
   if 'data-commerce-product' in a and self.first_merchant is None: self.first_merchant=self.order
  if tag=='input': self.inputs.append(a)
  asset=a.get('src') if tag=='script' else a.get('href') if tag=='link' else None
  if asset and asset.startswith('/_next/static/'): self.assets.add(asset)
 def handle_endtag(self,tag):
  if tag=='head': self.head=False
  if tag=='a': self.anchor=None
 def handle_data(self,value):
  if self.anchor is not None: self.anchor['text']+=value

def inspect_html(target,body,expected_build,purchases):
 page=Page(); page.feed(body); errors=[]; path=target['path']; host=target.get('host','network.madabase.com')
 expected='https://'+host+path.split('?')[0]
 if page.h1!=1: errors.append('h1-count')
 if len(page.canonical)!=1 or page.canonical[0].rstrip('/')!=expected.rstrip('/'): errors.append('canonical')
 if not page.canonical_in_head: errors.append('canonical-not-in-head')
 if expected_build not in body: errors.append('build-identity')
 if target.get('network',True) and 'network-site' not in body: errors.append('network-chrome')
 if any(n>1 for n in Counter(page.ids).values()): errors.append('duplicate-id')
 if target.get('requiresContinuation') and page.continuations!=1: errors.append('continuation-count')
 if target.get('kind')=='comparison' and (page.decision is None or page.first_merchant is not None and page.decision>=page.first_merchant): errors.append('purchase-before-decision')
 if 'indexable' in target and any('noindex' in r for r in page.robots)==target['indexable']: errors.append('regional-index-state')
 for marker in target.get('markers',[]):
  if marker not in html.unescape(body): errors.append('marker:'+marker)
 if target.get('network',True) and path in ['/tools/mesh-node-and-backhaul-planner','/tools/wifi-coverage-estimator']:
  numbers=[a for a in page.inputs if a.get('type')=='number']
  if len(numbers)!=2 or any('disabled' not in a for a in numbers): errors.append('planner-editable-before-ready')
 merchants=[]
 if target.get('network',True):
  for a in page.links:
   slug=a.get('data-commerce-product')
   if not slug: continue
   merchant=a.get('data-commerce-merchant'); href=a.get('href',''); matches=[r for r in purchases if r['slug']==slug and any(o['merchant']==merchant for o in r['offers'])]
   if not matches: errors.append('unregistered-purchase:'+slug)
   asin=re.search(r'/dp/([A-Z0-9]{10})(?:[/?]|$)',href,re.I)
   if 'amazon.com/' in href:
    if not asin or not any((r.get('asin') or '').upper()==asin[1].upper() for r in matches): errors.append('purchase-asin:'+slug)
    if 'tag=madanetwork-20' not in href: errors.append('tracking-id:'+slug)
    if 'Amazon US' not in a['text']: errors.append('storefront-label:'+slug)
   if not {'sponsored','nofollow'}.issubset(set(a.get('rel','').split())): errors.append('purchase-rel:'+slug)
   merchants.append({'slug':slug,'merchant':merchant,'href':href,'position':a.get('data-commerce-position')})
 return {'passed':not errors,'errors':errors,'canonical':page.canonical,'canonicalInHead':page.canonical_in_head,'robots':page.robots,'merchantLinks':merchants,'assets':sorted(page.assets)}

def main():
 parser=argparse.ArgumentParser(); parser.add_argument('--base'); parser.add_argument('--output',default='/var/tmp/madabase-network-readiness-20261109/public-verification.json'); args=parser.parse_args()
 artifacts=json.loads((HERE/'artifact.json').read_text())['artifacts']; purchases=json.loads((HERE/'public-purchases.json').read_text()); targets=json.loads((HERE/'public-targets.json').read_text())
 targets=[dict(t,host='network.madabase.com',app='affiliate',network=True) for t in targets]
 ledger=json.loads((HERE/'release-urls.json').read_text())
 for app in ['main','affiliate']:
  targets.extend(dict(t,app=app,network=False) for t in ledger[app+'Checks'] if t['host']!='network.madabase.com' and (not args.base or app!='main'))
 opener=urllib.request.build_opener(urllib.request.ProxyHandler({})) if args.base else urllib.request.build_opener()
 def fetch(url,host):
  request=urllib.request.Request(url,headers={'User-Agent':'Madabase release QA/1.0','Host':host,'X-Forwarded-Host':host,'X-Forwarded-Proto':'https'})
  with opener.open(request,timeout=20) as response: return response.status,response.read(),{k:v for k,v in response.headers.items() if k.lower() in ['cf-cache-status','age','content-type','cache-control']}
 def check(target):
  url=(args.base or 'https://'+target['host'])+target['path']; attempts=[]
  for attempt in range(2):
   try:
    status,raw,headers=fetch(url,target['host']); result=inspect_html(target,raw.decode(),artifacts[target['app']]['buildId'],purchases)
    return {**target,**result,'status':status,'headers':headers,'sha256':hashlib.sha256(raw).hexdigest(),'transportRetries':attempts}
   except Exception as error: attempts.append(type(error).__name__+': '+str(error))
  return {**target,'passed':False,'errors':attempts,'transportRetries':attempts[:-1]}
 rows=[]
 with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
  for row in pool.map(check,targets):
   rows.append(row)
   if len(rows)%100==0: print(json.dumps({'checked':len(rows),'total':len(targets),'failed':sum(not r['passed'] for r in rows)}),flush=True)
 assets=[]; asset_manifest=json.loads((HERE/'public-assets.json').read_text()); asset_expectations={**asset_manifest['current'],**(asset_manifest['retained'] if not args.base else {})}
 for path,expected_sha in asset_expectations.items():
  try:
   status,raw,headers=fetch((args.base or 'https://network.madabase.com')+path,'network.madabase.com'); actual=hashlib.sha256(raw).hexdigest()
   assets.append({'path':path,'status':status,'sha256':actual,'passed':status==200 and actual==expected_sha,'headers':headers})
  except Exception as error: assets.append({'path':path,'passed':False,'error':str(error)})
 sitemaps=[]
 if not args.base:
  for host in ['madabase.com','network.madabase.com','homeoffice.madabase.com','smarthome.madabase.com','baby.madabase.com','pets.madabase.com']:
   try:
    status,raw,headers=fetch('https://'+host+'/sitemap.xml',host); body=raw.decode(); valid=status==200 and '<loc>' in body and '/search' not in body
    if host=='network.madabase.com': valid=valid and 'trendnet-teg-s750' not in body
    sitemaps.append({'host':host,'status':status,'urls':body.count('<loc>'),'passed':valid,'sha256':hashlib.sha256(raw).hexdigest(),'headers':headers})
   except Exception as error: sitemaps.append({'host':host,'passed':False,'error':str(error)})
 output={'checkedAt':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),'builds':artifacts,'pages':len(rows),'networkPages':sum(r.get('network',False) for r in rows),'passed':all(r['passed'] for r in rows+assets+sitemaps),'rows':rows,'assets':assets,'sitemaps':sitemaps}
 destination=Path(args.output); destination.parent.mkdir(parents=True,exist_ok=True); destination.write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'passed':output['passed'],'pages':len(rows),'networkPages':output['networkPages'],'assets':len(assets),'sitemaps':len(sitemaps),'output':str(destination)}),flush=True)
 for row in rows+assets+sitemaps:
  if not row['passed']: print(json.dumps(row,ensure_ascii=False),flush=True)
 raise SystemExit(0 if output['passed'] else 1)

if __name__=='__main__': main()
