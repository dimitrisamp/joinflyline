import json
from _decimal import Decimal
from datetime import datetime, timezone, timedelta
from itertools import takewhile

import requests
from django.contrib.auth.models import User
from django.shortcuts import render

from account.models import Account
from results.models import BookingCache
from results.templatetags.comparison import comparison

CHECK_FLIGHTS_API_URL = "https://kiwicom-prod.apigee.net/v2/booking/check_flights"

apiKey = "xklKtpJ5fxZnk4rsDepqOzLUaYYAO9dI"


def parse_isodatetime(dt):
    return datetime.strptime(dt, "%Y-%m-%dT%H:%M:%S.%fZ")


def retail_booking_view(request, booking_token):
    retail_info = json.loads(BookingCache.objects.get(booking_token=booking_token).data)
    # total_usd = Decimal(retail_info["conversion"]["amount"])
    # total_eur = Decimal(retail_info["total"])
    # eur2usd = total_usd / total_eur
    one_way = not bool(o for o in retail_info["route"] if o["return"] == 1)
    for flight in retail_info["route"]:
        flight["price"] = 400  # Decimal(flight["price"]) * eur2usd
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
        "passenger_count": retail_info['parent']['search_params']['seats']['passengers'],
        "total_price": retail_info['conversion']['USD']
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
    params = {"apikey": apiKey, "visitor_uniqid": user.id}
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
