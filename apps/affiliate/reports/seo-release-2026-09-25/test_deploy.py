import importlib.util,tempfile,json
from pathlib import Path
from unittest.mock import patch
spec=importlib.util.spec_from_file_location('release','apps/affiliate/reports/seo-release-2026-09-25/deploy.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
count=0
for scenario in ['success','fingerprint-fail','post-stop-capacity-fail','forecast-fail']:
 with tempfile.TemporaryDirectory() as tmp:
  m.STATE=Path(tmp);m.save(m.STATE/'wellness.json',{'app':'wellness','old':'/old','new':'/new','status':'prepared','retainedAssets':[], 'retainedAssetCount':0});installs=[];stops=[]
  def command(args,timeout=30):return '/old' if '--value' in args else 'ok'
  def forecast(app):
   if scenario=='forecast-fail':raise RuntimeError('forecast failed')
   return {'projectedAvailableMiB':840}
  def stop(app):
   stops.append(app)
   if scenario=='post-stop-capacity-fail':raise RuntimeError('post-stop gate failed')
   return {'passed':True,'availableMiB':820,'requiredMiB':704}
  def body(app,path='/',host=None):return 'wrong release' if scenario=='fingerprint-fail' else 'data-commerce-paused="true"'
  with patch.object(m,'run',command),patch.object(m,'cutover_forecast',forecast),patch.object(m,'stop_and_check_capacity',stop),patch.object(m,'install_config',lambda app,suffix:installs.append(suffix)),patch.object(m,'await_ready',lambda app:None),patch.object(m,'check',body),patch.object(m.subprocess,'run'):
   try:m.activate('wellness')
   except RuntimeError:assert scenario!='success'
  expected={'success':('origin-verified',['after']), 'fingerprint-fail':('rolled-back',['after','before']), 'post-stop-capacity-fail':('rolled-back',['before']), 'forecast-fail':('prepared',[])}[scenario]
  assert m.metadata('wellness')['status']==expected[0] and installs==expected[1]
  assert stops==([] if scenario=='forecast-fail' else ['wellness']);count+=1
for available,success in [(800,True),(500,False)]:
 with patch.object(m,'run',return_value='0'),patch.object(m,'capacity_probe',return_value={'passed':success,'availableMiB':available,'requiredMiB':704}):
  try:assert m.stop_and_check_capacity('wellness')['passed']
  except RuntimeError:assert not success
 count+=1
for status,expected in [('origin-verified',[]),('switching',['before'])]:
 with tempfile.TemporaryDirectory() as tmp:
  m.STATE=Path(tmp);m.save(m.STATE/'wellness.json',{'status':status});installs=[]
  with patch.object(m,'install_config',lambda app,suffix:installs.append(suffix)),patch.object(m,'await_ready',lambda app:None):m.rollback('wellness',automatic=True)
  assert installs==expected;count+=1
print(str(count)+' guarded cutover, capacity failure and rollback simulations passed; no production mutation')

assert m.browser_assets(['/_next/static/._directory', '/_next/static/build/.__buildManifest.js', '/_next/static/build/_buildManifest.js', '/_next/static/chunks/main.js']) == ['/_next/static/build/_buildManifest.js', '/_next/static/chunks/main.js']
print('AppleDouble exclusion passed; real browser assets remain required')
for scenario in ['success','main-fail','wellness-fail','final-capacity-fail']:
 with tempfile.TemporaryDirectory() as tmp:
  m.STATE=Path(tmp)
  for a in ['affiliate','main','wellness']:m.save(m.STATE/(a+'.json'),{'status':'origin-verified' if a=='affiliate' else 'prepared'})
  actions=[]
  def activate(a):
   actions.append('activate:'+a)
   if scenario==a+'-fail':raise RuntimeError('simulated failure')
   m.save(m.STATE/(a+'.json'),{'status':'origin-verified'})
  def rollback(a):actions.append('rollback:'+a);m.save(m.STATE/(a+'.json'),{'status':'rolled-back'})
  with patch.object(m,'cutover_forecast',return_value={'projectedAvailableMiB':850}),patch.object(m,'run',return_value='ok'),patch.object(m,'stop_and_check_capacity',return_value={'passed':True}),patch.object(m,'activate',activate),patch.object(m,'capacity_probe',return_value={'passed':scenario!='final-capacity-fail'}),patch.object(m,'rollback',rollback),patch.object(m,'resume_affiliate',lambda:actions.append('resume:affiliate')),patch.object(m.subprocess,'run'):
   try:m.finish_remaining()
   except RuntimeError:assert scenario!='success'
  assert actions[-1]=='resume:affiliate'
  if scenario=='wellness-fail':assert 'rollback:main' in actions
  if scenario=='final-capacity-fail':assert actions[-3:]==['rollback:wellness','rollback:main','resume:affiliate']
  assert json.loads((m.STATE/'remaining.json').read_text())['status']==('origin-verified' if scenario=='success' else 'rolled-back')
print('4 coordinated maintenance-window success/failure scenarios passed; affiliate recovery always invoked')
