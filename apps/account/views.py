import stripe.error
from django.conf import settings
from django.db import transaction
from django.http import JsonResponse
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import FormView
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.account import serializers
from apps.account.actions import add_subscription, add_to_stripe, create_subscriber
from apps.account.enums import CompanionInviteStatus
from apps.account.forms import WizardForm, InviteWizardForm, ActivationWizardForm
from apps.account.models import Account, CompanionInvite, DealWatch
from apps.auth.enums import UserRole, UserSource
from apps.auth.models import User
from apps.emails.tasks import send_deal_alerts_activation_email
from apps.emails.views import signup_success
from apps.auth import serializers as auth_serializers
from wanderift.utils import generate_invite_code

stripe.api_key = settings.STRIPE_API_KEY


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


class ActivationCheckView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        code = request.query_params.get("activation_code")
        if not code:
            return JsonResponse({}, status=404)
        user = get_object_or_404(User, activation_code=code)
        return Response(auth_serializers.User(instance=user).data)


class ActivationWizardView(APIView):
    permission_classes = [AllowAny]

    def form_valid(self, request):
        form = ActivationWizardForm(request.data)
        if not form.is_valid():
            return Response({"errors": form.errors.as_json()}, status=400)
        cd = form.cleaned_data
        with transaction.atomic():
            user: User = get_object_or_404(
                User.objects.all(), activation_code=cd["activation_code"]
            )
            user.set_password(cd["password"])
            user.market = cd["home_airport"]
            user.first_name = cd["first_name"]
            user.last_name = cd["last_name"]
            user.activation_code = None
            user.save()
            return Response({"success": True})


class InviteWizardView(APIView):
    form_class = InviteWizardForm
    permission_classes = [AllowAny]

    def post(self, request):
        form = InviteWizardForm(request.data)
        if not form.is_valid():
            return Response({"errors": form.errors.as_json()}, status=400)
        cd = form.cleaned_data
        with transaction.atomic():
            invite: CompanionInvite = cd["code"]
            if User.objects.filter(email=invite.email).exists():
                return JsonResponse(
                    {"errors": {"email": "User already exists"}}, status=400
                )
            new_user = create_subscriber(
                account=invite.sender.account,
                email=invite.email,
                password=cd["password"],
                role=UserRole.COMPANION,
                first_name=cd["first_name"],
                last_name=cd["last_name"],
                market=cd["home_airport"],
                source=UserSource.COMPANION,
            )
            invite.status = CompanionInviteStatus.active
            invite.save()
            signup_success(new_user.pk)
            return Response({"success": True})


class AnonymousDealAlertsView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        source = request.data["source"]
        destination = request.data["destination"]
        email = request.data["email"]
        if User.objects.filter(email=email).exists():
            return Response(status=status.HTTP_404_NOT_FOUND)
        account = Account.objects.create()
        new_user = User.objects.create_user(
            email,
            email,
            market=source,
            account=account,
            role=UserRole.SUBSCRIBER,
            activation_code=generate_invite_code(),
            source=UserSource.DEAL_ALERTS
        )
        DealWatch.objects.create(user=new_user, destination=destination)
        send_deal_alerts_activation_email.delay(new_user.pk)
        return Response()


class WizardView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        form = WizardForm(request.data)
        if not form.is_valid():
            return Response({"errors": form.errors.as_json()}, status=400)
        cd = form.cleaned_data
        create_subscriber(
            account=None,
            email=cd["email"],
            password=cd["password"],
            first_name=cd["first_name"],
            last_name=cd["last_name"],
            zip=cd["zip"],
            market=cd["home_airport"],
            promo_code=cd["promo_code"],
            card_number=cd["card_number"],
            expiry=cd["expiry"],
            cvc=cd["cvc"],
            plan=cd["plan"],
        )
        return Response({"success": True})

