from django.urls import path

from . import views

urlpatterns = [
    path('authorize', views.authorize, name='authorize'),
    path('authorized', views.authorized, name='authorized'),
    path('un_authorize', views.un_authorize, name='un_authorize')
]
