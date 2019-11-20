import json

from rest_framework import serializers
from . import models as booking_models


class FlightLite(serializers.ModelSerializer):
    class Meta:
        model = booking_models.Flight
        fields = [
            "id",
            "departure_time",
            "arrival_time",
            "city_from",
            "city_to",
            "airport_from",
            "airport_to",
            "is_return",
        ]


class FlightFull(FlightLite):
    data = serializers.SerializerMethodField()

    class Meta:
        fields = [*FlightLite.Meta.fields, "data"]

    def get_data(self, obj):
        try:
            return json.loads(obj.data)
        except ValueError:
            return None


class Booking(serializers.ModelSerializer):
    flights = FlightLite(many=True)

    class Meta:
        model = booking_models.BookingContact
        fields = ["id", "booking_id", "email", "phone", "data", "user", "flights"]
