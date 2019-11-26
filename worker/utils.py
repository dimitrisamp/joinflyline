import dataclasses
from typing import List

from django.db import transaction

from apps.booking.models import Deal
from worker.types import Trip


def save2db(flights: List[Trip]):
    if not flights:
        return
    ff = flights[0]
    with transaction.atomic():
        Deal.objects.filter(city_from=ff.city_from, city_to=ff.city_to).delete()
        for trip in flights:
            d = dataclasses.asdict(trip)
            del d["booking_token"]
            del d["status"]
            local_departure = d.pop("local_departure")
            local_return_departure = d.pop("local_return_departure")
            d["departure_date"] = local_departure.date()
            d["departure_time"] = local_departure.time()
            d["return_date"] = local_return_departure.date()
            d["return_time"] = local_return_departure.time()
            Deal.objects.create(**d)
