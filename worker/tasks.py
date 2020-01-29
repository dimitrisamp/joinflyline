import asyncio
from datetime import timedelta

import aiohttp
from django.db.models import Q
from django.utils.timezone import now

from apps.account.models import DealWatchGroup
from wanderift.utils.ratelimiter import RateLimiter
from worker.kiwi import check_flights
from worker.utils import save2db


def outdated_dwgs():
    return DealWatchGroup.objects.filter(
        Q(last_updated__isnull=True) | Q(last_updated__lt=now() - timedelta(days=1))
    )


async def fetch_watches(session):
    tasks = []
    dwl = list(outdated_dwgs())
    for dw in dwl:
        tasks.append(
            check_flights(dw.source, dw.destination, session, airlines=dw.airlines)
        )
    results = await asyncio.gather(*tasks)
    for dw, trips in zip(dwl, results):
        save2db(trips, dw)


async def update_watches_rate_limited():
    async with aiohttp.ClientSession() as session:
        session = RateLimiter(session, 100, 10)
        await fetch_watches(session)
