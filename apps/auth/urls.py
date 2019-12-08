from django.urls import path
from apps.auth.views import login_user, create_user, ForgotPasswordView, logout_view, \
    check_user_view

urlpatterns = [
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("check-user/", check_user_view, name="check-user"),
]
