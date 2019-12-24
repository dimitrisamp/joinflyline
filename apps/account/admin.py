from django.contrib import admin
from apps.account.models import Account


class AccountAdmin(admin.ModelAdmin):
    list_display = ('brand', 'last4', 'stripe_id', 'token',)


admin.site.register(Account, AccountAdmin)



