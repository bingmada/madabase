"""Pinned two-site release. Prepare is reversible; activate is a bounded transaction.

No build, database migration, excluded-host routing or capacity-limit change.
Test can only be paused with the explicit --allow-test-pause flag.
"""
import argparse, fcntl, hashlib, json, os, re, shutil, signal, subprocess, tarfile, time, urllib.request
from pathlib import Path
HERE=Path(__file__).resolve().parent
STATE=Path('/var/tmp/madabase-journey-20261019')
CAPACITY=HERE/'check-release-capacity.mjs'
ARTIFACTS=json.loads((HERE/'artifact.json').read_text())['artifacts']
HOSTS={'main':['madabase.com'],'affiliate':['network.madabase.com','smarthome.madabase.com','homeoffice.madabase.com','baby.madabase.com','pets.madabase.com','style.madabase.com','costumes.madabase.com']}
PORTS={'main':3008,'affiliate':3011,'test':3009}
WATCHDOG='madabase-journey-20261019-recovery'
def run(args,timeout=30):return subprocess.check_output(args,text=True,stderr=subprocess.STDOUT,timeout=timeout).strip()
def unit(app):return 'madabase-'+app+'.service'
def prop(app,name):return run(['systemctl','show',unit(app),'--property='+name,'--value'])
def save(name,data):
 path=STATE/name;temp=path.with_suffix('.tmp');temp.write_text(json.dumps(data,indent=2)+'\n');temp.chmod(0o600);os.replace(temp,path)
def load(name):return json.loads((STATE/name).read_text())
def probe():
 p=subprocess.run(['node',str(CAPACITY),'--candidate-mib=512'],capture_output=True,text=True,timeout=10)
 data=json.loads(p.stdout)
 if p.returncode not in [0,1]:raise RuntimeError('Capacity probe failed')
 return data
def forecast(apps):
 capacity=probe();reclaimed=0
 for app in apps:
  pid=prop(app,'MainPID')
  if not pid.isdigit() or int(pid)<=0:raise RuntimeError('No running baseline '+app)
  value=re.search(r'^Pss_Anon:\s+(\d+) kB$',Path('/proc/'+pid+'/smaps_rollup').read_text(),re.M)
  if not value:raise RuntimeError('Anonymous-memory evidence unavailable')
  reclaimed+=int(value[1])/1024
 projected=capacity['availableMiB']+reclaimed
 headroom=capacity['sliceHeadroomMiB']
 if projected<768 or capacity['pressureAvg10']>=1 or (headroom!='unlimited' and headroom+reclaimed<768):raise RuntimeError('Insufficient forecast; no service stopped')
 return {'capacity':capacity,'reclaimedAnonymousMiB':reclaimed,'projectedMiB':projected,'requiredMiB':768}
def gate():
 result=probe()
 if not result['passed']:raise RuntimeError('Actual capacity gate failed: '+json.dumps(result))
 return result
def get(app,path='/',host=None):
 host=host or HOSTS.get(app,['test.madabase.com'])[0]
 request=urllib.request.Request('http://127.0.0.1:'+str(PORTS[app])+path,headers={'Host':host,'X-Forwarded-Host':host,'X-Forwarded-Proto':'https','User-Agent':'Madabase discovery release QA/1.0'})
 with urllib.request.urlopen(request,timeout=6) as r:
  body=r.read().decode(errors='replace')
  if r.status!=200:raise RuntimeError('HTTP health failure '+app+path)
  return body,dict(r.headers)
def ready(app):
 deadline=time.monotonic()+20
 while True:
  try:return get(app)
  except Exception:
   if time.monotonic()>=deadline:raise
   time.sleep(.5)
