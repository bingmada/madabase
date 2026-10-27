"""Apply only the owner-authorized retired hosts and stop their old services.
No database or business-file deletion. Main/Affiliate units stay untouched.
"""
import json,re,subprocess,http.client,time
from pathlib import Path
STATE=Path('/var/tmp/madabase-checkpoint-20261027')
HOSTS=['tools.madabase.com','test.madabase.com','style.madabase.com','wellness.madabase.com','costumes.madabase.com','costume.madabase.com']
NAMES=['tools.conf','test.conf','style.conf','wellness.conf','costumes.conf']
ENABLED=Path('/etc/nginx/sites-enabled')
MAIN=ENABLED/'madabase'
NEW=ENABLED/'retired-sites.conf'
def run(args):return subprocess.check_output(args,stderr=subprocess.STDOUT,text=True,timeout=25).strip()
def save(data):
 p=STATE/'retirement-infra.json';temp=p.with_suffix('.tmp');temp.write_text(json.dumps(data,indent=2)+'\n');temp.chmod(0o600);temp.replace(p)
def get(host,path,port=80):
 c=http.client.HTTPConnection('127.0.0.1',port,timeout=8)
 try:
  c.request('GET',path,headers={'Host':host,'User-Agent':'MadabaseRetirementQA/1.0'});r=c.getresponse();return r.status,r.read().decode(errors='replace'),dict(r.getheaders())
 finally:c.close()
def main_after(before):
 pattern=r'location ~ \^/\(en\|zh\)\(\?:/\.\*\)\?\$ \{\s*return 308 https://tools\.madabase\.com\$request_uri;\s*\}'
 replacement='location ~ ^/(?:en|zh|tools)(?:/|$) {\n        add_header X-Robots-Tag "noindex" always;\n        return 410;\n    }'
 after,count=re.subn(pattern,lambda _:replacement,before)
 if count!=3:raise RuntimeError('Expected3legacy Tools redirect blocks, found '+str(count))
 after='\n'.join(line for line in after.split('\n') if not(line.lstrip().startswith('#') and any(k in line.lower() for k in ['tools','/en','/zh'])))
 if 'https://tools.madabase.com' in after:raise RuntimeError('Legacy redirect remains')
 return after

def retired_config():
 shared='''    server_name %s;
    default_type text/plain;
    add_header X-Robots-Tag noindex always;
    add_header Cache-Control "public, max-age=300, s-maxage=300" always;
    add_header X-Content-Type-Options nosniff always;
    location = /robots.txt { return 200 "User-agent: *\\nAllow: /\\n"; }
    location / { return 410 "This site has been permanently removed.\\n"; }
'''%' '.join(HOSTS)
 return 'server {\n    listen 80;\n    listen [::]:80;\n'+shared+'}\nserver {\n    listen 443 ssl http2;\n    listen [::]:443 ssl http2;\n    ssl_certificate /etc/nginx/ssl/madabase.com.crt;\n    ssl_certificate_key /etc/nginx/ssl/madabase.com.key;\n    ssl_protocols TLSv1.2 TLSv1.3;\n    ssl_ciphers HIGH:!aNULL:!MD5;\n'+shared+'}\n'

def apply():
 transaction=json.loads((STATE/'transaction.json').read_text())
 if transaction['status']!='prepared':raise RuntimeError('Prepare pinned release before retiring infrastructure')
 if (STATE/'retirement-infra.json').exists():raise RuntimeError('Inspect existing infra state before another action')
 before=MAIN.read_text();after=main_after(before)
 if NEW.exists():raise RuntimeError('Retired configuration already exists; inspect state')
 originals={name:{'content':(ENABLED/name).read_text(),'symlink':str((ENABLED/name).readlink()) if (ENABLED/name).is_symlink() else None} for name in NAMES}
 run(['nginx','-t'])
 record={'status':'preparing','startedAt':time.time(),'mainBefore':before,'removedProxyFiles':originals,'businessFilesDeleted':False,'databaseChanged':False}
 save(record);stopping=False
 try:
  MAIN.write_text(after);NEW.write_text(retired_config())
  for name in NAMES:(ENABLED/name).unlink()
  run(['nginx','-t']);run(['systemctl','reload','nginx'])
  rows=[]
  for host in HOSTS:
   for path in ['/','/sitemap.xml','/catalog','/api/commerce-events','/ads.txt']:
    status,body,headers=get(host,path);rows.append({'host':host,'path':path,'status':status,'passed':status==410 and headers.get('X-Robots-Tag')=='noindex' and 'Location' not in headers})
   status,body,_=get(host,'/robots.txt');rows.append({'host':host,'path':'/robots.txt','status':status,'passed':status==200 and body=='User-agent: *\nAllow: /\n'})
  for host in ['madabase.com','www.madabase.com']:
   for path in ['/en','/zh/tools/json-formatter','/tools/json-formatter','/en/tests/mbti']:
    status,body,headers=get(host,path);rows.append({'host':host,'path':path,'status':status,'passed':status==410 and 'Location' not in headers})
  if not all(r['passed'] for r in rows):raise RuntimeError('Proxy acceptance failed '+json.dumps([r for r in rows if not r['passed']]))
  record.update(status='proxy_verified',proxyChecks=rows);save(record);stopping=True
  for app in ['tools','test','wellness']:
   run(['systemctl','stop','madabase-'+app+'.service']);run(['systemctl','disable','madabase-'+app+'.service'])
  health=[]
  for host in ['homeoffice','baby','network','smarthome','pets']:
   status,body,_=get(host+'.madabase.com','/?madabase-qa=retirement',3011);health.append({'host':host,'status':status,'passed':status==200})
  status,body,_=get('madabase.com','/?madabase-qa=retirement',3008);health.append({'host':'madabase.com','status':status,'passed':status==200})
  if not all(h['passed'] for h in health):raise RuntimeError('Retained origin health failed')
  record.update(status='retired_origin_verified',completedAt=time.time(),retainedHealth=health,stoppedServices=['tools','test','wellness']);save(record)
  print(json.dumps({'status':record['status'],'proxyChecks':len(rows),'retainedHealth':health,'stoppedServices':record['stoppedServices'],'databaseChanged':False,'businessFilesDeleted':False}),flush=True)
 except BaseException as error:
  record.update(status='failed_after_service_stop' if stopping else 'failed_before_service_stop',error=str(error));save(record)
  if not stopping:
   MAIN.write_text(before);NEW.unlink(missing_ok=True)
   for name,data in originals.items():
    p=ENABLED/name;p.unlink(missing_ok=True)
    if data['symlink']:p.symlink_to(data['symlink'])
    else:p.write_text(data['content'])
   run(['nginx','-t']);run(['systemctl','reload','nginx'])
  raise
if __name__=='__main__':apply()
