import json
from urllib import parse

import requests
from django.http import JsonResponse, HttpResponse

from spotifyauth.views import is_authorized, refresh, check_session


def check_authorization(request):
    session_check = check_session(request)
    auth_check = is_authorized(request)

    if auth_check.status_code == 401 and session_check.status_code == 200:
        return refresh(request)
    else:
        return session_check


def make_auth(request):
    return {'Authorization': 'Bearer ' + request.session.get('access_token', '')}


def songs(request):
    auth_check = check_authorization(request)
    if auth_check.status_code != 200:
        return HttpResponse(status=auth_check.status_code)

    authorization = make_auth(request)
    limit = request.GET.get(key='limit', default='24')
    offset = request.GET.get(key='offset', default='0')

    response = requests.get('https://api.spotify.com/v1/me/tracks?limit=' + limit + '&offset=' + offset, headers=authorization)
    if response.status_code == 200:
        return JsonResponse(data=response.json())
    else:
        return HttpResponse(status=response.status_code)


def delete_songs(request):
    auth_check = check_authorization(request)
    if auth_check.status_code != 200:
        return HttpResponse(status=auth_check.status_code)

    authorization = make_auth(request)
    song_ids = request.GET.get(key='ids')  # TODO fix change to post/delete

    response = requests.delete('http://api.spotify.com/v1/me/tracks?ids=' + song_ids, headers=authorization)
    return HttpResponse(status=response.status_code)


def playlists(request):
    auth_check = check_authorization(request)
    if auth_check.status_code != 200:
        return HttpResponse(status=auth_check.status_code)

    authorization = make_auth(request)
    limit = request.GET.get(key='limit', default='10')
    offset = request.GET.get(key='offset', default='0')

    response = requests.get('https://api.spotify.com/v1/me/playlists?limit=' + limit + '&offset=' + offset, headers=authorization)
    if response.status_code == 200:
        return JsonResponse(data=response.json())
    else:
        return HttpResponse(status=response.status_code)


def unfollow_playlists(request):
    auth_check = check_authorization(request)
    if auth_check.status_code != 200:
        return HttpResponse(status=auth_check.status_code)

    authorization = make_auth(request)
    playlist_ids = request.GET.get(key='ids', default='')  # TODO fix change to post/delete
    playlist_ids = playlist_ids.split(',')

    error_codes = []
    for playlist_id in playlist_ids:
        response = requests.delete('https://api.spotify.com/v1/playlists/' + playlist_id + '/followers', headers=authorization)
        if response.status_code != 200:
            error_codes.append(response.status_code)

    return HttpResponse(status=max(set(error_codes), key=error_codes.count))


def add_songs_to_playlists(request):
    auth_check = check_authorization(request)
    if auth_check.status_code != 200:
        return HttpResponse(status=auth_check.status_code)

    authorization = make_auth(request)
    song_ids = request.GET.get(key='songIds')
    song_ids = ','.join('spotify:track:' + song_id for song_id in song_ids.split(','))
    playlist_ids = request.GET.get(key='playlistIds')  # TODO fix change to post
    playlist_ids = playlist_ids.split(',')

    error_codes = []
    for playlist_id in playlist_ids:
        url = 'https://api.spotify.com/v1/playlists/' + playlist_id + '/tracks?position=0&%s' % (parse.urlencode({'uris': song_ids}))
        response = requests.post(url=url, headers=authorization)
        if response.status_code != 200:
            error_codes.append(response.status_code)

    return HttpResponse(status=max(set(error_codes), key=error_codes.count))
