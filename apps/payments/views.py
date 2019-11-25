from django.contrib import messages
from django.shortcuts import redirect
from django.conf import settings
import stripe

from apps.home.views import index_view
from apps.subscriptions.models import Subscriptions

stripe.api_key = settings.STRIPE_API_KEY


