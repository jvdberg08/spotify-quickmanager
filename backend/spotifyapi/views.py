import json

import requests
from django.http import JsonResponse

from spotifyauth.views import is_authorized, check_session, refresh


def check_authorization(request):
    session = json.loads(check_session(request).content)
    if session['session_valid'] == 'false':
        return JsonResponse(data={'error': 'unauthorized'})

    session = json.loads(is_authorized(request).content)
    if session['session_authorized'] == 'false':
        refresh(request)


def songs(request):
    authorization_check = check_authorization(request)
    if authorization_check is not None:
        return authorization_check

    authorization = {'Authorization': 'Bearer ' + request.session['access_token']}
    limit = request.GET.get(key='limit', default='20')
    offset = request.GET.get(key='offset', default='0')
    response = requests.get('https://api.spotify.com/v1/me/tracks?limit=' + limit + '&offset=' + offset, headers=authorization)
    return JsonResponse(data=response.json())


# TODO change to post request. Issues with CSRF Tokens
def delete_songs(request):
    authorization_check = check_authorization(request)
    if authorization_check is not None:
        return authorization_check

    authorization = {'Authorization': 'Bearer ' + request.session['access_token']}
    song_ids = request.GET.get(key='ids')
    if song_ids is None:
        return JsonResponse(data={'status': 'invalid_songs'})
    requests.delete('http://api.spotify.com/v1/me/tracks?ids=' + song_ids, headers=authorization)
    return JsonResponse(data={'status': 'success'})
