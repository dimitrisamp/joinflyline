import stripe
from django.conf import settings
from django.core.management import BaseCommand

from apps.common.tasks import sync_subscriptions

stripe.api_key = settings.STRIPE_API_KEY


class Command(BaseCommand):
    help = "Fix missing deal watch groups"

    def handle(self, *args, **options):
        sync_subscriptions()
