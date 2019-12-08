from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework.mixins import RetrieveModelMixin, UpdateModelMixin, CreateModelMixin, DestroyModelMixin, \
    ListModelMixin

from . import models as accounts_models
from . import serializers
from .serializers import DealWatch


class FrequentFlyerViewSet(RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    serializer_class = serializers.FrequentFlyer

    def get_object(self):
        return accounts_models.FrequentFlyer.objects.get_or_create(user=self.request.user)[0]


class DealWatchViewSet(CreateModelMixin, ListModelMixin, DestroyModelMixin, GenericViewSet):
    serializer_class = DealWatch

    def get_queryset(self):
        return accounts_models.DealWatch.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        obj = accounts_models.DealWatch.objects.create(user=self.request.user, **serializer.validated_data)
        serializer = self.get_serializer_class()(obj)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
