from django.shortcuts import render


def about_view(request, *args, **kwargs):
    context = {
        "title": "About",
    }
    return render(request, "about.html", context)
