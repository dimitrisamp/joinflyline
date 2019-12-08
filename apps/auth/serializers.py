from rest_framework import serializers

from apps.auth.models import User as UserModel
from apps.subscriptions.serializers import Subscription


class EditUser(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = [
            'first_name',
            'last_name',
            "market",
            "gender",
            "phone_number",
            "dob",
            "customer_id",
            "tsa_precheck_number",
            "zip",
            "country",
        ]


class User(serializers.ModelSerializer):
    subscription = Subscription()

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
            "subscription",
            "market",
            "gender",
            "phone_number",
            "dob",
            "customer_id",
            "tsa_precheck_number",
            "zip",
            "country_code",
        ]
