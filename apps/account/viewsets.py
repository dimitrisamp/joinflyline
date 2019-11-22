from rest_framework import viewsets
from rest_framework.viewsets import GenericViewSet
from rest_framework.mixins import RetrieveModelMixin, UpdateModelMixin

from . import models as accounts_models
from . import serializers


class AccountViewSet(RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    serializer_class = serializers.Account

    def get_object(self):
        return accounts_models.Account.objects.get_or_create(user=self.request.user)[0]


class FrequentFlyerViewSet(RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    serializer_class = serializers.FrequentFlyer

    def get_object(self):
        return accounts_models.FrequentFlyer.objects.get_or_create(user=self.request.user)[0]


class ProfileViewSet(RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    serializer_class = serializers.Profile

    def get_object(self):
        return accounts_models.Profile.objects.get_or_create(user=self.request.user)[0]
