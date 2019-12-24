import uuid

import requests
from django.conf import settings as S

from apps.booking.models import BookingContact
from apps.booking.exceptions import ClientException
from apps.booking.constants import SAVE_BOOKING_API_URL, CONFIRM_PAYMENT_API_URL, CONFIRM_PAYMENT_ZOOZ_API_URL
from apps.emails.views import booking_success


def make_hold_bags(flight_ids, bags):
    result = {}
    for flight_id in flight_ids:
        flight_bags = {}
        for i in range(1, 4):
            flight_bags[str(i)] = 0 if bags < i else 1
        result[flight_id] = flight_bags
    return result


def save_booking(user, data, zooz=True, test=False):
    body = data.copy()
    payment = body.pop("payment")
    promo = payment.pop("promocode")
    retail_info = body.pop("retail_info")
    p = body["passengers"][0]
    p["email"] = S.RECEIVE_EMAIL
    p["phone"] = payment.get("phone", S.RECEIVE_PHONE)
    headers = {"content-type": "application/json", "apikey": S.KIWI_API_KEY}
    try:
        response = requests.post(SAVE_BOOKING_API_URL, json=body, headers=headers)
    except requests.RequestException as e:
        raise ClientException({"code": "requests-exception"}) from e
    if response.status_code != 200:
        raise ClientException(response.json())
    booking = response.json()
    if zooz:
        confirm_payment_zooz(booking, payment, test=test)
    else:
        confirm_payment(booking)
    BookingContact.from_data(
        booking_data=booking,
        email=payment["email"],
        phone=payment["phone"],
        user=user,
        retail_info=retail_info,
    )
    booking_success(booking)


def confirm_payment(booking):
    body = {
        "booking_id": booking["booking_id"],
        "transaction_id": booking["transaction_id"],
    }
    headers = {"apikey": S.KIWI_API_KEY}
    try:
        response = requests.post(
            CONFIRM_PAYMENT_API_URL,
            json=body,
            headers={"content-type": "application/json", **headers},
        )
    except requests.RequestException as e:
        raise ClientException() from e
    data = response.json()
    if response.status_code != 200:
        raise ClientException(data)
    if data["status"] != 0:
        raise ClientException(data)


def zooz_tokenize(public_key, card_data, test=True):
    body = {
        "token_type": "credit_card",
        "holder_name": card_data["holder_name"],
        "expiration_date": card_data["expiry"],
        "card_number": card_data["card_number"],
        "credit_card_cvv": card_data["credit_card_cvv"],
    }
    headers = {
        "x-payments-os-env": "test" if test else "live",
        "public-key": public_key,
        "api-version": "1.3.0",
        "idempotency-key": str(uuid.uuid4()),
    }
    response = requests.post(
        "https://api.paymentsos.com/tokens", headers=headers, json=body
    )
    if response.status_code != 201:
        raise ClientException(response.json())
    data = response.json()
    return data["token"], data["encrypted_cvv"]


def confirm_payment_zooz(booking, payment, test=True):
    public_key = booking["payu_public_key"]
    payu_token = booking["payu_token"]
    payment_method_token, payment_cvv = zooz_tokenize(public_key, payment, test=test)
    headers = {"apikey": S.KIWI_API_KEY}
    body = {
        "paymentMethodToken": payment_method_token,
        "paymentToken": payu_token,
        "paymentCvv": payment_cvv,
        "bookingId": booking["booking_id"],
        "sandbox": test,
    }
    response = requests.post(
        CONFIRM_PAYMENT_ZOOZ_API_URL,
        json=body,
        headers={"content-type": "application/json", **headers},
    )
    if response.status_code != 200:
        raise ClientException(response.json())
    data = response.json()
    if data["status"] != 0:
        raise ClientException(data)
