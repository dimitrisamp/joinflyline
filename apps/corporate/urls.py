from django.urls import path
from apps.corporate.views import ManageTripsView

urlpatterns = [
    path('manage-corporate-trips', ManageTripsView.as_view(), name="manage-trips"),
]
