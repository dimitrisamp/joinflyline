from .common_server import *


GS_BUCKET_NAME = "joinflyline-staging"

COMPRESS_URL = os.getenv(
    "COMPRESS_URL", f"https://storage.googleapis.com/{GS_BUCKET_NAME}/"
)

SITE_URL = os.getenv("SITE_URL", "https://staging.joinflyline.com")
