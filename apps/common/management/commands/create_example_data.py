import os
from django.core.management import BaseCommand
from django.contrib.auth import get_user_model

from apps.subscriptions.models import Subscriptions

User = get_user_model()


class Command(BaseCommand):
    help = "Creates example data"

    def handle(self, *args, **options):
        self.create_users()

    def create_users(self):
        su_name = os.getenv("SUPERUSER_NAME")
        su_password = os.getenv("SUPERUSER_PASSWORD")
        if su_name:
            User.objects.create_superuser(su_name, su_name, su_password)
        sub_name = os.getenv("SUBSCRIBER_NAME")
        sub_password = os.getenv("SUBSCRIBER_PASSWORD")
        if sub_name:
            u = User.objects.create_user(sub_name, sub_name, sub_password)
            Subscriptions.objects.create(user=u, plan="lite")
        nsub_name = os.getenv("NON_SUBSCRIBER_NAME")
        nsub_password = os.getenv("NON_SUBSCRIBER_PASSWORD")
        if nsub_name:
            User.objects.create_user(nsub_name, nsub_name, nsub_password)
        for u in User.objects.all():
            u.first_name = 'John'
            u.last_name = 'Smith'
            u.profile.market = 'New York'
            u.profile.save()
            u.save()
