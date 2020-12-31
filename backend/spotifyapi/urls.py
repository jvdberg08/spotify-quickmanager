from django.urls import path

from . import views

urlpatterns = [
    path('songs', views.songs, name='songs'),
    path('delete_songs', views.delete_songs, name='delete_songs')
]
