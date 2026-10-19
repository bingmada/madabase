"""Read-only public delivery and purchase-path sample; never follows merchant CTAs."""
import concurrent.futures
import datetime
import html.parser
import json
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PATHS = {
    'network': ('network', '/guides/deco-be63-vs-be67-vs-be85-buying-guide'),
    'smarthome': ('smarthome', '/best/aqara-u400-vs-u100'),
    'homeoffice': ('homeoffice', '/guides/monitor-arm-clamp-reinforcement-guide'),
    'baby': ('baby', '/guides/ergobaby-omni-breeze-positions-by-age'),
    'pet': ('pets', '/reviews/coway-airmega-mighty2-air-purifier'),
    'style': ('style', '/reviews/loungefly-minnie-mouse-bow-mini-backpack'),
    'costume': ('costumes', '/products/woochie-fx-dark-lord-foam-latex-prosthetic--qtrtcu'),
}

class Page(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(); self.canonical=[]; self.robots=[]; self.ctas=[]; self.head=False
    def handle_starttag(self, tag, attrs):
        a=dict(attrs)
        if tag == 'head': self.head=True
        if tag == 'link' and a.get('rel') == 'canonical':
            self.canonical.append({'url': a.get('href'), 'inHead': self.head})
        if tag == 'meta' and a.get('name','').lower() in ('robots','googlebot','bingbot'):
            self.robots.append(a.get('content',''))
        if tag == 'a' and 'sponsored' in a.get('rel',''):
            self.ctas.append({k:a.get(k) for k in ['href','rel','data-affiliate-link-source','data-first-viewport-affiliate','aria-label']})
    def handle_endtag(self, tag):
        if tag == 'head': self.head=False

def get(item):
    site,host,path=item; url='https://'+host+'.madabase.com'+path
    row={'site':site,'url':url,'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
    for attempt in range(3):
        try:
            start=time.monotonic()
            try:
                response=urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0 (compatible; MadabaseReadOnlyAudit/1.0)'}), timeout=20)
            except urllib.error.HTTPError as e: response=e
            with response:
                body=response.read(3000000).decode('utf-8',errors='replace')
                row.update(status=response.code,finalUrl=response.geturl(),elapsedSeconds=round(time.monotonic()-start,3),xRobotsTag=response.headers.get('X-Robots-Tag'),cache=response.headers.get('CF-Cache-Status'),attempts=attempt+1)
            if path=='/robots.txt': row['body']=body
            else:
                p=Page(); p.feed(body); row.update(canonical=p.canonical,robots=p.robots,sponsoredCtas=p.ctas)
            return row
        except Exception as e: row['error']=str(e)
    return row

if __name__=='__main__':
    items=[(site,host,path) for site,(host,path) in PATHS.items()]
    items += [(site,host,'/robots.txt') for site,(host,_) in PATHS.items()]
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool: rows=list(pool.map(get,items))
    (ROOT/'public-audit.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'requests':len(rows),'statuses':{r['url']:r.get('status',r.get('error')) for r in rows},'merchantClicksGenerated':0},indent=2))
