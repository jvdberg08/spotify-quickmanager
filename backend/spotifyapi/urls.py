from django.urls import path

from . import views

urlpatterns = [
    path('songs', views.songs, name='songs'),
    path('delete_songs', views.delete_songs, name='delete_songs'),
    path('playlists', views.playlists, name='playlists'),
    path('unfollow_playlists', views.unfollow_playlists, name='unfollow_playlists'),
    path('add_songs_to_playlists', views.add_songs_to_playlists, name='add_songs_to_playlists'),
    path('edit_playlist', views.edit_playlist, name='edit_playlist'),
    path('replace_playlist', views.replace_playlist, name='replace_playlist'),
    path('playlist_songs', views.playlist_songs, name='playlist_songs')
]
