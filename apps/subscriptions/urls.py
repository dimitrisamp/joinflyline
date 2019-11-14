from django.urls import path
from apps.subscriptions import views as subscriptions_views

urlpatterns = [
    path('plan/', subscriptions_views.Plans.as_view(), name="plans")
]
