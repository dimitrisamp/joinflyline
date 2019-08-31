from django.shortcuts import render


def news_view(request, *args, **kwargs):
    context = {
        "title": "News",
    }
    return render(request, "news.html", context)
