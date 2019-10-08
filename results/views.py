import datetime
import json

import requests
from django.contrib import messages
from django.shortcuts import render
from django.conf import settings as S

from results.models import SearchDetails, BookingCache

API_URL = "https://kiwicom-prod.apigee.net/v2/search"

FILTER_KEYS = (
    "select_airlines",
    "price_from",
    "price_to",
    "dtime_from",
    "dtime_to",
    "atime_from",
    "atime_to",
    "ret_dtime_from",
    "ret_dtime_to",
    "ret_atime_from",
    "ret_atime_to",
    "max_stopovers",
)

LIMIT_INCREMENT = 10

DATE_FIELDS = ("return_from", "return_to", "date_from", "date_to")


def md2dm(s):
    try:
        return datetime.datetime.strptime(s, "%m/%d/%Y").strftime("%d/%m/%Y")
    except ValueError:
        return s


def save_flight_data(request, flight, search_result):
    booking_token = flight["booking_token"]
    defaults = {"data": json.dumps(flight), "search_result": search_result}
    search = {"booking_token": booking_token}
    if request.user.is_authenticated:
        search["user"] = request.user
    BookingCache.objects.update_or_create(**search, defaults=defaults)


def results_view(request):
    search_params = {
        "fly_from": request.GET["city_from"],
        "fly_to": request.GET["city_to"],
        "date_from": request.GET["dep_date"],
        "date_to": request.GET["dep_date"],
        "return_from": request.GET["ret_date"],
        "return_to": request.GET["ret_date"],
        "flight_type": request.GET["type"],
        "adults": request.GET["adults"],
        "children": request.GET["children"],
        "infants": request.GET["infants"],
    }
    for k in DATE_FIELDS:
        search_params[k] = md2dm(search_params[k])

    limit = int(request.GET.get("limit", 20))
    search_query = {"limit": limit, "apikey": S.KIWI_API_KEY, "curr": "USD"}
    request.session["search_query"] = search_params

    filter_params = {k: request.GET.get(k) for k in FILTER_KEYS if k in request.GET}
    search_item = SearchDetails.objects.create(user_id=request.user.id, **search_params)
    data = {}
    airlines = set()
    try:
        response = requests.get(
            API_URL, params={**search_query, **search_params, **filter_params}
        )
    except requests.RequestException as e:
        messages.error(request, "Error getting flights: {}".format(e))
    else:
        if response.status_code == 200:
            data = response.json()
            if data:
                search_part = data.copy()
                search_part.pop("data")
                for flights in data["data"]:
                    flights["parent"] = search_part
                    save_flight_data(request, flights, search_result=search_item)
                    for airline in flights["airlines"]:
                        airlines.add(airline)
    context = {
        "title": "Search Results",
        "data": data,
        "airlines": airlines,
        "next_limit": limit + LIMIT_INCREMENT,
        "filter_params": filter_params,
        "search_params": search_params,
    }
    if request.is_ajax():
        return render(request, "results_center.html", context)
    else:
        return render(request, "results.html", context)
