import json
from urllib import parse

import requests
from django.http import JsonResponse, HttpResponse

from spotifyauth.views import is_authorized, refresh, check_session

SPOTIFY_API_URL = 'https://api.spotify.com/v1'


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

    response = requests.get(SPOTIFY_API_URL + '/me/tracks?limit=' + limit + '&offset=' + offset, headers=authorization)
    if response.status_code == 200:
        return JsonResponse(data=response.json())
    else:
        return HttpResponse(status=response.status_code)


def delete_songs(request):
    auth_check = check_authorization(request)
    if auth_check.status_code != 200:
        return HttpResponse(status=auth_check.status_code)

    authorization = make_auth(request)
    song_ids = request.GET.get(key='ids')

    response = requests.delete(SPOTIFY_API_URL + '/me/tracks?ids=' + song_ids, headers=authorization)
    return HttpResponse(status=response.status_code)


def playlists(request):
    auth_check = check_authorization(request)
    if auth_check.status_code != 200:
        return HttpResponse(status=auth_check.status_code)

    authorization = make_auth(request)
    limit = request.GET.get(key='limit', default='10')
    offset = request.GET.get(key='offset', default='0')

    response = requests.get(SPOTIFY_API_URL + '/me/playlists?limit=' + limit + '&offset=' + offset, headers=authorization)
    if response.status_code == 200:
        return JsonResponse(data=response.json())
    else:
        return HttpResponse(status=response.status_code)


def unfollow_playlists(request):
    auth_check = check_authorization(request)
    if auth_check.status_code != 200:
        return HttpResponse(status=auth_check.status_code)

    authorization = make_auth(request)
    playlist_ids = request.GET.get(key='ids', default='')
    playlist_ids = playlist_ids.split(',')

    error_codes = []
    for playlist_id in playlist_ids:
        response = requests.delete(SPOTIFY_API_URL + '/playlists/' + playlist_id + '/followers', headers=authorization)
        if response.status_code != 200:
            error_codes.append(response.status_code)

    status = max(set(error_codes), key=error_codes.count) if error_codes else 200
    return HttpResponse(status=status)


def add_songs_to_playlists(request):
    auth_check = check_authorization(request)
    if auth_check.status_code != 200:
        return HttpResponse(status=auth_check.status_code)

    authorization = make_auth(request)
    song_ids = request.GET.get(key='songIds')
    song_ids = ','.join('spotify:track:' + song_id for song_id in song_ids.split(','))
    playlist_ids = request.GET.get(key='playlistIds')
    playlist_ids = playlist_ids.split(',')

    error_codes = []
    for playlist_id in playlist_ids:
        url = SPOTIFY_API_URL + '/playlists/' + playlist_id + '/tracks?position=0&uris=' + song_ids
        response = requests.post(url=url, headers=authorization)
        if response.status_code != 200:
            error_codes.append(response.status_code)

    status = max(set(error_codes), key=error_codes.count) if error_codes else 200
    return HttpResponse(status=status)


def edit_playlist(request):
    auth_check = check_authorization(request)
    if auth_check.status_code != 200:
        return HttpResponse(status=auth_check.status_code)

    headers = make_auth(request)
    headers['Content-Type'] = 'application/json'
    playlist_id = request.GET.get(key='playlistId')
    name = request.GET.get('name')
    description = request.GET.get('description')
    public = request.GET.get('public')
    collaborative = request.GET.get('collaborative')

    if not name and not description and not public and not collaborative:
        return HttpResponse(status=400)

    data = dict()
    if name:
        data['name'] = name
    if description:
        data['description'] = description
    if public:
        data['public'] = public == 'true'
    if collaborative:
        data['collaborative'] = collaborative == 'true'

    response = requests.put(url=SPOTIFY_API_URL + '/playlists/' + playlist_id, json=data, headers=headers)
    return HttpResponse(status=response.status_code)


def replace_playlist(request):
    auth_check = check_authorization(request)
    if auth_check.status_code != 200:
        return HttpResponse(status=auth_check.status_code)

    authorization = make_auth(request)
    playlist_id = request.GET.get('playlistId')
    song_ids = request.GET.get('songIds')
    song_ids = song_ids.split(',')

    request_ids = []
    for index, song_id in enumerate(song_ids):
        print(request_ids)
        if index > 0 and index % 100 == 0:
            if index == 100:
                response = requests.put(SPOTIFY_API_URL + '/playlists/' + playlist_id + '/tracks?uris=' + ','.join(request_ids),
                                        headers=authorization)
            else:
                response = requests.post(SPOTIFY_API_URL + '/playlists/' + playlist_id + '/tracks?uris=' + ','.join(request_ids),
                                         headers=authorization)

            if response.status_code != 201:
                return HttpResponse(status=response.status_code)
            request_ids = []

        request_ids.append('spotify:track:' + song_id)

    if request_ids:
        if len(song_ids) <= 100:
            response = requests.put(SPOTIFY_API_URL + '/playlists/' + playlist_id + '/tracks?uris=' + ','.join(request_ids),
                                    headers=authorization)
        else:
            response = requests.post(SPOTIFY_API_URL + '/playlists/' + playlist_id + '/tracks?uris='
                                     + ','.join(request_ids), headers=authorization)
        if response.status_code != 201:
            return HttpResponse(status=response.status_code)

    return HttpResponse(status=201)


def playlist_songs(request):
    auth_check = check_authorization(request)
    if auth_check.status_code != 200:
        return HttpResponse(status=auth_check.status_code)

    authorization = make_auth(request)
    playlist_id = request.GET.get('playlistId')
    json_response = {'items': []}

    counter = 0
    while True:
        response = requests.get(SPOTIFY_API_URL + '/playlists/' + playlist_id + '/tracks?offset='
                                + str(counter * 100), headers=authorization)
        if response.status_code != 200:
            return HttpResponse(status=response.status_code)
        counter += 1
        json_response['total'] = response.json()['total']
        json_response['items'] += response.json()['items']

        if counter * 100 > json_response['total']:
            break

    return JsonResponse(data=json_response)


def remove_playlist_songs(request):
    auth_check = check_authorization(request)
    if auth_check.status_code != 200:
        return HttpResponse(status=auth_check.status_code)

    headers = make_auth(request)
    headers['Content-Type'] = 'application/json'
    playlist_id = request.GET.get('playlistId')
    song_ids = request.GET.get('songIds')
    song_ids = song_ids.split(',')

    data = {'tracks': []}

    for song_id in song_ids:
        data['tracks'].append({'uri': 'spotify:track:' + song_id})

    response = requests.delete(SPOTIFY_API_URL + '/playlists/' + playlist_id + '/tracks', json=data, headers=headers)
    return HttpResponse(response.status_code)
