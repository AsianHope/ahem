import imp
import unittest
from mock import patch
from credentials import TEST
from passlib.hash import ldap_md5

import update

@patch('cgi.FieldStorage')

class TestUpdate(unittest.TestCase):

    update_success = {'username':TEST['ADMINUSER'],'pw':TEST['ADMINPASS'],'field':'maritalstatus','data':'Single','uid':'ssang','cn':'users','modifyType':'Null'}
    bad_password = {'username':TEST['ADMINUSER'],'pw':'bad password','field':'maritalstatus','data':'Single','uid':'ssang','cn':'users','modifyType':'Null'}
    add_group = {'username':TEST['ADMINUSER'],'pw':TEST['ADMINPASS'],'field':'testgroup','data':'ssang','uid':'ssang','cn':'groups','modifyType':'add'}
    remove_group = {'username':TEST['ADMINUSER'],'pw':TEST['ADMINPASS'],'field':'testgroup','data':'ssang','uid':'ssang','cn':'groups','modifyType':'remove'}

    def test_bad_password(self,MockClass):
        instance = MockClass.return_value
        instance.getvalue = lambda key,none: self.bad_password[key]
        instance.__getitem__ = lambda s, key: self.bad_password[key]
        instance.__contains__= lambda s, key: key in self.bad_password
        result = update.main()
        self.assertEqual(result,'{"result":"error"}')
    def test_update_user_success(self,MockClass):
        instance = MockClass.return_value
        instance.getvalue = lambda key,none: self.update_success[key]
        instance.__getitem__ = lambda s, key: self.update_success[key]
        instance.__contains__= lambda s, key: key in self.update_success
        result = update.main()
        self.assertEqual(result,'{"result":"success"}')
    def test_add_group_fail(self,MockClass):
        # add group
        instance = MockClass.return_value
        instance.getvalue = lambda key,none: self.add_group[key]
        instance.__getitem__ = lambda s, key: self.add_group[key]
        instance.__contains__= lambda s, key: key in self.add_group
        result = update.main()
        # ===================================
        # add group
        instance = MockClass.return_value
        instance.getvalue = lambda key,none: self.add_group[key]
        instance.__getitem__ = lambda s, key: self.add_group[key]
        instance.__contains__= lambda s, key: key in self.add_group
        result = update.main()
        self.assertEqual(result,'{"result":"value_exists"}')
    def test_add_group_success(self,MockClass):
        # remove group
        instance = MockClass.return_value
        instance.getvalue = lambda key,none: self.remove_group[key]
        instance.__getitem__ = lambda s, key: self.remove_group[key]
        instance.__contains__= lambda s, key: key in self.remove_group
        result = update.main()
        # ===================================
        # add group
        instance = MockClass.return_value
        instance.getvalue = lambda key,none: self.add_group[key]
        instance.__getitem__ = lambda s, key: self.add_group[key]
        instance.__contains__= lambda s, key: key in self.add_group
        result = update.main()
        self.assertEqual(result,'{"result":"success"}')
    def test_remove_group_fail(self,MockClass):
        # remove group
        instance = MockClass.return_value
        instance.getvalue = lambda key,none: self.remove_group[key]
        instance.__getitem__ = lambda s, key: self.remove_group[key]
        instance.__contains__= lambda s, key: key in self.remove_group
        result = update.main()
        # remove group
        instance = MockClass.return_value
        instance.getvalue = lambda key,none: self.remove_group[key]
        instance.__getitem__ = lambda s, key: self.remove_group[key]
        instance.__contains__= lambda s, key: key in self.remove_group
        result = update.main()
        self.assertEqual(result,'{"result":"no_such_attribute"}')
    def test_remove_group_successl(self,MockClass):
        # add group
        instance = MockClass.return_value
        instance.getvalue = lambda key,none: self.add_group[key]
        instance.__getitem__ = lambda s, key: self.add_group[key]
        instance.__contains__= lambda s, key: key in self.add_group
        result = update.main()
        # remove group
        instance = MockClass.return_value
        instance.getvalue = lambda key,none: self.remove_group[key]
        instance.__getitem__ = lambda s, key: self.remove_group[key]
        instance.__contains__= lambda s, key: key in self.remove_group
        result = update.main()
        self.assertEqual(result,'{"result":"success"}')
    def test_convertToAppleBirthday(self,MockClass):
        data = '19960520'
        data_convert = data.replace('-','')+'000000Z'
        self.assertEqual(update.convertToAppleBirthday(data),data_convert)
    def test_convertPassword(self,MockClass):
        password = '1234567'
        password_encrypt = ldap_md5.encrypt(password)
        self.assertEqual(update.convertPassword(password),password_encrypt)
        self.assertNotEqual(update.convertPassword(password),password)
if __name__ == '__main__':
    unittest.main()
