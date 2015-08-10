#!/usr/bin/python
# -*- coding: utf-8 -*-
# dump.cgi will dump all of the @asianhope.org accounts that a given user
# can access. Access is controlled by normal LDAP ACLs
# If a user cannot bind to the server, an error is returned.

from credentials import LDAP_CREDENTIALS
from credentials import SERVER

from credentials import OPTIONS
import ldap
import ldap.modlist as modlist
import cgi

#better errors, disable in production
#import cgitb
#cgitb.enable()

import os,sys
import json
import logging
logging.basicConfig(filename='ahem.log',level=logging.DEBUG,format='%(asctime)s - %(levelname)s - %(message)s')

def getUsers():

    #if we're in offline mode, just print and exit.
    if(OPTIONS['OFFLINE_MODE']):
        f = open(OPTIONS['OFFLINE_FILE'],'r')
        for line in f:
            print line,
        sys.exit(0)

    formData = cgi.FieldStorage()
    username = formData.getlist("username")[0]
    pw = formData.getlist("pw")[0]
    scope = formData.getlist("scope")[0]

    logging.debug('%s attempting to pull data in scope: %s', username,scope)
    #don't require a valid certificate.. we don't currently have one!
    ldap.set_option(ldap.OPT_X_TLS_REQUIRE_CERT, ldap.OPT_X_TLS_NEVER)

    slave = ldap.initialize(SERVER)
    slave.protocol_version = ldap.VERSION3
    susername = "uid="+username+",cn=users,dc=asianhope,dc=org"
    try:
        slave.simple_bind_s(susername,pw)
    except:
        logging.warning('Bind failed - aborting')
        return None

    logging.info('%s logged in.', username)

    sbaseDN = "cn=users,dc=asianhope,dc=org"
    ssearchScope = ldap.SCOPE_SUBTREE
    sretrieveAttributes = ['*']
    #employees are either FT or PT and don't belong to the CPU or DUP department, others are students
    ssearchFilter = "(&(!(|(departmentNumber=CPU)(departmentNumber=DUP)))(|(employeeType=FT)(employeeType=PT)))"

    if scope=='REQUESTS':
        sbaseDN = "cn=requests,dc=asianhope,dc=org"

    elif scope=='DISABLED':
        ssearchFilter = '(employeeType=NLE)'

    elif scope=='INACTIVE':
        ssearchFilter = 'mail=*@asianhope.org'
        sbaseDN = "cn=disabled,dc=asianhope,dc=org"

    ldap_slave_result_id = slave.search(sbaseDN,ssearchScope,ssearchFilter,sretrieveAttributes)
    sresult_set = []
    users = []
    while 1:
       sresult_type, sresult_data = slave.result(ldap_slave_result_id,0)
       if(sresult_data == []):
           break
       else:
           users.append(jsonifyUser(sresult_data))

    logging.info('dump delivered.')
    return users

def jsonifyUser(user):
        userjson = dict()
        ldapfields = [
            'cn',
            'uid',
            'displayName',
            'cn',
            'givenName',
            'sn',
            'departmentNumber',
            'mail',
            'title',
            'uidNumber',
            'employeeNumber',
            'employeeType',
            'c',
            'l',
            'mobile',
            'postalAddress'
        ]

        #assign values for all fields with something in them
        for field in ldapfields:
            attr = getAttribute(user,field)
            if attr is not None:
                userjson[field] = attr

        #special birthdays...
        attr = getAttribute(user,'apple-birthday')
        if attr is not None:
            userjson['applebirthday'] = attr

        #special JSON
        attr = getAttribute(user,'jsonData')
        if attr is not None:
	   try:
              userjson.update(json.loads(attr,'utf-8'))
	   except ValueError:
    	      logging.debug('issue processing %s: %s',userjson['uid'],attr )
	      pass

        return userjson

def getAttribute(user,attribute):
    try:
        return user[0][1][attribute][0]
    except:
        return

if __name__ == "__main__":
    users = getUsers()
    print "Content-type: application/json; charset=utf-8"
    #print "Content-type: text/html; charset=utf-8"
    print
    if users is not None:
        print json.dumps(users,'utf-8')
    else:
        print '{"result":"error"}'
