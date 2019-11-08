from django.contrib import messages, auth
from django.contrib.auth import authenticate, logout
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import redirect
from django.urls import reverse

from apps.home.views import index_view

from apps.emails.views import signup_success
import uuid


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
def forgot_password(request):
    user = User.objects.get(username=request.POST["email"])

    if user is not None:
        secret = uuid.uuid4().hex[0:16]
        user.profile.secret = secret
        user.profile.save()

        return HttpResponse(secret + "Password reset request is sent successfully", status=200)
    else:
        return HttpResponse("Failed: Email does not exist", status=405)


def logout_view(request):
    logout(request)
    return redirect(index_view)
