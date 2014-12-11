#!/usr/bin/python

import ldap
import ldap.modlist as modlist
import cgi
#better errors, disable in production
#import cgitb
#cgitb.enable()

import os,sys

print "Content-Type: text/html"     # HTML is following
print                               # blank line, end of headers

formData = cgi.FieldStorage()
uid = formData.getlist("uid")[0]

slave = ldap.initialize("ldaps://ldap02.asianhope.org:636")
slave.protocol_version = ldap.VERSION3
susername = "uid=tfoolery,cn=users,dc=asianhope,dc=org"
spassword = "starwars1"
slave.simple_bind_s(susername,spassword)

sbaseDN = "cn=users,dc=asianhope,dc=org"
ssearchScope = ldap.SCOPE_SUBTREE
sretrieveAttributes = ['uid']
ssearchFilter = "uid="+uid

ldap_slave_result_id = slave.search(sbaseDN,ssearchScope,ssearchFilter,sretrieveAttributes)
sresult_set = []
while 1:
   sresult_type, sresult_data = slave.result(ldap_slave_result_id,0)
   if(sresult_data == []):
       break
   else:
        uid='1'

print uid
