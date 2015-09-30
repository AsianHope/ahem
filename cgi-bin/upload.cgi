#!/usr/bin/python

import cgi
import os,sys

#email sending stuff
from subprocess import Popen, PIPE
from email.mime.text import MIMEText

import cgitb
cgitb.enable()

def uploadFile():
    formData = cgi.FieldStorage()
    fileitem = formData['file']
    uidnumber = formData.getlist("uidnumber")[0]
    loginName = formData.getlist("loginName")[0];
    documentType = formData.getlist("documentType")[0];
    replaceFileName = formData.getlist("filename")[0];
    documentID = formData.getlist("DocumentID")[0];
    otherDocDescript = formData.getlist("otherDocDescript")[0];

    if fileitem.filename:
        fn = os.path.basename(fileitem.filename)
        extension = os.path.splitext(fn)[1][1:]

        # make directory if not exist
        if not os.path.isdir('files/'+str(uidnumber)+''):
            os.makedirs('files/'+str(uidnumber))
        # other document
        if documentID == '16':
            fileDirectory ='files/' + str(uidnumber) + '/' + str(uidnumber)+'-'+str(loginName)+'-'+str(documentType).replace("/", "_")+'-'+otherDocDescript+'.'+extension
        # simple document
        else:
            fileDirectory ='files/' + str(uidnumber) + '/' + str(uidnumber)+'-'+str(loginName)+'-'+str(documentType).replace("/", "_")+'.'+extension

        # remove if file already exist
        if os.path.isfile(replaceFileName):
            os.remove(replaceFileName)
        #write file to OS
        open(fileDirectory, 'wb').write(fileitem.file.read())
        return '{"result":"success","file":"'+fileDirectory+'"}'
    else:
        return '{"result":"error"}'
if __name__ == '__main__':
    print "Content-Type: text/html"     # HTML is following
    print # blank line, end of headers
    print uploadFile()
