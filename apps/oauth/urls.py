from django.urls import path
from apps.oauth.views import login_user, create_user, ForgotPasswordView, logout_view, \
    check_user_view, UserInfoView

urlpatterns = [
    path('login', login_user, name="login"),
    path('signup', create_user, name="signup"),
    path('logout', logout_view, name="logout"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("check-user/", check_user_view, name="check-user"),
    path("user-info/", UserInfoView.as_view(), name="user-info"),
]
