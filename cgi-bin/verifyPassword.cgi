#!/usr/bin/python
import cgi
from encryptPassword import encrypt_pw
def verify_pass():
    formData = cgi.FieldStorage()
    confirm_password = formData.getlist("confirm_password")[0]
    current_password = formData.getlist("current_password")[0]

    try:
      confirm_password = encrypt_pw(confirm_password)
      if confirm_password == current_password:
        return '{"result":"true"}'
      return '{"result":"false"}'
    except:
      return '{"result":"false"}'
if __name__ == "__main__":
  print "Content-type: application/json; charset=utf-8"
  print
  # print 'lalla'
  print verify_pass()
