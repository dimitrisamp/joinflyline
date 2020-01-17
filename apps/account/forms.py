from creditcards.forms import CardNumberField, CardExpiryField, SecurityCodeField
from django import forms
from django.conf import settings
from django.contrib.postgres.forms import JSONField
from django.core.exceptions import ValidationError

from apps.account.enums import CompanionInviteStatus
from apps.account.models import CompanionInvite


class MyCardExpiryField(CardExpiryField):
    input_formats = [
        "%m/%y",
        "%m/%Y",
        "%m-%y",
        "%m-%Y",
        "%y/%m",
        "%Y/%m",
        "%y-%m",
        "%Y-%m",
    ]


class WizardForm(forms.Form):
    home_airport = JSONField()
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)
    first_name = forms.CharField()
    last_name = forms.CharField()
    promo_code = forms.CharField(required=False)
    zip = forms.CharField(required=False)
    card_number = CardNumberField(required=False)
    expiry = MyCardExpiryField(required=False)
    cvc = SecurityCodeField(required=False)
    plan = forms.ChoiceField(
        choices=tuple((o, o) for o in settings.PLAN_DEFINITIONS.keys()), required=False
    )

    def clean(self):
        cd = self.cleaned_data
        if cd.get("plan"):
            if not (cd.get("card_number") and cd.get("expiry") and cd.get("cvc")):
                raise ValidationError("Paid account requires payment credentials")


class InviteWizardForm(forms.Form):
    home_airport = JSONField()
    password = forms.CharField(widget=forms.PasswordInput)
    first_name = forms.CharField()
    last_name = forms.CharField()
    code = forms.ModelChoiceField(
        CompanionInvite.objects.exclude(status=CompanionInviteStatus.active),
        to_field_name="invite_code",
    )


class ActivationWizardForm(forms.Form):
    home_airport = JSONField()
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)
    first_name = forms.CharField()
    last_name = forms.CharField()
    activation_code = forms.CharField()
