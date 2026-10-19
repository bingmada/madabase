"""Failure injection only. No server command, service change or HTTP request."""
import importlib.util, json, tempfile, unittest
from pathlib import Path
from unittest.mock import patch
SPEC=importlib.util.spec_from_file_location('discovery_release',Path(__file__).with_name('deploy.py'))
release=importlib.util.module_from_spec(SPEC);SPEC.loader.exec_module(release)
class ReleaseFailureTests(unittest.TestCase):
 def setUp(self):
  self.temp=tempfile.TemporaryDirectory();self.addCleanup(self.temp.cleanup)
  self.commands=[];self.paths={'main':'old-main','affiliate':'old-affiliate','test':'old-test'};self.installed={};self.started=[]
  self.patches=[patch.object(release,'STATE',Path(self.temp.name)),patch.object(release,'run',side_effect=self.command),patch.object(release,'prop',side_effect=self.prop),patch.object(release,'install',side_effect=self.install),patch.object(release,'forecast',return_value={'projectedMiB':900}),patch.object(release,'gate',return_value={'passed':True}),patch.object(release,'ready'),patch.object(release,'verify',return_value={'passed':True}),patch.object(release.signal,'signal'),patch.object(release.subprocess,'run')]
  for p in self.patches:p.start();self.addCleanup(p.stop)
  release.save('transaction.json',{'status':'prepared','testWorkingDirectory':'old-test','apps':{a:{'old':'old-'+a,'new':'new-'+a} for a in ['main','affiliate']}})
 def command(self,args,timeout=30):
  self.commands.append(args)
  if args[:2]==['systemctl','start']:self.started.append(args[2])
  return ''
 def prop(self,app,name):return self.paths[app] if name=='WorkingDirectory' else 'active'
 def install(self,app,suffix):self.installed[app]=suffix;self.paths[app]=('old-' if suffix=='before' else 'new-')+app
 def record(self):return release.load('transaction.json')
 def assertRestored(self):
  self.assertEqual(self.record()['status'],'rolled-back');self.assertEqual(self.paths['main'],'old-main');self.assertEqual(self.paths['affiliate'],'old-affiliate');self.assertIn('madabase-test.service',self.started)
 def test_no_capacity_no_stop(self):
  release.forecast.side_effect=RuntimeError('insufficient forecast')
  with self.assertRaises(RuntimeError):release.activate(True)
  self.assertFalse(self.commands)
 def test_baseline_drift_no_stop(self):
  self.paths['affiliate']='another-release'
  with self.assertRaises(RuntimeError):release.activate(True)
  self.assertFalse(self.commands)
 def test_test_not_operated_without_authorization(self):
  release.activate(False)
  self.assertEqual(self.record()['status'],'origin-verified')
  self.assertFalse(any('madabase-test.service' in c for c in self.commands))
 def test_authorized_test_pause_restores_original(self):
  release.activate(True)
  self.assertTrue(self.record()['testRestored']);self.assertEqual(self.paths['test'],'old-test')
  self.assertIn(['systemctl','stop','madabase-test.service'],self.commands)
 def test_main_start_failure_restores_both_and_test(self):
  release.ready.side_effect=lambda app: (_ for _ in ()).throw(RuntimeError('main failed')) if app=='main' and self.installed.get(app)=='after' else None
  with self.assertRaises(RuntimeError):release.activate(True)
  self.assertRestored()
 def test_second_actual_gate_failure_restores_both_and_test(self):
  release.gate.side_effect=[{'passed':True},RuntimeError('actual capacity')]
  with self.assertRaises(RuntimeError):release.activate(True)
  self.assertRestored()
 def test_affiliate_acceptance_failure_restores_both_and_test(self):
  release.verify.side_effect=[{'passed':True},RuntimeError('canonical failure')]
  with self.assertRaises(RuntimeError):release.activate(True)
  self.assertRestored()
 def test_one_restore_failure_still_attempts_other_site_and_test(self):
  record=self.record();record.update(status='switching',testPaused=True);release.save('transaction.json',record)
  release.ready.side_effect=lambda app: (_ for _ in ()).throw(RuntimeError('old affiliate down')) if app=='affiliate' else None
  with self.assertRaises(RuntimeError):release.recover_locked()
  self.assertEqual(self.record()['status'],'rollback-failed')
  self.assertIn('madabase-main.service',self.started);self.assertIn('madabase-test.service',self.started)
 def test_late_watchdog_leaves_verified_release_running(self):
  release.activate(False);before=list(self.commands)
  release.recover()
  self.assertEqual(self.record()['status'],'origin-verified');self.assertEqual(self.commands,before)
 def test_manual_rollback_after_success_restores_previous_without_touching_test(self):
  release.activate(False);release.rollback()
  self.assertEqual(self.record()['status'],'rolled-back');self.assertEqual(self.paths['main'],'old-main');self.assertEqual(self.paths['affiliate'],'old-affiliate')
  self.assertFalse(any('madabase-test.service' in command for command in self.commands))
if __name__=='__main__':unittest.main()
