import stripe
from django.conf import settings
from django.contrib.auth.models import User
from django.utils.timezone import now
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.account.models import Account

stripe.api_key = settings.STRIPE_API_KEY


def save_user_info(request):
    username = request.POST["email"]
    email = username
    password = request.POST["password"]
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
    title = request.POST["title"]
    user = User.objects.create_user(
        username, email, password, first_name=first_name, last_name=last_name
    )
    user.save()

    card_info = card_token(card_number, expiry, cvc)

    account = Account.objects.create(
        card_number=card_number,
        expiry=expiry,
        cvc=cvc,
        country=country,
        zip=zip,
        brand=card_info.card.brand,
        last4=card_info.card.last4,
        stripe_id=card_info.card.id,
        token=card_info.id,
        user=user,
    )
    account.save()

    customer = stripe_customer(user)

    user = User.objects.get(pk=user.id)
    user.profile.title = title
    user.profile.dob = dob
    user.profile.gender = gender
    user.profile.phone_number = phone_number
    user.profile.customer_id = customer.id
    user.profile.save()

    return user


def stripe_customer(user):
    return stripe.Customer.create(
        email=user.email,
        name="%s %s" % (user.first_name, user.last_name),
        source=user.account_set.all()[0].token,  # obtained with Stripe.js
    )


def parse_expiry(v):
    century = now().year // 100
    sm, sy = map(int, v.split('/'))
    if 0 <= sy <= 99:
        sy += century
    return sm, sy


def card_token(card_number, expiry, cvc):
    month, year = parse_expiry(expiry)
    return stripe.Token.create(
        card={
            "number": card_number,
            "exp_month": month,
            "exp_year": year,
            "cvc": cvc,
        }
    )


class Plans(APIView):
    def get(self, request):
        return Response(settings.SUBSCRIPTION_PLANS)
