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
    "MTN",
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


DEFAULT_FILE_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
STATICFILES_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
COMPRESS_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"

GS_DEFAULT_ACL = "publicRead"
GS_CACHE_CONTROL = "max-age=120"
MEDIA_ROOT = "media"

COMPRESS_ENABLED = True
COMPRESS_OFFLINE = True
COMPRESS_FILTERS = {
    "css": ["compressor.filters.css_default.CssAbsoluteFilter"],
    "js": [
        "compressor.filters.jsmin.JSMinFilter",
        "compressor.filters.jsmin.SlimItFilter",
    ],
}

