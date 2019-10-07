import json

from django.db.models.functions import Now
from django.shortcuts import render
from django.views.generic import TemplateView

from booking.models import Flight, BookingContact
from results.models import BookingCache


def corporate_view(request, *args, **kwargs):
    context = {"title": "Wanderift Corporates"}
    return render(request, "corporate/corporate.html", context)


def trips_view(request, *args, **kwargs):
    context = {"title": "Corporates Trips"}
    return render(request, "corporate/trips.html", context)


class ManageTripsView(TemplateView):
    template_name = "corporate/manage-trips.html"

    def get_context_data(self, **kwargs):
        user_bookings = BookingContact.objects.filter(user=self.request.user)
        upcoming_trips = user_bookings.filter(flights__departure_time__gt=Now()).distinct()
        past_trips = user_bookings.exclude(flights__departure_time__gt=Now()).distinct()
        context = {
            "title": "Manage Corporates Trips",
            "upcoming_trips": [o.to_data() for o in upcoming_trips],
            "past_trips": [o.to_data() for o in past_trips],
            "watched_flights": [
                json.loads(o.data)
                for o in BookingCache.objects.filter(user=self.request.user).order_by(
                    "-created"
                )[:3]
            ],
        }
        return context


def how_it_works(request):
    context = {"title": "How it works"}

    return render(request, "corporate/how-it-works.html", context)
