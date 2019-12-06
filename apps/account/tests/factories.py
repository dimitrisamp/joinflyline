import random

import factory
import factory.fuzzy

from apps.account.enums import Gender
from apps.account.models import DealWatch, Profile, Account
from .. import signals

DESTINATIONS = [
    {
        "code": "DFW",
        "name": "Dallas",
        "type": "city",
        "country": {"code": "US"},
        "subdivision": {"name": "Texas"},
    },
    {
        "code": "LAS",
        "name": "Las Vegas",
        "type": "city",
        "country": {"code": "US"},
        "subdivision": {"name": "Nevada"},
    },
    {
        "code": "NYC",
        "name": "New York",
        "type": "city",
        "country": {"code": "US"},
        "subdivision": {"name": "New York"},
    },
    {
        "code": "WAS",
        "name": "Washington, D.C.",
        "type": "city",
        "country": {"code": "US"},
        "subdivision": {"name": "District of Columbia"},
    },
    {
        "code": "HOU",
        "name": "Houston",
        "type": "city",
        "country": {"code": "US"},
        "subdivision": {"name": "Texas"},
    },
    {
        "code": "LAX",
        "name": "Los Angeles",
        "type": "city",
        "country": {"code": "US"},
        "subdivision": {"name": "California"},
    },
    {
        "code": "ALA",
        "name": "Almaty",
        "type": "city",
        "country": {"code": "KZ"},
        "subdivision": {"name": None},
    },
    {
        "code": "TSE",
        "name": "Nur-Sultan",
        "type": "city",
        "country": {"code": "KZ"},
        "subdivision": {"name": None},
    },
    {
        "code": "CAI",
        "name": "Cairo",
        "type": "city",
        "country": {"code": "EG"},
        "subdivision": {"name": None},
    },
    {
        "code": "MOW",
        "name": "Moscow",
        "type": "city",
        "country": {"code": "RU"},
        "subdivision": {"name": "Central Federal District"},
    },
    {
        "code": "BJS",
        "name": "Beijing",
        "type": "city",
        "country": {"code": "CN"},
        "subdivision": {"name": None},
    },
]
AIRLINES = [
    "DL",
    "AS",
    "NK",
    "B6",
    "F9",
    "G4",
    "UA",
    "AA",
    "WN",
    "SY",
    "4O",
    "AC",
    "AF",
    "AM",
    "DI",
    "EK",
    "F8",
    "HU",
    "KL",
    "LH",
]


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


class ProfileFactory(factory.DjangoModelFactory):
    class Meta:
        model = Profile

    title = factory.fuzzy.FuzzyChoice(('mr', 'ms'))
    market = factory.fuzzy.FuzzyChoice(DESTINATIONS)
    gender = factory.fuzzy.FuzzyChoice([o[0] for o in Gender.choices()])
    phone_number = factory.faker.Faker('phone_number')
    secret = ''
    dob = factory.faker.Faker('date_of_birth', minimum_age=18)
    customer_id = ''
    tsa_precheck_number = ''


class AccountFactory(factory.DjangoModelFactory):
    class Meta:
        model = Account

    card_number = factory.faker.Faker('credit_card_number')
    cvc = factory.faker.Faker('credit_card_security_code')
    expiry = factory.faker.Faker('credit_card_expire')
    country = factory.faker.Faker('country_code')
    zip = factory.faker.Faker('postalcode')
    brand = ''
    last4 = ''
    stripe_id = ''
    token = ''
