import pytest
from rest_framework.test import APIClient

from apps.oauth.factories import UserFactory


@pytest.fixture
def customer(db):
    return UserFactory()


@pytest.fixture
def apiclient(db, customer):
    client = APIClient()
    client.force_authenticate(customer)
    return client
