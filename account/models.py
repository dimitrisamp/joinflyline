from django.contrib.auth.models import User
from django.db import models


class Account(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    card_number = models.CharField(max_length=30, blank=False)
    cvc = models.CharField(max_length=3, blank=False)
    expiry = models.CharField(max_length=10, blank=False)
    country = models.CharField(max_length=30, blank=True)
    zip = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return self
