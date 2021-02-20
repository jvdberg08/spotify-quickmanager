import json
import requests
from time import time
from django.http import HttpResponse

from spotifyauth.views import get_auth_headers, SPOTIFY_TOKEN_URL


class HttpPostTunnelingMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == 'POST':
            request.POST = json.loads(request.body)
        if request.method == 'PUT':
            request.PUT = json.loads(request.body)
        return self.get_response(request)


class SpotifyAuthorizationMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        access_token = request.session.get(key='access_token')
        refresh_token = request.session.get(key='refresh_token')
        expires_on = request.session.get(key='expires_on', default=0)
        is_authorized = access_token is not None and refresh_token is not None and expires_on > time() * 100

        if not is_authorized and refresh_token is not None:
            is_authorized = self.refresh(request)
            if is_authorized.status_code != 200:
                return HttpResponse(status=is_authorized.status_code)

        request.AUTH = {'Authorization': 'Bearer ' + request.session.get('access_token', '')}
        return self.get_response(request)

    def refresh(self, request):
        refresh_token = request.session['refresh_token']
        payload = {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token
        }
        headers = get_auth_headers()
        response = requests.post(url=SPOTIFY_TOKEN_URL, data=payload, headers=headers)

        if response.status_code != 200:
            return HttpResponse(status=response.status_code)

        json_response = response.json()
        access_token = json_response['access_token']
        expires_on = json_response['expires_in'] * 1000 + int(time() * 1000)

        request.session['access_token'] = access_token
        request.session['expires_on'] = expires_on
