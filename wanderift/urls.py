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

from apps.account.viewsets import AccountViewSet, FrequentFlyerViewSet, ProfileViewSet
from apps.booking.views import (
    CheckFlightsView,
    SaveBookingView,
    CheckPromoView,
    RetailBookingView,
)
from apps.booking.viewsets import BookingViewSet, FlightViewSet
from apps.common.user_router import UserRouter
from apps.emails.views import booking_success
from apps.home.views import (
    index_view,
    home_view,
    SignInView,
    SignUpView,
    PromoLandingView,
    SavingsExplainedView,
)
from apps.account.views import WizardView
from apps.account.api_views import UserViewSet
from django.conf import settings


router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'bookings', BookingViewSet, basename='bookings')
router.register(r'flight', FlightViewSet)

user_router = UserRouter()
user_router.register(r'account', AccountViewSet, basename='account')
user_router.register(r'frequentflyer', FrequentFlyerViewSet, basename='frequentflyer')
user_router.register(r'profile', ProfileViewSet, basename='profile')


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
    # site under construction
    # path('', under_construction, name="construction"),
    # Home page links
    path("", index_view, name="index"),
    path("home/", home_view, name="home"),
    # Accounts page urls
    path("account/", include("apps.account.urls")),
    # Corporate urls
    path("corporates/", include("apps.corporate.urls")),
    # Auth urls
    path("auth/", include("apps.oauth.urls")),
    # booking
    path("promo/", lambda _: redirect("/#/promo/"), name="promo-landing"),
    path("retail/", RetailBookingView.as_view(), name="retail"),
    path("booking_flight/", SaveBookingView.as_view(), name="book"),
    path("check-flights/", CheckFlightsView.as_view(), name="check-flights"),
    path("check-promo/", CheckPromoView.as_view(), name="check-promo"),
    path("emails/<str:booking_id>", booking_success, name="email"),
    # subscriptions
    path("subscriptions/", include("apps.subscriptions.urls")),
    # payments
    path("pay/", include("apps.payments.urls")),
    path("sign-in/", SignInView.as_view(), name="sign-in"),
    path("sign-up/", SignUpView.as_view(), name="sign-up"),
    path("get-started/", WizardView.as_view(), name="wizard"),
    path("sitemap.xml", SiteMapView.as_view(), name="sitemap"),
    path("robots.txt", RobotsTxtView.as_view(), name="robots"),
    path(
        "maintenance/",
        TemplateView.as_view(template_name="503.html"),
        name="maintenance",
    ),
    path(
        "savings-explained/", SavingsExplainedView.as_view(), name="savings-explained"
    ),
    re_path("^api/", include(router.urls)),
    re_path("^api/", include(user_router.urls)),
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
