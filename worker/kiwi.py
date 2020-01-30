import asyncio
import datetime
import itertools
import logging
from typing import List

from django.conf import settings
from django.utils.dateparse import parse_datetime

from worker.constants import (
    MIN_NIGHTS_IN_DEST,
    MAX_NIGHTS_IN_DEST,
    SEARCH_MAX_TRIES,
    SEARCH_API_URL,
    SEARCH_DELAY,
    CHECK_FLIGHT_TRY_COUNT,
    MAX_CHECK_FLIGHT_DELAY,
    DEALS_DAYS,
    CHECK_FLIGHTS_API_URL
)
from worker.types import Trip, FlightStatus


async def get_trips(
    session,
    fly_from,
    fly_to,
    date_from: datetime.date,
    date_to: datetime.date,
    asc: bool = True,
    limit: int = 10,
    sort: str = "price",
    max_price: int = None,
    airlines: list = None,
) -> List[Trip]:
    headers = {"apikey": settings.KIWI_API_KEY}
    date_from_str = date_from.strftime("%d/%m/%Y")
    date_to_str = date_to.strftime("%d/%m/%Y")
    params = {
        "fly_from": fly_from,
        "fly_to": fly_to,
        "curr": "USD",
        "flight_type": "round",
        "date_from": date_from_str,
        "date_to": date_to_str,
        "return_from": date_from_str,
        "return_to": date_to_str,
        "nights_in_dst_from": MIN_NIGHTS_IN_DEST,
        "nights_in_dst_to": MAX_NIGHTS_IN_DEST,
        "limit": limit,
        "asc": int(asc),
        "sort": sort,
    }
    if airlines:
        params['selected_airlines'] = airlines
    try_count = 0
    while try_count < SEARCH_MAX_TRIES:
        response = await session.get(SEARCH_API_URL, params=params, headers=headers)
        try_count += 1
        if response.status != 200:
            logging.error(f"Error getting trips {fly_from} -> {fly_to}. Retrying...")
            await asyncio.sleep(SEARCH_DELAY)
        else:
            break
    else:
        logging.error(f"Error getting trips {fly_from}->{fly_to}.")
        return []

    data = await response.json()
    trips = []
    for trip in data["data"]:
        try:
            departure_routes = [r for r in trip["route"] if r["return"] == 0]
            return_routes = [r for r in trip["route"] if r["return"] == 1]
            t = Trip(
                city_from=fly_from,
                city_to=fly_to,
                city_from_name=departure_routes[0]["cityFrom"],
                city_to_name=departure_routes[-1]["cityTo"],
                price=trip["conversion"]["USD"],
                trip_id=trip["id"],
                dt_departure=parse_datetime(departure_routes[0]["utc_departure"]),
                local_departure=parse_datetime(departure_routes[0]["local_departure"]),
                dt_return=parse_datetime(return_routes[0]["utc_departure"]),
                local_return_departure=parse_datetime(
                    return_routes[0]["local_departure"]
                ),
                fly_from=departure_routes[0]["flyFrom"],
                fly_to=departure_routes[-1]["flyTo"],
                airlines=trip["airlines"],
                booking_token=trip["booking_token"],
            )
        except (KeyError, ValueError):
            logging.exception(f"Error processing trip {trip}")
        else:
            trips.append(t)
    return trips


async def check_and_update_trip_price(trip: Trip, session):
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
        response = await session.get(
            CHECK_FLIGHTS_API_URL,
            params=query,
            headers={"apikey": settings.KIWI_API_KEY},
        )
        try_count += 1
        if response.status == 200:
            data = await response.json()
            try:
                if data["flights_invalid"]:
                    trip.status = FlightStatus.invalid
                    break
                if data["flights_checked"]:
                    trip.status = FlightStatus.checked
                    trip.price = data["conversion"]["amount"]
                    logging.info(
                        f"Updated {trip.city_from}->{trip.city_to} "
                        f"{trip.local_departure.isoformat()} - {trip.local_return_departure.isoformat()} "
                        f"price in {try_count} requests"
                    )
                    break
            except (KeyError, ValueError):
                logging.exception(f"Error processing data {data}")
        await asyncio.sleep(check_flight_delay)
        check_flight_delay = min(check_flight_delay * 2, MAX_CHECK_FLIGHT_DELAY)
    else:
        trip.status = FlightStatus.timeout


async def check_flights(city_from, city_to, session, dw, **kwargs):
    trips = await get_trips(
        session,
        city_from,
        city_to,
        datetime.date.today(),
        datetime.date.today() + datetime.timedelta(days=DEALS_DAYS),
        **kwargs
    )
    # tasks = []
    # for t in trips:
    #     tasks.append(check_and_update_trip_price(t, session))
    # await asyncio.gather(*tasks)
    return trips, dw


async def fetch_all_city_interconnections(session, codes):
    tasks = []
    for a, b in itertools.combinations(codes, 2):
        tasks.append(check_flights(f'city:{a}', f'city:{b}', session))
        tasks.append(check_flights(f'city:{b}', f'city:{a}', session))
    for f in asyncio.as_completed(tasks):
        yield [o for o in await f if o.status == FlightStatus.checked]
