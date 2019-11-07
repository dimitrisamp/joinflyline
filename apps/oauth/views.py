from django.contrib import messages, auth
from django.contrib.auth import authenticate, logout
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import redirect
from django.template.loader import render_to_string
from django.urls import reverse

from apps.home.views import index_view

from apps.emails.views import signup_success
from apps.oauth.forms import PasswordResetForm
from django.core.mail import send_mail
from datetime import datetime, timedelta
from django.conf import settings

import random


def create_user(request):
    username = request.POST.get("email", "admin@gmail.com")  # TODO: who should we use that default email?
    email = username
    password = request.POST["password"]

    user = User.objects.create_user(username, email, password)
    user.save()
    signup_success(request, user)

    user = authenticate(request, username=username, password=password)
    auth.login(request, user)
    return redirect(reverse('accounts'))


def login_user(request):
    username = request.POST["email"]
    password = request.POST["password"]
    user = authenticate(request, username=username, password=password)
    if user is not None:
        auth.login(request, user)
        return redirect(index_view)
    else:
        return redirect(index_view)


# TODO: ???? This allows anyone to easily change anybody's password
def password_reset_email(request):
    if request.method == "POST":
        form = PasswordResetForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data
            try:
                user = User.objects.get(username=data["email"])

                secret = random_16bit_hex_string()

                htm_content = render_to_string(
                    "emails/forgot-password.html",
                    {
                        "data": user,
                        "secret": secret
                    },
                )
                from_email = settings.DEFAULT_FROM_EMAIL
                to_email = user.email
                subject = "Forgot Password"
                send_mail(subject, "text body", from_email, [to_email], html_message=htm_content)

                user.profile.secret = secret
                user.profile.expiration_time = datetime.now() + timedelta(seconds=settings.SECRET_LINK_EXPIRATION_SECONDS)

                user.profile.save()
            except User.DoesNotExist:
                return redirect("forgot-password")

    return redirect("forgot-password")

def random_16bit_hex_string():
    hex_characters = '0123456789abcdef'
    hex_string = ''.join([random.choice(hex_characters) for _ in range(16)])

    return hex_string

def logout_view(request):
    logout(request)
    return redirect(index_view)
