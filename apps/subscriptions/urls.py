from django.urls import path

from apps.subscriptions import views

urlpatterns = [
    path('check-promo', views.CheckPromoView.as_view(), name='check-promo'),
    path('cancel-subscription', views.CancelSubscriptionView.as_view(), name="cancel-subscription"),
]
