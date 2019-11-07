import os
from django.core.management import BaseCommand
from django.contrib.auth import get_user_model

from apps.subscriptions.models import Subscriptions

User = get_user_model()


class Command(BaseCommand):
    help = "Creates subscriptions for users who does not have it"

    def handle(self, *args, **options):
        unsubscribed_users = User.objects.filter(subscriptions=None)
        for user in unsubscribed_users:
            pass
