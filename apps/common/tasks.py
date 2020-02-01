import asyncio
import datetime
import random

import stripe
from celery import shared_task
from django.conf import settings

import twitter
from django.utils.timezone import now, utc

from apps.account.enums import DWGKind
from apps.auth.models import User
from wanderift.utils import AIRLINE_CODES
from worker.tasks import update_watches_rate_limited
from apps.booking.models import Deal


@shared_task
def fetch_deals():
    asyncio.run(update_watches_rate_limited())


TWEET_TEMPLATE = (
    "FlyLine Deal:  Round-trip flight on {airline} from {cityFrom} to {cityTo} "
    "for just ${price} on {departure_date} -> {return_date}! "
    "Visit joinflyline.com and book it "
    "#FlyLine #Travel #Wanderlust #Trip #TravelTheWorld"
)


@shared_task
def tweet_deal():
    if random.random() < 0.3:
        kind = DWGKind.international
    else:
        kind = DWGKind.domestic
    api = twitter.Api(
        consumer_key=settings.TWITTER_CONSUMER_API_KEY,
        consumer_secret=settings.TWITTER_CONSUMER_API_SECRET_KEY,
        access_token_key=settings.TWITTER_ACCESS_TOKEN,
        access_token_secret=settings.TWITTER_ACCESS_TOKEN_SECRET,
    )
    bd: Deal = list(
        Deal.objects.raw(
            """WITH best_prices AS (SELECT DISTINCT
           first_value(bd.id) over (partition by city_from_name, city_to_name ORDER BY price) as id
           FROM booking_deal bd)
           SELECT bd2.*
           FROM booking_deal bd2 INNER JOIN best_prices bp
           ON (bd2.id = bp.id)
           INNER JOIN account_dealwatchgroup ad on bd2.group_id = ad.id
           WHERE ad.kind = %s
           ORDER BY random()
           LIMIT 1
           """,
            [kind],
        )
    )[0]
    msg = TWEET_TEMPLATE.format(
        airline=", ".join(
            filter(None, map(lambda code: AIRLINE_CODES.get(code), bd.airlines))
        ),
        cityFrom=bd.city_from_name,
        cityTo=bd.city_to_name,
        price=bd.price,
        departure_date=bd.departure_date.strftime("%m/%d"),
        return_date=bd.return_date.strftime("%m/%d"),
    )
    api.PostUpdate(msg)


@shared_task
def sync_subscriptions():
    current_date = now()
    for u in User.objects.all():
        subscription = u.account.subscriptions_set.all().order_by("-period").first()
        if subscription:
            if subscription.period.upper < current_date:
                sub = stripe.Subscription.retrieve(subscription.subscription_id)
                start = datetime.datetime.fromtimestamp(sub.current_period_start).replace(tzinfo=utc)
                end = datetime.datetime.fromtimestamp(sub.current_period_end).replace(tzinfo=utc)
                if start < current_date < end:
                    print(f"setting period to {start}-{end}")
                    subscription.period = (start, end)
                    subscription.save()
                else:
                    print("date not in period")
