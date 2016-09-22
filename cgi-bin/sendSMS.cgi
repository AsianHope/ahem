#!/usr/bin/python
# -*- coding: utf-8 -*-

# from clickatell.http import Http
# from credentials import CLICKATELL_CREDENTIALS

from twilio.rest import TwilioRestClient
from twilio import TwilioRestException
from credentials import TWILIO_CREDENTIALS



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

    # try:
    #     clickatell = Http(CLICKATELL_CREDENTIALS['username'],CLICKATELL_CREDENTIALS['password'],CLICKATELL_CREDENTIALS['apiID'])
    # except:
    #     return '{"result":"error"}'
    # try:
    #     response = clickatell.sendMessage(userList,message, {'from':'AHALERTS'})
    # except:
    #     return '{"result":"error"}'
    # else:
    #
    #     return '{"result":"success"}'
    # # print response
    # # print clickatell.getMessageCharge('700abc347a2fac2412d24c031d2bee87')
    # # print clickatell.getBalance()
    # # print clickatell. getMessageCharge()

    #remove []
    userList = userList[1:-1]
    # remove "
    users = userList.replace('"','')
    # split string to list
    users_list = users.split(",")
    error_number = ""
    try:
        client = TwilioRestClient(TWILIO_CREDENTIALS['ACCOUNT_SID'], TWILIO_CREDENTIALS['AUTH_TOKEN'])
    except TwilioRestException as e:
        return '{"result":"'+e.msg+'"}'
    except Exception as e:
        return '{"result":"'+str(e)+'"}'

    # sending sms to each user in list
    for user in users_list:

        try:
            client.messages.create(
                to=user,
                messaging_service_sid=TWILIO_CREDENTIALS['MESSAGING_SERVICE_SID'],
                body=message,
            )
        except TwilioRestException as e:
            if e.code == 21211:
                error_number += user + ","

            else:
                return '{"result":"'+e.msg+'"}'
        except Exception as e :
            return '{"result":"'+str(e)+'"}'

    if error_number == "":
      return '{"result":"success"}'
    else :
      return '{"result":"Number ('+error_number+') are not valid phone number."}'




if __name__ == "__main__":
    print "Content-type: text/html; charset=utf-8"
    print

    print sendMessage()
