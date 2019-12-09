import pytest

from apps.auth.factories import UserFactory


@pytest.fixture
def existing_user(db):
    return UserFactory(first_name='existing', last_name='user')
