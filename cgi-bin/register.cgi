#!/usr/bin/python
# -*- coding: utf-8 -*-

import cgi
import os,sys

#email sending stuff
from subprocess import Popen, PIPE
from email.mime.text import MIMEText

#ldap stuff
import ldap
import ldap.modlist as modlist
from passlib.hash import ldap_md5

import HTMLParser
h = HTMLParser.HTMLParser()
#better errors, disable in production
import cgitb
cgitb.enable()

print "Content-type: text/html; charset=utf-8"
print                               # blank line, end of headers

#get stuff from the form
formData = cgi.FieldStorage()
fname = formData.getlist("fname")[0]
lname = formData.getlist("lname")[0]
birthday = formData.getlist("birthday")[0]
title = formData.getlist("title")
email = formData.getlist("email")[0]
site = formData.getlist("site")[0]
password = formData.getlist("password")[0]
message= formData.getlist("message")[0]
employeeType= formData.getvalue("employeeType") #radio buttons are tricky - have to get value
location = formData.getvalue("l")
nationality = formData.getlist("c")[0]
start_date = formData.getlist("start_date")[0]
postal_address = formData.getlist("postalAddress")[0]
mailpr = formData.getlist("mailpr")[0]
snkh = h.unescape(formData.getlist("snkh")[0]) #stuff comes in encoded HTML Decimal format?
givenNamekh = h.unescape(formData.getlist("givenNamekh")[0])
phone = formData.getlist("phone")[0]

#get dob in apple-birthday format, magic number at the end is 7:00am, UTC+7
dob = birthday.replace('-','')+'070000Z'

#pull out the username
splits = email.split('@')
username = splits[0]

#open connection to LDAP
l = ldap.initialize("ldaps://ldap02.asianhope.org:636/")
l.protocol_version = ldap.VERSION3
lusername = "uid=root,cn=users,dc=asianhope,dc=org"
lpassword = "ldapsicksnakeow"
l.simple_bind_s(lusername,lpassword)

#find next availble uid from Synology
sbaseDN="cn=synoconf,dc=asianhope,dc=org"
ssearchScope = ldap.SCOPE_SUBTREE
sretrieveAttributes = ['uidNumber']
ssearchFilter='cn=CurID'
ldap_result_id = l.search(sbaseDN,ssearchScope,ssearchFilter,sretrieveAttributes)
result_set = []
result_type, result_data = l.result(ldap_result_id,0)
uidnumber=result_data[0][1]['uidNumber'][0]


#verify uploaded file came through correctly
fileitem = formData['image']
if fileitem.filename:
    fn = os.path.basename(fileitem.filename)
    #write file to OS
    open('files/' + str(uidnumber)+".jpg", 'wb').write(fileitem.file.read())

else:
    print 'File upload failed.'



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
attrs['sn'] = lname
attrs['givenName'] = fname
attrs['gecos']= fname+' '+lname
attrs['uid'] = username
attrs['departmentNumber'] = site
attrs['displayName'] = username
attrs['employeeNumber'] = str(uidnumber)
attrs['uidNumber'] = str(uidnumber)
attrs['gidNumber'] = '1000001' #users
attrs['l'] = location
attrs['c'] = nationality
attrs['postalAddress'] = postal_address #need to massage this a bit
attrs['mobile'] = phone

if employeeType=='FT' or employeeType=='PT':
    print employeeType
    attrs['employeeType'] = employeeType #Staff employeeType is 'S'
    attrs['title'] = title[0] #Their title is their title!
else:
    attrs['employeeType'] = title[1] #Students employeeType is their Grade
    attrs['title'] = employeeType #their title is "Student"

attrs['mail'] = email
attrs['apple-birthday'] = dob
#attrs['userPassword'] = ldap_md5.encrypt(password)
attrs['userPassword'] = password #plaintext is fine for unapproved accounts. We can recover and display until they change it

ldif=modlist.addModlist(attrs)
l.add_s(dn,ldif)

#double fields givenNamekh snkh and mailpr
mod_attrs = [
    (ldap.MOD_ADD, 'givenName', givenNamekh.encode('utf-8')),
    (ldap.MOD_ADD, 'sn', snkh.encode('utf-8')),
    (ldap.MOD_ADD, 'mail', mailpr),

]
print mod_attrs
l.modify_s(dn,mod_attrs)


#increase Synology internal count so we don't mess up creating accounts directly on the box
uiddn = "cn=CurID,cn=synoconf,dc=asianhope,dc=org"
old = {'uidNumber':uidnumber}
new = {'uidNumber':str(int(uidnumber)+1)}

uidldif=modlist.modifyModlist(old,new)
l.modify_s(uiddn,uidldif)

l.unbind_s()


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

#send email
msg = MIMEText(message)
msg['To'] = 'lyle@asianhope.org'
msg['From'] = 'noreply@asianhope.org'
msg['Subject'] = 'New Account Request: ' +site+'-'+username
#p = Popen(["/usr/sbin/sendmail", "-t"], stdin=PIPE)
#p.communicate(msg.as_string())
