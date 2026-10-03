"""One-time, immutable SEO release. Never builds or modifies the repository checkout."""
import argparse
import importlib.util
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
STATE = Path('/var/tmp/madabase-seo-release-20261002')
REVISION = None
CAPACITY = Path('/var/tmp/madabase-seo-capacity-20261002.mjs')
PLAN = {
    'affiliate': {'port': 3011, 'sha256': '5e4f9ff8c73d04afce05273c90ab831de5a0d72301efa866631877b82554174b', 'hosts': ['network.madabase.com', 'smarthome.madabase.com', 'homeoffice.madabase.com', 'baby.madabase.com', 'pets.madabase.com', 'style.madabase.com', 'costumes.madabase.com']},
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

def browser_assets(paths):
    # AppleDouble sidecars are archive metadata, never requested by HTML.
    return [path for path in paths if not any(part.startswith('._') for part in Path(path).parts)]

def check(app, path='/', host=None):
    host = host or PLAN[app]['hosts'][0]
    req = urllib.request.Request('http://127.0.0.1:' + str(PLAN[app]['port']) + path, headers={'Host': host, 'X-Forwarded-Host': host, 'User-Agent': 'Madabase release QA/1.0'})
    with urllib.request.urlopen(req, timeout=6) as response:
        body = response.read().decode(errors='replace')
        if response.status != 200 or (path == '/' and '<h1' not in body):
            raise RuntimeError('Invalid response: ' + host + path)
        return body

def verify_metadata():
    spec = importlib.util.spec_from_file_location('head', Path(__file__).with_name('check-head-metadata.py'))
    checker = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(checker)
    targets = ['https://' + host + '/' for host in PLAN['affiliate']['hosts']]
    targets += [
        'https://homeoffice.madabase.com/reviews/anker-675-usb-c-docking-station',
        'https://homeoffice.madabase.com/reviews/branch-ergonomic-chair',
        'https://homeoffice.madabase.com/guides/office-lumbar-cushions-buying-guide',
        'https://homeoffice.madabase.com/guides/office-printer-stands-buying-guide',
        'https://smarthome.madabase.com/guides/smart-bathroom-exhaust-fans-buying-guide',
        'https://baby.madabase.com/guides/childproof-door-knob-covers-buying-guide',
        'https://baby.madabase.com/guides/toddler-snack-containers-buying-guide',
        'https://network.madabase.com/guides/usb-wifi-adapters-buying-guide',
    ]
    results = []
    deadline = time.monotonic() + 60
    for url in targets:
        for ua in checker.UAS:
            if time.monotonic() > deadline:
                raise RuntimeError('Origin metadata verification exceeded time budget')
            row = checker.probe(url, ua, 'http://127.0.0.1:3011')
            results.append(row)
            save(STATE / 'origin-head-results.json', results)
            if row['errors']:
                raise RuntimeError('Origin metadata check failed: ' + url)
    return {'checked': len(results), 'failed': 0}


def prepare():
    STATE.mkdir(mode=0o700, exist_ok=True)
    if not REVISION or not re.fullmatch(r'[0-9a-f]{7,40}', REVISION):
        raise RuntimeError('Explicit immutable commit required')
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
        target = Path('/srv/madabase-' + app + '/releases/seo-20261002-' + REVISION)
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
            if not source.is_file() or not browser_assets([str(source.relative_to(old_static[0]))]):
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
        save(record, {'revision': REVISION, 'app': app, 'old': old, 'new': str(target), 'sha256': digest, 'status': 'prepared', 'preparedAt': time.strftime('%Y-%m-%dT%H:%M:%S%z'), 'retainedAssetCount': len(retained), 'retainedAssets': retained[:8]})
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

def capacity_probe():
    result = subprocess.run(['node', str(CAPACITY), '--candidate-mib=512'], capture_output=True, text=True, timeout=10)
    capacity = json.loads(result.stdout)
    if result.returncode not in [0, 1] or not isinstance(capacity.get('availableMiB'), (int, float)):
        raise RuntimeError('Capacity measurement unavailable')
    return capacity

def cutover_forecast(app):
    capacity = capacity_probe()
    pid = run(['systemctl', 'show', unit(app), '--property=MainPID', '--value'])
    if not pid.isdigit() or int(pid) <= 0:
        raise RuntimeError('Old service has no running process')
    memory = Path('/proc/' + pid + '/smaps_rollup').read_text()
    match = re.search(r'^Pss_Anon:\s+(\d+) kB$', memory, re.M)
    if not match:
        raise RuntimeError('Reclaimable anonymous memory unavailable')
    reclaimable = int(match[1]) / 1024
    projected = capacity['availableMiB'] + reclaimable
    headroom = capacity.get('sliceHeadroomMiB')
    pressure = capacity.get('pressureAvg10')
    # Forecast adds a 64 MiB uncertainty margin; the actual post-stop gate is unchanged.
    if projected < 768 or not isinstance(pressure, (int, float)) or pressure >= 1:
        raise RuntimeError('Insufficient forecast capacity for guarded single-process cutover')
    if headroom != 'unlimited' and (not isinstance(headroom, (int, float)) or headroom + reclaimable < 768):
        raise RuntimeError('Insufficient forecast system.slice headroom')
    return {'before': capacity, 'oldPssAnonMiB': reclaimable, 'projectedAvailableMiB': projected, 'forecastRequiredMiB': 768}

def stop_and_check_capacity(app):
    run(['systemctl', 'stop', unit(app)], timeout=20)
    if run(['systemctl', 'show', unit(app), '--property=MainPID', '--value']) != '0':
        raise RuntimeError('Old process did not stop')
    capacity = capacity_probe()
    if not capacity.get('passed'):
        raise RuntimeError('Post-stop capacity gate failed; restore old production: ' + json.dumps(capacity))
    return capacity

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
    if record['status'] not in ['prepared', 'rolled-back']:
        raise RuntimeError('Expected prepared or successfully rolled-back state')
    actual = run(['systemctl', 'show', unit(app), '--property=WorkingDirectory', '--value'])
    if actual != record['old']:
        raise RuntimeError('Production changed since preparation')
    if record['status'] == 'rolled-back':
        record.setdefault('previousAttempts', []).append({key: record[key] for key in ['startedAt', 'rolledBackAt', 'capacityForecast', 'postStopCapacity'] if key in record})
        record.pop('rolledBackAt', None)
    retained = browser_assets(record['retainedAssets'])
    if record['retainedAssetCount'] and not retained:
        raise RuntimeError('No real retained browser assets to verify')
    forecast = cutover_forecast(app)
    watchdog = 'madabase-seo-20261002-watchdog-' + app
    run(['systemd-run', '--unit=' + watchdog, '--on-active=150s', '--timer-property=AccuracySec=1s', '--property=RuntimeMaxSec=90', '--property=MemoryMax=128M', '--property=MemorySwapMax=0', '--property=Restart=no', '/usr/bin/python3', str(Path(__file__).resolve()), 'watchdog', app])
    def interrupted(signum, frame):
        raise RuntimeError('Release interrupted')
    signal.signal(signal.SIGTERM, interrupted)
    signal.signal(signal.SIGINT, interrupted)
    try:
        record.update(status='switching', startedAt=time.strftime('%Y-%m-%dT%H:%M:%S%z'), capacityForecast=forecast)
        save(STATE / (app + '.json'), record)
        record['postStopCapacity'] = stop_and_check_capacity(app)
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
        for asset in retained[:2]:
            check(app, asset)
        record['metadataVerification'] = verify_metadata()
        record.update(status='origin-verified', completedAt=time.strftime('%Y-%m-%dT%H:%M:%S%z'), service=run(['systemctl', 'show', unit(app), '--property=ActiveState,SubState,NRestarts,MemoryCurrent,WorkingDirectory']))
        save(STATE / (app + '.json'), record)
        print(json.dumps(record), flush=True)
    except BaseException:
        rollback(app)
        raise
    finally:
        if metadata(app)['status'] in ['origin-verified', 'rolled-back']:
            subprocess.run(['systemctl', 'stop', watchdog + '.timer'], capture_output=True, timeout=10)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('action', choices=['prepare', 'activate', 'rollback', 'watchdog'])
    parser.add_argument('app', choices=['affiliate'], nargs='?', default='affiliate')
    parser.add_argument('--revision')
    args = parser.parse_args()
    REVISION = args.revision
    if args.action == 'prepare':
        prepare()
    elif args.action == 'activate':
        activate(args.app)
    else:
        rollback(args.app, automatic=args.action == 'watchdog')
