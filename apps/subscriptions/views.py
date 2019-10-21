from django.contrib import auth, messages
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.http import Http404
from django.shortcuts import render, redirect
from django.conf import settings
from django.utils.timezone import now

from apps.account.models import Account
from apps.account.views import account_view
from apps.payments.models import Plans
from apps.payments.plans import plan2group, GROUP_TO_PLAN, get_available_plans
from apps.payments.views import sub_payment
from apps.subscriptions.models import Subscriptions
import stripe


stripe.api_key = settings.STRIPE_API_KEY


def retail_sub_view(request):
    if request.method == "POST":

        username = request.POST["email"]
        email = username
        password = request.POST["password"]

        user = save_user_info(request)

        if request.POST["subscription"] == "pro":
            subscription = Subscriptions.objects.create(
                plan="pro", tokens=4, price=459, user=user
            )
            subscription.save()
            messages.success(request, "You subscribed to pro plan successfully")
        elif request.POST["subscription"] == "lite":
            subscription = Subscriptions.objects.create(
                plan="lite", tokens=3, price=369, user=user
            )
            subscription.save()
            messages.success(request, "You subscribed to lite plan successfully")

        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth.login(request, user)
            messages.success(request, "Login Successful")
            return redirect(sub_payment, plan=request.POST["subscription"])
        else:
            messages.danger(request, "Failed to create account. Please contact support")
            context = {"users": user}
            return render(request, "subscriptions/subscription.html", context)
    else:
        available_plans = get_available_plans()
        code = request.GET.get('code')
        select_annual = request.GET.get('annual')
        if select_annual:
            select_annual = select_annual.lower() in ['true', '1']
        if not code:
            raise Http404('`code` is required')
        group_name = plan2group[code]
        annual, group_codes = GROUP_TO_PLAN[group_name]
        if annual:
            group_plans = [available_plans[group_codes]] * 2
            checked_index = 1 if select_annual else 0
        else:
            group_plans = [available_plans[group_code] for group_code in group_codes]
            checked_index = 0 if group_codes[0] == code else 1
        context = {
            'select_annual': select_annual,
            'code': code,
            'checked_index': checked_index,
            'annual_group': annual,
            'group_plans': group_plans,
            'selected_plan': group_plans[checked_index],
            'title': settings.SITE_TITLE,
        }
        return render(request, "subscriptions/subscription.html", context)


def save_user_info(request):
    username = request.POST["email"]
    email = username
    password = request.POST["password"]
    first_name = request.POST["first_name"]
    last_name = request.POST["last_name"]
    gender = request.POST["gender"]
    dob = request.POST["dob"]
    phone_number = request.POST["phone_number"]
    card_number = request.POST["card_number"]
    expiry = request.POST["expiry"]
    cvc = request.POST["cvc"]
    country = request.POST["country"]
    zip = request.POST["zip"]
    title = request.POST["title"]
    user = User.objects.create_user(
        username, email, password, first_name=first_name, last_name=last_name
    )
    user.save()

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

    user = User.objects.get(pk=user.id)
    user.profile.title = title
    user.profile.dob = dob
    user.profile.gender = gender
    user.profile.phone_number = phone_number
    user.profile.customer_id = customer.id
    user.profile.save()

    return user


def stripe_customer(user):
    return stripe.Customer.create(
        email=user.email,
        name="%s %s" % (user.first_name, user.last_name),
        source=user.account_set.all()[0].token,  # obtained with Stripe.js
    )


def parse_expiry(v):
    century = now().year // 100
    sm, sy = map(int, v.split('/'))
    if 0 <= sy <= 99:
        sy += century
    return sm, sy


def card_token(card_number, expiry, cvc):
    month, year = parse_expiry(expiry)
    return stripe.Token.create(
        card={
            "number": card_number,
            "exp_month": month,
            "exp_year": year,
            "cvc": cvc,
        }
    )


def plan_subscription(request, plan):
    if request.user.profile.customer_id:
        user = request.user
        if plan == "pro":
            plan = Plans.objects.filter(name=plan).get()
            stripe.Subscription.create(
                customer=request.user.profile.customer_id,
                items=[{"plan": plan.plan_id}],
            )
            subscription = Subscriptions.objects.update_or_create(
                plan="pro", tokens=4, price=459, defaults={"user": user}
            )
            messages.success(request, "You subscribed to pro plan successfully")
        elif plan == "lite":
            plan = Plans.objects.filter(name=plan).get()
            stripe.Subscription.create(
                customer=request.user.profile.customer_id,
                items=[{"plan": plan.plan_id}],
            )
            subscription = Subscriptions.objects.get_or_create(
                plan="lite", tokens=3, price=369, defaults={"user": user}
            )
            messages.success(request, "You subscribed to lite plan successfully")

        return redirect(account_view)
    else:
        messages.error(request, "Please update your profile and card details")
        return redirect(account_view)
