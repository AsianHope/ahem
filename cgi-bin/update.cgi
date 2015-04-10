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

import logging
logging.basicConfig(filename='ahem.log',level=logging.DEBUG,format='%(asctime)s - %(levelname)s - %(message)s')

ldapfields = [
    'cn',
    'givenName',
    'sn',
    'departmentNumber',
    'mail',
    'title',
    'employeeType',
    'c',
    'l',
    'mobile'
    'postalAddress',
    'apple-birthday',
    'jsonData'
]

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

    logging.debug('%s attempting to modify user %s, field: %s, data: %s', username, uid, field, data)
    #don't require a valid certificate.. we don't currently have one!
    ldap.set_option(ldap.OPT_X_TLS_REQUIRE_CERT, ldap.OPT_X_TLS_NEVER)

    slave = ldap.initialize("ldaps://ldap02.asianhope.org:636")
    slave.protocol_version = ldap.VERSION3
    susername = "uid="+username+",cn=users,dc=asianhope,dc=org"
    try:
        slave.simple_bind_s(susername,pw)
    except:
        print '{"result":"error"}'
        logging.debug('update.cgi could not bind to server')
        slave.unbind_s()
        sys.exit(1)

    sbaseDN = "dc=asianhope,dc=org"
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
        logging.debug('update.cgi could not find uid')
        slave.unbind_s()
        sys.exit(1)
    else:
        #pull the dn from the search result
        dn=sresult_data[0][0]

        #if it's an ldap field, we should insert it directly
        if field in ldapfields:

            #unless if it's a birthday, then we should convert it.
            if(field == 'apple-birthday'):
                data = convertToAppleBirthday(data)

            #if the field isn't in the result set, we need to do a MOD_ADD
            if(field not in sresult_data[0][1]):
                new = [(ldap.MOD_ADD,field,data)]
                logging.debug('update.cgi field %s not found, adding it', field)
            #otherwise do a modify
            else:
                new = [(ldap.MOD_REPLACE,field,data)]
                logging.debug('update.cgi field %s found, modifying it', field)


            #future - add to log file saying who performed what
            slave.modify_s(dn,new)
        #if it's an extended field, then we're going to pull the JSON and rewrite it
        else:
                #if the jsonData hasn't been added to the entry, add it.
                if('jsonData' not in sresult_data[0][1]):
                    new = [(ldap.MOD_ADD,'jsonData','{"'+field+'":"'+data+'"}')]
                    logging.debug('update.cgi field %s not found, adding it', field)
                #otherwise do a modify
                else:
                    original = json.loads(sresult_data[0][1]['jsonData'][0])
                    original[field]=data
                    modified = json.dumps(original)
                    new = [(ldap.MOD_REPLACE,'jsonData',modified)]
                    logging.debug('update.cgi field %s found, modifying it', field)

                slave.modify_s(dn,new)
        print '{"result":"success"}'
        slave.unbind_s()
        logging.info('%s modified user %s, field: %s, data: %s', username, uid, field, data)



def convertToAppleBirthday(data):
    #strip out - and add the magic time string for UTC Midnight
    return data.replace('-','')+'000000Z'

def updateName(slave, dn, field, data, previous_data):

    if field == 'sn':
        new = [(ldap.MOD_REPLACE,'gecos',previous_data[0][1]['givenName'][0]+" "+data)]
    else:
        new = [(ldap.MOD_REPLACE,'gecos',data+" "+previous_data[0][1]['sn'][0])]

    slave.modify_s(dn,new)
    clearsn = [(ldap.MOD_REPLACE, field, data)]
    slave.modify_s(dn,clearsn)

    #add back the Khmer entries if they existed
    try:
    	previousentrykh = [(ldap.MOD_ADD, field, previous_data[0][1][field][1])]
    	slave.modify_s(dn,previousentrykh)
    except:
	logging.debug("No previous Khmer name to add back")
main()
