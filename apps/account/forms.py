from django import forms

from apps.account.enums import Gender


class ProfileForm(forms.Form):
    first_name = forms.CharField(required=False)
    last_name = forms.CharField(required=False)
    email = forms.EmailField(required=False)
    dob = forms.DateField(required=False)
    gender = forms.TypedChoiceField(choices=Gender.choices(), coerce=int)
    market = forms.CharField(required=False)
