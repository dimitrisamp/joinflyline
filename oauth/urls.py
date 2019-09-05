from django.urls import path
from oauth.views import login_user, create_user, forgot_password

urlpatterns = [
    path('login', login_user, name="login"),
    path('signup', create_user, name="signup"),
    path('forgot_password', forgot_password, name="forgot_password"),
]
