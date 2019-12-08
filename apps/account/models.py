from apps.auth.models import User
from django.contrib.postgres.fields import JSONField, ArrayField
from django.db import models
from creditcards.models import CardExpiryField, CardNumberField, SecurityCodeField


class Account(models.Model):
    card_number = CardNumberField(null=True)
    cvc = SecurityCodeField(null=True)
    expiry = CardExpiryField(null=True)
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


class DealWatch(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    destination = JSONField()
    max_price = models.DecimalField(max_digits=10, decimal_places=2)
    airlines = ArrayField(models.CharField(max_length=10))

    def __str__(self):
        return f'{self.user} {self.destination} {self.max_price} {self.airlines}'

