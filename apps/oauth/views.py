from django.contrib import messages, auth
from django.contrib.auth import authenticate, logout
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import redirect
from django.template.loader import render_to_string
from django.urls import reverse
from django.views import View

from apps.common.context_processors.common import get_user_info
from apps.home.views import index_view

from apps.emails.views import signup_success, forgot_password
from apps.oauth.forms import PasswordResetForm
from django.core.mail import send_mail
from datetime import datetime, timedelta
from django.conf import settings

from django.views.generic import FormView
from django.http import JsonResponse
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
        return redirect(reverse('sign-in'))


class ForgotPasswordView(FormView):
    form_class = PasswordResetForm
    template_name = "oauth/forgot-password.html"

    def form_valid(self, form):
        data = form.cleaned_data
        try:
            user = User.objects.get(email=data["email"])
        except User.DoesNotExist:
            return redirect("forgot-password")

        secret = random_16bit_hex_string()
        forgot_password(user.pk, secret)

        user.profile.secret = secret
        user.profile.expiration_time = datetime.now() + timedelta(
            seconds=settings.SECRET_LINK_EXPIRATION_SECONDS)
        user.profile.save()

        return redirect(index_view)

def random_16bit_hex_string():
    hex_characters = '0123456789abcdef'
    hex_string = ''.join([random.choice(hex_characters) for _ in range(16)])

    return hex_string

def logout_view(request):
    logout(request)
    return redirect(index_view)


def check_user_view(request):
    email = request.GET.get('email')
    result = False
    if email:
        if User.objects.filter(email=email).exists():
            result = True
    return JsonResponse({'exists': result})


class UserInfoView(View):
    def get(self, request):
        return JsonResponse(get_user_info(request.user))
