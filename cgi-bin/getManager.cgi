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
from dump import jsonifyUser

#better errors, disable in production
#import cgitb
#cgitb.enable()

import os,sys
import json
import logging
from encryptPassword import decrypt_pw

logging.basicConfig(filename='ahem.log',level=logging.DEBUG,format='%(asctime)s - %(levelname)s - %(message)s')

def getUsers():

    formData = cgi.FieldStorage()
    username = formData.getlist("username")[0]
    pw = formData.getlist("pw")[0]
    managerDN = formData.getlist("dn")[0]
    encrypted= formData.getfirst("encrypted","false")

    results = {}
    logging.debug('%s attempting to pull manager: %s', username,managerDN)

    if encrypted == 'true':
      pw = decrypt_pw(pw)
      if pw == 'error':
        logging.warning('Decrypt password failed')
        return '{"result":"error"}'
    #don't require a valid certificate.. we don't currently have one!
    ldap.set_option(ldap.OPT_X_TLS_REQUIRE_CERT, ldap.OPT_X_TLS_NEVER)

    slave = ldap.initialize(SERVER)
    slave.protocol_version = ldap.VERSION3
    susername = "uid="+username+",cn=users,dc=asianhope,dc=org"
    try:
        slave.simple_bind_s(susername,pw)
    except:
        logging.debug('getManager.cgi could not bind to server')
        slave.unbind_s()
        results['result'] = 'error'
        return results
        sys.exit(1)

    sbaseDN = managerDN
    ssearchScope = ldap.SCOPE_SUBTREE

    ldap_slave_result_id = slave.search(sbaseDN,ssearchScope)
    try:
      sresult_type, sresult_data = slave.result(ldap_slave_result_id,0)
      manager = jsonifyUser(sresult_data)
      # convert from uid=ssang,cn=users,dc=asianhope,dc=org to cn=users
      cnGroup =  sresult_data[0][0].split(",")[1] # cn=users
      manager['cnGroup'] = cnGroup[ cnGroup.index("=")+1: ] #users
      results['data'] = manager
      results['result'] = 'success'
      return results
    # if could not find manger in that dn, try to find other dn
    except ldap.NO_SUCH_OBJECT:
      dn=managerDN.split(",")[0]
      cn = dn[ dn.index("=")+1: ] # ssang
      ssearchFilter = '(cn='+cn+')'
      ldap_slave_result_id = slave.search("dc=asianhope,dc=org",ssearchScope,ssearchFilter)
      try:
        sresult_type, sresult_data = slave.result(ldap_slave_result_id,0)
        if sresult_data == []:
          results['result'] = 'not_found'
          return results

        manager_correct_dn = sresult_data[0][0]
        # get employees who have this(incorrect) manager dn, and replace with correct dn with this uid
        employees = slave.search_s("dc=asianhope,dc=org",ssearchScope,'(manager='+managerDN+')')
        # print manager
        for dn,entry in employees:
          new = [
              (ldap.MOD_REPLACE,'manager',manager_correct_dn),
          ]

          slave.modify_s(dn,new)
        manager = jsonifyUser(sresult_data)
          # convert from uid=ssang,cn=users,dc=asianhope,dc=org to cn=users
        cnGroup =  sresult_data[0][0].split(",")[1] # cn=users
        manager['cnGroup'] = cnGroup[ cnGroup.index("=")+1: ] #users
        results['data'] = manager
        results['result'] = 'dn_changed'
        return results
      except ldap.NO_SUCH_OBJECT:
        results['result'] = 'not_found'
        return results


if __name__ == "__main__":
    print "Content-type: application/json; charset=utf-8"
    #print "Content-type: text/html; charset=utf-8"
    print
    users = getUsers()

    print json.dumps(users)
