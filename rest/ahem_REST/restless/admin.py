from django.contrib import admin
from restless.models import Employee
from restless.models import Document
from restless.models import EmployeeDocument
# Register your models here.

admin.site.register(Employee)
admin.site.register(Document)
admin.site.register(EmployeeDocument)
