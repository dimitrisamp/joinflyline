from django.contrib.auth.models import User
from django.db import models


class Subscriptions(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plan = models.CharField(max_length=30, blank=False)
    tokens = models.IntegerField(null=False, default=0)
    rollover = models.IntegerField(null=False, default=0)

    def __str__(self):
        return self.plan
