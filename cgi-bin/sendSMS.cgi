#!/usr/bin/python
# -*- coding: utf-8 -*-

from clickatell.http import Http
from credentials import CLICKATELL_CREDENTIALS
from credentials import LDAP_CREDENTIALS
from credentials import SERVER

import cgi
import urllib
#better errors, disable in production
import cgitb
cgitb.enable()

import os,sys
import hashlib
import logging
logging.basicConfig(filename='ahem.log',level=logging.DEBUG,format='%(asctime)s - %(levelname)s - %(message)s')
def sendMessage():
    formData = cgi.FieldStorage()
    userList = formData.getvalue("userList",None)
    title = formData.getvalue("title",None)
    message = formData.getvalue("message",None)

    try:
        clickatell = Http(CLICKATELL_CREDENTIALS['username'],CLICKATELL_CREDENTIALS['password'],CLICKATELL_CREDENTIALS['apiID'])
    except:
        return '{"result":"error"}'
    try:
        response = clickatell.sendMessage(userList,message, {'from':'AsianHope'})
    except:
        return '{"result":"error"}'
    else:

        return '{"result":"success"}'
    # print response
    # print clickatell.getMessageCharge('700abc347a2fac2412d24c031d2bee87')
    # print clickatell.getBalance()
    # print clickatell. getMessageCharge()



if __name__ == "__main__":
    print "Content-type: text/html; charset=utf-8"
    print

    print sendMessage()
