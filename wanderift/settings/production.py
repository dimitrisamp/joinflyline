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

SITE_URL = os.getenv("SITE_URL", "https://stating.joinflyline.com")
