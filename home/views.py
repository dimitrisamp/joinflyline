from django.shortcuts import render
import requests
import urllib


def home_view(request, *args, **kwargs):
    context = {
        "title": "Wanderift Home",
    }
    return render(request, "home.html", context)
