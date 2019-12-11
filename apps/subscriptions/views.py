import stripe
import stripe.error
from django.conf import settings
from django.utils.timezone import now
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

stripe.api_key = settings.STRIPE_API_KEY


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
    permission_classes = [AllowAny]
    def get(self, request):
        return Response(settings.PLAN_DEFINITIONS)


class CheckPromoView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        promocode = request.query_params.get('promocode')
        try:
            coupon = stripe.Coupon.retrieve(promocode)
        except stripe.error.StripeError:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response({'discount': {'percentage': coupon.percent_off}})
