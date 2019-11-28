import json
from collections import Counter

from django.db.models.functions import Now
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet, ReadOnlyModelViewSet
from rest_framework.mixins import RetrieveModelMixin

import apps.booking.models as booking_models
from apps.booking.filters import BookingFilter, DealFilterSet, DealPagination
from apps.booking.serializers import FlightFull, Booking, Deal
from django.conf import settings

from apps.subscriptions.models import Subscriptions


class FlightViewSet(RetrieveModelMixin, GenericViewSet):
    queryset = booking_models.Flight.objects.all()
    serializer_class = FlightFull


class BookingViewSet(ReadOnlyModelViewSet):
    serializer_class = Booking
    filterset_class = BookingFilter

    def get_queryset(self):
        return booking_models.BookingContact.objects.filter(user=self.request.user)


class DealViewSet(ReadOnlyModelViewSet):
    serializer_class = Deal
    pagination_class = DealPagination
    filterset_class = DealFilterSet

    def get_queryset(self):
        return booking_models.Deal.objects.order_by("?")


AVERAGE_PRICES = {"domestic": 350, "international": 850}


class TripSummary(APIView):
    def get(self, request):
        user = request.user
        plans = json.load(open(settings.PLANS_CONFIG_FILE))
        try:
            current_plan = Subscriptions.objects.get(
                user=user, period__contains=Now()
            ).plan
        except Subscriptions.DoesNotExist:
            current_plan = None
        try:
            limit = plans[current_plan]["limit"]
        except KeyError:
            limit = 0
        count = {"domestic": 0, "international": 0}
        savings = {"domestic": 0, "international": 0}
        # TODO: optimize db usage (aggregate on DB)
        trips_booked = booking_models.BookingContact.objects.filter(user=user)
        for f in trips_booked:
            kind = "domestic" if f.is_domestic() else "international"
            count[kind] += 1
            savings[kind] += max(0, AVERAGE_PRICES[kind] - f.data["conversion"]["USD"])
        data = {
            "savings": savings,
            "count": count,
            "remaining": limit - sum(count.values()) if limit is not None else None
        }
        return Response(data)
