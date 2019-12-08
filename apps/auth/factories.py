import factory.fuzzy
from django.utils.timezone import now

from apps.account.tests.factories import DESTINATIONS
from apps.auth.enums import Gender
from apps.auth.models import User


class UserFactory(factory.DjangoModelFactory):
    class Meta:
        model = User

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
