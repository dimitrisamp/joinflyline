from django.contrib.auth.models import User
from django.contrib.postgres.fields import DateTimeRangeField
from django.db import models


class Subscriptions(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    plan = models.CharField(max_length=30, blank=False)
    period = DateTimeRangeField(null=True, blank=True)

    def __str__(self):
        return f'{self.user} {self.plan}'

    class Meta:
        verbose_name_plural = 'Subscriptions'


class SubscriptionsSummary(Subscriptions):
    class Meta:
        proxy = True
        verbose_name = 'Subscription Summary'
        verbose_name_plural = 'Subscriptions Summary'
