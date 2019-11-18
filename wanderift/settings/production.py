from .base import *
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False

sentry_sdk.init(dsn=SENTRY_DSN, integrations=[DjangoIntegration()])
DEFAULT_FILE_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
STATICFILES_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
GS_BUCKET_NAME = "joinflyline-staging"
GS_DEFAULT_ACL = "publicRead"
GS_CACHE_CONTROL = "max-age=120"
MEDIA_ROOT = "media"

COMPRESS_STORAGE = "storages.backends.gcloud.GoogleCloudStorage"
COMPRESS_ENABLED = True
COMPRESS_OFFLINE = True
COMPRESS_FILTERS = {
    "css": [
        "compressor.filters.css_default.CssAbsoluteFilter",
        "compressor.filters.cssmin.CSSCompressorFilter",
    ],
    "js": [
        "compressor.filters.jsmin.JSMinFilter",
        "compressor.filters.jsmin.SlimItFilter",
    ],
}
COMPRESS_URL = os.getenv(
    "COMPRESS_URL", "https://storage.cloud.google.com/joinflyline-staging/"
)


SITE_URL = os.getenv("SITE_URL", "https://stating.joinflyline.com")
