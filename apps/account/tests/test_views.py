import pytest
from django.urls import reverse

from apps.account.enums import CompanionInviteStatus
from apps.auth.factories import UserFactory, SubscriberUserFactory

COMPANION_EMAIL = "companion@example.com"
EXISTING_USER_EMAIL = "existing.user@example.com"


@pytest.mark.parametrize(
    "email,plan,status_code,data",
    [
        (COMPANION_EMAIL, None, 404, {"error": {"code": "non-subscriber"}}),
        (COMPANION_EMAIL, "basic", 404, {"error": {"code": "limit-exceeded"}}),
        (COMPANION_EMAIL, "basic-plus", 201, None),
        (COMPANION_EMAIL, "pro", 201, None),
        (EXISTING_USER_EMAIL, 'pro', 404, {"error": {"code": "existing-user"}})
    ],
)
def test_companion_creation(email, plan, status_code, data, apiclient):
    UserFactory(first_name='existing', last_name='user')
    if plan:
        user = SubscriberUserFactory(subscription__plan=plan)
    else:
        user = UserFactory()
    apiclient.force_authenticate(user)
    resp = apiclient.post(reverse("companion-list"), {"email": email})
    assert resp.status_code == status_code
    if data:
        assert resp.data == data
    else:
        assert resp.data["email"] == COMPANION_EMAIL
        assert resp.data['status'] == CompanionInviteStatus.created

