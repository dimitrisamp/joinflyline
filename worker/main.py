import asyncio
import enum
import itertools
import logging
import datetime
from typing import List, AsyncIterator, NamedTuple
from django.utils.dateparse import parse_datetime

import aiohttp
import os
import django
import dataclasses
import statistics

from matplotlib import pyplot

DEALS_DAYS = 30

CHECK_FLIGHT_TRY_COUNT = 20
MAX_CHECK_FLIGHT_DELAY = 8
DEAL_PRICE_RATIO = 0.6

os.environ["DJANGO_SETTINGS_MODULE"] = "wanderift.settings"
django.setup()

from django.conf import settings
from apps.results.views import SEARCH_API_URL
from apps.booking.views import CHECK_FLIGHTS_API_URL


class FlightStatus(enum.IntEnum):
    not_checked = 0
    invalid = -1
    timeout = -2
    checked = 1


@dataclasses.dataclass
class Trip:
    city_from: str
    city_to: str
    price: float
    ids: List[str]
    departure: datetime.datetime
    return_departure: datetime.datetime
    booking_token: str
    median_price: float = 0


async def get_trips(
    session,
    city_from,
    city_to,
    date_from: datetime.date,
    date_to: datetime.date,
    asc: bool = True,
    limit: int = 1000,
    sort: str = "price",
) -> List[Trip]:
    headers = {"apikey": settings.KIWI_API_KEY}
    date_from_str = date_from.strftime("%d/%m/%Y")
    date_to_str = date_to.strftime("%d/%m/%Y")
    params = {
        "fly_from": city_from,
        "fly_to": city_to,
        "curr": "USD",
        "flight_type": "round",
        "date_from": date_from_str,
        "date_to": date_to_str,
        "return_from": date_from_str,
        "return_to": date_to_str,
        "limit": limit,
        "asc": int(asc),
        "sort": sort,
    }
    response = await session.get(SEARCH_API_URL, params=params, headers=headers)
    data = await response.json()
    trips = [
        Trip(
            city_from=city_from,
            city_to=city_to,
            price=trip["conversion"]["USD"],
            ids=trip["id"].split("|"),
            departure=parse_datetime(trip["route"][0]["utc_departure"]),
            return_departure=parse_datetime(
                [r for r in trip["route"] if r["return"] == 1][0]["utc_departure"]
            ),
            booking_token=trip["booking_token"],
        )
        for trip in data["data"]
    ]
    prices = [t.price for t in trips]
    median_price = statistics.median(prices)
    pyplot.hist(prices)
    pyplot.show()
    result_trips = [t for t in trips if t.price < median_price * DEAL_PRICE_RATIO]
    logging.info(f'{len(result_trips)} of {len(trips)} are below {median_price * DEAL_PRICE_RATIO} for median price of {median_price}')
    if result_trips:
        logging.info(f'Unchecked cheapest price is {result_trips[0]}')
    for t in result_trips:
        t.median_price = median_price
    return result_trips


async def check_and_update_trip_price(trip: Trip):
    query = {
        "booking_token": trip.booking_token,
        "v": 2,
        "bnum": 0,
        "adults": 1,
        "children": 0,
        "infants": 0,
        "pnum": 1,
        "currency": "USD",
    }
    try_count = 0
    check_flight_delay = 1
    while try_count < CHECK_FLIGHT_TRY_COUNT:
        async with aiohttp.ClientSession() as session:
            response = await session.get(
                CHECK_FLIGHTS_API_URL,
                params=query,
                headers={"apikey": settings.KIWI_API_KEY},
            )
            try_count += 1
            data = await response.json()
            if data["flights_checked"]:
                trip.status = FlightStatus.checked
                trip.price = data["conversion"]["amount"]
                logging.info(
                    f"Updated {trip.city_from}->{trip.city_to} "
                    f"{trip.departure.isoformat()} - {trip.return_departure.isoformat()} "
                    f"price in {try_count} requests"
                )
                break
            if data["flights_invalid"]:
                trip.status = FlightStatus.invalid
                break
            await asyncio.sleep(check_flight_delay)
            check_flight_delay = max(check_flight_delay * 2, MAX_CHECK_FLIGHT_DELAY)
    else:
        trip.status = FlightStatus.timeout


async def check_flights(city_from, city_to):
    async with aiohttp.ClientSession() as session:
        trips = await get_trips(
            session,
            city_from,
            city_to,
            datetime.date.today(),
            datetime.date.today() + datetime.timedelta(days=DEALS_DAYS),
        )
    tasks = []
    for t in trips:
        tasks.append(check_and_update_trip_price(t))
    await asyncio.gather(*tasks)
    return trips


async def main():
    await check_flights("DFW", "LAS")
    # for city_from, city_to in itertools.combinations(cities, 2):
    #     tasks = [
    #         asyncio.create_task(check_flights(city_from, city_to)),
    #         asyncio.create_task(check_flights(city_to, city_from)),
    #     ]


if __name__ == "__main__":
    logging.basicConfig(level="INFO", format="%(asctime)s %(levelname)-8s %(message)s")
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