def verify(app):
 if app=='main':
  body,headers=get(app,'/search?q=M720q%20RAM%2032GB')
  if 'ThinkCentre M720q Tiny' not in body or 'Home office' not in body or not re.search(r'name="robots"[^>]+noindex',body):raise RuntimeError('Main search fingerprint/noindex missing')
  if '/guides/thinkcentre-m920q-upgrade-compatibility-guide' in body or '/guides/thinkcentre-m920x-upgrade-compatibility-guide' in body:raise RuntimeError('Exact model search leaked another Tiny guide')
  if 'no-store' not in str(headers).lower():raise RuntimeError('Search cache failure')
  return {'search':True}
 ledger=json.loads((HERE/'release-urls.json').read_text())
 count=0
 for url in ledger['newCanonicals']+ledger['enhancedExistingCanonicals']:
  from urllib.parse import urlsplit
  p=urlsplit(url);body,_=get(app,p.path,p.netloc)
  if f'rel="canonical" href="{url}"' not in body or not re.search(r'<h1\b',body):raise RuntimeError('Canonical/H1 failed '+url)
  if p.path!='/compatibility' and 'compatibility-checker' not in body:raise RuntimeError('Checker missing '+url)
  if p.path!='/compatibility' and 'Where to find the details before starting' not in body:raise RuntimeError('Journey planner fingerprint missing')
  if p.path.startswith('/guides/thinkcentre-') and ('Memory quantity examples' not in body or 'Buying an ergonomic-looking product' in body):raise RuntimeError('Tiny buying content regression')
  if '"@type":"Review"' in body:raise RuntimeError('Unsupported Review schema')
  count+=1
 for host in HOSTS[app]:
  get(app,host=host);body,_=get(app,'/sitemap.xml',host)
  if '<loc>' not in body or '/search' in body:raise RuntimeError('Invalid sitemap '+host)
  if host=='costumes.madabase.com' and body.count('https://costumes.madabase.com/products/')!=76:raise RuntimeError('Costume database sitemap changed')
 body,_=get(app,'/products/woochie-fx-dark-lord-foam-latex-prosthetic--qtrtcu','costumes.madabase.com')
 if 'Woochie FX Dark Lord Foam Latex Prosthetic' not in body:raise RuntimeError('Costume database product failed')
 return {'contentCanonicals':count,'sitemaps':7,'databaseProduct':True}
def install(app,suffix):
 target=Path('/etc/systemd/system')/unit(app);temporary=target.with_suffix('.service.journey-tmp')
 shutil.copyfile(STATE/(app+'.service.'+suffix),temporary);temporary.chmod(0o644);os.replace(temporary,target)
def prepare(revision):
 if not re.fullmatch(r'[0-9a-f]{40}',revision):raise RuntimeError('Explicit source commit required')
 if not run(['node','--version']).startswith('v20.'):raise RuntimeError('Node 20 required')
 if STATE.exists():raise RuntimeError('State exists; inspect prior transaction')
 STATE.mkdir(mode=0o700)
 record={'revision':revision,'status':'preparing','testWorkingDirectory':prop('test','WorkingDirectory'),'apps':{}}
 for app in ['main','affiliate']:
  if prop(app,'ActiveState')!='active':raise RuntimeError('Baseline inactive '+app)
  old=prop(app,'WorkingDirectory');get(app)
  archive=HERE/(app+'-runtime.tgz')
  digest=hashlib.sha256(archive.read_bytes()).hexdigest()
  if digest!=ARTIFACTS[app]['sha256']:raise RuntimeError('Archive hash mismatch '+app)
  target=Path('/srv/madabase-'+app+'/releases/journey-20261019-'+revision)
  if target.exists():raise RuntimeError('Immutable release exists '+app)
  with tarfile.open(archive) as tar:
   for member in tar.getmembers():
    name=Path(member.name)
    if name.is_absolute() or '..' in name.parts or member.issym() or member.islnk():raise RuntimeError('Unsafe archive member')
   target.mkdir(parents=True);tar.extractall(target)
  if not (target/'start.mjs').is_file():raise RuntimeError('Runtime entry missing')
  old_static=list((Path(old)/'apps'/app).glob('.next*/static'));new_static=list((target/'apps'/app).glob('.next*/static'))
  if len(old_static)!=1 or len(new_static)!=1:raise RuntimeError('Static roots ambiguous')
  retained=0
  for file in old_static[0].rglob('*'):
   if file.is_file() and not any(x.startswith('._') for x in file.parts):
    destination=new_static[0]/file.relative_to(old_static[0])
    if not destination.exists():destination.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(file,destination);retained+=1
  run(['chown','-R','madabase:madabase',str(target)])
  config=(Path('/etc/systemd/system')/unit(app)).read_text()
  if config.count('WorkingDirectory='+old)!=1:raise RuntimeError('Unit drift '+app)
  (STATE/(app+'.service.before')).write_text(config)
  (STATE/(app+'.service.after')).write_text(config.replace('WorkingDirectory='+old,'WorkingDirectory='+str(target)))
  record['apps'][app]={'old':old,'new':str(target),'sha256':digest,'retainedAssets':retained}
 record['status']='prepared';save('transaction.json',record);print(json.dumps(record),flush=True)
