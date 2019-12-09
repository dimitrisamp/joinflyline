import pytest
from rest_framework.test import APIClient

from apps.auth.factories import SubscriberUserFactory


@pytest.fixture
def customer(db):
    return SubscriberUserFactory()


@pytest.fixture
def apiclient(db, customer):
    client = APIClient()
    client.force_authenticate(customer)
    return client


@pytest.fixture
def anonapiclient(db):
    return APIClient()
