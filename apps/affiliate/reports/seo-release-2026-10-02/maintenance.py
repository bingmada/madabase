"""Pause Main briefly while updating Affiliate; preserve every capacity gate.

Main runs its unchanged unit/release and has an independent recovery timer.
No service outside Main/Affiliate is operated on by this controller.
"""
import argparse
import importlib.util
import json
from pathlib import Path
import re
import signal
import subprocess
import time
import urllib.request

spec = importlib.util.spec_from_file_location('release', Path(__file__).with_name('deploy.py'))
release = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release)
MAIN = 'madabase-main.service'
WATCHDOG = 'madabase-seo-20261002-main-recovery'
RECORD = release.STATE / 'maintenance.json'


def main_health():
    request = urllib.request.Request('http://127.0.0.1:3008/', headers={'Host': 'madabase.com', 'X-Forwarded-Host': 'madabase.com'})
    with urllib.request.urlopen(request, timeout=5) as response:
        if response.status != 200 or '<h1' not in response.read().decode():
            raise RuntimeError('Main health failed')


def anonymous_mib(service):
    pid = release.run(['systemctl', 'show', service, '--property=MainPID', '--value'])
    if not pid.isdigit() or int(pid) <= 0:
        raise RuntimeError('No running process: ' + service)
    text = Path('/proc/' + pid + '/smaps_rollup').read_text()
    match = re.search(r'^Pss_Anon:\s+(\d+) kB$', text, re.M)
    if not match:
        raise RuntimeError('Missing anonymous memory accounting')
    return int(match[1]) / 1024


def forecast():
    capacity = release.capacity_probe()
    reclaimed = anonymous_mib(MAIN) + anonymous_mib('madabase-affiliate.service')
    pressure = capacity.get('pressureAvg10')
    headroom = capacity.get('sliceHeadroomMiB')
    if capacity['availableMiB'] + reclaimed < 768 or not isinstance(pressure, (float, int)) or pressure >= 1:
        raise RuntimeError('Insufficient maintenance forecast capacity')
    if headroom != 'unlimited' and (not isinstance(headroom, (float, int)) or headroom + reclaimed < 768):
        raise RuntimeError('Insufficient maintenance slice headroom')
    return {'capacity': capacity, 'reclaimableAnonymousMiB': reclaimed,
            'projectedAvailableMiB': capacity['availableMiB'] + reclaimed, 'requiredMiB': 768}


def restore_main():
    record = json.loads(RECORD.read_text())
    current = release.run(['systemctl', 'show', MAIN, '--property=WorkingDirectory', '--value'])
    if current != record['mainWorkingDirectory']:
        raise RuntimeError('Main configuration changed during maintenance')
    release.run(['systemctl', 'start', MAIN], timeout=30)
    deadline = time.monotonic() + 20
    while True:
        try:
            main_health()
            break
        except Exception:
            if time.monotonic() >= deadline:
                raise
            time.sleep(1)
    record.update(mainRestored=True, restoredAt=time.strftime('%Y-%m-%dT%H:%M:%S%z'))
    release.save(RECORD, record)
    subprocess.run(['systemctl', 'stop', WATCHDOG + '.timer'], capture_output=True, timeout=10)


def maintain():
    if release.metadata('affiliate')['status'] not in ['prepared', 'rolled-back']:
        raise RuntimeError('Affiliate must be prepared')
    if release.run(['systemctl', 'is-active', MAIN]) != 'active':
        raise RuntimeError('Main must already be active')
    main_health()
    measured = forecast()
    original = release.run(['systemctl', 'show', MAIN, '--property=WorkingDirectory', '--value'])
    release.save(RECORD, {'mainWorkingDirectory': original, 'forecast': measured,
                          'mainRestored': False, 'startedAt': time.strftime('%Y-%m-%dT%H:%M:%S%z')})
    release.run(['systemd-run', '--unit=' + WATCHDOG, '--on-active=180s',
                 '--timer-property=AccuracySec=1s', '--property=RuntimeMaxSec=90',
                 '--property=MemoryMax=128M', '--property=MemorySwapMax=0', '--property=Restart=no',
                 '/usr/bin/python3', str(Path(__file__).resolve()), 'restore-main'])
    def interrupted(signum, frame):
        raise RuntimeError('Maintenance interrupted')
    signal.signal(signal.SIGTERM, interrupted)
    signal.signal(signal.SIGINT, interrupted)
    try:
        release.run(['systemctl', 'stop', MAIN], timeout=20)
        # Unmodified Affiliate forecast, actual post-stop gate, and rollback apply.
        release.activate('affiliate')
    finally:
        restore_main()
    print(json.dumps({'affiliate': release.metadata('affiliate')['status'], 'mainRestored': True}), flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('action', choices=['activate', 'restore-main'])
    args = parser.parse_args()
    maintain() if args.action == 'activate' else restore_main()
