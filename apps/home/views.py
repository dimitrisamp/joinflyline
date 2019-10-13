from django.shortcuts import render
from django.views.generic import TemplateView

from django.conf import settings as S


def index_view(request):
    context = {
        "title": S.SITE_TITLE
    }
    if request.user.is_authenticated:
        return render(request, "home/home.html", context)
    else:
        return render(request, "home/index.html", context)


def home_view(request):
    context = {
        "title": S.SITE_TITLE
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
