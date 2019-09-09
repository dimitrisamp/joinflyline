from django.contrib import messages
from django.shortcuts import render, redirect
import stripe

from home.views import home_view
from payments.models import Plans

stripe.api_key = "sk_test_H2ypPKiLEc14JVbd6OpDIWQv00gPMSrkj1"


def sub_payment(request, plan):
    plan = Plans.objects.filter(name=plan).values()[0]
    stripe.Subscription.create(
        customer=request.user.profile.customer_id,
        items=[
            {
                "plan": plan['plan_id'],
            },
        ]
    )

    messages.success(request, "Payment successful")
    return redirect(home_view)
