from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wanderift.settings')

from django.conf import settings


app = Celery('wanderift')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
app.conf.beat_schedule = {
    # Executes every Monday morning at 7:30 a.m.
    'fetch-deals': {
        'task': 'apps.common.tasks.fetch_deals',
        'schedule': crontab(minute=50),
    },
}
if settings.STAGE == 'production':
    app.conf.beat_schedule['tweet'] = {
        "task": "apps.common.tasks.tweet_deal",
        "schedule": crontab(minute=0, hour='17,22')  # 11 AM, 4PM Dallas time
    }
