from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _
from django_enumfield import enum
from creditcards.models import CardExpiryField, CardNumberField, SecurityCodeField

from apps.account import enums


class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    card_number = CardNumberField(null=True)
    cvc = SecurityCodeField(null=True)
    expiry = CardExpiryField(null=True)
    country = models.CharField(max_length=30, blank=True)
    zip = models.CharField(max_length=20, blank=True)
    brand = models.CharField(max_length=10, blank=True)
    last4 = models.CharField(max_length=5, blank=True)
    stripe_id = models.CharField(max_length=50, blank=True)
    token = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.user} {self.zip}"


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=5, blank=True)
    market = JSONField(null=True)
    gender = enum.EnumField(enums.Gender, null=True, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    secret = models.CharField(max_length=16, blank=True)
    expiration_time = models.DateTimeField(blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    customer_id = models.CharField(max_length=70, blank=True)
    tsa_precheck_number = models.CharField(max_length=30, blank=True, null=True)


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
    fly_from = models.CharField(max_length=50)
    fly_to = models.CharField(max_length=50)
    dt_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Deal watch"
        verbose_name_plural = "Deal watches"

    def __str__(self):
        return f"{self.user} {self.fly_from} {self.fly_to} {self.dt_added}"


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.get_or_create(user=instance)

