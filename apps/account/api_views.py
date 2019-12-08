from rest_framework.viewsets import GenericViewSet

import apps.auth.serializers
from rest_framework import mixins

from apps.account.models import FrequentFlyer, Account
from apps.auth.models import User


class UserViewSet(mixins.UpdateModelMixin, mixins.RetrieveModelMixin, GenericViewSet):
    queryset = User.objects.all()
    serializer_class = apps.auth.serializers.User

    def get_object(self):
        if self.kwargs.get("pk", None) == "me":
            self.kwargs["pk"] = self.request.user.pk
        user = super(UserViewSet, self).get_object()
        FrequentFlyer.objects.get_or_create(user=user)
        return user

    def get_serializer_class(self):
        if self.action in ("update", "partial_update"):
            return apps.auth.serializers.EditUser
        return apps.auth.serializers.User
