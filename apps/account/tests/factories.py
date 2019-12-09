import random

import factory.fuzzy

from apps.account.enums import CompanionInviteStatus
from apps.account.models import DealWatch, Account, CompanionInvite
from apps.account.tests.data import DESTINATIONS, AIRLINES
from apps.auth.factories import SubscriberUserFactory


class DealWatchFactory(factory.DjangoModelFactory):
    class Meta:
        model = DealWatch

    destination = factory.fuzzy.FuzzyChoice(DESTINATIONS)

    @factory.lazy_attribute
    def max_price(self):
        if random.random() > 0.5:
            return None
        return random.randint(6, 50) * 10

    @factory.lazy_attribute
    def airlines(self):
        if random.random() > 0.5:
            return []
        return random.sample(AIRLINES, random.randint(1, 4))


class AccountFactory(factory.DjangoModelFactory):
    class Meta:
        model = Account

    card_number = factory.faker.Faker("credit_card_number")
    cvc = factory.faker.Faker("credit_card_security_code")
    expiry = factory.faker.Faker("credit_card_expire")
    stripe_id = ""
    customer_id = ""


class CompanionInviteFactory(factory.DjangoModelFactory):
    class Meta:
        model = CompanionInvite

    email = factory.faker.Faker('email')
    sender = factory.SubFactory(SubscriberUserFactory)
    user = None
    status = CompanionInviteStatus.created
    accessed = None
    signed_up = None

