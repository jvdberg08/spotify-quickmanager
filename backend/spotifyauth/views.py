import base64
from time import time
from urllib import parse

import requests
from django.http import HttpResponse
from django.shortcuts import redirect
from django.conf import settings
from django.views.decorators.csrf import ensure_csrf_cookie

CLIENT_ID = 'client_id_here'
CLIENT_SECRET = 'client_secret_here'

SCOPE = 'user-library-read user-library-modify user-follow-read user-follow-modify ' \
        'playlist-read-collaborative playlist-modify-public playlist-read-private playlist-modify-private ' \
        'user-read-email user-read-private'
REDIRECT_URI = 'http://127.0.0.1:8000/spotifyauth/authorized'

OAUTH_AUTHORIZE_URL = 'https://accounts.spotify.com/authorize'
OAUTH_TOKEN_URL = 'https://accounts.spotify.com/api/token'


def check_session(request):
    access_token = request.session.get(key='access_token')
    refresh_token = request.session.get(key='refresh_token')
    expires_on = request.session.get(key='expires_on')

    if access_token is not None and refresh_token is not None and expires_on is not None:
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=401)


def is_authorized(request):
    is_session_valid = check_session(request).status_code == 200
    is_session_authorized = request.session.get(key='expires_on', default=0) > time() * 1000

    if is_session_valid and is_session_authorized:
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=401)


def refresh(request):
    refresh_token = request.session['refresh_token']
    payload = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
    }
    headers = get_auth_headers()
    response = requests.post(url=OAUTH_TOKEN_URL, data=payload, headers=headers)

    if response.status_code != 200:
        return HttpResponse(status=response.status_code)

    json_response = response.json()

    access_token = json_response['access_token']
    expires_on = json_response['expires_in'] * 1000 + int(time() * 1000)

    request.session['access_token'] = access_token
    request.session['expires_on'] = expires_on
    return HttpResponse(status=200)


@ensure_csrf_cookie
def authorize(request):
    payload = {
        'client_id': CLIENT_ID,
        'response_type': 'code',
        'scope': SCOPE,
        'redirect_uri': REDIRECT_URI,
    }
    params = parse.urlencode(payload)
    url = '%s?%s' % (OAUTH_AUTHORIZE_URL, params)
    return redirect(url)


def authorized(request):
    code = request.GET.get(key='code')
    payload = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
    }
    headers = get_auth_headers()
    response = requests.post(OAUTH_TOKEN_URL, data=payload, headers=headers)
    json_response = response.json()

    access_token = json_response['access_token']
    refresh_token = json_response['refresh_token']
    expires_on = json_response['expires_in'] * 1000 + int(time() * 1000)

    request.session['access_token'] = access_token
    request.session['refresh_token'] = refresh_token
    request.session['expires_on'] = expires_on
    return redirect('http://127.0.0.1:8080/?authExpiry=' + str((settings.SESSION_COOKIE_AGE * 1000 + int(time() * 1000))))


def un_authorize(request):
    request.session.flush()
    return HttpResponse(status=200)


def get_auth_headers():
    base64_string = base64.b64encode((CLIENT_ID + ':' + CLIENT_SECRET).encode('ascii'))
    return {'Authorization': 'Basic %s' % base64_string.decode('ascii')}
