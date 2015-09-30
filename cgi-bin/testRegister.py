import imp
import unittest
from mock import patch

from credentials import TEST
from credentials import LDAP_CREDENTIALS
from credentials import SERVER
import ldap

from register import registerAccount

@patch('cgi.FieldStorage')

class TestRegister(unittest.TestCase):
    class TestField(object):
        def __init__(self, value):
            self.value = value
    user_data = {
        'givenName':'test','sn':'test','birthday':'20150101',
        'title':'staff','mail':'test@asianhope.org',
        'departmentNumber':'ADMIN-KH',
        'userPassword':'userPasswordtest','message':'messagetest',
        'c':'CA','startdate':'Not Entered','postalAddress':'Not Entered',
        'mailpr':'Not Entered','snkh':'Not Entered','givenNamekh':'Not Entered',
        'mobile':'Not Entered','myuid':'Not Entered','mypass':'Not Entered'
        }
    user_data_exists = {
        'givenName':'testtest','sn':'testtest','birthday':'20150101',
        'title':'staff','mail':'testtest@asianhope.org',
        'departmentNumber':'ADMIN-KH',
        'userPassword':'userPasswordtest','message':'messagetest',
        'c':'CA','startdate':'Not Entered','postalAddress':'Not Entered',
        'mailpr':'Not Entered','snkh':'Not Entered','givenNamekh':'Not Entered',
        'mobile':'Not Entered','myuid':'Not Entered','mypass':'Not Entered'
        }
    employeeType = {'employeeType':'FT','l':'KH'}
    def test_register_success(self,MockClass):
        # delete dn make sure that this dn will not exists
        s = ldap.initialize(SERVER)
        s.simple_bind_s(LDAP_CREDENTIALS['dn'],LDAP_CREDENTIALS['password'])
        dn="uid=test,cn=requests,dc=asianhope,dc=org"
        try:
            s.delete_s(dn)
        except:
            pass
        # add dn
        instance = MockClass.return_value
        instance.getfirst = lambda key,agru: self.user_data[key]
        instance.__getitem__ = lambda s, key: self.user_data[key]
        instance.__contains__= lambda s, key: key in self.user_data

        instance.getvalue = lambda key,default: self.employeeType[key]
        instance.__getitem__ = lambda s, key: self.employeeType[key]
        instance.__contains__= lambda s, key: key in self.employeeType
        result = registerAccount()
        self.assertEqual(result,'{"result":"success"}')
    def test_register_exists(self,MockClass):
        instance = MockClass.return_value
        instance.getfirst = lambda key,agru: self.user_data_exists[key]
        instance.__getitem__ = lambda s, key: self.user_data_exists[key]
        instance.__contains__= lambda s, key: key in self.user_data_exists

        instance.getvalue = lambda key,default: self.employeeType[key]
        instance.__getitem__ = lambda s, key: self.employeeType[key]
        instance.__contains__= lambda s, key: key in self.employeeType
        # add Directory
        result = registerAccount()
        # add Directory again
        result = registerAccount()
        self.assertEqual(result,'{"result":"already_exists"}')

if __name__ == '__main__':
    unittest.main()
