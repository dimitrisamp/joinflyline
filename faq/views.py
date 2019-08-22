from django.shortcuts import render


def faq_view(request, *args, **kwargs):
    context = {
        "title": "Frequent Questions"
    }
    return render(request, "faq.html", context);
