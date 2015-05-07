#!/usr/bin/python
# -*- coding: utf-8 -*-
from credentials import LDAP_CREDENTIALS

import cgi
import os,sys
import json
#email sending stuff
from subprocess import Popen, PIPE
from email.mime.text import MIMEText

#ldap stuff
import ldap
import ldap.modlist as modlist
from passlib.hash import ldap_md5

import json
import HTMLParser #unicode names are coming in in HTML Decimal - may need to push this to update.cgi
h = HTMLParser.HTMLParser()
#better errors, disable in production
import cgitb
cgitb.enable()

import logging
logging.basicConfig(filename='ahem.log',level=logging.DEBUG,format='%(asctime)s - %(levelname)s - %(message)s')

print "Content-type: text/html; charset=utf-8"
print
                               # blank line, end of headers
logging.debug('got a POST to register.cgi')

formData = cgi.FieldStorage()
logging.debug(formData)
#get stuff from the form
givenName = formData.getfirst("givenName","Not Entered")
sn = formData.getfirst("sn","Not Entered")
birthday = formData.getfirst("birthday","19700101")
title = formData.getfirst("title","Not Entered")
mail = formData.getfirst("mail","Not Entered")
departmentNumber = formData.getfirst("departmentNumber","Not Entered")
userPassword = formData.getfirst("userPassword","Not Entered")
message = formData.getfirst("message","Not Entered")
employeeType= formData.getvalue("employeeType") #radio buttons are tricky - have to get value
l = formData.getvalue("l","US")
c = formData.getfirst("c","Not Entered")
startdate = formData.getfirst("startdate","Not Entered")
postalAddress = formData.getfirst("postalAddress","Not Entered")
mailpr = formData.getfirst("mailpr","Not Entered")
snkh = h.unescape(formData.getfirst("snkh","Not Entered")) #stuff comes in encoded HTML Decimal format?
givenNamekh = h.unescape(formData.getfirst("givenNamekh","Not Entered"))
mobile = formData.getfirst("mobile","Not Entered")
myuid = formData.getfirst("myuid","Not Entered")
mypass = formData.getfirst("mypass","Not Entered")
#get dob in apple-birthday format, magic number at the end is 7:00am, UTC+7
dob = birthday.replace('-','')+'070000Z'

#pull out the username
splits = mail.split('@')
username = splits[0]

#don't require a valid certificate.. we don't currently have one!
ldap.set_option(ldap.OPT_X_TLS_REQUIRE_CERT, ldap.OPT_X_TLS_NEVER)

#open connection to LDAP
s = ldap.initialize("ldaps://ldap02.asianhope.org:636/")
s.protocol_version = ldap.VERSION3

lusername = LDAP_CREDENTIALS['dn']
lpassword = LDAP_CREDENTIALS['password']

logging.info('user: %s requested an account for %s',myuid,mail)
try:
    s.simple_bind_s(lusername,lpassword)
except:
    logging.debug('Could not bind to LDAP server with username: %s',myuid)
    sys.exit(0)

logging.debug('credentials check out.')
#find next availble uid from Synology
sbaseDN="cn=synoconf,dc=asianhope,dc=org"
ssearchScope = ldap.SCOPE_SUBTREE
sretrieveAttributes = ['uidNumber']
ssearchFilter='cn=CurID'
ldap_result_id = s.search(sbaseDN,ssearchScope,ssearchFilter,sretrieveAttributes)
result_set = []
result_type, result_data = s.result(ldap_result_id,0)
uidnumber=result_data[0][1]['uidNumber'][0]
logging.debug('Next available uid is: %s',uidnumber)
#and increment it immediately. Better to have non-sequential UIDs than to have overlapping!
uiddn = "cn=CurID,cn=synoconf,dc=asianhope,dc=org"
old = result_data[0][1]
new = {'uidNumber':str(int(uidnumber)+1)}
logging.debug(new)
uidldif=modlist.modifyModlist(old,new)
s.modify_s(uiddn,uidldif)
logging.debug('Incrementing it')

