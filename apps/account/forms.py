from django import forms

from apps.account.enums import Gender
from apps.results import adjacency
from creditcards.forms import CardNumberField, CardExpiryField, SecurityCodeField

MARKET_CHOICES = list(zip(*[list(adjacency.ADJACENCY.keys())] * 2))


class ProfileForm(forms.Form):
    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)
    email = forms.EmailField(required=False)
    dob = forms.DateField(required=False)
    gender = forms.TypedChoiceField(choices=Gender.choices(), coerce=int)
    market = forms.ChoiceField(choices=MARKET_CHOICES, required=False)
    tsa_precheck_number = forms.CharField(required=False)


class WizardForm(forms.Form):
    home_airport = forms.CharField()
    email = forms.EmailField()
    password = forms.CharField(widget=forms.PasswordInput)
    first_name = forms.CharField()
    last_name = forms.CharField()
    promo_code = forms.CharField()
    zip = forms.CharField()
    card_number = CardNumberField()
    expiry = CardExpiryField()
    cvc = SecurityCodeField()
