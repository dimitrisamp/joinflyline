from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'wanderift.settings')

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
