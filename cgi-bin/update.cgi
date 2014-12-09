#!/usr/bin/python
# -*- coding: utf-8 -*-
# dump.cgi will dump all of the @asianhope.org accounts that a given user
# can access. Access is controlled by normal LDAP ACLs
# If a user cannot bind to the server, an error is returned.

import ldap
import ldap.modlist as modlist
import cgi
import urllib
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
    data = urllib.unquote(formData.getlist("data")[0])
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

        #if we're getting a birthday, convert it and continue on
        if(field == 'apple-birthday'):
            data = convertToAppleBirthday(data)

        #if it's some khmer stuff or the secondary mail update the field
        if(field == 'snkh' or field == 'givenNamekh' or field == 'mailpr'):

            #(field[:-2] chops off last 2 chars) (get rid of kh/pr)
            ldapfield = field[:-2]
            #replace existing sn entries with just primary versions (English or company email)
            clearsn = [( ldap.MOD_REPLACE, ldapfield, sresult_data[0][1][ldapfield][0])]
            slave.modify_s(dn,clearsn)

            #re-add secondary version (or add it for the first time)
            new = [(ldap.MOD_ADD,ldapfield,data)]

        if((field == 'sn' or field =='givenName')):
            #update gecos to equal givenName+sn
                if field == 'sn':
                    new = [(ldap.MOD_REPLACE,'gecos',sresult_data[0][1]['givenName'][0]+" "+data)]
                else:
                    new = [(ldap.MOD_REPLACE,'gecos',data+" "+sresult_data[0][1]['sn'][0])]

                slave.modify_s(dn,new)

        #end special cases

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


def convertToAppleBirthday(data):
    #strip out - and add the magic time string for UTC+7 7AM
    return data.replace('-','')+'070000Z'
main()
