from django.forms import widgets
from rest_framework import serializers
from restless.models import Employee, Document, EmployeeDocument, LANGUAGE_CHOICES, STYLE_CHOICES
from restless.models import DEPARTMENTS, EMPLOYEETYPES, FAITHS, MARITALSTATUSES, GENDERS, DEGREES
from django.contrib.auth.models import User

import datetime
class EmployeeDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeDocument
        fields = ('documentID', 'url', 'updated')
        added_by = serializers.ReadOnlyField(source='added_by.username')

class EmployeeSerializer(serializers.ModelSerializer):
    documents = EmployeeDocumentSerializer(many=True, read_only=True)
    class Meta:
        model = Employee
        fields = (
                    'cn','uid','uidNumber','employeeNumber','sn','c','departmentNumber','displayName',
                    'employeeType','gecos','givenName','jpegPhoto','l','mail','appleBirthday',
                    'mobile','postalAddress','title','givenNamekh','snkh','mailpr',
                    'modified','startdate','enddate','faith','maritalstatus',
                    'children','gender','enteredCambodia','degree','degreeArea','visaExpires',
                    'nssf','notes','idnumber','insurance','documents'
                 )
        created_by = serializers.ReadOnlyField(source='created_by.username')

class UserSerializer(serializers.ModelSerializer):
    employees = serializers.PrimaryKeyRelatedField(many=True, queryset=Employee.objects.all())

    class Meta:
        model = User
        fields = ('id','username','employees')

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ('documentID', 'description', 'required')

class EmployeeDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeDocument
        fields = ('uidNumber','documentID', 'url', 'updated')
        added_by = serializers.ReadOnlyField(source='added_by.username')
