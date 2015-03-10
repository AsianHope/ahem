from django.shortcuts import render
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework import generics

from restless.models import Employee, Document, EmployeeDocument
from restless.serializers import EmployeeSerializer
from restless.serializers import UserSerializer
from restless.serializers import DocumentSerializer
from restless.serializers import EmployeeDocumentSerializer
from rest_framework import permissions
from django.contrib.auth.models import User
from rest_framework import viewsets

@api_view(('GET',))
def api_root(request, format=None):
    return Response({
        'users': reverse('user-list', request=request, format=format),
        'employees': reverse('employee-list', request=request, format=format)
    })

class EmployeeViewSet(viewsets.ModelViewSet):
    model=Employee
    serializer_class = EmployeeSerializer
    queryset = Employee.objects.all()

class DocumentViewSet(viewsets.ModelViewSet):
    model = Document
    serializer_class = DocumentSerializer
    queryset = Document.objects.all()

class EmployeeDocumentViewSet(viewsets.ModelViewSet):
    model = EmployeeDocument
    serializer_class = EmployeeDocumentSerializer
    queryset = EmployeeDocument.objects.all()

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
