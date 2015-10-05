import imp
import unittest
from mock import patch
from credentials import TEST
import json

import dump

class TestAHEMBackend(unittest.TestCase):

    def setup(self):
        pass

    def test_dump(self):
        pass

@patch('cgi.FieldStorage')

class TestDump(unittest.TestCase):
    class TestField(object):
         def __init__(self, value):
            self.value = value

    unprivileged = {'username':TEST['UPUSER'],'pw':TEST['UPPASS'],'scope':'ALL'}
    badpw = {'username':TEST['UPUSER'],'pw':'badpw','scope':'ALL'}
    admin = {'username':TEST['ADMINUSER'],'pw':TEST['ADMINPASS'],'scope':'ALL'}
    unemployed = {'username':TEST['UPUSER'],'pw':TEST['UPPASS'],'scope':'DISABLED'}
    request = {'username':TEST['UPUSER'],'pw':TEST['UPPASS'],'scope':'REQUESTS'}
    group = {'username':TEST['UPUSER'],'pw':TEST['UPPASS'],'scope':'GROUPS'}

    #test unprivileged user
    def test_unprivilged(self,MockClass):
        instance = MockClass.return_value
        instance.getlist = lambda key: [self.unprivileged[key]]
        instance.__getitem__ = lambda s, key: self.unprivileged[key]
        instance.__contains__= lambda s, key: key in self.unprivileged
        users = dump.getUsers()
        self.assertNotEqual(users,None)
        #unprivileged users should NOT have access to special fields
        #this is, perhaps, more of a test of server config than of the code
        self.assertFalse(hasBirthday(users))

    def test_badpw(self,MockClass):
        instance = MockClass.return_value
        instance.getlist = lambda key: [self.badpw[key]]
        instance.__getitem__ = lambda s, key: self.badpw[key]
        instance.__contains__= lambda s, key: key in self.badpw
        users = dump.getUsers()
        self.assertEqual(users,None)

    def test_admin(self,MockClass):
        instance = MockClass.return_value
        instance.getlist = lambda key: [self.admin[key]]
        instance.__getitem__ = lambda s, key: self.admin[key]
        instance.__contains__= lambda s, key: key in self.admin
        users = dump.getUsers()
        self.assertNotEqual(users,None)
        #privileged users should have access to special fields
        #this is, perhaps, more of a test of server config than of the code
        self.assertTrue(hasBirthday(users))

    def test_scope_DISABLED(self,MockClass):
        instance = MockClass.return_value
        instance.getlist = lambda key: [self.unemployed[key]]
        instance.__getitem__ = lambda s, key: self.unemployed[key]
        instance.__contains__= lambda s, key: key in self.unemployed
        users = dump.getUsers()
        self.assertNotEqual(users,None)
        self.assertTrue(onlyDisabledUsers(users))
    def test_scope_REQUESTS(self,MockClass):
        instance = MockClass.return_value
        instance.getlist = lambda key: [self.request[key]]
        instance.__getitem__ = lambda s, key: self.request[key]
        instance.__contains__= lambda s, key: key in self.request
        users = dump.getUsers()
        self.assertNotEqual(users,None)
    def test_scope_GROUPS(self,MockClass):
        instance = MockClass.return_value
        instance.getlist = lambda key: [self.group[key]]
        instance.__getitem__ = lambda s, key: self.group[key]
        instance.__contains__= lambda s, key: key in self.group
        groups = dump.getUsers()
        self.assertNotEqual(groups,None)
        self.assertTrue(hasMemberUid(groups))

def hasBirthday(users):
    hasbirthday = False
    if users is not None:
        for user in users:
            try:
                if user['applebirthday']:
                    hasbirthday = True
            except KeyError:
                continue
    return hasbirthday

def onlyDisabledUsers(users):
    onlydisabled = True
    if users is not None:
        for user in users:
            try:
                if user['employeeType']!= 'NLE':
                    onlydisabled = False
            except:
                continue
    return onlydisabled
def hasMemberUid(groups):
    hasMemberUid = False
    if groups is not None:
        for group in groups:
            try:
                if group['memberUid']:
                    hasMemberUid = True
            except:
                continue
    return hasMemberUid
if __name__ == '__main__':
    unittest.main()
