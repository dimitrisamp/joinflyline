from django.urls import path

from subscriptions.views import retailsub_view

urlpatterns = [
    path('retail', retailsub_view, name='retail')
]