def restore_test(record):
 if not record.get('testPaused'):return
 if prop('test','WorkingDirectory')!=record['testWorkingDirectory']:raise RuntimeError('Test directory drift; do not overwrite')
 run(['systemctl','start',unit('test')]);ready('test');record['testRestored']=True

def recover_locked():
 record=load('transaction.json')
 if record['status'] in ['origin-verified','rolled-back']:return
 errors=[]
 for app in ['affiliate','main']:
  try:run(['systemctl','stop',unit(app)])
  except Exception as error:errors.append(str(error))
 for app in ['main','affiliate']:
  try:install(app,'before')
  except Exception as error:errors.append(str(error))
 try:run(['systemctl','daemon-reload'])
 except Exception as error:errors.append(str(error))
 for app in ['affiliate','main']:
  try:run(['systemctl','start',unit(app)]);ready(app)
  except Exception as error:errors.append(str(error))
 try:restore_test(record)
 except Exception as error:errors.append(str(error))
 record.update(status='rollback-failed' if errors else 'rolled-back',rolledBackAt=time.time(),recoveryErrors=errors);save('transaction.json',record)
 if errors:raise RuntimeError('Recovery needs attention: '+'; '.join(errors))

def recover():
 with (STATE/'activation.lock').open('a') as lock:
  fcntl.flock(lock,fcntl.LOCK_EX);recover_locked()
def rollback():
 with (STATE/'activation.lock').open('a') as lock:
  fcntl.flock(lock,fcntl.LOCK_EX)
  record=load('transaction.json')
  if record['status']=='origin-verified':
   record['status']='manual-rollback-requested';save('transaction.json',record)
  recover_locked()

def activate(allow_test_pause=False):
 with (STATE/'activation.lock').open('a') as lock:
  fcntl.flock(lock,fcntl.LOCK_EX|fcntl.LOCK_NB)
  record=load('transaction.json')
  if record['status']!='prepared':raise RuntimeError('Expected prepared transaction')
  apps=['main','affiliate']+(['test'] if allow_test_pause else [])
  for app in ['main','affiliate']:
   if prop(app,'WorkingDirectory')!=record['apps'][app]['old']:raise RuntimeError('Production changed after prepare')
  if prop('test','ActiveState')!='active' or prop('test','WorkingDirectory')!=record['testWorkingDirectory']:raise RuntimeError('Test baseline changed')
  measured=forecast(apps)
  run(['systemd-run','--unit='+WATCHDOG,'--on-active=150s','--timer-property=AccuracySec=1s','--property=RuntimeMaxSec=90','--property=MemoryMax=128M','--property=MemorySwapMax=0','--property=Restart=no','/usr/bin/python3',str(Path(__file__).resolve()),'recover'])
  def interrupted(signum,frame):raise RuntimeError('Release interrupted')
  signal.signal(signal.SIGTERM,interrupted);signal.signal(signal.SIGINT,interrupted)
  try:
   record.update(status='switching',startedAt=time.time(),forecast=measured,testPaused=allow_test_pause,testRestored=not allow_test_pause);save('transaction.json',record)
   for app in apps:run(['systemctl','stop',unit(app)])
   record['gates']={};record['verification']={}
   for app in ['main','affiliate']:
    record['gates'][app]=gate();save('transaction.json',record)
    install(app,'after');run(['systemctl','daemon-reload']);run(['systemctl','start',unit(app)]);ready(app)
    record['verification'][app]=verify(app);save('transaction.json',record)
   restore_test(record)
   if prop('test','WorkingDirectory')!=record['testWorkingDirectory']:raise RuntimeError('Test directory changed')
   record.update(status='origin-verified',completedAt=time.time());save('transaction.json',record);print(json.dumps(record),flush=True)
  except BaseException:
   recover_locked();raise
  finally:
   if load('transaction.json')['status'] in ['origin-verified','rolled-back']:subprocess.run(['systemctl','stop',WATCHDOG+'.timer'],capture_output=True,timeout=10)
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('action',choices=['prepare','activate','recover','rollback']);parser.add_argument('--revision');parser.add_argument('--allow-test-pause',action='store_true');args=parser.parse_args()
 if args.action=='prepare':prepare(args.revision)
 elif args.action=='activate':activate(args.allow_test_pause)
 elif args.action=='rollback':rollback()
 else:recover()
