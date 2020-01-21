from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import JSONField
from django.db import models
from django.db.models.functions import Now
from django.utils.translation import gettext_lazy as _
from django_enumfield import enum

from . import enums
from wanderift.utils import generate_invite_code


class User(AbstractUser):
    title = models.CharField(max_length=5, blank=True)
    market = JSONField(null=True)
    gender = enum.EnumField(enums.Gender, null=True, blank=True)
    phone_number = models.CharField(max_length=30, blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    tsa_precheck_number = models.CharField(max_length=30, blank=True, null=True)
    account = models.ForeignKey('account.Account', null=True, blank=True, on_delete=models.PROTECT)
    country_code = models.CharField(max_length=5, blank=True)
    zip = models.CharField(max_length=20, blank=True, null=True)
    role = enum.EnumField(enums.UserRole, default=enums.UserRole.SUBSCRIBER)
    passport_number = models.CharField(max_length=50, blank=True, default="")
    activation_code = models.CharField(max_length=50, blank=True, null=True)
    source = enum.EnumField(enums.UserSource, default=enums.UserSource.REGULAR)

    def subscription(self):
        from ..subscriptions.models import Subscriptions
        return Subscriptions.objects.filter(account=self.account, period__contains=Now()).first()
