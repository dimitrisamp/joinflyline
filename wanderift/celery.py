from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "wanderift.settings")

from django.conf import settings


app = Celery("wanderift")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
app.conf.beat_schedule = {
    # Executes every Monday morning at 7:30 a.m.
    "fetch-deals": {
        "task": "apps.common.tasks.fetch_deals",
        "schedule": crontab(minute=50),
    }
}
if settings.STAGE == "production":
    app.conf.beat_schedule["tweet"] = {
        "task": "apps.common.tasks.tweet_deal",
        "schedule": crontab(
            minute=0, hour="12,14,15,16,17,18,20,22,0,2"
        ),  # -6 to get Dallas time
    }
    # app.conf.beat_schedule["deal_alerts"] = {
    #     "task": "apps.booking.tasks.send_mass_deal_alerts",
    #     "schedule": crontab(
    #         minute=0, hour=14, day_of_week="1,3,5"
    #     ),  # Monday,Wendesday,Friday at 8AM Dallas time
    # }
    app.conf.beat_schedule["search_history"] = {
        "task": "apps.booking.tasks.send_search_history",
        "schedule": crontab(
            minute=0, hour=14
        ),  # Monday,Wendesday,Friday at 8AM Dallas time
    }
