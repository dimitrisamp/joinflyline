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
    class Meta:
        model = booking_models.Flight
        fields = [*FlightLite.Meta.fields, "data"]


class Booking(serializers.ModelSerializer):
    flights = FlightFull(many=True)

    class Meta:
        model = booking_models.BookingContact
        fields = ["id", "booking_id", "email", "phone", "data", "user", "flights"]


class Deal(serializers.ModelSerializer):
    class Meta:
        model = booking_models.Deal
        fields = (
            "city_from_name",
            "city_to_name",
            "fly_from",
            "fly_to",
            "departure_date",
            "return_date",
            "airlines",
            "price",
        )


class SearchHistory(serializers.ModelSerializer):
    class Meta:
        model = booking_models.SearchHistory
        fields = (
            "place_from",
            "place_to",
            "departure_date",
            "return_date",
            "adults",
            "children",
            "infants",
            "seat_type",
            "destination_type",
        )
