import requests
from django.http import JsonResponse, HttpResponse
from django.views import View

from spotifyauth.views import is_authorized, refresh, check_session

SPOTIFY_API_URL = 'https://api.spotify.com/v1'


class LikedSongs(View):
    """ View for interacting with the users Liked Songs (songs saved in their library)

        GET:    Get all songs in the users Liked Songs collection.
            returns:    Json Object { 'total': int, 'items': [Spotify SavedTrackObject] }

        DELETE: Remove specified songs from the users Liked Songs collection.
            query:      List of track ids separated by a comma ('id,id,id')
    """

    def get(self, request):
        auth_check = check_authorization(request)
        if auth_check.status_code != 200:
            return HttpResponse(status=auth_check.status_code)

        authorization = make_auth(request)

        json_response = {'items': [], 'total': 50}
        for i in range(0, json_response['total'] + 50, 50):
            url = SPOTIFY_API_URL + '/me/tracks?limit=50&offset=' + str(i)
            response = requests.get(url=url, headers=authorization)
            if response.status_code != 200:
                return HttpResponse(status=response.status_code)
            json_response['total'] = response.json()['total']
            json_response['items'] += response.json()['items']
        return JsonResponse(data=json_response)

    def delete(self, request):
        auth_check = check_authorization(request)
        if auth_check.status_code != 200:
            return HttpResponse(status=auth_check.status_code)

        authorization = make_auth(request)
        track_ids = request.GET.get(key='tracks').split(',')

        for i in range(0, len(track_ids), 50):
            url = SPOTIFY_API_URL + '/me/tracks?ids=' + ','.join(track_ids[i:i + 50])
            response = requests.delete(url=url, headers=authorization)
            if response.status_code != 200:
                return HttpResponse(status=response.status_code)
        return HttpResponse(status=200)


class Playlists(View):
    """ View for interacting with multiple playlists at once

        GET:    Get all playlists in the users library
            returns:    Json Object { 'total': int, 'items': [Spotify SimplifiedPlaylistObject]

        PUT:    Edit multiple playlists at once
            body:       At least one of { 'name': string, 'public': bool, 'collaborative': bool, 'description': string }

        DELETE: Delete multiple playlists at once
            query:      List of playlist ids separated by a comma ('id,id,id')
    """

    def get(self, request):
        auth_check = check_authorization(request)
        if auth_check.status_code != 200:
            return HttpResponse(status=auth_check.status_code)

        authorization = make_auth(request)

        json_response = {'items': [], 'total': 50}
        for i in range(0, json_response['total'] + 50, 50):
            url = SPOTIFY_API_URL + '/me/playlists?limit=50&offset=' + str(i)
            response = requests.get(url=url, headers=authorization)
            if response.status_code != 200:
                return HttpResponse(status=response.status_code)
            json_response['total'] = response.json()['total']
            json_response['items'] += response.json()['items']
        return JsonResponse(data=json_response)

    def put(self, request):
        auth_check = check_authorization(request)
        if auth_check.status_code != 200:
            return HttpResponse(status=auth_check.status_code)

        headers = make_auth(request)
        headers['Content-Type'] = 'application/json'
        playlists = request.PUT.get('playlists')

        for playlist in playlists:
            data = dict()
            if playlist.get('name') is None and playlist.get('public') is None and \
                    playlist.get('collaborative') is None and playlist.get('description', '') is '':
                return HttpResponse(status=400)

            if playlist.get('name') is not None:
                data['name'] = playlist['name']
            if playlist.get('public') is not None:
                data['public'] = playlist['public']
            if playlist.get('collaborative') is not None:
                data['collaborative'] = playlist['collaborative']
            if playlist.get('description', '') is not '':
                data['description'] = playlist['description']
            url = SPOTIFY_API_URL + '/playlists/' + playlist['id']
            response = requests.put(url=url, json=data, headers=headers)
            if response.status_code != 200:
                return HttpResponse(status=response.status_code)
        return HttpResponse(status=200)

    def delete(self, request):
        auth_check = check_authorization(request)
        if auth_check.status_code != 200:
            return HttpResponse(status=auth_check.status_code)

        authorization = make_auth(request)
        playlist_ids = request.GET.get(key='playlists').split(',')

        for playlist_id in playlist_ids:
            url = SPOTIFY_API_URL + '/playlists/' + playlist_id + '/followers'
            response = requests.delete(url=url, headers=authorization)
            if response.status_code != 200:
                return HttpResponse(status=response.status_code)

        return HttpResponse(status=200)


