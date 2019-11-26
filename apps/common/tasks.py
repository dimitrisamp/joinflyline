import aiohttp
from asgiref.sync import async_to_sync
from celery import shared_task
from worker.kiwi import fetch_all_city_interconnections
from django.conf import settings

from worker.utils import save2db


@async_to_sync
async def _fetch_all_cities():
    conn = aiohttp.TCPConnector(limit_per_host=30)
    async with aiohttp.ClientSession(connector=conn) as session:
        async for r in fetch_all_city_interconnections(session, settings.DEALS_CITIES):
            save2db(r)


@shared_task
def fetch_all_cities():
    _fetch_all_cities()
