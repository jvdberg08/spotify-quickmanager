from django.urls import path

from . import views

urlpatterns = [
    path('authorize', views.authorize, name='authorize'),
    path('authorized', views.authorized, name='authorized'),
    path('un_authorize', views.un_authorize, name='un_authorize'),
    path('is_authorized', views.is_authorized, name='is_authorized'),
    path('check_session', views.check_session, name='check_session'),
]
