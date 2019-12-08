from rest_framework import serializers

from . import models as subscriptions_models


class Subscription(serializers.ModelSerializer):
    class Meta:
        model = subscriptions_models.Subscriptions
        fields = ["plan", "period"]
