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
import re
from random import randint
logging.basicConfig(filename='ahem.log',level=logging.DEBUG,format='%(asctime)s - %(levelname)s - %(message)s')

def verifyuser():
    formData = cgi.FieldStorage()
    uid = formData.getlist("uid")[0]
    givenName = formData.getlist("givenName")[0]
    sn = formData.getlist("sn")[0]
    is_change_uid = formData.getlist("isChangeUid")[0]

    # convert to boolean
    is_change_uid = True if is_change_uid == 'true' or is_change_uid == True else False

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
    ssearchFilter = "uid=*"

    logging.debug('verifiying that uid: %s does not exist',uid)

    ldap_slave_result_id = slave.search(sbaseDN,ssearchScope,ssearchFilter,sretrieveAttributes)
    sresult_set = []
    list_of_uid = []
    while 1:
       sresult_type, sresult_data = slave.result(ldap_slave_result_id,0)
       if(sresult_data == []):
           break
       else:
            list_of_uid.append(sresult_data[0][1]['uid'][0])

    if is_change_uid == True:
        if uid in list_of_uid:
            return 1
        else:
            return uid
    else:
        generated_uid = checkAndGenerateUid(givenName,sn,list_of_uid,uid)
        if generated_uid in list_of_uid:
            return 1
        else:
            return generated_uid

def checkAndGenerateUid(givenName,sn,used_names,uid=None):
    #strip non alphanumerics and spaces
    pattern = re.compile(r'([^\S\w]|_)+')

    if uid is None:
        #first initial last name
        uid = pattern.sub('',(givenName[0]+sn).lower())


    #if uid exists in used_names, mutate names and call again
    i = 2;
    while uid in used_names:
        #try a different pattern
        if i<len(givenName):
            uid = pattern.sub('',(givenName[:i]+'.'+sn).lower())
        else:
            uid = pattern.sub('',(givenName[0]+sn).lower()+str(randint(0,99)))
            break
        i+=1
    return uid
if __name__ == '__main__':
    print "Content-Type: text/html"     # HTML is following
    print                               # blank line, end of headers
    print verifyuser()
