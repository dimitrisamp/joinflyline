from .base import *

DEBUG = True

STATIC_ROOT = os.path.join(BASE_DIR, "collected_static")
STATIC_URL = '/static/'
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
COMPRESS_ENABLED = True
COMPRESS_OFFLINE = True
COMPRESS_FILTERS = {
    "css": [
        "compressor.filters.css_default.CssAbsoluteFilter",
        #"compressor.filters.cssmin.CSSCompressorFilter",
    ],
    "js": [
        "compressor.filters.jsmin.JSMinFilter",
        "compressor.filters.jsmin.SlimItFilter",
    ],
}
