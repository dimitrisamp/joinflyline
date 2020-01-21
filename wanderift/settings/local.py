from .base import *


INSTALLED_APPS += ["rest_framework_swagger"]

if os.getenv("DEBUG_TOOLBAR", "false").lower() in ("true", "1", "on"):
    INSTALLED_APPS += ["debug_toolbar"]

    MIDDLEWARE = ["debug_toolbar.middleware.DebugToolbarMiddleware", *MIDDLEWARE]

    INTERNAL_IPS = ["127.0.0.1"]

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

CELERY_TASK_ALWAYS_EAGER = True

SITE_URL = os.getenv("SITE_URL", "http://127.0.0.1:8000")
DEALS_CITIES = ["DFW", "NYC", "LAX"]

DEALS_INTERNATIONAL = ["PEK", "LHR", "HND"]

CORS_ORIGIN_ALLOW_ALL = True
REPORT_RECEIVERS = [os.getenv("REPORT_RECEIVER", "user@example.com")]
