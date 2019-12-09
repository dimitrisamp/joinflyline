import factory.fuzzy
from django.utils.timezone import now

from apps.account.enums import CompanionInviteStatus
from apps.account.tests.data import DESTINATIONS
from apps.auth.enums import Gender, UserRole
from apps.auth.models import User


class UserFactory(factory.DjangoModelFactory):
    class Meta:
        model = User
    account = factory.SubFactory('apps.account.tests.factories.AccountFactory')
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
    role = UserRole.SUBSCRIBER

    @factory.post_generation
    def subscription(self, create, value, **kwargs):
        from apps.subscriptions.tests.factories import SubscriptionsFactory
        if not create:
            return
        data = {'account': self.account}
        SubscriptionsFactory(**data, **kwargs)


class CompanionUserFactory(UserFactory):
    role = UserRole.COMPANION
    account = None

    class Params:
        subscriber = None

    @factory.post_generation
    def account(self, create, value, **kwargs):
        from apps.account.tests.factories import CompanionInviteFactory
        subscriber = SubscriberUserFactory()
        current_time = now()
        CompanionInviteFactory.build(
            email=self.email,
            sender=subscriber,
            user=self,
            status=CompanionInviteStatus.active,
            accessed=current_time,
            signed_up=current_time
        )
        self.account = subscriber.account
        self.save()
