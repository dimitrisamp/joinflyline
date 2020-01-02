import asyncio
import logging
import os
import sys
import django

sys.path.append(os.path.dirname(os.path.dirname(__file__)))

os.environ["DJANGO_SETTINGS_MODULE"] = "wanderift.settings"
django.setup()


from worker.tasks import update_watches_rate_limited


if __name__ == "__main__":
    logging.basicConfig(level="DEBUG")
    asyncio.run(update_watches_rate_limited())
