import json
from json import load

import requests
from django.contrib import messages
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt


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
        }

        request.session["search_query"] = search_query
        # search_query = urllib.parse.urlencode(search_query)
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
