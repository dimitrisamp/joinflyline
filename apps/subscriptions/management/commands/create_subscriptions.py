from django.core.management import BaseCommand
from django.contrib.auth import get_user_model

from apps.account.views import add_subscription

User = get_user_model()


class Command(BaseCommand):
    help = "Creates subscriptions for users who does not have it"

    def handle(self, *args, **options):
        unsubscribed_users = User.objects.filter(subscriptions=None)
        for user in unsubscribed_users:
            if user.profile.customer_id:
                try:
                    add_subscription(user)
                except:
                    print('Error creating subscription for user {user}', file=self.stderr)
            else:
                print(f'User {user} has no token')
