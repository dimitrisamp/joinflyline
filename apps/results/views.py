import datetime
import json
import math
from itertools import groupby

import requests
from django.contrib import messages
from django.http import JsonResponse, HttpResponseRedirect, Http404
from django.shortcuts import render
from django.conf import settings as S
from django.urls import reverse
from django.utils.dateparse import parse_datetime
from django.views import View
from django.views.generic import TemplateView

from apps.results.adjacency import (
    get_city_from,
    get_city_to,
    wrap_city_data,
    AIRPORT_TO_CITY,
    ADJACENCY,
    CITY_STATE_COUNTRY_AIRPORT)
from apps.results.models import SearchDetails, BookingCache
from wanderift.utils import pairwise

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


class CityAutocomplete(View):
    def get(self, request):
        term = request.GET.get("term")
        city_from = request.GET.get("city_from")
        if city_from is None:
            return JsonResponse({"locations": wrap_city_data(get_city_from(term))})
        else:
            if term == '__all__':
                return JsonResponse(
                    {"locations": wrap_city_data(get_city_to(city_from))}
                )
            else:
                return JsonResponse(
                    {"locations": wrap_city_data(get_city_to(city_from, term))}
                )


class ResultsView(TemplateView):
    template_name = "results/results.html"

    param_mapping = {
        "fly_from": "placeFrom",
        "fly_to": "placeTo",
        "date_from": "dep_date",
        "date_to": "dep_date",
        "flight_type": "type",
        "adults": "adults",
        "children": "children",
        "infants": "infants",
        "selected_cabins": "selected_cabins",
    }

    def get(self, request, *args, **kwargs):
        demo = request.GET.get('demo')
        self.demo = bool(demo) and demo.lower() in ('true', 1)
        return super().get(request, *args, **kwargs)

    def save_flight_data(self, flight, search_result):
        booking_token = flight["booking_token"]
        defaults = {"data": json.dumps(flight), "search_result": search_result}
        search = {"booking_token": booking_token}
        if self.request.user.is_authenticated:
            search["user"] = self.request.user
        BookingCache.objects.update_or_create(**search, defaults=defaults)

    def get_quick_filters_data(self, flights):
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

    def get_template_names(self):
        if self.request.is_ajax():
            return ["results/includes/results_center.html"]
        else:
            return ["results/results.html"]

    def validate(self, search_params):
        if self.request.user.is_subscriber() or self.demo:
            city_from = AIRPORT_TO_CITY.get(search_params["fly_from"])
            city_to = AIRPORT_TO_CITY.get(search_params["fly_to"])
            if city_to not in ADJACENCY.get(city_from, set()):
                raise Http404(f'The route {city_from} -> {city_to} is not available')

    def get_search_params(self):
        request = self.request
        search_params = {k: request.GET[v] for k, v in self.param_mapping.items()}
        if search_params["flight_type"] == "round":
            search_params["return_from"] = request.GET["ret_date"]
            search_params["return_to"] = request.GET["ret_date"]
        for k in DATE_FIELDS:
            if k in search_params:
                search_params[k] = md2dm(search_params[k])
        return search_params

    def get_sort_params(self):
        sort = self.request.GET.get("sort")
        if sort:
            return {"sort": sort}
        else:
            return {}

    def get_filter_params(self, search_params):
        GET = self.request.GET
        request = self.request
        filter_params = {k: GET.get(k) for k in FILTER_KEYS if k in GET}

        if request.user.is_subscriber or self.demo:
            selected_airlines = request.GET.get("select_airlines")
            if not selected_airlines:
                airlines = S.SUBSCRIBER_AIRLINES
            else:
                airlines = (
                    set(selected_airlines.upper().split(",")) & S.SUBSCRIBER_AIRLINES
                )
            filter_params["select_airlines"] = ",".join(airlines)
            filter_params["price_to"] = (
                S.PRICE_LIMIT_SUBSCRIBER
                if search_params["flight_type"] == "oneway"
                else S.PRICE_LIMIT_SUBSCRIBER * 2 + 150
            )
        return filter_params

    def process_response(self, data, search_item):
        airlines = set()
        search_part = data.copy()
        search_part.pop("data")
        for flights in data["data"]:
            flights["parent"] = search_part
            self.save_flight_data(flights, search_result=search_item)
            for airline in flights["airlines"]:
                airlines.add(airline)
            flights["roundtrip"] = any(
                route["return"] == 1 for route in flights["route"]
            )
            for key, routes in groupby(flights["route"], lambda r: r["return"]):
                routes = list(routes)
                if key == 1:
                    flights["return_departure"] = routes[0]["local_departure"]
                for pr, nr in pairwise(routes):
                    pr["layover"] = math.floor(
                        (
                            parse_datetime(nr["utc_departure"])
                            - parse_datetime(pr["utc_arrival"])
                        ).total_seconds()
                    )
        quick_filters_data = self.get_quick_filters_data(data["data"])
        return airlines, quick_filters_data

    def query_endpoint(self, search_params, filter_params, sort_params, limit):
        search_query = {"limit": limit, "apikey": S.KIWI_API_KEY, "curr": "USD"}
        search_item = SearchDetails.objects.create(
            user=self.request.user if self.request.user.is_authenticated else None,
            **search_params
        )
        try:
            response = requests.get(
                API_URL,
                params={
                    **search_query,
                    **search_params,
                    **filter_params,
                    **sort_params,
                },
            )
        except requests.RequestException as e:
            messages.error(self.request, "Error getting flights: {}".format(e))
            raise Http404() from e

        if response.status_code != 200:
            raise Http404("Bad endpoint response")
        data = response.json()
        airlines, quick_filters_data = self.process_response(data, search_item)
        return {
            "data": data,
            "airlines": airlines,
            "quick_filters_data": quick_filters_data,
        }

    def get_context_data(self, **kwargs):
        search_params = self.get_search_params()
        vresp = self.validate(search_params)
        if vresp:
            return vresp
        sort_params = self.get_sort_params()
        filter_params = self.get_filter_params(search_params)
        limit = int(self.request.GET.get("limit", 20))
        context_data = {
            "title": "Search Results",
            "next_limit": limit + LIMIT_INCREMENT,
            "filter_params": filter_params,
            "search_params": search_params,
            "sort": sort_params,
            "demo": self.demo,
            "city_airports": [o for o in CITY_STATE_COUNTRY_AIRPORT if
                              o[0] in ADJACENCY]
        }
        if self.request.is_ajax():
            data = self.query_endpoint(search_params, filter_params, sort_params, limit)
            context_data.update(data)
        return context_data
