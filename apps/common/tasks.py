import asyncio

from celery import shared_task
from django.conf import settings

import twitter

from wanderift.utils import AIRLINE_CODES
from worker.tasks import update_watches_rate_limited
from apps.booking.models import Deal


@shared_task
def fetch_deals():
    asyncio.run(update_watches_rate_limited())


TWEET_TEMPLATE = (
    "FlyLine Deal:  Round-trip flight on {airline} from {cityFrom} to {cityTo} "
    "for just ${price} on {departure_date} -> {return_date}! "
    "Visit joinflyline.com and book it"
)


@shared_task
def tweet_deal():
    api = twitter.Api(
        consumer_key=settings.TWITTER_CONSUMER_API_KEY,
        consumer_secret=settings.TWITTER_CONSUMER_API_SECRET_KEY,
        access_token_key=settings.TWITTER_ACCESS_TOKEN,
        access_token_secret=settings.TWITTER_ACCESS_TOKEN_SECRET,
    )
    bd: Deal = list(Deal.objects.raw(
        """WITH best_prices AS (SELECT DISTINCT
           first_value(bd.id) over (partition by city_from_name, city_to_name ORDER BY price) as id
           FROM booking_deal bd)
           SELECT bd2.*
           FROM booking_deal bd2 INNER JOIN best_prices bp
           ON (bd2.id = bp.id)
           ORDER BY random()
           LIMIT 1
           """
    ))[0]
    msg = TWEET_TEMPLATE.format(
        airline=', '.join(filter(None, map(lambda code: AIRLINE_CODES.get(code), bd.airlines))),
        cityFrom=bd.city_from_name,
        cityTo=bd.city_to_name,
        price=bd.price,
        departure_date=bd.departure_date.strftime('%m/%d'),
        return_date=bd.return_date.strftime('%m/%d')
    )
    api.PostUpdate(msg)
