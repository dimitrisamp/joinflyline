from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import render, redirect

from account.views import account_view


def create_user(request):
    print(request.POST)
    username = request.POST.get("email", "admin@gmail.com")
    email = username
    password = request.POST["password"]

    user = User.objects.create_user(username, email, password)
    user.save()

    context = {
        "msg": "passed"
    }
    return render(request, "home.html", context)


def login_user(request):
    username = request.POST["email"]
    password = request.POST["password"]
    user = authenticate(username=username, password=password)
    if user is not None:
        return redirect(account_view, user.id)
    else:
        return HttpResponse("Failed: Your credentials were incorrect", status=401)


def forgot_password(request):
    user = User.objects.get(username=request.POST["email"])

    if user is not None:
        user.set_password(request.POST["password"])
        user.save()
        return HttpResponse("Password reset successfully", status=200)
    else:
        return HttpResponse("Failed: Email does not exist", status=405)
