from django.conf.urls import url
from . import views


app_name = 'blog'
urlpatterns = [
    url(r'^$', views.home),
    url(r'home/', views.home),
    url(r'getInfoByCode/', views.getInfoByCode, name='getInfoByCode'),
    url(r'getChangeByCode/', views.getChangeByCode, name='getChangeByCode'),
    url(r'getAllChart/', views.getAllChart, name='getAllChart'),
]