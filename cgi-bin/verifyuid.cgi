#!/usr/bin/python
from credentials import LDAP_CREDENTIALS
from credentials import SERVER
import ldap
import ldap.modlist as modlist
import cgi
#better errors, disable in production
#import cgitb
#cgitb.enable()

import os,sys
import logging
logging.basicConfig(filename='ahem.log',level=logging.DEBUG,format='%(asctime)s - %(levelname)s - %(message)s')

def verifyuser():
    formData = cgi.FieldStorage()
    uid = formData.getlist("uid")[0]

    #don't require a valid certificate.. we don't currently have one!
    ldap.set_option(ldap.OPT_X_TLS_REQUIRE_CERT, ldap.OPT_X_TLS_NEVER)

    slave = ldap.initialize(SERVER)
    slave.protocol_version = ldap.VERSION3
    susername = LDAP_CREDENTIALS['dn']
    spassword = LDAP_CREDENTIALS['password']
    slave.simple_bind_s(susername,spassword)

    sbaseDN = "cn=users,dc=asianhope,dc=org"
    ssearchScope = ldap.SCOPE_SUBTREE
    sretrieveAttributes = ['uid']
    ssearchFilter = "uid="+uid

    logging.debug('verifiying that uid: %s does not exist',uid)

    ldap_slave_result_id = slave.search(sbaseDN,ssearchScope,ssearchFilter,sretrieveAttributes)
    sresult_set = []
    while 1:
       sresult_type, sresult_data = slave.result(ldap_slave_result_id,0)
       if(sresult_data == []):
           break
       else:
            uid='1'

    return uid
if __name__ == '__main__':
    print "Content-Type: text/html"     # HTML is following
    print                               # blank line, end of headers
    print verifyuser()
