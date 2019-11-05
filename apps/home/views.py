from django.shortcuts import render
from django.views.generic import TemplateView

from django.conf import settings as S

from apps.results.adjacency import CITY_STATE_COUNTRY_AIRPORT, ADJACENCY


def index_view(request):
    context = {
        "title": S.SITE_TITLE,
    }
    return render(request, "home/index.html", context)


def home_view(request):
    demo = request.GET.get("demo")
    demo = bool(demo) and demo.lower() in ('true', '1')
    context = {
        "title": S.SITE_TITLE,
        "demo": demo,
        "city_airports": [o for o in CITY_STATE_COUNTRY_AIRPORT if o[0] in ADJACENCY]
    }
    return render(request, "home/home.html", context)


class SignInView(TemplateView):
    template_name = "home/sign-in.html"

    def get_context_data(self, **kwargs):
        return {
            "title": S.SITE_TITLE
        }


class SignUpView(TemplateView):
    template_name = "home/sign-up.html"

    def get_context_data(self, **kwargs):
        return {
            "title": S.SITE_TITLE
        }


class PromoLandingView(TemplateView):
    template_name = "home/promotional_landing.html"


