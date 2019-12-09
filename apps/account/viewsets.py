from django.conf import settings
from django.db import transaction

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from rest_framework.mixins import (
    RetrieveModelMixin,
    UpdateModelMixin,
    CreateModelMixin,
    DestroyModelMixin,
    ListModelMixin,
)

from . import models as accounts_models, enums
from . import serializers
from ..auth.enums import UserRole
from ..auth.models import User
from ..emails.tasks import invite_companion


class FrequentFlyerViewSet(RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    serializer_class = serializers.FrequentFlyer

    def get_object(self):
        return accounts_models.FrequentFlyer.objects.get_or_create(
            user=self.request.user
        )[0]


class DealWatchViewSet(
    CreateModelMixin, ListModelMixin, DestroyModelMixin, GenericViewSet
):
    serializer_class = serializers.DealWatch

    def get_queryset(self):
        return accounts_models.DealWatch.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        obj = accounts_models.DealWatch.objects.create(
            user=self.request.user, **serializer.validated_data
        )
        serializer = self.get_serializer_class()(obj)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class CompanionInviteViewSet(
    CreateModelMixin, ListModelMixin, DestroyModelMixin, GenericViewSet
):
    serializer_class = serializers.CompanionInvite

    def get_queryset(self):
        return accounts_models.CompanionInvite.objects.filter(sender=self.request.user)

    def create(self, request, *args, **kwargs):
        if self.request.user.role == UserRole.COMPANION:
            return Response(
                {"error": {"code": "non-subscriber"}}, status=status.HTTP_403_FORBIDDEN
            )
        with transaction.atomic():
            subscription = self.request.user.subscription()
            if not subscription:
                return Response(
                    {"error": {"code": "non-subscriber"}},
                    status=status.HTTP_404_NOT_FOUND,
                )
            plan = subscription.plan
            definition = settings.PLAN_DEFINITIONS[plan]
            companion_count = definition["companion"]
            current_count = accounts_models.CompanionInvite.objects.filter(
                sender=self.request.user, status=enums.CompanionInviteStatus.active
            ).count()
            if companion_count <= current_count:
                return Response(
                    {"error": {"code": "limit-exceeded"}}, status.HTTP_404_NOT_FOUND
                )
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            if User.objects.filter(email=serializer.data['email']).exists():
                return Response(
                    {"error": {"code": "existing-user"}}, status.HTTP_404_NOT_FOUND
                )
            obj = accounts_models.CompanionInvite.objects.create(
                sender=self.request.user, **serializer.validated_data
            )
            transaction.on_commit(lambda: invite_companion.delay(obj.pk))
            serializer = self.get_serializer_class()(obj)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, status=status.HTTP_201_CREATED, headers=headers
            )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status == enums.CompanionInviteStatus.active:
            return Response(
                {"error": {"code": "delete-failed-active"}},
                status=status.HTTP_404_NOT_FOUND,
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
