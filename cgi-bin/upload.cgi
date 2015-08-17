#!/usr/bin/python

import cgi
import os,sys

#email sending stuff
from subprocess import Popen, PIPE
from email.mime.text import MIMEText


import cgitb
cgitb.enable()

print "Content-Type: text/html"     # HTML is following
print
                          # blank line, end of headers

formData = cgi.FieldStorage()
fileitem = formData['file']
uidnumber = formData.getlist("uidnumber")[0]
loginName = formData.getlist("loginName")[0];
documentType = formData.getlist("documentType")[0];
replaceFileName = formData.getlist("filename")[0];

if fileitem.filename:
    fn = os.path.basename(fileitem.filename)
    extension = os.path.splitext(fn)[1][1:]

    # make directory if not exist
    if not os.path.isdir('files/'+str(uidnumber)+''):
        os.makedirs('files/'+str(uidnumber))

    fileDirectory ='files/' + str(uidnumber) + '/' + str(uidnumber)+'-'+str(loginName)+'-'+str(documentType).replace("/", "_")+'.'+extension
    #write file to OS
    # open('files/' +fn, 'wb').write(fileitem.file.read())
    if os.path.isfile(replaceFileName):
        os.remove(replaceFileName)

    open(fileDirectory, 'wb').write(fileitem.file.read())
    print '{"result":"success","file":"'+fileDirectory+'"}'
else:
    print '{"result":"error"}'
