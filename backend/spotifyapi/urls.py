from django.urls import path

from . import views

urlpatterns = [
    path('liked_songs', views.LikedSongs.as_view()),
    path('playlists', views.Playlists.as_view()),
    path('playlists/tracks', views.PlaylistsTracks.as_view()),
    path('playlist/tracks', views.PlaylistTracks.as_view()),
    path('search', views.search)
]
