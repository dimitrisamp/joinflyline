from django.urls import path
from apps.account.views import AccountView, FrequentFlyerEdit

urlpatterns = [
    path('accounts', AccountView.as_view(), name="accounts"),
    path('frequent-flyer', FrequentFlyerEdit.as_view(), name="frequent-flyer"),
]
