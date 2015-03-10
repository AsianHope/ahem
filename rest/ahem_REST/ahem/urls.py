from django.conf.urls import url
from ahem import views
urlpatterns = [
  url(r'^$',views.ahem, name='ahem'),
]

