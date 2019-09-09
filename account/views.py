from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
import stripe

from account.models import Account

stripe.api_key = "sk_test_H2ypPKiLEc14JVbd6OpDIWQv00gPMSrkj1"


def account_view(request):
    user_id = request.user.id
    user = User.objects.get(pk=user_id)
    try:
        account = Account.objects.filter(user=user)
    except Account.DoesNotExist:
        account = None

    if account is not None:
        context = {
            "title": "Accounts",
            "account": account
        }
        return render(request, "accounts.html", context)
    else:
        account = {}
        context = {
            "title": "Accounts",
            "account": account
        }
        return render(request, "accounts.html", context)


def update_profile(request):
    user_id = request.user.id
    if request.method == 'POST':
        user = User.objects.get(pk=user_id)
        user.first_name = request.POST["first_name"]
        user.last_name = request.POST["last_name"]
        user.email = request.POST["email"]
        user.profile.dob = request.POST["dob"]
        user.profile.gender = request.POST["gender"]
        user.profile.market = request.POST["market"]
        user.save()
    messages.success(request, 'Details updated Successfully')
    return redirect('accounts', user_id)


def save_card(request):
    user_id = request.user.id
    if request.method == 'POST':
        user = User.objects.get(pk=user_id)
        account = Account()
        account.card_number = request.POST.get('card_number')
        account.scv = request.POST.get('scv')
        account.expiry = request.POST.get('expiry')
        account.country = request.POST.get('country')
        account.zip = request.POST.get('zip')
        account.user = user
        account.save()
        messages.success(request, 'Card details updated Successfully')
        return redirect('accounts', user_id)
    else:
        messages.error(request, 'Details update failed. Please try again')
        return redirect('accounts', user_id)
