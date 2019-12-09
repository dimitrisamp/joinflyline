from creditcards.forms import CardNumberField, CardExpiryField, SecurityCodeField
from django import forms
from django.conf import settings
from django.contrib.postgres.forms import JSONField

from apps.account.enums import CompanionInviteStatus
from apps.account.models import CompanionInvite


class WizardForm(forms.Form):
    home_airport = JSONField()
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)
    first_name = forms.CharField()
    last_name = forms.CharField()
    promo_code = forms.CharField(required=False)
    zip = forms.CharField(required=False)
    card_number = CardNumberField()
    expiry = CardExpiryField()
    cvc = SecurityCodeField()
    plan = forms.ChoiceField(
        choices=tuple((o, o) for o in settings.PLAN_DEFINITIONS.keys())
    )


class InviteWizardForm(forms.Form):
    home_airport = JSONField()
    password = forms.CharField(widget=forms.PasswordInput)
    first_name = forms.CharField()
    last_name = forms.CharField()
    code = forms.ModelChoiceField(
        CompanionInvite.objects.exclude(status=CompanionInviteStatus.active),
        to_field_name="invite_code",
    )
