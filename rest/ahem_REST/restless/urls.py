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

urlpatterns = [
  url(r'^employees/$', employee_list, name='employee_list'),
  url(r'^employees/(?P<pk>[0-9]+)/$',employee_detail, name='employee_detail'),
  url(r'^users/$',views.UserList.as_view()),
  url(r'^users/(?P<pk>[0-9]+)/$',views.UserDetail.as_view()),

]

urlpatterns = format_suffix_patterns(urlpatterns)
