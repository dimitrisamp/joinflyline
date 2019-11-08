from django.urls import path
from apps.account.views import AccountView, save_card, sub_user

urlpatterns = [
    path('accounts', AccountView.as_view(), name="accounts"),
    path('save-card', save_card, name="save-card"),
    path('subscribe', sub_user, name="subscribe")
]
