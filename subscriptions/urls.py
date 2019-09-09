from django.urls import path

from subscriptions.views import retail_sub_view

urlpatterns = [
    path('subscription', retail_sub_view, name='subscription')
]
