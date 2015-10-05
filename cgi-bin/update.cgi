#!/usr/bin/python
# -*- coding: utf-8 -*-
# dump.cgi will dump all of the @asianhope.org accounts that a given user
# can access. Access is controlled by normal LDAP ACLs
# If a user cannot bind to the server, an error is returned.

#email sending stuff
from subprocess import Popen, PIPE
from email.mime.text import MIMEText

import ldap
import ldap.modlist as modlist

from clickatell.http import Http
from credentials import CLICKATELL_CREDENTIALS
from credentials import LDAP_CREDENTIALS
from credentials import SERVER

from passlib.hash import ldap_md5

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
    'mobile',
    'postalAddress',
    'apple-birthday',
    'jsonData',
    'userPassword',
    'postalAddress'
]
def main():
    formData = cgi.FieldStorage()
    username = formData.getvalue("username",None)
    pw = formData.getvalue("pw",None)

    field = formData.getvalue("field",None)

    uid = formData.getvalue("uid",None)
    cn = formData.getvalue("cn",None)
    modifyType = formData.getvalue("modifyType",None)
    try:
        data = urllib.unquote(formData.getvalue("data",None))
    except:
        data = None
    try:
        reset_type = formData.getvalue("reset_type",None)
    except:
        reset_type = None

    password = data
    if field!="userPassword":
        logging.debug('%s attempting to modify user %s, field: %s, data: %s', username, uid, field, data)
    else:
        logging.debug('%s attempting to modify password',username)
    #don't require a valid certificate.. we don't currently have one!
    ldap.set_option(ldap.OPT_X_TLS_REQUIRE_CERT, ldap.OPT_X_TLS_NEVER)

    slave = ldap.initialize(SERVER)
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
        # sys.exit(1)
    # update group
    if(cn=='groups'):
        # if remove emplyee to group
        if(modifyType=='remove'):
            # remove
            modify = [
                (ldap.MOD_DELETE,'memberUid',data),
                (ldap.MOD_DELETE,'member','uid='+uid+',cn=users,dc=asianhope,dc=org')
            ]
        # if add emplyee to group
        if(modifyType=='add'):
            # add
            modify = [
                (ldap.MOD_ADD,'memberUid',data),
                (ldap.MOD_ADD,'member','uid='+uid+',cn=users,dc=asianhope,dc=org')
            ]

        sbaseDN = "cn=groups,dc=asianhope,dc=org"
        ssearchScope = ldap.SCOPE_SUBTREE
        sretrieveAttributes = None;
        ssearchFilter = "cn="+field

        #find groups
        ldap_slave_result_id = slave.search(sbaseDN,ssearchScope,ssearchFilter,sretrieveAttributes)
        sresult_set = []

        #only expecting one result... if we have more than one, you'll have a bad time
        sresult_type, sresult_data = slave.result(ldap_slave_result_id,0)

        if(sresult_data == []):
            return '{"result":"error not found"}'
            logging.debug('update.cgi could not find cn')
            slave.unbind_s()
            sys.exit(1)
        else:
            #pull the dn from the search result
            dn=sresult_data[0][0]
        try:
            slave.modify_s(dn,modify)
        # if vaule aleady exist
        except ldap.TYPE_OR_VALUE_EXISTS:
            return '{"result":"value_exists"}'
        # if no value to remove
        except ldap.NO_SUCH_ATTRIBUTE:
            return '{"result":"no_such_attribute"}'
        except Exception:
            return '{"result":"error"}'
        else:
            return '{"result":"success"}'
        slave.unbind_s()
    # update user
    if(cn=='users'):
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
            return '{"result":"error"}'
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

                if(field == 'userPassword'):
                    data = convertPassword(data)
                    #userPassword isn't normally returned, so let's trick the below
                    sresult_data[0][1]['userPassword']=data
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
                #this breaks with family_data, but you can't see family data unless you have a spouse
                        new = [(ldap.MOD_ADD,'jsonData','{"'+field+'":"'+data+'"}')]
                        logging.debug('update.cgi field %s not found, adding it', field)
                    #otherwise do a modify
                    else:
                        original = json.loads(sresult_data[0][1]['jsonData'][0])
                #first try to load the incoming data as json
                        try:
                            original[field]=json.loads(data)
                        except ValueError: #if that doesn't work, it's probably a single value
                            original[field]=data
                        modified = json.dumps(original)
                        new = [(ldap.MOD_REPLACE,'jsonData',modified)]
                        logging.debug('update.cgi field %s found, modifying it', field)
                    slave.modify_s(dn,new)
            return '{"result":"success"}'
            slave.unbind_s()
            logging.info('%s modified user %s, field: %s, data: %s', username, uid, field, data)
            ##send email when reset password
            if(field == 'userPassword'):
                if(reset_type == 'youreset'):
                    reset_password= '''
                    <html>
                    <head></head>
                    <body>

                    <p>Hi '''+username+''',</p>
                    <p>Your AHEM password has been changed.</p>

                    '''
                    msg = MIMEText(reset_password + '</body></html>','html')
                    msg['To'] = username+'@asianhope.org'
                    msg['From'] = 'noreply@asianhope.org'
                    msg['Subject'] = 'Password changed'
                    try:
                        p = Popen(["/usr/sbin/sendmail", "-t"], stdin=PIPE)
                        p.communicate(msg.as_string())
                    except Exception:
                        pass
                else:
                    to_admin_reset_password= '''
                    <html>
                    <head></head>
                    <body>

                    <p>Hi '''+username+''',</p>
                    <p>'''+uid+''' AHEM password has been changed.</p>
                    <p>The Temporary Password is : '''+password+'''</p>

                    '''
                    to_user_reset_password= '''
                    <html>
                    <head></head>
                    <body>

                    <p>Hi '''+uid+''',</p>
                    <p>Your AHEM password has been changed.</p>
                    <p>The Temporary Password is : '''+password+'''</p>

                    '''
                    msg = MIMEText(to_admin_reset_password + '</body></html>','html')
                    msg['To'] = username+'@asianhope.org'
                    msg['From'] = 'noreply@asianhope.org'
                    msg['Subject'] = 'Password changed'
                    try:
                        p = Popen(["/usr/sbin/sendmail", "-t"], stdin=PIPE)
                        p.communicate(msg.as_string())
                    except Exception:
                        pass
                    msg = MIMEText(to_user_reset_password + '</body></html>','html')
                    msg['To'] = uid+'@asianhope.org'
                    msg['From'] = 'noreply@asianhope.org'
                    msg['Subject'] = 'Password changed'
                    try:
                        p = Popen(["/usr/sbin/sendmail", "-t"], stdin=PIPE)
                        p.communicate(msg.as_string())
                    except Exception:
                        pass
            #-----------end send mail-------
            #and finally, if it was their mobile number - let them know it was updated!
            if username == uid and field == 'mobile':
                clickatell = Http(CLICKATELL_CREDENTIALS['username'],CLICKATELL_CREDENTIALS['password'],CLICKATELL_CREDENTIALS['apiID'])
                response = clickatell.sendMessage(data,"This number is now your AH emergency contact number", {'from':'AHALERTS'})
                logging.info('clickatell message sent, response: %s', response)

    else:
        return '{"result":"error"}'
def convertToAppleBirthday(data):
    #strip out - and add the magic time string for UTC Midnight
    return data.replace('-','')+'000000Z'

def convertPassword(data):
    #TODO: trigger a GADS refresh by posting to a URL
    return ldap_md5.encrypt(data)

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


if __name__ == "__main__":
    print "Content-type: text/html; charset=utf-8"
    print
    update_result=main()
    print update_result
