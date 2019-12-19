import random
import string

from creditcards.models import CardExpiryField, CardNumberField, SecurityCodeField
from django.conf import settings
from django.contrib.postgres.fields import JSONField, ArrayField
from django.db import models
from django_enumfield.db.fields import EnumField

from apps.account import enums
from apps.auth.models import User
from apps.booking.models import Deal
from wanderift.utils import l2q


class Account(models.Model):
    brand = models.CharField(max_length=10, blank=True)
    last4 = models.CharField(max_length=5, blank=True)
    customer_id = models.CharField(max_length=70, blank=True)
    stripe_id = models.CharField(max_length=50, blank=True)
    token = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.customer_id}"


class FrequentFlyer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    american_airlines = models.CharField(max_length=30, blank=True)
    united_airlines = models.CharField(max_length=30, blank=True)
    southwest_airlines = models.CharField(max_length=30, blank=True)
    sun_country_airlines = models.CharField(max_length=30, blank=True)
    frontier_airlines = models.CharField(max_length=30, blank=True)
    delta_airlines = models.CharField(max_length=30, blank=True)
    alaska_airlines = models.CharField(max_length=30, blank=True)
    jetBlue = models.CharField(max_length=30, blank=True)
    spirit_airlines = models.CharField(max_length=30, blank=True)
    allegiant_air = models.CharField(max_length=30, blank=True)
    hawaiian_airlines = models.CharField(max_length=30, blank=True)


class DealWatchGroup(models.Model):
    source = models.CharField(max_length=20)
    destination = models.CharField(max_length=20)
    airlines = models.CharField(max_length=100, blank=True, null=True)
    last_updated = models.DateTimeField(null=True, blank=True)

    def airline_list(self):
        if len(self.airlines) == 0:
            return []
        return list(self.airlines.split(","))

    def in_cities(self):
        st, sv = self.source.split(":")
        dt, dv = self.destination.split(":")
        if not (st == "city" and dt == "city"):
            return False
        return sv in settings.DEALS_CITIES and dv in settings.DEALS_CITIES

    def in_home_markets(self):
        st, sv = self.source.split(":")
        dt, dv = self.destination.split(":")
        if not (dt == 'city' and dv in settings.DEALS_CITIES):
            return False
        return User.objects.filter(
            market__type=st,
            market__code=sv,
        ).exists()

    def in_watches(self):
        return self.watches.exists()

    def must_die(self):
        if self.in_cities():
            return False
        if self.in_watches():
            return False
        if self.in_home_markets():
            return False
        return True


class DealWatch(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(
        DealWatchGroup,
        on_delete=models.PROTECT,
        related_name="watches",
        null=True,
        blank=True,
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    destination = JSONField()
    max_price = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True
    )
    airlines = ArrayField(models.CharField(max_length=10), default=list, blank=True)

    def save(self, **kwargs):
        defaults = {
            "source": l2q(self.user.market),
            "destination": l2q(self.destination),
            "airlines": ",".join(list(sorted(self.airlines))),
        }
        self.group = DealWatchGroup.objects.get_or_create(**defaults)[0]
        super().save(**kwargs)

    def __str__(self):
        return f"{self.user} {self.destination} {self.max_price} {self.airlines}"


def generate_invite_code():
    choose_from = string.ascii_letters + string.digits
    return ''.join([random.choice(choose_from) for _ in range(20)])


class CompanionInvite(models.Model):
    email = models.EmailField()
    sender = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="sent_invites"
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="received_invites",
        blank=True,
        null=True,
    )
    status = EnumField(
        enums.CompanionInviteStatus, default=enums.CompanionInviteStatus.created
    )
    invite_code = models.CharField(max_length=50, default=generate_invite_code)
    invited = models.DateTimeField(auto_now_add=True)
    accessed = models.DateTimeField(null=True, blank=True)
    signed_up = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.email}"
