import json

import requests
from django.http import JsonResponse

from spotifyauth.views import is_authorized, check_session, refresh


def songs(request):
    session = json.loads(check_session(request).content)
    if session['session_valid'] == 'false':
        return JsonResponse(data={'error': 'unauthorized'})

    session = json.loads(is_authorized(request).content)
    if session['session_authorized'] == 'false':
        refresh(request)

    authorization = {'Authorization': 'Bearer ' + request.session['access_token']}
    limit = request.GET.get(key='limit', default='20')
    offset = request.GET.get(key='offset', default='0')
    response = requests.get('https://api.spotify.com/v1/me/tracks?limit=' + limit + '&offset=' + offset, headers=authorization)
    return JsonResponse(data=response.json())
