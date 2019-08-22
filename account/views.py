from django.shortcuts import render


def account_view(request, *args, **kwargs):
    context = {
        "title": "Accounts"
    }
    return render(request, "accounts.html", context)
