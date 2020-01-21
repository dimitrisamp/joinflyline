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
    "BNA",
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

DEALS_INTERNATIONAL = [
    "PEK",
    "LHR",
    "HND",
    "CDG",
    "FRA",
    "HKG",
    "DXB",
    "CGK",
    "AMS",
    "MAD",
    "BKK",
    "SIN",
    "CAN",
    "PVG",
    "MUC",
    "KUL",
    "FCO",
    "IST",
    "SYD",
    "ICN",
    "DEL",
    "BCN",
    "LGW",
    "YYZ",
    "SHA",
    "BOM",
    "GRU",
    "MNL",
    "CTU",
    "SZX",
    "MEL",
    "NRT",
    "ORY",
    "MEX",
    "DME",
    "AYT",
    "TPE",
    "ZRH",
    "PMI",
    "CPH",
    "SVO",
    "KMG",
    "VIE",
    "OSL",
    "JED",
    "BNE",
    "DUS",
    "BOG",
    "MXP",
    "JNB",
    "ARN",
    "MAN",
    "BRU",
    "DUB",
    "GMP",
    "DOH",
    "STN",
    "HGH",
    "CJU",
    "YVR",
    "TXL",
    "CGH",
    "BSB",
    "CTS",
    "XMN",
    "RUH",
    "FUK",
    "GIG",
    "HEL",
    "LIS",
    "ATH",
    "AKL",
]

COLLECTFAST_THREADS = 20
COLLECTFAST_STRATEGY = "collectfast.strategies.gcloud.GoogleCloudStrategy"
DEFAULT_FILE_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
STATICFILES_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"

GS_DEFAULT_ACL = "publicRead"
GS_CACHE_CONTROL = "max-age=120"
MEDIA_ROOT = "media"
REPORT_RECEIVERS = ["zach@joinflyline.com", "adam@joinflyline.com"]
