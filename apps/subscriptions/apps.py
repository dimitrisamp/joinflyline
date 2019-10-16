from django.apps import AppConfig
from django.contrib.auth import get_user_model


def is_subscriber(self):
    if not hasattr(self, 'subscriptions'):
        return False
    return self.subscriptions.tokens > 0


class SubscriptionsConfig(AppConfig):
    name = 'apps.subscriptions'

    def ready(self):
        User = get_user_model()
        User.add_to_class('is_subscriber', is_subscriber)
