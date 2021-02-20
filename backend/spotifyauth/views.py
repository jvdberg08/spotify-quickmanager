import base64
import os

import requests

from time import time
from urllib import parse

from django.contrib.sessions.models import Session
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from django.conf import settings
from django.views.decorators.csrf import ensure_csrf_cookie
from dotenv import load_dotenv

load_dotenv()

SPOTIFY_CLIENT_ID = os.environ['SPOTIFY_CLIENT_ID']
SPOTIFY_CLIENT_SECRET = os.environ['SPOTIFY_CLIENT_SECRET']
SPOTIFY_SCOPE = os.environ['SPOTIFY_SCOPE']
SPOTIFY_REDIRECT_URI = os.environ['SPOTIFY_REDIRECT_URI']
SPOTIFY_AUTHORIZE_URL = os.environ['SPOTIFY_AUTHORIZE_URL']
SPOTIFY_TOKEN_URL = os.environ['SPOTIFY_TOKEN_URL']

APPLICATION_REDIRECT_URI = os.environ['APPLICATION_REDIRECT_URI']


@ensure_csrf_cookie
def authorize(request):
    payload = {
        'client_id': SPOTIFY_CLIENT_ID,
        'response_type': 'code',
        'scope': SPOTIFY_SCOPE,
        'redirect_uri': SPOTIFY_REDIRECT_URI,
    }
    params = parse.urlencode(payload)
    url = '%s?%s' % (SPOTIFY_AUTHORIZE_URL, params)
    return redirect(url)


def authorized(request):
    code = request.GET.get(key='code')
    payload = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': SPOTIFY_REDIRECT_URI,
    }
    headers = get_auth_headers()
    response = requests.post(SPOTIFY_TOKEN_URL, data=payload, headers=headers)
    json_response = response.json()

    access_token = json_response['access_token']
    refresh_token = json_response['refresh_token']
    expires_on = json_response['expires_in'] * 1000 + int(time() * 1000)

    request.session['access_token'] = access_token
    request.session['refresh_token'] = refresh_token
    request.session['expires_on'] = expires_on
    return redirect(APPLICATION_REDIRECT_URI + '/?authExpiry=' + str((settings.SESSION_COOKIE_AGE * 1000 + int(time() * 1000))))


def un_authorize(request):
    request.session.flush()
    return HttpResponse(status=200)


# Used in testing to get access token to make spotify api requests to setup and clean data
@ensure_csrf_cookie
def get_authorization(request):
    client_secret = request.GET.get(key='client_secret')
    if base64.b64encode(SPOTIFY_CLIENT_SECRET.encode('ascii')).decode('ascii') == client_secret:
        payload = {
            'grant_type': 'refresh_token',
            'refresh_token': os.environ.get('CYPRESS_SPOTIFY_REFRESH_TOKEN', 'Refresh Token Not Set In /backend/.env')
        }
        headers = get_auth_headers()
        response = requests.post(url=SPOTIFY_TOKEN_URL, data=payload, headers=headers)

        if response.status_code != 200:
            return HttpResponse(status=response.status_code)

        json_response = response.json()
        access_token = json_response['access_token']
        expires_on = json_response['expires_in'] * 1000 + int(time() * 1000)

        request.session['access_token'] = access_token
        request.session['refresh_token'] = os.environ.get('CYPRESS_SPOTIFY_REFRESH_TOKEN', 'Refresh Token Not Set In /backend/.env')
        request.session['expires_on'] = expires_on

        return JsonResponse(data={'access_token': request.session.get('access_token', 'none')})
    else:
        return HttpResponse(status=401)


def get_auth_headers():
    base64_string = base64.b64encode((SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).encode('ascii'))
    return {'Authorization': 'Basic %s' % base64_string.decode('ascii')}
