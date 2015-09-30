import imp
import unittest
from mock import patch
from credentials import TEST

from verifyuid import verifyuser

@patch('cgi.FieldStorage')

class TestVerifyuid(unittest.TestCase):
    uid = {'uid':TEST['ADMINUSER']}
    baduid = {'uid':'baduid'}
    def test_verify_uid(self,MockClass):
        instance = MockClass.return_value
        instance.getlist = lambda key: [self.uid[key]]
        instance.__getitem__ = lambda s, key: self.uid[key]
        instance.__contains__= lambda s, key: key in self.uid
        result = verifyuser()
        self.assertEqual(result,'1')
    def test_bad_uid(self,MockClass):
        instance = MockClass.return_value
        instance.getlist = lambda key: [self.baduid[key]]
        instance.__getitem__ = lambda s, key: self.baduid[key]
        instance.__contains__= lambda s, key: key in self.baduid
        result = verifyuser()
        self.assertEqual(result,'baduid')
if __name__ == '__main__':
    unittest.main()
