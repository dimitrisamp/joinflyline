import json
from json import load

import requests
from django.contrib import messages
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from results.models import SearchDetails


@csrf_exempt
def results_view(request, null=None):
    if request.POST:
        search_query = {
            "limit": "10",
            "apikey": "xklKtpJ5fxZnk4rsDepqOzLUaYYAO9dI",
            "fly_from": request.POST['city_from'],
            "fly_to": request.POST['city_to'],
            "date_from": request.POST['dep_date'],
            "date_to": request.POST['dep_date'],
            "return_from": request.POST['ret_date'],
            "return_to": request.POST['ret_date'],
            "flight_type": request.POST['type'],
            "adults": request.POST['adults'],
            "children": request.POST['children'],
            "infants": request.POST['infants']
            # "max_stopovers": request.POST['max_stopovers'],
            # "stopover_from": request.POST['stopover_from'],
            # "stopover_to": request.POST['stopover_to'],
        }

        search_item = SearchDetails(user_id=request.user.id, fly_from=search_query.get("fly_from"),
                                    fly_to=search_query.get("fly_to"),
                                    date_from=search_query.get("date_from"), date_to=search_query.get("date_to"),
                                    return_from=search_query.get("return_from"),
                                    return_to=search_query.get("return_to"),
                                    flight_type=search_query.get("flight_type"), adults=search_query.get("adults"),
                                    children=search_query.get("children"), infants=search_query.get("infants"))

        # max_stopovers = search_query.get("max_stopovers"),
        # stopover_from = search_query.get("stopover_from"),
        # stopover_to = search_query.get("stopover_to")

        search_item.save()
        request.session["search_query"] = search_query
        url = "https://kiwicom-prod.apigee.net/v2/search"
        try:
            response = requests.get(url, params=search_query)

            data = response.json()
            airlines = set()

            if json.loads(response.text)['data']:
                for flights in json.loads(response.text)['data']:
                    for airline in flights['airlines']:
                        airlines.add(airline)
        except Exception as e:
            messages.error(request, "Cities not found " + str(e))
    else:
        data = null

    context = {
        "title": "Search Results",
        "data": data,
        "airlines": airlines
    }
    return render(request, "results.html", context)
