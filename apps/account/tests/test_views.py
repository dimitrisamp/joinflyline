import pytest
from django.urls import reverse
from django.utils.dateparse import parse_datetime

from apps.account.enums import CompanionInviteStatus
from apps.account.models import CompanionInvite
from apps.account.tests.factories import CompanionInviteFactory
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
        (EXISTING_USER_EMAIL, "pro", 404, {"error": {"code": "existing-user"}}),
    ],
)
def test_companion_invite_creation(
    email, plan, status_code, data, apiclient, existing_user
):
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
        assert resp.data["status"] == CompanionInviteStatus.created
        assert resp.data["id"]
        assert resp.data["invited"]
        obj = CompanionInvite.objects.get(pk=resp.data["id"])
        assert obj.invite_code
        assert obj.invited
        assert not obj.accessed
        assert not obj.signed_up
        assert obj.sender == user


@pytest.mark.parametrize("send,result", ((True, 200), (False, 404), (None, 404)))
def test_invite_check(send, result, customer, apiclient):
    invite: CompanionInvite = CompanionInviteFactory(sender=customer)
    if send is None:
        data = {}
    elif send:
        data = {'code': invite.invite_code}
    else:
        data = {'code': 'nothing'}
    resp = apiclient.get(reverse("invite-check"), data)
    assert resp.status_code == result
    if result == 200:
        assert resp.data["id"] == invite.id
        assert parse_datetime(resp.data["invited"]) == invite.invited
        assert resp.data["email"] == invite.email
        assert resp.data["status"] == CompanionInviteStatus.created
