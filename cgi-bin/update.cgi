#!/usr/bin/python
# dump.cgi will dump all of the @asianhope.org accounts that a given user
# can access. Access is controlled by normal LDAP ACLs
# If a user cannot bind to the server, an error is returned.
    
import ldap
import ldap.modlist as modlist
import cgi
#better errors, disable in production
import cgitb
cgitb.enable()

import os,sys
import json

def main():
    #print "Content-type: application/json; charset=utf-8"
    print "Content-type: text/html; charset=utf-8"
    print
    formData = cgi.FieldStorage()
    username = formData.getlist("username")[0]
    pw = formData.getlist("pw")[0]
    
    field = formData.getlist("field")[0]
    data = formData.getlist("data")[0]
    uid = formData.getlist("uid")[0]

    
    slave = ldap.initialize("ldaps://ldap02.asianhope.org:636")
    slave.protocol_version = ldap.VERSION3
    susername = "uid="+username+",cn=users,dc=asianhope,dc=org"
    try:
        slave.simple_bind_s(susername,pw)
    except:
        print '{"result":"error"}'
        slave.unbind_s()
        sys.exit(1)

    sbaseDN = "cn=users,dc=asianhope,dc=org"
    ssearchScope = ldap.SCOPE_SUBTREE
    sretrieveAttributes = ['*']
    ssearchFilter = "uid="+uid

    #find user
    ldap_slave_result_id = slave.search(sbaseDN,ssearchScope,ssearchFilter,sretrieveAttributes)
    sresult_set = []

    #only expecting one result... if we have more than one, you'll have a bad time
    sresult_type, sresult_data = slave.result(ldap_slave_result_id,0)

    if(sresult_data == []):
        print '{"result":"error"}'
        slave.unbind_s()
        sys.exit(1)
    else:
        dn=ssearchFilter+","+sbaseDN

        #special cases
        #snkh
        #givenNamekh
        #when name is involved (not kh version) update gecos


        #if the field isn't in the result set, we need to do a MOD_ADD
        if(field not in sresult_data[0][1]):
            new = [(ldap.MOD_ADD,field,data)]

        #otherwise do a modify
        else:
            new = [(ldap.MOD_REPLACE,field,data)]


        #future - add to log file saying who performed what
        slave.modify_s(dn,new)
        print '{"result":"success"}'
        slave.unbind_s()


main()
