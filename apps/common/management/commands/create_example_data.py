import os
from django.core.management import BaseCommand

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
            User.objects.create_superuser(su_name, su_name, su_password)
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
            u = User.objects.create_user(sub_name, sub_name, sub_password, account=account, market=market)
            Subscriptions.objects.create(account=u.account, plan="basic")


