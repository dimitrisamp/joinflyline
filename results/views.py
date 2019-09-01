from datetime import datetime

import requests
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from wanderift import settings


@csrf_exempt
def results_view(request, null=None, *args, **kwargs):
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

        # search_query = urllib.parse.urlencode(search_query)
        url = "https://kiwicom-prod.apigee.net/v2/search"
        response = requests.get(url, params=search_query)

        data = response.json()
    else:
        data = null

    context = {
        "title": "Search Results",
        "data": data
    }
    return render(request, "results.html", context)
