import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('head', Path(__file__).with_name('check-head-metadata.py'))
head = importlib.util.module_from_spec(spec)
spec.loader.exec_module(head)
URL = 'https://homeoffice.madabase.com/'
META = '<title>A &amp; B</title><meta name="description" content="Summary"><link rel="canonical" href="' + URL + '">'


class RawHeadRegression(unittest.TestCase):
    def test_valid_head(self):
        self.assertEqual(head.assess('<html><head>' + META + '</head><body></body></html>', URL)['errors'], [])

    def test_streamed_body_fails(self):
        result = head.assess('<html><head></head><body><h1>Page</h1>' + META + '</body></html>', URL)
        self.assertEqual(len(result['errors']), 3)

    def test_only_root_slash_is_equivalent(self):
        self.assertEqual(head.assess('<head>' + META.replace(URL, URL.rstrip('/')) + '</head>', URL)['errors'], [])
        self.assertTrue(head.assess('<head>' + META.replace(URL, URL + 'guide/') + '</head>', URL + 'guide')['errors'])

    def test_rsc_payload_is_not_html_metadata(self):
        result = head.assess('<html><head></head><body><script>self.__next_f.push([1,' + repr(META) + '])</script></body></html>', URL)
        self.assertEqual(result['canonical'], [])
        self.assertTrue(result['errors'])

    def test_duplicate_or_wrong_canonical_fails(self):
        self.assertTrue(head.assess('<head>' + META * 2 + '</head>', URL)['errors'])
        self.assertTrue(head.assess('<head>' + META + '</head>', URL + 'wrong')['errors'])

    def test_noindex_is_explicit(self):
        html = '<head>' + META + '<meta name="robots" content="noindex, follow"></head>'
        self.assertTrue(head.assess(html, URL)['errors'])
        self.assertEqual(head.assess(html, URL, noindex=True)['errors'], [])


if __name__ == '__main__':
    unittest.main()
