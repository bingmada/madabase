import json,urllib.request,datetime
from pathlib import Path
rows=[]
for host in ['madabase.com','homeoffice.madabase.com','network.madabase.com','smarthome.madabase.com','baby.madabase.com','pets.madabase.com','style.madabase.com','costumes.madabase.com']:
 passes=[]
 for attempt in range(2):
  req=urllib.request.Request('https://'+host+'/',headers={'User-Agent':'Madabase RSC QA/1.0','Accept':'*/*','RSC':'1'})
  for transport_attempt in range(2):
   try:
    with urllib.request.urlopen(req,timeout=25) as r:
     r.read();passes.append({'status':r.status,'cache':r.headers.get('cf-cache-status'),'type':r.headers.get('content-type'),'transportRetries':transport_attempt})
    break
   except Exception as error:
    if transport_attempt==1:passes.append({'status':0,'cache':None,'type':'','error':str(error),'transportRetries':1})
 rows.append({'host':host,'passes':passes,'passed':all(p['status']==200 and p['cache'] in ['DYNAMIC','BYPASS'] and 'text/x-component' in p['type'] for p in passes)})
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'rows':rows,'passed':all(r['passed'] for r in rows)}
Path(__file__).with_name('public-rsc.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2));assert report['passed']
