from django.urls import path

from apps.subscriptions.views import retail_sub_view, plan_subscription

urlpatterns = [
    path('subscription', retail_sub_view, name='subscription'),
    path('plan/<str:plan>', plan_subscription, name="plan")
]
