from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from restless import views
from rest_framework import renderers

employee_list = views.EmployeeViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

employee_detail = views.EmployeeViewSet.as_view({
    'get':'retrieve',
    'put':'update',
    'patch':'partial_update',
    'delete':'destroy'
})

document_list = views.DocumentViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

document_detail = views.DocumentViewSet.as_view({
    'get':'retrieve',
    'put':'update',
    'patch':'partial_update',
    'delete':'destroy'
})

employeedocument_list = views.EmployeeDocumentViewSet.as_view({
    'get': 'list',
    'post': 'create'
})

urlpatterns = [
  url(r'^employees/$', employee_list, name='employee_list'),
  url(r'^employees/(?P<pk>[0-9]+)/$',employee_detail, name='employee_detail'),
  url(r'^employees/documents/$', employeedocument_list, name='employeedocument_list'),
  url(r'^documents/$', document_list, name='document_list'),
  url(r'^documents/(?P<pk>[0-9]+)/$',document_detail, name='document_detail'),

  url(r'^users/$',views.UserList.as_view()),
  url(r'^users/(?P<pk>[0-9]+)/$',views.UserDetail.as_view()),

]

urlpatterns = format_suffix_patterns(urlpatterns)
