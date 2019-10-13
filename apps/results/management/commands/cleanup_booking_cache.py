from datetime import timedelta

from django.core.management import BaseCommand
from django.utils.timezone import now

from apps.results import BookingCache


class Command(BaseCommand):
    help = 'Cleans up the cache'

    def add_arguments(self, parser):
        parser.add_argument("--hours", type=int, default=24)

    def handle(self, *args, **options):
        hours = options["hours"]
        BookingCache.objects.filter(created__lt=now() - timedelta(hours=hours)).delete()
