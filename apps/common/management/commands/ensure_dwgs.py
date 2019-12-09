import itertools

from django.conf import settings
from django.core.management import BaseCommand

from apps.account.models import DealWatchGroup
from apps.auth.models import User
from wanderift.utils import l2q


class Command(BaseCommand):
    help = "Fill missing deal watch groups"

    def handle(self, *args, **options):
        for a, b in itertools.combinations(settings.DEALS_CITIES, 2):
            for x, y in ((a, b), (b, a)):
                DealWatchGroup.objects.get_or_create(
                    source=f"city:{x}", destination=f"city:{y}"
                )
        for user in User.objects.all():
            if not user.market:
                continue
            for city in settings.DEALS_CITIES:
                source = l2q(user.market)
                destination = f"city:{city}"
                if source != destination:
                    DealWatchGroup.objects.get_or_create(source=source, destination=destination)
