from django.urls import path
from account.views import account_view, update_profile, save_card

urlpatterns = [
    path('accounts/<int:user_id>', account_view, name="accounts"),
    path('profile/<int:user_id>', update_profile, name="profile"),
    path('save-card/<int:user_id>', save_card, name="save-card")
]
