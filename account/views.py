from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import render

from account.models import Account


def account_view(request, user_id):
    user = User.objects.get(pk=user_id)
    print(user)
    try:
        account = Account.objects.get(user=user)
    except Account.DoesNotExist:
        account = None

    if account is not None:
        context = {
            "title": "Accounts",
            "user": user,
            "account": account
        }
        return render(request, "accounts.html", context)
    else:
        account = {}
        context = {
            "title": "Accounts",
            "user": user,
            "account": account
        }
        return render(request, "accounts.html", context)


def update_profile(request, user_id):
    user = User.objects.get(pk=user_id)
    user.first_name = request.POST["first_name"]
    user.last_name = request.POST["last_name"]
    user.email = request.POST["email"]
    user.profile.dob = request.POST["dob"]
    user.profile.gender = request.POST["gender"]
    user.profile.market = request.POST["market"]
    user.save()
    context = {
        "title": "Accounts",
        "user": user
    }
    return render(request, "accounts.html", context)


def save_card(request, user_id):
    user = User.objects.get(pk=user_id)
    account = Account()
    account.card_number = request.POST.get('card_number')
    account.scv = request.POST.get('scv')
    account.expiry = request.POST.get('expiry')
    account.country = request.POST.get('country')
    account.zip = request.POST.get('zip')
    account.user = user

    account.save()
    context = {
        "title": "Accounts",
        "user": user,
        "account": account
    }
    return render(request, "accounts.html", context)
