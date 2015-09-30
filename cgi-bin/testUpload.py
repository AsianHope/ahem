import imp
import unittest
from mock import patch
from credentials import TEST
import cgi

from upload import uploadFile

@patch('cgi.FieldStorage')

class TestUpload(unittest.TestCase):
    def create_file(filename, content):
        fs = cgi.FieldStorage()
        fs.file = fs.make_file()
        fs.filename = filename
        return fs
    file_data = {
        'file':create_file("test.jpg", "this test file"),'uidnumber':'1234567',
        'loginName':'test','documentType':'Photo',
        'filename':'1234567-test-Photo.jpg','DocumentID':'0',
        'otherDocDescript':'spoort document'}
    file_error = {
        'file':create_file(None, "this test file"),'uidnumber':'1234567',
        'loginName':'test','documentType':'Photo',
        'filename':'1234567-test-Photo.jpg','DocumentID':'0',
        'otherDocDescript':'spoort document'}
    other_document = {
        'file':create_file('document.doc', "this test file"),'uidnumber':'1234567',
        'loginName':'test','documentType':'Other Supporting Documentation',
        'filename':'test.jpg','DocumentID':'16',
        'otherDocDescript':'recommendation letter'}
    def test_upload_success(self,MockClass):
        instance = MockClass.return_value
        instance.getlist = lambda key: [self.file_data[key]]
        instance.__getitem__ = lambda s, key: self.file_data[key]
        instance.__contains__= lambda s, key: key in self.file_data
        result = uploadFile()
        self.assertEqual(result,'{"result":"success","file":"files/1234567/1234567-test-Photo.jpg"}')
    def test_upload_error(self,MockClass):
        instance = MockClass.return_value
        instance.getlist = lambda key: [self.file_error[key]]
        instance.__getitem__ = lambda s, key: self.file_error[key]
        instance.__contains__= lambda s, key: key in self.file_error
        result = uploadFile()
        self.assertEqual(result,'{"result":"error"}')
    def test_upload_other_doc(self,MockClass):
        instance = MockClass.return_value
        instance.getlist = lambda key: [self.other_document[key]]
        instance.__getitem__ = lambda s, key: self.other_document[key]
        instance.__contains__= lambda s, key: key in self.other_document
        result = uploadFile()
        self.assertEqual(result,'{"result":"success","file":"files/1234567/1234567-test-Other Supporting Documentation-recommendation letter.doc"}')
if __name__ == '__main__':
    unittest.main()
