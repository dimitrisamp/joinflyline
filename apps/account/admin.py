from django.contrib import admin
from apps.account.models import Account


class AccountAdmin(admin.ModelAdmin):
    list_display = ('card_number', 'cvc', 'expiry', 'brand', 'last4', 'stripe_id', 'token',)
    list_display_links = ('card_number',)
    search_fields = ('country', 'brand')


admin.site.register(Account, AccountAdmin)



