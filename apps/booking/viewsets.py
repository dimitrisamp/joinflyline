import json
from collections import Counter

from django.db.models.functions import Now
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet, ReadOnlyModelViewSet
from rest_framework.mixins import RetrieveModelMixin, ListModelMixin, CreateModelMixin

import apps.booking.models as booking_models
from apps.booking.filters import BookingFilter, DealFilterSet, DealPagination
from apps.booking.serializers import FlightFull, Booking, Deal, SearchHistory
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
        plans = settings.PLAN_DEFINITIONS
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


class SearchHistoryViewSet(ListModelMixin, CreateModelMixin, GenericViewSet):
    serializer_class = SearchHistory

    def get_queryset(self):
        return booking_models.SearchHistory.objects.filter(user=self.request.user).order_by('-timestamp')[:10]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking_models.SearchHistory.objects.create(user=self.request.user, **serializer.validated_data)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
