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
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.contrib import admin
from django.urls import path, include
from home.views import home_view
from faq.views import faq_view
from results.views import results_view
from account.views import account_view
from corporate.views import corporate_view, trips_view, manage_trips_view

urlpatterns = [
    path('admin/', admin.site.urls),

    # Home page links
    path('', home_view, name="home"),

    # Results page urls
    path('results', results_view, name="results"),

    # Accounts page urls
    path('accounts', account_view, name="accounts"),

    # Corporate urls
    path('corporate', corporate_view, name="corporate"),
    path('corporate-trips', trips_view, name="trips"),
    path('manage_corporate-trips', manage_trips_view, name="manage-trips"),

    # Faq urls
    path('faq', faq_view, name="faq")

]
urlpatterns += staticfiles_urlpatterns()
