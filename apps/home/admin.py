from django.contrib import admin

from apps.home.models import PromoInfo


class PromoAdmin(admin.ModelAdmin):
    list_display = ['dt_entered', 'email', 'instagram']
    search_fields = ['email', 'instagram']

# Register your models here.
admin.site.register(PromoInfo, PromoAdmin)
