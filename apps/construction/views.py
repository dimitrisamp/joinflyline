from django.shortcuts import render


def under_construction(request):
    return render(request, "construction/index.html", context={})
