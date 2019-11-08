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

from django.contrib import admin
from django.contrib.staticfiles.urls import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.http import HttpResponse
from django.urls import path, include
from django.views import View

from apps.booking.views import (
    retail_booking_view,
    CheckFlightsView,
    SaveBookingView,
    CheckPromoView,
)
from apps.emails.views import booking_success
from apps.home.views import index_view, home_view, SignInView, SignUpView, \
    PromoLandingView
from apps.account.views import WizardView
from apps.results.views import CityAutocomplete, ResultsView
from django.conf import settings

class SiteMapView(View):
    def get(self, request, *args, **kwargs):
        return HttpResponse(
            open(settings.SITEMAP_FILE).read(), content_type="application/xml"
        )

class RobotsTxtView(View):
    def get(self, request, *args, **kwargs):
        return HttpResponse(
            open(settings.ROBOTS_TXT).read(), content_type="text/plain"
        )

urlpatterns = [
    path("admin/", admin.site.urls),
    # site under construction
    # path('', under_construction, name="construction"),
    # Home page links
    path("", index_view, name="index"),
    path("home/", home_view, name="home"),
    # Results page urls
    path("results", ResultsView.as_view(), name="results"),
    # Accounts page urls
    path("account/", include("apps.account.urls")),
    # Corporate urls
    path("corporates/", include("apps.corporate.urls")),
    # Auth urls
    path("auth/", include("apps.oauth.urls")),
    # Information about Wanderift
    path("info/", include("apps.info.urls")),
    # booking
    path("promo/", PromoLandingView.as_view(), name="promo-landing"),
    path("retail/", retail_booking_view, name="retail"),
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
    path("city/query", CityAutocomplete.as_view(), name="city-query"),
    path("sitemap.xml", SiteMapView.as_view(), name="sitemap"),
    path("robots.txt", RobotsTxtView.as_view(), name="robots"),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns = [
        path('__debug__/', include(debug_toolbar.urls))
    ] + urlpatterns
