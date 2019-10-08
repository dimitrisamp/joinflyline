from django.contrib import admin
from account.models import Account, Profile
from payments.models import Payments


class InlineSubscription(admin.TabularInline):
    model = Payments
    extra = 1
    max_num = 3


class AccountAdmin(admin.ModelAdmin):
    inlines = [InlineSubscription]
    list_display = ('user', 'card_number', 'cvc', 'expiry', 'country', 'zip', 'brand', 'last4', 'stripe_id', 'token',)
    list_display_links = ('user', 'card_number')
    search_fields = ('country', 'brand')


class ProfileAdmin(admin.ModelAdmin):

    list_display = ('user', 'title', 'market', 'gender', 'phone_number', 'dob',  'customer_id')
    list_display_links = ('user', 'title')
    search_fields = ('title', 'market')
    list_per_page = 25


admin.site.register(Account, AccountAdmin)

admin.site.register(Profile, ProfileAdmin)


