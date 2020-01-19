import itertools

from django.core.management import BaseCommand

from apps.account.models import DealWatchGroup, DealWatch


class Command(BaseCommand):
    help = "Fix missing deal watch groups"

    def handle(self, *args, **options):
        for d in DealWatch.objects.all():
            d.save()
        for g in DealWatchGroup.objects.all():
            if not g.watches.exists():
                g.delete()
