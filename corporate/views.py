from django.db.models.functions import Now
from django.shortcuts import render
from django.views.generic import TemplateView

from booking.models import Flight
from results.models import BookingCache


def corporate_view(request, *args, **kwargs):
    context = {
        "title": "Wanderift Corporates"
    }
    return render(request, "corporate.html", context)


def trips_view(request, *args, **kwargs):
    context = {
        "title": "Corporates Trips"
    }
    return render(request, "trips.html", context)


class ManageTripsView(TemplateView):
    template_name = "manage-trips.html"

    def get_context_data(self, **kwargs):
        my_flights = Flight.objects.filter(booking__user=self.request.user)
        upcoming_flights = my_flights.filter(departure_time__gt=Now()).order_by('departure_time')
        past_flights = my_flights.filter(departure_time__lte=Now()).order_by('departure_time')
        context = {
            "title": "Manage Corporates Trips",
            "upcoming_flights": [o.to_data() for o in upcoming_flights],
            "past_flights": [o.to_data() for o in past_flights],
            "watched_flights": BookingCache.objects.filter(user=self.request.user).order_by('-created')[:3]
        }
        return context


def how_it_works(request):
    context = {
        "title": "How it works"
    }

    return render(request, "how-it-works.html", context)