class PlaylistsTracks(View):
    """ View for interacting with all tracks from multiple playlists

        POST:   Add a list of tracks to multiple playlists
            query:  List of playlist ids separated by a comma ('id,id,id')
            data:   List of track ids separated by a comma ('id,id,id')
    """

    def post(self, request):
        auth_check = check_authorization(request)
        if auth_check.status_code != 200:
            return HttpResponse(status=auth_check.status_code)

        authorization = make_auth(request)
        playlist_ids = request.GET.get(key='playlists').split(',')
        track_ids = request.POST.get('tracks').split(',')
        track_ids = ['spotify:track:' + track_id for track_id in track_ids]

        for playlist_id in playlist_ids:
            for i in range(0, len(track_ids), 100):
                url = SPOTIFY_API_URL + '/playlists/' + playlist_id + '/tracks?position=0&uris=' + ','.join(track_ids[i:i + 50])
                response = requests.post(url=url, headers=authorization)
                if response.status_code != 201:
                    return HttpResponse(status=response.status_code)
        return HttpResponse(status=201)


class PlaylistTracks(View):
    """ View for interacting with all tracks in a playlist

        GET:    Get all tracks in a playlist
            query:      The playlist id
            returns:    Json Object { 'total': int, 'items': [Spotify SimplifiedTrackObject,SimplifiedEpisodeObject] }

        PUT:    Reorder the tracks in a playlist
            query:      The playlist id
            body:       List of track ids separated by a comma (','),
                        in the required order

        DELETE: Delete specified tracks in a playlist
            query:      The playlist id and a list of tracks separated by a comma (',')
    """

    def get(self, request):
        auth_check = check_authorization(request)
        if auth_check.status_code != 200:
            return HttpResponse(status=auth_check.status_code)

        authorization = make_auth(request)
        playlist_id = request.GET.get(key='playlist')

        json_response = {'items': [], 'total': 100}
        for i in range(0, json_response['total'], 100):
            url = SPOTIFY_API_URL + '/playlists/' + playlist_id + '/tracks?offset=' + str(i)
            response = requests.get(url=url, headers=authorization)
            if response.status_code != 200:
                return HttpResponse(status=response.status_code)
            json_response['total'] = response.json()['total']
            json_response['items'] += response.json()['items']
        return JsonResponse(data=json_response)

    def put(self, request):
        auth_check = check_authorization(request)
        if auth_check.status_code != 200:
            return HttpResponse(status=auth_check.status_code)

        authorization = make_auth(request)
        playlist_id = request.GET.get('playlist')
        track_ids = request.PUT.get('tracks').split(',')
        track_ids = ['spotify:track:' + track_id for track_id in track_ids]

        response = requests.put(url=SPOTIFY_API_URL + '/playlists/' + playlist_id + '/tracks?uris=', headers=authorization)
        if response.status_code != 201:
            return HttpResponse(status=response.status_code)

        for i in range(0, len(track_ids), 100):
            url = SPOTIFY_API_URL + '/playlists/' + playlist_id + '/tracks?uris=' + ','.join(track_ids[i:i + 100])
            response = requests.post(url=url, headers=authorization)
            if response.status_code != 201:
                return HttpResponse(status=response.status_code)
        return HttpResponse(status=201)

    def delete(self, request):
        auth_check = check_authorization(request)
        if auth_check.status_code != 200:
            return HttpResponse(status=auth_check.status_code)

        headers = make_auth(request)
        headers['Content-Type'] = 'application/json'
        playlist_id = request.GET.get('playlist')
        track_ids = request.GET.get('tracks').split(',')
        track_ids = ['spotify:track:' + track_id for track_id in track_ids]

        for i in range(0, len(track_ids), 100):
            url = SPOTIFY_API_URL + '/playlists/' + playlist_id + '/tracks'
            data = {'tracks': [{'uri': track_id} for track_id in track_ids[i: i + 100]]}
            response = requests.delete(url=url, json=data, headers=headers)
            if response.status_code != 200:
                return HttpResponse(status=response.status_code)
        return HttpResponse(status=200)


def check_authorization(request):
    session_check = check_session(request)
    auth_check = is_authorized(request)

    if auth_check.status_code == 401 and session_check.status_code == 200:
        return refresh(request)
    else:
        return session_check


def make_auth(request):
    return {'Authorization': 'Bearer ' + request.session.get('access_token', '')}
