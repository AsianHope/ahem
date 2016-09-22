#!/usr/bin/python
import cgi
import logging
import json
import cgitb
import ldap
import ldap.modlist as modlist

from slackclient import SlackClient
from credentials import SLACK
from credentials import LDAP_CREDENTIALS
from credentials import SERVER


cgitb.enable()
logging.basicConfig(filename='ahem.log',level=logging.DEBUG,format='%(asctime)s - %(levelname)s - %(message)s')
def AccountRequestApprover():
	formdata = cgi.FieldStorage()
	payload = json.loads(formdata.getlist('payload')[0])
	logging.debug(payload)

	action = payload['actions'][0]['name']
	uid = payload['actions'][0]['value']
	token = payload['token']
	ts = payload['original_message']['ts']
	channel = payload['channel']['id']
	user = payload['user']['name']
	userid = payload['user']['id']
	attachment = payload['original_message']['attachments']

	if token == SLACK['VERIFICATION_TOKEN']:
	    logging.debug('Verification token matches')
	    sc = SlackClient(SLACK['TOKEN'])

	    #remove action buttons
	    attachment[0]['actions'] = None

	    #remove question
	    message_text = attachment[0]['text'].splitlines() 
	    message_text[2] = ''
	    attachment_text = ''
	    for s in message_text:
		attachment_text = attachment_text+s+'\n'
	    attachment[0]['text'] = attachment_text

	    #add a new attachment with the confirmation
	    result = approveRequestAccount(uid,action)
	    if action == 'approve' and result:
		attachment.append({"title":":ballot_box_with_check: <@"+userid+"|"+user+"> approved this account request","color":"good"})
	    elif action == 'delete' and result:
		attachment.append({"title":":no_entry_sign: <@"+userid+"|"+user+"> deleted this account request","color":"danger"})
	    else:
		attachment.append({"title":":ng: Something went terribly wrong :ng:" ,"color":"danger"})
		


	    logging.debug(sc.api_call('chat.update', channel=channel, text=' ',
				    ts=ts, attachments=attachment))

	else:
	    logging.debug('What is this? Hackers!!')

def approveRequestAccount(uid,action):
    #don't require a valid certificate.. we don't currently have one!
    ldap.set_option(ldap.OPT_X_TLS_REQUIRE_CERT, ldap.OPT_X_TLS_NEVER)
    logging.debug('Binding to '+SERVER)

    slave = ldap.initialize(SERVER)
    l = ldap.initialize(SERVER)

    slave.protocol_version = ldap.VERSION3

    try:
    	logging.debug('Binding with '+LDAP_CREDENTIALS['dn'])
        slave.simple_bind_s(LDAP_CREDENTIALS['dn'],LDAP_CREDENTIALS['password'])
    except:
        logging.debug('-- could not bind to server --')
        slave.unbind_s()
        return False
    try :
        if action == 'delete' :
            slave.delete_s('uid='+uid+',cn=requests,dc=asianhope,dc=org')
        else:
            slave.rename_s('uid='+uid+',cn=requests,dc=asianhope,dc=org', 'uid='+uid+'', 'cn=users,dc=asianhope,dc=org')
    except ldap.INSUFFICIENT_ACCESS:
        return False
    except ldap.NO_SUCH_OBJECT:
        return False
    except Exception as e:
          return False
    else:
        if action != 'delete' :
            try:
                response = requests.get('http://192.168.1.157/cgi-bin/triggersync')
            except Exception as e:
                pass
        return True


if __name__ == "__main__":
	AccountRequestApprover()
	print "Content-type: text/html; charset=utf-8"
	print

 
