import json
import uuid
from datetime import datetime, date
from itertools import takewhile

import requests
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View
from django.conf import settings as S
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework_proxy.views import ProxyView

from apps.booking.models import BookingContact
from apps.emails.views import booking_success
from apps.results.templatetags.comparison import comparison

from wanderift.utils import parse_isodatetime

CHECK_FLIGHTS_API_URL = "https://kiwicom-prod.apigee.net/v2/booking/check_flights"
SAVE_BOOKING_API_URL = "https://kiwicom-prod.apigee.net/v2/booking/save_booking"
CONFIRM_PAYMENT_API_URL = "https://kiwicom-prod.apigee.net/v2/booking/confirm_payment"
CONFIRM_PAYMENT_ZOOZ_API_URL = (
    "https://kiwicom-prod.apigee.net/v2/booking/confirm_payment_zooz"
)


class ClientException(Exception):
    pass


class StatusErrorException(ClientException):
    pass


class FlightsInvalidException(ClientException):
    pass


class FlightsNotCheckedYetException(ClientException):
    pass


class CheckFlightsView(ProxyView):
    source = 'v2/booking/check_flights'


class LocationQueryView(ProxyView):
    permission_classes = [AllowAny]
    source = 'locations/query'


class FlightSearchView(ProxyView):
    permission_classes = [AllowAny]
    source = 'v2/search'


def get_category(passenger):
    born = datetime.strptime(passenger["birthday"], "%Y-%m-%d")
    today = date.today()
    age = today.year - born.year - ((today.month, today.day) < (born.month, born.day))
    if age < 3:
        return "infants"
    elif age < 13:
        return "children"
    else:
        return "adults"


def make_hold_bags(flight_ids, bags):
    result = {}
    for flight_id in flight_ids:
        flight_bags = {}
        for i in range(1, 4):
            flight_bags[str(i)] = 0 if bags < i else 1
        result[flight_id] = flight_bags
    return result


def save_booking(request, data, zooz=True, test=False):
    body = data.copy()
    payment = body.pop('payment')
    promo = payment.pop('promocode')
    retail_info = body.pop('retail_info')
    p = body['passengers'][0]
    p["email"] = S.RECEIVE_EMAIL
    p["phone"] = payment.get("phone", S.RECEIVE_PHONE)
    headers = {"content-type": "application/json", "apikey": S.KIWI_API_KEY}
    try:
        response = requests.post(
            SAVE_BOOKING_API_URL,
            json=body,
            headers=headers,
        )
    except requests.RequestException as e:
        raise ClientException({"code": "requests-exception"}) from e
    if response.status_code != 200:
        raise ClientException(response.json())
    booking = response.json()
    if zooz:
        confirm_payment_zooz(booking, payment, test=test)
    else:
        confirm_payment(booking)
    if request.user.is_authenticated:
        user = request.user
    else:
        try:
            user = User.objects.get(username=payment["email"])
        except User.DoesNotExist:
            user = User.objects.create(
                username=payment["email"], email=payment["email"]
            )
            # TODO: send activation link to email implement in `oauth` module
    BookingContact.from_data(
        booking_data=booking,
        email=payment["email"],
        phone=payment["phone"],
        user=user,
        retail_info=retail_info,
    )
    booking_success(requests, booking)


class CheckPromoView(View):
    def get(self, request):
        promocode = request.GET.get("promocode")
        if promocode.lower() == "abcdef":  # TODO: make promocode available in database
            return JsonResponse({"discount": 10})
        else:
            return JsonResponse({"discount": 0})


class SaveBookingView(APIView):
    def is_test_request(self, data):
        fp = data["passengers"][0]
        return (fp["name"].lower(), fp["surname"].lower()) == ("test", "test")

    def post(self, request):
        data = request.data
        try:
            save_booking(
                request,
                data,
                zooz=True,
                test=self.is_test_request(data),
            )
        except ClientException as e:
            return JsonResponse(e.args, status=400)
        else:
            return JsonResponse({})


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
