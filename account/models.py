from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Account(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    card_number = models.CharField(max_length=30, blank=False)
    scv = models.CharField(max_length=10, blank=False)
    expiry = models.DateField(null=True, blank=False)
    country = models.CharField(max_length=30, blank=True)
    zip = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self
