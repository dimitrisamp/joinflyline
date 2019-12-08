from django.contrib.postgres.fields import DateTimeRangeField
from django.db import models

from apps.account.models import Account


class Subscriptions(models.Model):
    account = models.ForeignKey(Account, on_delete=models.PROTECT)
    plan = models.CharField(max_length=30, blank=False)
    period = DateTimeRangeField(null=True, blank=True)

    def __str__(self):
        return f'{self.account} {self.plan} {self.period}'

    class Meta:
        verbose_name_plural = 'Subscriptions'


class SubscriptionsSummary(Subscriptions):
    class Meta:
        proxy = True
        verbose_name = 'Subscription Summary'
        verbose_name_plural = 'Subscriptions Summary'
