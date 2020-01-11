from django.contrib import admin
from . import models as M


class CallbackRequestAdmin(admin.ModelAdmin):
    list_display = ["timestamp", "trigger"]


admin.site.register(M.CallbackRequest, CallbackRequestAdmin)
