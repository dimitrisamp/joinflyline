from datetime import datetime
from django.contrib.auth import login
from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
import stripe
from django.urls import reverse
from django.views.generic import TemplateView, FormView

from apps.account.forms import ProfileForm, MARKET_CHOICES, WizardForm
from apps.account.models import Account
from apps.payments.models import Plans
from apps.payments.plans import get_available_plans
from apps.subscriptions.models import Subscriptions

stripe.api_key = settings.STRIPE_API_KEY


@login_required
def account_view(request):
    user_id = request.user.id
    user = User.objects.get(pk=user_id)
    try:
        account = Account.objects.filter(user=user)
    except Account.DoesNotExist:
        account = None

    context = {"title": "Accounts", "account": account}
    context["market_choices"] = MARKET_CHOICES
    plans = get_available_plans()
    context["credit_packs"] = [plans[c] for c in ["three-pack", "six-pack"]]
    context["subscriptions"] = [plans[c] for c in ["lite", "pro", "biz"]]
    return render(request, "accounts/accounts.html", context)


@login_required()
def update_profile(request):
    if request.method == "POST":
        user = request.user
        form = ProfileForm(request.POST)
        if form.is_valid():
            cd = form.cleaned_data
            user.first_name = cd["first_name"]
            user.last_name = cd["last_name"]
            user.email = cd["email"]
            user.profile.dob = cd["dob"]
            user.profile.gender = cd["gender"]
            user.profile.market = cd["market"]
            user.profile.tsa_precheck_number = cd["tsa_precheck_number"]
            user.profile.save()
            user.save()
    return redirect("accounts")


@login_required()
def save_card(request):
    user_id = request.user.id
    if request.method == "POST":
        user = User.objects.get(pk=user_id)

        card_number = request.POST["card_number"]
        expiry = request.POST["expiry"]
        cvc = request.POST["cvc"]
        country = request.POST["country"]
        zip = request.POST["zip"]

        card_info = card_token(card_number, expiry, cvc)
        account = Account.objects.create(
            card_number=card_number,
            expiry=expiry,
            cvc=cvc,
            country=country,
            zip=zip,
            brand=card_info.card.brand,
            last4=card_info.card.last4,
            stripe_id=card_info.card.id,
            token=card_info.id,
            user=user,
        )
        account.save()
        customer = stripe_customer(user)
        user.profile.customer_id = customer.id
        user.profile.save()
        messages.success(request, "Card details updated Successfully")
        return redirect("accounts")
    else:
        messages.error(request, "Details update failed. Please try again")
        return redirect("accounts")


def stripe_customer(user):
    return stripe.Customer.create(
        email=user.email,
        name="%s %s" % (user.first_name, user.last_name),
        source=user.account_set.all()[0].token,  # obtained with Stripe.js
    )


def card_token(card_number, expiry, cvc):
    date_object = datetime.strptime(expiry, "%d/%m/%Y")
    return stripe.Token.create(
        card={
            "number": card_number,
            "exp_month": date_object.month,
            "exp_year": date_object.year,
            "cvc": cvc,
        }
    )


def sub_user(request):
    user = request.user
    if request.method == "POST":
        if request.POST["subscription"] == "pro":
            user = request.user
            plan = Plans.objects.filter(name="pro").get()
            stripe.Subscription.create(
                customer=request.user.profile.customer_id,
                items=[{"plan": plan.plan_id}],
            )
            subscription = Subscriptions.objects.create(
                plan="pro", tokens=4, price=459, user=user
            )
            subscription.save()
            messages.success(request, "You subscribed to pro plan successfully")
        elif request.POST["subscription"] == "lite":
            user = request.user
            plan = Plans.objects.filter(name="lite").get()
            stripe.Subscription.create(
                customer=request.user.profile.customer_id,
                items=[{"plan": plan.plan_id}],
            )
            subscription = Subscriptions.objects.create(
                plan="lite", tokens=3, price=369, user=user
            )
            subscription.save()
            messages.success(request, "You subscribed to lite plan successfully")
    return redirect(account_view)


class WizardView(FormView):
    template_name = "home/wizard.html"
    form_class = WizardForm

    def form_invalid(self, form):
        return JsonResponse({"errors": form.errors.as_json()}, status=400)

    def form_valid(self, form):
        cd = form.cleaned_data
        if User.objects.filter(email=cd["email"]).exists():
            return JsonResponse(
                {"errors": {"email": "User already exists"}}, status=400
            )
        new_user = User.objects.create_user(
            cd["email"],
            cd["email"],
            cd["password"],
            first_name=cd["first_name"],
            last_name=cd["last_name"],
        )
        # TODO: send verification email
        # TODO: handle promocode
        Account.objects.create(
            user=new_user,
            card_number=cd["card_number"],
            cvc=cd["cvc"],
            expiry=cd["expiry"],
            zip=cd["zip"],
        )
        new_user.profile.market = cd["home_airport"]
        new_user.profile.save()
        login(self.request, new_user)
        return JsonResponse({"success": True})
