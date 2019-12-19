import datetime

import stripe
import stripe.error
from django.conf import settings
from django.db import transaction
from django.http import JsonResponse
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import FormView
from psycopg2.extras import DateTimeTZRange
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from apps.account import serializers
from apps.account.enums import CompanionInviteStatus
from apps.account.forms import WizardForm, InviteWizardForm
from apps.account.models import Account, CompanionInvite
from apps.auth.enums import UserRole
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


def add_subscription(account: Account, plan: str, promocode: str):
    if not Subscriptions.objects.filter(account=account).exists():
        params = {
            "customer": account.customer_id,
            "items": [{"plan": settings.SUBSCRIPTION_PLANS[plan]["stripe_plan_id"]}],
        }
        if promocode:
            params["coupon"] = promocode
        subscription = stripe.Subscription.create(**params)
        start = datetime.datetime.fromtimestamp(subscription["current_period_start"])
        end = datetime.datetime.fromtimestamp(subscription["current_period_end"])
        Subscriptions.objects.create(
            account=account, plan=plan, period=DateTimeTZRange(start, end)
        )


def add_to_stripe(user: User, plan, promocode):
    account = user.account
    stripe_card_token = card_token(account.card_number, account.expiry, account.cvc)
    account.token = stripe_card_token.id
    customer = stripe_customer(user)
    account.customer_id = customer.id
    account.save()
    add_subscription(account, plan, promocode)


class InviteCheckView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        code = request.query_params.get("code")
        invite = get_object_or_404(
            CompanionInvite,
            invite_code=code,
            status__in=[
                CompanionInviteStatus.created,
                CompanionInviteStatus.email_sent,
            ],
        )
        invite.accessed = now()
        invite.save()
        return Response(serializers.CompanionInvite(instance=invite).data)


class InviteWizardView(FormView):
    form_class = InviteWizardForm

    def form_invalid(self, form):
        return JsonResponse({"errors": form.errors.as_json()}, status=400)

    def form_valid(self, form):
        cd = form.cleaned_data
        with transaction.atomic():
            invite: CompanionInvite = cd["code"]
            if User.objects.filter(email=invite.email).exists():
                return JsonResponse(
                    {"errors": {"email": "User already exists"}}, status=400
                )
            new_user = User.objects.create_user(
                invite.email,
                invite.email,
                cd["password"],
                role=UserRole.COMPANION,
                first_name=cd["first_name"],
                last_name=cd["last_name"],
                market=cd["home_airport"],
                account=invite.sender.account,
            )
            invite.status = CompanionInviteStatus.active
            invite.save()
            signup_success(new_user.pk)
            return JsonResponse({"success": True})


class WizardView(FormView):
    form_class = WizardForm

    @csrf_exempt
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

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
                card_number=cd["card_number"], cvc=cd["cvc"], expiry=cd["expiry"]
            )
            new_user = User.objects.create_user(
                cd["email"],
                cd["email"],
                cd["password"],
                first_name=cd["first_name"],
                last_name=cd["last_name"],
                zip=cd["zip"],
                market=cd["home_airport"],
                account=account,
            )
            signup_success(new_user.pk)
            # TODO: handle promocode
            if account.card_number and account.expiry and account.cvc:
                add_to_stripe(new_user, cd["plan"], cd["promo_code"])
            return JsonResponse({"success": True})
