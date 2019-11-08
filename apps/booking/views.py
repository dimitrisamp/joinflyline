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

from apps.booking.models import BookingContact
from apps.emails.views import booking_success
from apps.results.models import BookingCache
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


class FlightsInvalidException(ClientException):
    pass


class FlightsNotCheckedYetException(ClientException):
    pass


def check_flights(booking_token, bnum, adults, children, infants):
    query = {
        "booking_token": booking_token,
        "v": 2,
        "bnum": bnum,
        "adults": adults,
        "children": children,
        "infants": infants,
        "pnum": adults + children + infants,
        "currency": "USD",
    }
    try:
        response = requests.get(
            CHECK_FLIGHTS_API_URL, query, headers={"apikey": S.KIWI_API_KEY}
        )
    except requests.RequestException as e:
        raise ClientException() from e
    if response.status_code != 200:
        raise ClientException()
    data = response.json()
    if data["flights_invalid"]:
        raise FlightsInvalidException()
    if not data["flights_checked"]:
        raise FlightsNotCheckedYetException()
    prices = data["conversion"]
    passenger_price = (
        prices["adults_price"] + prices["children_price"] + prices["infants_price"]
    )
    bags_fee = prices["amount"] - passenger_price
    return {"passengers": passenger_price, "bags": bags_fee, "total": prices["amount"]}


class CheckFlightsView(View):
    def get(self, request):
        keys = (
            ("booking_token", lambda x: x),
            ("bnum", int),
            ("adults", int),
            ("children", int),
            ("infants", int),
        )
        try:
            kwargs = {k: f(request.GET[k]) for k, f in keys}
        except KeyError:
            return JsonResponse({"code": "missing-arguments"})
        try:
            result = check_flights(**kwargs)
        except FlightsInvalidException:
            return JsonResponse({"code": "flights-invalid"}, status=404)
        except FlightsNotCheckedYetException:
            return JsonResponse({"code": "not-checked-yet"}, status=404)
        return JsonResponse(result)


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


def save_booking(request, retail_info, passengers, payment, zooz=True, test=False):
    flight_ids = [o["id"] for o in retail_info["route"]]
    total_bags = 0
    for p in passengers:
        p["category"] = get_category(p)
        bags = p.pop("bags")
        total_bags += bags
        p["hold_bags"] = make_hold_bags(flight_ids, bags)
        p["cardno"] = p.get("cardno", "00000000")
        p["expiration"] = p.get("expiration", "2025-01-01")
        p["email"] = S.RECEIVE_EMAIL
        p["phone"] = payment.get("phone", S.RECEIVE_PHONE)
    body = {
        "booking_token": retail_info['booking_token'],
        "currency": "USD",
        "lang": "en",
        "locale": "en",
        "bags": total_bags,
        "passengers": passengers,
    }
    if zooz:
        body["payment_gateway"] = "payu"
    headers = {"apikey": S.KIWI_API_KEY}
    try:
        response = requests.post(
            SAVE_BOOKING_API_URL,
            json=body,
            headers={"content-type": "application/json", **headers},
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


class SaveBookingView(View):
    def is_test_request(self, data):
        fp = data["passengers"][0]
        return (fp["name"].lower(), fp["surname"].lower()) == ("test", "test")

    def post(self, request):
        data = json.loads(request.body)
        try:
            save_booking(
                request,
                data["retail_info"],
                data["passengers"],
                data["payment"],
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
        "expiration_date": card_data["expiration_date"],
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


def get_retail_info(booking_token):
    return json.loads(BookingCache.objects.get(booking_token=booking_token).data)


def retail_booking_view(request):
    retail_info = json.loads(request.POST.get('retail_info'))
    one_way = not bool(o for o in retail_info["route"] if o["return"] == 1)
    for flight in retail_info["route"]:
        dep_time = parse_isodatetime(flight["local_departure"])
        arr_time = parse_isodatetime(flight["local_arrival"])
        flight["date"] = dep_time.strftime("%a %b %d")
        flight["arr_time"] = arr_time.strftime("%I:%M %p")
        flight["dep_time"] = dep_time.strftime("%I:%M %p")
        duration = int(
            (
                parse_isodatetime(flight["utc_arrival"])
                - parse_isodatetime(flight["utc_departure"])
            ).total_seconds()
        )
        hours = duration // 3600
        minutes = (duration // 60) % 60
        flight["duration"] = f"{hours}h {minutes:02d}m"
    if not one_way:
        last_flight_to_destination = list(
            takewhile(lambda o: o["return"] == 0, retail_info["route"])
        )[-1]
        last_flight_to_destination["nightsInDest"] = retail_info["nightsInDest"]

    context = {
        "retail_info": retail_info,
        "one_way": one_way,
        "total_credits": 1 if one_way else 2,
        "subscription_benefits": comparison(retail_info),
        "passenger_count": retail_info["parent"]["search_params"]["seats"][
            "passengers"
        ],
        "total_price": retail_info["conversion"]["USD"],
        "title": "Confirm Booking | FlyLine",
    }
    return render(request, "booking/retail.html", context)
