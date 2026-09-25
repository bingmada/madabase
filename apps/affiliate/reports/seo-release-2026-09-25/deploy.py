"""One-time, immutable SEO release. Never builds or modifies the repository checkout."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import signal
import subprocess
import time
import urllib.request

REPO = Path('/snap/newmadabse/madabase')
STATE = Path('/var/tmp/madabase-seo-release-20260925')
REVISION = '8055b15'
PLAN = {
    'affiliate': {'port': 3011, 'sha256': '5452695a40221ac3fb770e49e48103ddb4f0df52b892f77e00755955adc1e0d0', 'hosts': ['network.madabase.com', 'smarthome.madabase.com', 'homeoffice.madabase.com', 'baby.madabase.com', 'pets.madabase.com', 'style.madabase.com', 'costumes.madabase.com']},
    'main': {'port': 3008, 'sha256': '704e254c86bb6f4f00855c88ccbf2d00dc1ef3a2617b375942b4d5769b49c5f6', 'hosts': ['madabase.com']},
    'wellness': {'port': 3099, 'sha256': 'd48213b0a00c65f4dec34e1b01ac4b555541928cd802508b44d6f42eeaa9c349', 'hosts': ['wellness.madabase.com']},
}

def run(args, timeout=30):
    return subprocess.run(args, check=True, capture_output=True, text=True, timeout=timeout).stdout.strip()

def save(path, value):
    temp = path.with_suffix('.tmp')
    temp.write_text(json.dumps(value, indent=2) + '\n')
    os.replace(temp, path)

def unit(app):
    return 'madabase-' + app + '.service'

def metadata(app):
    return json.loads((STATE / (app + '.json')).read_text())

def check(app, path='/', host=None):
    host = host or PLAN[app]['hosts'][0]
    req = urllib.request.Request('http://127.0.0.1:' + str(PLAN[app]['port']) + path, headers={'Host': host, 'X-Forwarded-Host': host, 'User-Agent': 'Madabase release QA/1.0'})
    with urllib.request.urlopen(req, timeout=6) as response:
        body = response.read().decode(errors='replace')
        if response.status != 200 or (path == '/' and '<h1' not in body):
            raise RuntimeError('Invalid response: ' + host + path)
        return body

def prepare():
    STATE.mkdir(mode=0o700, exist_ok=True)
    if not run(['node', '--version']).startswith('v20.'):
        raise RuntimeError('Node 20 required')
    for app, details in PLAN.items():
        record = STATE / (app + '.json')
        if record.exists():
            raise RuntimeError('Prepared record already exists: ' + app)
        old = run(['systemctl', 'show', unit(app), '--property=WorkingDirectory', '--value'])
        if not Path(old).is_dir() or run(['systemctl', 'is-active', unit(app)]) != 'active':
            raise RuntimeError('Old production not healthy: ' + app)
        for host in details['hosts']:
            check(app, host=host)
        target = Path('/srv/madabase-' + app + '/releases/seo-20260925-' + REVISION)
        if target.exists():
            raise RuntimeError('Immutable target already exists: ' + str(target))
        archive = STATE / (app + '.tgz')
        with archive.open('wb') as output:
            subprocess.run(['git', '-C', str(REPO), 'show', REVISION + ':apps/' + app + '/.release/' + app + '-runtime.tgz'], stdout=output, check=True, timeout=60)
        digest = hashlib.file_digest(archive.open('rb'), 'sha256').hexdigest() if hasattr(hashlib, 'file_digest') else hashlib.sha256(archive.read_bytes()).hexdigest()
        if digest != details['sha256']:
            raise RuntimeError('Archive hash mismatch: ' + app)
        target.mkdir(parents=True)
        run(['tar', '-xzf', str(archive), '-C', str(target)], timeout=90)
        if not (target / 'start.mjs').is_file():
            raise RuntimeError('Missing runtime entry point')
        new_static = list((target / 'apps' / app).glob('.next*/static'))
        old_static = list((Path(old) / 'apps' / app).glob('.next*/static'))
        if len(new_static) != 1 or len(old_static) != 1:
            raise RuntimeError('Ambiguous static asset directories: ' + app)
        retained = []
        for source in old_static[0].rglob('*'):
            if not source.is_file():
                continue
            destination = new_static[0] / source.relative_to(old_static[0])
            if not destination.exists():
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(source, destination)
                retained.append('/_next/static/' + str(source.relative_to(old_static[0])))
        run(['chown', '-R', 'madabase:madabase', str(target)], timeout=30)
        config = Path('/etc/systemd/system') / unit(app)
        original = config.read_text()
        if original.count('WorkingDirectory=' + old) != 1:
            raise RuntimeError('Unexpected unit working directory')
        backup = STATE / (app + '.service.before')
        backup.write_text(original)
        backup.chmod(0o600)
        new_config = original.replace('WorkingDirectory=' + old, 'WorkingDirectory=' + str(target))
        (STATE / (app + '.service.after')).write_text(new_config)
        save(record, {'app': app, 'old': old, 'new': str(target), 'sha256': digest, 'status': 'prepared', 'preparedAt': time.strftime('%Y-%m-%dT%H:%M:%S%z'), 'retainedAssetCount': len(retained), 'retainedAssets': retained[:8]})
        print(json.dumps({'app': app, 'prepared': True, 'sha256': digest, 'retainedAssets': len(retained)}), flush=True)

def install_config(app, suffix):
    destination = Path('/etc/systemd/system') / unit(app)
    temp = destination.with_suffix('.service.seo-tmp')
    shutil.copyfile(STATE / (app + '.service.' + suffix), temp)
    temp.chmod(0o644)
    os.replace(temp, destination)
    run(['systemctl', 'daemon-reload'])
    run(['systemctl', 'restart', unit(app)], timeout=35)

def await_ready(app):
    error = None
    deadline = time.monotonic() + 20
    while time.monotonic() < deadline:
        try:
            check(app)
            return
        except Exception as exc:
            error = exc
            time.sleep(1)
    raise RuntimeError('Service did not become ready: ' + str(error))

def rollback(app, automatic=False):
    record = metadata(app)
    if automatic and record['status'] in ['origin-verified', 'rolled-back']:
        return
    install_config(app, 'before')
    await_ready(app)
    record.update(status='rolled-back', rolledBackAt=time.strftime('%Y-%m-%dT%H:%M:%S%z'))
    save(STATE / (app + '.json'), record)
    print(json.dumps({'app': app, 'rolledBack': True}), flush=True)

def activate(app):
    record = metadata(app)
    if record['status'] != 'prepared':
        raise RuntimeError('Expected prepared state')
    actual = run(['systemctl', 'show', unit(app), '--property=WorkingDirectory', '--value'])
    if actual != record['old']:
        raise RuntimeError('Production changed since preparation')
    watchdog = 'madabase-seo-watchdog-' + app
    run(['systemd-run', '--unit=' + watchdog, '--on-active=120s', '--timer-property=AccuracySec=1s', '/usr/bin/python3', str(Path(__file__).resolve()), 'watchdog', app])
    def interrupted(signum, frame):
        raise RuntimeError('Release interrupted')
    signal.signal(signal.SIGTERM, interrupted)
    signal.signal(signal.SIGINT, interrupted)
    try:
        record.update(status='switching', startedAt=time.strftime('%Y-%m-%dT%H:%M:%S%z'))
        save(STATE / (app + '.json'), record)
        install_config(app, 'after')
        await_ready(app)
        for host in PLAN[app]['hosts']:
            check(app, host=host)
        if app == 'affiliate':
            body = check(app, '/tools/desk-height-calculator', 'homeoffice.madabase.com')
            if 'Seated elbow height from floor' not in body or 'Okin 36' not in body:
                raise RuntimeError('Desk release fingerprint missing')
            body = check(app, '/reviews/elgato-key-light-neo', 'homeoffice.madabase.com')
            if re.search(r'<a[^>]+href="[^"]*B0FDBL5MVM', body):
                raise RuntimeError('Blocked Elgato purchase link remains')
        if app == 'wellness':
            body = check(app, '/categories/lingerie')
            if 'data-commerce-paused="true"' not in body or 'Catalog reference $' in body:
                raise RuntimeError('Wellness release fingerprint missing')
        for asset in record['retainedAssets'][:2]:
            check(app, asset)
        record.update(status='origin-verified', completedAt=time.strftime('%Y-%m-%dT%H:%M:%S%z'), service=run(['systemctl', 'show', unit(app), '--property=ActiveState,SubState,NRestarts,MemoryCurrent,WorkingDirectory']))
        save(STATE / (app + '.json'), record)
        print(json.dumps(record), flush=True)
    except BaseException:
        rollback(app)
        raise
    finally:
        subprocess.run(['systemctl', 'stop', watchdog + '.timer'], capture_output=True, timeout=10)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('action', choices=['prepare', 'activate', 'rollback', 'watchdog'])
    parser.add_argument('app', choices=PLAN, nargs='?')
    args = parser.parse_args()
    if args.action != 'prepare' and not args.app:
        parser.error('app required')
    if args.action == 'prepare':
        prepare()
    elif args.action == 'activate':
        activate(args.app)
    else:
        rollback(args.app, automatic=args.action == 'watchdog')
