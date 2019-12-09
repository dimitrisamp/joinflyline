import factory.fuzzy
from django.utils.timezone import now

from apps.account.tests.factories import DESTINATIONS, AccountFactory
from apps.auth.enums import Gender
from apps.auth.models import User
from apps.subscriptions.tests.factories import SubscriptionsFactory


class UserFactory(factory.DjangoModelFactory):
    class Meta:
        model = User
    account = factory.SubFactory(AccountFactory)
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    email = factory.LazyAttribute(lambda a: f'{a.first_name}.{a.last_name}@example.com')
    username = factory.LazyAttribute(lambda a: a.email)
    password = 'secret'
    is_superuser = False
    is_staff = False
    is_active = True
    date_joined = factory.LazyFunction(now)
    title = factory.fuzzy.FuzzyChoice(('mr', 'ms'))
    market = factory.fuzzy.FuzzyChoice(DESTINATIONS)
    gender = factory.fuzzy.FuzzyChoice([o[0] for o in Gender.choices()])
    phone_number = factory.faker.Faker('phone_number')
    dob = factory.faker.Faker('date_of_birth', minimum_age=18)
    tsa_precheck_number = ''


class SubscriberUserFactory(UserFactory):
    @factory.post_generation
    def subscription(self, create, value, **kwargs):
        if not create:
            return
        data = {'account': self.account}
        SubscriptionsFactory(**data, **kwargs)
