from .base import *

import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.celery import CeleryIntegration
from sentry_sdk.integrations.aiohttp import AioHttpIntegration
from sentry_sdk.integrations.redis import RedisIntegration


sentry_sdk.init(
    dsn=SENTRY_DSN,
    integrations=[
        DjangoIntegration(),
        CeleryIntegration(),
        AioHttpIntegration(),
        RedisIntegration(),
    ],
)


DEBUG = False

DEALS_CITIES = [
    "ATL",
    "AUS",
    "BOS",
    "CLT",
    "CHI",
    "DFW",
    "DEN",
    "DTT",
    "LAS",
    "LAX",
    "MIA",
    "NYC",
    "ORL",
    "PHL",
    "SLC",
    "SFO",
    "SEA",
    "WAS",
]
COLLECTFAST_THREADS = 20
COLLECTFAST_STRATEGY = "collectfast.strategies.gcloud.GoogleCloudStrategy"
DEFAULT_FILE_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
STATICFILES_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"

GS_DEFAULT_ACL = "publicRead"
GS_CACHE_CONTROL = "max-age=120"
MEDIA_ROOT = "media"
