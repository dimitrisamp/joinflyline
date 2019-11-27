from .base import *

DEBUG = False

STATIC_ROOT = os.path.join(BASE_DIR, "collected_static")
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
STATIC_URL = '/static/'
MEDIA_URL = '/media/'
COMPRESS_ENABLED = True
COMPRESS_OFFLINE = True
COMPRESS_FILTERS = {
    "css": [
        "compressor.filters.css_default.CssAbsoluteFilter",
    ],
    "js": [
        "compressor.filters.jsmin.JSMinFilter",
        "compressor.filters.jsmin.SlimItFilter",
    ],
}
DEALS_CITIES = ['DFW', 'NYC', 'LAX']
