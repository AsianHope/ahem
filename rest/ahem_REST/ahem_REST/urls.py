from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', include('restless.urls')),
    url(r'^', include('ahem.urls')),
    url(r'^api-auth/', include('rest_framework.urls',namespace='rest_framework')),
)
