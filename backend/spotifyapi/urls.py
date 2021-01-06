from django.urls import path

from . import views

urlpatterns = [
    path('songs', views.songs, name='songs'),
    path('delete_songs', views.delete_songs, name='delete_songs'),
    path('playlists', views.playlists, name='playlists'),
    path('delete_playlists', views.delete_playlists, name='delete_playlists')
]
