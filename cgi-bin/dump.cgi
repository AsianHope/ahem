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

#better errors, disable in production
#import cgitb
#cgitb.enable()

import os,sys
import json
import logging
from encryptPassword import encrypt_pw,decrypt_pw
logging.basicConfig(filename='ahem.log',level=logging.DEBUG,format='%(asctime)s - %(levelname)s - %(message)s')
def getUsers():
    #if we're in offline mode, just print and exit.
    if(OPTIONS['OFFLINE_MODE']):
        f = open(OPTIONS['OFFLINE_FILE'],'r')
        for line in f:
            print line,
        sys.exit(0)

    formData = cgi.FieldStorage()
    username = formData.getlist("username")[0]
    pw = formData.getlist("pw")[0]
    scope = formData.getlist("scope")[0]
    url = formData.getfirst("url",None)
    encrypted= formData.getfirst("encrypted","false")
    is_request_admin = False
    admin = False

    logging.debug('%s attempting to pull data in scope: %s', username,scope)

    # check if password is send with encrypt or not
    if encrypted == 'true':
      encrypted_pw = pw
      pw = decrypt_pw(pw)
      if pw == 'error':
        logging.warning('Decrypt password failed')
        return None
    else:
      encrypted_pw = encrypt_pw(pw)
      if encrypted_pw == 'error':
        logging.warning('Encrypt password failed')
        return None

    #don't require a valid certificate.. we don't currently have one!
    ldap.set_option(ldap.OPT_X_TLS_REQUIRE_CERT, ldap.OPT_X_TLS_NEVER)

    slave = ldap.initialize(SERVER)
    slave.protocol_version = ldap.VERSION3
    susername = "uid="+username+",cn=users,dc=asianhope,dc=org"
    try:
        slave.simple_bind_s(susername,pw)
    except:
        logging.warning('Bind failed - aborting')
        return None

    logging.info('%s logged in.', username)

    sbaseDN = "cn=users,dc=asianhope,dc=org"
    ssearchScope = ldap.SCOPE_SUBTREE
    sretrieveAttributes = ['*']
    #employees are either FT or PT and don't belong to the CPU or DUP department, others are students
    ssearchFilter = "(&(!(|(departmentNumber=CPU)(departmentNumber=DUP)))(|(employeeType=FT)(employeeType=PT)))"

    # //permission
    sbaseDNGroup = "cn=Directory Operators,cn=groups,dc=asianhope,dc=org"
    ssearchScopeGroup  = ldap.SCOPE_SUBTREE
    ssearchFilterGroup  = "memberUid="+username

    ldap_slave_result_id = slave.search(sbaseDNGroup ,ssearchScopeGroup ,ssearchFilterGroup ,sretrieveAttributes)
    sresult_typeGroup , sresult_dataGroup  = slave.result(ldap_slave_result_id,0)
    if(sresult_dataGroup == []):
      admin = False
    else:
      admin = True
    # if request to admin url and not in admin group, return 'permission_denied'
    # check request is admin url
    if url is not None:
      is_request_admin = url.startswith("/admin")

    if (is_request_admin == True) & (admin == False):
      return "permission_denied"

    if scope=='REQUESTS':
        sbaseDN = "cn=requests,dc=asianhope,dc=org"

    elif scope=='DISABLED':
        # ssearchFilter = '(employeeType=NLE)'
        # except test user lfoolery
        ssearchFilter = '''(&
                            (employeeType=NLE)
                            (|(mail=*@asianhope.org)(!(mail=*)))
                            (!(|(departmentNumber=CPU)(departmentNumber=DUP)))
                            (!(cn=tfoolery))
                          )'''

    elif scope=='INACTIVE':
        # ssearchFilter = 'mail=*@asianhope.org'
        ssearchFilter = '''(&
                            (|(mail=*@asianhope.org)(!(mail=*)))
                            (!(|(departmentNumber=CPU)(departmentNumber=DUP)))
                            (!(cn=inactive))
                            (!(cn=tfoolery))
                        )'''
        sbaseDN = "cn=inactive,dc=asianhope,dc=org"
    # disable+inactive
    elif scope=='ALLINACTIVE':
        sbaseDN = "dc=asianhope,dc=org"
        ssearchFilter = '''(|
                          (&
                            (cn:dn:=users)
                            (employeeType=NLE)
                            (|(mail=*@asianhope.org)(!(mail=*)))
                            (!(|(departmentNumber=CPU)(departmentNumber=DUP)))
                            (!(cn=tfoolery))
                          )
                          (&
                            (cn:dn:=inactive)
                            (|(mail=*@asianhope.org)(!(mail=*)))
                            (!(|(departmentNumber=CPU)(departmentNumber=DUP)))
                            (!(cn=inactive))
                            (!(cn=tfoolery))
                          )
                          )'''

    elif scope=='GROUPS':
        ssearchFilter = 'mail=*@asianhope.org'
        sbaseDN = "cn=groups,dc=asianhope,dc=org"

    ldap_slave_result_id = slave.search(sbaseDN,ssearchScope,ssearchFilter,sretrieveAttributes)
    sresult_set = []
    users = []
    while 1:
       sresult_type, sresult_data = slave.result(ldap_slave_result_id,0)
       if(sresult_data == []):
           break
       else:
        #    print sresult_data
           users.append(jsonifyUser(sresult_data))

    logging.info('dump delivered.')
    return {
      'is_admin':admin,
      'encrypted_pw':encrypted_pw,
      'users':users,
      'result':'success'
    }
    return users

def jsonifyUser(user):
        userjson = dict()
        ldapfields = [
            'cn',
            'uid',
            'displayName',
            'cn',
            'givenName',
            'sn',
            'departmentNumber',
            'mail',
            'title',
            'uidNumber',
            'employeeNumber',
            'employeeType',
            'c',
            'l',
            'mobile',
            'postalAddress',
            'description',
            'manager',

        ]

        #assign values for all fields with something in them
        for field in ldapfields:
            attr = getAttribute(user,field)
            if attr is not None:
                userjson[field] = attr

        #special birthdays...
        attr = getAttribute(user,'apple-birthday')
        if attr is not None:
            userjson['applebirthday'] = attr

        #special JSON
        attr = getAttribute(user,'jsonData')
        if attr is not None:
            try:
               userjson.update(json.loads(attr,'utf-8'))
            except:
    	       logging.debug('issue processing %s: %s',userjson['uid'],attr )
               pass

        #special memberUid for groups
        try:
            attr = user[0][1]['memberUid']
            userjson['memberUid'] = attr
        except KeyError:
            pass

        return userjson

def getAttribute(user,attribute):
    try:
        return user[0][1][attribute][0]
    except:
        return

if __name__ == "__main__":
    users = getUsers()
    print "Content-type: application/json; charset=utf-8"
    #print "Content-type: text/html; charset=utf-8"
    print
    if users is not None:
        if users == "permission_denied":
          print '{"result":"permission_denied"}'
        else:
          print json.dumps(users,'utf-8')
    else:
        print '{"result":"error"}'
