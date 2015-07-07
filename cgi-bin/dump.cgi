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
import cgitb
cgitb.enable()

import os,sys
import json
import logging
logging.basicConfig(filename='ahem.log',level=logging.DEBUG,format='%(asctime)s - %(levelname)s - %(message)s')

def main():
    print "Content-type: application/json; charset=utf-8"
    #print "Content-type: text/html; charset=utf-8"
    print

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
        print '{"result":"error"}'
        logging.warning('Bind failed - aborting')
        sys.exit(1)


    logging.info('%s logged in.', username)

    if scope=='REQUESTS':
        sbaseDN = "cn=requests,dc=asianhope,dc=org"
    else:
        sbaseDN = "cn=users,dc=asianhope,dc=org"

    ssearchScope = ldap.SCOPE_SUBTREE
    sretrieveAttributes = ['*']

    if scope=='DISABLED':
        ssearchFilter = '(employeeType=NLE)'
    else:
        #employees are either FT or PT and don't belong to the CPU or DUP department, others are students
        ssearchFilter = "(&(!(|(departmentNumber=CPU)(departmentNumber=DUP)))(|(employeeType=FT)(employeeType=PT)))"

    ldap_slave_result_id = slave.search(sbaseDN,ssearchScope,ssearchFilter,sretrieveAttributes)
    sresult_set = []
    print '['
    while 1:
       sresult_type, sresult_data = slave.result(ldap_slave_result_id,0)
       if(sresult_data == []):
           break
       else:
           printUser(sresult_data)

    print '{}]' #additional silliness to get rid of commas
    logging.info('dump delivered.')

def printUser(user):
        print '{'
        printAttribute(user,'cn',0)
        printAttribute(user,'uid',0)
        printAttribute(user,'displayName',0)
        printAttribute(user,'givenName',0)
        printAttribute(user,'givenName',1, 'givenNamekh')
        printAttribute(user,'sn',0)
        printAttribute(user,'sn',1,'snkh')
        printAttribute(user,'departmentNumber',0)
        printAttribute(user,'mail',0)
        printAttribute(user,'mail',1,'mailpr')
        printAttribute(user,'title',0)
        printAttribute(user,'uidNumber',0)
        printAttribute(user,'employeeNumber',0)
        printAttribute(user,'employeeType',0)
        printAttribute(user,'c',0)
        printAttribute(user,'l',0)
        printAttribute(user,'mobile',0)
        printAttribute(user,'postalAddress',0)
        printAttribute(user,'apple-birthday',0,'applebirthday')
        printExtendedAttributes(user)
        print '"":""},' #this is a silly hack to fake out the last attributes comma

def printAttribute(user,attribute,index,attrname=None):
    if attrname is None:
            attrname=attribute
    try:
        print '"'+attrname+'": "'+user[0][1][attribute][index]+'",'
    except:
        return

def printExtendedAttributes(user):
    try:
        extattrs = json.loads(user[0][1]['jsonData'][0],'utf-8')
        for key, attr in extattrs.iteritems():
            print '"'+key+'": "',
            print attr.encode('unicode_escape'),
            print '",'
    except KeyError:
        return

main()
