from django.contrib.auth.decorators import login_required
from django.shortcuts import render


def index_view(request):
    context = {
        "title": "Wanderift | Search, Book, Save with Wanderift",
    }
    if request.user.is_authenticated:
        return render(request, "home/home.html", context)
    else:
        return render(request, "home/index.html", context)


def home_view(request):
    context = {
        "title": "Wanderift | Search, Book, Save with Wanderift",
    }
    return render(request, "home/home.html", context)
