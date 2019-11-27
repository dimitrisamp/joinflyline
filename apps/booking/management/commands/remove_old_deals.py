from django.core.management import BaseCommand
from django.db.models.functions import Now

from apps.booking.models import Deal


class Command(BaseCommand):
    help = 'Deletes old deals'

    def handle(self, *args, **options):
        Deal.objects.filter(departure_date__lt=Now()).delete()
