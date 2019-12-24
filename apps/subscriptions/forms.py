from creditcards.forms import CardNumberField, CardExpiryField, SecurityCodeField
from django import forms
from django.conf import settings


class SetPlanForm(forms.Form):
    zip = forms.CharField(required=False)
    card_number = CardNumberField()
    expiry = CardExpiryField()
    cvc = SecurityCodeField()
    plan = forms.ChoiceField(
        choices=tuple((o, o) for o in settings.PLAN_DEFINITIONS.keys()),
        required=False
    )
