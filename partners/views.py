from django.shortcuts import render


def partners_view(request, *args, **kwargs):
    context = {
        "title": "Partners",
    }
    return render(request, "partners.html", context)
