from django import template
from django.utils import dateparse

register = template.Library()


def iso_date(value):
    return dateparse.parse_datetime(value)


register.filter('iso_date', iso_date)
