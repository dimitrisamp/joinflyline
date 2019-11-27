from django.core.management import BaseCommand
from apps.common.tasks import fetch_all_cities


class Command(BaseCommand):
    help = "Fills deal table with data from Kiwi"

    def handle(self, *args, **options):
        fetch_all_cities()
