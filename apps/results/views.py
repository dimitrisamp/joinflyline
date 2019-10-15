import datetime
import json

import requests
from django.contrib import messages
from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import render
from django.conf import settings as S
from django.urls import reverse
from django.utils.dateparse import parse_datetime
from django.views import View

from apps.results.adjacency import get_city_from, get_city_to, wrap_city_data, \
    AIRPORT_TO_CITY, ADJACENCY
from apps.results.models import SearchDetails, BookingCache


API_URL = "https://kiwicom-prod.apigee.net/v2/search"

LOCATION_API_URL = "https://kiwicom-prod.apigee.net/locations/query"

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


def get_quick_filters_data(flights):
    data = [
        {
            "price": f["conversion"]["USD"],
            "duration": f["duration"]["total"],
            "quality": f["quality"],
            "date": parse_datetime(f["local_departure"]),
        }
        for f in flights
    ]
    if data:
        return {
            "price": min(data, key=lambda x: x["price"]),
            "duration": min(data, key=lambda x: x["duration"]),
            "quality": min(data, key=lambda x: x["quality"]),
            "date": min(data, key=lambda x: x["date"]),
        }


class CityAutocomplete(View):
    def get(self, request):
        term = request.GET.get("term")
        if term is None:
            return JsonResponse({"message": "`term` is not specified"}, status=400)
        city_from = request.GET.get("city_from")
        if city_from is None:
            return JsonResponse({"locations": wrap_city_data(get_city_from(term))})
        else:
            return JsonResponse(
                {"locations": wrap_city_data(get_city_to(city_from, term))}
            )


def results_view(request):
    search_params = {
        "fly_from": request.GET["placeFrom"],
        "fly_to": request.GET["placeTo"],
        "date_from": request.GET["dep_date"],
        "date_to": request.GET["dep_date"],
        "return_from": request.GET["ret_date"],
        "return_to": request.GET["ret_date"],
        "flight_type": request.GET["type"],
        "adults": request.GET["adults"],
        "children": request.GET["children"],
        "infants": request.GET["infants"],
        "selected_cabins": request.GET["selected_cabins"],
    }
    if hasattr(request.user, "subscriptions"):
        cityFrom = AIRPORT_TO_CITY.get(search_params['fly_from'])
        cityTo = AIRPORT_TO_CITY.get(search_params['fly_to'])
        if cityTo not in ADJACENCY.get(cityFrom, set()):
            return HttpResponseRedirect(reverse('home'))

    sort = request.GET.get("sort")
    if sort:
        sort_params = {"sort": sort}
    else:
        sort_params = {}
    for k in DATE_FIELDS:
        search_params[k] = md2dm(search_params[k])

    limit = int(request.GET.get("limit", 20))
    search_query = {"limit": limit, "apikey": S.KIWI_API_KEY, "curr": "USD"}
    filter_params = {k: request.GET.get(k) for k in FILTER_KEYS if k in request.GET}
    if request.user.is_authenticated:
        selected_airlines = request.GET.get("select_airlines")
        if not selected_airlines:
            airlines = S.SUBSCRIBER_AIRLINES
        else:
            airlines = set(selected_airlines.upper().split(",")) & S.SUBSCRIBER_AIRLINES
        filter_params["select_airlines"] = ",".join(airlines)
        filter_params["price_to"] = (
            S.PRICE_LIMIT_SUBSCRIBER
            if search_params["flight_type"] == "oneway"
            else S.PRICE_LIMIT_SUBSCRIBER * 2
        )
    search_item = SearchDetails.objects.create(user_id=request.user.id, **search_params)
    data = {}
    airlines = set()
    quick_filters_data = {}
    try:
        response = requests.get(
            API_URL,
            params={**search_query, **search_params, **filter_params, **sort_params},
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
                    flights["roundtrip"] = any(
                        route["return"] == 1 for route in flights["route"]
                    )
                quick_filters_data = get_quick_filters_data(data["data"])
    context = {
        "title": "Search Results",
        "data": data,
        "airlines": airlines,
        "next_limit": limit + LIMIT_INCREMENT,
        "filter_params": filter_params,
        "search_params": search_params,
        "sort": sort,
        "quick_filters_data": quick_filters_data,
    }
    if request.is_ajax():
        return render(request, "results/includes/results_center.html", context)
    else:
        return render(request, "results/results.html", context)
