from rest_framework.viewsets import GenericViewSet, ReadOnlyModelViewSet
from rest_framework.mixins import RetrieveModelMixin

import apps.booking.models as booking_models
from apps.booking.filters import BookingFilter
from apps.booking.serializers import FlightFull, Booking


class FlightViewSet(RetrieveModelMixin, GenericViewSet):
    queryset = booking_models.Flight.objects.all()
    serializer_class = FlightFull


class BookingViewSet(ReadOnlyModelViewSet):
    serializer_class = Booking
    filterset_class = BookingFilter

    def get_queryset(self):
        return booking_models.BookingContact.objects.filter(user=self.request.user)
