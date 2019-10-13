from django.contrib import admin
from apps.results.models import SearchDetails
# Register your models here.


class SearchDetailsAdmin(admin.ModelAdmin):

    list_display = ('user', 'fly_from', 'fly_to', 'date_from', 'return_from', 'return_to', 'flight_type', 'adults',
                    'infants', 'max_stopovers', 'stopover_from', 'stopover_to')
    list_display_links = 'user',
    search_fields = ('fly_from', 'fly_to')


admin.site.register(SearchDetails, SearchDetailsAdmin)
