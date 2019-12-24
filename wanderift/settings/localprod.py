from .base import *

DEBUG = False

STATIC_ROOT = os.path.join(BASE_DIR, "collected_static")
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
STATIC_URL = '/static/'
MEDIA_URL = '/media/'
DEALS_CITIES = ['DFW', 'NYC', 'LAX']
CORS_ORIGIN_ALLOW_ALL = True
