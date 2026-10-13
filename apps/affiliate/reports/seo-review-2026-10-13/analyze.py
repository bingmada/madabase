import collections
import csv
import json
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent
HOSTS = ['network.madabase.com', 'smarthome.madabase.com', 'homeoffice.madabase.com', 'baby.madabase.com', 'pets.madabase.com', 'style.madabase.com', 'costumes.madabase.com']
def read_csv(path): return list(csv.DictReader(path.open()))
def metrics(row, label):
    return {'clicks': int(row.get(label+' Clicks', 0) or 0), 'impressions': int(row.get(label+' Impressions', 0) or 0), 'position': float(row.get(label+' Position', 0) or 0)}

windows = {}
for span, current, previous in [('24h','Last 24 hours','Previous 24 hours'), ('7d','Last 7 days','Previous 7 days'), ('28d','Last 28 days','Previous 28 days')]:
    rows = read_csv(ROOT/f'gsc-{span}/Pages.csv')
    hosts = {}
    for host in HOSTS:
        selected = [r for r in rows if urllib.parse.urlparse(r['Top pages']).hostname == host]
        host_result = {}
        for key,label in [('current', current), ('previous', previous)]:
            values = [metrics(r,label) for r in selected]
            impressions = sum(v['impressions'] for v in values)
            host_result[key] = {'clicks': sum(v['clicks'] for v in values), 'impressions': impressions, 'exposedUrls':sum(v['impressions']>0 for v in values), 'weightedPosition':round(sum(v['impressions']*v['position'] for v in values)/impressions, 3) if impressions else None}
        hosts[host] = host_result
    windows[span] = {'exportRows':len(rows),'truncatedAt1000':len(rows)>=1000,'byHost':hosts}

ledger = json.loads((ROOT.parent/'seo-recovery-2026-10-06/changed-urls.json').read_text())
inspections = json.loads((ROOT/'index-inspections.json').read_text())['records']
index_by_url = {r['url']:r for r in inspections}
exports = {span:{r['Top pages']:r for r in read_csv(ROOT/f'gsc-{span}/Pages.csv')} for span in windows}
url_rows = []
for family in ledger['families']:
    target = family['target']
    parsed = urllib.parse.urlparse(target)
    candidates = [(target, 'base-canonical', target)] + [(s,'base-redirect',target) for s in family['sources']]
    for market in ['en-gb','en-ca','de-de','nl-nl']:
        if parsed.hostname == 'costumes.madabase.com': continue
        local_target = f'https://{parsed.hostname}/{market}{parsed.path}'
        candidates.append((local_target,'localized-canonical',local_target))
        candidates.extend((f'https://{parsed.hostname}/{market}{urllib.parse.urlparse(s).path}', 'localized-redirect',local_target) for s in family['sources'])
    for url,role,expected in candidates:
        row = {'site':family['site'],'family':family['family'],'url':url,'role':role,'expected_target':expected}
        for span,current,previous in [('24h','Last 24 hours','Previous 24 hours'),('7d','Last 7 days','Previous 7 days'),('28d','Last 28 days','Previous 28 days')]:
            source = exports[span].get(url,{})
            for period,label in [('current',current),('previous',previous)]:
                for metric,value in metrics(source,label).items(): row[f'{span}_{period}_{metric}']=value
        record = index_by_url.get(url)
        row['index_status'] = 'indexed' if record and record['indexed'] else 'not-inspected-independently'
        row['last_crawl_displayed'] = record.get('lastCrawlDisplayed','') if record else ''
        if 'redirect' in role: row['next_action']='retain-permanent-redirect; exposure-suppression-is-expected'
        elif role=='localized-canonical': row['next_action']='retain-existing-regional-indexability-policy; observe'
        elif row['7d_current_impressions']<20: row['next_action']='continue-observation; recheck-crawl-at-day14; no-second-broad-rewrite'
        else: row['next_action']='inspect-page-filtered-queries-before-optimization'
        url_rows.append(row)

with (ROOT/'recovery-cohort-ledger.csv').open('w') as f:
    writer=csv.DictWriter(f,fieldnames=list(url_rows[0]));writer.writeheader();writer.writerows(url_rows)
