from django.urls import path
from corporate.views import corporate_view, trips_view, manage_trips_view

urlpatterns = [
    path('corporate', corporate_view, name="corporate"),
    path('corporate-trips', trips_view, name="trips"),
    path('manage_corporate-trips', manage_trips_view, name="manage-trips")
]
