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
    admin = {'username':TEST['ADMINUSER'],'pw':TEST['ADMINPASS'],'scope':'ALL'}
    unemployed = {'username':TEST['UPUSER'],'pw':TEST['UPPASS'],'scope':'DISABLED'}

    #test unprivileged user
    def test_unprivilged(self,MockClass):
        instance = MockClass.return_value
        instance.getlist = lambda key: [self.unprivileged[key]]
        instance.__getitem__ = lambda s, key: self.unprivileged[key]
        instance.__contains__= lambda s, key: key in self.unprivileged
        users = dump.getUsers()
        self.assertNotEqual(users,'{"result":"error"}')

        #unprivileged users should NOT have access to special fields
        #this is, perhaps, more of a test of server config than of the code
        self.assertFalse(hasBirthday(users))

    def test_admin(self,MockClass):
        instance = MockClass.return_value
        instance.getlist = lambda key: [self.admin[key]]
        instance.__getitem__ = lambda s, key: self.admin[key]
        instance.__contains__= lambda s, key: key in self.admin
        users = dump.getUsers()
        self.assertNotEqual(users,'{"result":"error"}')

        #privileged users should have access to special fields
        #this is, perhaps, more of a test of server config than of the code
        self.assertTrue(hasBirthday(users))

    def test_scope(self,MockClass):
        instance = MockClass.return_value
        instance.getlist = lambda key: [self.unemployed[key]]
        instance.__getitem__ = lambda s, key: self.unemployed[key]
        instance.__contains__= lambda s, key: key in self.unemployed
        users = dump.getUsers()
        self.assertNotEqual(users,'{"result":"error"}')
        self.assertTrue(onlyDisabledUsers(users))

def hasBirthday(users):
    hasbirthday = False
    for user in users:
        try:
            if user['applebirthday']:
                hasbirthday = True
        except KeyError:
            continue
    return hasbirthday

def onlyDisabledUsers(users):
    onlydisabled = True
    for user in users:
        try:
            if user['employeeType']!= 'NLE':
                onlydisabled = False
        except:
            continue
    return onlydisabled
