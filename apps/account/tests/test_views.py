import pytest
from django.urls import reverse

from apps.auth.factories import UserFactory, SubscriberUserFactory


@pytest.mark.parametrize(
    "plan,status_code,data",
    [
        (None, 404, {"error": {"code": "non-subscriber"}}),
        ("basic", 404, {"error": {"code": "limit-exceeded"}}),
        ("basic-plus", 201, None),
        ("pro", 201, None),
    ],
)
def test_companion_creation(plan, status_code, data, apiclient):
    COMPANION_EMAIL = "companion@example.com"
    if plan:
        user = SubscriberUserFactory(subscription__plan=plan)
    else:
        user = UserFactory()
    apiclient.force_authenticate(user)
    resp = apiclient.post(reverse("companion-list"), {"email": COMPANION_EMAIL})
    assert resp.status_code == status_code
    if data:
        assert resp.data == data
    else:
        assert resp.data["email"] == COMPANION_EMAIL
