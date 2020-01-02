from celery import shared_task
import asyncio
from worker.tasks import update_watches_rate_limited


@shared_task
def fetch_deals():
    asyncio.run(update_watches_rate_limited())
