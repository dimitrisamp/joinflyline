from datetime import datetime
from django.contrib.auth import login
from django.conf import settings
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import render, redirect
import stripe
import stripe.error
from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView, FormView, UpdateView

from apps.account.forms import ProfileForm, MARKET_CHOICES, WizardForm
from apps.account.models import Account, FrequentFlyer
from apps.emails.views import signup_success
from apps.payments.models import Plans
from apps.payments.plans import get_available_plans
from apps.subscriptions.models import Subscriptions

stripe.api_key = settings.STRIPE_API_KEY


class AccountView(FormView):
    form_class = ProfileForm
    template_name = 'accounts/accounts.html'

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get_success_url(self):
        return reverse('accounts')

    def get_context_data(self, **kwargs):
        context = {"title": "Accounts"}

    def form_valid(self, form):
        user = self.request.user
        cd = form.cleaned_data
        user.first_name = cd["first_name"]
        user.last_name = cd["last_name"]
        user.email = cd["email"]
        user.profile.dob = cd["dob"]
        user.profile.gender = cd["gender"]
        user.profile.market = cd["market"]
        user.profile.tsa_precheck_number = cd["tsa_precheck_number"]
        user.profile.phone_number = cd['phone_number']
        user.profile.save()
        if cd['password']:
            user.set_password(cd['password'])
        user.save()
        return super().form_valid(form)


class FrequentFlyerEdit(LoginRequiredMixin, UpdateView):
    model = FrequentFlyer
    fields = [
        'american_airlines',
        'united_airlines',
        'southwest_airlines',
        'sun_country_airlines',
        'frontier_airlines',
        'delta_airlines',
        'alaska_airlines',
        'jetBlue',
        'spirit_airlines',
        'allegiant_air',
        'hawaiian_airlines'
    ]
    template_name = 'accounts/accounts.html'

    def get_object(self, queryset=None):
        return self.model.objects.get_or_create(user=self.request.user)[0]

    def get_success_url(self):
        return reverse('accounts')


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
    return stripe.Token.create(
        card={
            "number": card_number,
            "exp_month": expiry.month,
            "exp_year": expiry.year,
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


def add_subscription(user_id):
    if isinstance(user_id, (int, str)):
        user = User.objects.get(pk=user_id)
    else:
        user = user_id
    if not Subscriptions.objects.filter(user=user).exists():
        subscription = stripe.Subscription.create(
            customer=user.profile.customer_id,
            items=[
                {
                    "plan": settings.STRIPE_BASIC_PLAN_ID
                }
            ]
        )
        Subscriptions.objects.create(user=user, plan=settings.STRIPE_BASIC_PLAN_ID)


def add_to_stripe(user):
    account = user.account_set.all()[0]
    stripe_card_token = card_token(account.card_number, account.expiry, account.cvc)
    account.token = stripe_card_token.id
    account.save()
    customer = stripe_customer(user)
    user.profile.customer_id = customer.id
    user.profile.save()
    add_subscription(user)


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
        signup_success(new_user.pk)
        # TODO: handle promocode
        account = Account.objects.create(
            user=new_user,
            card_number=cd["card_number"],
            cvc=cd["cvc"],
            expiry=cd["expiry"],
            zip=cd["zip"],
        )
        new_user.profile.market = cd["home_airport"]
        new_user.profile.save()
        if account.card_number and account.expiry and account.cvc:
            add_to_stripe(new_user)
        login(self.request, new_user)
        return JsonResponse({"success": True})
