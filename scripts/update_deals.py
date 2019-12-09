import asyncio
import logging
import os
import sys
from datetime import timedelta
import aiohttp
import django
from django.db.models import Q
from django.utils.timezone import now

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from wanderift.utils.ratelimiter import RateLimiter
from worker.kiwi import fetch_all_city_interconnections, check_flights

os.environ['DJANGO_SETTINGS_MODULE'] = 'wanderift.settings'
django.setup()
from apps.account.models import DealWatchGroup
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
