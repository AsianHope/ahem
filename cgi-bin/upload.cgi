#!/usr/bin/python

import cgi
import os,sys

#email sending stuff
from subprocess import Popen, PIPE
from email.mime.text import MIMEText


import cgitb
cgitb.enable()

print "Content-Type: text/html"     # HTML is following
print                               # blank line, end of headers

#get stuff from the form
formData = cgi.FieldStorage()
uidnumber = formData.getlist("uidNumber")[0]
#verify uploaded file came through correctly
fileitem = formData['image']
if fileitem.filename:
    fn = os.path.basename(fileitem.filename)
    #write file to OS
    open('files/' + str(uidnumber)+".jpg", 'wb').write(fileitem.file.read())
    print '{"result":"success"}'

else:
    print '{"result":"error"}'
