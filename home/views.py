from django.shortcuts import render
import requests
import urllib


def home_view(request):
    user = request.user
    context = {
        "title": "Wanderift Home",
        "user": user
    }
    return render(request, "home.html", context)
