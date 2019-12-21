import datetime
from typing import Optional

import stripe
from django.conf import settings
from django.db import transaction

from apps.auth.enums import UserRole
from apps.emails.views import signup_success
from django.utils.timezone import now
from psycopg2._range import DateTimeTZRange
from apps.account.models import Account
from apps.auth.models import User
from apps.subscriptions.models import Subscriptions
from wanderift.utils import generate_invite_code


def create_subscriber(
    *,
    account: Optional[Account] = None,
    email: str,
    password: str = None,
    first_name: str,
    last_name: str,
    role: Optional[UserRole] = UserRole.SUBSCRIBER,
    market: dict,
    zip: Optional[str] = None,
    phone_number: Optional[str] = None,
    promo_code: str = None,
    card_number: Optional[str] = None,
    expiry: Optional[datetime.date] = None,
    cvc: Optional[str] = None,
    plan: str = None,
) -> User:
    """
    Creates user and subscribes to given plan.
    :param account: if provided, connects given user to specified account
    """
    if not account and plan:
        assert card_number and expiry and cvc
    with transaction.atomic():
        if not account:
            account = Account.objects.create()
        new_user = User.objects.create_user(
            email,
            email,
            password,
            first_name=first_name,
            last_name=last_name,
            zip=zip,
            market=market,
            account=account,
            phone_number=phone_number,
            role=role,
            activation_code=None if plan else generate_invite_code()
        )
        if plan:
            add_to_stripe(new_user, card_number, expiry, cvc)
            add_subscription(account, plan, promo_code)
            signup_success(new_user.pk)
        else:
            send_activation_email(new_user.pk)
        return new_user


def add_subscription(account: Account, plan: str, promocode: str):
    """
    Checks and adds a subscription for given account. If plan is non-free, performs operations on
    stripe side also
    Does nothing if subscription already exists
    """
    if not Subscriptions.objects.filter(account=account).exists():
        subscription = stripe_subscribe(account, plan, promocode)
        start = datetime.datetime.fromtimestamp(
            subscription["current_period_start"]
        )
        end = datetime.datetime.fromtimestamp(subscription["current_period_end"])
        Subscriptions.objects.create(
            account=account, plan=plan, period=DateTimeTZRange(start, end)
        )


def stripe_subscribe(account: Account, plan: str, promocode: str):
    """
    Adds a subscription to given plan with promocode applied in Stripe
    """
    params = {
        "customer": account.customer_id,
        "items": [{"plan": settings.SUBSCRIPTION_PLANS[plan]["stripe_plan_id"]}],
    }
    if promocode:
        params["coupon"] = promocode
    return stripe.Subscription.create(**params)


def add_to_stripe(
    user: User, card_number: str, expiry: datetime.date, cvc: str
) -> None:
    """
    Registers user in Stripe and saves card token and customer id in user's account
    """
    account = user.account
    stripe_card_token = card_token(card_number, expiry, cvc)
    customer = stripe_customer(user, stripe_card_token)
    account.token = stripe_card_token.id
    account.customer_id = customer.id
    account.save()


def stripe_customer(user: User, token: stripe.Token) -> stripe.Customer:
    """
    Registers user as customer in Stripe
    """
    return stripe.Customer.create(
        email=user.email,
        name="%s %s" % (user.first_name, user.last_name),
        source=token.id,  # obtained with Stripe.js
    )


def card_token(card_number: str, expiry: datetime.date, cvc: str) -> stripe.Token:
    """
    Registers card in Stripe and returns its token
    """
    return stripe.Token.create(
        card={
            "number": card_number,
            "exp_month": expiry.month,
            "exp_year": expiry.year,
            "cvc": cvc,
        }
    )
