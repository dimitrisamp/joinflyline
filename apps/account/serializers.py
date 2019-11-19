from django.contrib.auth import get_user_model
from rest_framework import serializers
from . import models
from ..subscriptions.serializers import Subscription

UserModel = get_user_model()


class Profile(serializers.ModelSerializer):
    class Meta:
        model = models.Profile
        fields = [
            "title",
            "market",
            "gender",
            "phone_number",
            "secret",
            "expiration_time",
            "dob",
            "customer_id",
            "tsa_precheck_number",
        ]


class Account(serializers.ModelSerializer):
    class Meta:
        model = models.Account
        fields = ["zip", "country"]


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


class User(serializers.ModelSerializer):
    profile = Profile()
    account = Account()
    subscriptions = Subscription()

    class Meta:
        model = UserModel
        fields = [
            "id",
            "last_login",
            "is_superuser",
            "username",
            "first_name",
            "last_name",
            "email",
            "date_joined",
            "profile",
            "account",
            "subscriptions",
        ]
