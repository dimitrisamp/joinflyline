from django.contrib.auth import get_user_model
from rest_framework.viewsets import GenericViewSet
from apps.account import serializers
from rest_framework import mixins

from apps.account.models import FrequentFlyer, Account

UserModel = get_user_model()


class UserViewSet(mixins.UpdateModelMixin, mixins.RetrieveModelMixin, GenericViewSet):
    queryset = UserModel.objects.all()
    serializer_class = serializers.User

    def get_object(self):
        if self.kwargs.get("pk", None) == "me":
            self.kwargs["pk"] = self.request.user.pk
        user = super(UserViewSet, self).get_object()
        FrequentFlyer.objects.get_or_create(user=user)
        Account.objects.get_or_create(user=user)
        return user
