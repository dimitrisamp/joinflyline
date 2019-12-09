import asyncio
import itertools
from collections import defaultdict
from typing import DefaultDict, List

import aiohttp
import logging
import os

import django

from wanderift.utils import l2q
from wanderift.utils.ratelimiter import RateLimiter
from worker.kiwi import fetch_all_city_interconnections, check_flights

os.environ['DJANGO_SETTINGS_MODULE'] = 'wanderift.settings'
django.setup()
from apps.account.models import DealWatch, DealWatchGroup, Profile
from worker.utils import save2db

from django.conf import settings


async def fetch_all_cities(session):
    async for r in fetch_all_city_interconnections(session, settings.DEALS_CITIES):
        save2db(r)


def d2q(d):
    return '{}:{}'.format()

async def fetch_watches(session):
    routes: DefaultDict[(str, str), List[DealWatch]] = defaultdict(list)
    for dw in DealWatch.objects.all().select_related('user__profile'):
        routes[l2q(dw.user.profile.market), l2q(dw.destination)].append(dw)
    tasks = []
    for a, b in routes.keys():
        tasks.append(check_flights(a, b, session))
    results = await asyncio.gather(*tasks)
    for trips in results:
        deals = save2db(trips)
        for deal in deals:
            for dw in routes[deal.city_from, deal.city_to]:
                if dw.max_price is None or dw.max_price > deal.price:
                    dw.deals.add(deal)


async def main():
    async with aiohttp.ClientSession() as session:
        session = RateLimiter(session, 300, 300)
        #await fetch_all_cities(session)
        await fetch_watches(session)



if __name__ == '__main__':
    logging.basicConfig(level='DEBUG')
    asyncio.run(main())
