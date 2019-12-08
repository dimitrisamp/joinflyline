import re

from django.http import HttpResponsePermanentRedirect
from django.conf import settings


class UrlRedirectMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        host = request.META['HTTP_HOST'] + request.META['PATH_INFO']
        for url_pattern, redirect_url in settings.URL_REDIRECTS:
            regex = re.compile(url_pattern)
            if regex.match(host):
                return HttpResponsePermanentRedirect(redirect_url)
        response = self.get_response(request)
        return response
