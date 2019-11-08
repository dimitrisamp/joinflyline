from django.urls import path
from apps.account.views import AccountView, FrequentFlyerEdit, save_card, sub_user

urlpatterns = [
    path('accounts', AccountView.as_view(), name="accounts"),
    path('frequent-flyer', FrequentFlyerEdit.as_view(), name="frequent-flyer"),
    path('save-card', save_card, name="save-card"),
    path('subscribe', sub_user, name="subscribe")
]
