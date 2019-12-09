import asyncio
import itertools
from collections import defaultdict
from datetime import timedelta
from typing import DefaultDict, List

import aiohttp
import logging
import os

import django
from django.db.models import Q
from django.utils.timezone import now

from wanderift.utils import l2q
from wanderift.utils.ratelimiter import RateLimiter
from worker.kiwi import fetch_all_city_interconnections, check_flights

os.environ['DJANGO_SETTINGS_MODULE'] = 'wanderift.settings'
django.setup()
from apps.account.models import DealWatch, DealWatchGroup
from worker.utils import save2db

from django.conf import settings


async def fetch_all_cities(session):
    async for r in fetch_all_city_interconnections(session, settings.DEALS_CITIES):
        save2db(r)


def d2q(d):
    return '{}:{}'.format()

def outdated_dwgs():
    return DealWatchGroup.objects.filter(Q(last_updated__isnull=True) | Q(last_updated__lt=now() - timedelta(days=1)))

async def fetch_watches(session):
    tasks = []
    dwl = list(outdated_dwgs())
    for dw in dwl:
        tasks.append(check_flights(dw.source, dw.destination, session, airlines=dw.airlines))
    results = await asyncio.gather(*tasks)
    for dw, trips in zip(dwl, results):
        save2db(trips, dw)


async def main():
    async with aiohttp.ClientSession() as session:
        session = RateLimiter(session, 300, 300)
        #await fetch_all_cities(session)
        await fetch_watches(session)



if __name__ == '__main__':
    logging.basicConfig(level='DEBUG')
    asyncio.run(main())
