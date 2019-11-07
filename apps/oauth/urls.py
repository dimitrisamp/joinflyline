from django.urls import path
from apps.oauth.views import login_user, create_user, ForgotPasswordView, logout_view

urlpatterns = [
    path('login', login_user, name="login"),
    path('signup', create_user, name="signup"),
    path('logout', logout_view, name="logout"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
]
