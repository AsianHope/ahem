#!/usr/bin/python
# -*- coding: utf-8 -*-
# dump.cgi will dump all of the @asianhope.org accounts that a given user
# can access. Access is controlled by normal LDAP ACLs
# If a user cannot bind to the server, an error is returned.

import ldap
import ldap.modlist as modlist

from clickatell.http import Http
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
logging.basicConfig(filename='ahem.log',level=logging.DEBUG,format='%(asctime)s - %(levelname)s - %(message)s')

def approveRequestAccount():
    formData = cgi.FieldStorage()
    username = formData.getvalue("username",None)
    pw = formData.getvalue("pw",None)
    uid = formData.getvalue("uid",None)
    action = formData.getvalue("action")
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
        logging.debug('update.cgi could not bind to server')
        slave.unbind_s()
        return '{"result":"error"}'
        sys.exit(1)
    try :
        if action == 'delete' :
            slave.delete_s('uid='+uid+',cn=requests,dc=asianhope,dc=org')
        else:
            slave.rename_s('uid='+uid+',cn=requests,dc=asianhope,dc=org', 'uid='+uid+'', 'cn=users,dc=asianhope,dc=org')
    except ldap.INSUFFICIENT_ACCESS:
        return '{"result":"permission_denied"}'
    except ldap.NO_SUCH_OBJECT:
        return '{"result":"no_such_object"}'
    else:
        return '{"result":"success"}'


if __name__ == "__main__":
    print "Content-type: text/html; charset=utf-8"
    print
    print approveRequestAccount()
