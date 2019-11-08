from django.contrib import admin
from apps.subscriptions.models import Subscriptions
from django.db.models import Sum, Count
from apps.payments.models import Payments

from . import models


class InlineSubscription(admin.TabularInline):
    model = Payments
    extra = 1
    max_num = 3


class SubscriptionsAdmin(admin.ModelAdmin):
    inlines = [InlineSubscription]
    list_display = ("user", "plan")
    list_display_links = ("plan", "user")
    search_fields = ["plan"]
    list_per_page = 25


@admin.register(models.SubscriptionsSummary)
class SubscriptionsSummaryAdmin(admin.ModelAdmin):
    def changelist_view(self, request, extra_context=None):
        response = super().changelist_view(request, extra_context=extra_context)
        try:
            qs = response.context_data["cl"].queryset
        except (AttributeError, KeyError):
            return response

        metrics = {"total": Count("plan"), "total_payment": Sum("price")}
        response.context_data["summary"] = list(
            qs.values("plan").annotate(**metrics).order_by("-total_payment")
        )
        response.context_data["summary_total"] = dict(qs.aggregate(**metrics))
        return response

    change_list_template = "admin/subscription_summary_change_list.html"


admin.site.register(Subscriptions, SubscriptionsAdmin)
