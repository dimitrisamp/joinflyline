import random
from datetime import timedelta

from django.core.management import BaseCommand
from django.utils.timezone import now

from apps.account.models import DealWatchGroup, DealWatch


class Command(BaseCommand):
    help = "Randomize missing deal watch groups"

    def handle(self, *args, **options):
        start = (now() - timedelta(days=1)).replace(microsecond=0)
        for g in DealWatchGroup.objects.all():
            g.last_updated = start + timedelta(seconds=random.randint(0, 60 * 60 * 24))
            g.save()
