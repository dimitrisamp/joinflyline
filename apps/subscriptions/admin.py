from django.contrib import admin
from apps.subscriptions.models import Subscriptions


class SubscriptionsAdmin(admin.ModelAdmin):
    list_display = ("user", "plan")
    list_display_links = ("plan", "user")
    search_fields = ["plan"]
    list_per_page = 25


admin.site.register(Subscriptions, SubscriptionsAdmin)
