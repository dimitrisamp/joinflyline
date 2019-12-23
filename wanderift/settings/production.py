from .common_server import *


GS_BUCKET_NAME = "joinflyline"

MIDDLEWARE = [
    "apps.common.middleware.UrlRedirectMiddleware",
    *MIDDLEWARE
]

SITE_URL = os.getenv("SITE_URL", "https://joinflyline.com")

CORS_ORIGIN_WHITELIST = [
    "https://joinflyline.com"
]
