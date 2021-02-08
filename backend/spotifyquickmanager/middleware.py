import json


class HttpPostTunnelingMiddleware(object):

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == 'POST':
            request.POST = json.loads(request.body)
        if request.method == 'PUT':
            request.PUT = json.loads(request.body)
        return self.get_response(request)