'''
#verify uploaded file came through correctly
fileitem = formData['image']
if fileitem.filename:
    fn = os.path.basename(fileitem.filename)
    #write file to OS
    open('files/' + str(uidnumber)+".jpg", 'wb').write(fileitem.file.read())

else:
    pass
'''
logging.debug('Building LDIF')

#write new user to requests CN
dn="uid="+username+",cn=requests,dc=asianhope,dc=org"
attrs={}
#Synology LDAP attributes
attrs['objectclass'] = ['apple-user','extensibleObject','inetOrgPerson','organizationalPerson',
                        'person','posixAccount','shadowAccount','sambaSamAccount','sambaIdmapEntry',
                        'top']

attrs['cn'] = username

attrs['homeDirectory'] = '/home/'+username
attrs['loginShell'] = '/bin/bash' #once approved we'll change this
attrs['sambaSID'] = 'S-1-5-21-3527002495-2526512175-3850050249-'+str(uidnumber)#need to generate last bit?
attrs['sn'] = sn
attrs['givenName'] = givenName
attrs['gecos']= givenName+' '+sn
attrs['uid'] = username
attrs['departmentNumber'] = departmentNumber
attrs['displayName'] = username

attrs['employeeNumber'] = str(uidnumber)
attrs['uidNumber'] = str(uidnumber)
attrs['gidNumber'] = '1000001' #users
attrs['l'] = l
attrs['c'] = c

attrs['postalAddress'] = postalAddress
attrs['mobile'] = mobile

attrs['employeeType'] = employeeType #Staff employeeType is 'S'
attrs['title'] = title #Their title is their title!

attrs['mail'] = mail
attrs['apple-birthday'] = dob
#attrs['userPassword'] = ldap_md5.encrypt(password)
attrs['userPassword'] = userPassword #plaintext is fine for unapproved accounts. We can recover and display until they change it

json_attrs = {'snkh':snkh, 'givenNamekh':givenNamekh,'mailpr':mailpr,'startdate':startdate}
attrs['jsonData'] = json.dumps(json_attrs)

ldif=modlist.addModlist(attrs)
logging.debug(ldif)
s.add_s(dn,ldif)

#unbind, because we're nice.
s.unbind_s()
print '{"result":"success"}'

'''
#debug
print '{'
print '"cn": "'+username+'",'
print '"uid": "'+username+'",'
print '"displayName": "'+fname+' '+lname+'",'
print '"givenName": "'+fname+'",'
#print '"givenName": "'+givenNamekh+'",'
print '"sn": "'+lname+'",'
#print '"sn": "'+snkh+'",'
print '"departmentNumber": "'+site+'",'
print '"mail": "'+email+'",'
print '"mail": "'+mailpr+'",'
print '"title": "'+attrs['title']+'",'
print '"uidNumber": "'+str(uidnumber)+'",'
print '"employeeNumber": "'+str(uidnumber)+'",'
print '"sambaSID": "'+'S-1-5-21-3527002495-2526512175-3850050249-'+str(uidnumber)+'",'
print '"gidNumber": "1000001",'
print '"employeeType": "'+attrs['employeeType']+'",'
print '"c": "'+nationality+'",'
print '"l": "'+location+'",'
print '"mobile": "'+phone+'",'
print '"postalAddress": "'+postal_address+'",'
print '"userPassword: "'+password+'",'
print '"":""},'


print "message: "+message
print "start date: "+start_date
'''
#send email
msg = MIMEText(message)
msg['To'] = 'lyle@asianhope.org'
msg['From'] = 'noreply@asianhope.org'
msg['Subject'] = 'New Account Request: ' +departmentNumber+'-'+username
try:
    p = Popen(["/usr/sbin/sendmail", "-t"], stdin=PIPE)
    p.communicate(msg.as_string())
except Exception:
    pass
