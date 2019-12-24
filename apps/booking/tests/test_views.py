from unittest import mock

import factory
import pytest
from django.urls import reverse
from django.utils.timezone import now

from apps.auth.models import User
from apps.subscriptions.models import Subscriptions


def test_user_creation(customer):
    assert customer.is_active


def test_api_trip_summary(apiclient, customer):
    resp = apiclient.get(reverse("booking-summary"))
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, dict)
    assert data["savings"] == {"domestic": 0, "international": 0}
    assert data["count"] == {"domestic": 0, "international": 0}


@pytest.mark.parametrize("plan", ("basic", "pro", None))
def test_booking(plan, anonapiclient):
    phone_number = factory.faker.Faker("phone_number").generate()
    email = factory.faker.Faker("email").generate()
    first_name = factory.faker.Faker("first_name").generate()
    last_name = factory.faker.Faker("last_name").generate()
    home_airport = {
        "type": "city",
        "code": "DFW",
        "name": "Dallas",
        "subdivision": {"name": "Texas"},
        "country": {"code": "US"},
    }
    data = {
        "retail_info": {},
        "payment": {
            "email": email,
            "phone": phone_number,
            "card_number": "4242424242424242",
            "expiry": "11/21",
            "credit_card_cvv": 123,
            "promocode": "",
        },
        "upgrade_to_plan": plan,
        "searchForm": {"placeFrom": home_airport},
        "passengers": [{"name": first_name, "surname": last_name}],
    }
    start_date = now().replace(microsecond=0)
    end_date = start_date.replace(year=start_date.year + 1)
    with mock.patch("apps.booking.views.save_booking") as save_booking, mock.patch(
        "apps.account.actions.add_to_stripe"
    ) as add_to_stripe, mock.patch(
        "apps.account.actions.stripe_subscribe",
        return_value={
            "current_period_start": int(start_date.timestamp()),
            "current_period_end": int(end_date.timestamp()),
        },
    ) as stripe_subscribe:
        resp = anonapiclient.post(reverse("book"), data, format="json")
        assert resp.status_code == 200
        assert save_booking.called
    user_qs = User.objects.filter(username=email)
    assert user_qs.exists()
    assert user_qs.count() == 1
    user: User = user_qs.first()
    assert user.email == email
    assert user.first_name == first_name
    assert user.last_name == last_name
    assert user.market == home_airport
    assert user.phone_number == phone_number
    assert user.account is not None
    if plan:
        assert add_to_stripe.called
        assert stripe_subscribe.called
        subscription: Subscriptions = user.subscription()
        assert subscription.plan == plan
        assert subscription.period.lower == start_date
        assert subscription.period.upper == end_date
    else:
        assert not add_to_stripe.called
        assert not stripe_subscribe.called
        subscription = user.subscription()
        assert subscription is None
        assert user.activation_code is not None