inventory = read_csv(ROOT/'page-ledger.csv')
base_rows = [r for r in url_rows if r['role']=='base-canonical']
summary = {
    'checkedDate':'2026-10-13','mode':'read-only-diagnosis; local-evidence-files-only',
    'windows':{'latest24h':'rolling October 12-13; browser local display; preliminary; last update approximately 8 hours ago','latestComplete7d':'2026-10-04..2026-10-10 vs 2026-09-27..2026-10-03 (GSC Pacific dates)','rolling28d':'2026-09-13..2026-10-10 vs 2026-08-16..2026-09-12 (GSC Pacific dates)'},
    'propertyHeadlineCards':{'24h':{'current':{'impressions':5,'clicks':0,'position':9.2},'previous':{'impressions':7,'clicks':0,'position':11.7}},'7d':{'current':{'impressions':62,'clicks':0,'position':16.4},'previous':{'impressions':436,'clicks':3,'position':11.2}},'28d':{'current':{'impressions':3308,'clicks':23,'position':12.7},'previous':{'impressions':7651,'clicks':31,'position':30.0}}},
    'aggregationBoundary':'Headline cards are all-domain context, not affiliate growth totals. Active affiliate metrics below exclude Tools, Test, Wellness, Main and legacy Main. Page-grouped sums can differ from property cards; do not add or mix them.',
    'activeAffiliatePageMetrics':windows,
    'inventory':{'baseRegistryPages':len(inventory),'with28dImpressions':sum(int(r['impressions'] or 0)>0 for r in inventory),'without28dImpressions':sum(int(r['impressions'] or 0)==0 for r in inventory),'zeroImpressionNotProofOfDeindexing':True},
    'october6Cohort':{'allLedgerUrls':len(url_rows),'roles':dict(collections.Counter(r['role'] for r in url_rows)),'baseCanonicals':len(base_rows),'liveIndexInspectedBaseCanonicals':len(inspections),'indexedBaseCanonicals':sum(r['indexed'] for r in inspections),'current7dExposedBaseCanonicals':sum(r['7d_current_impressions']>0 for r in base_rows),'current7dImpressions':sum(r['7d_current_impressions'] for r in base_rows),'previous7dImpressions':sum(r['7d_previous_impressions'] for r in base_rows),'current24hImpressions':sum(r['24h_current_impressions'] for r in base_rows),'recrawledOctober6OrLater':9,'recrawledOctober9OrLater':7,'lastCrawlBeforeOctober6':8},
    'publicVerification':{'requests':103,'passed':103,'baseCanonicalResponses':34,'redirects':55,'sitemaps':7,'robots':7,'evidence':'public-probe.json'},
    'googleUpdate':{'status':'complete','officialClosePacific':'2026-10-08 01:00 PDT','officialCloseShanghai':'2026-10-08 16:00 +08:00','source':'https://status.search.google.com/incidents/XhUDXP7A67iHCD2kmbVu','causality':'Timing consistent with algorithmic exposure loss; no proof of a specific spam classifier or cause.'},
    'diagnosis':['No observable recovery in latest24h or complete7d.','Technical repairs remain live. All 17 retained base canonicals remain indexed, so wholesale deindexing is not the observed cohort bottleneck.','Mixed crawl freshness: eight retained pages still have pre-October6 snapshots; nine have October6-or-later crawls. Only three after-October8 full days are present if counting Oct8 itself; only October9-10 are fully post-final-release days.','The October8 source/disclosure/title repairs correct integrity but have not demonstrated restored search competitiveness.','The 822 zero-impression base pages require demand, overlap and added-value review; they must not be deleted or noindexed solely because of absent export rows.'],
    'nextReview':'2026-10-20; compare complete stable cohorts and recheck the eight stale crawl snapshots. This date is a decision checkpoint, not a recovery promise.',
    'recommendedActions':['Continue new-URL freeze.','Prioritize bounded discovery/crawl follow-up for stale canonical snapshots, preserving healthy head metadata and protected winners.','Keep recently recrawled canonicals stable until the next complete observation window.','Prioritize demand, intent overlap and original decision value of weak generated guides over another full-site title or canonical rewrite.','If exposure remains near-zero at the next gate, plan query-family consolidation of confirmed overlap; retain distinct useful pages.'],
    'limitations':['No bulk Request Indexing, sitemap resubmission, code edit, deployment or automation in this diagnostic run.','Current public requests cannot rule out historical origin outages.','356 cohort URLs have metric ledgers; independent GSC URL Inspection covers the 17 retained base canonicals. Localized variants and redirect sources were not independently inspected.','The whole 822-page zero-impression index queue has not been re-inspected; no all-portfolio indexing-gate completion is claimed.']
}
(ROOT/'diagnosis.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'cohort':summary['october6Cohort'],'inventory':summary['inventory']},ensure_ascii=False,indent=2))
