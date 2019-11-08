from .base import *

INSTALLED_APPS += [
    'debug_toolbar'
]

INTERNAL_IPS = [
    '127.0.0.1'
]

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

CELERY_TASK_ALWAYS_EAGER = True

SITE_URL = os.getenv("SITE_URL", "http://127.0.0.1:8000")
