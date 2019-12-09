from rest_framework import serializers
from . import models


class FrequentFlyer(serializers.ModelSerializer):
    class Meta:
        model = models.FrequentFlyer
        fields = [
            "american_airlines",
            "united_airlines",
            "southwest_airlines",
            "sun_country_airlines",
            "frontier_airlines",
            "delta_airlines",
            "alaska_airlines",
            "jetBlue",
            "spirit_airlines",
            "allegiant_air",
            "hawaiian_airlines",
        ]


class DealWatch(serializers.ModelSerializer):
    class Meta:
        model = models.DealWatch
        fields = ("id", "destination", "max_price", "airlines")


class CompanionInvite(serializers.ModelSerializer):
    class Meta:
        model = models.CompanionInvite
        fields = ("id", "email", "invited", "status")
