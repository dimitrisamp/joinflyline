from django.shortcuts import render
from django.urls import reverse
from django.views.generic import CreateView

from django.conf import settings as S

from apps.home.models import PromoInfo


def index_view(request):
    return render(request, "index.html")


class PromoLandingView(CreateView):
    model = PromoInfo
    fields = ['email', 'instagram']

    def get_success_url(self):
        return reverse('index')

