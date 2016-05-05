#!/usr/bin/python
# -*- coding: utf-8 -*-
# deleteDuplicateAccount.cgi for delete account who have employeeType is "DUP" in dn "users"

import ldap
import ldap.modlist as modlist

from credentials import SERVER

import cgi
import urllib
#better errors, disable in production
import cgitb
cgitb.enable()

import os,sys
import json

import hashlib
import logging
import requests
logging.basicConfig(filename='ahem.log',level=logging.DEBUG,format='%(asctime)s - %(levelname)s - %(message)s')

def deleteDuplicateAccount():
    formData = cgi.FieldStorage()
    username = formData.getvalue("username",None)
    pw = formData.getvalue("pw",None)

    sbaseDN = "cn=users,dc=asianhope,dc=org"
    ssearchScope = ldap.SCOPE_SUBTREE
    sretrieveAttributes = ['cn']
    ssearchFilter = "employeeType=DUP"
    #don't require a valid certificate.. we don't currently have one!
    ldap.set_option(ldap.OPT_X_TLS_REQUIRE_CERT, ldap.OPT_X_TLS_NEVER)

    slave = ldap.initialize(SERVER)
    l = ldap.initialize(SERVER)

    slave.protocol_version = ldap.VERSION3
    try:
        susername = "uid="+username+",cn=users,dc=asianhope,dc=org"
    except:
        pass

    try:
        slave.simple_bind_s(susername,pw)
    except:
        logging.debug('deleteDuplicateAccount.cgi could not bind to server')
        slave.unbind_s()
        print '{"result":"error"}'
        sys.exit(1)

    ldap_slave_result_id = slave.search(sbaseDN,ssearchScope,ssearchFilter,sretrieveAttributes)

    sresult_type, sresult_data = slave.result(ldap_slave_result_id)
    if(sresult_data == []):
        print '{"result":"No result found"}'
    else:
        for result in sresult_data:
            try :
                print result[0] + '<br/>'
                slave.delete_s(result[0])
            except ldap.INSUFFICIENT_ACCESS:
                print '{"result":"permission_denied"}' + '<br/>'
            except ldap.NO_SUCH_OBJECT:
                print '{"result":"no_such_object"}' + '<br/>'
            else:
                print '{"result":"success"}' + '<br/>'


if __name__ == "__main__":
    print "Content-type: text/html; charset=utf-8"
    print
    deleteDuplicateAccount()
