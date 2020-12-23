import base64
import json
from time import time
from urllib import parse

import requests
from django.http import JsonResponse
from django.shortcuts import redirect

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

    is_session_valid = access_token is not None and refresh_token is not None and expires_on is not None
    return JsonResponse(data={'session_valid': str(is_session_valid).lower()})


def is_authorized(request):
    is_session_valid = True if json.loads(check_session(request).content)['session_valid'] == 'true' else False
    is_session_authorized = request.session.get(key='expires_on', default=0) > time() * 1000
    return JsonResponse(data={'session_authorized': str(is_session_valid and is_session_authorized).lower()})


def refresh(request):
    refresh_token = request.session['refresh_token']
    payload = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
    }
    headers = get_auth_headers()
    response = requests.post(OAUTH_TOKEN_URL, data=payload, headers=headers)
    json_response = response.json()

    access_token = json_response['access_token']
    expires_on = json_response['expires_in'] * 1000 + int(time() * 1000)

    request.session['access_token'] = access_token
    request.session['expires_on'] = expires_on
    return JsonResponse(data={'refresh': 'success'})


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
    error = request.GET.get(key='error')
    if error:
        return redirect('http://127.0.0.1:8080/?login=error')

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
    return redirect('http://127.0.0.1:8080/')


def un_authorize(request):
    request.session.flush()
    return redirect('http://127.0.0.1:8080/')


def get_auth_headers():
    base64_string = base64.b64encode((CLIENT_ID + ':' + CLIENT_SECRET).encode('ascii'))
    return {'Authorization': 'Basic %s' % base64_string.decode('ascii')}
