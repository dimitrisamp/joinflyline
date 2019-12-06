import factory
from django.contrib.auth import get_user_model
from apps.account import signals
from django.utils.timezone import now

from apps.account.tests.factories import ProfileFactory, AccountFactory


@factory.django.mute_signals(signals.post_save)
class UserFactory(factory.DjangoModelFactory):
    class Meta:
        model = get_user_model()

    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    email = factory.LazyAttribute(lambda a: f'{a.first_name}.{a.last_name}@example.com')
    username = factory.LazyAttribute(lambda a: a.email)
    password = 'secret'
    is_superuser = False
    is_staff = False
    is_active = True
    date_joined = factory.LazyFunction(now)
    profile = factory.RelatedFactory(ProfileFactory, 'user')
    account = factory.RelatedFactory(AccountFactory, 'user')
