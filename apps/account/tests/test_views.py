import json
from types import SimpleNamespace
from unittest import mock

import factory
import pytest
from django.core import mail
from django.db import transaction
from django.test import override_settings, TestCase
from django.urls import reverse
from django.utils.dateparse import parse_datetime
from rest_framework.test import APIClient

from apps.account.enums import CompanionInviteStatus
from apps.account.models import CompanionInvite
from apps.account.tests.data import DESTINATIONS
from apps.account.tests.factories import CompanionInviteFactory
from apps.auth.enums import UserRole
from apps.auth.factories import UserFactory, SubscriberUserFactory, CompanionUserFactory
from apps.auth.models import User

COMPANION_EMAIL = "companion@example.com"
EXISTING_USER_EMAIL = "existing.user@example.com"


@pytest.mark.parametrize(
    "email,plan,status_code,data",
    [
        (COMPANION_EMAIL, None, 404, {"error": {"code": "non-subscriber"}}),
        (COMPANION_EMAIL, "basic", 404, {"error": {"code": "limit-exceeded"}}),
        (COMPANION_EMAIL, "pro", 201, None),
        (EXISTING_USER_EMAIL, "pro", 404, {"error": {"code": "existing-user"}}),
    ],
)
@pytest.mark.django_db(transaction=True)
def test_companion_invite_creation(
    email, plan, status_code, data, apiclient, existing_user
):
    if plan:
        user = SubscriberUserFactory(subscription__plan=plan)
    else:
        user = UserFactory()
    apiclient.force_authenticate(user)
    with override_settings(EMAIL_BACKEND="anymail.backends.test.EmailBackend"):
        resp = apiclient.post(reverse("companion-list"), {"email": email})
    assert resp.status_code == status_code
    if data:
        assert resp.data == data
    else:
        assert resp.data["email"] == COMPANION_EMAIL
        assert resp.data["status"] == CompanionInviteStatus.created
        assert resp.data["id"]
        assert resp.data["invited"]
        obj = CompanionInvite.objects.get(pk=resp.data["id"])
        assert obj.invite_code
        assert obj.invited
        assert not obj.accessed
        assert not obj.signed_up
        assert obj.sender == user
        # invite = CompanionInvite.objects.get(email=COMPANION_EMAIL)
        # assert invite.status == CompanionInviteStatus.email_sent
        # assert len(mail.outbox) == 1
        # assert mail.outbox[0].to == obj.email


@pytest.mark.parametrize("send,result", ((True, 200), (False, 404), (None, 404)))
def test_invite_check(send, result, customer, apiclient):
    invite: CompanionInvite = CompanionInviteFactory(sender=customer)
    if send is None:
        data = {}
    elif send:
        data = {"code": invite.invite_code}
    else:
        data = {"code": "nothing"}
    resp = apiclient.get(reverse("invite-check"), data)
    assert resp.status_code == result
    if result == 200:
        assert resp.data["id"] == invite.id
        assert parse_datetime(resp.data["invited"]) == invite.invited
        assert resp.data["email"] == invite.email
        assert resp.data["status"] == CompanionInviteStatus.created


@pytest.mark.parametrize("bad,result", ((False, 200), (True, 400)))
def test_invite_register(bad, result, customer, anonapiclient):
    invite: CompanionInvite = CompanionInviteFactory(sender=customer)
    resp = anonapiclient.post(
        reverse("get-started-companion"),
        {
            "home_airport": json.dumps(DESTINATIONS[0]),
            "password": "someWeird1234Password",
            "first_name": factory.faker.Faker("first_name").generate(),
            "last_name": factory.faker.Faker("last_name"),
            "code": "bad" if bad else invite.invite_code,
        },
    )
    assert resp.status_code == result
    if not bad:
        invite.refresh_from_db()
        companion = User.objects.get(email=invite.email)
        assert companion.role == UserRole.COMPANION
        assert invite.status == CompanionInviteStatus.active
        assert companion.account == customer.account


def test_companion_cannot_invite(db):
    companion = CompanionUserFactory()
    client = APIClient()
    client.force_authenticate(companion)
    email = factory.faker.Faker("email").generate()
    resp = client.post(reverse("companion-list"), {"email": email})
    assert resp.status_code == 403


@pytest.mark.parametrize(
    "plan,send_card,response_code",
    (
        (None, False, 200),
        (None, True, 200),
        ("basic", False, 400),
        ("basic", True, 200),
        ("pro", False, 400),
        ("pro", True, 200),
    ),
)
def test_sign_up(db, plan, send_card, response_code, anonapiclient):
    if not send_card:
        card_params = {}
    else:
        card_params = {
            "card_number": factory.faker.Faker("credit_card_number").generate(),
            "cvc": factory.faker.Faker("credit_card_security_code").generate(),
            "expiry": factory.faker.Faker("credit_card_expire").generate(),
        }
    request_params = {
        "home_airport": json.dumps(DESTINATIONS[0]),
        "email": factory.faker.Faker("email").generate(),
        "password": "someWeird1234Password",
        "first_name": factory.faker.Faker("first_name").generate(),
        "last_name": factory.faker.Faker("last_name"),
        **card_params,
    }
    if plan:
        request_params["plan"] = plan
    with mock.patch(
        "stripe.Subscription.create",
        new=lambda *args, **kwargs: {"current_period_start": 1576739554, "current_period_end": 1577739554},
    ) as sub_create, mock.patch(
        "stripe.Customer.create", new=lambda *args, **kwargs: SimpleNamespace(id="cus")
    ) as cus_create, mock.patch(
        "stripe.Token.create", new=lambda *args, **kwargs: SimpleNamespace(id="tok")
    ) as tok_create:
        resp = anonapiclient.post(reverse("wizard"), request_params)
    assert resp.status_code == response_code
