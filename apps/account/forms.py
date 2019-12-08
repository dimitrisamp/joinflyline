from creditcards.forms import CardNumberField, CardExpiryField, SecurityCodeField
from django import forms
from django.conf import settings
from django.contrib.postgres.forms import JSONField


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
    plan = forms.ChoiceField(choices=tuple((o, o) for o in settings.PLAN_DEFINITIONS.keys()))
