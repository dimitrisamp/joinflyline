from django.urls import reverse


def test_user_creation(customer):
    assert customer.is_active


def test_api_trip_summary(apiclient, customer):
    resp = apiclient.get(reverse('booking-summary'))
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, dict)
    assert data['savings'] == {'domestic': 0, 'international': 0}
    assert data['count'] == {'domestic': 0, 'international': 0}
