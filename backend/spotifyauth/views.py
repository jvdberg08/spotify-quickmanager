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

CLIENT_ID = os.environ['SPOTIFY_CLIENT_ID']
CLIENT_SECRET = os.environ['SPOTIFY_CLIENT_SECRET']

SCOPE = os.environ['SPOTIFY_SCOPE']
REDIRECT_URI = os.environ['SPOTIFY_REDIRECT_URI']

OAUTH_AUTHORIZE_URL = os.environ['SPOTIFY_AUTHORIZE_URL']
OAUTH_TOKEN_URL = os.environ['SPOTIFY_TOKEN_URL']


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
    print(code)
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


# Used in testing to get access token to make spotify api requests to setup and clean data
@ensure_csrf_cookie
def get_authorization(request):
    client_secret = request.GET.get(key='client_secret')
    if base64.b64encode(CLIENT_SECRET.encode('ascii')).decode('ascii') == client_secret:
        refresh_token = Session.objects.first().get_decoded().get('refresh_token')
        payload = {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token
        }
        headers = get_auth_headers()
        response = requests.post(url=OAUTH_TOKEN_URL, data=payload, headers=headers)

        if response.status_code != 200:
            print(response.status_code)
            return HttpResponse(status=response.status_code)

        json_response = response.json()
        access_token = json_response['access_token']
        expires_on = json_response['expires_in'] * 1000 + int(time() * 1000)

        request.session['access_token'] = access_token
        request.session['refresh_token'] = refresh_token
        request.session['expires_on'] = expires_on

        return JsonResponse(data={'access_token': request.session.get('access_token', 'none')})
    else:
        return HttpResponse(status=401)


def get_auth_headers():
    base64_string = base64.b64encode((CLIENT_ID + ':' + CLIENT_SECRET).encode('ascii'))
    return {'Authorization': 'Basic %s' % base64_string.decode('ascii')}
