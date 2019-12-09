import datetime

from django.conf import settings
import factory.fuzzy
from psycopg2.extras import DateTimeTZRange

from apps.account.tests.factories import AccountFactory
from apps.subscriptions.models import Subscriptions


class SubscriptionsFactory(factory.DjangoModelFactory):
    class Meta:
        model = Subscriptions

    account = factory.SubFactory(AccountFactory)
    plan = factory.fuzzy.FuzzyChoice(list(settings.PLAN_DEFINITIONS.keys()))

    @factory.lazy_attribute
    def period(self):
        period = datetime.timedelta(days=365)
        start = factory.faker.Faker('date_time_this_month').generate()
        end = start + period
        return DateTimeTZRange(start, end)
