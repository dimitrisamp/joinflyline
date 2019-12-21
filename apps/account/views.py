import stripe.error
from django.conf import settings
from django.db import transaction
from django.http import JsonResponse
from django.utils.timezone import now
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import FormView
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.account import serializers
from apps.account.actions import add_subscription, add_to_stripe, create_subscriber
from apps.account.enums import CompanionInviteStatus
from apps.account.forms import WizardForm, InviteWizardForm
from apps.account.models import Account, CompanionInvite
from apps.auth.enums import UserRole
from apps.auth.models import User
from apps.emails.views import signup_success

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
            new_user = create_subscriber(
                account=invite.sender.account,
                email=invite.email,
                password=cd['password'],
                role=UserRole.COMPANION,
                first_name=cd["first_name"],
                last_name=cd["last_name"],
                market=cd["home_airport"],
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
        if User.objects.filter(email=cd["email"]).exists():
            return JsonResponse(
                {"errors": {"email": "User already exists"}}, status=400
            )
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
            plan=cd["plan"]
        )
        return JsonResponse({"success": True})
