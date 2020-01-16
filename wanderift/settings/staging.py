from .common_server import *


GS_BUCKET_NAME = "joinflyline-staging"

SITE_URL = os.getenv("SITE_URL", "https://staging.joinflyline.com")

CORS_ORIGIN_WHITELIST = [
    "https://staging.joinflyline.com"
]

INSTALLED_APPS += ["rest_framework_swagger"]
