from django.forms import widgets
from rest_framework import serializers
from restless.models import Employee, Document, LANGUAGE_CHOICES, STYLE_CHOICES
from restless.models import DEPARTMENTS, EMPLOYEETYPES, FAITHS, MARITALSTATUSES, GENDERS, DEGREES
from django.contrib.auth.models import User

import datetime
class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = (
                    'cn','uid','uidNumber','employeeNumber','sn','c','departmentNumber','displayName',
                    'employeeType','gecos','givenName','jpegPhoto','l','mail','appleBirthday',
                    'mobile','postalAddress','title','givenNamekh','snkh','mailpr',
                    'modified','startdate','enddate','faith','maritialstatus',
                    'children','gender','enteredCambodia','degree','visaExpires',
                    'nssf','notes',
                 )
        created_by = serializers.ReadOnlyField(source='created_by.username')
class UserSerializer(serializers.ModelSerializer):
    employees = serializers.PrimaryKeyRelatedField(many=True, queryset=Employee.objects.all())

    class Meta:
        model = User
        fields = ('id','username','employees')
