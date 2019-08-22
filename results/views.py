from django.shortcuts import render
import requests
import urllib
import json


def results_view(request, *args, **kwargs):
    # search_query = {
    #     "apikey": "xklKtpJ5fxZnk4rsDepqOzLUaYYAO9dI",
    #     "fly_from": 'BOS',
    #     "fly_to": 'AUS',
    #     "date_from": request.POST['dep_date'],
    #     "date_to": request.POST['dep_date'],
    #     "return_from": request.POST['ret_date'],
    #     "return_to": request.POST['ret_date'],
    #     "flight_type": request.POST['destinationType']
    # }
    #
    # # request.POST['placesTo']
    # # request.POST['placesFrom']
    # search_query = urllib.parse.urlencode(search_query)
    # url = "https://kiwicom-prod.apigee.net/v2/search?" + search_query
    # response = requests.get(url)
    #
    # data = json.loads(response.content)
    context = {
        "title": "Search Results",
        "data": "data"
    }
    return render(request, "results.html", context)
