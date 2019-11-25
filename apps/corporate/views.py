from django.contrib.auth.decorators import login_required
from django.db.models.functions import Now
from django.utils.decorators import method_decorator
from django.views.generic import TemplateView

from apps.booking.models import BookingContact


class ManageTripsView(TemplateView):
    template_name = "corporate/manage-trips.html"

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super().dispatch(*args, **kwargs)

    def get_context_data(self, **kwargs):
        user_bookings = BookingContact.objects.filter(user=self.request.user)
        upcoming_trips = user_bookings.filter(flights__departure_time__gt=Now()).distinct()
        past_trips = user_bookings.exclude(flights__departure_time__gt=Now()).distinct()
        context = {
            "title": "Trip Activity | FlyLine",
            "upcoming_trips": [o.to_data() for o in upcoming_trips],
            "past_trips": [o.to_data() for o in past_trips],
        }
        return context

