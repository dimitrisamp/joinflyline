from django.urls import path
from apps.oauth.views import login_user, create_user, password_reset_email, logout_view

urlpatterns = [
    path('login', login_user, name="login"),
    path('signup', create_user, name="signup"),
    path('logout', logout_view, name="logout"),
    path('password_reset_email', password_reset_email, name="password_reset_email"),
]
