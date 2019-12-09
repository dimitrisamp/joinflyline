"""wanderift URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
import os

from django.conf.urls.static import static
from django.views.static import serve
from django.contrib import admin
from django.http import HttpResponse
from django.shortcuts import redirect
from django.urls import path, include, re_path
from django.views import View
from django.views.generic import TemplateView
from rest_framework import routers

from apps.account.viewsets import FrequentFlyerViewSet, DealWatchViewSet, CompanionInviteViewSet
from apps.booking.views import (
    CheckFlightsView,
    SaveBookingView,
    CheckPromoView,
    LocationQueryView, FlightSearchView)
from apps.subscriptions import views as subscriptions_views
from apps.booking.viewsets import (
    BookingViewSet, FlightViewSet, DealViewSet, TripSummary, SearchHistoryViewSet)
from apps.common.user_router import UserRouter
from apps.emails.views import booking_success
from apps.home.views import index_view
from apps.account.views import WizardView, InviteCheckView, InviteWizardView
from apps.account.api_views import UserViewSet
from django.conf import settings


router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'bookings', BookingViewSet, basename='bookings')
router.register(r'flight', FlightViewSet)
router.register(r'deals', DealViewSet, basename="deals")
router.register(r'search-history', SearchHistoryViewSet, basename='search-history')
router.register(r'deal-watch', DealWatchViewSet, basename='deal-watch')
router.register(r'companion', CompanionInviteViewSet, basename='companion')

user_router = UserRouter()
user_router.register(r'frequentflyer', FrequentFlyerViewSet, basename='frequentflyer')


class SiteMapView(View):
    def get(self, request, *args, **kwargs):
        return HttpResponse(
            open(settings.SITEMAP_FILE).read(), content_type="application/xml"
        )


class RobotsTxtView(View):
    def get(self, request, *args, **kwargs):
        return HttpResponse(open(settings.ROBOTS_TXT).read(), content_type="text/plain")


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", index_view, name="index"),
    # Auth urls
    path("auth/", include("apps.auth.urls")),
    path(r'api/auth/', include('knox.urls')),
    # booking
    path("promo/", lambda _: redirect("/#/promo/"), name="promo-landing"),
    path("check-promo/", CheckPromoView.as_view(), name="check-promo"),
    path("emails/<str:booking_id>", booking_success, name="email"),
    path("get-started/", WizardView.as_view(), name="wizard"),
    path("get-started-companion/", InviteWizardView.as_view(), name="get-started-companion"),
    path("sitemap.xml", SiteMapView.as_view(), name="sitemap"),
    path("robots.txt", RobotsTxtView.as_view(), name="robots"),
    path(
        "maintenance/",
        TemplateView.as_view(template_name="503.html"),
        name="maintenance",
    ),
    path("api/book/", SaveBookingView.as_view(), name="book"),
    path('api/bookings/summary/', TripSummary.as_view(), name="booking-summary"),
    path('api/subscriptions/plan/', subscriptions_views.Plans.as_view(), name="plans"),
    path("api/booking/check_flights/", CheckFlightsView.as_view(), name="check-flights"),
    path("api/locations/query/", LocationQueryView.as_view(), name="location-query"),
    path("api/search/", FlightSearchView.as_view(), name="flight-search"),
    path("api/check-invite/", InviteCheckView.as_view(), name="invite-check"),
    re_path("^api/users/me/", include(user_router.urls)),
    re_path("^api/", include(router.urls)),
]

if settings.STAGE == "local" and os.getenv("DEBUG_TOOLBAR", "false").lower() in (
    "true",
    "1",
    "on",
):
    import debug_toolbar
    urlpatterns += [path("__debug__/", include(debug_toolbar.urls))]

if settings.STAGE == "localprod":
    urlpatterns += [
        re_path(
            f'^{settings.MEDIA_URL.lstrip("/")}(?P<path>.*)$',
            serve,
            {"document_root": settings.MEDIA_ROOT},
        ),
        re_path(
            f'^{settings.STATIC_URL.lstrip("/")}(?P<path>.*)$',
            serve,
            {"document_root": settings.STATIC_ROOT},
        ),
    ]
