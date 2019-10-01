import json
import uuid
from datetime import datetime, date
from itertools import takewhile

import requests
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import render
from django.views import View

from account.models import Account
from results.models import BookingCache
from results.templatetags.comparison import comparison

CHECK_FLIGHTS_API_URL = "https://kiwicom-prod.apigee.net/v2/booking/check_flights"
SAVE_BOOKING_API_URL = "https://kiwicom-prod.apigee.net/v2/booking/save_booking"
CONFIRM_PAYMENT_API_URL = "https://kiwicom-prod.apigee.net/v2/booking/confirm_payment"
CONFIRM_PAYMENT_ZOOZ_API_URL = (
    "https://kiwicom-prod.apigee.net/v2/booking/confirm_payment_zooz"
)

API_KEY = "xklKtpJ5fxZnk4rsDepqOzLUaYYAO9dI"


def parse_isodatetime(dt):
    return datetime.strptime(dt, "%Y-%m-%dT%H:%M:%S.%fZ")


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
        "apikey": API_KEY,
        "bnum": bnum,
        "adults": adults,
        "children": children,
        "infants": infants,
        "pnum": adults + children + infants,
        "currency": "USD",
    }
    try:
        response = requests.get(CHECK_FLIGHTS_API_URL, query)
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
        keys = ("booking_token", "bnum", "adults", "children", "infants")
        try:
            kwargs = {k: request.GET[k] for k in keys}
        except KeyError:
            return JsonResponse({"code": "missing-arguments"})
        try:
            result = check_flights(**kwargs)
        except FlightsInvalidException:
            return JsonResponse({"code": "flights-invalid"}, status_code=404)
        except FlightsNotCheckedYetException:
            return JsonResponse({"code": "not-checked-yet"}, status_code=404)
        return JsonResponse(result)


def get_category(passenger):
    born = datetime.strptime(passenger["birthdate"], "%Y-%m-%d")
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


def save_booking(booking_token, passengers, zooz=True):
    retail_info = get_retail_info(booking_token)
    flight_ids = [o["id"] for o in retail_info["route"]]
    for p in passengers:
        p["category"] = get_category(p)
        bags = p.pop("bags")
        p["hold_bags"] = make_hold_bags(flight_ids, bags)
    body = {
        "booking_token": booking_token,
        "currency": "USD",
        "lang": "en",
        "locale": "en",
        "passengers": passengers,
    }
    if zooz:
        body["payment_gateway"] = "payu"
    params = {"apikey": API_KEY}
    try:
        response = requests.post(
            SAVE_BOOKING_API_URL,
            params=params,
            json=body,
            headers={"content-type": "application/json"},
        )
    except requests.RequestException as e:
        raise ClientException() from e
    if response.status_code != 200:
        raise ClientException(response.json())
    return response.json()


def confirm_payment(booking):
    body = {
        "booking_id": booking["booking_id"],
        "transaction_id": booking["transaction_id"],
    }
    params = {"apikey": API_KEY}
    try:
        response = requests.post(
            CONFIRM_PAYMENT_API_URL,
            params=params,
            json=body,
            headers={"content-type": "application/json"},
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
    }
    headers = {
        "x-payments-os-env": "test" if test else "live",
        "public-key": public_key,
        "idempotency-key": str(uuid.uuid4()),
    }
    response = requests.post(
        "https://api.paymentsos.com/tokens", headers=headers, json=body
    )
    if response.status_code != 201:
        raise ClientException()
    payment_method_token = response.json()['token']
    body = {
        "token_type": "credit_card_cvv",
        "credit_card_cvv": card_data["credit_card_cvv"],
        "payment_method_token": payment_method_token
    }
    headers = {
        "x-payments-os-env": "test" if test else "live",
        "public-key": public_key,
        "idempotency-key": str(uuid.uuid4()),
    }
    response = requests.post(
        "https://api.paymentsos.com/tokens", headers=headers, json=body
    )
    if response.status_code != 201:
        raise ClientException()
    payment_cvv = response.json()['token']
    return payment_method_token, payment_cvv



def confirm_payment_zooz(booking):
    public_key = booking['payu_public_key']
    payment_method_token, payment_cvv = zooz_tokenize(public_key, booking['data'])
    params = {"apikey": API_KEY}
    response = requests.post(
        CONFIRM_PAYMENT_ZOOZ_API_URL, params=params
    )


def get_retail_info(booking_token):
    return json.loads(BookingCache.objects.get(booking_token=booking_token).data)


def retail_booking_view(request, booking_token):
    retail_info = get_retail_info(booking_token)
    one_way = not bool(o for o in retail_info["route"] if o["return"] == 1)
    for flight in retail_info["route"]:
        dep_time = parse_isodatetime(flight["local_departure"])
        arr_time = parse_isodatetime(flight["local_arrival"])
        flight["date"] = dep_time.strftime("%a %b %d")
        flight["arr_time"] = arr_time.strftime("%H:%M")
        flight["dep_time"] = dep_time.strftime("%H:%M")
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
        flight = list(takewhile(lambda o: o["return"] == 0, retail_info["route"]))[-1]
        flight["nightsInDest"] = retail_info["nightsInDest"]

    context = {
        "retail_info": retail_info,
        "one_way": one_way,
        "subscription_benefits": comparison(retail_info),
        "passenger_count": retail_info["parent"]["search_params"]["seats"][
            "passengers"
        ],
        "total_price": retail_info["conversion"]["USD"],
    }
    return render(request, "booking/retail.html", context)


def traveller_booking_view(request):
    if request.method == "POST":
        username = request.POST["email"]
        email = username
        password = ""
        first_name = request.POST["first_name"]
        last_name = request.POST["last_name"]
        gender = request.POST["gender"]
        dob = request.POST["dob"]
        phone_number = request.POST["phone_number"]
        card_number = request.POST["card_number"]
        expiry = request.POST["expiry"]
        cvc = request.POST["cvc"]
        country = request.POST["country"]
        zip = request.POST["zip"]

        user = User.objects.create_user(
            username, email, password, first_name=first_name, last_name=last_name
        )
        user.save()
        user = User.objects.get(pk=user.id)
        user.profile.dob = dob
        user.profile.gender = gender
        user.profile.phone_number = phone_number
        user.profile.save()
        account = Account.objects.create(
            card_number=card_number,
            expiry=expiry,
            cvc=cvc,
            country=country,
            zip=zip,
            user=user,
        )
        account.save()

        save_booking(request, user)
        context = {"users": user}
        return render(request, "booking/retail.html", context)
    else:
        context = {}
        return render(request, "booking/retail.html", context)


def save_booking(request, user):
    print(user)
    account = user.account_set.all()
    params = {"apikey": API_KEY, "visitor_uniqid": user.id}
    booking = {
        "bags": 0,
        "booking_token": request.session.get("booking_token"),
        "currency": "usd",
        "lang": "en",
        "locale": "en",
        "passengers": [
            {
                "birthday": user.profile.dob,
                "cardno": account[0].card_number,
                "category": "adults",
                "email": user.email,
                "expiration": account[0].cvc,
                "name": user.first_name,
                "nationality": "SE",
                "phone": user.profile.phone_number,
                "surname": user.last_name,
                "title": "ms",
            }
        ],
    }

    headers = {"content-type": "application/json"}
    url = "https://kiwicom-prod.apigee.net/v2/booking/save_booking"
    response = requests.post(url, params=params, json=booking, headers=headers)
    return response.json()
