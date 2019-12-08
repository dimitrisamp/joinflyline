import datetime

import stripe
import stripe.error
from django.conf import settings
from django.db import transaction
from django.http import JsonResponse
from django.views.generic import FormView
from psycopg2.extras import DateTimeTZRange

from apps.account.forms import WizardForm
from apps.account.models import Account
from apps.auth.models import User
from apps.emails.views import signup_success
from apps.subscriptions.models import Subscriptions

stripe.api_key = settings.STRIPE_API_KEY


def stripe_customer(user: User):
    return stripe.Customer.create(
        email=user.email,
        name="%s %s" % (user.first_name, user.last_name),
        source=user.account.token,  # obtained with Stripe.js
    )


def card_token(card_number, expiry, cvc):
    return stripe.Token.create(
        card={
            "number": card_number,
            "exp_month": expiry.month,
            "exp_year": expiry.year,
            "cvc": cvc,
        }
    )


def add_subscription(account: Account, plan: str):
    if not Subscriptions.objects.filter(account=account).exists():
        subscription = stripe.Subscription.create(
            customer=account.customer_id,
            items=[{"plan": settings.SUBSCRIPTION_PLANS[plan]["stripe_plan_id"]}],
        )
        start = datetime.datetime.fromtimestamp(subscription["current_period_start"])
        end = datetime.datetime.fromtimestamp(subscription["current_period_end"])
        Subscriptions.objects.create(
            account=account, plan=plan, period=DateTimeTZRange(start, end)
        )


def add_to_stripe(user: User, plan):
    account = user.account
    stripe_card_token = card_token(account.card_number, account.expiry, account.cvc)
    account.token = stripe_card_token.id
    customer = stripe_customer(user)
    account.customer_id = customer.id
    account.save()
    add_subscription(account, plan)


class WizardView(FormView):
    form_class = WizardForm

    def form_invalid(self, form):
        return JsonResponse({"errors": form.errors.as_json()}, status=400)

    def form_valid(self, form):
        cd = form.cleaned_data
        with transaction.atomic():
            if User.objects.filter(email=cd["email"]).exists():
                return JsonResponse(
                    {"errors": {"email": "User already exists"}}, status=400
                )
            account = Account.objects.create(
                card_number=cd["card_number"],
                cvc=cd["cvc"],
                expiry=cd["expiry"],
            )
            new_user = User.objects.create_user(
                cd["email"],
                cd["email"],
                cd["password"],
                first_name=cd["first_name"],
                last_name=cd["last_name"],
                zip=cd["zip"],
                market=cd["home_airport"],
                account=account
            )
            signup_success(new_user.pk)
            # TODO: handle promocode
            if account.card_number and account.expiry and account.cvc:
                add_to_stripe(new_user, cd["plan"])
            return JsonResponse({"success": True})
