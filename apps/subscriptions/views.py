import stripe
import stripe.error
from django.conf import settings
from django.db.models.functions import Now
from django.utils.timezone import now
from psycopg2._range import DateTimeRange
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.account.actions import add_subscription, add_to_stripe
from apps.subscriptions.forms import SetPlanForm
from apps.subscriptions import models as subscriptions_model


stripe.api_key = settings.STRIPE_API_KEY


def stripe_customer(user):
    return stripe.Customer.create(
        email=user.email,
        name="%s %s" % (user.first_name, user.last_name),
        source=user.account_set.all()[0].token,  # obtained with Stripe.js
    )


def parse_expiry(v):
    century = now().year // 100
    sm, sy = map(int, v.split("/"))
    if 0 <= sy <= 99:
        sy += century
    return sm, sy


def card_token(card_number, expiry, cvc):
    month, year = parse_expiry(expiry)
    return stripe.Token.create(
        card={"number": card_number, "exp_month": month, "exp_year": year, "cvc": cvc}
    )


class Plans(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(settings.PLAN_DEFINITIONS)


class CheckPromoView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        promocode = request.query_params.get("promocode")
        try:
            coupon = stripe.Coupon.retrieve(promocode)
        except stripe.error.StripeError:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response({"discount": {"percentage": coupon.percent_off}})


class SetPlanView(APIView):
    def post(self, request):
        form = SetPlanForm(self.request.data)
        if not form.is_valid():
            raise ValidationError(form.errors.as_json())
        subscription = self.request.user.subscription()
        if subscription:
            return Response(
                status=status.HTTP_404_NOT_FOUND
            )  # TODO: write code that allows to switch plan (invoice)
        cd = form.cleaned_data
        add_to_stripe(
            user=self.request.user,
            card_number=cd["card_number"],
            expiry=cd["expiry"],
            cvc=cd["cvc"],
        )
        add_subscription(
            account=self.request.user.account, plan=cd["plan"], promocode=""
        )
        return Response({"status": "success"})


class CancelSubscriptionView(APIView):
    def post(self, request):
        account = request.user.account
        if not account:
            return Response({'code': "Account does not exist"}, status=status.HTTP_404_NOT_FOUND)
        sub = get_object_or_404(subscriptions_model.Subscriptions, account=account, period__contains=Now())
        stripe.Subscription.delete(sub.subscription_id)
        sub.period = (sub.period.lower, now())
        sub.save()
        return Response({"status": "success"})
