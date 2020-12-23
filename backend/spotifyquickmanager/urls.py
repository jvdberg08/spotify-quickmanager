from django.urls import path, include

urlpatterns = [
    path('spotifyauth/', include('spotifyauth.urls')),
    path('spotifyapi/', include('spotifyapi.urls'))
]
