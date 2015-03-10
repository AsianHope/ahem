#!/usr/bin/python
# dump.cgi will dump all of the @asianhope.org accounts that a given user
# can access. Access is controlled by normal LDAP ACLs
# If a user cannot bind to the server, an error is returned.

import ldap
import ldap.modlist as modlist
import cgi
#better errors, disable in production
#import cgitb
#cgitb.enable()

import os,sys
import json
import logging
logging.basicConfig(filename='ahem.log',level=logging.DEBUG,format='%(asctime)s - %(levelname)s - %(message)s')

def main():
    print "Content-type: application/json; charset=utf-8"
    #print "Content-type: text/html; charset=utf-8"
    print
    formData = cgi.FieldStorage()
    username = formData.getlist("username")[0]
    pw = formData.getlist("pw")[0]

    logging.debug('%s attempting to log in.', username)
    #don't require a valid certificate.. we don't currently have one!
    ldap.set_option(ldap.OPT_X_TLS_REQUIRE_CERT, ldap.OPT_X_TLS_NEVER)

    slave = ldap.initialize("ldaps://ldap02.asianhope.org:636")
    slave.protocol_version = ldap.VERSION3
    susername = "uid="+username+",cn=users,dc=asianhope,dc=org"
    try:
        slave.simple_bind_s(susername,pw)
    except:
        print '{"result":"error"}'
        logging.warning('Bind failed - aborting')
        sys.exit(1)


    logging.info('%s logged in.', username)
    sbaseDN = "cn=users,dc=asianhope,dc=org"
    ssearchScope = ldap.SCOPE_SUBTREE
    sretrieveAttributes = ['*']
    #employees are either FT or PT and don't belong to the CPU department, others are students
    ssearchFilter = "(&(!(departmentNumber=CPU))(|(employeeType=FT)(employeeType=PT)))"

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
    logging.info('dump delivered.', username)

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
        printAttribute(user,'apple-birthday',0,'appleBirthday')
        print '"":""},' #this is a silly hack to fake out the last attributes comma

def printAttribute(user,attribute,index,attrname=None):
    if attrname is None:
            attrname=attribute
    try:
        print '"'+attrname+'": "'+user[0][1][attribute][index]+'",'
    except:
        return

main()
