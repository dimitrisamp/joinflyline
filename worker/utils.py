import dataclasses
from typing import List

from django.db import transaction
from django.utils.timezone import now

from apps.account.models import DealWatchGroup
from apps.booking.models import Deal
from worker.types import Trip


def save2db(flights: List[Trip], dw: DealWatchGroup):
    if not flights:
        return
    ff = flights[0]
    result = []
    with transaction.atomic():
        Deal.objects.filter(group=dw).delete()
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
            d["group"] = dw
            result.append(Deal.objects.create(**d))
            dw.last_updated = now()
            dw.save()
    return result
