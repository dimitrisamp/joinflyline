from django.contrib.auth.models import User
from django.shortcuts import render

from account.models import Account


def retailsub_view(request):
    if request.method == 'POST':
        username = request.POST["email"]
        email = username
        password = ""
        first_name = request.POST["first_name"]
        last_name = request.POST["last_name"]
        gender = request.POST["gender"]
        dob = request.POST["dob"]
        phone_number = request.POST["phone_number"]
        card_number = request.POST["card_number"]
        expiry = request.POST["expiry"]
        cvc = request.POST["cvc"]
        country = request.POST["country"]
        zip = request.POST["zip"]

        user = User.objects.create_user(username, email, password, first_name=first_name, last_name=last_name)
        user.save()
        user = User.objects.get(pk=user.id)
        user.profile.dob = dob
        user.profile.gender = gender
        user.profile.phone_number = phone_number
        user.profile.save()
        account = Account.objects.create(card_number=card_number, expiry=expiry, cvc=cvc, country=country, zip=zip,
                                         user=user)
        account.save()
        context = {
            "users": user
        }
        return render(request, "subscription.html", context)
    else:
        context = {}
        return render(request, "subscription.html", context)
