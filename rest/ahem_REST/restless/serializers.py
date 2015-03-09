from django.forms import widgets
from rest_framework import serializers
from restless.models import Employee, Document, LANGUAGE_CHOICES, STYLE_CHOICES
from restless.models import DEPARTMENTS, EMPLOYEETYPES, FAITHS, MARITALSTATUSES, GENDERS, DEGREES
import datetime
class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = (
                    'uidNumber','uid','sn','c','departmentNumber','displayName',
                    'employeeType','gecos','givenName','jpegPhoto','l','mail',
                    'mobile','postalAddress','title','givenNamekh','snkh','mailpr',
                    'modified','startdate','enddate','faith','maritialstatus',
                    'children','gender','enteredCambodia','degree','visaExpires',
                    'nssf','notes',
                 )
