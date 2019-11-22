from django import forms
from django.conf import settings
from django.contrib.postgres.forms import JSONField

from apps.account.enums import Gender
from creditcards.forms import CardNumberField, CardExpiryField, SecurityCodeField

class ProfileForm(forms.Form):
    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)
    email = forms.EmailField(required=False)
    dob = forms.DateField(required=False)
    gender = forms.TypedChoiceField(choices=Gender.choices(), coerce=int)
    market = forms.CharField(required=False)
    tsa_precheck_number = forms.CharField(required=False)
    phone_number = forms.CharField(required=False)
    password = forms.CharField(widget=forms.PasswordInput, required=False)


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
    plan = forms.ChoiceField(choices=tuple((o, o) for o in settings.SUBSCRIPTION_PLANS.keys()))
