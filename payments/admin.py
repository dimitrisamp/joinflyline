from django.contrib import admin
from payments.models import Payments, Plans


class PaymentsAdmin(admin.ModelAdmin):

    list_display = ('user', 'account', 'subscription', 'status', 'plan_id', 'amount')
    list_display_links = ('subscription', 'user')
    search_fields = ('subscription', 'user')
    list_per_page = 25


class PlansAdmin(admin.ModelAdmin):

    list_display = ('plan_id', 'active', 'amount', 'currency', 'name', 'product')
    list_display_links = 'plan_id',
    search_fields = ('plan_id', 'name', 'product')
    list_per_page = 25


admin.site.register(Payments, PaymentsAdmin)

admin.site.register(Plans, PlansAdmin)
