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
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import path

from account.views import account_view, update_profile, save_card
from corporate.views import corporate_view, trips_view, manage_trips_view
from home.views import home_view
from results.views import results_view
from oauth.views import login_user, create_user, forgot_password
from info.views import news_view, about_view, feedback_view, team_view, partners_view, how_it_works_view, faq_view

urlpatterns = [
    path('admin/', admin.site.urls),

    # Home page links
    path('', home_view, name="home"),

    # Results page urls
    path('results', results_view, name="results"),

    # Accounts page urls
    path('accounts/<int:user_id>', account_view, name="accounts"),
    path('profile/<int:user_id>', update_profile, name="profile"),
    path('save-card/<int:user_id>', save_card, name="save-card"),

    # Corporate urls
    path('corporate', corporate_view, name="corporate"),
    path('corporate-trips', trips_view, name="trips"),
    path('manage_corporate-trips', manage_trips_view, name="manage-trips"),

    # Auth urls
    path('login', login_user, name="login"),
    path('signup', create_user, name="signup"),
    path('forgot_password', forgot_password, name="forgot_password"),

    # Information about Wanderift
    path('news', news_view, name="news"),
    path('about', about_view, name="about"),
    path('feedback', feedback_view, name="feedback"),
    path('team', team_view, name="team"),
    path('partners', partners_view, name="partners"),
    path('how-it-works', how_it_works_view, name="how-it-works"),
    path('faq', faq_view, name="faq")

]
urlpatterns += staticfiles_urlpatterns()
