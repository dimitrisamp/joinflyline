import os
from datetime import timedelta

from django.core.management import BaseCommand
from django.utils.timezone import now
from psycopg2.extras import DateTimeTZRange

from apps.account.models import Account
from apps.auth.models import User
from apps.subscriptions.models import Subscriptions


class Command(BaseCommand):
    help = "Creates example data"

    def handle(self, *args, **options):
        self.create_users()

    def create_users(self):
        su_name = os.getenv("SUPERUSER_NAME")
        su_password = os.getenv("SUPERUSER_PASSWORD")
        if su_name:
            account = Account.objects.create()
            user = User.objects.create_superuser(su_name, su_name, su_password, account=account)
        sub_name = os.getenv("SUBSCRIBER_NAME")
        sub_password = os.getenv("SUBSCRIBER_PASSWORD")
        if sub_name:
            account = Account.objects.create()
            market = {
                "code": "DFW",
                "name": "Dallas",
                "type": "city",
                "country": {"code": "US"},
                "subdivision": {"name": "Texas"},
            }
            u = User.objects.create_user(
                sub_name, sub_name, sub_password, account=account, market=market
            )
            Subscriptions.objects.create(
                account=u.account,
                plan="basic-plus",
                period=DateTimeTZRange(now(), now() + timedelta(days=365)),
            )
