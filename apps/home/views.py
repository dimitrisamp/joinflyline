from django.shortcuts import render
from django.urls import reverse
from django.views.generic import TemplateView, FormView, CreateView

from django.conf import settings as S

from apps.home.models import PromoInfo


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


class PromoLandingView(CreateView):
    template_name = "home/promotional_landing.html"
    model = PromoInfo
    fields = ['email', 'instagram']

    def get_success_url(self):
        return reverse('index')

