from django import forms

from apps.account.enums import Gender
from apps.results import adjacency


MARKET_CHOICES = list(zip(*[list(adjacency.ADJACENCY.keys())] * 2))


class ProfileForm(forms.Form):
    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)
    email = forms.EmailField(required=False)
    dob = forms.DateField(required=False)
    gender = forms.TypedChoiceField(choices=Gender.choices(), coerce=int)
    market = forms.ChoiceField(choices=MARKET_CHOICES, required=False)
    tsa_precheck_number = forms.CharField(required=False)
