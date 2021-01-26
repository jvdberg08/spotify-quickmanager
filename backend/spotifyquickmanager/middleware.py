import json
from urllib import parse

from django.http import QueryDict


class HttpPostTunnelingMiddleware(object):

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == 'PUT':
            request.META['REQUEST_METHOD'] = 'PUT'
            request.PUT = QueryDict(parse.urlencode(json.loads(request.body)))
        if request.method == 'DELETE':
            request.META['REQUEST_METHOD'] = 'DELETE'
            request.DELETE = QueryDict(parse.urlencode(json.loads(request.body)))
        return self.get_response(request)
