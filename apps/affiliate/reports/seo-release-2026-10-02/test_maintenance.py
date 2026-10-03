import importlib.util
from pathlib import Path
import tempfile
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('maintenance', Path(__file__).with_name('maintenance.py'))
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

for scenario in ['success', 'forecast-failure', 'watchdog-failure', 'stop-failure', 'activate-failure']:
    with tempfile.TemporaryDirectory() as temp:
        actions = []
        def run(args, timeout=30):
            if args[:2] == ['systemctl', 'is-active']:
                return 'active'
            if args[0] == 'systemd-run' and scenario == 'watchdog-failure':
                raise RuntimeError('watchdog unavailable')
            if args[:2] == ['systemctl', 'stop']:
                actions.append('stop-main')
                if scenario == 'stop-failure':
                    raise RuntimeError('stop failed')
            return '/unchanged-main'
        def forecast():
            if scenario == 'forecast-failure':
                raise RuntimeError('capacity')
            return {'projectedAvailableMiB': 800}
        def activate(app):
            actions.append('activate-affiliate')
            if scenario == 'activate-failure':
                raise RuntimeError('rollback simulated by Affiliate controller')
        with patch.object(m, 'RECORD', Path(temp) / 'state.json'), patch.object(m.release, 'metadata', return_value={'status': 'prepared'}), patch.object(m.release, 'run', side_effect=run), patch.object(m, 'forecast', side_effect=forecast), patch.object(m, 'main_health'), patch.object(m.release, 'activate', side_effect=activate), patch.object(m, 'restore_main', side_effect=lambda: actions.append('restore-main')):
            try:
                m.maintain()
                assert scenario == 'success'
            except RuntimeError:
                assert scenario != 'success'
        if scenario in ['forecast-failure', 'watchdog-failure']:
            assert actions == []
        else:
            assert actions[0] == 'stop-main' and actions[-1] == 'restore-main'

for available, pressure, headroom, expected in [(220, 0, 'unlimited', True), (150, 0, 'unlimited', False), (220, 1, 'unlimited', False), (220, 0, 100, False)]:
    with patch.object(m.release, 'capacity_probe', return_value={'availableMiB': available, 'pressureAvg10': pressure, 'sliceHeadroomMiB': headroom}), patch.object(m, 'anonymous_mib', return_value=280):
        try:
            m.forecast()
            assert expected
        except RuntimeError:
            assert not expected
for current, expected in [('/unchanged-main', True), ('/other-main', False)]:
    with tempfile.TemporaryDirectory() as temp:
        record = Path(temp) / 'state.json'
        m.release.save(record, {'mainWorkingDirectory': '/unchanged-main'})
        actions = []
        def run(args, timeout=30):
            actions.append(args[:2])
            return current
        with patch.object(m, 'RECORD', record), patch.object(m.release, 'run', side_effect=run), patch.object(m, 'main_health'), patch.object(m.subprocess, 'run'):
            try:
                m.restore_main()
                assert expected
            except RuntimeError:
                assert not expected
        assert (['systemctl', 'start'] in actions) == expected
print('11 maintenance success, rollback, recovery timer and capacity scenarios passed')
