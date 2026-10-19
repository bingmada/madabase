"""Join saved observations and runtime inventories; does not access accounts or change sites."""
import collections
import csv
import datetime
import json
import re
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
RAW = ROOT/'raw'
ACTIVE = {'network','smarthome','homeoffice','baby','pets','style','costumes'}

def read_csv(name):
    return list(csv.DictReader((RAW/name).open(encoding='utf-8-sig')))

def write_csv(name, rows, fields):
    with (ROOT/name).open('w',newline='') as stream:
        writer=csv.DictWriter(stream,fieldnames=fields,extrasaction='ignore',lineterminator='\n')
        writer.writeheader(); writer.writerows(rows)

def dump(name, data):
    (ROOT/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')

def main():
    obs=json.loads((ROOT/'observations.json').read_text())
    bing=read_csv('bing-pages-30d.csv'); ai=read_csv('bing-ai-pages-30d.csv')
    assert len(bing)==166 and len(ai)==85
    by_host={}
    protected={}
    for row in bing:
        url=row['Page']; host=urlparse(url).hostname
        if host.split('.')[0] not in ACTIVE: continue
        agg=by_host.setdefault(host,collections.Counter())
        agg['bing30dImpressions']+=int(row['Impressions']); agg['bing30dClicks']+=int(row['Clicks'])
        protected.setdefault(url,{'url':url,'bing30dImpressions':0,'bing30dClicks':0,'bingAi30dSampleCitations':0})
        protected[url].update(bing30dImpressions=int(row['Impressions']),bing30dClicks=int(row['Clicks']))
    for row in ai:
        url=row['Page']; host=urlparse(url).hostname
        if host.split('.')[0] not in ACTIVE: continue
        by_host.setdefault(host,collections.Counter())['bingAi30dSampleCitations']+=int(row['Citations'])
        protected.setdefault(url,{'url':url,'bing30dImpressions':0,'bing30dClicks':0,'bingAi30dSampleCitations':0})
        protected[url]['bingAi30dSampleCitations']+=int(row['Citations'])
    rows=[]
    click_sessions=collections.Counter(x['site'] for x in obs['clarity']['affiliateClickSessionLandingPages'])
    for row in obs['gsc']['affiliatePageAggregation']:
        rows.append({**row,**by_host.get(row['host'],{}),'clarity30dAffiliateClickSessions':click_sessions[row['site']]})
    fields=list(rows[0])
    for row in rows:
        for field in ['bing30dImpressions','bing30dClicks','bingAi30dSampleCitations']: row.setdefault(field,0)
    write_csv('seven-site-funnel.csv',rows,fields)
    write_csv('bing-protection-ledger.csv',sorted(protected.values(),key=lambda x:(-x['bing30dClicks'],-x['bingAi30dSampleCitations'])),['url','bing30dImpressions','bing30dClicks','bingAi30dSampleCitations'])

    core=json.loads((RAW/'content-inventory.json').read_text())
    family=json.loads((RAW/'published-family-products.json').read_text())
    checker=json.loads((RAW/'product-inventory.json').read_text())
    blocks=json.loads((ROOT.parent.parent/'config/amazon-offer-blocks.json').read_text())['blocks']
    blocked={(x['site'],x['slug'],x['asin']) for x in blocks}
    check_keys={(x['site'],x['expectedAsin']) for x in checker}
    products=[]
    for item in core:
        if item['kind']!='product': continue
        if not any('amazon' in offer['merchant'].lower() for offer in item.get('offers',[])): continue
        asin=item.get('asin') or item.get('specs',{}).get('ASIN')
        if not asin:
            for offer in item.get('offers',[]):
                match=re.search(r'/(?:dp|gp/product)/([A-Z0-9]{10})(?:[/?]|$)',offer['url'],re.I)
                if match:
                    asin=match.group(1).upper(); break
        assert asin and re.fullmatch(r'[A-Z0-9]{10}',asin),item['slug']
        products.append({'site':item['site'],'asin':asin,'slug':item['slug'],'name':item['name'],'source':'core','catalogVerifiedAt':'','pageUpdatedAt':item.get('updatedAt',''),'inOldChecker':(item['site'],asin) in check_keys})
    for item in family:
        slug='family-'+item['familySlug']
        if (item['site'],slug,item['asin']) in blocked: continue
        products.append({'site':item['site'],'asin':item['asin'],'slug':slug,'name':item['title'],'source':'family','catalogVerifiedAt':item['verifiedAt'],'pageUpdatedAt':'','inOldChecker':(item['site'],item['asin']) in check_keys})
    live_keys={(x['site'],x['asin']) for x in products}
    missing=live_keys-check_keys
    assert len(products)==505 and len(live_keys)==504 and len(missing)==210
    write_csv('published-amazon-offers.csv',products,list(products[0]))
    write_csv('checker-coverage-gaps.csv',[x for x in products if not x['inOldChecker']],list(products[0]))
    catalog={
        'scope':'Runtime published core products with Amazon offers plus published family catalog minus exact configured offer blocks; site+ASIN is identity unit. Source-parser checker is a different, incomplete scope.',
        'publishedContentRecords':len(core),'publishedGuides':sum(x['kind']=='guide' for x in core),
        'familyGuides':sum(x['kind']=='guide' and bool(x.get('familySlug')) for x in core),
        'coreProductEvidencePages':sum(x['kind']=='product' for x in core),
        'familyCatalogTotal':len(family),'familyCatalogActive':sum(x['source']=='family' for x in products),
        'familyVerificationDateRange':['2026-08-09','2026-08-13'],'verificationAgeDays':[67,71],
        'amazonOfferRecords':len(products),'uniqueSiteAsins':len(live_keys),
        'oldCheckerRecords':len(checker),'oldCheckerCoveredRuntimeIdentities':len(live_keys&check_keys),
        'missingRuntimeIdentities':len(missing),'checkerEntriesOutsideCurrentRuntimeOffers':len(check_keys-live_keys),
        'missingBySite':dict(collections.Counter(site for site,asin in missing)),
        'formatCheckScope':'294/294 source-parser URL/tag checks passed. This is neither complete runtime-catalog coverage nor stock verification.',
        'countryMapping':'294 US entries in old Creators inventory; gb/ca/de/nl each zero exact local mappings and partner-tag configurations in that inventory. Current local-country offers must not be claimed verified from this result.',
        'doNotInfer':'A page update timestamp does not refresh product identity, availability or manufacturer-generation evidence.'
    }
    dump('catalog-audit.json',catalog)
    write_csv('merchant-sample.csv',obs['merchantSample']['rows'],['site','asin','product','availability','decision'])
    keys=['kind','site','slug','title','name','updatedAt','familySlug','asin','evidence']
    compact=[{k:x[k] for k in keys if k in x} for x in core]
    dump('published-content-inventory.json',compact)
    # Full source content is reproducible from the repository; retain compact evidence, not an 8 MB duplicate.
    (RAW/'content-inventory.json').unlink()
    totals={k:sum(int(row.get(k,0)) for row in rows) for k in ['latest24hImpressions','oct13SnapshotImpressions','current7dImpressions','previous7dImpressions','current28dClicks','previous28dClicks','current28dImpressions','previous28dImpressions','bing30dImpressions','bing30dClicks','bingAi30dSampleCitations']}
    assert totals['latest24hImpressions']==28 and totals['current7dImpressions']==124 and totals['bing30dClicks']==27
    dump('joined-summary.json',{'sevenSites':rows,'totals':totals,'protectedBingUrls':len(protected),'catalog':catalog,'limitations':obs['boundaries']})
    print(json.dumps({'totals':totals,'protectedBingUrls':len(protected),'runtimeAmazonIdentities':len(live_keys),'missingFromChecker':len(missing)},ensure_ascii=False,indent=2))

if __name__=='__main__': main()
