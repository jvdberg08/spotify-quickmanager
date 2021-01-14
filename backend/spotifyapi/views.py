import json
from urllib import parse

import requests
from django.http import JsonResponse

from spotifyauth.views import is_authorized, check_session, refresh


# TODO error handling
def check_authorization(request):
    session = json.loads(check_session(request).content)
    if session['session_valid'] == 'false':
        return JsonResponse(data={'error': 'unauthorized'})

    session = json.loads(is_authorized(request).content)
    if session['session_authorized'] == 'false':
        refresh(request)


def make_auth(request):
    return {'Authorization': 'Bearer ' + request.session['access_token']}


# TODO error handling
def songs(request):
    authorization_check = check_authorization(request)
    if authorization_check is not None:
        return authorization_check

    authorization = make_auth(request)
    limit = request.GET.get(key='limit', default='24')
    offset = request.GET.get(key='offset', default='0')
    response = requests.get('https://api.spotify.com/v1/me/tracks?limit=' + limit + '&offset=' + offset, headers=authorization)
    return JsonResponse(data=response.json())


# TODO error handling
def delete_songs(request):
    authorization_check = check_authorization(request)
    if authorization_check is not None:
        return authorization_check

    authorization = make_auth(request)
    song_ids = request.GET.get(key='ids')  # TODO fix change to post/delete
    if song_ids is None:
        return JsonResponse(data={'status': 'invalid_songs'})
    requests.delete('http://api.spotify.com/v1/me/tracks?ids=' + song_ids, headers=authorization)
    return JsonResponse(data={'status': 'success'})


# TODO error handling
def playlists(request):
    authorization_check = check_authorization(request)
    if authorization_check is not None:
        return authorization_check

    authorization = make_auth(request)
    limit = request.GET.get(key='limit', default='5')
    offset = request.GET.get(key='offset', default='0')
    response = requests.get('https://api.spotify.com/v1/me/playlists?limit=' + limit + '&offset=' + offset, headers=authorization)
    return JsonResponse(data=response.json())


# TODO error handling
def delete_playlists(request):
    authorization_check = check_authorization(request)
    if authorization_check is not None:
        return authorization_check

    authorization = make_auth(request)
    playlist_ids = request.GET.get(key='ids')  # TODO fix change to post/delete
    if playlist_ids is None:
        return JsonResponse(data={'status': 'invalid_playlists'})
    playlist_ids = playlist_ids.split(',')

    for playlist_id in playlist_ids:
        requests.delete('https://api.spotify.com/v1/playlists/' + playlist_id + '/followers', headers=authorization)

    return JsonResponse(data={'status': 'success'})


# TODO error handling
def add_songs_to_playlists(request):
    authorization_check = check_authorization(request)
    if authorization_check is not None:
        return authorization_check

    authorization = make_auth(request)
    song_ids = request.GET.get(key='songIds')
    playlist_ids = request.GET.get(key='playlistIds')  # TODO fix change to post
    if song_ids is None or playlist_ids is None:
        return JsonResponse(data={'status': 'invalid_argument'})
    song_ids = ','.join('spotify:track:' + song_id for song_id in song_ids.split(','))
    playlist_ids = playlist_ids.split(',')

    for playlist_id in playlist_ids:
        url = 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks?position=0&%s' % (parse.urlencode({'uris': song_ids}))
        response = requests.post(url=url, headers=authorization)

    return JsonResponse(data={'status': 'success'})
